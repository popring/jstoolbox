'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStarChart } from '@/components/page/categoriesV2';
import { ViewToggle } from '@/app/categories/[slug]/ViewToggle';
import { usePreferences } from '@/hooks/usePreferences';
import { sortPackages, sortGroupedPackages } from '@/lib/sort';
import { getValueBySortField, getChartTitle } from '@/lib/chartUtils';
import { PackageInfo, GroupedPackageInfo } from '@/app/types/categories';

interface CategoryContentProps {
  groupedPackages: GroupedPackageInfo[];
  packageInfoList: PackageInfo[];
  categorySlug?: string;
}

export function CategoryContent({
  groupedPackages,
  packageInfoList,
  categorySlug
}: CategoryContentProps) {
  const { preferences } = usePreferences();

  // 根据当前排序偏好动态生成图表数据
  const chartData = useMemo(() => {
    const sortedData = preferences.viewMode === 'grouped' 
      ? sortGroupedPackages(groupedPackages, preferences.sortField, preferences.sortDirection)
      : sortPackages(packageInfoList, preferences.sortField, preferences.sortDirection);
      
    // 取前5个数据用于图表
    const top5Data = sortedData.slice(0, 5);
    
    return top5Data.map((item) => ({
      packageName: preferences.viewMode === 'grouped' 
        ? ('repositoryName' in item ? item.repositoryName : 'Unknown')
        : ('name' in item ? item.name : 'Unknown'),
      value: getValueBySortField(item, preferences.sortField),
      field: preferences.sortField
    }));
  }, [groupedPackages, packageInfoList, preferences]);

  // 获取动态图表标题
  const chartTitle = getChartTitle(preferences.sortField, categorySlug);

  return (
    <>
      {/* Enhanced chart card with better styling */}
      <Card className='bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800 rounded-xl p-4 md:p-8 backdrop-blur-sm shadow-lg shadow-black/20 hover:border-yellow-900/50 transition-all duration-300'>
        <h2 className='text-xl md:text-2xl font-semibold text-zinc-100 mb-3'>
          {chartTitle}
        </h2>
        <p className='text-zinc-400 mb-6 text-sm md:text-base'>
          Compare the most popular options to find the right tool for
          your project
        </p>
        <div className='h-[250px] md:h-[400px] w-full'>
          <SimpleStarChart 
            chartData={chartData} 
            sortField={preferences.sortField}
          />
        </div>
      </Card>

      {/* View Toggle and Package List */}
      <ViewToggle 
        groupedPackages={groupedPackages}
        packageInfoList={packageInfoList}
      />
    </>
  );
} 