'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Layers } from 'lucide-react';
import { PackageItem } from '@/components/page/categoriesV2';
import { GroupedPackageItem } from '@/components/page/categoriesV2/GroupedPackageItem';
import { GroupedPackageInfo, PackageInfo } from '@/app/types/categories';
import { SortSelector, SortField, SortDirection } from '@/components/page/categoriesV2/SortSelector';
import { SortDirectionToggle } from '@/components/page/categoriesV2/SortDirectionToggle';
import { sortPackages, sortGroupedPackages } from '@/lib/sort';
import { usePreferences } from '@/hooks/usePreferences';

interface ViewToggleProps {
  groupedPackages: GroupedPackageInfo[];
  packageInfoList: PackageInfo[];
}

export function ViewToggle({
  groupedPackages,
  packageInfoList,
}: ViewToggleProps) {
  const { preferences, updatePreferences } = usePreferences();

  // 排序字段处理函数
  const handleFieldChange = (sortField: SortField) => {
    updatePreferences({ sortField });
  };

  // 排序方向处理函数
  const handleDirectionChange = (sortDirection: SortDirection) => {
    updatePreferences({ sortDirection });
  };

  // 视图模式处理函数
  const handleViewModeChange = (viewMode: 'grouped' | 'individual') => {
    updatePreferences({ viewMode });
  };

  // 使用 useMemo 缓存排序结果
  const sortedPackages = useMemo(() => {
    return sortPackages(packageInfoList, preferences.sortField, preferences.sortDirection);
  }, [packageInfoList, preferences.sortField, preferences.sortDirection]);

  const sortedGroupedPackages = useMemo(() => {
    return sortGroupedPackages(groupedPackages, preferences.sortField, preferences.sortDirection);
  }, [groupedPackages, preferences.sortField, preferences.sortDirection]);

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* Toggle Buttons - 居中显示 */}
      <div className='flex justify-center'>
        <div className='flex gap-2 bg-zinc-900/50 rounded-lg p-1 border border-zinc-700'>
          <Button
            variant={preferences.viewMode === 'individual' ? 'yellow' : 'ghostDark'}
            size='sm'
            className='flex items-center gap-2'
            onClick={() => handleViewModeChange('individual')}
          >
            <Package className='h-4 w-4' />
            <span className='hidden sm:inline'>Individual Packages</span>
            <span className='sm:hidden'>Individual</span>
          </Button>
          <Button
            variant={preferences.viewMode === 'grouped' ? 'yellow' : 'ghostDark'}
            size='sm'
            className='flex items-center gap-2'
            onClick={() => handleViewModeChange('grouped')}
          >
            <Layers className='h-4 w-4' />
            <span className='hidden sm:inline'>Grouped by Repository</span>
            <span className='sm:hidden'>Grouped</span>
          </Button>
        </div>
      </div>

      {/* Sort Controls - 居中显示 */}
      <div className='flex justify-center gap-2'>
        <SortSelector
          sortField={preferences.sortField}
          onFieldChange={handleFieldChange}
        />
        <SortDirectionToggle
          sortDirection={preferences.sortDirection}
          onDirectionChange={handleDirectionChange}
        />
      </div>

      {/* Package List - 使用父容器的宽度约束 */}
      <div className='flex flex-col gap-4 md:gap-5 w-full'>
        {preferences.viewMode === 'grouped'
          ? // 分组视图
            sortedGroupedPackages.map((group, idx) => (
              <div
                key={group.repositoryName || idx}
                className='animate-in fade-in slide-in-from-bottom-5 duration-500'
                style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
              >
                <GroupedPackageItem group={group} />
              </div>
            ))
          : // 单独视图
            sortedPackages.map((item, idx) => (
              <div
                key={item?.id || item?.name || idx}
                className='animate-in fade-in slide-in-from-bottom-5 duration-500'
                style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
              >
                <PackageItem info={item} />
              </div>
            ))}
      </div>
    </div>
  );
}
