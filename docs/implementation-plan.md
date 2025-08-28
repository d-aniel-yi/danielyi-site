### Implementation Plan — Anysphere AE Resume Site

This plan defines the final tech stack, step-by-step delivery plan, and integration details (including LaunchDarkly for feature flags and progressive delivery). It is optimized for robust engineering, speed, and AWS free-tier compatibility.

## Final Tech Stack
- Frontend: Next.js 14 (App Router) + React 18 + TypeScript (strict) + Tailwind CSS
- Content: MDX for resume, cover letter, and case studies; metadata via `next/metadata`
- Feature Flags: LaunchDarkly (React Client SDK) for UI experiments and killswitches
- Hosting: S3 (static assets) + CloudFront (CDN, SSL, HTTP/2/3)
- API: Amazon API Gateway (HTTP API) + AWS Lambda (Node.js 20, TypeScript, esbuild)
- Data: DynamoDB (form submissions, simple telemetry)
- Email: Amazon SES (contact notifications)
- IaC: AWS CDK v2 (TypeScript), monorepo with `infra/` package
- CI/CD: GitHub Actions with OIDC into AWS (no long-lived keys), PR previews
- Observability: CloudWatch Logs/Metrics/Alarms, structured JSON logging, CloudFront logs → S3 + Athena, Lighthouse CI; optional: X-Ray for Lambdas

## Architecture Overview
- Static-first site (SSG/ISR) deployed to S3 + CloudFront; no SSR required to keep infra simple and free-tier friendly
- Minimal serverless APIs for contact form and health checks
- Feature flags client-side via LaunchDarkly; server-side SDK optional and deferred
- Infrastructure separated into focused CDK stacks: Web, Api, Observability

## Environments
- `dev`: default branch previews
- `staging`: pre-prod verification (optional if timeline tight)
- `prod`: production

## Security & Compliance
- No secrets in client bundle; server/API reads from SSM Parameter Store/Secrets Manager
- Strict CSP via CloudFront Response Headers Policy; security headers (HSTS, X-Content-Type-Options)
- Basic DoS protection via API Gateway throttling and optional WAF rate-based rules
- SES with verified identity (domain or sender email)

## Step-by-Step Plan

1) Repository & Tooling
   - Initialize repo with Node 20, TypeScript strict, ESLint, Prettier, EditorConfig
   - Commit hooks: lint-staged + simple pre-commit (format, lint)
   - Conventional Commits and CHANGELOG generation

2) Frontend Scaffold
   - Create Next.js app: TypeScript, Tailwind CSS, App Router enabled
   - Configure absolute imports/paths; set `tsconfig.json` strict options
   - Add base layout, SEO defaults, color themes (dark/light), typography scale

3) LaunchDarkly Integration (Frontend)
   - Create LaunchDarkly account/project; add `dev` and `prod` environments
   - Create flags (initial): `enableCaseStudies`, `enableAnimatedHero`, `enableA11yHints`, `enableContactForm`
   - Install SDKs: `@launchdarkly/react-client-sdk`
   - Add env var `NEXT_PUBLIC_LD_CLIENT_ID` per environment (GitHub Actions + local `.env.local`)
   - Wrap root layout with `LDProvider` and provide a default anonymous context
   - Use `useFlags()` in components to control rendering and experiments
   - Enable local bootstrap (`options.bootstrap = 'localStorage'`) to minimize flicker

   Example usage in the app entry (plan-level snippet):
   ```tsx
   // app/providers.tsx
   import { LDProvider } from 'launchdarkly-react-client-sdk';

   export function Providers({ children }: { children: React.ReactNode }) {
     return (
       <LDProvider
         clientSideID={process.env.NEXT_PUBLIC_LD_CLIENT_ID!}
         context={{ kind: 'user', key: 'public-visitor' }}
         options={{ bootstrap: 'localStorage' }}
       >
         {children}
       </LDProvider>
     );
   }
   ```

4) Content Pipeline
   - Add MDX support for pages/sections (resume, cover letter, case studies)
   - Implement a content loader that supports metadata (title, date, tags)
   - Draft initial content stubs and routes

5) Design System & Components
   - Tailwind tokens: spacing scale, color palette, radii, shadows
   - Components: `Button`, `Card`, `Metric`, `Timeline`, `Badge`, `Testimonial`, `CodeBlock`
   - Accessibility checks (FocusVisible, ARIA, reduced motion)

