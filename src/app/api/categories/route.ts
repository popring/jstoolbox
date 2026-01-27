import { NextResponse } from 'next/server';
import { getCategories, getCategory } from '../../service/categories';

// GET /api/categories - 获取所有分类
export async function GET() {
  try {
    const { categories } = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}