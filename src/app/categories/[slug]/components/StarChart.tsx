'use client';

// import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
// const chartData = [
//   { packageName: 'svg1', star: 333 },
//   { packageName: 'icon-font', star: 253 },
//   { packageName: 'hero-icons', star: 233 },
//   { packageName: 'mui-icon', star: 100 },
//   { packageName: 'vant-icon', star: 80 },
//   { packageName: 'antd-icon', star: 10 },
// ];

const chartConfig = {
  star: {
    label: 'Star',
    color: 'rgb(251 191 36)',
  },
} satisfies ChartConfig;

interface Props {
  chartData: { packageName: string; star: number }[];
}

export default function StarChart({chartData}: Props) {
  return (
    <div className='max-w-screen-xl m-0'>
      <ChartContainer
        className='overflow-hidden'
        config={chartConfig}
        responsiveContainerProps={{ height: 400 }}
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='packageName'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
          <Bar dataKey='star' fill='var(--color-star)' radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
