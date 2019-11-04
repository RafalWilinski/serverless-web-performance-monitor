import React from 'react';
import colorConvert from 'color-convert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Region from './types/Region';

const bars = ['total', 'dns', 'connect', 'firstByte'];

interface BreakdownChartProps {
  region: Region;
}

const BreakdownChart: React.FC<BreakdownChartProps> = (props: BreakdownChartProps) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={props.region.timings}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis dataKey="date" tick={false} />
      <YAxis />
      <Tooltip />
      <Legend />
      {bars.map((bar: string, index: number) => (
        <Bar
          dataKey={bar}
          stackId="a"
          key={bar}
          fill={`#${colorConvert.hsl.hex([100 + index * 45, 70, 50])}`}
        />
      ))}
    </BarChart>
  );
};

export default BreakdownChart;
