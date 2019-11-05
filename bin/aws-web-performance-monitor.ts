#!/usr/bin/env node
import cdk = require('@aws-cdk/core');

import CollectorStack from './collector/collector';
import FrontendStack from './frontend/frontend';
import { Construct } from '@aws-cdk/core';
import { GlobalTable } from '@aws-cdk/aws-dynamodb-global';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import APIStack from './api/api';

const region = process.env.REGION || 'us-east-1';
const regions = process.env.COLLECTOR_REGIONS
  ? process.env.COLLECTOR_REGIONS.split(',')
  : ['us-east-1', 'eu-central-1', 'ap-southeast-2'];
const cronPattern = process.env.CRON_PATTERN || 'rate(5 minutes)';
const commonConfig = {
  env: {
    region,
  },
};

class RootStack extends cdk.Stack {
  public readonly projectsTable: Table;
  public readonly regionalMetricsTables: Table[];

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.regionalMetricsTables = new GlobalTable(this, 'metricsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'date', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorMetrics',
      regions,
    }).regionalTables;

    this.projectsTable = new Table(this, 'projectsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorProjects',
    });

    const apiStack = new APIStack(this, 'APIStack', {
      projectsTableArn: this.projectsTable.tableArn,
      metricsTableArn: this.regionalMetricsTables[0].tableArn,
    });
    new FrontendStack(this, 'FrontendStack', {
      apiUrl: apiStack.api.url,
    });
  }
}

const app = new cdk.App();
const root = new RootStack(app, 'RootStack', commonConfig);

regions.map(
  (region: string, index: number) =>
    new CollectorStack(app, `CollectorStack-${region}`, {
      env: {
        region,
      },
      baseRegion: region,
      cronPattern,
      projectsTableArn: root.projectsTable.tableArn,
      metricsTableArn: root.regionalMetricsTables[index].tableArn,
    }),
);

app.synth();
