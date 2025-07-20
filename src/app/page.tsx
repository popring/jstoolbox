import {
  // ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
// import { LinkButton } from '@/components/ui/link-button';
import { formatDownloads } from '@/lib/utils';
import { getCategories } from './service/categories';

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

// 分类描述映射
const categoryDescriptions: Record<string, string> = {
  'ui-library': 'UI component libraries',
  'build-tools': 'Build and bundling tools',
  'testing': 'Testing frameworks & tools',
  'state-management': 'State management solutions',
  'data-fetching': 'Data fetching libraries',
  'utilities': 'Utility libraries',
  'animation': 'Animation libraries',
  'css': 'CSS frameworks & tools',
  'icon': 'Icon libraries',
  'image': 'Image handling libraries',
  'editor': 'Rich text editors',
  'dev-tools': 'Development tools',
  'form-handling': 'Form handling libraries',
  'graphics': 'Graphics & 3D libraries',
};

export default async function Home() {
  // 获取所有分类
  const { categories } = await getCategories();

  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-slate-900'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 pt-28 pb-16 text-center'>
        <div className='animate-fade-in-up'>
          <div className='relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-xl bg-yellow-400 shadow-lg shadow-yellow-400/20'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-6xl font-bold text-black'>JS</span>
            </div>
          </div>

          <h1 className='mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl'>
            JS Toolbox
          </h1>

          <p className='mx-auto mb-8 max-w-2xl text-lg text-slate-300 sm:text-xl'>
            Find the perfect JavaScript packages to enhance your development
            workflow
          </p>

        </div>

        {/* Categories */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {categories.map((category) => (
            <CategoryCard
              key={category}
              href={`/categories/${category}`}
              title={category}
              icon={categoryIcons[category] || '📦'}
              description={categoryDescriptions[category] || 'JavaScript tools'}
            />
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className='container mx-auto px-4 py-16'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-white'>Featured Packages</h2>
          {/* <Link
            href='/featured'
            className='flex items-center text-sm text-yellow-400 hover:text-yellow-300'
          >
            View all <ChevronRight className='ml-1 h-4 w-4' />
          </Link> */}
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <FeaturedCard
            title='three'
            description='3D library that makes WebGL easy to use'
            stars={88000}
            category='Animation'
          />
          <FeaturedCard
            title='tailwind'
            description='Utility-first CSS framework for rapid UI development'
            stars={72000}
            category='CSS'
          />
          <FeaturedCard
            title='react-query'
            description='Hooks for fetching, caching and updating data'
            stars={35000}
            category='Data Fetching'
          />
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t border-slate-800 bg-black py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-slate-500'>
          <p>© {new Date().getFullYear()} JS Toolbox. All rights reserved.</p>
          {/* <div className='mt-2 flex justify-center space-x-4'>
            <LinkButton
              href='/about'
              variant='ghost'
              size='sm'
              className='text-slate-500 hover:text-slate-300 p-0 h-auto'
            >
              About
            </LinkButton>
            <LinkButton
              href='/contact'
              variant='ghost'
              size='sm'
              className='text-slate-500 hover:text-slate-300 p-0 h-auto'
            >
              Contact
            </LinkButton>
            <LinkButton
              href='/privacy'
              variant='ghost'
              size='sm'
              className='text-slate-500 hover:text-slate-300 p-0 h-auto'
            >
              Privacy
            </LinkButton>
          </div> */}
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({
  href,
  title,
  icon,
  description,
}: {
  href: string;
  title: string;
  icon: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className='group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-yellow-500/5'
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-black text-2xl'>
          {icon}
        </div>
        <h3 className='mb-1 font-medium text-white capitalize'>{title.replace('-', ' ')}</h3>
        <p className='text-xs text-slate-400'>{description}</p>
      </div>
      <div className='absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover:w-full'></div>
    </Link>
  );
}

function FeaturedCard({
  title,
  description,
  stars,
  category,
}: {
  title: string;
  description: string;
  stars: number;
  category: string;
}) {
  return (
    <div className='overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:border-slate-700 hover:shadow-lg'>
      <div className='p-6'>
        <div className='mb-1 text-xs font-medium text-yellow-500'>
          {category}
        </div>
        <h3 className='mb-2 text-xl font-semibold text-white'>{title}</h3>
        <p className='mb-4 text-sm text-slate-400'>{description}</p>
        <div className='flex items-center text-xs text-slate-500'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mr-1 h-4 w-4 fill-current text-yellow-500'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          {formatNumber(stars)} stars
        </div>
      </div>
      <div className='flex items-center justify-between border-t border-slate-800 px-6 py-3'>
        <span className='text-xs text-slate-500'>
          Weekly downloads: {formatDownloads(Math.floor(stars * 7.5))}
        </span>
      </div>
    </div>
  );
}

function formatNumber(num: number) {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
}
