import React, { useState } from 'react';
import { Text, Box, Flex } from 'rebass';
import { takeRight, groupBy } from 'lodash';
import BreakdownChart from './Charts/BreakdownChart';
import { BarLoader } from 'react-spinners';
import TotalResponseTimeChart from './Charts/TotalResponseTimeChart';
import TimeRangePicker from './TimeRangePicker';
import timeRanges from '../consts/timeRanges';
import everyNth from '../utils/everyNth';

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
    <Flex flexWrap="wrap" mx={-2}>
      {metricsPerRegion.map((region) => (
        <Box key={region.name} width={[1, 1, 1 / 2]} px={2}>
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
        </Box>
      ))}
    </Flex>
  );
};

export default ProjectDetails;
