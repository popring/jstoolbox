import Link from 'next/link';
import { formatDownloads } from '@/lib/utils';
import { getCategories, getCategory } from './service/categories';
import { Search } from 'lucide-react';

// 分类图标映射
const categoryIcons: Record<string, string> = {
  'ui-library': '🎨',
  'build-tools': '🔧',
  'testing': '🧪',
  'state-management': '📊',
  'data-fetching': '🌐',
  'utilities': '🛠️',
  'animation': '✨',
  'css': '🎨',
  'icon': '🎯',
  'image': '🖼️',
  'editor': '✏️',
  'dev-tools': '⚙️',
  'form-handling': '📝',
  'graphics': '🎮',
};

// 分类显示名称映射
const categoryNames: Record<string, string> = {
  'ui-library': 'UI Library',
  'build-tools': 'Build Tools',
  'testing': 'Testing',
  'state-management': 'State Management',
  'data-fetching': 'Data Fetching',
  'utilities': 'Utilities',
  'animation': 'Animation',
  'css': 'CSS',
  'icon': 'Icon Library',
  'image': 'Image',
  'editor': 'Editor',
  'dev-tools': 'Dev Tools',
  'form-handling': 'Form Handling',
  'graphics': 'Graphics',
};

interface PackageInfo {
  name: string;
  description: string;
  github: {
    url: string;
    stars: number;
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

export default async function Home() {
  const { categories } = await getCategories();

  // 加载所有分类的数据
  const allPackagesByCategory: Record<string, PackageInfo[]> = {};

  for (const category of categories) {
    try {
      const { data } = await getCategory(category);
      if (data && Array.isArray(data)) {
        // 按 stars 排序
        allPackagesByCategory[category] = data.sort((a, b) =>
          (b.github?.stars || 0) - (a.github?.stars || 0)
        );
      }
    } catch (error) {
      console.error(`Failed to load category ${category}:`, error);
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-transparent to-transparent dark:from-amber-900/10 dark:to-transparent' />
        <div className='container mx-auto px-4 py-16 md:py-24 relative'>
          <div className='text-center max-w-3xl mx-auto'>
            {/* Logo */}
            <div className='relative mx-auto mb-6 h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-xl shadow-amber-500/20'>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-5xl font-bold text-white'>JS</span>
              </div>
            </div>

            {/* Title */}
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              <span className='bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent'>
                JS Toolbox
              </span>
            </h1>

            {/* Description */}
            <p className='text-lg text-gray-600 dark:text-slate-300 mb-8'>
              Discover the best JavaScript packages for your next project
            </p>

            {/* Search Box */}
            <form action='/search' className='max-w-xl mx-auto'>
              <div className='relative group'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors' />
                <input
                  type='text'
                  name='q'
                  placeholder='Search packages...'
                  className='w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200'
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-12 md:py-16 bg-white dark:bg-slate-900'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center gap-2 mb-8'>
            <div className='h-8 w-1 bg-amber-500 rounded-full' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Categories</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {categories.map((category) => {
              const packages = allPackagesByCategory[category] || [];
              const topPackages = packages.slice(0, 3);

              if (topPackages.length === 0) return null;

              return (
                <CategoryCard
                  key={category}
                  category={category}
                  icon={categoryIcons[category] || '📦'}
                  name={categoryNames[category] || category}
                  packages={topPackages}
                  totalCount={packages.length}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-gray-500 dark:text-slate-400'>
          <p>© {new Date().getFullYear()} JS Toolbox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({
  category,
  icon,
  name,
  packages,
  totalCount,
}: {
  category: string;
  icon: string;
  name: string;
  packages: PackageInfo[];
  totalCount: number;
}) {
  return (
    <Link
      href={`/categories/${category}`}
      className='group block bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300'
    >
      {/* Header */}
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform'>
          {icon}
        </div>
        <div>
          <h3 className='font-semibold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors'>
            {name}
          </h3>
          <p className='text-xs text-gray-500 dark:text-slate-400'>
            {totalCount} packages
          </p>
        </div>
      </div>

      {/* Preview Packages */}
      <div className='space-y-2'>
        {packages.map((pkg) => (
          <div key={pkg.name} className='flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0'>
            <div className='flex-1 min-w-0 mr-3'>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-amber-500 transition-colors'>
                {pkg.name}
              </p>
              <p className='text-xs text-gray-400 dark:text-slate-500 truncate'>
                {formatDownloads(pkg.npm?.downloads || 0)} weekly
              </p>
            </div>
            <div className='flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500'>
              <span>⭐</span>
              <span>{pkg.github?.stars?.toLocaleString() || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className='mt-4 pt-3 border-t border-gray-100 dark:border-slate-700'>
        <span className='text-sm text-amber-500 font-medium flex items-center justify-center gap-1 group-hover:gap-2 transition-all'>
          View All {totalCount}+
          <span className='group-hover:translate-x-1 transition-transform'>→</span>
        </span>
      </div>
    </Link>
  );
}