6) Backend (API + Data)
   - CDK `ApiStack`:
     - HTTP API (API Gateway) with routes: `POST /contact`, `GET /health`
     - Lambda functions (Node 20, TS) with esbuild bundling
     - DynamoDB table `submissions` (PK: `id`, GSI for `createdAt` if needed)
     - SES send permissions; SSM parameters for secrets/config (e.g., recipient email)
     - Throttling (e.g., 10 rps burst 20) + optional WAF rate rule
   - Lambda `POST /contact` flow:
     - Validate payload (zod schema), sanitize input
     - Hash IP to `ipHash` for simple duplicate detection; add UA
     - Store row in DynamoDB; send SES email to recipient; return 202
     - Structured logs with `requestId`, `flagSnapshot` (optional), `result`

7) Hosting & CDN
   - CDK `WebStack`:
     - S3 bucket for static site hosting (private, origin access control)
     - CloudFront distribution (viewer protocol redirect, compression, caching policies)
     - Response Headers Policy (CSP, HSTS, XFO, XCTO, ReferrerPolicy)
     - Optional: custom domain (ACM cert in us-east-1) and Route 53 records

8) Observability
   - CDK `ObservabilityStack`:
     - CloudWatch Log Groups (retention), Metrics, Alarms (Lambda error rate, 5XX)
     - CloudFront access logs to S3; Athena table for queries
     - Dashboard: request count, p50/p95 latency, error rates
   - Lighthouse CI in GitHub Actions for performance budgets
   - Optional: X-Ray tracing for Lambda; sampling 5–10%

9) CI/CD
   - GitHub OIDC role in AWS; federate `repo:owner/name:ref:refs/heads/*`
   - Workflows:
     - `ci.yml`: install, lint, typecheck, test, build
     - `infra.yml`: cdk synth + deploy (staging on PR, prod on main tag)
     - `web-deploy.yml`: build Next.js, upload to S3, CloudFront invalidation
     - `lighthouse.yml`: run Lighthouse CI on preview/prod URLs

10) Security & Hardening
   - Strict CSP with allowed domains (self, CloudFront, LaunchDarkly client endpoints)
   - Form spam controls: honeypot field + server-side rate limiting
   - Rotate SES credentials and enforce DMARC/SPF if using custom domain

11) Content & Polish
   - Write and review resume, cover letter, case studies (metric-forward)
   - Add OG images, sitemap, robots.txt; add favicons
   - Validate accessibility (axe, keyboard-only passes)

12) Launch & Post-Launch
   - Final Lighthouse ≥ 90 across categories
   - Enable alarms; smoke test health and contact form
   - Announce and share link; monitor errors and iterate with flags

## Directory Structure (Planned)
```
/
  docs/
    contextprompt.md
    implementation-plan.md
  apps/
    web/            # Next.js app
  packages/
    ui/             # shared components (optional)
    config/         # eslint, tsconfig, tailwind configs
  infra/            # AWS CDK (ts)
    bin/
    lib/
      api-stack.ts
      web-stack.ts
      observability-stack.ts
  .github/workflows/
```

## Environment Variables & Secrets
- Frontend (public): `NEXT_PUBLIC_LD_CLIENT_ID`
- Frontend (private at build): `NEXT_PUBLIC_BASE_URL` (computed), feature defaults
- Backend/Infra (SSM/Secrets Manager):
  - `CONTACT_RECIPIENT_EMAIL`
  - `LAUNCHDARKLY_SDK_KEY` (only if using server SDK later)
  - `ALLOWED_ORIGINS`

## LaunchDarkly: Installation & Usage Details
- Install: `npm i @launchdarkly/react-client-sdk`
- Provider: wrap app with `LDProvider`; set `clientSideID` from `NEXT_PUBLIC_LD_CLIENT_ID`
- Context: anonymous user `{ kind: 'user', key: 'public-visitor' }`
- Flags: define defaults in code to avoid undefined states
- Flicker mitigation: `bootstrap: 'localStorage'`, set default flag values
- Serverless SDK (optional): `launchdarkly-node-server-sdk` inside Lambda; initialize lazily and reuse between invocations; only if needed for server-side decisions

## CDK Notes
- Use `aws-cdk-lib@^2` and `constructs@^10`
- Synth separate stacks: `WebStack`, `ApiStack`, `ObservabilityStack`
- Outputs: API URL, CloudFront URL, DynamoDB table name; export to GitHub Actions
- Buckets with versioning and blocked public access; OAC for CloudFront → S3

