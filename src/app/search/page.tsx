'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Grid, List, ExternalLink } from 'lucide-react';
import { searchPackages } from '@/lib/search';
import { fetchCategories, fetchCategoryPackages } from '@/lib/api/data';
import { PackageInfo } from '@/app/types/categories';
import { formatDownloads } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<PackageInfo[]>([]);
  const [allPackages, setAllPackages] = useState<PackageInfo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'downloads' | 'stars' | 'updated'>('relevance');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // 加载所有包数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const { categories } = await fetchCategories();
        setCategories(categories);

        // 并行加载所有分类（优化性能）
        const categoryPromises = categories.map(async (category) => {
          try {
            const { data } = await fetchCategoryPackages(category);
            return data;
          } catch (error) {
            console.warn(`Failed to load category ${category}:`, error);
            return [];
          }
        });

        const categoryResults = await Promise.all(categoryPromises);
        setAllPackages(categoryResults.flat());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 执行搜索
  useEffect(() => {
    if (!query || allPackages.length === 0) return;

    const searchResults = searchPackages(query, { limit: 100 });
    setResults(searchResults);
  }, [query, allPackages]);

  // 排序和过滤结果
  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // 分类过滤
    if (filterCategory) {
      filtered = filtered.filter(pkg => {
        return pkg.name.includes(filterCategory) ||
               pkg.description?.toLowerCase().includes(filterCategory.toLowerCase());
      });
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return (b.npm?.downloads || 0) - (a.npm?.downloads || 0);
        case 'stars':
          return (b.github?.stars || 0) - (a.github?.stars || 0);
        case 'updated':
          return new Date(b.npm?.lastReleased || 0).getTime() -
                 new Date(a.npm?.lastReleased || 0).getTime();
        default:
          return 0; // 保持搜索相关性排序
      }
    });

    return filtered;
  }, [results, sortBy, filterCategory]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300'>
      <div className='container mx-auto px-4 py-24'>
        {/* Search header */}
        <div className='mb-8'>
          <div className='flex items-center gap-4 mb-4'>
            <Search className='h-6 w-6 text-amber-500' />
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Search Results
            </h1>
          </div>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newQuery = formData.get('search') as string;
              if (newQuery && newQuery !== query) {
                router.push(`/search?q=${encodeURIComponent(newQuery)}`);
              }
            }}
            className='relative max-w-2xl'
          >
            <input
              name='search'
              type='text'
              defaultValue={query}
              placeholder='Search packages...'
              className='w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors'
            />
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-400' />
            <Button
              type='submit'
              className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium'
            >
              Search
            </Button>
          </form>

          {/* Search query info */}
          {query && (
            <p className='mt-2 text-sm text-gray-500 dark:text-slate-400'>
              Showing results for <span className='text-amber-500 font-medium'>&quot;{query}&quot;</span>
            </p>
          )}
        </div>

        {/* Filters and controls */}
        {results.length > 0 && (
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              {/* Sort options */}
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500 dark:text-slate-400'>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className='px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500'
                >
                  <option value='relevance'>Relevance</option>
                  <option value='downloads'>Downloads</option>
                  <option value='stars'>Stars</option>
                  <option value='updated'>Last Updated</option>
                </select>
              </div>

              {/* Category filter */}
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500 dark:text-slate-400'>Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className='px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500'
                >
                  <option value=''>All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View mode */}
            <div className='flex items-center gap-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-0.5'>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid'
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
                )}
              >
                <Grid className='h-4 w-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list'
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
                )}
              >
                <List className='h-4 w-4' />
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className='flex items-center justify-center py-20'>
            <div className='flex items-center gap-2 text-amber-500'>
              <Search className='h-5 w-5 animate-pulse' />
              <span>Loading packages...</span>
            </div>
          </div>
        )}

        {/* No results */}
        {!isLoading && query && results.length === 0 && (
          <div className='text-center py-20'>
            <Search className='h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4' />
            <h2 className='text-xl font-medium text-gray-700 dark:text-slate-300 mb-2'>
              No packages found
            </h2>
            <p className='text-gray-500 dark:text-slate-400 mb-6'>
              Try searching with different keywords or browse categories
            </p>
            <Link
              href='/'
              className='inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-medium rounded-lg transition-colors'
            >
              Browse Categories
            </Link>
          </div>
        )}

        {/* Search results grid/list */}
        {!isLoading && filteredResults.length > 0 && (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}>
            {filteredResults.map((pkg, index) => (
              <PackageCard
                key={`${pkg.name}-${index}`}
                package={pkg}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Result count */}
        {filteredResults.length > 0 && (
          <div className='mt-8 text-center text-sm text-gray-500 dark:text-slate-400'>
            Showing {filteredResults.length} of {results.length} results
          </div>
        )}
      </div>
    </div>
  );
}

// Package card component
function PackageCard({
  package: pkg,
  viewMode
}: {
  package: PackageInfo;
  viewMode: 'grid' | 'list';
}) {
  const CardContent = () => (
    <>
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
          {pkg.name}
        </h3>
        {pkg.github?.stars && pkg.github.stars > 10000 && (
          <Badge variant='secondary' className='bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'>
            Popular
          </Badge>
        )}
      </div>

      {/* Description */}
      {pkg.description && (
        <p className='text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mb-4'>
          {pkg.description}
        </p>
      )}

      {/* Stats */}
      <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400 mb-4'>
        {pkg.npm?.downloads && (
          <span>
            {formatDownloads(pkg.npm.downloads)} weekly
          </span>
        )}
        {pkg.github?.stars && (
          <span>
            ⭐ {pkg.github.stars.toLocaleString()}
          </span>
        )}
        {pkg.npm?.firstReleased && (
          <span>
            Released {new Date(pkg.npm.firstReleased).getFullYear()}
          </span>
        )}
      </div>

      {/* Links */}
      <div className='flex gap-2'>
        {pkg.github?.url && (
          <button
            onClick={() => window.open(pkg.github!.url, '_blank')}
            className='inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-sm text-gray-700 dark:text-gray-200 transition-colors'
          >
            <ExternalLink className='h-3 w-3' />
            GitHub
          </button>
        )}
        {pkg.npm?.url && (
          <button
            onClick={() => window.open(pkg.npm!.url, '_blank')}
            className='inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-sm text-gray-700 dark:text-gray-200 transition-colors'
          >
            <ExternalLink className='h-3 w-3' />
            npm
          </button>
        )}
      </div>
    </>
  );

  if (viewMode === 'list') {
    return (
      <div className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-all duration-300'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 items-start'>
          <div className='lg:col-span-2'>
            <CardContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-5 hover:shadow-lg transition-all duration-300'>
      <CardContent />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300'>
        <div className='container mx-auto px-4 py-24'>
          <div className='flex items-center gap-4 mb-4'>
            <Search className='h-6 w-6 text-amber-500' />
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Search Results</h1>
          </div>
          <div className='animate-pulse space-y-4'>
            <div className='h-12 bg-gray-200 dark:bg-slate-800 rounded-lg max-w-2xl'></div>
            <div className='h-64 bg-gray-200 dark:bg-slate-800 rounded'></div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
