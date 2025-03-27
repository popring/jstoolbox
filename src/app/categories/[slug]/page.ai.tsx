'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Github,
  Globe,
  Download,
  Star,
  Clock,
  Calendar,
  GitPullRequest,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Sample data based on the provided structure
const libraries = [
  {
    id: 1,
    name: 'framer-motion',
    description: 'A simple and powerful JavaScript animation library',
    npm: {
      name: 'framer-motion',
      url: 'https://www.npmjs.com/package/framer-motion',
      downloads: 22644095,
      firstReleased: '2019-01-14T13:04:29.347Z',
      lastReleased: '2025-02-14T15:16:41.321Z',
    },
    github: {
      url: 'https://github.com/motiondivision/motion',
      stars: 27313,
      issuesTotal: 254,
      issuesResolved: 0,
    },
    website: 'https://github.com/motiondivision/motion#readme',
  },
  {
    id: 2,
    name: 'animate.css',
    description: 'A cross-browser library of CSS animations',
    npm: {
      name: 'animate.css',
      url: 'https://www.npmjs.com/package/animate.css',
      downloads: 18744331,
      firstReleased: '2013-01-14T13:04:29.347Z',
      lastReleased: '2023-02-14T15:16:41.321Z',
    },
    github: {
      url: 'https://github.com/animate-css/animate.css',
      stars: 81318,
      issuesTotal: 120,
      issuesResolved: 90,
    },
    website: 'https://animate.style/',
  },
];

