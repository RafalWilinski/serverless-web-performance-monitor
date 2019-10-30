import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as request from "request";

import "source-map-support/register";
import Project from "../../types/Project";
import MetricsDatapoint from "../../types/MetricsDatapoint";

const dynamoDB = new DynamoDB.DocumentClient();
const response = (body: string | any, statusCode = 200) => ({
  statusCode,
  body: typeof body === "string" ? JSON.stringify(body, null, 2) : body
});

const getAllProjects = async (): Promise<Project[]> => {
  const { Items } = await dynamoDB
    .scan({
      TableName: process.env.PROJECTS_TABLE_ARN!
    })
    .promise();

  return Items as Project[];
};

const insertMetrics = (metricsDatapoint: MetricsDatapoint) =>
  dynamoDB.put({
    TableName: process.env.METRICS_TABLE_ARN!,
    Item: metricsDatapoint
  });

const processProject = async (project: Project) => {
  console.log(`Processing project ${project.id}, URL: ${project.endpoint}`);
  
  const healthMetric: MetricsDatapoint = {
    id: `${project.id}`,
    date: (+new Date()).toString(),
    unit: "Reachable",
    metricName: "Health",
    value: 0
  };

  await new Promise(() => {
    request[project.method](
      project.endpoint,
      {
        headers: project.headers,
        timeout: project.timeout,
        time: project.measureRequestDetails
      },
      async (error: any, response: request.Response) => {
        console.log(`Project ${project.id}; HasError: ${!!error}, Timings: ${response.timings}`);
        healthMetric.value = error ? 0 : 1;

        if (project.measureRequestDetails) {
          const metricsObjects = Object.keys(response.timings!).map(
            metricName => ({
              id: `${project.id}#`,
              date: (+new Date()).toString(),
              unit: "ms",
              metricName,
              value: (response.timings! as any)[metricName]
            })
          );

          await Promise.all(metricsObjects.map(metric => insertMetrics(metric)));
        }

        return insertMetrics(healthMetric);
      }
    );
  });

  if (project.measureLighthouseDetails) {
    console.log(`Running Lightouse test against ${project.id}, URL: ${project.endpoint}`);
    // to be added
  }

  return;
};

export const handler: APIGatewayProxyHandler = async (_, _context) => {
  const projects = await getAllProjects();

  await Promise.all(projects.map(project => processProject(project)));

  return response({ projects });
};
