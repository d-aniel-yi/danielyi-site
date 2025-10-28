import {
  Stack,
  StackProps,
  Duration,
  CfnOutput,
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_sns as sns,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './api-stack';

interface ObservabilityStackProps extends StackProps {
  apiStack: ApiStack;
}

export class ObservabilityStack extends Stack {
  constructor(scope: Construct, id: string, props: ObservabilityStackProps) {
    super(scope, id, props);

    const { apiStack } = props;

    // SNS Topic for alarms (email subscription needs to be confirmed manually)
    const alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      displayName: 'Portfolio Site Alarms',
    });

    // Create dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard', {
      dashboardName: `${id}-dashboard`,
    });

    // Alarm: Excessive Lambda invocations (Contact)
    const contactInvocationsAlarm = new cloudwatch.Alarm(this, 'ContactExcessiveInvocations', {
      metric: apiStack.contactFunction.metricInvocations({
        period: Duration.hours(1),
        statistic: 'Sum',
      }),
      threshold: 1000,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Contact function invocations exceeded 1000 per hour',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    contactInvocationsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    // Alarm: Lambda errors (Contact)
    const contactErrorsAlarm = new cloudwatch.Alarm(this, 'ContactErrors', {
      metric: apiStack.contactFunction.metricErrors({
        period: Duration.hours(1),
        statistic: 'Sum',
      }),
      threshold: 10,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Contact function errors exceeded 10 per hour',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    contactErrorsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    // Alarm: API Gateway 4xx errors
    const api4xxAlarm = new cloudwatch.Alarm(this, 'Api4xxErrors', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ApiGateway',
        metricName: '4XXError',
        dimensionsMap: {
          ApiId: apiStack.httpApiId,
        },
        period: Duration.hours(1),
        statistic: 'Sum',
      }),
      threshold: 50,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'API Gateway 4xx errors exceeded 50 per hour',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    api4xxAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    // Alarm: API Gateway throttles (429 responses)
    const apiThrottleAlarm = new cloudwatch.Alarm(this, 'ApiThrottles', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ApiGateway',
        metricName: '429',
        dimensionsMap: {
          ApiId: apiStack.httpApiId,
        },
        period: Duration.minutes(5),
        statistic: 'Sum',
      }),
      threshold: 20,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'API Gateway throttles exceeded 20 in 5 minutes (possible attack)',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    apiThrottleAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    // Alarm: DynamoDB consumed write units (rate limit table)
    const dynamoWritesAlarm = new cloudwatch.Alarm(this, 'DynamoExcessiveWrites', {
      metric: apiStack.rateLimitTable.metricConsumedWriteCapacityUnits({
        period: Duration.hours(1),
        statistic: 'Sum',
      }),
      threshold: 100,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Rate limit table consumed write units exceeded 100 per hour',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dynamoWritesAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    // Add widgets to dashboard
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Lambda Invocations',
        left: [
          apiStack.contactFunction.metricInvocations({ statistic: 'Sum' }),
          apiStack.healthFunction.metricInvocations({ statistic: 'Sum' }),
        ],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Lambda Errors',
        left: [
          apiStack.contactFunction.metricErrors({ statistic: 'Sum' }),
          apiStack.healthFunction.metricErrors({ statistic: 'Sum' }),
        ],
        width: 12,
      })
    );

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'API Gateway Requests',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/ApiGateway',
            metricName: 'Count',
            dimensionsMap: { ApiId: apiStack.httpApiId },
            statistic: 'Sum',
          }),
        ],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'API Gateway Errors',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/ApiGateway',
            metricName: '4XXError',
            dimensionsMap: { ApiId: apiStack.httpApiId },
            statistic: 'Sum',
          }),
          new cloudwatch.Metric({
            namespace: 'AWS/ApiGateway',
            metricName: '5XXError',
            dimensionsMap: { ApiId: apiStack.httpApiId },
            statistic: 'Sum',
          }),
        ],
        width: 12,
      })
    );

    // Output SNS topic ARN for manual email subscription
    new CfnOutput(this, 'AlarmTopicArn', {
      value: alarmTopic.topicArn,
      description: 'SNS Topic ARN for alarm notifications - subscribe your email manually',
    });
  }
}
