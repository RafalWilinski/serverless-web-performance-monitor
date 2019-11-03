import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Cors } from "@aws-cdk/aws-apigateway";

interface APIStackProps extends StackProps {
  projectsTableArn: string;
  metricsTableArn: string;
}

class APIStack extends Stack {
  public api: apigateway.RestApi;

  constructor(parent: Construct, name: string, props: APIStackProps) {
    super(parent, name, props);

    const metricsService = new lambda.Function(this, `MetricsService`, {
      description: "Metrics API between frontend and metrics",
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.AssetCode.fromAsset(path.join(__dirname, "metricsService")),
      environment: {
        METRICS_TABLE_ARN: props.metricsTableArn
      }
    });

    metricsService.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:Query"],
        resources: [props.metricsTableArn]
      })
    );

    const projectsService = new lambda.Function(this, `ProjectsService`, {
      description: "Projects API between frontend and metrics",
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.AssetCode.fromAsset(path.join(__dirname, "projectsService")),
      environment: {
        PROJECTS_TABLE_ARN: props.projectsTableArn
      }
    });

    projectsService.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["dynamodb:Scan", "dynamodb:PutItem"],
        resources: [props.projectsTableArn]
      })
    );

    const api = new apigateway.RestApi(this, "metrics-api", {
      restApiName: "Metrics Service"
    });
    this.api = api;

    const metrics = api.root.addResource("metrics");
    metrics.addMethod("GET", new apigateway.LambdaIntegration(metricsService));
    metrics.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS
    });

    const projects = api.root.addResource("projects");
    projects.addMethod(
      "GET",
      new apigateway.LambdaIntegration(projectsService)
    );
    projects.addMethod(
      "POST",
      new apigateway.LambdaIntegration(projectsService)
    );
    projects.addCorsPreflight({
      allowOrigins: Cors.ALL_ORIGINS
    });
  }
}

export default APIStack;
