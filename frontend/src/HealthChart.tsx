import React from 'react';
import { LineChart, Line } from 'recharts';
import Region from './types/Region';

interface HealthChartProps {
  region: Region;
}

const HealthChart: React.FC<HealthChartProps> = (props: HealthChartProps) => {
  return (
    <LineChart width={600} height={100} data={props.region.health}>
      <Line type="monotone" dataKey="status" stroke="#ff0000" strokeWidth={2} />
    </LineChart>
  );
};

export default HealthChart;
