'use client';

import type React from 'react';
import {
  ExternalLink,
  Github,
  Star,
  Download,
  Clock,
  Calendar,
  Package,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { formatDownloads } from '@/lib/utils';
import { GroupedPackageInfo } from '@/app/types/categories';
import { useState } from 'react';
import { FavoriteButton } from './FavoriteButton';

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
      className='bg-gray-50 dark:bg-slate-800 rounded-lg p-3 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-200'
      title={tooltip}
    >
      <div className='mb-1'>{icon}</div>
      <div className='text-base md:text-lg font-bold text-gray-900 dark:text-white'>
        {value}
      </div>
      <div className='text-xs text-gray-500 dark:text-slate-400'>{label}</div>
    </div>
  );
}

function GroupedPackageItem({ group }: { group: GroupedPackageInfo }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const issuesTotal = group.repositoryIssuesTotal || 0;
  const issuesResolved = group.repositoryIssuesResolved || 0;
  const issueResolutionPercentage =
    issuesTotal > 0 ? Math.round((issuesResolved / issuesTotal) * 100) : 0;

  const age = group.firstReleased
    ? formatAge(group.firstReleased)
    : 'Unknown';
  const lastRelease = group.lastReleased
    ? formatLastRelease(group.lastReleased)
    : 'Unknown';

  const mostPopularPackage = group.packages.reduce((prev, current) =>
    (current.npm?.downloads || 0) > (prev.npm?.downloads || 0) ? current : prev
  );

  return (
    <div className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-lg transition-all duration-300'>
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white inline-flex items-center gap-2'>
              {group.repositoryName}
              <FavoriteButton name={group.repositoryName} size='sm' />
            </h3>
            <Badge variant='outline' className='bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'>
              {group.packages.length} package{group.packages.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <p className='text-gray-600 dark:text-slate-300 mb-3 text-sm md:text-base'>
            {mostPopularPackage?.description || 'No description available'}
          </p>
          <p className='text-gray-400 dark:text-slate-500 text-xs md:text-sm truncate max-w-2xl'>
            {group.repositoryUrl || ''}
          </p>
        </div>
        <div className='flex gap-2 shrink-0'>
          {group.repositoryUrl && (
            <LinkButton
              href={group.repositoryUrl}
              variant='secondary'
              size='sm'
            >
              <Github className='h-4 w-4' />
              <span className='hidden sm:inline'>GitHub</span>
            </LinkButton>
          )}
          {group.website && (
            <LinkButton
              href={group.website}
              variant='secondary'
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
          label='Total Downloads'
          value={formatDownloads(group.totalDownloads)}
        />
        <StatCard
          icon={<Star className='h-5 w-5 text-amber-500' />}
          label='Stars'
          value={group.repositoryStars.toLocaleString()}
        />
        <StatCard
          icon={<Clock className='h-5 w-5 text-amber-500' />}
          label='Age'
          value={age}
          tooltip={
            group.firstReleased
              ? `First released on ${new Date(group.firstReleased).toLocaleDateString()}`
              : ''
          }
        />
        <StatCard
          icon={<Calendar className='h-5 w-5 text-amber-500' />}
          label='Last Release'
          value={lastRelease}
          tooltip={
            group.lastReleased
              ? `Last released on ${new Date(group.lastReleased).toLocaleDateString()}`
              : ''
          }
        />
      </div>

      {issuesTotal > 0 && (
        <div className='bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 md:p-4 mb-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-700 dark:text-slate-300 text-sm font-medium'>
                Issues Resolution
              </span>
            </div>
            <Badge
              variant='outline'
              className={`text-xs ${
                issueResolutionPercentage > 70
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                  : issueResolutionPercentage > 30
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
              }`}
            >
              {issueResolutionPercentage}% Resolved
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 flex-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-amber-500 to-amber-400'
                style={{ width: `${issueResolutionPercentage}%` }}
              ></div>
            </div>
            <span className='text-gray-500 dark:text-slate-400 text-xs'>
              {issuesResolved}/{issuesTotal}
            </span>
          </div>
        </div>
      )}

      {/* Packages List */}
      <div className='border-t border-gray-100 dark:border-slate-800 pt-4'>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-between text-gray-600 dark:text-slate-300 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-slate-800'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className='flex items-center gap-2'>
            <Package className='h-4 w-4' />
            Packages ({group.packages.length})
          </span>
          {isExpanded ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>

        {isExpanded && (
          <div className='mt-3 space-y-2'>
            {group.packages.map((pkg, index) => (
              <div
                key={pkg.id || index}
                className='bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-between'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-sm font-medium text-gray-900 dark:text-white'>
                      {pkg.name}
                    </span>
                    {pkg.npm?.downloads && (
                      <Badge variant='outline' className='text-xs bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600'>
                        {formatDownloads(pkg.npm.downloads)} downloads
                      </Badge>
                    )}
                  </div>
                  <p className='text-xs text-gray-500 dark:text-slate-400 line-clamp-2'>
                    {pkg.description}
                  </p>
                </div>
                <div className='flex gap-1 ml-3'>
                  {pkg.npm?.url && (
                    <LinkButton
                      href={pkg.npm.url}
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 text-gray-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                      title='View on NPM'
                    >
                      <Download className='h-3 w-3' />
                    </LinkButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { GroupedPackageItem };