## CI/CD Notes
- GitHub Actions OIDC role with least privilege (assume role for deploy only)
- Cache dependencies between runs; parallelize jobs (lint/typecheck/test/build)
- PR previews: deploy to `staging` distribution or prefix; annotate PR with URLs

## Frontend ↔ Backend Wiring
- API base URL: expose API Gateway invoke URL to the frontend via `NEXT_PUBLIC_API_BASE_URL`
- CORS: allow only the production/staging site origins
  - Allowed origins: `https://da.nielyi.com`, `https://<staging-domain-or-cloudfront-id>.cloudfront.net`
  - Methods: `GET,POST,OPTIONS`; Headers: `Content-Type`, `x-request-id`
  - Configure CORS at API Gateway (HTTP API CORS settings) and harden Lambda to reject unexpected methods
- Client fetch util (typed + resilient):
  ```ts
  // apps/web/lib/api.ts
  import { z } from 'zod';

  const ContactResponse = z.object({ id: z.string(), status: z.literal('accepted') });

  export async function postContact(payload: { name: string; email: string; message: string }) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const res = await fetch(`${base}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Contact failed: ${res.status}`);
    return ContactResponse.parse(await res.json());
  }
  ```
- Environment management:
  - Local: `.env.local` contains `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_LD_CLIENT_ID`
  - CI: set the same as environment variables or Actions secrets → build-time inject
- Lambda: validate and sanitize payloads; never trust client headers; log requestId

## Custom Domain Setup: da.nielyi.com
Goal: serve the site at `https://da.nielyi.com` with CloudFront + S3 and a valid TLS cert; optionally expose API at a subdomain later (e.g., `api.da.nielyi.com`).

Prerequisites
- You own `nielyi.com` and can manage DNS.
- Prefer Route 53 hosted zone for `nielyi.com` (import existing if registrar is elsewhere; update registrar NS records to the Route 53 nameservers).

Certificate (ACM) — us-east-1 required for CloudFront
1. In ACM (N. Virginia/us-east-1), request a public certificate for:
   - `da.nielyi.com`
2. Choose DNS validation; ACM will provide CNAMEs.
3. Create the CNAME records in Route 53 (or your DNS provider) until ACM shows “Issued”.

CloudFront + S3
1. S3 bucket for site assets: private bucket with Origin Access Control (OAC).
2. CloudFront distribution:
   - Origin: the S3 bucket via OAC
   - Alternate domain names (CNAMEs): `da.nielyi.com`
   - Attach the ACM cert from us-east-1
   - Default behavior: redirect HTTP → HTTPS, compress, cache policies for static assets
   - Response Headers Policy: strict security headers + CSP (include LaunchDarkly domains)
3. Route 53 A/AAAA alias record for `da` → CloudFront distribution target.

API Gateway (CORS + origin alignment)
1. Keep API on default execute-api domain for v1 (simplest, free-tier friendly).
2. Enable CORS to allow `https://da.nielyi.com` (and staging) only.
3. Surface invoke URL as `NEXT_PUBLIC_API_BASE_URL` to the frontend.
4. Optional later: custom domain `api.da.nielyi.com` using ACM cert in the same region as API (can be any region); create Route 53 alias to API mapped domain.

SES (email for contact form)
1. Verify sender identity (domain or single email). If verifying domain, add TXT/CNAME records for SPF/DKIM.
2. SES sandbox note: you can only send to verified recipients until sandbox is lifted. For v1, use your verified address as recipient. Request production access later if needed.

CSP & External Endpoints
- Add LaunchDarkly and API domains to CSP appropriately.
  - `connect-src`: `self` `https://app.launchdarkly.com` `https://clientstream.launchdarkly.com` `https://events.launchdarkly.com` API base URL
  - `script-src`: `self` `unsafe-inline` (try to avoid) CloudFront domain
  - `img-src`: `self` data: https:
  - Tighten as you test; prefer nonces/hashes where feasible

CDK Summary (high-level wiring)
```ts
// infra/lib/web-stack.ts (conceptual)
// - Request us-east-1 ACM cert for da.nielyi.com (DNS validation)
// - S3 bucket (private) + OAC
// - CloudFront distribution with alt name + cert
// - Route53 A/AAAA alias for da → distribution
```

