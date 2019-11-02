import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

import response from "../../utils/lambdaResponse";

const dynamoDB = new DynamoDB.DocumentClient();
const TableName = process.env.METRICS_TABLE_ARN!.split("/").slice(-1)[0];

const getMetrics = (event: any) =>
  dynamoDB
    .get({
      TableName,
      Key: {
        id: event.queryStringParameters.id
      }
    })
    .promise();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event.queryStringParameters);
  return response({ metrics: await getMetrics(event) });
};