// Format date to show age in years or months
function formatAge(dateString: string) {
  const releaseDate = new Date(dateString);
  const now = new Date();
  const diffYears = now.getFullYear() - releaseDate.getFullYear();

  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`;
  } else {
    const diffMonths =
      now.getMonth() -
      releaseDate.getMonth() +
      (now.getFullYear() - releaseDate.getFullYear()) * 12;
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
  }
}

// Format date to show time since last release
function formatLastRelease(dateString: string) {
  const releaseDate = new Date(dateString);
  const now = new Date();

  // Check if the date is in the future (for the sample data)
  if (releaseDate > now) {
    return 'Coming soon';
  }

  const diffMonths =
    now.getMonth() -
    releaseDate.getMonth() +
    (now.getFullYear() - releaseDate.getFullYear()) * 12;

  if (diffMonths < 1) {
    const diffDays = Math.floor(
      (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
}

export default function AnimationCategory() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Prepare chart data from libraries
  const chartData = libraries.map((lib) => ({
    name: lib.name,
    downloads: lib.npm.downloads / 1000000, // Convert to millions for better display
  }));

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900'>
      <div className='container mx-auto px-4 py-12 max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <motion.h1
            className='text-6xl font-bold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent mb-4'
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
          >
            animation
          </motion.h1>
          <p className='text-zinc-400 text-lg max-w-2xl mx-auto'>
            Explore the most popular JavaScript animation libraries and tools to
            create stunning web animations
          </p>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mb-10'
        >
          <Card className='overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm'>
            <div className='p-6'>
              <h2 className='text-2xl font-semibold text-zinc-100 mb-4'>
                Downloads Comparison
              </h2>
              <p className='text-zinc-400 mb-6'>
                Total NPM downloads of popular animation libraries (in millions)
              </p>
              <div className='h-[400px] w-full'>
                {isLoaded && (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <XAxis
                        dataKey='name'
                        stroke='#525252'
                        tick={{ fill: '#a1a1aa' }}
                      />
                      <YAxis
                        stroke='#525252'
                        tick={{ fill: '#a1a1aa' }}
                        tickFormatter={(value) => `${value}M`}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${value}M downloads`,
                          'Downloads',
                        ]}
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #3f3f46',
                          borderRadius: '6px',
                        }}
                        labelStyle={{ color: '#e4e4e7' }}
                      />
                      <Bar
                        dataKey='downloads'
                        fill='url(#colorGradient)'
                        radius={[4, 4, 0, 0]}
                        barSize={60}
                        animationDuration={1500}
                      />
                      <defs>
                        <linearGradient
                          id='colorGradient'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='0%'
                            stopColor='#EAB308'
                            stopOpacity={1}
                          />
                          <stop
                            offset='100%'
                            stopColor='#CA8A04'
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Libraries Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className='text-2xl font-semibold text-zinc-100 mb-6 border-b border-zinc-800 pb-3'>
            Popular Libraries
          </h2>
          <div className='space-y-6'>
            {libraries.map((library, index) => (
              <motion.div
                key={library.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <LibraryCard library={library} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LibraryCard({ library }: { library: any }) {
  // Calculate issue resolution percentage
  const issueResolutionPercentage =
    library.github.issuesTotal > 0
      ? Math.round(
          (library.github.issuesResolved / library.github.issuesTotal) * 100
        )
      : 0;

  // Format dates
  const age = formatAge(library.npm.firstReleased);
  const lastRelease = formatLastRelease(library.npm.lastReleased);

  return (
    <Card className='overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-yellow-700 transition-all duration-300'>
      <div className='p-6'>
        <div className='flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6'>
          <div>
            <h3 className='text-2xl font-bold text-yellow-400 mb-2'>
              {library.name}
            </h3>
            <p className='text-zinc-300 mb-3'>{library.description}</p>
            <p className='text-zinc-400 text-sm truncate max-w-2xl'>
              {library.github.url}
            </p>
          </div>
          <div className='flex gap-2 shrink-0'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-yellow-400'
              onClick={() => window.open(library.github.url, '_blank')}
            >
              <Github className='h-4 w-4' />
              GitHub
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='gap-2 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-yellow-400'
              onClick={() => window.open(library.npm.url, '_blank')}
            >
              <Download className='h-4 w-4' />
              NPM
            </Button>
            {library.website && (
              <Button
                variant='outline'
                size='sm'
                className='gap-2 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-yellow-400'
                onClick={() => window.open(library.website, '_blank')}
              >
                <Globe className='h-4 w-4' />
                Website
              </Button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          <StatCard
            icon={<Download className='h-5 w-5 text-yellow-500' />}
            label='Downloads'
            value={library.npm.downloads.toLocaleString()}
          />
          <StatCard
            icon={<Star className='h-5 w-5 text-yellow-500' />}
            label='Stars'
            value={library.github.stars.toLocaleString()}
          />
          <StatCard
            icon={<Clock className='h-5 w-5 text-yellow-500' />}
            label='Age'
            value={age}
            tooltip={`First released on ${new Date(
              library.npm.firstReleased
            ).toLocaleDateString()}`}
          />
          <StatCard
            icon={<Calendar className='h-5 w-5 text-yellow-500' />}
            label='Last Release'
            value={lastRelease}
            tooltip={`Last released on ${new Date(
              library.npm.lastReleased
            ).toLocaleDateString()}`}
          />
        </div>

        {/* Issues Section */}
        <div className='bg-zinc-800/30 rounded-lg p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <GitPullRequest className='h-4 w-4 text-yellow-500' />
              <span className='text-zinc-300 font-medium'>Issues</span>
            </div>
            <Badge
              variant='outline'
              className={`${
                issueResolutionPercentage > 70
                  ? 'bg-green-900/20 text-green-400 border-green-800'
                  : issueResolutionPercentage > 30
                  ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800'
                  : 'bg-red-900/20 text-red-400 border-red-800'
              }`}
            >
              {issueResolutionPercentage}% Resolved
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 flex-1 bg-zinc-700 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-yellow-500 to-yellow-300'
                style={{ width: `${issueResolutionPercentage}%` }}
              ></div>
            </div>
            <span className='text-zinc-400 text-sm'>
              {library.github.issuesResolved}/{library.github.issuesTotal}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatCard({
  icon,
  label,
  value,
  tooltip,
}: {
  icon: any;
  label: any;
  value: any;
  tooltip?: string;
}) {
  return (
    <div
      className='bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-zinc-800 transition-colors duration-200'
      title={tooltip}
    >
      <div className='mb-2'>{icon}</div>
      <div className='text-xl font-bold text-zinc-100'>{value}</div>
      <div className='text-xs text-zinc-400'>{label}</div>
    </div>
  );
}
