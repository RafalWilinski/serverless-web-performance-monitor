// import cfn = require('@aws-cdk/aws-cloudformation');
import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');
import { LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

interface CollectorStackProps extends StackProps {
  baseRegion: string;
  cronPattern: string;
  projectsTableArn: string;
  metricsTableArn: string;
}

class CollectorStack extends Stack {
  constructor(parent: Construct, name: string, props: CollectorStackProps) {
    super(parent, name, props);

    const func = new lambda.Function(this, `Collector`, {
      description: 'Function collecting metrics',
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.AssetCode.fromAsset(path.join(__dirname, 'src')),
      environment: {
        PROJECTS_TABLE_ARN: props.projectsTableArn,
        METRICS_TABLE_ARN: props.metricsTableArn,
      },
    });

    const headlessChromeLayer = new LayerVersion(this, 'chromeless-layer', {
      code: lambda.AssetCode.fromAsset(path.join(__dirname, 'layer', 'layer')),
      compatibleRuntimes: [Runtime.NODEJS_10_X],
    });

    func.addLayers(headlessChromeLayer);

    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression(props.cronPattern),
    });

    rule.addTarget(new targets.LambdaFunction(func));

    func.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [props.metricsTableArn],
      }),
    );
    func.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [props.projectsTableArn],
      }),
    );
  }
}

export default CollectorStack;
