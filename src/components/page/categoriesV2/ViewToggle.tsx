'use client';

export type ViewMode = 'chart' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className='flex gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-700'>
      <button
        onClick={() => onViewChange('list')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'list'
            ? 'bg-yellow-500 text-black'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
      >
        List
      </button>
      <button
        onClick={() => onViewChange('chart')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'chart'
            ? 'bg-yellow-500 text-black'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
      >
        Chart
      </button>
    </div>
  );
}
