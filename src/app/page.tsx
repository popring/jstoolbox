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

  // 加载所有分类的数据用于获取 Featured 和各分类 Top 3
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

  // 获取 Featured 包（所有分类中 stars 最高的 3 个）
  const allPackages = Object.values(allPackagesByCategory).flat();
  const featuredPackages = allPackages
    .sort((a, b) => (b.github?.stars || 0) - (a.github?.stars || 0))
    .slice(0, 3);

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
              Discover the best JavaScript packages to enhance your development workflow
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

      {/* Featured Section */}
      <section className='py-12 md:py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center gap-2 mb-8'>
            <div className='h-8 w-1 bg-amber-500 rounded-full' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Featured</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {featuredPackages.map((pkg, index) => (
              <FeaturedCard key={pkg.name} package={pkg} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-12 md:py-16 bg-white dark:bg-slate-900'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center gap-2 mb-8'>
            <div className='h-8 w-1 bg-amber-500 rounded-full' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Browse by Category</h2>
          </div>

          <div className='space-y-12'>
            {categories.map((category) => {
              const packages = allPackagesByCategory[category] || [];
              const top3Packages = packages.slice(0, 3);

              if (top3Packages.length === 0) return null;

              return (
                <CategorySection
                  key={category}
                  category={category}
                  icon={categoryIcons[category] || '📦'}
                  name={categoryNames[category] || category}
                  packages={top3Packages}
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

function FeaturedCard({ package: pkg, index }: { package: PackageInfo; index: number }) {
  return (
    <Link
      href={pkg.github?.url || pkg.npm?.url || '#'}
      target='_blank'
      rel='noopener noreferrer'
      className='group block bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 hover:-translate-y-1'
    >
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold ${
            index === 0 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
            index === 1 ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400' :
            'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
          }`}>
            {index + 1}
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors'>
              {pkg.name}
            </h3>
            <p className='text-xs text-gray-500 dark:text-slate-400'>
              ⭐ {pkg.github?.stars?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      <p className='text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mb-4'>
        {pkg.description || 'No description'}
      </p>

      <div className='flex items-center justify-between text-xs text-gray-500 dark:text-slate-400'>
        <span>{formatDownloads(pkg.npm?.downloads || 0)} weekly</span>
        <span className='group-hover:translate-x-1 transition-transform'>→</span>
      </div>
    </Link>
  );
}

function CategorySection({
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
    <div>
      {/* Category Header */}
      <div className='flex items-center justify-between mb-6'>
        <Link
          href={`/categories/${category}`}
          className='flex items-center gap-3 group'
        >
          <div className='w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform'>
            {icon}
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors'>
              {name}
            </h3>
            <p className='text-sm text-gray-500 dark:text-slate-400'>
              {totalCount} packages
            </p>
          </div>
        </Link>

        <Link
          href={`/categories/${category}`}
          className='text-sm text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-medium flex items-center gap-1'
        >
          View All
          <span className='group-hover:translate-x-1 transition-transform'>→</span>
        </Link>
      </div>

      {/* Top 3 Packages */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {packages.map((pkg) => (
          <PackageCard key={pkg.name} package={pkg} />
        ))}
      </div>
    </div>
  );
}

function PackageCard({ package: pkg }: { package: PackageInfo }) {
  return (
    <Link
      href={pkg.github?.url || pkg.npm?.url || '#'}
      target='_blank'
      rel='noopener noreferrer'
      className='group block bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200'
    >
      <div className='flex items-start justify-between mb-2'>
        <h4 className='font-medium text-gray-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors'>
          {pkg.name}
        </h4>
      </div>

      <p className='text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-3'>
        {pkg.description || 'No description'}
      </p>

      <div className='flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500'>
        <span className='flex items-center gap-1'>
          ⭐ {pkg.github?.stars?.toLocaleString() || 0}
        </span>
        <span>{formatDownloads(pkg.npm?.downloads || 0)}/wk</span>
      </div>
    </Link>
  );
}
