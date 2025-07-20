'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortDirection } from './SortSelector';

interface SortDirectionToggleProps {
  sortDirection: SortDirection;
  onDirectionChange: (direction: SortDirection) => void;
}

export function SortDirectionToggle({ 
  sortDirection, 
  onDirectionChange 
}: SortDirectionToggleProps) {
  const handleToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onDirectionChange(newDirection);
  };

  return (
    <Button
      variant='dark'
      size='sm'
      onClick={handleToggle}
      title={sortDirection === 'asc' ? 'Switch to Descending' : 'Switch to Ascending'}
    >
      {sortDirection === 'asc' ? (
        <>
          <ChevronUp className='h-4 w-4' />
          <span className='hidden sm:inline'>Ascending</span>
          <span className='sm:hidden'>↑</span>
        </>
      ) : (
        <>
          <ChevronDown className='h-4 w-4' />
          <span className='hidden sm:inline'>Descending</span>
          <span className='sm:hidden'>↓</span>
        </>
      )}
    </Button>
  );
} 