Validation Checklist
- `https://da.nielyi.com` loads over TLS with valid cert
- CloudFront → S3 OAC works (no public bucket access)
- `POST /contact` from the site succeeds; CORS passes in browser
- CSP does not block LaunchDarkly or API requests
- Staging origin is permitted in CORS until launch, then removed

## Acceptance Criteria (for this plan)
- Stack choices are fixed as above
- All steps are clear, actionable, and sequenced
- LaunchDarkly integration steps are explicit for dev/prod

## Projects Page — Plan (Design-forward showcase)

Purpose
- Create a visually compelling landing page at `/projects` highlighting selected projects with short blurbs and links. Emphasis is on design, clarity, and polish (not long case studies).

Scope (v1)
- Responsive grid of project cards with strong typography and minimal chrome
- Each card: title, short blurb (≤120 chars), optional tags, destination link (internal or external)
- Optional hero card at top for a featured project
- Subtle motion/hover “glass” treatment (CSS fallback; optional shader on capable devices)
- Keyboard/focus states that are obvious and elegant

Content source
- MDX files (SSG) to keep authoring simple and versioned
  - Location: `apps/web/content/projects/*.mdx`
  - Frontmatter fields:
    - `title: string`
    - `href: string` (internal route or external URL)
    - `excerpt: string` (≤120 chars)
    - `tags?: string[]`
    - `image?: string` (path in `public/projects/…`)
    - `accentColor?: string` (CSS color token)
    - `featured?: boolean`

Routing
- Page route: `/projects`
- Optional detail route per project: `/projects/[slug]` (deferred; v1 links can go out to external destinations or sections on the site)

Layout & interaction
- Grid
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns (hero spans 2× if featured)
- Card content
  - Title set in display serif; blurb in sans muted
  - Optional tag row (small caps, spaced)
- Hover
  - Glass panel fade-in with subtle translate/scale; arrow nudge →
  - Reduced motion: disable transforms, keep opacity-only
- Focus
  - 2px focus ring with offset that respects dark/light

Design tokens & theming
- Reuse existing display serif and body fonts
- Respect dark/light; cards use translucent backgrounds (glass) over hero/repeatable background if present
- Accent colors per card (optional) that only affect small details (e.g., tag dot or underline)

Performance & SEO
- Static export of `/projects` (no client data fetch)
- Images: pre-sized assets in `public/projects/` with modern formats when possible; `loading="lazy"`
- Metadata on page and (optional) per-detail: title/description/OG; consider JSON‑LD `CreativeWork` if detail pages added later

Accessibility
- Cards are single interactive elements (the whole card is a link)
- Maintain logical tab order; ensure 4.5:1 contrast on text
- Support prefers-reduced-motion

Feature flag
- `enableProjectsPage` (LaunchDarkly) to toggle visibility in nav/hero links

Implementation steps (when we build it)
1. Content model: create `apps/web/content/projects/` with 3–6 example MDX files and images
2. Data loader: utility to read frontmatter at build time (Vite/Next MDX import)
3. UI: `ProjectsGrid` component with hero variant, card component with hover glass (CSS fallback)
4. Route: `app/projects/page.tsx` rendering grid from MDX metadata
5. Nav: add `/projects` link from hero and header
6. QA: keyboard navigation, reduced motion, Lighthouse pass, mobile spacing tweaks

Acceptance criteria (v1)
- `/projects` renders a responsive grid with at least 3 cards (one featured)
- Cards present title, short blurb, and open links correctly (internal/external)
- Hover/focus interactions feel polished; reduced motion supported
- Page is static, fast, and passes accessibility and performance checks

## Current Status — 2025-08-28
- Infra
  - WebStack live: S3 (private) + CloudFront (OAI), SPA fallback, security headers
  - ApiStack live: HTTP API (`GET /health`, `POST /contact`), Lambda, DynamoDB table
  - Outputs wired to GitHub Actions secrets; deploys green
- Domain
  - `da.nielyi.com` → CloudFront (ACM us-east-1). DNS propagation confirmed
- CI/CD
  - Infra workflow deploys CDK (compiled JS) with OIDC
  - Web deploy builds/export, syncs S3, invalidates CloudFront; added S3 listing for diagnostics
- Frontend
  - Next.js app (TS, Tailwind v4) with static export
  - MDX enabled (providerImportSource via `@/mdx-components`) and pages: `/resume`, `/cover-letter`, `/case-studies`
  - Homepage: full-viewport hero (bg image, bottom-left copy), trusted-by marquee, expertise, work grid (reveal), principles
  - Header: fixed, blur, auto-hide on scroll; footer added
  - Technical page `/technical` with live API health widget
