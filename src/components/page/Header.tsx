'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Menu, X, Heart, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/search/SearchInput';
import { PackageInfo } from '@/app/types/categories';
import { fetchPackagesForSearch } from '@/lib/api/data';
import { useTheme } from 'next-themes';

export function Header() {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 加载热门包数据用于搜索
  useEffect(() => {
    const loadPopularPackages = async () => {
      try {
        const allPackages = await fetchPackagesForSearch();
        setPackages(allPackages);
      } catch (error) {
        console.error('Error loading packages for search:', error);
      }
    };

    loadPopularPackages();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-800'>
      <div className='max-w-[1200px] mx-auto px-4 md:px-8'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* 左侧 - 品牌标识和搜索 */}
          <div className='flex items-center flex-1 gap-4 md:gap-8'>
            <Link
              href='/'
              className='text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shrink-0'
            >
              JS Toolbox
            </Link>

            {/* 搜索框 - 桌面端显示 */}
            <div className='hidden md:block flex-1 max-w-xl'>
              <SearchInput packages={packages} />
            </div>
          </div>

          {/* 右侧 - 导航链接、主题切换和 GitHub */}
          <div className='flex items-center gap-2 md:gap-4'>
            {/* 收藏链接 */}
            <Link
              href='/favorites'
              className='hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
            >
              <Heart className='h-4 w-4 text-amber-500 dark:text-red-500' />
              <span>Favorites</span>
            </Link>

            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className='p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
              title='Toggle theme'
            >
              <Sun className='h-4 w-4 dark:hidden' />
              <Moon className='h-4 w-4 hidden dark:block' />
            </button>

            <Button
              asChild
              className='bg-amber-500 hover:bg-amber-400 text-white font-semibold px-3 md:px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base'
            >
              <a
                href='https://github.com/popring/jstoolbox'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <Github className='h-4 w-4' />
                <span className='hidden sm:inline'>Star on GitHub</span>
                <span className='sm:hidden'>Star</span>
              </a>
            </Button>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white transition-colors'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* 移动端搜索框 */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-100 dark:border-slate-800 mt-4 space-y-4'>
            <SearchInput packages={packages} />

            {/* 移动端导航链接 */}
            <div className='flex flex-col gap-2'>
              <Link
                href='/favorites'
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className='h-4 w-4 text-amber-500 dark:text-red-500' />
                <span>Favorites</span>
              </Link>

              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
              >
                <Sun className='h-4 w-4 dark:hidden' />
                <Moon className='h-4 w-4 hidden dark:block' />
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
