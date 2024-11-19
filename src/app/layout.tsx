import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

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
        <Header />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        
        <Footer />
      </body>
    </html>
  );
}
