import { languageTextMap } from '@/i18n/request';
import { getLocale } from 'next-intl/server';
import LanguageSelect from './LanguageSelect';

export default async function Header() {
  const languageOptions = Object.keys(languageTextMap).map((language) => ({
    value: language,
    label: languageTextMap[language],
  }));

  const locale = await getLocale();

  return (
    <header className='w-full h-16'>
      <div className='flex justify-end relative items-center h-full pr-5'>
        <LanguageSelect languageOptions={languageOptions} defaultLocale={locale} />
      </div>
    </header>
  );
}
