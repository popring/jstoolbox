'use client';

import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800/50'>
      <div className='max-w-[1200px] mx-auto px-4 md:px-6'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* 左侧 - 品牌标识 */}
          <div className='flex items-center'>
            <Link 
              href='/' 
              className='text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 bg-clip-text text-transparent hover:from-yellow-400 hover:to-amber-400 transition-all duration-300'
            >
              JS Toolbox
            </Link>
          </div>

          <div className='flex items-center'>
            <Button
              asChild
              className='bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl'
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

          </div>
        </div>

      </div>
    </header>
  );
}
