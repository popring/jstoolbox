import { TypographyH1, TypographyP } from '@/components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import JSIcon from '@/assets/js-icon.svg';
import { WrenchIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const categories = new Array(100).fill(0);
  return (
    <div>
      <div className='flex flex-col justify-center items-center relative h-48'>
        <Image
          alt='icon'
          src={JSIcon}
          width={150}
          height={150}
          className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none'
        />
        <TypographyH1>{t('title')}</TypographyH1>
        <TypographyP>{t('about')}</TypographyP>
      </div>
      <main className='p-10'>
        <div className='flex flex-col gap-4 mt-10 lg:gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((_, idx) => (
            <Link
              key={idx}
              href='/categories/image'
              className='flex items-center py-4 px-5 rounded-lg shadow hover:bg-amber-100 transition-all text-slate-700'
            >
              <WrenchIcon className='size-5' />
              <span className='ml-2'>Image</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
