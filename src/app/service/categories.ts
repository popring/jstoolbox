import { PackageInfo } from '@/app/types/categories';
import { readCategoriesName, readCategoryDetail } from '@/lib/fs';
import { notFound } from 'next/navigation';

async function getCategories(): Promise<{ categories: string[] }> {
  const categories = await readCategoriesName();
  return { categories };
}

async function getCategory(slug: string): Promise<{ data: PackageInfo[] }> {
  try {
    const res = await readCategoryDetail(slug);
    return {
      data: res,
    };
  } catch {
    notFound();
  }
}

export { getCategories, getCategory };
