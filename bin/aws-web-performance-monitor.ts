#!/usr/bin/env node
import cdk = require('@aws-cdk/core');

import CollectorStack from './collector/collector';
import FrontendStack from './frontend/frontend';
import { Construct } from '@aws-cdk/core';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';

const region = process.env.REGION || 'us-east-1';
const regions = process.env.COLLECTOR_REGIONS
  ? process.env.COLLECTOR_REGIONS.split(',')
  : ['us-east-1'];
const cronPattern = process.env.CRON_PATTERN || 'rate(5 minutes)';
const commonConfig = {
  env: {
    region,
  },
};

console.log(`Using cron pattern: ${cronPattern}`);

class RootStack extends cdk.Stack {
  public readonly projectsTable: Table;
  public readonly regionalMetricsTables: Table[];

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    new FrontendStack(this, 'FrontendStack');

    this.regionalMetricsTables = [
      new Table(this, 'metricsTable', {
        partitionKey: { name: 'id', type: AttributeType.STRING },
        sortKey: { name: 'date', type: AttributeType.STRING },
        billingMode: BillingMode.PAY_PER_REQUEST,
        tableName: 'WebPerformanceMonitorMetrics',
        // regions,
      }),
    ];

    this.projectsTable = new Table(this, 'projectsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorProjects',
    });
  }
}

const app = new cdk.App();
const root = new RootStack(app, 'RootStack', commonConfig);

regions.map(
  (region: string) =>
    new CollectorStack(app, `CollectorStack-${region}`, {
      env: {
        region,
      },
      baseRegion: region,
      cronPattern,
      projectsTableArn: root.projectsTable.tableArn,
      metricsTableArn: root.regionalMetricsTables[0].tableArn,
    }),
);

app.synth();
