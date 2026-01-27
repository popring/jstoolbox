import { PackageInfo } from '@/app/types/categories';

// 客户端安全的 API 调用
export async function fetchCategories(): Promise<{ categories: string[] }> {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    // 返回备用分类
    return {
      categories: [
        'ui-library',
        'build-tools',
        'testing',
        'state-management',
        'data-fetching',
        'utilities',
        'animation',
        'css',
        'icon',
        'image',
        'editor',
        'dev-tools',
        'form-handling',
        'graphics'
      ]
    };
  }
}

export async function fetchCategoryPackages(slug: string): Promise<{ data: PackageInfo[] }> {
  try {
    const response = await fetch(`/api/categories/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch category ${slug}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return { data: [] };
  }
}

// 批量获取多个分类的包（用于搜索索引）
export async function fetchPackagesForSearch(limit = 5): Promise<PackageInfo[]> {
  try {
    const { categories } = await fetchCategories();
    const allPackages: PackageInfo[] = [];

    // 只取前几个分类的数据以提升性能
    const categoriesToFetch = categories.slice(0, limit);

    await Promise.all(
      categoriesToFetch.map(async (category) => {
        try {
          const { data } = await fetchCategoryPackages(category);
          // 每个分类只取前20个包
          allPackages.push(...data.slice(0, 20));
        } catch (error) {
          console.warn(`Failed to load category ${category}:`, error);
        }
      })
    );

    return allPackages;
  } catch (error) {
    console.error('Error loading packages for search:', error);
    return [];
  }
}