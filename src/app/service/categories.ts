import { PackageInfo } from '@/app/types/categories';
import { notFound } from 'next/navigation';
import { request } from './request';

async function getCategories(): Promise<{ categories: string[] }> {
  // const categories = await readCategoriesName();
  const res = await request.get('/realtime-data/index.json');

  return { categories: Object.keys(res.data) };
}

async function getCategory(slug: string): Promise<{ data: PackageInfo[] }> {
  try {
    // const res = await readCategoryDetail(slug);
    const res = await request.get(`/realtime-data/${slug}.json`);
    return {
      data: res.data,
    };
  } catch {
    notFound();
  }
}

export { getCategories, getCategory };
