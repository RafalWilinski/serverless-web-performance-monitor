#!/usr/bin/env node
import cdk = require('@aws-cdk/core');

import CollectorStack from './collector/collector';
import FrontendStack from './frontend/frontend';
import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import APIStack from './api/api';

const region = process.env.REGION || 'us-east-1';
const regions = process.env.COLLECTOR_REGIONS
  ? process.env.COLLECTOR_REGIONS.split(',')
  : ['us-east-1', 'ap-southeast-2', 'us-west-2', 'eu-central-1'];
const cronPattern = process.env.CRON_PATTERN || 'rate(5 minutes)';
const commonConfig = {
  env: {
    region,
  },
};

console.log(regions);

class RootStack extends cdk.Stack {
  public readonly projectsTable: Table;
  public readonly metricsTable: Table;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.metricsTable = new Table(this, 'metricsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'date', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorMetrics',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.projectsTable = new Table(this, 'projectsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorProjects',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const apiStack = new APIStack(this, 'perf-monitor-api', {
      projectsTableArn: this.projectsTable.tableArn,
      metricsTableArn: this.metricsTable.tableArn,
    });
    new FrontendStack(this, 'perf-monitor-frontend', {
      apiUrl: apiStack.api.url,
    });

    regions.forEach((region: string) => {
      new CollectorStack(this, `perf-monitor-collector-${region}`, {
        env: {
          region,
        },
        baseRegion: region,
        cronPattern,
        projectsTableArn: this.projectsTable.tableArn,
        metricsTableArn: this.metricsTable.tableArn,
      });
    });
  }
}

const app = new cdk.App();

new RootStack(app, 'perf-monitor', commonConfig);

app.synth();
