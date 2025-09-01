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
          A full‑stack demo deployed on AWS free‑tier. Static‑first, accessible, and observable — all planned by me and built with the help of Cursor.
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
                Static export (<CodeInline>output: 'export'</CodeInline>) → S3 + CloudFront (OAC)
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
            <SectionHeader title="Trade‑offs" subtitle="Free‑tier & simplicity" />
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
                { key: "Data", value: "DynamoDB for submissions" },
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

      {/* Follow-ups */}
      <section className="mt-12">
        <h2 className="display-serif text-3xl tracking-[-0.01em] mb-4">What’s next</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Per‑PR previews via a staging distribution</li>
              <li>Stronger CSP + Lighthouse budgets</li>
              <li>CI “Print to PDF” artifact for the resume</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}


