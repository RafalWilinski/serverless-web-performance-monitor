import React, { useState } from 'react';
import { Text } from 'rebass';
import { takeRight, groupBy } from 'lodash';
import BreakdownChart from './BreakdownChart';
import { BarLoader } from 'react-spinners';
import TotalResponseTimeChart from './TotalResponseTimeChart';
import TimeRangePicker from './TimeRangePicker';
import timeRanges from './timeRanges';
import everyNth from './everyNth';

interface ProjectDetailsProps {
  metricsData?: any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ metricsData }: ProjectDetailsProps) => {
  const [takeEveryCount, setTakeEvery] = useState(1);
  const [takeRightCount, setTakeRight] = useState(32);

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
    timings: everyNth(
      takeRight(
        regionGrouppedMetrics[regionName].map((metric: any) => ({
          name: metric.date,
          ...metric.timings,
        })),
        takeRightCount,
      ),
      takeEveryCount,
    ),
    health: everyNth(
      takeRight(
        regionGrouppedMetrics[regionName].map((metric: any) => ({
          name: metric.date,
          status: metric.value,
        })),
        takeRightCount,
      ),
      takeEveryCount,
    ),
  }));

  const onRangeChange = (rangeName: string) => {
    console.log(rangeName);

    const tr = timeRanges.find((timeRange) => timeRange.name === rangeName);
    setTakeEvery(tr!.takeEvery);
    setTakeRight(tr!.takeRightCount);
  };

  return (
    <div>
      {metricsPerRegion.map((region) => (
        <div key={region.name}>
          <Text fontSize={[3]} color="primary">
            Region: {region.name}
          </Text>
          <TimeRangePicker options={timeRanges.map((t) => t.name)} onChange={onRangeChange} />
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
