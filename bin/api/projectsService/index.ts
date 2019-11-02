import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

import response from "../../utils/lambdaResponse";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  if (event.httpMethod.toUpperCase() === "POST") {
    return createProject(event.body);
  } else {
    return getProjects(event);
  }
};