// import { request } from './request';

// const API = {
//   GET_CATEGORIES: '/api/categories/{slug}',
// };

import { PackageInfo } from '@/app/types/categories';

const categories: PackageInfo[] = [
  {
    id: 1,
    name: 'puppeteer',
    description: 'A high-level API to control headless Chrome over the DevTools Protocol',
    npm: {
      name: 'puppeteer',
      url: 'https://www.npmjs.com/package/puppeteer',
      downloads: 253295990,
      firstReleased: '2022-05-25T00:00:00.000Z',
      lastReleased: '2024-05-25T00:00:00.000Z',
    },
    github: {
      url: 'https://github.com/puppeteer/puppeteer',
      stars: 253295,
      issusTotal: 839242,
      issusResolved: 253295,
    },
    website: 'https://pptr.dev/',
  },
  {
    id: 2,
    name: 'axios',
    description: 'A promise-based HTTP client for the browser and Node.js',
    npm: {
      name: 'axios',
      url: 'https://www.npmjs.com/package/axios',
      downloads: 753250123,
      firstReleased: '2016-04-01T00:00:00.000Z',
      lastReleased: '2024-06-01T00:00:00.000Z',
    },
    github: {
      url: 'https://github.com/axios/axios',
      stars: 105320,
      issusTotal: 32890,
      issusResolved: 15232,
    },
    website: 'https://axios-http.com/',
  },
  {
    id: 3,
    name: 'lodash',
    description: 'A modern JavaScript utility library delivering modularity, performance & extras',
    npm: {
      name: 'lodash',
      url: 'https://www.npmjs.com/package/lodash',
      downloads: 1534567890,
      firstReleased: '2012-04-23T00:00:00.000Z',
      lastReleased: '2024-07-12T00:00:00.000Z',
    },
    github: {
      url: 'https://github.com/lodash/lodash',
      stars: 56432,
      issusTotal: 1234,
      issusResolved: 978,
    },
    website: 'https://lodash.com/',
  },
  {
    id: 4,
    name: 'react',
    description: 'A JavaScript library for building user interfaces',
    npm: {
      name: 'react',
      url: 'https://www.npmjs.com/package/react',
      downloads: 2045678901,
      firstReleased: '2013-05-29T00:00:00.000Z',
      lastReleased: '2024-09-15T00:00:00.000Z',
    },
    github: {
      url: 'https://github.com/facebook/react',
      stars: 204567,
      issusTotal: 90543,
      issusResolved: 54321,
    },
    website: 'https://reactjs.org/',
  },
  {
    id: 5,
    name: 'vite',
    description: 'A fast build tool that aims to provide a leaner development experience for modern web projects',
    npm: {
      name: 'vite',
      url: 'https://www.npmjs.com/package/vite',
      downloads: 123456789,
      firstReleased: '2020-06-02T00:00:00.000Z',
      lastReleased: '2024-08-21T00:00:00.000Z',
    },
    github: {
      url: 'https://github.com/vitejs/vite',
      stars: 69420,
      issusTotal: 12456,
      issusResolved: 7890,
    },
    website: 'https://vitejs.dev/',
  },
]
function getCategories(slug: string): Promise<{data: PackageInfo[], slug: string}> {
  // return request(API.GET_CATEGORIES, { method: 'GET', params: { slug } });
  return Promise.resolve({
    data: categories,
    slug,
  })
}

export { getCategories };
