import { useTranslations } from 'next-intl';
import { use } from 'react';

import {
   TypographyH3,
  TypographyP,
} from '@/components/ui/typography';

import StarChart from './components/StarChart';
import PackageItem from './components/PackageItem';

import { getCategories } from '@/app/service/categories';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage(props: Props) {
  const params = use(props.params);
  const t = useTranslations('CategoryPage');

  const res =  use(getCategories(params.slug));

  const packageInfoList = res.data;
  const chartData = packageInfoList.map((item) => ({
    packageName: item.name,
    star: item.github.stars,
  }));

  return (
    <div>
      <div className='flex flex-col justify-end items-center'>
        <TypographyH3>
          {t('title')} {params.slug}
        </TypographyH3>
        <TypographyP>展示 {params.slug} 的所有相关包</TypographyP>

        <div className='mt-2 w-5/6 flex flex-col gap-6'>
          <StarChart chartData={chartData} />

          <div className='flex flex-col gap-3'>
            {packageInfoList.map((item) => (
              <PackageItem key={item.id} info={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
