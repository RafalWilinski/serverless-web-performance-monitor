import React from 'react';
import { Line, XAxis, YAxis, Tooltip, Legend, LineChart } from 'recharts';
import Region from './types/Region';

interface TotalResponseTimeChartProps {
  region: Region;
}

const TotalResponseTimeChart: React.FC<TotalResponseTimeChartProps> = (
  props: TotalResponseTimeChartProps,
) => {
  console.log(props.region);
  return (
    <LineChart
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
      <Line type="monotone" dataKey="total" stroke="#ff0000" activeDot={{ r: 2 }} dot={false} />
    </LineChart>
  );
};

export default TotalResponseTimeChart;
