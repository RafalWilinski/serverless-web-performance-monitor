import s3 = require('@aws-cdk/aws-s3');
import { join } from 'path';
import { writeFileSync } from 'fs';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import cloudfront = require('@aws-cdk/aws-cloudfront');
import { Construct, RemovalPolicy, CfnOutput } from '@aws-cdk/core';

interface FrontendStackProps {
  apiUrl: string;
}

class FrontendStack extends Construct {
  constructor(parent: Construct, name: string, { apiUrl }: FrontendStackProps) {
    super(parent, name);

    writeFileSync(
      join(__dirname, '..', '..', 'frontend', 'build', 'api.json'),
      `{ apiUrl: ${apiUrl}}`,
      'utf8',
    );

    const bucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset('./frontend/build')],
      destinationKeyPrefix: '/',
    });

    const cdn = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    new CfnOutput(this, 'cfn-distribution', {
      value: cdn.domainName,
    });
  }
}

export default FrontendStack;
