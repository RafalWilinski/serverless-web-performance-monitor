import React, { useState } from "react";
import { Text, Box, Flex } from "rebass";
import { takeRight, groupBy } from "lodash";
import BreakdownChart from "./Charts/BreakdownChart";
import { BarLoader } from "react-spinners";
import TotalResponseTimeChart from "./Charts/TotalResponseTimeChart";
import TimeRangePicker from "./TimeRangePicker";
import timeRanges from "../consts/timeRanges";
import everyNth from "../utils/everyNth";

interface ProjectDetailsProps {
  metricsData?: any;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  metricsData
}: ProjectDetailsProps) => {
  const [takeEveryCount, setTakeEvery] = useState(1);
  const [takeRightCount, setTakeRight] = useState(12);

  if (!metricsData) {
    return (
      <div style={{ margin: 20 }}>
        <BarLoader color="#4A90E2" />
      </div>
    );
  }

  const regionGrouppedMetrics = groupBy(metricsData.metrics, "region");
  const metricsPerRegion = Object.keys(regionGrouppedMetrics).map(
    regionName => ({
      name: regionName,
      timings: everyNth(
        takeRight(
          regionGrouppedMetrics[regionName].map((metric: any) => ({
            name: new Date(parseInt(metric.date)).toLocaleTimeString(),
            ...metric.timings
          })),
          takeRightCount
        ),
        takeEveryCount
      ),
      health: everyNth(
        takeRight(
          regionGrouppedMetrics[regionName].map((metric: any) => ({
            name: new Date(parseInt(metric.date)).toLocaleTimeString(),
            status: metric.value
          })),
          takeRightCount
        ),
        takeEveryCount
      )
    })
  );

  const onRangeChange = (rangeName: string) => {
    const tr = timeRanges.find(timeRange => timeRange.name === rangeName);

    setTakeEvery(tr!.takeEvery);
    setTakeRight(tr!.takeRightCount);
  };

  return (
    <Flex flexWrap="wrap" mx={-2} px={2}>
      {metricsPerRegion.map(region => (
        <Box key={region.name} width={[1, 1, 1 / 2]} px={2}>
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={[2]} color="primary" my={2}>
              Region: {region.name}
            </Text>
            <TimeRangePicker
              options={timeRanges.map(t => t.name)}
              onChange={onRangeChange}
            />
          </Flex>
          <Text fontSize={[1]} color="secondary">
            Response Times in time
          </Text>
          <TotalResponseTimeChart region={region} />
          <Text fontSize={[1]} color="secondary">
            Request Breakdown
          </Text>
          <BreakdownChart region={region} />
        </Box>
      ))}
    </Flex>
  );
};

export default ProjectDetails;
