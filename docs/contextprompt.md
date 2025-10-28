### Project Context Prompt — Portfolio Website for Daniel Yi

This document sets the north star, constraints, and quality bar for building a technically robust, creatively executed portfolio. It should guide all decisions (content, design, engineering, delivery) so the end result is unmistakably the work of a top-performing Account Executive who can also ship high-quality software.

## Objective
- Build a public website that functions as my resume and cover letter, demonstrating AE excellence, technical fluency, and creative execution.
- Make it clear that while top performers are common, a top performer who can conceive, architect, and ship this kind of product is rare.

## Primary Audience
-Two primary audiences: 
1. Potential investors, curious people
2. Hiring team and leaders (sales leadership, founders, engineers who interview AEs), if I am looking to apply for a job.

## Core Message
If I am looking for a job: "I’m an elite Account Executive with the curiosity, rigor, and technical skill to partner credibly with engineers and to ship. You’ll be hard-pressed to find this combination elsewhere."

If I'm not looking for a job: "I'm a curious person with a passion for well-made and well-designed things that solve problems. Productivity, effort, and ability are not the question - finding the right place is."

## Elevator Pitch to prospective employer (Homepage)
"A top-performing AE who ships: I connect dots between product, engineering, and customers—and I built this site (frontend, infra, CI/CD) and hosted it on AWS to show it."

## Success Criteria (What “great” looks like)
- Technical credibility: Clean, modern React front-end; serverless AWS backend; infrastructure as code; automated deploys; observability; performance best practices.
- Storytelling clarity: Crisp narrative that maps my track record to prospective company's context; compelling cover letter; quantified wins; case studies.
- Product taste: Thoughtful UX, polish, and interaction details; responsive and accessible.
- Velocity and quality: Small commits, strong linting/testing, preview environments PR-based; no dead links; green lighthouse scores.
- Measurable: Basic analytics and uptime checks; performance budgets; bundle size limits.

## Non-Goals (Intentionally out of scope for v1)
- Paid services beyond minimal unavoidable costs (e.g., custom domain/Route 53 if used).
- Overly complex auth flows; v1 is public read-only with optional contact form.
- Heavy CMS footprint; content can be Markdown-based.

## Constraints
- Free-tier (or near) AWS only for v1; serverless-first, minimal idle cost.
- Public read-only site; no user accounts or sensitive data collection.
- No secrets in client; configuration via environment variables and SSM/Secrets Manager.
- Minimal dependencies; performance budgets enforced; accessibility baseline WCAG AA.

## Tone and Voice
- Confident, concise, specific; metrics over adjectives; considerate of technical readers.
- Respectful of the reader’s time; scannable, with depth when desired.

## Content Outline 
- Landing hero: One-line value prop + subhead; CTA to resume and cover letter.
- Resume: Hosting resume page, automatically reading from LaTeX and compiling.
- Projects: Showcasing all projects with expandable technical architecture details; dedicated detail pages for major projects showing stack, architecture, challenges, and solutions.
- Cover letter: The who behind the page.
- Technical appendix: Architecture diagram, stack choices, tradeoffs, perf and ops; live API health monitoring.
- Contact: Email form (SES) and links (LinkedIn, GitHub). Multi-layer rate limiting, input validation, and CAPTCHA-ready spam protection.

## UX Principles
- Fast, responsive, accessible (WCAG AA); keyboard-first; prefers-reduced-motion friendly.
- Skimmable first, deep second; consistent spacing, typography scale, and iconography.
- Visual polish without bloat; minimal dependencies; liquid glass.

## Technical Direction (High-Level)
- Frontend: React + TypeScript; routing with a modern meta-framework (e.g., Next.js or Vite + React Router). Component library kept light; custom design system tokens.
- Backend (free tier AWS):
  - Static hosting on S3 behind CloudFront (SSL, CDN, compression, HTTP/2/3).
  - API: API Gateway + AWS Lambda (Node.js/TypeScript) for contact form and health checks.
  - Data: DynamoDB for form submissions and rate limit tracking (free tier eligible).
  - Email: Amazon SES for sending contact notifications.
  - Observability: CloudWatch logs + metrics + dashboard; SNS topic for alarm notifications; 5 CloudWatch alarms for security monitoring.
  - Security: IP-based rate limiting (3/hour, 10/day per IP), input validation, payload size limits, CAPTCHA-ready (Cloudflare Turnstile).
  - Optional: Cognito if a gated admin view is needed later (v2).
- Infrastructure as Code: AWS CDK (TypeScript) or Terraform (lean); prefer CDK for DX.
- CI/CD: GitHub Actions with OIDC into AWS; preview deployments on PRs; lint/test/typecheck in CI; Lighthouse CI optional.
- Performance: image optimization, code splitting, prefetch hints, strict bundle budgets, SSR/SSG as appropriate.

