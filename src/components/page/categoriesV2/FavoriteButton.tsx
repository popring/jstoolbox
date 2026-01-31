'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function FavoriteButton({
  name,
  className,
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite: isFav, toggleFavorite, mounted } = useFavorites();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (mounted) {
      setIsActive(isFav(name));
    }
  }, [mounted, isFav, name]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(name);
    setIsActive(newState);
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          'inline-flex items-center gap-1 rounded-full p-1.5 transition-colors',
          'bg-gray-100 text-gray-400 cursor-not-allowed',
          className
        )}
        disabled
      >
        <Heart className={cn(sizeClasses[size], 'animate-pulse')} />
        {showLabel && <span className="text-xs">...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center gap-1 rounded-full p-1.5 transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isActive
          ? 'text-red-500'
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
        className
      )}
      title={isActive ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={cn(sizeClasses[size], isActive && 'fill-current')} />
      {showLabel && (
        <span className={cn('text-xs', isActive ? 'text-red-500' : 'text-gray-500')}>
          {isActive ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
