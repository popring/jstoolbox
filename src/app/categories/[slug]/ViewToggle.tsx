'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Layers } from 'lucide-react';
import { PackageItem } from '@/components/page/categoriesV2';
import { GroupedPackageItem } from '@/components/page/categoriesV2/GroupedPackageItem';
import { GroupedPackageInfo, PackageInfo } from '@/app/types/categories';

interface ViewToggleProps {
  groupedPackages: GroupedPackageInfo[];
  packageInfoList: PackageInfo[];
}

export function ViewToggle({
  groupedPackages,
  packageInfoList,
}: ViewToggleProps) {
  const [viewMode, setViewMode] = useState<'grouped' | 'individual'>(
    'individual'
  );

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* Toggle Buttons - 居中显示 */}
      <div className='flex justify-center'>
        <div className='flex gap-2 bg-zinc-900/50 rounded-lg p-1 border border-zinc-700'>
          <Button
            variant={viewMode === 'individual' ? 'default' : 'ghost'}
            size='sm'
            className={`flex items-center gap-2 ${
              viewMode === 'individual'
                ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:text-black'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400'
            }`}
            onClick={() => setViewMode('individual')}
          >
            <Package className='h-4 w-4' />
            <span className='hidden sm:inline'>Individual Packages</span>
            <span className='sm:hidden'>Individual</span>
          </Button>
          <Button
            variant={viewMode === 'grouped' ? 'default' : 'ghost'}
            size='sm'
            className={`flex items-center gap-2 ${
              viewMode === 'grouped'
                ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:text-black'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400'
            }`}
            onClick={() => setViewMode('grouped')}
          >
            <Layers className='h-4 w-4' />
            <span className='hidden sm:inline'>Grouped by Repository</span>
            <span className='sm:hidden'>Grouped</span>
          </Button>
        </div>
      </div>

      {/* Package List - 使用父容器的宽度约束 */}
      <div className='flex flex-col gap-4 md:gap-5 w-full'>
        {viewMode === 'grouped'
          ? // 分组视图
            groupedPackages.map((group, idx) => (
              <div
                key={group.repositoryName || idx}
                className='animate-in fade-in slide-in-from-bottom-5 duration-500'
                style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
              >
                <GroupedPackageItem group={group} />
              </div>
            ))
          : // 单独视图
            packageInfoList.map((item, idx) => (
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
