import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Metadata } from 'next';
// import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';
import { Header } from '@/components/page/Header';
import StructuredData from './structured-data';
import Script from 'next/script';
// import Footer from '@/components/page/Footer';

dayjs.extend(relativeTime);

// SEO metadata for English version
export const metadata: Metadata = {
  title: {
    default: 'JS Toolbox - JavaScript Tools & Libraries Collection',
    template: '%s | JS Toolbox'
  },
  description: 'Discover the best JavaScript tools and libraries to boost your development efficiency. Comprehensive collection of UI libraries, build tools, testing frameworks, and more.',
  keywords: ['JavaScript', 'JS', 'tools', 'libraries', 'frontend', 'development', 'UI', 'build tools', 'testing frameworks', 'web development', 'npm packages'],
  authors: [{ name: 'JS Toolbox Team' }],
  creator: 'JS Toolbox',
  publisher: 'JS Toolbox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://js-toolbox-ten.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://js-toolbox-ten.vercel.app',
    title: 'JS Toolbox - JavaScript Tools & Libraries Collection',
    description: 'Discover the best JavaScript tools and libraries to boost your development efficiency.',
    siteName: 'JS Toolbox',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JS Toolbox - JavaScript Tools & Libraries Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JS Toolbox - JavaScript Tools & Libraries Collection',
    description: 'Discover the best JavaScript tools and libraries to boost your development efficiency.',
    images: ['/og-image.png'],
    creator: '@jstoolbox',
    site: '@jstoolbox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
  classification: 'JavaScript Development Tools',
  other: {
    'theme-color': '#0f172a',
    'msapplication-TileColor': '#0f172a',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'JS Toolbox',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="google-site-verification" content="X8RWmwG_4GCnTnhgEAhdQnGaS9K5piQdIx_QqYkDYlQ" />
      </head>
      {/* Google tag (gtag.js) */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-EVXMWG8Q3Z"></Script>
      <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EVXMWG8Q3Z');
        `
      }} />
      <body>
        <StructuredData />
        <Header />
          <div className='bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'>
            {children}
          </div>
      </body>
    </html>
  );
}
