import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';
// import Header from './components/Header';
import Footer from '@/components/page/Footer';

dayjs.extend(relativeTime);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        {/* <Header /> */}
        {/* ThemeProvider 报错 */}
        {/* <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        > */}
          <NextIntlClientProvider messages={messages}>
            <div className='bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'>
              {children}
              <Footer />
            </div>
          </NextIntlClientProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
