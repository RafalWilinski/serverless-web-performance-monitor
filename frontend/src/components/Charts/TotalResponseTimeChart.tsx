import React from 'react';
import { Line, XAxis, YAxis, Tooltip, LineChart } from 'recharts';
import Region from '../../types/Region';

interface TotalResponseTimeChartProps {
  region: Region;
}

const TotalResponseTimeChart: React.FC<TotalResponseTimeChartProps> = (
  props: TotalResponseTimeChartProps,
) => {
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
      <Line type="monotone" dataKey="total" stroke="#4A90E2" activeDot={{ r: 2 }} dot={false} />
    </LineChart>
  );
};

export default TotalResponseTimeChart;
