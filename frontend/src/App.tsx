import React, { useState } from 'react';
import useSWR from 'swr';
import { takeRight, groupBy } from 'lodash';
import { Text, Box } from 'rebass';
import BreakdownChart from './BreakdownChart';
import HealthChart from './HealthChart';

const apiUrl = 'https://mte4gv5azj.execute-api.us-east-1.amazonaws.com/prod';

const _fetch = (query: string) => fetch(`${apiUrl}${query}`).then((res) => res.json());

const App: React.FC = () => {
  const [currentProjectId, setCurrentProjectId] = useState(0);
  const { data } = useSWR('/projects', _fetch);
  const { data: metricsData, error } = useSWR(() => `/metrics?id=${currentProjectId}`, _fetch);

  console.log(!data || !metricsData);

  if (!data || !metricsData) {
    return <div>Loading...</div>;
  }

  const regionGrouppedMetrics = groupBy(metricsData.metrics, 'region');
  const metricsPerRegion = Object.keys(regionGrouppedMetrics).map((regionName) => ({
    name: regionName,
    timings: regionGrouppedMetrics[regionName].map((metric: any) => ({
      name: metric.date,
      ...metric.timings,
    })),
    health: regionGrouppedMetrics[regionName].map((metric: any) => ({
      name: metric.date,
      status: metric.value,
    })),
  }));

  console.log(metricsPerRegion);

  return (
    <div className="App">
      {data.projects.map((project: any) => (
        <Box onClick={() => setCurrentProjectId(project.id)}>
          {project.id} - {project.endpoint}
        </Box>
      ))}
      {metricsPerRegion.map((region) => (
        <div key={region.name}>
          <Text fontSize={[2]} color="primary">
            {region.name}
          </Text>
          <BreakdownChart region={region} />
          <HealthChart region={region} />
        </div>
      ))}
    </div>
  );
};

export default App;
