import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Region from "../../types/Region";

interface ResponseTimeDistributionChartProps {
  region: Region;
}

const ResponseTimeDistributionChart: React.FC<ResponseTimeDistributionChartProps> = (
  props: ResponseTimeDistributionChartProps
) => {
  const histogram = props.region.histogram.map(bin => ({
    value: bin.length,
    name: (bin[bin.length - 1] || 0).toFixed(2)
  }));

  return (
    <BarChart width={600} height={300} data={histogram}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#3683f7" />
    </BarChart>
  );
};

export default ResponseTimeDistributionChart;
