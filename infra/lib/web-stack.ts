import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3, aws_cloudfront as cloudfront, aws_cloudfront_origins as origins, aws_iam as iam, aws_certificatemanager as acm, aws_route53 as route53, aws_route53_targets as targets } from 'aws-cdk-lib';

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN,
      enforceSSL: true,
    });

    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    // Custom security headers incl. CSP that allows site assets
    const responseHeaders = new cloudfront.ResponseHeadersPolicy(this, 'ResponseHeaders', {
      securityHeadersBehavior: {
        contentSecurityPolicy: {
          contentSecurityPolicy: [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "connect-src 'self' https://app.launchdarkly.com https://clientstream.launchdarkly.com https://events.launchdarkly.com",
            "font-src 'self' data:",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
          ].join('; '),
          override: true,
        },
        referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE, override: true },
        strictTransportSecurity: { accessControlMaxAge: Duration.days(365), includeSubdomains: true, preload: true, override: true },
        xssProtection: { protection: true, modeBlock: true, override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        contentTypeOptions: { override: true },
      },
    });

    // Optional: attach custom domain if hosted zone exists
    let certificate: acm.ICertificate | undefined;
    let domainNames: string[] | undefined;
    try {
      const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: 'nielyi.com' });
      certificate = new acm.DnsValidatedCertificate(this, 'DaCert', {
        domainName: 'da.nielyi.com',
        hostedZone: zone,
        region: 'us-east-1',
      });
      domainNames = ['da.nielyi.com'];
    } catch {
      // Skip domain wiring if zone not found; distribution remains accessible via default domain
    }

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        responseHeadersPolicy: responseHeaders,
      },
      defaultRootObject: 'index.html',
      domainNames,
      certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
      ],
    });

    // Grant read to OAI principal
    bucket.grantRead(new iam.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId));

    // Create Route53 alias if zone/cert were created
    if (certificate && domainNames) {
      const zone = route53.HostedZone.fromLookup(this, 'ZoneForRecord', { domainName: 'nielyi.com' });
      new route53.ARecord(this, 'DaAlias', {
        zone,
        recordName: 'da',
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      });
    }

    new CfnOutput(this, 'SiteBucketName', { value: bucket.bucketName });
    new CfnOutput(this, 'CloudFrontDistributionId', { value: distribution.distributionId });
    new CfnOutput(this, 'CloudFrontDomainName', { value: distribution.domainName });
  }
}


