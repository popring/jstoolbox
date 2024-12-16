import Link from 'next/link';

export default function Footer() {
  return (
    <div className='w-full flex justify-center items-center py-8 text-slate-400 bg-gradient-to-b from-transparent to-slate-950'>
      Made with by &nbsp;
      <Link
        href='https://github.com/popring'
        className='text-[#f7df1e] hover:text-amber-400 transition-colors duration-300'
      >
        popring
      </Link>
    </div>
  );
}
