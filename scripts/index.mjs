import axios from 'axios';
import fs from 'fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SOURCE_DIR = join(__dirname, '../source/')

// 定义接口
class PackageInfo {
  constructor(id, name, description, npm, github, website) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.npm = npm;
    this.github = github;
    this.website = website;
  }
}

class Npm {
  constructor(
    name,
    url,
    downloads,
    firstReleased,
    lastReleased,
    website,
    description
  ) {
    this.name = name;
    this.url = url;
    this.downloads = downloads;
    this.firstReleased = firstReleased;
    this.lastReleased = lastReleased;
    this.website = website;
    this.description = description;
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

// 记录日志
const logError = async (message) => {
  const logPath = join(__dirname, 'error.log');
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  await fs.appendFile(logPath, logMessage);
};

// 爬取 NPM 数据并获取 GitHub 仓库 URL
const fetchNpmData = async (packageName) => {
  try {
    const npmUrl = `https://registry.npmjs.org/${packageName}`;
    const response = await axios.get(npmUrl);
    const data = response.data;

    const { name, description, homepage, repository } = data;
    let githubUrl;
    const match =
      (repository.url || '').match(
        /(?<=git[+\w]*:\/\/(?:[^/]+\/)?)(.*?)(?=\.git)/
      )?.[0] || '';
    if (match.includes('github.com') && match) {
      githubUrl = match;
    }
    if (homepage.includes('github.com')) {
      githubUrl = homepage;
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
        lastReleased,
        homepage,
        description
      ),
      githubUrl,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch NPM data for ${packageName}: ${error.message}`
    );
  }
};

// 获取 NPM 下载量
const fetchNpmDownloads = async (packageName) => {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;
    const response = await axios.get(url);
    return response.data.downloads || 0;
  } catch (e) {
    console.error('获取 NPM 下载量失败:', e.message);
  }
};

// 爬取 GitHub 数据
const fetchGithubData = async (githubUrl = '') => {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub Token 未配置，请在环境变量中设置 GITHUB_TOKEN');
    }

    const Authorization = `Bearer ${GITHUB_TOKEN}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, owner, repoName] =
      githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
    if (!owner || !repoName) throw new Error(`无效的 GitHub URL: ${githubUrl}`);

    const repoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
    const issuesUrl = `${repoUrl}/issues?state=all`;

    const repoResponse = await axios.get(repoUrl, {
      headers: { Authorization },
    });
    const issuesResponse = await axios.get(issuesUrl, {
      headers: { Authorization },
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

// 汇总数据
const fetchPackageInfo = async (packageName, id) => {
  const { npm, githubUrl } = await fetchNpmData(packageName);
  const githubData = await fetchGithubData(githubUrl);

  return new PackageInfo(
    id,
    packageName,
    npm.description,
    npm,
    githubData,
    npm.website
  );
};

// 爬取多个包信息
const fetchMultiplePackages = async (packages) => {
  let errors = 0;
  const results = [];

  for (let i = 0; i < packages.length; i++) {
    const packageName = packages[i];
    console.log(`开始爬取：${packageName} (${i + 1}/${packages.length})`);

    try {
      const packageInfo = await fetchPackageInfo(packageName, i + 1);
      results.push(packageInfo);
      console.log(`爬取成功：${packageName}`);
    } catch (error) {
      errors++;
      console.error(`爬取失败：${packageName} - ${error.message}`);
      await logError(`爬取失败：${packageName} - ${error.message}`);

      if (errors >= 10) {
        console.error('错误次数超过 10 次，停止爬取！');
        break;
      }
    }

    const progress = Math.round(((i + 1) / packages.length) * 100);
    console.log(`爬取进度：${progress}%`);
  }

  return results;
};

// 读取要爬取的包信息
const readPackagesFromJson = async () => {
  const files = await fs.readdir(SOURCE_DIR);
  const map = {};
  for (const file of files) {
    const pkgJSON = await fs.readFile(
      join(SOURCE_DIR, file),
      'utf-8'
    );
    const pkgData = JSON.parse(pkgJSON);
    map[pkgData.name] = pkgData.packages;
  }
  return map;
};

// 保存数据
const saveDataToLocal = async (pkgName, data) => {
  try {
    await fs.writeFile(
      join(__dirname, `../realtime-data/${pkgName}.json`),
      JSON.stringify(data, null, 2)
    );
    console.log('数据已保存到 packageData.json');
  } catch (error) {
    console.error('保存数据失败:', error.message);
  }
};

// 主函数
const main = async () => {
  const mapJson = await readPackagesFromJson();
  for (const [packageName, packages] of Object.entries(mapJson)) {
    const packageInfos = await fetchMultiplePackages(packages);
    await saveDataToLocal(packageName, packageInfos);
  }
};

main().catch((error) => console.error('程序运行出错:', error.message));
