import { Stack, StackProps, aws_cloudwatch as cloudwatch } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ObservabilityStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Placeholder dashboard; wire real metrics after first deploy
    new cloudwatch.Dashboard(this, 'Dashboard', {
      dashboardName: `${id}-dashboard`,
    });
  }
}


