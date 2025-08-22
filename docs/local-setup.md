### Local Setup — Quick Start

Follow these steps to run the site locally and prepare AWS deploys. This cheatsheet mirrors the Implementation Plan and uses pnpm + Node 20.

## Prerequisites
- Node 20 LTS, Git, AWS CLI v2, AWS CDK v2
- LaunchDarkly account (client-side SDK key for `dev`)

## One-time machine setup
```bash
corepack enable
corepack prepare pnpm@latest --activate
aws --version
cdk --version || npm i -g aws-cdk
```

## Repo bootstrap
```bash
# Create Next.js app (if not already present)
pnpm dlx create-next-app@latest apps/web --ts --eslint --tailwind --app --src-dir --import-alias "@/*"

# Monorepo scaffolding
mkdir -p infra/{bin,lib} packages/{config,ui}
```

## Frontend configuration
```ts
// apps/web/next.config.ts
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
```

## Env vars
```bash
# apps/web/.env.local
NEXT_PUBLIC_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com
NEXT_PUBLIC_LD_CLIENT_ID=<ld-client-side-id>
```

## Run locally
```bash
pnpm install
pnpm --filter ./apps/web dev
```

## Build static site
```bash
cd apps/web
pnpm build  # outputs to apps/web/out
```

## CDK bootstrap and deploy
```bash
aws configure set region us-east-1
cd infra
pnpm add aws-cdk-lib constructs
pnpm exec cdk init app --language typescript
pnpm exec cdk bootstrap aws://<account-id>/us-east-1
pnpm exec cdk synth
pnpm exec cdk deploy WebStack ApiStack ObservabilityStack --require-approval never
```

## After deploy
- Set `NEXT_PUBLIC_API_BASE_URL` to the API Gateway URL output.
- Upload `apps/web/out` to the S3 bucket behind CloudFront.
- Point `da.nielyi.com` to the CloudFront distribution via Route 53 alias.

## Troubleshooting
- CORS: ensure API allows `https://da.nielyi.com` (and staging) origins.
- CSP: include LaunchDarkly endpoints and API domain in `connect-src`.
- SES sandbox: verify recipient email until production access is granted.


