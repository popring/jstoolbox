import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { PackageInfo } from '@/app/types/categories';

import { NPMIcon } from '@/assets/index';
import GithubIcon from '@/assets/github-icon.svg';
import GlobalAltIcon from '@/assets/global-alt.svg';
import dayjs from 'dayjs';

interface Props {
  info: PackageInfo;
}

export default function PackageItem(props: Props) {
  const { name, description, npm, website, github } = props.info;

  const renderUrlList = () => {
    const list = [
      {
        name: npm.name,
        key: 'npm',
        icon: NPMIcon,
        iconWidth: 40,
        url: npm.url,
      },
      {
        name: github.url.split('https://github.com/')[1] || name + ' | npm',
        key: 'github',
        icon: GithubIcon,
        iconHeight: 20,
        url: github.url,
      },
      {
        name: 'Website',
        key: 'website',
        icon: GlobalAltIcon,
        iconHeight: 20,
        url: website,
      },
    ];

    return (
      <div className='flex flex-wrap gap-x-4 items-center mt-6 text-slate-200'>
        {list.map((item, idx) => (
          <Link
            href={item.url}
            key={idx}
            target='_blank'
            className='flex gap-2 px-3 py-1 rounded-md  hover:bg-amber-900/50'
          >
            <Image
              className='text-slate-600'
              src={item.icon}
              alt={item.name}
              width={item.iconWidth}
              height={item.iconHeight}
            />
            <div>{item.name}</div>
          </Link>
        ))}
      </div>
    );
  };

  const renderTags = () => {
    const tags = [
      {
        label: 'Downloads',
        value: npm.downloads.toLocaleString(),
      },
      {
        label: 'Stars',
        value: github.stars.toLocaleString(),
      },
      // {
      //   label: 'Issus closure rate',
      //   value:
      //     ((github.issusResolved / github.issusTotal) * 100).toFixed(2) + '%',
      // },
      {
        label: 'Age',
        value: dayjs(npm.firstReleased).toNow(true),
      },
      {
        label: 'Last release',
        value: dayjs(npm.lastReleased).toNow(true),
      },
    ];

    return (
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
        {tags.map((item) => (
          <div
            className='flex flex-col justify-center items-center p-2 rounded-lg bg-slate-800/30'
            key={item.label}
          >
            <div className='font-semibold text-sm md:text-lg text-slate-200'>
              {item.label}
            </div>
            <div className='text-sm md:text-md text-slate-300'>{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className='p-4  bg-slate-800/50 text-slate-600 backdrop-blur-sm  border-slate-700'>
      <div className='text-2xl text-slate-200'>{name}</div>
      <div className='mt-1 text-slate-300 break-words'>{description}</div>

      {renderUrlList()}

      {renderTags()}
    </Card>
  );
}
