import React from 'react';
import useSWR from 'swr';
import { takeRight } from 'lodash';
import colorConvert from 'color-convert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const apiUrl = 'https://mte4gv5azj.execute-api.us-east-1.amazonaws.com/prod';

const _fetch = (query: string) => fetch(`${apiUrl}${query}`).then((res) => res.json());

const App: React.FC = () => {
  const { data } = useSWR('/projects', _fetch);
  const { data: metricsData, error } = useSWR(() => `/metrics?id=${data.projects[0].id}`, _fetch);

  if (!data || !metricsData) {
    return <div>Loading...</div>;
  }

  const chartData = takeRight(
    metricsData.metrics.map((metric: any) => ({
      name: metric.date,
      ...metric.timings,
    })),
    72,
  );

  const bars = ['total', 'dns', 'connect', 'tcp', 'firstByte'];

  return (
    <div className="App">
      <BarChart
        width={600}
        height={300}
        data={chartData as any[]}
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
    </div>
  );
};

export default App;
