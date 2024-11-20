import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const languageTextMap: Record<string, string> = {
  en: 'English',
  zh: '简体中文',
};

// const languageMap: Record<string, string> = {
//   zh: 'zh',
//   'zh-CN': 'zh',
//   'zh-TW': 'zh',
//   en: 'en',
//   'en-US': 'en',
//   'en-GB': 'en',
//   'en-AU': 'en',
//   'en-CA': 'en',
//   'en-IE': 'en',
//   'en-NZ': 'en',
// };

async function getLocale() {
  let locale: string = (await cookies()).get('locale')?.value || '';
  if (!locale) {
    locale = (await headers()).get('accept-language')?.split(',')[0] || '';
  }

  // return languageMap[locale] || 'en';
  return 'en'
}

export default getRequestConfig(async () => {
  const locale = await getLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

export async function setLocale(locale: string) {
  (await cookies()).set('locale', locale);
}