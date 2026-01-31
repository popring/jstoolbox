'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Download,
  Star,
  Clock,
  Calendar,
  Package,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDownloads } from '@/lib/utils';
import { sortPackages, sortGroupedPackages } from '@/lib/sort';
import { GroupedPackageItem } from '@/components/page/categoriesV2/GroupedPackageItem';
import { PackageItem } from '@/components/page/categoriesV2';
import {
  SortField,
  SortDirection,
} from '@/components/page/categoriesV2/SortSelector';
import { usePreferences } from '@/hooks/usePreferences';
import { GroupedPackageInfo, PackageInfo } from '@/app/types/categories';
import { formatValueBySortField, getYAxisLabel } from '@/lib/chartUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface CategoryContentProps {
  groupedPackages: GroupedPackageInfo[];
  packageInfoList: PackageInfo[];
  categorySlug?: string;
}

function StatCard({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip?: string;
}) {
  return (
    <div
      className='bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-200'
      title={tooltip}
    >
      <div className='mb-2 text-amber-500'>{icon}</div>
      <div className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
        {value}
      </div>
      <div className='text-xs text-gray-500 dark:text-slate-400 mt-1'>{label}</div>
    </div>
  );
}

function SimpleStarChart({
  chartData,
  sortField = 'stars',
}: {
  chartData: any[];
  sortField?: SortField;
}) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className='flex items-center justify-center h-full text-gray-500 dark:text-slate-400'>
        No data available
      </div>
    );
  }

  return (
    <div className='w-full h-full bg-white dark:bg-slate-900 rounded-xl p-4'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis
            dataKey='packageName'
            stroke='#525252'
            tick={{ fill: '#6b7280' }}
            angle={-45}
            textAnchor='end'
            height={80}
            interval={0}
          />
          <YAxis
            stroke='#525252'
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => formatValueBySortField(value, sortField)}
          />
          <Tooltip
            formatter={(value: number) => [
              formatValueBySortField(value, sortField),
              getYAxisLabel(sortField),
            ]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: '#1f2937' }}
          />
          <Bar
            dataKey='value'
            fill='url(#colorGradient)'
            radius={[6, 6, 0, 0]}
            barSize={50}
            animationDuration={1500}
          />
          <defs>
            <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#f59e0b' stopOpacity={1} />
              <stop offset='100%' stopColor='#d97706' stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryContent({
  groupedPackages,
  packageInfoList,
}: CategoryContentProps) {
  const { preferences, updatePreferences } = usePreferences();

  // 排序字段处理函数
  const handleFieldChange = useCallback(
    (sortField: SortField) => {
      updatePreferences({ sortField });
    },
    [updatePreferences]
  );

  // 排序方向处理函数
  const handleDirectionChange = useCallback(
    (sortDirection: SortDirection) => {
      updatePreferences({ sortDirection });
    },
    [updatePreferences]
  );

  // 视图模式处理函数
  const handleViewModeChange = useCallback(
    (viewMode: 'grouped' | 'individual') => {
      updatePreferences({ viewMode });
    },
    [updatePreferences]
  );

  // 使用 useMemo 缓存排序结果
  const sortedPackages = useMemo(
    () => sortPackages(packageInfoList, preferences.sortField, preferences.sortDirection),
    [packageInfoList, preferences.sortField, preferences.sortDirection]
  );

  const sortedGroupedPackages = useMemo(
    () => sortGroupedPackages(groupedPackages, preferences.sortField, preferences.sortDirection),
    [groupedPackages, preferences.sortField, preferences.sortDirection]
  );

  // 计算图表数据
  const chartData = useMemo(() => {
    const packagesToUse =
      preferences.viewMode === 'grouped'
        ? sortedGroupedPackages.map((group) => ({
            packageName:
              group.repositoryName.length > 15
                ? group.repositoryName.substring(0, 15) + '...'
                : group.repositoryName,
            value:
              preferences.sortField === 'downloads'
                ? (group.totalDownloads || 0) / 1000
                : preferences.sortField === 'stars'
                ? group.repositoryStars || 0
                : preferences.sortField === 'age'
                ? 2025 -
                  new Date(group.firstReleased || 0).getFullYear()
                : 2025 - new Date(group.lastReleased || 0).getFullYear(),
          }))
        : sortedPackages.slice(0, 10).map((pkg) => ({
            packageName:
              pkg.name.length > 15 ? pkg.name.substring(0, 15) + '...' : pkg.name,
            value:
              preferences.sortField === 'downloads'
                ? (pkg.npm?.downloads || 0) / 1000
                : preferences.sortField === 'stars'
                ? pkg.github?.stars || 0
                : preferences.sortField === 'age'
                ? 2025 - new Date(pkg.npm?.firstReleased || 0).getFullYear()
                : 2025 - new Date(pkg.npm?.lastReleased || 0).getFullYear(),
          }));

    return packagesToUse.slice(0, 10);
  }, [sortedPackages, sortedGroupedPackages, preferences.viewMode, preferences.sortField]);

  // 统计信息
  const stats = useMemo(() => {
    const totalDownloads = packageInfoList.reduce(
      (sum, pkg) => sum + (pkg.npm?.downloads || 0),
      0
    );
    const totalStars = packageInfoList.reduce(
      (sum, pkg) => sum + (pkg.github?.stars || 0),
      0
    );
    const avgAge = Math.round(
      packageInfoList.reduce((sum, pkg) => {
        const age =
          2025 - new Date(pkg.npm?.firstReleased || 0).getFullYear();
        return sum + (isNaN(age) ? 0 : age);
      }, 0) / packageInfoList.length
    );
    const lastReleaseDate = packageInfoList
      .map((pkg) => new Date(pkg.npm?.lastReleased || 0).getTime())
      .filter((d) => !isNaN(d));
    const latestRelease =
      lastReleaseDate.length > 0
        ? Math.round(
            (Date.now() - Math.max(...lastReleaseDate)) /
              (1000 * 60 * 60 * 24)
          )
        : 0;

    return {
      totalDownloads,
      totalPackages: packageInfoList.length,
      avgAge,
      latestRelease,
      totalStars,
    };
  }, [packageInfoList]);

  // 获取排序字段显示名称
  const getSortFieldLabel = (field: SortField) => {
    switch (field) {
      case 'downloads':
        return 'Downloads';
      case 'stars':
        return 'Stars';
      case 'age':
        return 'Age';
      case 'lastRelease':
        return 'Last Release';
      default:
        return field;
    }
  };

  // 获取排序字段图标
  const getSortFieldIcon = (field: SortField) => {
    switch (field) {
      case 'downloads':
        return <Download className='h-4 w-4' />;
      case 'stars':
        return <Star className='h-4 w-4' />;
      case 'age':
        return <Clock className='h-4 w-4' />;
      case 'lastRelease':
        return <Calendar className='h-4 w-4' />;
      default:
        return <ArrowUpDown className='h-4 w-4' />;
    }
  };

  return (
    <div className='w-full'>
      {/* Toggle Buttons */}
      <div className='flex justify-center mb-8'>
        <div className='inline-flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1.5 border border-gray-200 dark:border-slate-700'>
          <button
            onClick={() => handleViewModeChange('individual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              preferences.viewMode === 'individual'
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package className='h-4 w-4' />
            <span className='hidden sm:inline'>Individual</span>
          </button>
          <button
            onClick={() => handleViewModeChange('grouped')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              preferences.viewMode === 'grouped'
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className='h-4 w-4' />
            <span className='hidden sm:inline'>Grouped</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <StatCard
          icon={<Download className='h-6 w-6' />}
          label='Total Downloads'
          value={formatDownloads(stats.totalDownloads)}
          tooltip={`${stats.totalDownloads.toLocaleString()} total downloads`}
        />
        <StatCard
          icon={<Star className='h-6 w-6' />}
          label='Total Stars'
          value={stats.totalStars.toLocaleString()}
          tooltip={`${stats.totalStars.toLocaleString()} total GitHub stars`}
        />
        <StatCard
          icon={<Clock className='h-6 w-6' />}
          label='Avg Age'
          value={`${stats.avgAge}y`}
          tooltip={`Average package age is ${stats.avgAge} years`}
        />
        <StatCard
          icon={<Calendar className='h-6 w-6' />}
          label='Latest Release'
          value={`${stats.latestRelease}d`}
          tooltip={`Latest release was ${stats.latestRelease} days ago`}
        />
      </div>

      {/* Chart Section */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center'>
          Top 10 {preferences.sortField === 'downloads' ? 'Downloads' : preferences.sortField === 'stars' ? 'Stars' : preferences.sortField === 'age' ? 'Age' : 'Last Release'}
        </h2>
        <div className='h-80 w-full'>
          <SimpleStarChart chartData={chartData} sortField={preferences.sortField} />
        </div>
      </div>

      {/* Controls */}
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800'>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-gray-500 dark:text-slate-400 font-medium'>
            Sort by:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600'
              >
                {getSortFieldIcon(preferences.sortField)}
                <span>{getSortFieldLabel(preferences.sortField)}</span>
                <ChevronDown className='h-4 w-4 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              <DropdownMenuItem
                onClick={() => handleFieldChange('downloads')}
                className='flex items-center gap-2'
              >
                <Download className='h-4 w-4' />
                <span>Downloads</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFieldChange('stars')}
                className='flex items-center gap-2'
              >
                <Star className='h-4 w-4' />
                <span>Stars</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFieldChange('age')}
                className='flex items-center gap-2'
              >
                <Clock className='h-4 w-4' />
                <span>Age</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFieldChange('lastRelease')}
                className='flex items-center gap-2'
              >
                <Calendar className='h-4 w-4' />
                <span>Last Release</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              handleDirectionChange(
                preferences.sortDirection === 'asc' ? 'desc' : 'asc'
              )
            }
            className='bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600'
          >
            {preferences.sortDirection === 'asc' ? (
              <ArrowUp className='h-4 w-4' />
            ) : (
              <ArrowDown className='h-4 w-4' />
            )}
          </Button>
        </div>

        <div className='text-sm text-gray-500 dark:text-slate-400'>
          Showing{' '}
          <span className='font-medium text-gray-900 dark:text-white'>
            {preferences.viewMode === 'grouped'
              ? sortedGroupedPackages.length
              : sortedPackages.length}
          </span>{' '}
          {preferences.viewMode === 'grouped' ? 'groups' : 'packages'}
        </div>
      </div>

      {/* Packages List */}
      <div className='space-y-4'>
        {preferences.viewMode === 'grouped'
          ? sortedGroupedPackages.map((group) => (
              <GroupedPackageItem
                key={group.repositoryName}
                group={group}
              />
            ))
          : sortedPackages.map((pkg) => <PackageItem key={pkg.name} info={pkg} />)}
      </div>
    </div>
  );
}
