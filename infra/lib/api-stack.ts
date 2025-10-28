import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_apigatewayv2 as apigwv2, aws_apigatewayv2_integrations as apigwv2i, aws_lambda_nodejs as nodejs, aws_lambda as lambda, aws_dynamodb as dynamodb } from 'aws-cdk-lib';

export class ApiStack extends Stack {
  public readonly contactFunction: nodejs.NodejsFunction;
  public readonly healthFunction: nodejs.NodejsFunction;
  public readonly httpApiId: string;
  public readonly submissionsTable: dynamodb.Table;
  public readonly rateLimitTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'SubmissionsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
    });

    // Rate limit tracking table for IP-based throttling
    const rateLimitTable = new dynamodb.Table(this, 'RateLimitTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
    });

    const contactFn = new nodejs.NodejsFunction(this, 'ContactFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: require.resolve('./lambda/contact.ts'),
      memorySize: 256,
      timeout: Duration.seconds(10),
      environment: {
        TABLE_NAME: table.tableName,
        RATE_LIMIT_TABLE_NAME: rateLimitTable.tableName,
      },
      // Reserved concurrency removed due to account limits
      // Protection relies on IP rate limiting (3/hour, 10/day) and input validation
    });
    table.grantReadWriteData(contactFn);
    rateLimitTable.grantReadWriteData(contactFn);

    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowHeaders: ['Content-Type', 'x-request-id'],
        allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS, apigwv2.CorsHttpMethod.GET],
        allowOrigins: ['https://da.nielyi.com', 'https://staging.da.nielyi.com'],
        maxAge: Duration.days(1),
      },
      // Note: HTTP API v2 has default throttling (10k burst, 5k steady-state) managed by AWS
      // Primary protection comes from Lambda reserved concurrency (2 concurrent) and IP rate limiting
    });

    const contactRoute = httpApi.addRoutes({
      path: '/contact',
      methods: [apigwv2.HttpMethod.POST],
      integration: new apigwv2i.HttpLambdaIntegration('ContactIntegration', contactFn),
    });

    // Health check Lambda
    const healthFn = new nodejs.NodejsFunction(this, 'HealthFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: require.resolve('./lambda/health.ts'),
      memorySize: 128,
      timeout: Duration.seconds(5),
      // Reserved concurrency removed due to account limits
    });

    httpApi.addRoutes({
      path: '/health',
      methods: [apigwv2.HttpMethod.GET],
      integration: new apigwv2i.HttpLambdaIntegration('HealthIntegration', healthFn),
    });

    // Export references for other stacks
    this.contactFunction = contactFn;
    this.healthFunction = healthFn;
    this.httpApiId = httpApi.httpApiId;
    this.submissionsTable = table;
    this.rateLimitTable = rateLimitTable;

    new CfnOutput(this, 'HttpApiUrl', { value: httpApi.apiEndpoint });
    new CfnOutput(this, 'HttpApiId', { value: httpApi.httpApiId });
    new CfnOutput(this, 'SubmissionsTableName', { value: table.tableName });
    new CfnOutput(this, 'RateLimitTableName', { value: rateLimitTable.tableName });
  }
}


