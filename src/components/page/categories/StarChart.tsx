'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  star: {
    label: 'Star',
    color: 'rgb(251 191 36)',
  },
} satisfies ChartConfig;

interface Props {
  chartData: { packageName: string; star: number }[];
}

export default function StarChart({ chartData }: Props) {
  return (
    <div className='max-w-screen-xl m-0 max-h-96'>
      <ChartContainer
        className='overflow-hidden'
        config={chartConfig}
        responsiveContainerProps={{ maxHeight: 384 }}
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