## Data/Privacy
- No PII storage beyond contact form contents; minimum necessary retention; redact sensitive fields.
- Use environment variables/Secrets Manager; never commit secrets.
- Rate limiting via IP tracking in DynamoDB with 24-hour TTL expiration; no long-term IP storage.
- Input sanitization prevents injection attacks; strict validation on all form fields.
- Contact form protected by multi-layer rate limiting to prevent spam and abuse.

## Quality Bar / Engineering Practices
- TypeScript strict mode; ESLint + Prettier + import sorting.
- Unit tests for utilities; integration tests for API endpoints; basic E2E happy paths.
- Conventional commits; PR templates; small, reviewable changes.
- Lint/typecheck/test must pass locally and in CI before merge.

## Visual Design Direction
- Clean, editorial feeling; focus on typography; generous white space; subtle motion.
- Color: limited palette; strong emphasis on contrast and clarity.
- Components: Button, Card, Tag/Badge, Metric, Timeline, Testimonial, Code block.

## Risks and Mitigations
- Deployment complexity → Use CDK constructs and small, composable stacks; start with staging env.
- Free-tier limits → ✅ Implemented: IP-based rate limiting (3/hour, 10/day), CloudWatch alarms, SNS notifications, input validation, CAPTCHA-ready; AWS Budget alerts pending manual setup.
- Cost spikes from attacks → ✅ Protected: Multi-layer rate limiting prevents DynamoDB/Lambda cost explosions; estimated <$3/month even under attack.
- Scope creep → Timebox v1; defer CMS/admin; lock MVP.

## Milestones (Draft)
1) Plan & scaffold: Context prompt (this), architecture choice, repo setup.
2) Infra MVP: S3+CloudFront static hosting; minimal API/Lambda; DynamoDB table.
3) Frontend MVP: Landing, About, Contact; Markdown content pipeline; theme tokens.
4) Content polish: Resume, cover letter, case studies; images; metadata/OG.
5) Quality: Tests, analytics, accessibility audit, performance tuning.
6) Launch: Domain, DNS, CDN invalidation, monitoring.

## Progress Snapshot (2025-10-28)
- Infra and domain are live (S3+CloudFront with OAC, API Gateway/Lambda/DynamoDB, `da.nielyi.com`).
- CI/CD in place with OIDC; web and infra workflows are green.
- Frontend hero, projects with expandable tech details, resume with LaTeX parsing/WASM compilation, and technical appendix fully implemented.
- Contact form protected with IP-based rate limiting (3/hour, 10/day), input validation, and CAPTCHA-ready (Cloudflare Turnstile disabled by default).
- Security: Multi-layer rate limiting, CloudWatch alarms, SNS notifications, and observability dashboard deployed.
- Projects showcase technical architecture with inline expandable sections and dedicated detail pages (`/projects/[slug]`).
- Complete favicon implementation with PWA support (web manifest, apple-touch-icon, multiple sizes).
- Rate limiting documentation: `/docs/rate-limiting.md` with testing instructions and adjustment guidance.
- Cost protection: AWS Budget alerts manual setup required; estimated $0/month normal traffic, <$3/month under attack with protections.
- Pending: AWS Budget alert setup (manual), SNS email subscription confirmation, content refinement for case studies.

## Initial Tech Stack Options
- React + TypeScript; choose one:
  - Next.js (App Router, SSG/ISR, image optimization); or
  - Vite + React Router (SSG via vite-plugin-ssg), lighter but more wiring.
- Styling: Tailwind CSS with design tokens or CSS-in-JS (vanilla-extract). Prefer Tailwind for speed.
- Infra: AWS CDK (TypeScript). Alt: Terraform if desired.
- Testing: Vitest/Jest + React Testing Library; Playwright for E2E.
- Analytics: Plausible (self-hosted optional) or simple CloudFront logs + Athena.

## Decision Records (to maintain in /docs/adr)
- 0001: Meta-framework decision (Next.js vs Vite).
- 0002: Infra as Code tool (CDK vs Terraform).
- 0003: Styling approach (Tailwind vs vanilla-extract).

## Definition of Done for v1
- Deployed to production with CDN + SSL, lighthouse scores ≥ 90 on Performance, Accessibility, Best Practices, SEO.
- CI passing: lint, typecheck, tests; infra code idempotent; zero "TODO" comments.
- Content accurate, typos fixed, links valid; analytics and monitoring live; contact form operational.

---
Use this document to keep scope aligned. If a decision conflicts with this north star, write an ADR to explain why and how we’ll mitigate.


