import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

import response from "./utils/lambdaResponse";
import uuid from "./utils/uuid";

const dynamoDB = new DynamoDB.DocumentClient();
const TableName = process.env.PROJECTS_TABLE_ARN!.split("/").slice(-1)[0];

const createProject = async (body: any) => {
  body.id = uuid();

  if (!body.name) {
    throw new Error('"name" param cannot be null!');
  } else if (!body.endpoint) {
    throw new Error('"endpoint" param cannot be null!');
  } else if (!body.method) {
    throw new Error('"method" param cannot be null!');
  }

  await dynamoDB
    .put({
      TableName,
      Item: body
    })
    .promise();
};

const getProjects = () =>
  dynamoDB
    .scan({
      TableName
    })
    .promise();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  if (event.httpMethod.toUpperCase() === "POST") {
    try {
      return response({
        project: await createProject(JSON.parse(event.body!))
      });
    } catch (error) {
      return response({ error }, 400);
    }
  } else {
    return response({ projects: (await getProjects()).Items });
  }
};
