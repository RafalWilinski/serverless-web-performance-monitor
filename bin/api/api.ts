// import cfn = require('@aws-cdk/aws-cloudformation');
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

interface APIStackProps extends StackProps {
  projectsTableArn: string;
  metricsTableArn: string;
}

class APIStack extends Stack {
  constructor(parent: Construct, name: string, props: APIStackProps) {
    super(parent, name, props);

    const func = new lambda.Function(this, `MetricsAPI`, {
      description: "Metrics API between frontend and metrics",
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.AssetCode.fromAsset(path.join(__dirname, "src")),
      environment: {
        PROJECTS_TABLE_ARN: props.projectsTableArn,
        METRICS_TABLE_ARN: props.metricsTableArn
      }
    });

    func.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:Query"],
        resources: [props.metricsTableArn]
      })
    );
    func.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:Query", "dynamodb:PutItem"],
        resources: [props.projectsTableArn]
      })
    );

    const api = new apigateway.RestApi(this, "metrics-api", {
      restApiName: "Metrics Service"
    });

    const getWidgetsIntegration = new apigateway.LambdaIntegration(func);

    api.root.addMethod("GET", getWidgetsIntegration);
  }
}

export default APIStack;
