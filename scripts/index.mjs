import axios from 'axios';
import fs from 'fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { Octokit } from 'octokit';
import { merge } from 'lodash-es';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SOURCE_DIR = join(__dirname, './source/');
const DIST_DIR = join(__dirname, './realtime-data/');

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Define interface
class PackageInfo {
  constructor(id, name, npm, github, website, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.npm = npm;
    this.github = github;
    this.website = website;
  }
}

class Npm {
  constructor(name, url, downloads, firstReleased, lastReleased) {
    this.name = name;
    this.url = url;
    this.downloads = downloads;
    this.firstReleased = firstReleased;
    this.lastReleased = lastReleased;
  }
}

class Github {
  constructor(url, stars, issuesTotal, issuesResolved) {
    this.url = url;
    this.stars = stars;
    this.issuesTotal = issuesTotal;
    this.issuesResolved = issuesResolved;
  }
}

const logError = async (message) => {
  const logPath = join(__dirname, 'error.log');
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  await fs.appendFile(logPath, logMessage);
};

const fetchNpmData = async (packageName) => {
  try {
    const npmUrl = `https://registry.npmjs.org/${packageName}`;
    const response = await axios.get(npmUrl);
    const data = response.data;

    const { name, description, homepage, repository = {} } = data;
    let githubUrl;
    if (repository.url?.includes('github.com')) {
      const { groups: { user, repo } = {} } =
        (repository.url || '').match(
          /github\.com[:\/](?<user>.+?)\/(?<repo>.+?)(?=\.git|$)/
        ) || {};

      if (user && repo) {
        githubUrl = `https://github.com/${user}/${repo}`;
      }
    }
    const downloads = await fetchNpmDownloads(packageName);
    const firstReleased = data.time.created;
    const lastReleased = data.time.modified;

    return {
      npm: new Npm(
        name,
        `https://www.npmjs.com/package/${name}`,
        downloads,
        firstReleased,
        lastReleased
      ),
      githubUrl,
      website: homepage,
      description,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch NPM data for ${packageName}: ${error.message}`
    );
  }
};

const fetchNpmDownloads = async (packageName) => {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;
    const response = await axios.get(url);
    return response.data.downloads || 0;
  } catch (e) {
    console.error('Failed to fetch NPM downloads:', e.message);
  }
};

const fetchGithubData = async (githubUrl = '') => {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error(
        'GitHub Token is not configured. Please set GITHUB_TOKEN in the environment variables.'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, owner, repoName] =
      githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
    if (!owner || !repoName)
      throw new Error(`Invalid GitHub URL: ${githubUrl}`);

    const repoResponse = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });
    const issuesResponse = await octokit.rest.issues.list({
      owner,
      repo: repoName,
      state: 'all',
    });

    const stars = repoResponse.data.stargazers_count;
    const issuesTotal = repoResponse.data.open_issues_count;
    const issuesResolved = issuesResponse.data.filter(
      (issue) => issue.state === 'closed'
    ).length;

    return new Github(githubUrl, stars, issuesTotal, issuesResolved);
  } catch (error) {
    throw new Error(`Failed to fetch GitHub data: ${error.message}`);
  }
};

const fetchPackageInfo = async (packageName, id) => {
  const { npm, githubUrl, website, description } = await fetchNpmData(
    packageName
  );
  const githubData = await fetchGithubData(githubUrl);

  return new PackageInfo(
    id,
    packageName,
    npm,
    githubData,
    website,
    description
  );
};

const fetchMultiplePackages = async (packages) => {
  let errors = 0;
  const results = [];

  for (let i = 0; i < packages.length; i++) {
    const packageName = packages[i];
    console.log(`Start fetching: ${packageName} (${i + 1}/${packages.length})`);

    try {
      const packageInfo = await fetchPackageInfo(packageName, i + 1);
      results.push(packageInfo);
      console.log(`Fetch successful: ${packageName}`);
    } catch (error) {
      errors++;
      console.error(`Fetch failed: ${packageName} - ${error.message}`);
      await logError(`Fetch failed: ${packageName} - ${error.message}`);

      if (errors >= 10) {
        console.error('Error count exceeded 10. Stopping fetch process!');
        break;
      }
    }

    const progress = Math.round(((i + 1) / packages.length) * 100);
    console.log(`Fetch progress: ${progress}%`);
  }

  return results;
};

const readPackagesFromJson = async () => {
  const files = await fs.readdir(SOURCE_DIR);
  const map = {};
  for (const file of files) {
    const pkgJSON = await fs.readFile(join(SOURCE_DIR, file), 'utf-8');
    const pkgData = JSON.parse(pkgJSON);
    map[pkgData.name] = pkgData.packages;
  }
  return map;
};

const saveDataToLocal = async (pkgName, data) => {
  try {
    let newData = data;
    const filePath = join(DIST_DIR, `${pkgName}.json`);

    try {
      const origin = await fs.readFile(filePath, 'utf-8');
      if (origin) {
        const originData = JSON.parse(origin);
        newData = merge(originData, data);
      }
    } catch (readError) {
      if (readError.code !== 'ENOENT') {
        throw readError;
      }
    }

    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2));
    console.log(`Data saved to ${filePath}`);
  } catch (error) {
    console.error('Failed to save data:', error.message);
    await logError(`Failed to save data: ${pkgName} - ${error.message}`);
  }
};

const main = async () => {
  const mapJson = await readPackagesFromJson();
  for (const [packageName, packages] of Object.entries(mapJson)) {
    const packageInfos = await fetchMultiplePackages(packages);
    await saveDataToLocal(packageName, packageInfos);
  }
};

main().catch((error) =>
  console.error('Program encountered an error:', error.message)
);
