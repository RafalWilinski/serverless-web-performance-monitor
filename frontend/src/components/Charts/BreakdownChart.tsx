import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Region from "../../types/Region";

const bars = ["connect", "download", "firstByte"];

interface BreakdownChartProps {
  region: Region;
}

const colors = ["#3683f7", "#af66de", "#f02ac5"];

const BreakdownChart: React.FC<BreakdownChartProps> = (
  props: BreakdownChartProps
) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={props.region.timings}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <XAxis dataKey="date" tick={false} />
      <YAxis />
      <Tooltip />
      <Legend />
      {bars.map((bar: string, index: number) => (
        <Bar dataKey={bar} stackId="a" key={bar} fill={`${colors[index]}`} />
      ))}
    </BarChart>
  );
};

export default BreakdownChart;
