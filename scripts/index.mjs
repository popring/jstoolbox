import axios from 'axios';
import fs from 'fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { Octokit } from 'octokit';
import { merge } from 'lodash-es';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SOURCE_DIR = join(__dirname, '../public/source/');
const DIST_DIR = join(__dirname, '../public/realtime-data/');
const CACHE_DIR = join(__dirname, '../.cache/');

// 配置常量
const CONCURRENT_LIMIT = 5; // 并发限制
const RETRY_ATTEMPTS = 3; // 重试次数
const RETRY_DELAY = 1000; // 重试延迟（毫秒）

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

// 工具函数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logError = async (message) => {
  const logPath = join(__dirname, 'error.log');
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  await fs.appendFile(logPath, logMessage);
};

// 带重试的请求函数
const fetchWithRetry = async (fetchFn, retries = RETRY_ATTEMPTS) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} after error: ${error.message}`);
      await sleep(RETRY_DELAY * (i + 1)); // 指数退避
    }
  }
};

// 并发控制函数
const runWithConcurrencyLimit = async (tasks, limit = CONCURRENT_LIMIT) => {
  const results = [];
  const running = new Set();

  for (const task of tasks) {
    if (running.size >= limit) {
      await Promise.race(running);
    }

    const promise = task().finally(() => running.delete(promise));
    running.add(promise);
    results.push(promise);
  }

  return Promise.all(results);
};

// 缓存管理
const sanitizeCacheKey = (key) => {
  // 将特殊字符替换为安全的字符
  return key
    .replace(/[^a-zA-Z0-9-]/g, '-') // 替换所有非字母数字连字符的字符
    .replace(/-+/g, '-') // 将多个连字符替换为单个
    .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符
};

const getCachePath = (key) => join(CACHE_DIR, `${sanitizeCacheKey(key)}.json`);

const readCache = async (key) => {
  try {
    const cachePath = getCachePath(key);
    const data = await fs.readFile(cachePath, 'utf-8');
    const cached = JSON.parse(data);
    
    // 检查缓存是否过期（24小时）
    const cacheAge = Date.now() - cached.timestamp;
    if (cacheAge < 24 * 60 * 60 * 1000) {
      return cached.data;
    }
  } catch {
    // 缓存不存在或已过期
  }
  return null;
};

const writeCache = async (key, data) => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cachePath = getCachePath(key);
    const cacheData = {
      timestamp: Date.now(),
      data
    };
    await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.warn(`Failed to write cache for ${key}:`, error.message);
  }
};

const fetchNpmData = async (packageName) => {
  try {
    // 检查缓存
    const cacheKey = `npm-${packageName}`;
    const cached = await readCache(cacheKey);
    if (cached) {
      return cached;
    }

    const npmUrl = `https://registry.npmjs.org/${packageName}`;
    const response = await fetchWithRetry(() => axios.get(npmUrl));
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

    const result = {
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

    // 写入缓存
    await writeCache(cacheKey, result);
    return result;
  } catch (error) {
    throw new Error(
      `Failed to fetch NPM data for ${packageName}: ${error.message}`
    );
  }
};

const fetchNpmDownloads = async (packageName) => {
  try {
    const url = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;
    const response = await fetchWithRetry(() => axios.get(url));
    return response.data.downloads || 0;
  } catch (error) {
    console.error(`Failed to fetch NPM downloads for ${packageName}:`, error.message);
    return 0; // 返回 0 而不是 undefined
  }
};

// 优化的 GitHub 数据获取函数
const fetchGithubData = async (githubUrl = '') => {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error(
        'GitHub Token is not configured. Please set GITHUB_TOKEN in the environment variables.'
      );
    }

    if (!githubUrl) {
      return new Github('', 0, 0, 0);
    }

    // 检查缓存
    const cacheKey = `github-${githubUrl}`;
    const cached = await readCache(cacheKey);
    if (cached) {
      return cached;
    }

    const [, owner, repoName] =
      githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
    if (!owner || !repoName)
      throw new Error(`Invalid GitHub URL: ${githubUrl}`);

    // 并行获取仓库信息和 issues 统计
    const [repoResponse, issuesResponse] = await Promise.all([
      fetchWithRetry(() => octokit.rest.repos.get({ owner, repo: repoName })),
      fetchWithRetry(() => octokit.rest.issues.list({
        owner,
        repo: repoName,
        state: 'all',
        per_page: 100, // 限制获取数量以提高性能
      }))
    ]);

    const stars = repoResponse.data.stargazers_count;
    const issuesTotal = repoResponse.data.open_issues_count;
    const issuesResolved = issuesResponse.data.filter(
      (issue) => issue.state === 'closed'
    ).length;

    const result = new Github(githubUrl, stars, issuesTotal, issuesResolved);
    
    // 写入缓存
    await writeCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Failed to fetch GitHub data for ${githubUrl}:`, error.message);
    // 返回默认值而不是抛出错误，避免整个流程中断
    return new Github(githubUrl, 0, 0, 0);
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

  // 创建任务数组
  const tasks = packages.map((packageName, index) => async () => {
    console.log(`Start fetching: ${packageName} (${index + 1}/${packages.length})`);

    try {
      const packageInfo = await fetchPackageInfo(packageName, index + 1);
      console.log(`Fetch successful: ${packageName}`);
      return { success: true, data: packageInfo };
    } catch (error) {
      errors++;
      console.error(`Fetch failed: ${packageName} - ${error.message}`);
      await logError(`Fetch failed: ${packageName} - ${error.message}`);
      return { success: false, error: error.message };
    }
  });

  // 使用并发控制执行任务
  const taskResults = await runWithConcurrencyLimit(tasks);

  // 处理结果
  for (const result of taskResults) {
    if (result.success) {
      results.push(result.data);
    } else if (errors >= 10) {
      console.error('Error count exceeded 10. Stopping fetch process!');
      break;
    }
  }

  const progress = Math.round((results.length / packages.length) * 100);
  console.log(`Fetch progress: ${progress}% (${results.length}/${packages.length})`);

  return results;
};

const readPackagesFromJson = async () => {
  const files = await fs.readdir(SOURCE_DIR);
  const map = {};
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    try {
      const pkgJSON = await fs.readFile(join(SOURCE_DIR, file), 'utf-8');
      const pkgData = JSON.parse(pkgJSON);
      map[pkgData.name] = pkgData.packages;
    } catch (error) {
      console.error(`Failed to read ${file}:`, error.message);
    }
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
  console.log('Starting data fetch process...');
  console.log(`Concurrent limit: ${CONCURRENT_LIMIT}`);
  console.log(`Retry attempts: ${RETRY_ATTEMPTS}`);
  
  const startTime = Date.now();
  
  const mapJson = await readPackagesFromJson();
  const cateMap = {};
  
  for (const [packageName, packages] of Object.entries(mapJson)) {
    console.log(`\nProcessing category: ${packageName} (${packages.length} packages)`);
    const packageInfos = await fetchMultiplePackages(packages);
    await saveDataToLocal(packageName, packageInfos);
    cateMap[packageName] = packageInfos.map((info) => (info.name));
  }
  
  await saveDataToLocal('index', cateMap);
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  console.log(`\nData fetch completed in ${duration} seconds`);
};

main().catch((error) =>
  console.error('Program encountered an error:', error.message)
);
