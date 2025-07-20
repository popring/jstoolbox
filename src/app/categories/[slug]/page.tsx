import React, { use } from 'react';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { getCategory, groupPackagesByRepository } from '@/app/service/categories';
import { CategoryContent } from '@/app/categories/[slug]/CategoryContent';
import { notFound } from 'next/navigation';
import { getCategoriesNames } from '@/lib/fs';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all available categories
export async function generateStaticParams() {
  try {
    // 使用本地文件读取获取分类列表
    const categories = getCategoriesNames();
    return categories.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback to known categories if file reading fails
    const fallbackCategories = [
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
    return fallbackCategories.map((slug) => ({
      slug,
    }));
  }
}

export default function CategoryPage(props: Props) {
  const params = use(props.params);
  
  // Validate slug - we'll validate against actual categories later
  const validSlugs = [
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
  if (!validSlugs.includes(params.slug)) {
    notFound();
  }

  // Move use call outside of try/catch to avoid Suspense Exception
  const res = use(getCategory(params.slug));
  
  // Handle the case where data might be undefined
  if (!res?.data) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center'>
        <div className='text-center p-8'>
          <h1 className='text-2xl font-bold text-yellow-400 mb-4'>
            No data available
          </h1>
          <p className='text-zinc-400 mb-6'>
            No packages found for this category.
          </p>
        </div>
      </div>
    );
  }

  const packageInfoList = (res.data || [])?.sort((a, b) => {
    return (b?.github?.stars || 0) - (a?.github?.stars || 0);
  });

  // 分组包信息
  const groupedPackages = groupPackagesByRepository(packageInfoList);

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900'>
      <div className='relative'>
        {/* Enhanced background decorations */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -top-24 md:-top-48 -right-12 md:-right-24 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse' />
          <div className='absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -bottom-24 md:-bottom-48 -left-12 md:-left-24 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse' />
        </div>

        <div className='relative flex flex-col justify-end items-center pt-20 md:pt-24 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-5 duration-500'>
          {/* Enhanced title with more dramatic gradient */}
          <TypographyH3 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 bg-clip-text text-transparent bg-size-300 animate-gradient text-center mb-2'>
            {params?.slug || 'Category'}
          </TypographyH3>
          <TypographyP className='text-zinc-400 mt-2 text-sm md:text-base text-center max-w-2xl'>
            Explore the most popular {params?.slug || 'libraries'} and tools
            to create stunning web experiences
          </TypographyP>

          {/* 统一的内容容器 */}
          <div className='mt-8 md:mt-12 w-full max-w-[1200px] flex flex-col gap-6 md:gap-8 pb-12'>
            {/* 将交互逻辑移到客户端组件 */}
            <CategoryContent 
              groupedPackages={groupedPackages}
              packageInfoList={packageInfoList}
              categorySlug={params?.slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
