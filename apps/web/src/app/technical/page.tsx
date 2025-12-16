import type { Metadata } from "next";
import { ApiHealth } from "@/components/status/ApiHealth";
import { Card, KeyValue, SectionHeader, CodeInline } from "@/components/technical/Sections";

export const metadata: Metadata = {
  title: "Technical Notes",
  description: "How this site is built: infra, CI, and trade-offs.",
};

export default function TechnicalPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="display-serif text-4xl tracking-[-0.01em]">Technical notes</h1>
        <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">
          A full‑stack demo deployed on AWS free‑tier. Static‑first, accessible, and observable.
        </p>
        <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">
          <a href="https://github.com/d-aniel-yi/danielyi-site" className="underline">View on GitHub</a>
        </p>
      </header>

      {/* Frontend Section */}
      <section className="mt-4">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Frontend</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <SectionHeader title="Overview" subtitle="Next.js + TypeScript, static export" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>React 18 — Server Components by default; Client Components where interactivity is needed</li>
              <li>App Router, TypeScript strict, Tailwind v4</li>
              <li>
                Static export (<CodeInline>output: &apos;export&apos;</CodeInline>) → S3 + CloudFront (OAC)
              </li>
              <li>MDX for content; providerImportSource wiring</li>
              <li>Dynamic imports for effects (e.g., liquid‑glass) to keep TTI fast</li>
              <li>Hooks/state used sparingly; a11y + reduced‑motion respected</li>
              <li>Editorial design tokens and components</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Performance" subtitle="Fast-first defaults" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Static export with long TTLs for assets</li>
              <li>Minimal deps; system fonts + one display family</li>
              <li>Lighthouse CI workflow to catch regressions</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Trade‑offs" subtitle="Free‑tier &amp; simplicity" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Static export over SSR to reduce cost/complexity</li>
              <li>DynamoDB over RDS to stay in free‑tier and keep ops light</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="LaTeX (Resume)" subtitle="Two paths: HTML and PDF" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Build‑time parsing of <CodeInline>template.tex</CodeInline> → structured HTML resume</li>
              <li>
                Optional browser WASM compile (SwiftLaTeX) for on‑demand PDF; vendored engine + public
                sources work with static export
              </li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="PWA Support" subtitle="Favicons &amp; manifest" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Complete favicon set (ICO, SVG, PNG 96x96)</li>
              <li>Apple touch icon (180x180) for iOS</li>
              <li>Web app manifest for Android home screen</li>
              <li>PWA icons (192x192, 512x512) with maskable support</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Backend & Infra Section */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Backend & Infra</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <Card>
            <SectionHeader title="Live status" />
            <ApiHealth />
          </Card>
          <Card>
            <SectionHeader title="API & Integration" subtitle="Small, typed, and secure" />
            <KeyValue
              items={[
                { key: "API", value: "HTTP API: GET /health, POST /contact" },
                { key: "Runtime", value: "Lambda Node 20 (TS), esbuild bundling" },
                { key: "Data", value: "DynamoDB for submissions + rate limits" },
                { key: "Email", value: "SES notifications" },
                { key: "CORS", value: "Locked to prod/staging origins" },
              ]}
            />
          </Card>
          <Card>
            <SectionHeader title="AWS (CDK)" subtitle="Secure by default" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>S3 private origin + CloudFront OAC</li>
              <li>SPA fallback (403/404 → <CodeInline>/index.html</CodeInline>)</li>
              <li>Security headers + CSP for flags and API</li>
              <li>Outputs piped to GitHub Actions for deploys</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Security & Rate Limiting Section */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Security & Rate Limiting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <SectionHeader title="IP-Based Rate Limiting" subtitle="Prevent spam and abuse" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>3 submissions per IP per hour</li>
              <li>10 submissions per IP per day</li>
              <li>DynamoDB tracking with 24h TTL expiration</li>
              <li>Returns 429 Too Many Requests when exceeded</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Input Validation" subtitle="Strict enforcement" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Max payload size: 10KB</li>
              <li>Field length limits (name: 100, email: 100, message: 2000)</li>
              <li>Email format validation</li>
              <li>Input sanitization (removes control chars, null bytes)</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="CAPTCHA Ready" subtitle="Cloudflare Turnstile" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Component implemented, disabled by default</li>
              <li>Enable via environment variable if needed</li>
              <li>Free and privacy‑friendly</li>
              <li>Auto‑verifies when disabled (no code changes)</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Observability & Monitoring Section */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Observability & Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <SectionHeader title="CloudWatch Alarms" subtitle="5 alarms monitoring" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Lambda invocations {'>'}1000/hour</li>
              <li>Lambda errors {'>'}10/hour</li>
              <li>API 4xx errors {'>'}50/hour</li>
              <li>API throttles {'>'}20 in 5 min</li>
              <li>DynamoDB writes {'>'}100/hour</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="SNS Notifications" subtitle="Real‑time alerts" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Email notifications for all alarms</li>
              <li>Immediate incident response capability</li>
              <li>Track attack patterns and anomalies</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Dashboard" subtitle="CloudWatch metrics" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Lambda invocations and errors</li>
              <li>API Gateway requests and errors</li>
              <li>Real‑time traffic visualization</li>
              <li>Historical trend analysis</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Projects Architecture Section */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Projects Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <SectionHeader title="Expandable Tech Details" subtitle="Inline showcase" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Click to expand technical architecture on project cards</li>
              <li>Shows stack, architecture overview, and highlights</li>
              <li>Smooth animations with reduced‑motion support</li>
              <li>Accessible with proper ARIA attributes</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Dedicated Detail Pages" subtitle="/projects/[slug]" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Deep‑dive pages for major projects</li>
              <li>Tech stack breakdown by category</li>
              <li>System architecture with component details</li>
              <li>Challenges solved and performance metrics</li>
              <li>Static generation via generateStaticParams</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Cost Protection Section */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">Cost Protection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <SectionHeader title="Normal Traffic" subtitle="$0/month" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>All services within AWS free tier</li>
              <li>API Gateway: 1M requests free</li>
              <li>Lambda: 1M requests, 400k GB‑seconds free</li>
              <li>DynamoDB: 25 GB storage, 25 WCU/RCU free</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Under Attack" subtitle="~$2-3/month max" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Rate limiting caps request volume</li>
              <li>IP tracking prevents DynamoDB explosion</li>
              <li>CloudWatch alarms enable quick response</li>
              <li>Multi‑layer protection prevents runaway costs</li>
            </ul>
          </Card>
          <Card>
            <SectionHeader title="Without Protection" subtitle="$50-500+/month" />
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Unlimited Lambda invocations</li>
              <li>Unbounded DynamoDB writes</li>
              <li>No alerting or cost caps</li>
              <li>This architecture prevents this scenario</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Follow-ups */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">What&rsquo;s next</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Per‑PR previews via a staging distribution</li>
              <li>Stronger CSP + Lighthouse budgets</li>
              <li>CI &ldquo;Print to PDF&rdquo; artifact for the resume</li>
              <li>AWS Budget alert automation (currently manual)</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}