- Observability
  - Basic health check; CloudFront logs enabled via plan; alarms pending

Next Up
- Content pass (human-authored) on resume, cover letter, case studies
- Optional: tighten CSP and add Lighthouse CI budget thresholds
- Optional: staging subdomain and per-PR previews if desired

## Local Setup (Turnkey)
- Prerequisites: Node 20 LTS, Git, AWS CLI v2, AWS CDK v2, pnpm (via corepack), a LaunchDarkly account
- One-time machine setup:
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  aws --version
  cdk --version || npm i -g aws-cdk
  ```
- Repo bootstrap (monorepo layout):
  ```bash
  pnpm dlx create-next-app@latest apps/web \
    --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
  mkdir -p infra/{bin,lib} packages/{config,ui}
  ```
- Next.js config for static hosting:
  ```ts
  // apps/web/next.config.ts
  const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
    reactStrictMode: true,
  };
  export default nextConfig;
  ```
- Env files:
  ```bash
  # apps/web/.env.local (example)
  NEXT_PUBLIC_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com
  NEXT_PUBLIC_LD_CLIENT_ID=<ld-client-side-id>
  ```
- Install dependencies and run:
  ```bash
  pnpm install
  pnpm --filter ./apps/web dev
  ```

## CDK Bootstrap & Deploy (Turnkey)
```bash
# Set default region (example: us-east-1 for global resources)
aws configure set region us-east-1

# Initialize CDK app if not created
cd infra
pnpm add aws-cdk-lib constructs
pnpm exec cdk init app --language typescript

# Bootstrap account/region (run once)
pnpm exec cdk bootstrap aws://<account-id>/us-east-1

# Synthesize and deploy stacks
pnpm exec cdk synth
pnpm exec cdk deploy WebStack ApiStack ObservabilityStack --require-approval never
```

## CloudFront SPA Fallback
- For exported static sites, ensure 404s fall back to `/index.html` for client-side routing.
- Configure CloudFront to map 403/404 to `/index.html` (error response) with 200 status.
- Ensure S3 contains `index.html` and `404.html` from Next.js export.

## CORS (Exact Policy)
```json
{
  "allowOrigins": [
    "https://da.nielyi.com",
    "https://staging.da.nielyi.com"
  ],
  "allowMethods": ["GET", "POST", "OPTIONS"],
  "allowHeaders": ["Content-Type", "x-request-id"],
  "maxAge": 86400
}
```

## Security Headers & CSP (Ready to paste)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer-when-downgrade
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy:
  default-src 'self';
  connect-src 'self' https://app.launchdarkly.com https://clientstream.launchdarkly.com https://events.launchdarkly.com https://<api-id>.execute-api.<region>.amazonaws.com;
  img-src 'self' data: https:;
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
```

## CI/CD Examples (Minimal)
```yaml
# .github/workflows/web-deploy.yml
name: Web Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: corepack enable && corepack prepare pnpm@latest --activate
      - run: pnpm install
      - name: Build
        env:
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
          NEXT_PUBLIC_LD_CLIENT_ID: ${{ secrets.NEXT_PUBLIC_LD_CLIENT_ID }}
        run: |
          cd apps/web
          pnpm build
      - name: Upload to S3
        run: |
          aws s3 sync apps/web/out s3://$BUCKET --delete
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id $DIST --paths '/*'
```
```yaml
# .github/workflows/infra.yml
name: Infra
on:
  push:
    branches: [main]
jobs:
  cdk:
    runs-on: ubuntu-latest
    permissions: { id-token: write, contents: read }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: corepack enable && corepack prepare pnpm@latest --activate
      - run: pnpm install
      - run: |
          cd infra
          pnpm exec cdk synth
          pnpm exec cdk deploy --require-approval never
```

## Staging Domain Pattern
- Create `staging.da.nielyi.com` with its own ACM cert (us-east-1), CloudFront distribution, and Route 53 alias.
- Add staging origin to API CORS during development; remove before launch if not needed.

## Free-Tier Guardrails
- API Gateway + Lambda throttling (e.g., 10 rps, burst 20); alarms on 5XX and throttle count
- DynamoDB on-demand with alarms on RCUs/ WCUs; TTL for submissions if desired
- CloudFront and S3: enable compression, long TTL for immutable assets
- SES sandbox: only verified recipients until production access is approved


