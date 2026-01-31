'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatDownloads } from '@/lib/utils';
import { Search, X, ExternalLink } from 'lucide-react';
import { PackageInfo } from '@/app/types/categories';
import { cn } from '@/lib/utils';

interface SearchDropdownProps {
  query: string;
  results: PackageInfo[];
  isOpen: boolean;
  isLoading: boolean;
  onSelect: (item: PackageInfo) => void;
  onClose: () => void;
}

export function SearchDropdown({
  query,
  results,
  isOpen,
  isLoading,
  onSelect,
  onClose
}: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 处理键盘导航
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : prev
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelect, onClose]);

  // 重置选中项
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, results]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden',
        'max-h-[80vh] overflow-y-auto'
      )}
    >
      {/* Loading state */}
      {isLoading && (
        <div className='p-4 text-center text-slate-400'>
          <Search className='h-5 w-5 mx-auto mb-2 animate-pulse' />
          <p className='text-sm'>Searching...</p>
        </div>
      )}

      {/* No results */}
      {!isLoading && results.length === 0 && query && (
        <div className='p-4 text-center text-slate-400'>
          <X className='h-5 w-5 mx-auto mb-2' />
          <p className='text-sm'>No packages found for &quot;{query}&quot;</p>
          <p className='text-xs mt-1'>Try searching with different keywords</p>
        </div>
      )}

      {/* Search results */}
      {!isLoading && results.length > 0 && (
        <div className='py-2'>
          {/* Result count */}
          <div className='px-3 py-2 text-xs text-slate-500 border-b border-slate-800'>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </div>

          {results.map((item, index) => (
            <SearchResultItem
              key={`${item.name}-${index}`}
              item={item}
              query={query}
              isSelected={index === selectedIndex}
              onClick={() => onSelect(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchResultItemProps {
  item: PackageInfo;
  query: string;
  isSelected: boolean;
  onClick: () => void;
}

function SearchResultItem({ item, query, isSelected, onClick }: SearchResultItemProps) {
  // 高亮匹配的文本
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => (
          <span
            key={i}
            className={
              part.toLowerCase() === highlight.toLowerCase()
                ? 'text-yellow-400 font-semibold'
                : ''
            }
          >
            {part}
          </span>
        ))}
      </>
    );
  };

  return (
    <div
      className={cn(
        'px-4 py-3 cursor-pointer transition-colors border-b border-slate-800/50 last:border-b-0',
        isSelected ? 'bg-slate-800' : 'hover:bg-slate-800/50'
      )}
      onClick={onClick}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          {/* Package name */}
          <div className='flex items-center gap-2 mb-1'>
            <h3 className='text-sm font-medium text-white truncate'>
              {highlightMatch(item.name, query)}
            </h3>
            {item.github?.stars && item.github.stars > 10000 && (
              <span className='text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded'>
                Popular
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className='text-xs text-slate-400 line-clamp-2 mb-2'>
              {highlightMatch(item.description, query)}
            </p>
          )}

          {/* Meta info */}
          <div className='flex items-center gap-3 text-xs text-slate-500'>
            {item.npm?.downloads && (
              <span>{formatDownloads(item.npm.downloads)} weekly</span>
            )}
            {item.github?.stars && (
              <span>⭐ {item.github.stars.toLocaleString()}</span>
            )}
            {item.npm?.name && (
              <span className='truncate opacity-75'>
                npm: {item.npm.name}
              </span>
            )}
          </div>
        </div>

        {/* External link */}
        {item.website && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(item.website, '_blank');
            }}
            className='flex-shrink-0 p-1.5 text-slate-400 hover:text-white transition-colors'
          >
            <ExternalLink className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );
}