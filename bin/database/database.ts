#!/usr/bin/env node
import dynamodb = require('@aws-cdk/aws-dynamodb');
import dynamodbGlobal = require('@aws-cdk/aws-dynamodb-global');
import { Construct } from '@aws-cdk/core';
import { BillingMode, AttributeType, Table } from '@aws-cdk/aws-dynamodb';

interface DatabaseStackProps {
  regions: string[];
}

class DatabaseStack extends Construct {
  public regionalMetricsTables: dynamodb.Table[];
  public projectsTable: dynamodb.Table;

  constructor(parent: Construct, name: string, props: DatabaseStackProps) {
    super(parent, name);

    const metricsTable = new dynamodbGlobal.GlobalTable(this, 'metricsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'date', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorMetrics',
      regions: props.regions,
    });

    this.regionalMetricsTables = metricsTable.regionalTables;
    this.projectsTable = new Table(this, 'projectsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'WebPerformanceMonitorProjects',
    });
  }
}

export default DatabaseStack;
