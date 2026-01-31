'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchPackages, initSearchIndex } from '@/lib/search';
import { PackageInfo } from '@/app/types/categories';
import { SearchDropdown } from './SearchDropdown';

interface SearchInputProps {
  packages: PackageInfo[];
  className?: string;
}

export function SearchInput({ packages, className }: SearchInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<PackageInfo[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化搜索索引
  useEffect(() => {
    if (packages.length > 0) {
      initSearchIndex(packages);
    }
  }, [packages]);

  // 加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('search-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const newHistory = [
      searchQuery,
      ...history.filter(h => h !== searchQuery)
    ].slice(0, 10); // 只保留最近10条

    setHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  }, [history]);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        const searchResults = searchPackages(query, { limit: 10 });
        setResults(searchResults);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setIsOpen(true);
    } else if (e.target.value.trim().length === 0) {
      setIsOpen(true); // 保留历史记录显示
    } else {
      setIsOpen(false);
    }
  };

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      // Escape 关闭搜索
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 选择了搜索结果
  const handleSelect = (item: PackageInfo) => {
    saveToHistory(query);
    setIsOpen(false);
    setQuery('');

    // 跳转到包的详情页或 GitHub
    if (item.github?.url) {
      window.open(item.github.url, '_blank');
    } else if (item.npm?.url) {
      window.open(item.npm.url, '_blank');
    }
  };

  // 执行搜索
  const handleSearch = () => {
    if (query.trim()) {
      saveToHistory(query);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  // 清空输入
  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative flex-1 max-w-xl mx-auto', className)}>
      <div className='relative'>
        {/* Search input */}
        <div className='relative group'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400 group-focus-within:text-amber-500 transition-colors' />

          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() && setIsOpen(true)}
            onBlur={() => {
              // 延迟关闭，以便点击下拉结果
              setTimeout(() => setIsOpen(false), 150);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder='Search packages...'
            className={cn(
              'w-full h-10 pl-10 pr-24',
              'bg-white dark:bg-slate-800',
              'border border-gray-300 dark:border-slate-600',
              'rounded-lg',
              'text-gray-900 dark:text-white',
              'placeholder-gray-400 dark:placeholder-slate-400',
              'focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500',
              'transition-all duration-200'
            )}
          />

          {/* Command/K shortcut hint */}
          <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
            <kbd className='hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/50 rounded'>
              <Command className='h-3 w-3' />
              K
            </kbd>

            {/* Clear button */}
            {query && (
              <button
                onClick={handleClear}
                className='flex items-center justify-center p-0.5 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>

        {/* Search history suggestions */}
        {!query && history.length > 0 && isOpen && (
          <div className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden'>
            <div className='px-3 py-2 text-xs text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800'>
              Recent searches
            </div>
            {history.map((term, index) => (
              <button
                key={`${term}-${index}`}
                onClick={() => {
                  setQuery(term);
                  inputRef.current?.focus();
                }}
                className='w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3'
              >
                <Search className='h-4 w-4 text-gray-400 dark:text-slate-500' />
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search results dropdown */}
      <SearchDropdown
        query={query}
        results={results}
        isOpen={isOpen}
        isLoading={isLoading}
        onSelect={handleSelect}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}