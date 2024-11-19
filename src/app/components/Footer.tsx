import Link from 'next/link';

export default function Footer() {
  return (
    <div className='mt-16 mb-8 w-full flex justify-center items-center'>
      Made with by &nbsp;
      <Link
        href='https://github.com/popring'
        className='text-amber-400 hover:underline'
      >
        popring
      </Link>
    </div>
  );
}
