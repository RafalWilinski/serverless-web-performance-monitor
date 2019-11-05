import React from 'react';
import { Text } from 'rebass';
import { takeRight, groupBy } from 'lodash';
import BreakdownChart from './BreakdownChart';
import { BarLoader } from 'react-spinners';
import TotalResponseTimeChart from './TotalResponseTimeChart';

interface ProjectDetailsProps {
  metricsData?: any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ metricsData }: ProjectDetailsProps) => {
  if (!metricsData) {
    return (
      <div style={{ margin: 20 }}>
        <BarLoader color="#4A90E2" />
      </div>
    );
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

  return (
    <div>
      {metricsPerRegion.map((region) => (
        <div key={region.name}>
          <Text fontSize={[3]} color="primary">
            Region: {region.name}
          </Text>
          <Text fontSize={[2]} color="primary">
            Response Times in time
          </Text>
          <TotalResponseTimeChart region={region} />
          <Text fontSize={[2]} color="primary">
            Request Breakdown
          </Text>
          <BreakdownChart region={region} />
        </div>
      ))}
    </div>
  );
};

export default ProjectDetails;
