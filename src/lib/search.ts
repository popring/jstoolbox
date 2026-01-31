import Fuse, { type IFuseOptions } from 'fuse.js';
import { PackageInfo } from '@/app/types/categories';

// 搜索配置
const fuseOptions: IFuseOptions<PackageInfo> = {
  keys: [
    {
      name: 'name',
      weight: 0.4
    },
    {
      name: 'description',
      weight: 0.3
    },
    {
      name: 'npm.name',
      weight: 0.2
    },
    {
      name: 'github.url',
      weight: 0.1
    }
  ],
  threshold: 0.3, // 模糊匹配阈值
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
  findAllMatches: true,
  ignoreLocation: true,
  useExtendedSearch: true,
};

// 搜索索引缓存
let searchIndex: Fuse<PackageInfo> | null = null;

// 初始化搜索索引
export const initSearchIndex = (packages: PackageInfo[]) => {
  if (packages.length === 0) return;

  // 创建 Fuse 实例
  searchIndex = new Fuse(packages, fuseOptions);

  console.log(`Search index initialized with ${packages.length} packages`);
};

// 搜索函数
export const searchPackages = (
  query: string,
  options?: {
    limit?: number;
    category?: string;
  }
): PackageInfo[] => {
  if (!searchIndex) {
    console.warn('Search index not initialized');
    return [];
  }

  if (!query || query.trim().length < 2) {
    return [];
  }

  // 执行搜索
  let results = searchIndex.search(query.trim());

  // 应用过滤器
  if (options?.category) {
    results = results.filter(result =>
      // 这里需要根据实际数据结构调整判断逻辑
      result.item.name.includes(options.category!) ||
      result.item.description?.toLowerCase().includes(options.category!.toLowerCase())
    );
  }

  // 限制结果数量
  if (options?.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  // 返回匹配的包
  return results.map(result => result.item);
};

// 获取搜索建议
export const getSearchSuggestions = (
  query: string,
  packages: PackageInfo[],
  limit: number = 5
): string[] => {
  if (!query || query.trim().length < 1) return [];

  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();

  // 从包名中查找匹配
  packages.forEach(pkg => {
    if (pkg.name.toLowerCase().startsWith(lowerQuery)) {
      suggestions.add(pkg.name);
    }
  });

  // 如果建议不够，从描述中查找
  if (suggestions.size < limit) {
    packages.forEach(pkg => {
      const words = pkg.description?.toLowerCase().split(' ') || [];
      words.forEach(word => {
        if (word.startsWith(lowerQuery) && suggestions.size < limit) {
          suggestions.add(pkg.name);
        }
      });
    });
  }

  return Array.from(suggestions).slice(0, limit);
};