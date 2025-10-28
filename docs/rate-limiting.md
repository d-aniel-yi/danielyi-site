# Rate Limiting and Cost Protection Strategy

This document outlines the multi-layered protection strategy implemented to prevent malicious attacks and keep AWS costs within free-tier limits (~$5 max buffer).

## Protection Layers

### 1. API Gateway Throttling

**Location:** HTTP API Gateway (AWS-managed)

HTTP API Gateway v2 has default AWS-managed throttling:
- **Burst limit:** 10,000 requests
- **Rate limit:** 5,000 requests per second

**Note:** These limits cannot be configured via CDK for HTTP API v2 (only via AWS Console/API). However, this is not a concern because:
- Lambda reserved concurrency (2 concurrent) is your effective throttle
- IP-based rate limiting (3/hour) provides application-level protection
- Even if 10,000 requests hit the gateway, only 2 can execute simultaneously

**To manually lower limits (if needed):**
1. Go to API Gateway Console
2. Select your HTTP API
3. Navigate to Throttle Settings
4. Set custom limits per stage

### 2. Lambda Reserved Concurrency

**Location:** `infra/lib/api-stack.ts`

Lambda functions are capped to prevent cost explosions:
- **Contact function:** 2 concurrent executions max
- **Health function:** 5 concurrent executions max

This ensures that even if rate limits are bypassed, compute costs remain bounded.

**Warning:** Reserved concurrency counts against your account's total concurrent execution limit (1000 by default in us-east-1).

### 3. Application-Level IP Rate Limiting

**Location:** `infra/lib/lambda/contact.ts`

IP-based rate limiting tracks submissions in DynamoDB:
- **Hourly limit:** 3 submissions per IP
- **Daily limit:** 10 submissions per IP
- **Response:** 429 Too Many Requests with `retryAfter` header

Rate limit records expire after 24 hours via DynamoDB TTL.

**Adjust limits:**
```typescript
const HOURLY_LIMIT = 5;  // Increase for legitimate high-volume users
const DAILY_LIMIT = 20;
```

**DynamoDB schema:**
- Partition key: `pk` = `IP#{ipAddress}`
- Sort key: `sk` = `{timestamp}`
- TTL: 24 hours from creation

### 4. Input Validation

**Location:** `infra/lib/lambda/contact.ts`

Strict validation prevents abuse:
- **Max payload size:** 10KB
- **Field length limits:**
  - Name: 100 characters
  - Email: 100 characters
  - Message: 2000 characters
- **Required fields:** name, email, message
- **Email validation:** Basic regex check
- **Sanitization:** Removes null bytes and control characters

### 5. CloudWatch Alarms

**Location:** `infra/lib/observability-stack.ts`

Real-time alerting for unusual activity:

| Alarm | Threshold | Period |
|-------|-----------|--------|
| Contact Lambda invocations | > 1000 | 1 hour |
| Contact Lambda errors | > 10 | 1 hour |
| API Gateway 4xx errors | > 50 | 1 hour |
| API Gateway throttles (429) | > 20 | 5 minutes |
| DynamoDB consumed writes | > 100 | 1 hour |

All alarms send notifications to the SNS topic for immediate response.

**Set up email notifications:**
1. After deployment, get the SNS Topic ARN from outputs:
   ```bash
   aws cloudformation describe-stacks --stack-name ObservabilityStack --query "Stacks[0].Outputs[?OutputKey=='AlarmTopicArn'].OutputValue" --output text
   ```
2. Subscribe your email:
   ```bash
   aws sns subscribe --topic-arn <TOPIC_ARN> --protocol email --notification-endpoint your@email.com
   ```
3. Confirm the subscription in your email

### 6. AWS Budget Alerts

**Status:** ⚠️ REQUIRES MANUAL SETUP

AWS Budgets cannot be fully automated via CDK without additional permissions. Set up manually:

1. Go to [AWS Budgets Console](https://console.aws.amazon.com/billing/home#/budgets)
2. Create a new budget:
   - **Budget type:** Cost budget
   - **Period:** Monthly
   - **Amount:** $5.00
   - **Alerts:**
     - 50% ($2.50) - Email alert
     - 80% ($4.00) - Email alert  
     - 100% ($5.00) - Email alert + investigate immediately

**Alternative:** Use AWS Cost Anomaly Detection (free) for automatic spike detection.

### 7. CAPTCHA (Prepared, Not Enabled)

**Location:** `apps/web/src/components/contact/CaptchaWidget.tsx`

CAPTCHA is ready to enable if rate limiting proves insufficient:

1. Sign up for Cloudflare Turnstile (free): https://dash.cloudflare.com/sign-up/turnstile
2. Get your site key
3. Set environment variables:
   ```bash
   NEXT_PUBLIC_ENABLE_CAPTCHA=true
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   ```
4. Rebuild and redeploy

The widget auto-verifies when disabled, so no code changes needed.

## Cost Estimates

### Normal Traffic (within free tier)
- API Gateway: 1M requests/month free → 0 requests = **$0**
- Lambda: 1M requests free, 400,000 GB-seconds free → **$0**
- DynamoDB: 25 GB storage, 25 WCU/RCU free → **$0**
- CloudWatch: 10 alarms free, 5GB logs free → **$0**
- **Total: $0/month**

### Attack Scenario (with protections)
- API Gateway throttle kicks in at 5 req/sec = 13M req/month max
- Lambda capped at 2 concurrent = ~5,000 invocations/hour max
- Rate limits prevent DynamoDB explosion
- **Estimated max: $2-3/month** (still under $5 buffer)

### Attack Scenario (WITHOUT protections)
- Unlimited Lambda invocations
- Unlimited DynamoDB writes  
- **Potential: $50-500+/month** 😱

## Testing the Protection

### Test rate limits locally:
```bash
# Send 5 requests rapidly - should succeed
for i in {1..5}; do
  curl -X POST https://api.yourdomain.com/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test"}' &
done

# Send 10 more - should get 429 Too Many Requests
for i in {1..10}; do
  curl -X POST https://api.yourdomain.com/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test"}'
done
```

### Monitor CloudWatch:
1. Go to CloudWatch Console
2. Select "Dashboards" → "ObservabilityStack-dashboard"
3. Watch for alarm state changes

## Adjusting Limits

If legitimate users are being rate-limited:

1. **Increase Lambda concurrency** (costs scale linearly):
   ```typescript
   reservedConcurrentExecutions: 5  // was 2
   ```

2. **Increase IP rate limits** (minimal cost impact):
   ```typescript
   const HOURLY_LIMIT = 5;   // was 3
   const DAILY_LIMIT = 20;   // was 10
   ```

3. **Enable CAPTCHA** for additional protection while loosening limits

4. **Consider CloudFront** in front of API Gateway for additional free-tier request quotas

## Incident Response

If alarms fire:

1. **Check CloudWatch dashboard** for traffic patterns
2. **Review rate limit table** in DynamoDB:
   ```bash
   aws dynamodb scan --table-name <RateLimitTableName> --max-items 20
   ```
3. **Look for suspicious IPs** (many requests from same source)
4. **Temporarily reduce limits** if needed via CDK and redeploy:
   ```typescript
   reservedConcurrentExecutions: 1  // Emergency mode
   ```
5. **Enable CAPTCHA** if attack persists
6. **Consider AWS WAF** (additional cost) for IP blocking if severe

## References

- [API Gateway Throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
- [Lambda Reserved Concurrency](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html)
- [DynamoDB TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)

