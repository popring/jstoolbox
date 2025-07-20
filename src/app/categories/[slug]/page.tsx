import React, { use } from 'react';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { getCategory, groupPackagesByRepository } from '@/app/service/categories';
import { Card } from '@/components/ui/card';
import { SimpleStarChart } from '@/components/page/categoriesV2';
import { ViewToggle } from '@/app/categories/[slug]/ViewToggle';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage(props: Props) {
  const params = use(props.params);
  const res = use(getCategory(params.slug));

  try {
    const packageInfoList = (res?.data || [])?.sort((a, b) => {
      return (b?.github?.stars || 0) - (a?.github?.stars || 0);
    });

    // 分组包信息
    const groupedPackages = groupPackagesByRepository(packageInfoList);

    // 为图表准备数据（使用分组后的数据）
    const chartData = groupedPackages.slice(0, 5).map((group) => ({
      packageName: group.repositoryName,
      star: group.repositoryStars,
    }));

    return (
      <div className='min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900'>
        <div className='relative'>
          {/* Enhanced background decorations */}
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -top-24 md:-top-48 -right-12 md:-right-24 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse' />
            <div className='absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -bottom-24 md:-bottom-48 -left-12 md:-left-24 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse' />
          </div>

          <div className='relative flex flex-col justify-end items-center pt-12 md:pt-16 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-5 duration-500'>
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
              {/* Enhanced chart card with better styling */}
              <Card className='bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800 rounded-xl p-4 md:p-8 backdrop-blur-sm shadow-lg shadow-black/20 hover:border-yellow-900/50 transition-all duration-300'>
                <h2 className='text-xl md:text-2xl font-semibold text-zinc-100 mb-3'>
                  Top {params?.slug || 'Libraries'} by GitHub Stars
                </h2>
                <p className='text-zinc-400 mb-6 text-sm md:text-base'>
                  Compare the most popular options to find the right tool for
                  your project
                </p>
                <div className='h-[250px] md:h-[400px] w-full'>
                  <SimpleStarChart chartData={chartData} />
                </div>
              </Card>

              {/* View Toggle and Package List - 现在在同一个容器内 */}
              <ViewToggle 
                groupedPackages={groupedPackages}
                packageInfoList={packageInfoList}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error(error);
    // Fallback UI in case of error
    return (
      <div className='min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center'>
        <div className='text-center p-8'>
          <h1 className='text-2xl font-bold text-yellow-400 mb-4'>
            Something went wrong
          </h1>
          <p className='text-zinc-400 mb-6'>
            We&apos;re having trouble loading this page. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
