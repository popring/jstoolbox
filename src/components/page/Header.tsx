'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/search/SearchInput';
import { PackageInfo } from '@/app/types/categories';
import { fetchPackagesForSearch } from '@/lib/api/data';

export function Header() {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800/50'>
      <div className='max-w-[1200px] mx-auto px-4 md:px-8'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* 左侧 - 品牌标识和搜索 */}
          <div className='flex items-center flex-1 gap-4 md:gap-8'>
            <Link
              href='/'
              className='text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 bg-clip-text text-transparent hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 shrink-0'
            >
              JS Toolbox
            </Link>

            {/* 搜索框 - 桌面端显示 */}
            <div className='hidden md:block flex-1 max-w-xl'>
              <SearchInput packages={packages} />
            </div>
          </div>

          {/* 右侧 - GitHub 链接和移动菜单 */}
          <div className='flex items-center gap-2 md:gap-4'>
            <Button
              asChild
              className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 md:px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base'
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
              className='md:hidden p-2 text-slate-400 hover:text-white transition-colors'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* 移动端搜索框 */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-zinc-800/50 mt-4'>
            <SearchInput packages={packages} />
          </div>
        )}
      </div>
    </header>
  );
}
