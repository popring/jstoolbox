import {
  TypographyH1,
  TypographyP,
} from '@/components/ui/typography';
import JSIcon from '../assets/js-icon.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
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
        <TypographyH1>ES Toolbox</TypographyH1>
        <TypographyP>
          Find actively maintained and popular libraries in the ECMAScript.
        </TypographyP>
      </div>
      <main className='p-10'>
        <div className='flex flex-col gap-4 mt-10 lg:gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
          {new Array(100).fill(0).map((_, idx) => (
            <Link
              key={idx}
              href='/categories/image'
              className='flex items-center py-4 px-5 rounded-lg shadow hover:bg-slate-50'
            >
              <TypographyP>Image</TypographyP>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
