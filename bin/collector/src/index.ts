import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as request from "request-promise-native";
import "source-map-support/register";
import Project from "../../types/Project";
import MetricsDatapoint from "../../types/MetricsDatapoint";
import response from "./utils/lambdaResponse";

const [, , , region, , resourceTypeId] = process.env.PROJECTS_TABLE_ARN!.split(
  ":"
);
const TableName = resourceTypeId.split("/")[1];
const dynamoDB = new DynamoDB.DocumentClient({
  region
});

const getAllProjects = async (): Promise<Project[]> => {
  const { Items } = await dynamoDB
    .scan({
      TableName
    })
    .promise();

  return Items as Project[];
};

const insertMetrics = (metricsDatapoint: MetricsDatapoint) => {
  const [, , , , , resourceTypeId] = process.env.METRICS_TABLE_ARN!.split(":");
  const TableName = resourceTypeId.split("/")[1];

  return dynamoDB
    .put({
      TableName,
      Item: metricsDatapoint
    })
    .promise();
};

const updateAggregates = async (
  projectId: string,
  isHealthy: boolean,
  responseTime?: number
) => {
  const { Item: project } = await dynamoDB
    .get({
      Key: {
        id: projectId
      },
      TableName
    })
    .promise();

  const newResponseTime =
    (project!.stats.meanResponse * project!.stats.count +
      (responseTime || project!.stats.meanResponse)) /
    (project!.stats.count + 1);

  const UpdateExpression = isHealthy
    ? "ADD stats.uptime :inc, #statsCount :inc SET stats.meanResponse = :responseTime"
    : "ADD stats.downtime :inc, #statsCount :inc";

  return dynamoDB
    .update({
      Key: {
        id: projectId
      },
      TableName,
      ExpressionAttributeValues: {
        ":inc": 1,
        ":responseTime": newResponseTime
      },
      ExpressionAttributeNames: {
        "#statsCount": "stats.count"
      },
      UpdateExpression
    })
    .promise();
};

const processProject = async (project: Project) => {
  console.log(`[PROJECT_${project.id}], URL: ${project.endpoint}`);

  const healthMetric: MetricsDatapoint = {
    id: `${project.id}`,
    date: (+new Date()).toString(),
    region: process.env.AWS_REGION!,
    unit: "Reachable",
    metricName: "Health",
    value: 0
  };

  try {
    const response = await request({
      uri: project.endpoint,
      method: project.method.toUpperCase(),
      headers: project.headers,
      timeout: project.timeout,
      time: project.measureRequestDetails,
      resolveWithFullResponse: true
    }).promise();
    const data = typeof response === "string" ? JSON.parse(response) : response;
    const timings = {
      ...data.timings,
      ...data.timingPhases
    };

    healthMetric.value = 1;

    if (project.measureRequestDetails) {
      healthMetric.timings = timings;
      await updateAggregates(project.id, true, timings.total);
    }
  } catch (error) {
    console.log(`[PROJECT_${project.id}] Error!`);
    console.error(error);
    healthMetric.value = 0;

    await updateAggregates(project.id, false);
  }

  if (project.measureLighthouseDetails) {
    console.log(
      `[PROJECT_${project.id}] Running Lightouse test, URL: ${project.endpoint}`
    );
    // to be added
  }

  return insertMetrics(healthMetric);
};

export const handler: APIGatewayProxyHandler = async (_, _context) => {
  const projects = await getAllProjects();

  await Promise.all(projects.map(project => processProject(project)));

  return response({ projects });
};
