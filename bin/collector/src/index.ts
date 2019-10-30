import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
// import * as request from 'request';

import 'source-map-support/register';

const dynamoDB = new DynamoDB.DocumentClient();
const response = (body: string | any, statusCode = 200) => ({
  statusCode,
  body: typeof body === 'string' ? JSON.stringify(body, null, 2) : body,
});

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event, dynamoDB);

  // request.get()

  return response({});
};
