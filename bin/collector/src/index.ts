import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as request from "request-promise-native";

import "source-map-support/register";
import Project from "../../types/Project";
import MetricsDatapoint from "../../types/MetricsDatapoint";
import response from "./utils/lambdaResponse";

const dynamoDB = new DynamoDB.DocumentClient();

const getAllProjects = async (): Promise<Project[]> => {
  const { Items } = await dynamoDB
    .scan({
      TableName: process.env.PROJECTS_TABLE_ARN!.split("/").slice(-1)[0]
    })
    .promise();

  return Items as Project[];
};

const insertMetrics = (metricsDatapoint: MetricsDatapoint) =>
  dynamoDB
    .put({
      TableName: process.env.METRICS_TABLE_ARN!.split("/").slice(-1)[0],
      Item: metricsDatapoint
    })
    .promise();

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
    }
  } catch (error) {
    console.log(`[PROJECT_${project.id}] Error!`);
    console.error(error);
    healthMetric.value = 0;
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
