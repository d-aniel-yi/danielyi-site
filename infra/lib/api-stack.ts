import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_apigatewayv2 as apigwv2, aws_apigatewayv2_integrations as apigwv2i, aws_lambda_nodejs as nodejs, aws_lambda as lambda, aws_dynamodb as dynamodb } from 'aws-cdk-lib';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'SubmissionsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
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
      },
    });
    table.grantReadWriteData(contactFn);

    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowHeaders: ['Content-Type', 'x-request-id'],
        allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS, apigwv2.CorsHttpMethod.GET],
        allowOrigins: ['https://da.nielyi.com', 'https://staging.da.nielyi.com'],
        maxAge: Duration.days(1),
      },
    });

    const contactRoute = httpApi.addRoutes({
      path: '/contact',
      methods: [apigwv2.HttpMethod.POST],
      integration: new apigwv2i.HttpLambdaIntegration('ContactIntegration', contactFn),
    });

    httpApi.addRoutes({
      path: '/health',
      methods: [apigwv2.HttpMethod.GET],
      integration: new apigwv2i.HttpLambdaIntegration('HealthIntegration', contactFn), // placeholder
    });

    new CfnOutput(this, 'HttpApiUrl', { value: httpApi.apiEndpoint });
    new CfnOutput(this, 'SubmissionsTableName', { value: table.tableName });
  }
}


