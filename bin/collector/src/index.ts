import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { get } from 'request-promise-native';

import 'source-map-support/register';
import Project from '../../types/Project';
import MetricsDatapoint from '../../types/MetricsDatapoint';

const dynamoDB = new DynamoDB.DocumentClient();
const response = (body: string | any, statusCode = 200) => ({
  statusCode,
  body: typeof body === 'string' ? JSON.stringify(body, null, 2) : body,
});

const getAllProjects = async (): Promise<Project[]> => {
  const { Items } = await dynamoDB
    .scan({
      TableName: process.env.PROJECTS_TABLE_ARN!.split('/').slice(-1)[0],
    })
    .promise();

  return Items as Project[];
};

const insertMetrics = (metricsDatapoint: MetricsDatapoint) =>
  dynamoDB.put({
    TableName: process.env.METRICS_TABLE_ARN!.split('/').slice(-1)[0],
    Item: metricsDatapoint,
  });

const processProject = async (project: Project) => {
  console.log(`Processing project ${project.id}, URL: ${project.endpoint}`);

  const healthMetric: MetricsDatapoint = {
    id: `${project.id}`,
    date: (+new Date()).toString(),
    unit: 'Reachable',
    metricName: 'Health',
    value: 0,
  };

  try {
    // const requestCall = project.method === 'get' ? get : post;
    const data = await get(project.endpoint, {
      headers: project.headers,
      timeout: project.timeout,
      time: project.measureRequestDetails,
    });

    console.log(data);

    healthMetric.value = 1;

    if (project.measureRequestDetails) {
      const metricsObjects = Object.keys(data.timings!).map((metricName) => ({
        id: `${project.id}#`,
        date: (+new Date()).toString(),
        unit: 'ms',
        metricName,
        value: (data.timings! as any)[metricName],
      }));

      await Promise.all(metricsObjects.map((metric) => insertMetrics(metric)));
    }
  } catch (error) {
    console.error(error);
    healthMetric.value = 0;
  }

  if (project.measureLighthouseDetails) {
    console.log(`Running Lightouse test against ${project.id}, URL: ${project.endpoint}`);
    // to be added
  }

  return insertMetrics(healthMetric);
};

export const handler: APIGatewayProxyHandler = async (_, _context) => {
  const projects = await getAllProjects();

  await Promise.all(projects.map((project) => processProject(project)));

  return response({ projects });
};
