import { readFileSync } from 'fs';
import { join } from 'path';

// 读取分类索引文件
export function readCategoriesIndex(): Record<string, string[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'realtime-data', 'index.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading categories index:', error);
    // 返回空对象作为备用
    return {};
  }
}

// 读取分类详情文件
export function readCategoryDetail(slug: string): any[] {
  try {
    const filePath = join(process.cwd(), 'public', 'realtime-data', `${slug}.json`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading category ${slug}:`, error);
    // 返回空数组作为备用
    return [];
  }
}

// 获取所有分类名称
export function getCategoriesNames(): string[] {
  try {
    const categoriesIndex = readCategoriesIndex();
    return Object.keys(categoriesIndex);
  } catch (error) {
    console.error('Error getting categories names:', error);
    // 返回已知分类作为备用
    return [
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
    ];
  }
}
