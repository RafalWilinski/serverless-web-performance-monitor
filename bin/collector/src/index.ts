import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
// import * as request from 'request';

import 'source-map-support/register';
import Project from '../../types/Project';

const dynamoDB = new DynamoDB.DocumentClient();
const response = (body: string | any, statusCode = 200) => ({
  statusCode,
  body: typeof body === 'string' ? JSON.stringify(body, null, 2) : body,
});

const getAllProjects = async (): Promise<Project[]> => {
  const { Items } = await dynamoDB
    .scan({
      TableName: process.env.PROJECTS_TABLE_ARN!,
    })
    .promise();

  return Items as Project[];
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event, dynamoDB);

  const projects = await getAllProjects();

  return response({});
};
