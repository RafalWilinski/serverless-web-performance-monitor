import React from "react";
import useSWR from "swr";
import { groupBy } from "lodash";
import {
  BarChart,
  Bar,
  Cell,
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

  console.log(metricsData.metrics);

  return (
    <div className="App">
      <BarChart
        width={500}
        height={300}
        data={metricsData.metrics}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" stackId="a" fill="#8884d8" />
        <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default App;
