'use client';

import { Header } from '@/components/page/Header';
import { PackageItem, SimpleStarChart } from '@/components/page/categoriesV2';
import { isFavorite } from '@/lib/favorites';
import { SortField } from '@/components/page/categoriesV2/SortSelector';
import { useState, useEffect, useMemo } from 'react';
import { SortSelector, SortDirection } from '@/components/page/categoriesV2/SortSelector';
import { SortDirectionToggle } from '@/components/page/categoriesV2/SortDirectionToggle';
import { ViewToggle } from '@/components/page/categoriesV2/ViewToggle';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface PackageInfo {
  name: string;
  description: string;
  github: {
    url: string;
    stars: number;
    issuesTotal?: number;
    issuesResolved?: number;
  };
  npm: {
    downloads: number;
    url: string;
    firstReleased: string;
    lastReleased: string;
  };
  website?: string;
  category?: string;
}

function FavoritesClient() {
  const [allPackages, setAllPackages] = useState<PackageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('downloads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('list');

  useEffect(() => {
    async function loadData() {
      try {
        // 先获取所有分类列表
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();

        // 并行加载所有分类的包数据
        const categoryPromises = categoriesData.categories.map(async (category: string) => {
          try {
            const res = await fetch(`/api/categories/${category}`);
            const data = await res.json();
            return data.data || [];
          } catch (error) {
            console.warn(`Failed to load category ${category}:`, error);
            return [];
          }
        });

        const categoryResults = await Promise.all(categoryPromises);
        const packages: PackageInfo[] = categoryResults.flat();

        setAllPackages(packages);
      } catch (error) {
        console.error('Failed to load packages:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const favoritePackages = useMemo(() => {
    return allPackages.filter(pkg => isFavorite(pkg.name));
  }, [allPackages]);

  const sortedPackages = useMemo(() => {
    return [...favoritePackages].sort((a, b) => {
      let aVal: number, bVal: number;

      switch (sortField) {
        case 'downloads':
          aVal = a.npm?.downloads || 0;
          bVal = b.npm?.downloads || 0;
          break;
        case 'stars':
          aVal = a.github?.stars || 0;
          bVal = b.github?.stars || 0;
          break;
        case 'age':
          aVal = new Date(a.npm?.firstReleased || 0).getTime();
          bVal = new Date(b.npm?.firstReleased || 0).getTime();
          break;
        case 'lastRelease':
          aVal = new Date(a.npm?.lastReleased || 0).getTime();
          bVal = new Date(b.npm?.lastReleased || 0).getTime();
          break;
        default:
          aVal = a.npm?.downloads || 0;
          bVal = b.npm?.downloads || 0;
      }

      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [favoritePackages, sortField, sortOrder]);

  const chartData = useMemo(() => {
    const topPackages = [...sortedPackages].slice(0, 5);
    return topPackages.map(pkg => ({
      packageName: pkg.name.length > 15 ? pkg.name.substring(0, 15) + '...' : pkg.name,
      value: sortField === 'downloads'
        ? (pkg.npm?.downloads || 0) / 1000
        : sortField === 'stars'
        ? pkg.github?.stars || 0
        : sortField === 'age'
        ? 2025 - new Date(pkg.npm?.firstReleased || 0).getFullYear()
        : 2025 - new Date(pkg.npm?.lastReleased || 0).getFullYear(),
    }));
  }, [sortedPackages, sortField]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300'>
        <Header />
        <div className='container mx-auto px-4 py-24'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-200 dark:bg-slate-800 rounded w-48'></div>
            <div className='h-64 bg-gray-200 dark:bg-slate-800 rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300'>
      <Header />

      <main className='container mx-auto px-4 py-24'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
          <div className='flex items-center gap-3'>
            <Heart className='h-8 w-8 text-amber-500 dark:text-red-500' />
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>My Favorites</h1>
            <span className='text-gray-500 dark:text-slate-400'>({favoritePackages.length} packages)</span>
          </div>

          {favoritePackages.length > 0 && (
            <div className='flex items-center gap-4'>
              <SortSelector
                sortField={sortField}
                onFieldChange={setSortField}
              />
              <SortDirectionToggle
                sortDirection={sortOrder as SortDirection}
                onDirectionChange={(dir) => setSortOrder(dir)}
              />
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          )}
        </div>

        {favoritePackages.length === 0 ? (
          <div className='text-center py-16'>
            <Heart className='h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2'>No favorites yet</h2>
            <p className='text-gray-500 dark:text-slate-400 mb-6'>
              Start exploring packages and save your favorites here!
            </p>
            <Link
              href='/'
              className='inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-400 transition-colors'
            >
              Explore Packages
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'chart' && (
              <div className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 mb-8'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Top 5 Favorites</h2>
                <div className='h-80'>
                  <SimpleStarChart chartData={chartData} sortField={sortField} />
                </div>
              </div>
            )}

            <div className='grid gap-4'>
              {sortedPackages.map((info) => (
                <PackageItem key={info.name} info={info} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function FavoritesPage() {
  return <FavoritesClient />;
}
