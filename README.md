## Portfolio Website — Daniel Yi

A public portfolio that doubles as resume and cover letter, demonstrating top-tier AE execution with technical credibility. Built with a modern React frontend and a serverless AWS backend, provisioned via IaC.

### Core Message
You’ll find many top-performing AEs. You’ll rarely find one who can also conceive, architect, and ship this kind of product end‑to‑end. This repo shows both. Check out /docs/cover_letter.md for a cover letter!

### Tech Stack
- **Frontend**: Next.js (App Router), React, MDX, Tailwind CSS
- **Backend**: AWS API Gateway (HTTP API) + Lambda (Node.js), DynamoDB
- **Hosting**: S3 + CloudFront (SSL, CDN, compression)
- **IaC**: AWS CDK (TypeScript)

### Repository Structure
- `apps/web`: Next.js site (content, MDX, resume pipeline)
- `infra`: CDK stacks for web hosting, API, and observability
- `docs`: Content and planning (e.g., `contextprompt.md`, cover letter)

## Getting Started

### Prerequisites
- Node.js 20+
- npm (or pnpm/yarn)
- AWS credentials configured (`aws configure`) for deploys
- CDK bootstrap once per account/region: `npx cdk bootstrap`

### Install Dependencies
```bash
cd apps/web && npm install
cd ../../infra && npm install
```

## Frontend (apps/web)

### Local Development
```bash
cd apps/web
npm run dev
```
Site runs with Turbopack. MDX is wired via `providerImportSource` for stable imports on Windows.

### Resume Pipeline (LaTeX → static)
- Build once: `npm run resume:build`
- Watch sources: `npm run resume:watch`
- Sync assets into `public/`: `npm run resume:sync`

### Build Static Export
```bash
cd apps/web
npm run build
```
Artifacts are written to `apps/web/out/` for S3 upload.

## Infrastructure (infra)

Stacks:
- `WebStack`: S3 bucket + CloudFront (OAI, security headers, SPA route rewrites). Optional domain alias for `da.nielyi.com` if Route53 zone `nielyi.com` exists and alias creation is enabled.
- `ApiStack`: HTTP API with routes `POST /contact` and `GET /health`, Lambdas, DynamoDB table (on‑demand, TTL).
- `ObservabilityStack`: Placeholder CloudWatch dashboard.

### Deploy
```bash
cd infra
npm run deploy
```
Notes:
- To also create the Route53 alias record (if the zone exists), pass CDK context: `npm run deploy -- -c createAlias=true`
- Outputs include `SiteBucketName`, `CloudFrontDistributionId`, `CloudFrontDomainName`, and `HttpApiUrl`.

### Publish Frontend to S3
After building the site:
```bash
aws s3 sync ./apps/web/out s3://<SiteBucketName> --delete
aws cloudfront create-invalidation --distribution-id <CloudFrontDistributionId> --paths '/*'
```

## API Endpoints
- **Health**: `GET {HttpApiUrl}/health`
- **Contact**: `POST {HttpApiUrl}/contact`
  - CORS is restricted to `https://da.nielyi.com` and `https://staging.da.nielyi.com` by default.

Example:
```bash
curl -s {HttpApiUrl}/health
```

## Quality Bar
- TypeScript strictness, ESLint, small focused changes
- Performance budgets, accessibility baseline (WCAG AA), no dead links
- CI/CD friendly workflows; keep secrets out of client code

### Useful Scripts
- Web: `npm run dev`, `npm run build`, `npm run lint`, `npm run resume:*`
- Infra: `npm run synth`, `npm run deploy`, `npm run diff`, `npm run destroy`

## Content & Narrative
- Homepage reinforces: “A top‑performing AE who ships.”
- Resume compiles from LaTeX; cover letter lives in `docs/Cover_Letter.md` and on the site.
- Case studies and technical appendix deepen the story with quantified outcomes and architecture details.

—
Production site: `https://da.nielyi.com`

<!-- i solemnly swear im up to no good -->