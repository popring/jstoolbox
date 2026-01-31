'use client';

import type React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ExternalLink,
  Github,
  Star,
  Download,
  Clock,
  Calendar,
} from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/link-button';
import { formatDownloads } from '@/lib/utils';
import { SortField } from './SortSelector';
import { formatValueBySortField, getYAxisLabel } from '@/lib/chartUtils';
import { FavoriteButton } from './FavoriteButton';

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
      className='bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200 border border-gray-100 dark:border-slate-700'
      title={tooltip}
    >
      <div className='mb-1'>{icon}</div>
      <div className='text-base md:text-lg font-bold text-gray-900 dark:text-gray-100'>
        {value}
      </div>
      <div className='text-xs text-gray-500 dark:text-slate-400'>{label}</div>
    </div>
  );
}

function PackageItem({ info }: { info: any }) {
  // Calculate issue resolution percentage with safety checks
  // const issuesTotal = info?.github?.issuesTotal || 0;
  // const issuesResolved = info?.github?.issuesResolved || 0;
  // const issueResolutionPercentage =
  //   issuesTotal > 0 ? Math.round((issuesResolved / issuesTotal) * 100) : 0;

  // Format dates with safety checks
  const age = info?.npm?.firstReleased
    ? formatAge(info.npm.firstReleased)
    : 'Unknown';
  const lastRelease = info?.npm?.lastReleased
    ? formatLastRelease(info.npm.lastReleased)
    : 'Unknown';

  return (
    <div className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-lg transition-all duration-300'>
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5'>
        <div>
          <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 inline-flex items-center gap-2'>
            {info?.name || 'Unknown'}
            <FavoriteButton name={info?.name || ''} size='sm' />
          </h3>
          <p className='text-gray-600 dark:text-slate-300 mb-3 text-sm md:text-base'>
            {info?.description || 'No description available'}
          </p>
          <p className='text-gray-400 dark:text-slate-500 text-xs md:text-sm truncate max-w-2xl'>
            {info?.github?.url || ''}
          </p>
        </div>
        <div className='flex gap-2 shrink-0'>
          {info?.github?.url && (
            <LinkButton
              href={info.github.url}
              variant='default'
              size='sm'
            >
              <Github className='h-4 w-4' />
              <span className='hidden sm:inline'>GitHub</span>
            </LinkButton>
          )}
          {info?.npm?.url && (
            <LinkButton
              href={info.npm.url}
              variant='default'
              size='sm'
            >
              <Download className='h-4 w-4' />
              <span className='hidden sm:inline'>NPM</span>
            </LinkButton>
          )}
          {info?.website && (
            <LinkButton
              href={info.website}
              variant='default'
              size='sm'
            >
              <ExternalLink className='h-4 w-4' />
              <span className='hidden sm:inline'>Website</span>
            </LinkButton>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4'>
        <StatCard
          icon={<Download className='h-5 w-5 text-amber-500' />}
          label='Downloads'
          value={formatDownloads(info?.npm?.downloads || 0)}
        />
        <StatCard
          icon={<Star className='h-5 w-5 text-amber-500' />}
          label='Stars'
          value={(info?.github?.stars || 0).toLocaleString()}
        />
        <StatCard
          icon={<Clock className='h-5 w-5 text-amber-500' />}
          label='Age'
          value={age}
          tooltip={
            info?.npm?.firstReleased
              ? `First released on ${new Date(
                  info.npm.firstReleased
                ).toLocaleDateString()}`
              : ''
          }
        />
        <StatCard
          icon={<Calendar className='h-5 w-5 text-amber-500' />}
          label='Last Release'
          value={lastRelease}
          tooltip={
            info?.npm?.lastReleased
              ? `Last released on ${new Date(
                  info.npm.lastReleased
                ).toLocaleDateString()}`
              : ''
          }
        />
      </div>
    </div>
  );
}

function SimpleStarChart({
  chartData,
  sortField = 'stars'
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
    <div className='w-full h-full bg-white dark:bg-slate-900 rounded-lg'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
        <XAxis
          dataKey='packageName'
          stroke='#525252'
          tick={{ fill: '#6b7280' }}
          angle={-15}
          textAnchor='end'
          height={60}
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
            borderRadius: '6px',
          }}
          labelStyle={{ color: '#1f2937' }}
        />
        <Bar
          dataKey='value'
          fill='url(#colorGradient)'
          radius={[4, 4, 0, 0]}
          barSize={60}
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

// Format date to show age in years or months
function formatAge(dateString: string) {
  try {
    const releaseDate = new Date(dateString);
    const now = new Date();
    const diffYears = now.getFullYear() - releaseDate.getFullYear();

    if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`;
    } else {
      const diffMonths =
        now.getMonth() -
        releaseDate.getMonth() +
        (now.getFullYear() - releaseDate.getFullYear()) * 12;
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
    }
  } catch (error) {
    console.error(error);
    return 'Unknown';
  }
}

// Format date to show time since last release
function formatLastRelease(dateString: string) {
  try {
    const releaseDate = new Date(dateString);
    const now = new Date();

    // Check if the date is in the future
    if (releaseDate > now) {
      return 'Coming soon';
    }

    const diffMonths =
      now.getMonth() -
      releaseDate.getMonth() +
      (now.getFullYear() - releaseDate.getFullYear()) * 12;

    if (diffMonths < 1) {
      const diffDays = Math.floor(
        (now.valueOf() - releaseDate.valueOf()) / (1000 * 60 * 60 * 24)
      );
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      const diffYears = Math.floor(diffMonths / 12);
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    }
  } catch (error) {
    console.error(error);
    return 'Unknown';
  }
}

export { PackageItem, SimpleStarChart };
