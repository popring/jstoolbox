import { NextResponse } from 'next/server';
import { getCategory } from '../../../service/categories';

// GET /api/categories/[slug] - 获取特定分类的包
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    const { data } = await getCategory(slug);
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`API Error for category ${slug}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch category ${slug}` },
      { status: 404 }
    );
  }
}