import { NextResponse } from 'next/server';
import { getCategory } from '../../../service/categories';

// GET /api/categories/[slug] - 获取特定分类的包
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data } = await getCategory(params.slug);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`API Error for category ${params.slug}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch category ${params.slug}` },
      { status: 404 }
    );
  }
}