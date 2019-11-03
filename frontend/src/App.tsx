import React from "react";
import useSWR from "swr";
import colorConvert from "color-convert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const apiUrl = "https://mte4gv5azj.execute-api.us-east-1.amazonaws.com/prod";

const _fetch = (query: string) =>
  fetch(`${apiUrl}${query}`).then(res => res.json());

const App: React.FC = () => {
  const { data } = useSWR("/projects", _fetch);
  const { data: metricsData, error } = useSWR(
    () => `/metrics?id=${data.projects[0].id}`,
    _fetch
  );

  if (!data || !metricsData) {
    return <div>Loading...</div>;
  }

  const chartData = metricsData.metrics.map((metric: any) => ({
    name: metric.date,
    ...metric.timings
  }));

  const bars = [
    "total",
    "dns",
    "connect",
    "tcp",
    "firstByte",
    "response",
    "lookup"
  ];

  return (
    <div className="App">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.map((bar: string, index: number) => (
          <Bar
            dataKey={bar}
            stackId="a"
            fill={`#${colorConvert.hsl.hex([100 + index * 45, 70, 50])}`}
          />
        ))}
      </BarChart>
    </div>
  );
};

export default App;
