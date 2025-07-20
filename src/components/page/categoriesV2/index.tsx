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
      className='bg-zinc-800/50 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors duration-200'
      title={tooltip}
    >
      <div className='mb-1'>{icon}</div>
      <div className='text-base md:text-lg font-bold text-zinc-100'>
        {value}
      </div>
      <div className='text-xs text-zinc-400'>{label}</div>
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
    <div className='bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm hover:border-yellow-900/50 transition-all duration-300 shadow-lg shadow-black/20'>
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5'>
        <div>
          <h3 className='text-xl md:text-2xl font-bold text-yellow-400 mb-2'>
            {info?.name || 'Unknown'}
          </h3>
          <p className='text-zinc-300 mb-3 text-sm md:text-base'>
            {info?.description || 'No description available'}
          </p>
          <p className='text-zinc-500 text-xs md:text-sm truncate max-w-2xl'>
            {info?.github?.url || ''}
          </p>
        </div>
        <div className='flex gap-2 shrink-0'>
          {info?.github?.url && (
            <LinkButton
              href={info.github.url}
              variant='darkDeeper'
              size='sm'
            >
              <Github className='h-4 w-4' />
              <span className='hidden sm:inline'>GitHub</span>
            </LinkButton>
          )}
          {info?.npm?.url && (
            <LinkButton
              href={info.npm.url}
              variant='darkDeeper'
              size='sm'
            >
              <Download className='h-4 w-4' />
              <span className='hidden sm:inline'>NPM</span>
            </LinkButton>
          )}
          {info?.website && (
            <LinkButton
              href={info.website}
              variant='darkDeeper'
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
          icon={<Download className='h-5 w-5 text-yellow-500' />}
          label='Downloads'
          value={formatDownloads(info?.npm?.downloads || 0)}
        />
        <StatCard
          icon={<Star className='h-5 w-5 text-yellow-500' />}
          label='Stars'
          value={(info?.github?.stars || 0).toLocaleString()}
        />
        <StatCard
          icon={<Clock className='h-5 w-5 text-yellow-500' />}
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
          icon={<Calendar className='h-5 w-5 text-yellow-500' />}
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

      {/* Issues Section - Only show if there are issues */}
      {/* {issuesTotal > 0 && (
        <div className='bg-zinc-800/30 rounded-lg p-3 md:p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <span className='text-zinc-300 text-sm font-medium'>
                Issues Resolution
              </span>
            </div>
            <Badge
              variant='outline'
              className={`text-xs ${
                issueResolutionPercentage > 70
                  ? 'bg-green-900/20 text-green-400 border-green-800'
                  : issueResolutionPercentage > 30
                  ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800'
                  : 'bg-red-900/20 text-red-400 border-red-800'
              }`}
            >
              {issueResolutionPercentage}% Resolved
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 flex-1 bg-zinc-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-yellow-500 to-yellow-300'
                style={{ width: `${issueResolutionPercentage}%` }}
              ></div>
            </div>
            <span className='text-zinc-400 text-xs'>
              {issuesResolved}/{issuesTotal}
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
}

function SimpleStarChart({ chartData }: { chartData: any[] }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className='flex items-center justify-center h-full text-zinc-500'>
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <XAxis
          dataKey='packageName'
          stroke='#525252'
          tick={{ fill: '#a1a1aa' }}
          angle={-15}
          textAnchor='end'
          height={60}
        />
        <YAxis
          stroke='#525252'
          tick={{ fill: '#a1a1aa' }}
          tickFormatter={(value) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
          }
        />
        <Tooltip
          formatter={(value: number) => [
            value >= 1000
              ? `${(value / 1000).toFixed(1)}k stars`
              : `${value} stars`,
            'GitHub Stars',
          ]}
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '6px',
          }}
          labelStyle={{ color: '#e4e4e7' }}
        />
        <Bar
          dataKey='star'
          fill='url(#colorGradient)'
          radius={[4, 4, 0, 0]}
          barSize={60}
          animationDuration={1500}
        />
        <defs>
          <linearGradient id='colorGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#EAB308' stopOpacity={1} />
            <stop offset='100%' stopColor='#CA8A04' stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}

export { PackageItem, SimpleStarChart };
