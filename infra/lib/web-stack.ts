import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3, aws_cloudfront as cloudfront, aws_cloudfront_origins as origins, aws_certificatemanager as acm, aws_route53 as route53, aws_route53_targets as targets } from 'aws-cdk-lib';

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN,
      enforceSSL: true,
    });

    const originAccessControl = new cloudfront.CfnOriginAccessControl(this, 'OAC', {
      originAccessControlConfig: {
        name: `${id}-oac`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: 'OAC for S3 origin',
      },
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      defaultRootObject: 'index.html',
    });

    // Attach OAC to origin (low-level override)
    const cfnDist = distribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDist.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', originAccessControl.getAtt('Id'));

    // Optional: domain wiring left for manual input of hosted zone and certificate
    // const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: 'nielyi.com' });
    // const cert = new acm.DnsValidatedCertificate(this, 'Cert', { domainName: 'da.nielyi.com', hostedZone: zone, region: 'us-east-1' });
    // new cloudfront.Distribution(this, 'DistWithDomain', { ... attach cert and altNames ... })

    // Outputs are implicitly visible via `cdk synth` for bucket/distribution IDs if needed
  }
}


