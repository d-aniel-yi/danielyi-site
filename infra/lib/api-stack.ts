import { Duration, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ApiStack extends Stack {
  public readonly table: dynamodb.Table;
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: any, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, 'SubmissionsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
    });

    const contactFn = new lambda.Function(this, 'ContactHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(
        "exports.handler=async(e)=>({statusCode:202,headers:{'content-type':'application/json','access-control-allow-origin':e.headers?.origin||'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,x-request-id'},body:JSON.stringify({id:Date.now().toString(),status:'accepted'})});"
      ),
      timeout: Duration.seconds(10),
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });

    this.table.grantWriteData(contactFn);

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowOrigins: ['https://da.nielyi.com', 'https://staging.da.nielyi.com', 'http://localhost:3000'],
        allowHeaders: ['content-type', 'x-request-id'],
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
        maxAge: Duration.days(1),
      },
    });

    this.httpApi.addRoutes({
      path: '/contact',
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration('ContactIntegration', contactFn),
    });

    this.httpApi.addRoutes({
      path: '/health',
      methods: [apigwv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        'HealthIntegration',
        new lambda.Function(this, 'HealthHandler', {
          runtime: lambda.Runtime.NODEJS_20_X,
          handler: 'index.handler',
          code: lambda.Code.fromInline("exports.handler=async()=>({statusCode:200,headers:{'content-type':'application/json'},body:JSON.stringify({ok:true})});"),
          timeout: Duration.seconds(5),
        })
      ),
    });

    // SES permission placeholder (grant later when wiring actual email send)
    contactFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    }));

    new CfnOutput(this, 'ApiUrl', { value: this.httpApi.apiEndpoint });
    new CfnOutput(this, 'TableName', { value: this.table.tableName });
  }
}


