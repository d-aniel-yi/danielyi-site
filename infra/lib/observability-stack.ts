import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

import { ApiStack } from './api-stack';
import { WebStack } from './web-stack';

interface ObservabilityProps extends StackProps {
  api: ApiStack;
  web: WebStack;
}

export class ObservabilityStack extends Stack {
  constructor(scope: any, id: string, props: ObservabilityProps) {
    super(scope, id, props);

    // Placeholder dashboard; wire real metrics in later steps
    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard', {
      dashboardName: 'da-portfolio',
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'API 4XX/5XX (placeholder)',
        left: [],
      })
    );
  }
}


