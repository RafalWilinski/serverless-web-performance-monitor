import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

import response from "./utils/lambdaResponse";

const dynamoDB = new DynamoDB.DocumentClient();
const TableName = process.env.METRICS_TABLE_ARN!.split("/").slice(-1)[0];

const getMetrics = (event?: any) => {
  const FilterExpressions: string[] = [];
  const ExpressionAttributeValues: any = {
    ":pkey": event.id
  };
  const ExpressionAttributeNames: any = {
    "#PROXY_id": "id"
  };

  Object.keys(event).forEach(key => {
    if (key !== "id") {
      ExpressionAttributeValues[`:${key}`] = event[key];
      ExpressionAttributeNames[`#PROXY_${key}`] = key;
      FilterExpressions.push(`#PROXY_${key} = :${key}`);
    }
  });

  console.log(
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    FilterExpressions
  );

  return dynamoDB
    .query({
      TableName,
      KeyConditionExpression: "#PROXY_id = :pkey",
      ExpressionAttributeValues,
      FilterExpression:
        FilterExpressions.length > 0
          ? FilterExpressions.join(" and ")
          : undefined,
      ExpressionAttributeNames
    })
    .promise();
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event.queryStringParameters);
  return response({
    metrics: (await getMetrics(event.queryStringParameters)).Items
  });
};
