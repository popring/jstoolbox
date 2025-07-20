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
import { GroupedPackageInfo } from '@/app/types/categories';
import { useState } from 'react';

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

function GroupedPackageItem({ group }: { group: GroupedPackageInfo }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate issue resolution percentage with safety checks
  const issuesTotal = group.repositoryIssuesTotal || 0;
  const issuesResolved = group.repositoryIssuesResolved || 0;
  const issueResolutionPercentage =
    issuesTotal > 0 ? Math.round((issuesResolved / issuesTotal) * 100) : 0;

  // Format dates with safety checks
  const age = group.firstReleased
    ? formatAge(group.firstReleased)
    : 'Unknown';
  const lastRelease = group.lastReleased
    ? formatLastRelease(group.lastReleased)
    : 'Unknown';

  // Get the most popular package (highest downloads)
  const mostPopularPackage = group.packages.reduce((prev, current) => 
    (current.npm?.downloads || 0) > (prev.npm?.downloads || 0) ? current : prev
  );

  return (
    <div className='bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm hover:border-yellow-900/50 transition-all duration-300 shadow-lg shadow-black/20'>
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-xl md:text-2xl font-bold text-yellow-400'>
              {group.repositoryName}
            </h3>
            <Badge variant='outline' className='bg-zinc-800/50 text-zinc-300 border-zinc-700'>
              {group.packages.length} package{group.packages.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <p className='text-zinc-300 mb-3 text-sm md:text-base'>
            {mostPopularPackage?.description || 'No description available'}
          </p>
          <p className='text-zinc-500 text-xs md:text-sm truncate max-w-2xl'>
            {group.repositoryUrl || ''}
          </p>
        </div>
        <div className='flex gap-2 shrink-0'>
          {group.repositoryUrl && (
            <LinkButton
              href={group.repositoryUrl}
              variant='outline'
              size='sm'
              className='bg-zinc-1000 gap-2 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-yellow-400'
            >
              <Github className='h-4 w-4' />
              <span className='hidden sm:inline'>GitHub</span>
            </LinkButton>
          )}
          {group.website && (
            <LinkButton
              href={group.website}
              variant='outline'
              size='sm'
              className='bg-zinc-1000 gap-2 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-yellow-400'
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
          label='Total Downloads'
          value={group.totalDownloads.toLocaleString()}
        />
        <StatCard
          icon={<Star className='h-5 w-5 text-yellow-500' />}
          label='Stars'
          value={group.repositoryStars.toLocaleString()}
        />
        <StatCard
          icon={<Clock className='h-5 w-5 text-yellow-500' />}
          label='Age'
          value={age}
          tooltip={
            group.firstReleased
              ? `First released on ${new Date(group.firstReleased).toLocaleDateString()}`
              : ''
          }
        />
        <StatCard
          icon={<Calendar className='h-5 w-5 text-yellow-500' />}
          label='Last Release'
          value={lastRelease}
          tooltip={
            group.lastReleased
              ? `Last released on ${new Date(group.lastReleased).toLocaleDateString()}`
              : ''
          }
        />
      </div>

      {/* Issues Section - Only show if there are issues */}
      {issuesTotal > 0 && (
        <div className='bg-zinc-800/30 rounded-lg p-3 md:p-4 mb-4'>
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
      )}

      {/* Packages List */}
      <div className='border-t border-zinc-800 pt-4'>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-between text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800/50'
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
                className='bg-zinc-800/30 rounded-lg p-3 flex items-center justify-between'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-sm font-medium text-zinc-200'>
                      {pkg.name}
                    </span>
                    {pkg.npm?.downloads && (
                      <Badge variant='outline' className='text-xs bg-zinc-700/50 text-zinc-300 border-zinc-600'>
                        {(pkg.npm.downloads / 1000).toFixed(1)}k downloads
                      </Badge>
                    )}
                  </div>
                  <p className='text-xs text-zinc-400 line-clamp-2'>
                    {pkg.description}
                  </p>
                </div>
                <div className='flex gap-1 ml-3'>
                  {pkg.npm?.url && (
                    <LinkButton
                      href={pkg.npm.url}
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-700/50'
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