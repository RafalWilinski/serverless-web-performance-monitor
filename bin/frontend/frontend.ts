import s3 = require('@aws-cdk/aws-s3');
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import cloudfront = require('@aws-cdk/aws-cloudfront');
import { Construct } from '@aws-cdk/core';

class FrontendStack extends Construct {
  constructor(parent: Construct, name: string) {
    super(parent, name);

    const bucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset('./frontend/build')],
      destinationKeyPrefix: '/',
    });

    new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });
  }
}

export default FrontendStack;
