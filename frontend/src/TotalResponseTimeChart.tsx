import React from 'react';
import { BarChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Region from './types/Region';

interface TotalResponseTimeChart {
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
      <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
    </BarChart>
  );
};

export default BreakdownChart;
