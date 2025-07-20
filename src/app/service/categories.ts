import { PackageInfo, GroupedPackageInfo } from '@/app/types/categories';
import { notFound } from 'next/navigation';
import { request } from './request';
import { readCategoryDetail, getCategoriesNames } from '@/lib/fs';

// 缓存分组结果
const groupedCache = new Map<string, GroupedPackageInfo[]>();

async function getCategories(): Promise<{ categories: string[] }> {
  // 在服务端使用本地文件读取
  if (typeof window === 'undefined') {
    const categories = getCategoriesNames();
    return { categories };
  }
  
  // 在客户端使用 API 请求（如果需要实时数据）
  try {
    const res = await request.get('/realtime-data/index.json');
    return { categories: Object.keys(res.data) };
  } catch (error) {
    console.error('Error fetching categories from API:', error);
    // 如果 API 失败，回退到本地文件读取
    const categories = getCategoriesNames();
    return { categories };
  }
}

async function getCategory(slug: string): Promise<{ data: PackageInfo[] }> {
  try {
    // 在服务端使用本地文件读取
    if (typeof window === 'undefined') {
      const data = readCategoryDetail(slug);
      return { data };
    }
    
    // 在客户端使用 API 请求
    const res = await request.get(`/realtime-data/${slug}.json`);
    return {
      data: res.data,
    };
  } catch (error) {
    console.error(`Error loading category ${slug}:`, error);
    notFound();
  }
}

// 新增：分组函数（带缓存）
function groupPackagesByRepository(packages: PackageInfo[]): GroupedPackageInfo[] {
  // 创建缓存键
  const cacheKey = packages.map(p => `${p.name}-${p.github?.url}`).join('|');
  
  // 检查缓存
  if (groupedCache.has(cacheKey)) {
    return groupedCache.get(cacheKey)!;
  }

  const groupedMap = new Map<string, GroupedPackageInfo>();

  packages.forEach((pkg) => {
    const githubUrl = pkg.github?.url;
    if (!githubUrl) {
      // 如果没有 GitHub URL，单独作为一个组
      const key = pkg.name;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          repositoryName: pkg.name,
          repositoryUrl: pkg.github?.url || '',
          repositoryStars: pkg.github?.stars || 0,
          repositoryIssuesTotal: pkg.github?.issusTotal || 0,
          repositoryIssuesResolved: pkg.github?.issusResolved || 0,
          website: pkg.website || '',
          packages: [],
          totalDownloads: 0,
          firstReleased: pkg.npm?.firstReleased || '',
          lastReleased: pkg.npm?.lastReleased || '',
        });
      }
      groupedMap.get(key)!.packages.push(pkg);
      groupedMap.get(key)!.totalDownloads += pkg.npm?.downloads || 0;
      return;
    }

    // 从 GitHub URL 提取仓库名称
    const repoName = extractRepositoryName(githubUrl);
    const key = repoName || githubUrl;

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        repositoryName: repoName || 'Unknown Repository',
        repositoryUrl: githubUrl,
        repositoryStars: pkg.github?.stars || 0,
        repositoryIssuesTotal: pkg.github?.issusTotal || 0,
        repositoryIssuesResolved: pkg.github?.issusResolved || 0,
        website: pkg.website || '',
        packages: [],
        totalDownloads: 0,
        firstReleased: pkg.npm?.firstReleased || '',
        lastReleased: pkg.npm?.lastReleased || '',
      });
    }

    const group = groupedMap.get(key)!;
    group.packages.push(pkg);
    group.totalDownloads += pkg.npm?.downloads || 0;

    // 更新最早和最晚发布时间
    if (pkg.npm?.firstReleased) {
      if (!group.firstReleased || new Date(pkg.npm.firstReleased) < new Date(group.firstReleased)) {
        group.firstReleased = pkg.npm.firstReleased;
      }
    }
    if (pkg.npm?.lastReleased) {
      if (!group.lastReleased || new Date(pkg.npm.lastReleased) > new Date(group.lastReleased)) {
        group.lastReleased = pkg.npm.lastReleased;
      }
    }
  });

  // 转换为数组并按总下载量排序
  const result = Array.from(groupedMap.values()).sort((a, b) => b.totalDownloads - a.totalDownloads);
  
  // 缓存结果
  groupedCache.set(cacheKey, result);
  
  return result;
}

// 从 GitHub URL 提取仓库名称
function extractRepositoryName(githubUrl: string): string {
  try {
    const url = new URL(githubUrl);
    if (url.hostname === 'github.com') {
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
    }
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
  }
  return '';
}

export { getCategories, getCategory, groupPackagesByRepository };
