'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Star, Clock, Calendar, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SortField = 'downloads' | 'stars' | 'age' | 'lastRelease';
export type SortDirection = 'asc' | 'desc';

interface SortSelectorProps {
  sortField: SortField;
  onFieldChange: (field: SortField) => void;
}

const sortOptions = [
  {
    field: 'downloads' as SortField,
    label: 'Downloads',
    icon: Download,
  },
  {
    field: 'stars' as SortField,
    label: 'Stars',
    icon: Star,
  },
  {
    field: 'age' as SortField,
    label: 'Age',
    icon: Clock,
  },
  {
    field: 'lastRelease' as SortField,
    label: 'Last Release',
    icon: Calendar,
  },
];

export function SortSelector({ sortField, onFieldChange }: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFieldSelect = (field: SortField) => {
    onFieldChange(field);
    setIsOpen(false);
  };

  const currentOption = sortOptions.find(option => option.field === sortField);
  const CurrentIcon = currentOption?.icon || ArrowUpDown;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='dark'
          size='sm'
        >
          <CurrentIcon className='h-4 w-4' />
          <span className='hidden sm:inline'>Sort by {currentOption?.label}</span>
          <span className='sm:hidden'>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align='center'
        className='bg-zinc-900 border-zinc-700 text-zinc-300'
      >
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = sortField === option.field;
          
          return (
            <DropdownMenuItem
              key={option.field}
              className={`flex items-center gap-2 cursor-pointer ${
                isActive 
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                  : 'hover:bg-zinc-800 hover:text-yellow-400'
              }`}
              onClick={() => handleFieldSelect(option.field)}
            >
              <Icon className='h-4 w-4' />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 