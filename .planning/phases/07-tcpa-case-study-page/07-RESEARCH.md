# Phase 7: TCPA Case Study Page - Research

**Researched:** 2026-04-19
**Domain:** NextJS-native case-study page authoring, static-export embed mechanics, narrative UX
**Confidence:** HIGH (with two MEDIUM areas flagged below — iframe-in-static-export behaviour under COOP/COEP, and final narrative ordering which is user-directed per CONT-04)

## Summary

Phase 7 builds a NextJS client page at `apps/web/src/app/projects/tcpa/page.tsx` that mirrors the visual shape of `/projects/mobi` (two-panel layout, serif hero, kicker + CTA pill, `STEPS.map()` content rendering, dark code blocks) but **without an architecture diagram** — the left sticky panel, if preserved, must carry something else. The page is narrative-first (30% problem context / 70% stack reasoning across MotherDuck Dives, MotherDuck MCP server, DuckDB-WASM) and includes an embedded preview of the `/tcpa` visualizer plus a "Try it live" CTA. Phase 7 is expected to produce **two plans**: an outline plan that locks section ordering, titles, narrative weights, and embed placement; then a prose plan that fills content top-to-bottom with user-directed copy.

The most consequential research finding is that an **iframe of `/tcpa` from `/projects/tcpa` is currently blocked** — `infra/lib/web-stack.ts` sets `frame-ancestors 'none'` on both paths. Enabling iframe embedding is a non-trivial infra change (CSP change + COEP alignment) and is also listed as **out of scope per REQUIREMENTS.md "Out of Scope"** (infrastructure/CDK changes). The lower-friction path is a **static screenshot** with a prominent "Try it live" CTA link to `/tcpa` — zero infra change, zero risk to SharedArrayBuffer, works immediately under static export. This is the primary recommendation.

**Primary recommendation:** Screenshot-with-CTA embed. Preserve mobi's two-panel 35%/65% layout but swap the left panel's diagram for a sticky dark-themed screenshot card that says "TCPA Litigation Explorer — in-browser DuckDB-WASM (29K rows, no backend)" with a "Try it live →" button linking to `/tcpa` in the same tab (since /tcpa replaces the viewport anyway, a new tab is not necessary but is user-preference; keep it as an outline-plan decision). Author content as a `STEPS` array of 6–7 entries weighted 30/70 across problem context and three stack-reasoning arcs. Ship the infra changes needed for iframe embedding **out of scope** for v1.2.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Route rendering `/projects/tcpa` | NextJS static export (client-component page) | — | Mobi precedent is `"use client"` page.tsx exported statically; same pattern applies |
| Visualizer preview embed | Browser (img tag) **or** browser (iframe) | — | No server involvement; must work under `output: 'export'` |
| "Try it live" navigation | Browser (`<Link>` or `<a>`) | — | Next.js `<Link href="/tcpa/">` works but the `/tcpa` route is a **static asset bundle, not a Next.js route** — use `<a href="/tcpa/">` to avoid Link's route resolution (see Pitfall 1) |
| Security headers for iframe | CDN / Static (CloudFront Function) | Infra / CDK | CSP `frame-ancestors` is set in `infra/lib/web-stack.ts` — not a page-level concern |
| Listing card | NextJS page `/projects` | — | Phase 8 concern, not Phase 7 |

## Standard Stack

### Core (No New Dependencies)

| Library | Version (in repo) | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| Next.js | 15.x (inferred from `next.config.ts` + `output: 'export'`) | Static export page | Already in use; mobi/fsbo/portfolio pages use it |
| React | 18.x / 19.x (per resume `package.json` — verify at plan time) | Client component | Mobi page is `"use client"` |
| Tailwind CSS | v4 (inferred from ProjectCard CSS tokens) | Styling | Same utility classes mobi uses (`font-serif`, `font-mono`, `bg-[#1e1e1e]`, etc.) |
| lucide-react | any (used in mobi for `Github` icon) | Icons | Already in bundle — use for `ExternalLink`, `ArrowRight`, or similar in the "Try it live" CTA |
| framer-motion | already present (used in `/projects` listing) | Animation | Optional; mobi page does NOT use it — recommend matching mobi and omitting |

**No new npm packages required.** Phase 7 is pure content + routing using patterns already shipped. [VERIFIED: apps/web/src/app/projects/mobi/page.tsx imports, apps/web/next.config.ts]

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `lucide-react` for Try-it-live icon | `@heroicons/react` / inline SVG | lucide already in mobi page; zero bundle cost |
| Plain `<a>` for `/tcpa` link | Next.js `<Link>` | `<Link>` prefetches + route-resolves, which breaks on static assets that live outside the app router — use `<a>` for `/tcpa/` (see Pitfall 1) |
| framer-motion for section reveals | Plain CSS / no animation | Mobi omits framer-motion inside the deep-dive page — matching that keeps visual consistency |

**Installation:** none.

**Version verification:** Not required for this phase — no new packages are being added. At plan time, verify `apps/web/package.json` has `lucide-react` (used by mobi) before importing from it.

## Architecture Patterns

### System Architecture Diagram

```
User opens /projects/tcpa
        │
        ▼
Next.js static export HTML  ← pre-rendered at build time (output: 'export')
        │
        ├──► React hydrates (client component, no server data fetch)
        │
        ├──► Hero: Case Study kicker + serif title + "Try it live" pill
        │
        ├──► Sticky left panel (35%, lg+): screenshot + label
        │         │
        │         └──► "Try it live →" ─── navigates to ─► /tcpa/ (separate static bundle)
        │                                                         │
        │                                                         ▼
        │                                                  DuckDB-WASM loads Parquet
        │                                                  (COOP/COEP enforced on /tcpa/*)
        │
        └──► Scrolling right column (65%): STEPS.map() renders sections
                                            ├── problem context (~30%)
                                            └── stack reasoning (~70%)
                                                 ├── MotherDuck Dives
                                                 ├── MotherDuck MCP server
                                                 └── DuckDB-WASM
```

**Data flow entry point:** URL request → CloudFront → S3 static HTML → hydrate. No API calls, no server-side data.
**Decision point:** left sticky panel content (screenshot vs. iframe vs. hybrid). See Gray Area 1.
**External boundary:** the "Try it live" link crosses from the Next.js app (`/projects/tcpa`) to a separate static bundle at `/tcpa/` that has different security headers (COOP/COEP `require-corp`).

### Recommended Project Structure

```
apps/web/src/app/projects/tcpa/
└── page.tsx                          # new file; ~350-500 lines matching mobi shape

apps/web/public/                      # screenshot asset(s) live here (or a tcpa-previews/ subdir)
├── tcpa-preview.png                  # (if screenshot option chosen — Gray Area 2)
└── tcpa/                             # existing static-exported visualizer (DO NOT TOUCH)
    ├── index.html
    ├── cases.parquet                 # 1.5 MB
    ├── cases_unclassified.parquet    # 1 KB
    └── assets/
        ├── duckdb-eh-*.wasm          # 33 MB
        ├── duckdb-browser-*.worker.js
        ├── index-*.js                # 800 KB
        └── index-*.css
```

**Key constraint:** `apps/web/public/tcpa/` is the frozen output of the external vite app. Per REQUIREMENTS.md Out of Scope, "Changes to the embedded TCPA visualizer source (`external/tcpa-visualizer/`)" are forbidden — do not modify anything under `public/tcpa/`. Screenshot assets should live outside that dir, e.g., `apps/web/public/tcpa-preview.png`. [VERIFIED: .planning/REQUIREMENTS.md Out of Scope table, line 67]

### Pattern 1: STEPS array + map render (verbatim from mobi)

**What:** Content lives in a top-level `const STEPS = [...]` array. Each entry is `{ id: "kebab-case", title: string, content: <>JSX</> }`. The right panel does `STEPS.map((step) => <section>...{step.content}...</section>)`.

**When to use:** Every section on this page. Do not deviate — consistency with mobi is a stated success criterion (PAGE-08).

**Example:**
```tsx
// Source: apps/web/src/app/projects/mobi/page.tsx (lines 10–27, 404–414)
const STEPS = [
    {
        id: "overview",
        title: "Microservices Architecture",
        content: (
            <>
                <p>Opening paragraph.</p>
                <p className="mt-4">Follow-up paragraph.</p>
            </>
        ),
    },
    // ...more entries
];

// render:
<div className="space-y-24">
    {STEPS.map((step) => (
        <section key={step.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-gray-300"></div>
                <h2 className="font-serif text-xl text-gray-900">{step.title}</h2>
            </div>
            <div className="text-gray-600 leading-relaxed text-sm pl-11">
                {step.content}
            </div>
        </section>
    ))}
</div>
```
[VERIFIED: apps/web/src/app/projects/mobi/page.tsx]

### Pattern 2: Dark code block styling (verbatim from mobi)

**What:** Code blocks use this exact class string:
```
mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800
```
Spans inside use a fixed syntax color palette (see Phase 6 research). Indentation uses `&nbsp;&nbsp;` (2-space) or `&nbsp;&nbsp;&nbsp;&nbsp;` (4-space), not spaces.

**Syntax color classes:**
- `text-purple-400` — keywords (`def`, `class`, `FROM`, `SELECT`, `@decorator`, `import`, `return`, `async`, `await`)
- `text-yellow-300` — function/class names
- `text-green-400` — string literals (quoted values, import paths)
- `text-gray-500` — comments (`#`, `--`, `//`)
- `text-blue-400` — decorators, annotations, types
- `text-orange-400` — numbers (when called out)

**When to use:** Any code snippet shown in the page. See Gray Area 6 for which snippets are recommended.
[VERIFIED: apps/web/src/app/projects/mobi/page.tsx + .planning/phases/06-content-expansion/06-RESEARCH.md — this is the established contract for the project.]

### Pattern 3: Hero layout (verbatim from mobi)

**What:** Header block in the right panel with three elements stacked:
1. `<p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">Case Study 00X</p>` — kicker
2. `<h1 className="font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900">Title: Subtitle</h1>` — serif title
3. CTA pill: `inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors` — icon + label

**For TCPA:** Kicker is `"Case Study 003"` (mobi is 002; see /projects/page.tsx for context — FSBO is the other deep dive but does not use this numbering scheme; there are 3 featured deep dives so "003" is defensible). Title proposal: `"TCPA: In-Browser Analytics"` or `"TCPA: Litigation Data in the Browser"` — final wording is CONT-04 user-directed.
[VERIFIED: apps/web/src/app/projects/mobi/page.tsx lines 384–401]

### Pattern 4: Two-panel layout with sticky left (verbatim from mobi)

**What:** The outer container is `flex flex-col lg:flex-row`. Below `lg`, panels stack; at `lg+`, a sticky 35% left panel sits next to a 65% scrolling right panel.

```tsx
<div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans flex flex-col lg:flex-row">
    {/* Left Panel: hidden below lg, sticky at lg+ */}
    <div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
        {/* content */}
    </div>
    {/* Right Panel: full width below lg, 65% at lg+ */}
    <div className="w-full lg:w-[65%] h-auto lg:h-screen overflow-y-auto">
        <div className="max-w-xl mx-auto px-8 py-24">
            {/* header + sections */}
        </div>
    </div>
</div>
```
[VERIFIED: apps/web/src/app/projects/mobi/page.tsx lines 354–433]

**Critical note from phase 5 STATE:** "Sticky 35% panel with hidden lg:block, outer flex has no overflow to preserve sticky behavior." Do not add `overflow: hidden` or `overflow-x` to the outer flex container — it will break the sticky positioning.
[CITED: .planning/STATE.md line 41]

### Anti-Patterns to Avoid

- **Adding `overflow-hidden` to the outer flex container** — breaks the sticky left panel (Phase 5 learned this the hard way).
- **Using `<Link>` for `/tcpa/`** — Next.js `<Link>` prefetches the target as a route, but `/tcpa/` is a static HTML bundle, not an app-router route. Use `<a href="/tcpa/">`. (See Pitfall 1.)
- **Iframe without an infra change** — CSP `frame-ancestors 'none'` currently blocks it site-wide. Attempting this without the CDK change will fail silently in browser (the iframe will be blank or show an X-Frame-Options error).
- **Importing anything from `external/tcpa-visualizer/`** — that is visualizer source and is out of scope per REQUIREMENTS.md.
- **Referring to "Dives" without disambiguation** — "Dive" is a MotherDuck product name; in prose, capitalize and/or prefix as "MotherDuck Dive" so it doesn't collide with "deep dive" (the type of page you're writing). Per STATE.md line 47.
- **Adding an architecture diagram** — explicitly out of scope per REQUIREMENTS.md line 69.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code-block syntax highlighting | A syntax highlighter library | The mobi-established `<span>`-with-tailwind-class pattern | Consistency with mobi is the point; a real highlighter would diverge visually |
| Narrative section scaffolding | A custom MDX pipeline | `STEPS` array + `.map()` (mobi pattern) | MDX is configured (`pageExtensions: ["ts", "tsx", "md", "mdx"]` in next.config) but mobi does not use it — deviating costs consistency |
| Sticky left panel scroll behaviour | Custom scroll listener / IntersectionObserver | CSS `position: sticky` on the `<div>` (mobi pattern) | Browser-native sticky works at `lg+` breakpoint and degrades cleanly to stacked layout below |
| External link icons | Handcrafted SVG | `lucide-react` (already imported by mobi) | Zero bundle-cost; already in dependency graph |
| Screenshot capture workflow | Nothing — take the screenshot manually | Browser devtools → save to `apps/web/public/` | A single static asset is the deliverable; no tooling needed |

**Key insight:** Every visual primitive this page needs already exists in `/projects/mobi/page.tsx`. The job is content authoring, not component engineering.

## Runtime State Inventory

N/A — Phase 7 is a greenfield page creation, not a rename/refactor/migration. No existing runtime state references `/projects/tcpa`.

## Common Pitfalls

### Pitfall 1: Treating `/tcpa/` as a Next.js route
**What goes wrong:** Using `<Link href="/tcpa">` or `<Link href="/tcpa/">` from next/link. Next.js will try to prefetch `/tcpa/` as if it were an app-router page, which it isn't — it's a static HTML bundle living in `public/tcpa/`. Depending on Next.js version and config, you may get build warnings, prefetch 404s, or hydration mismatches when the user clicks.
**Why it happens:** `/tcpa` looks like a route; `<Link>` is the default for internal navigation; developer habit.
**How to avoid:** Use a plain `<a href="/tcpa/">` for the "Try it live" CTA. The trailing slash matters — `next.config.ts` sets `trailingSlash: true`, and the CloudFront rewrite function at `infra/lib/web-stack.ts` expects `/tcpa/` (with slash) to map to `/tcpa/index.html`. Without the slash, the CloudFront function returns a 301 redirect to add it.
**Warning signs:** Build output mentions "prefetch" errors for /tcpa; browser devtools shows a prefetch to `/tcpa.json` or `/_next/data/.../tcpa.json`.
[VERIFIED: apps/web/next.config.ts line 14, infra/lib/web-stack.ts lines 62–75]

### Pitfall 2: Attempting iframe without an infra change
**What goes wrong:** You set up `<iframe src="/tcpa/">`. It appears blank. Console shows `Refused to display 'https://da.nielyi.com/tcpa/' in a frame because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'none'".`
**Why it happens:** `infra/lib/web-stack.ts` CSP includes `frame-ancestors 'none'` on both `/tcpa/*` (via the viewer-response CloudFront function at line 86) and the default site (via the ResponseHeadersPolicy at line 32), plus `X-Frame-Options: DENY` (line 39).
**How to avoid:**
1. Either: **Change approach to screenshot** (zero infra change — recommended).
2. Or: **Change infra** — update the CloudFront function at `infra/lib/web-stack.ts` line 86 so `/tcpa/*` uses `frame-ancestors 'self'`, AND remove / conditionalize the `X-Frame-Options: DENY` (it overrides CSP per some browsers), AND redeploy the stack. **This contradicts the "Infrastructure/CDK changes" out-of-scope rule in REQUIREMENTS.md.**
**Warning signs:** Iframe loads but is blank; browser console shows `frame-ancestors` or `X-Frame-Options` errors.
[VERIFIED: infra/lib/web-stack.ts lines 19–42 (default CSP + X-Frame-Options DENY), lines 79–98 (path-specific CSP), REQUIREMENTS.md line 68 (infra out of scope)]

### Pitfall 3: Breaking sticky by adding scroll containers
**What goes wrong:** Adding `overflow: hidden` or `overflow-x-auto` on the outer `flex flex-col lg:flex-row` container, or on any ancestor of the sticky panel. The sticky panel then scrolls away with the page.
**Why it happens:** Instinct to clip overflow on wide pages.
**How to avoid:** Keep the outer container free of any `overflow-*` utility. Per the Phase 5 STATE note: "outer flex has no overflow to preserve sticky behavior."
**Warning signs:** Left panel visible initially but scrolls off-screen as the user scrolls the page.
[CITED: .planning/STATE.md line 41]

### Pitfall 4: Misusing "Dive" in prose
**What goes wrong:** Prose reads "This is the deep dive for TCPA, which uses MotherDuck Dives to…" — the double-meaning confuses readers and dilutes the product name reference.
**Why it happens:** "Deep dive" is our existing term for the mobi/fsbo/tcpa pages themselves, and "MotherDuck Dive" is the product — collision is inevitable.
**How to avoid:** In TCPA-page prose, use "MotherDuck Dive" (capitalized, two words) for the product. Avoid "deep dive" as a noun inside this page's copy; if you need to refer to the page itself, say "case study" (consistent with "Case Study 003" kicker).
[CITED: .planning/STATE.md line 47]

### Pitfall 5: Screenshot drift over time
**What goes wrong:** The /tcpa visualizer UI changes in a future milestone (new tab, rearranged filters), but the screenshot on the case study page stays frozen. Visitors see a preview that doesn't match the actual app.
**Why it happens:** Screenshots are point-in-time; no automated refresh.
**How to avoid:** Name the screenshot in a way that signals it's a preview (e.g., `tcpa-preview.png`), consider adding a subtle "Preview" label overlay in the sticky panel, and log it as a Phase 8 / future-milestone consideration. For v1.2, the /tcpa visualizer source is frozen per STATE.md, so drift risk is low during this milestone but will grow later.

### Pitfall 6: Loading the screenshot via `<Image>` when the file is not optimized
**What goes wrong:** `next/image` with a large PNG under static export won't re-optimize (images config has `unoptimized: true`), so you get the full raw file. Mobile users on slow connections download a 2MB PNG.
**Why it happens:** `images: { unoptimized: true }` in next.config.ts disables the optimizer — necessary for static export but means image sizing is manual.
**How to avoid:** Export the screenshot at a reasonable resolution (e.g., 1600×1000 PNG, then compress with a tool to ~200–400KB, or use WebP). Plain `<img>` tag is fine here; `next/image` offers no benefit under `unoptimized: true`.
[VERIFIED: apps/web/next.config.ts line 15 `images: { unoptimized: true }`]

## Code Examples

Verified patterns from the mobi page and phase 6 research:

### Hero block (verbatim transplant, kicker + title + pill CTA)
```tsx
// Source: apps/web/src/app/projects/mobi/page.tsx lines 384–401
<header className="mb-16">
    <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">
        Case Study 003
    </p>
    <h1 className="font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900">
        TCPA: In-Browser Analytics
    </h1>
    <a
        href="/tcpa/"
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap"
        aria-label="Open the TCPA Litigation Explorer"
    >
        <ExternalLink className="w-4 h-4" />
        Try it live
    </a>
</header>
```
Note: `<a>` not `<Link>`. No `target="_blank"` — same-tab nav to `/tcpa/` is a full page replacement (standalone vite bundle). See Gray Area 3 for tab-behavior discussion.

### Left sticky panel — screenshot variant (recommended)
```tsx
// Mirrors: apps/web/src/app/projects/mobi/page.tsx lines 357–379 (replaces ReactFlow with <img>)
<div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
    <div className="h-full flex flex-col items-center justify-center p-8">
        <img
            src="/tcpa-preview.png"
            alt="TCPA Litigation Explorer dashboard preview"
            className="w-full rounded-sm shadow-lg border border-gray-200"
        />
        <p className="mt-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest text-center">
            In-browser DuckDB-WASM · 29K rows · No backend
        </p>
        <a
            href="/tcpa/"
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
            <ExternalLink className="w-4 h-4" />
            Try it live
        </a>
    </div>
</div>
```

### Left sticky panel — iframe variant (blocked by current infra; documented for completeness)
```tsx
// WILL NOT RENDER under current CSP. Requires infra change (out of scope per REQUIREMENTS.md).
<div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
    <iframe
        src="/tcpa/"
        className="w-full h-full border-0"
        title="TCPA Litigation Explorer"
        sandbox="allow-scripts allow-same-origin"
        // ⚠ CSP `frame-ancestors 'none'` blocks this.
    />
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact for this page |
|--------------|------------------|--------------|----------------------|
| Server-backed analytics dashboards | In-browser DuckDB-WASM querying bundled Parquet | 2024–2025 mainstream | The marquee narrative beat — "no backend, no accounts, instant queries" |
| Remote-query BI tools | MotherDuck Dives (AI-built shareable React dashboards querying live MD data) | Launched 2025 | The Dive is the source-of-truth dashboard; the `/tcpa` static bundle is a derivative |
| Manually wiring AI agents to databases | MotherDuck MCP server (official + self-hosted options; remote server went GA Dec 2025) | 2024–2025 | The story of "how the build happened" — MCP-driven iteration loop |
| GIF/video embeds of dashboards | Screenshot + "Try it live" CTA to a live static build | n/a | Simpler, smaller, no mobile autoplay issues |

**Deprecated/outdated:** Nothing relevant to this phase is deprecated. All three technologies (MotherDuck Dives, MD MCP server, DuckDB-WASM) are current as of April 2026.
[CITED: motherduck.com/product/dives/, motherduck.com/docs/sql-reference/mcp/, motherduck.com/blog/duckdb-ecosystem-newsletter-august-2025/]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | TCPA is "Case Study 003" (mobi is 002, FSBO/portfolio aren't numbered) | Hero / Pattern 3 | LOW — user can pick any kicker string; verify at outline-plan time |
| A2 | "Try it live" should navigate in the **same tab** | Gray Area 3 | LOW — one-line flip (`target="_blank"`); ask user at outline-plan time |
| A3 | Two-panel layout (preserve mobi shape with screenshot in left panel) is preferred over a single centered column | Gray Area 1 | MEDIUM — this is the shape decision the outline plan locks. Recommend the two-panel path for "visual shape consistent with /projects/mobi" (PAGE-08) |
| A4 | Narrative ordering: Problem → MotherDuck Dives → MCP server → DuckDB-WASM (chronological build flow) | Gray Area 4 | LOW — outline plan lets user choose; recommend chronological |
| A5 | Screenshot is 1600×1000 PNG at ~300KB | Pitfall 6 | LOW — exact format is production-time decision |
| A6 | No public TCPA GitHub repo exists (unlike mobi) — no "View on GitHub" slot | Gray Area 5 | HIGH if wrong — verified via `curl` against `github.com/d-aniel-yi/tcpa` and `github.com/d-aniel-yi/tcpa-visualizer` (both 404). Ask user at outline-plan time if a repo is planned to be published |
| A7 | "Dive" in source (the TCPA visualizer lives under `external/tcpa-visualizer/`) refers to MotherDuck Dives, not a colloquial "deep dive" | Pitfall 4 | LOW — confirmed by STATE.md line 47 |
| A8 | The outline plan produces a section-list embedded in a PLAN.md (not a separate OUTLINE.md file) | Gray Area 7 | LOW — no filesystem precedent for OUTLINE.md in this project; PLAN.md is the artifact format already used |

## Open Questions

**These are the decisions the outline plan must lock. The research has taken a position on each; the plan/user can override.**

1. **Which embed medium?** → Research recommends **screenshot + CTA** (zero infra change, no CSP risk, works immediately). Iframe requires an infra change that REQUIREMENTS.md flags as out of scope.
2. **Which layout shape?** → Research recommends **preserve two-panel, put screenshot in left sticky panel**. Single-column is simpler but PAGE-08 demands "visual shape consistent with /projects/mobi" — the two-panel IS the shape.
3. **Hero kicker string?** → Research assumes `"Case Study 003"`. Defensible (mobi is 002, 3rd deep dive), but user may prefer `"Case Study 002.5"` or `"Case Study 003 — Litigation Analytics"` or other.
4. **Does a public TCPA GitHub repo exist?** → Research verified: no. If one is planned, the hero CTA slot could hold a secondary "View on GitHub" pill like mobi's. Ask user.
5. **Target-tab behavior for "Try it live"?** → Research assumes same-tab (cleaner, matches the "navigate to /tcpa" language in the requirement VIZ-02). User may prefer new tab for preservation of the case-study context.
6. **Code snippets — how many, which ones?** → Research recommends 3 snippets, one per stack-reasoning section (see Gray Area 6). User-direction per CONT-04 may expand or contract.
7. **CTA multiplicity?** → Mobi has GitHub pills in both hero and end-of-page. TCPA "Try it live" could appear in: hero + sticky panel + end-of-page (3 places), or hero + end (2 places like mobi), or end only. Research recommends **hero + sticky panel + end-of-page** (3 places — the sticky panel CTA is always visible on lg+ so it doesn't compete).

## Environment Availability

**SKIPPED** — Phase 7 has no external dependencies beyond what the resume site build already uses. No new packages, no new services, no new tooling. Build is `npm run build` in `apps/web/` (already verified working through Phases 1–6).

## Validation Architecture

Per `.planning/config.json` (workflow has no `nyquist_validation` key, default = enabled).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Next.js static export build (same as Phase 6 — manual/visual for content, automated for build) |
| Config file | `apps/web/next.config.ts` |
| Quick run command | `cd apps/web && npx tsc --noEmit` (typecheck only, fast) |
| Full suite command | `cd apps/web && npm run build` (full static export) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-06 | `/projects/tcpa` page exists and loads | Build artifact check | `npm run build` produces `.next/server/app/projects/tcpa/` or `out/projects/tcpa/index.html` | ❌ Wave 0 (create page.tsx) |
| PAGE-08 | Visual shape consistent with mobi | Manual visual review | Compare screenshots of `/projects/mobi` and `/projects/tcpa` side by side | ❌ Wave 0 (prose plan) |
| CONT-02 | Problem context present, ~30% weight | Manual content review | Read page; estimate word count split | ❌ Wave 0 (prose plan) |
| CONT-03 | Stack reasoning covers Dives, MCP, DuckDB-WASM with ~70% weight | Manual content review | Grep for "MotherDuck Dive", "MCP", "DuckDB-WASM" occurrences in page.tsx | ❌ Wave 0 (prose plan) |
| CONT-04 | Content is user-directed, not generic | Manual review during prose plan | User approval at prose-plan review gate | ❌ Wave 0 (outline + prose plans) |
| VIZ-01 | Visualizer preview embedded | File-exists check + visual | Verify screenshot exists at `public/tcpa-preview.png` and is referenced in page.tsx | ❌ Wave 0 (acquire asset + reference it) |
| VIZ-02 | "Try it live" CTA links to `/tcpa` | Grep | `grep 'href="/tcpa/"' apps/web/src/app/projects/tcpa/page.tsx` returns ≥1 | ❌ Wave 0 (include CTA) |

### Sampling Rate
- **Per task commit:** `cd apps/web && npx tsc --noEmit` (catches JSX/TS errors fast)
- **Per wave merge:** `cd apps/web && npm run build` (catches static export issues, confirms /projects/tcpa renders into `out/`)
- **Phase gate:** `npm run build` exits 0 AND the outline+prose plans have been reviewed by the user before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `apps/web/src/app/projects/tcpa/page.tsx` — new file, created during execute phase
- [ ] `apps/web/public/tcpa-preview.png` (or equivalent screenshot asset) — must be acquired before the prose plan can embed it. Can be taken from a local dev run of `/tcpa/` or from a deployed preview. This is a **content asset task**, not a code task.
- [ ] No new test framework install required.

## Security Domain

Per `.planning/config.json` (no `security_enforcement` key, default = enabled).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Page is public-read, no auth layer |
| V3 Session Management | no | No sessions on a static page |
| V4 Access Control | no | Static public content |
| V5 Input Validation | no | No user input on this page |
| V6 Cryptography | no | No secrets, no crypto |
| V11 Data Protection | no | All data is public court records; none on this page anyway |
| V12 Communication | yes | HTTPS via CloudFront — already enforced by infra |
| V13 Configuration | yes | CSP `frame-ancestors 'none'` is intentionally strict — this phase must NOT weaken it for `/projects/*` (iframe embed would require a controlled, narrow exception for `/tcpa/` only, and that is out of scope here) |
| V14 Malicious Code | yes | No untrusted imports; all code authored in-repo or from existing project deps |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Clickjacking of `/tcpa/` via iframe on a malicious site | Tampering / Spoofing | Current CSP `frame-ancestors 'none'` + `X-Frame-Options: DENY` — do not weaken |
| XSS via markdown injection in narrative | Tampering | All content is authored in JSX source (no user-supplied content pipeline); no risk |
| Supply-chain risk from a new dep | Tampering | No new deps this phase |

**Recommendation:** Do not touch `infra/lib/web-stack.ts` in this phase. The iframe path would require scoped relaxation of `frame-ancestors` for `/tcpa/*` to `'self'`, but that is (a) infra/CDK work that is out of scope, and (b) needs a threat model of its own (e.g., does our COOP/COEP posture still give us SharedArrayBuffer safety?).

## Project Constraints (from CLAUDE.md)

No `CLAUDE.md` file is present at `./CLAUDE.md` (repo root, the agent's CWD). Verified via Read — tool returned no file found at `H:\resume_site\CLAUDE.md`. No project-level directives to enforce from that source.

Constraints extracted from the equivalent authoritative docs:

| Source | Constraint |
|--------|-----------|
| `.planning/PROJECT.md` | Must produce valid static export (`next build` with `output: 'export'`) |
| `.planning/PROJECT.md` | No regressions — existing pages must continue working |
| `.planning/REQUIREMENTS.md` Out of Scope | Do NOT modify `external/tcpa-visualizer/` |
| `.planning/REQUIREMENTS.md` Out of Scope | Do NOT make infrastructure/CDK changes |
| `.planning/REQUIREMENTS.md` Out of Scope | No architecture diagram on TCPA page |
| `.planning/STATE.md` | "Dive" = MotherDuck Dive, not "deep dive" — disambiguate in copy |
| `.planning/STATE.md` | Outline-first workflow — outline plan approved before prose plan fills content |

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-06 | Visitor can navigate to `/projects/tcpa` and see a case study page | Create `apps/web/src/app/projects/tcpa/page.tsx` (client component, same pattern as mobi). Static export produces `/out/projects/tcpa/index.html`. [VERIFIED: next.config.ts has `trailingSlash: true` and `output: "export"`] |
| PAGE-08 | Visual shape consistent with `/projects/mobi` | Preserve two-panel layout (35%/65% sticky left, scrolling right). Match hero (kicker + serif title + pill CTA). Match section pattern (STEPS array + horizontal-divider + serif h2). See Pattern 1–4 above. |
| CONT-02 | Problem context ~30% of narrative weight | Source problem framing from `external/tcpa-visualizer/CONTEXT.md` (post-Duguid boundary, 4 statutes, RECAP federal scope, CourtListener API, state court blind-spot). Suggested sections: "The Problem: What Changed Post-Duguid" (~1 section, ~400 words). |
| CONT-03 | Stack reasoning ~70%, covers Dives/MCP/DuckDB-WASM | Three primary sources: `external/tcpa-visualizer/STATIC-BUILD.md` (canonical DuckDB-WASM rationale — "no backend, 29K rows, COOP/COEP"), `external/tcpa-visualizer/CONTEXT.md` (MD Dive + MCP build flow, 5-tab layout), and web-search-verified current MotherDuck product docs. Suggested sections: one per technology (see Gray Area 4). |
| CONT-04 | User-directed content, not generic prose | Outline-first workflow: outline plan locks section ordering/weights; prose plan fills with user direction. Planner should draft outline as a structured list in the outline plan's PLAN.md, then the prose plan references the approved outline as input. |
| VIZ-01 | Visualizer preview embedded | Research recommends **screenshot** option. Left sticky panel holds the preview image; asset lives at `apps/web/public/tcpa-preview.png`. Iframe option documented but blocked by current CSP and out-of-scope per infra constraint. |
| VIZ-02 | "Try it live" CTA links to `/tcpa` | Plain `<a href="/tcpa/">` (not `<Link>`). Recommend placement in hero + sticky panel + end-of-page. Same-tab navigation recommended; verify at outline-plan time. |

---

## Gray Areas — Concrete, Evidence-Backed Recommendations

### Gray Area 1: Layout shape

**Mobi shape recap (`apps/web/src/app/projects/mobi/page.tsx` lines 354–433):**
- Outer: `flex flex-col lg:flex-row`, no overflow.
- Left: `hidden lg:block lg:w-[35%] h-screen sticky top-0` — 35% sticky panel (diagram in mobi).
- Right: `w-full lg:w-[65%] h-auto lg:h-screen overflow-y-auto`, content wrapped in `max-w-xl mx-auto px-8 py-24`.
- Content column max-width: `max-w-xl` = 36rem ≈ 576px.

**Option A — Preserve two-panel, screenshot in left panel (RECOMMENDED):**
- Pros: Maximum visual consistency with mobi (PAGE-08); the CTA lives in the panel always-visible on large screens; screenshot has plenty of room at 35% viewport width (~500px on a 1440px laptop).
- Cons: Below `lg` breakpoint the sticky panel is hidden (just like mobi), so mobile users don't see the preview in a sticky position — but mobi has the same constraint, and the right-column `STEPS` array can include a preview early in the scroll.

**Option B — Single centered column:**
- Pros: Simpler; some case-study pages read better as single-column.
- Cons: Diverges from mobi shape — directly violates PAGE-08. Rejected.

**Option C — Hybrid (sticky preview that reveals only in a certain section):**
- Pros: Sophisticated.
- Cons: Requires custom IntersectionObserver logic; no mobi precedent; over-engineered for a single-page deliverable.

**Recommendation: Option A.** If the outline plan wants a single-column variant, frame it as a deliberate PAGE-08 deviation and justify.

### Gray Area 2: Visualizer embed medium

**iframe of `/tcpa`:**
- **Currently blocked.** `infra/lib/web-stack.ts` lines 19–42 set CSP `frame-ancestors 'none'` and `X-Frame-Options: DENY` for the default site. Lines 79–98 set CSP `frame-ancestors 'none'` for `/tcpa/*` as well. An iframe would need at minimum: (a) change the viewer-response CloudFront function to set `frame-ancestors 'self'` for `/tcpa/*`, (b) remove or override `X-Frame-Options: DENY` (CSP `frame-ancestors` wins in spec but older browsers honor `X-Frame-Options` first), (c) redeploy the stack.
- **COOP/COEP risk:** The /tcpa route sets `Cross-Origin-Embedder-Policy: require-corp`. If the parent page (`/projects/tcpa`) does **not** set matching COOP/COEP, framing the /tcpa app could break its SharedArrayBuffer (which DuckDB-WASM uses). The parent page would need matching headers, which would require another CloudFront function path-match and would cascade the require-corp constraint to every asset the parent page loads (fonts from `data:`, images, etc.). The current default CSP allows `img-src data: https:` but COEP require-corp is more restrictive.
- **Bundle size cost:** Embedding the full /tcpa app via iframe causes every visitor to `/projects/tcpa` to download the 33MB WASM + 800KB JS + 1.5MB Parquet = ~35MB even if they never scroll. Screenshot is <500KB.
- **Out-of-scope per REQUIREMENTS.md:** "Infrastructure/CDK changes" is listed under Out of Scope.
- **Verdict:** Not viable for v1.2.

**Static screenshot (RECOMMENDED):**
- **Shape:** 16:10 or 16:9 PNG at ~1600×1000 feels right for the 35% sticky panel context (it will render at roughly 400–500px wide, so a 1600-wide source gives 2–3× DPR coverage). Aspect ratio should match the visualizer's natural look — take the screenshot with a mid-width browser (say 1400px) and crop modestly.
- **Location:** `apps/web/public/tcpa-preview.png` (outside `public/tcpa/` to avoid collision with the frozen visualizer bundle). A `/tcpa-preview@2x.png` variant for retina is optional since `next/image` optimization is disabled — browsers will do fine with a single 1600-wide file.
- **Annotations?** Mobi does NOT annotate its diagram (it's a live ReactFlow), and the TCPA page has no other annotated-image precedent in the codebase. Keep the screenshot plain. The narrative in the right column carries the analytical load. If annotations are desired, do them in-image (Figma export) rather than HTML overlays — the left panel CSS doesn't accommodate overlay positioning cleanly.
- **Verdict:** Primary recommendation.

**Video / GIF / animated WebP:**
- **GIF:** Bloat. A 10-second 1200×750 GIF is typically 5–15MB. Not acceptable.
- **MP4 with autoplay:** Works on desktop but mobile Safari requires `playsinline` and silent autoplay; still a ~2–5MB asset per viewer. Adds a loading flicker under sticky. No existing video-embedding pattern in the repo (searched `apps/web/src/components/` — no `<video>` usage in shared components).
- **Animated WebP:** Smaller than GIF (1–3MB) but browser support is fine in 2026. Still larger than a static image.
- **Verdict:** Not recommended for v1.2. If added later, MP4 `playsinline muted autoplay loop` with poster would be the shape.

### Gray Area 3: "Try it live" CTA placement and style

**Mobi precedent (`apps/web/src/app/projects/mobi/page.tsx`):**
- Hero pill (lines 391–400)
- End-of-page pill (lines 417–428)
- Style: `inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors`
- Icon: lucide-react `<Github className="w-4 h-4" />`

**TCPA recommendation:**
- **Placement:** 3 locations — hero, sticky left panel, end-of-page. The sticky-panel placement means the CTA is always visible on desktop; the hero/end placements give anchor points on mobile (where the sticky is hidden).
- **Style:** Same pill style as mobi for consistency. Icon: lucide-react `<ExternalLink />` (semantic match — opening the live app is "external" in spirit even though same-origin). Alternative: `<ArrowUpRight />` or `<PlayCircle />`. Do NOT use a filled "primary button" style — that breaks visual consistency with mobi's subtle pill.
- **Link element:** `<a href="/tcpa/">`, NOT `<Link>` (see Pitfall 1).
- **Target tab:** Same tab. Rationale: VIZ-02 reads "navigates the user to `/tcpa`" — suggests a single navigation. New tab is defensible if user prefers to preserve case-study context. The sticky-panel CTA at the bottom of the case study is already close to the end-of-page CTA, so preserving case-study context isn't critical. Ask user at outline-plan time.

### Gray Area 4: Stack-section narrative structure

**Source content available for each of the three technologies:**

**MotherDuck Dives (~25% of stack reasoning):**
- From `external/tcpa-visualizer/CONTEXT.md`: "Dive built with 5 tabs: Filings, Serial Litigators, Financial Exposure, Trend Analysis, Methodology" + "Include unclassified toggle" + "Trend Analysis presets: MTD vs Prev Month, YTD vs Prev Year, Custom date ranges" + "Trend Analysis snapshot panel: Period absolute stats (total, active, resolved, class actions, courts, avg duration) + claim type breakdown + legal theory breakdown + top plaintiffs". [VERIFIED: CONTEXT.md lines 137–142]
- From web search: "Dives are interactive visualizations created with natural language, directly on top of data in MotherDuck... live apps with charts, tables, filters... deployed as code inside MotherDuck." Available on all plans. [CITED: motherduck.com/product/dives/, motherduck.com/docs/key-tasks/ai-and-motherduck/dives/]
- **Narrative hooks:**
  - "BI-as-code" — dashboards are React components living in MotherDuck, versioned like code.
  - The 5-tab structure maps neatly to analytical questions (who files, who sues, how much, what trends, caveats).
  - Dives are dual-execution (cloud + local) so the same code runs against MotherDuck and, with a swap, against in-browser DuckDB-WASM — which is the bridge to Section 3.

**MotherDuck MCP server (~20% of stack reasoning):**
- From `external/tcpa-visualizer/CONTEXT.md`: "MotherDuck MCP server used during development for fast iteration." [VERIFIED: PROJECT.md line 58, paraphrased from CONTEXT]
- From web search: Local MCP server (self-hosted) and remote MCP server (MotherDuck-managed, went GA Dec 2025); enables AI agents (Claude, Cursor) to run SQL directly against MotherDuck. [CITED: motherduck.com/docs/sql-reference/mcp/, github.com/motherduckdb/mcp-server-motherduck]
- **Narrative hooks:**
  - "The agent wrote the SQL." — MCP made the 3-step enrichment pipeline (ingest → keyword search → PDF extraction) an iterative conversation instead of a batch-debug loop.
  - Schema exploration without leaving the chat — `FROM cases LIMIT 5` becomes a conversational prompt.
  - Dives themselves are often AI-built via MCP — closes the loop from "describe the data" to "here's a dashboard."

**DuckDB-WASM (~25% of stack reasoning — marquee section):**
- From `external/tcpa-visualizer/STATIC-BUILD.md` — the richest source. Key beats:
  - **The architecture flip:** Build-time (MotherDuck → export Parquet → bundle with Vite) vs runtime (browser → Parquet → DuckDB-WASM → React). [CITED: STATIC-BUILD.md lines 7–11]
  - **Concrete numbers:** 29K rows, ~2-3MB Parquet (ZSTD), ~4MB WASM cached after first load, ~5-50ms per query. [CITED: STATIC-BUILD.md lines 423–429]
  - **COOP/COEP requirement:** Cross-Origin-Opener-Policy: same-origin + Cross-Origin-Embedder-Policy: require-corp → enables SharedArrayBuffer → enables DuckDB-WASM's threaded WASM. [CITED: STATIC-BUILD.md line 91, verified infra/lib/web-stack.ts lines 88–89]
  - **Economic story:** "No server, no API keys, no authentication for viewers" + "Cost: Free (static hosting)" vs MotherDuck plan. [CITED: STATIC-BUILD.md lines 17, 433–441]
  - **Query rewrite:** The production dive and the static site share the same React components; only the `useSQLQuery` provider differs. The static provider rewrites `"consumer_litigation"."main"."cases"` → `cases` at query time. [CITED: STATIC-BUILD.md lines 252–263]
- **Narrative hooks:**
  - "29K rows of litigation in the browser" — concrete, memorable.
  - "Same React, different data source" — shows architectural discipline.
  - "COOP/COEP headers enable SharedArrayBuffer" — one-sentence deep-technical credibility.

**Recommended section ordering (chronological build flow):**
1. **The Problem (CONT-02, ~30%):** Post-Duguid boundary, 4 statutes, federal-only RECAP scope, why TCPA trend analysis matters. Source: `external/tcpa-visualizer/CONTEXT.md` lines 7–18.
2. **MotherDuck Dives: dashboards as code (CONT-03, ~20%):** What a Dive is, the 5-tab structure, BI-as-code, why this beats Tableau/Power BI for a narrative dashboard.
3. **MotherDuck MCP: conversational ETL (CONT-03, ~15%):** How the 3-step enrichment pipeline evolved via Claude + MCP, schema-aware iteration.
4. **DuckDB-WASM: zero-backend publishing (CONT-03, ~30%):** Why the Dive wasn't the final form — the /tcpa static bundle exists so visitors don't need a MotherDuck account. Parquet export, COOP/COEP, query numbers.
5. **(optional) Closing reflection (~5%):** What this stack lets you do that a traditional BI tool can't — ship a live dashboard as a static file.

Word-count-wise, 2500 total words gives ~750 problem / ~500 Dives / ~400 MCP / ~750 DuckDB-WASM / ~100 closing. The outline plan locks these weights; the prose plan hits them.

**Alternative: thematic grouping** ("Data plane" covering Dives + DuckDB-WASM, "Build plane" covering MCP + ingest) — less intuitive for this project. Recommend chronological.

### Gray Area 5: Hero / kicker / metadata

**Mobi hero (verified):**
- Kicker: `"Case Study 002"`
- Title: `"Mobi: Microservices"`
- Single CTA pill: GitHub link

**TCPA recommendations:**
- **Kicker:** `"Case Study 003"` — mobi is 002, so TCPA as the next case study in numbering sequence. If user wants a different scheme (e.g., `"Case Study 002.5"`, `"v1.2 / Case Study"`, or date-based `"2026 Case Study"`), capture at outline-plan time.
- **Title:** `"TCPA: In-Browser Analytics"` is the strongest candidate — it foreshadows the marquee story (DuckDB-WASM + zero backend) in three words. Alternates: `"TCPA: Litigation Data in the Browser"`, `"TCPA Explorer: A Dashboard as a Static File"`. Final wording is CONT-04 user-directed; research picks the shortest.
- **CTA slot:**
  - Primary: `"Try it live"` → `/tcpa/` (per VIZ-02).
  - Secondary GitHub pill? **No** — verified no public repo exists (both `github.com/d-aniel-yi/tcpa` and `github.com/d-aniel-yi/tcpa-visualizer` return 404). Ask user at outline-plan time if a repo is planned to be published for v1.2; if yes, add a second pill matching mobi's shape.

### Gray Area 6: Code snippets & external links

**Mobi snippet count:** 5 code blocks (Dockerfile, Celery task, SQL, SAM task, ConnectionManager) across 7 sections. Ratio: ~0.7 code-blocks per section.

**TCPA snippet recommendations (3 total, one per stack-reasoning section):**

1. **MotherDuck Dives section — SQL excerpt from the classification or top-plaintiffs query.** A ~10-line SELECT with CASE statements (claim_type / legal_theory classification) is visually dense, memorable, and shows off DuckDB SQL syntax. Source: can be reconstructed from the CONTEXT.md schema + typical SELECT patterns — the exact dive queries are in `external/tcpa-visualizer/.dive-preview/src/dive.tsx` per CONTEXT.md line 49 (note: that file is not present in the workspace snapshot read, so prose-plan executor should read it at write-time).

2. **MotherDuck MCP section — `.mcp.json` / MCP server config excerpt.** Show the `claude_desktop_config.json` or `.cursor/mcp.json` entry that wires the MotherDuck MCP server. Canonical format per the MCP server README: `{"mcpServers": {"motherduck": {"command": "uvx", "args": ["mcp-server-motherduck", "--db-path", "md:", "--motherduck-token", "<TOKEN>"]}}}`. Source: github.com/motherduckdb/mcp-server-motherduck README. [CITED, MEDIUM confidence — prose plan executor should verify current README at write-time]

3. **DuckDB-WASM section — the Parquet export one-liner + the `CREATE TABLE ... AS SELECT * FROM read_parquet(...)` snippet from `duckdb-provider.tsx`.** Two short blocks or one combined block. Source: `external/tcpa-visualizer/STATIC-BUILD.md` lines 29–41 (export) and lines 215–220 (registerFileBuffer + CREATE TABLE). [VERIFIED: STATIC-BUILD.md]

**External links (in-prose anchor tags, not hero CTAs):**
- MotherDuck Dives: `https://motherduck.com/docs/key-tasks/ai-and-motherduck/dives/`
- MotherDuck MCP: `https://motherduck.com/docs/sql-reference/mcp/` OR `https://github.com/motherduckdb/mcp-server-motherduck`
- DuckDB-WASM: `https://github.com/duckdb/duckdb-wasm`
- CourtListener API (referenced in problem section): `https://www.courtlistener.com/help/api/rest/`
- Facebook v. Duguid (problem section, to anchor the post-Duguid boundary): `https://www.supremecourt.gov/opinions/20pdf/19-511_p86b.pdf`

Recommend 1–2 outbound links per stack section, styled plainly (not buttons) with the existing link-on-prose color — mobi does not have inline external links so there's no precedent; use Tailwind `text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900`.

### Gray Area 7: Outline-first workflow mechanics

**Phase 6 precedent (content-expansion):**
- Phase 6 had exactly 1 plan (`06-01-PLAN.md`), because it was "extend the STEPS array in an existing page" — no separate outline gate was needed.
- Phase 6 artifacts: RESEARCH.md, CONTEXT.md, UI-SPEC.md, DISCUSSION-LOG.md, PLAN.md, SUMMARY.md, VERIFICATION.md, REVIEW.md, VALIDATION.md. No OUTLINE.md or similar precedent.
- The STEPS array was extended by appending three new objects before the closing `];` — purely additive, no structural changes.

**Phase 7 expected shape (from ROADMAP.md lines 140–141):**
- Plan 1: **Outline plan** — "produce and get approval on the section outline (headings, narrative weight per section, embed placement)"
- Plan 2: **Prose plan** — "fill approved outline with user-directed content, wire up embed + CTA"

**Recommendation for artifact shape:**
- **Outline plan (`07-01-PLAN.md`):** Has a normal task structure but the task output is a **locked section list** — roughly the "Recommended section ordering" in Gray Area 4 above, formalized into a YAML or TypeScript comment block that the prose plan consumes. One task, one deliverable: an approved section outline written back into a well-known file (candidate: inline at the top of `apps/web/src/app/projects/tcpa/page.tsx` as a TypeScript comment block, OR as a new `.planning/phases/07-tcpa-case-study-page/07-OUTLINE.md`). **Research recommendation: write it as `07-OUTLINE.md`** — a sibling to PLAN.md that the prose plan's `read_first` list consumes. Precedent-wise, no OUTLINE.md file exists in the project yet, but it's a natural fit and avoids polluting page.tsx with ephemeral planning metadata.
- **Outline plan's `done`:** user has reviewed the outline and marked it approved (GSD workflow has a review/approval gate). Outline plan should NOT create `page.tsx` yet — or, if it does, only the STEPS array skeleton with `id` + `title` + placeholder content, no prose.
- **Prose plan (`07-02-PLAN.md`):** Consumes the approved `07-OUTLINE.md`, creates/fills `apps/web/src/app/projects/tcpa/page.tsx`, wires the sticky-panel screenshot, wires all three CTAs, builds. Tasks are top-to-bottom — one task per section is probably too fine-grained; one task for the page scaffold + hero + left panel, one task for filling the STEPS array prose, one task for build verification feels right.

**If the plan phase wants to scaffold the page skeleton in the outline plan:** that's defensible. The tradeoff is whether approval happens against "an outline document" (lighter review) or "a page with placeholder sections" (heavier review, user can visually see the page shape). Research leans toward **outline document** because it matches the wording of the ROADMAP line ("section outline (headings, narrative weight per section, embed placement)") — these are document-shaped artifacts, not JSX-shaped.

---

## Sources

### Primary (HIGH confidence)
- **`apps/web/src/app/projects/mobi/page.tsx`** — the structural template. All Pattern 1–4 citations verified. [VERIFIED: Read tool, 2026-04-19]
- **`apps/web/next.config.ts`** — `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`. [VERIFIED]
- **`infra/lib/web-stack.ts`** — CSP, COOP/COEP, CloudFront functions. Lines 19–42 (default headers), 79–98 (path-specific headers). [VERIFIED]
- **`external/tcpa-visualizer/STATIC-BUILD.md`** — DuckDB-WASM architecture, Parquet export, COOP/COEP rationale, performance numbers. [VERIFIED: Read tool]
- **`external/tcpa-visualizer/CONTEXT.md`** — Problem framing, 5-tab Dive structure, MCP-driven workflow, April 2021 post-Duguid boundary. [VERIFIED]
- **`external/tcpa-visualizer/PLAN.md`** — Data schema, CourtListener API details. [VERIFIED]
- **`.planning/REQUIREMENTS.md`** — Out of Scope constraints (no infra changes, no diagram, no visualizer source modification). [VERIFIED]
- **`.planning/STATE.md`** — v1.2 scoping decisions including "Dive" disambiguation, outline-first workflow. [VERIFIED]
- **`.planning/ROADMAP.md`** — Phase 7 success criteria, two-plan structure. [VERIFIED]
- **`.planning/phases/06-content-expansion/06-RESEARCH.md` + `06-01-PLAN.md`** — Phase-6 precedent for the STEPS pattern, code block styling, and task structuring. [VERIFIED]
- **`apps/web/public/tcpa/` filesystem listing** — confirmed 33MB WASM, 1.5MB Parquet, 800KB JS, dark background `#0a0f1a` in index.html. [VERIFIED]

### Secondary (MEDIUM confidence)
- **MotherDuck product docs via web search** — Dives description, MCP server description, 2025 GA dates. [CITED: motherduck.com/product/dives/, motherduck.com/docs/sql-reference/mcp/, motherduck.com/docs/key-tasks/ai-and-motherduck/dives/] Prose plan should verify current URLs at write-time in case docs moved.
- **npm registry** — confirmed `@duckdb/duckdb-wasm` current version is `1.33.1-dev45.0` as of 2026-04-14, which is ahead of the `^1.29.0` pin in STATIC-BUILD.md but is a concern for the visualizer, not this page. [VERIFIED: `npm view @duckdb/duckdb-wasm version`]

### Tertiary (LOW confidence — flagged)
- **Assumption about future TCPA GitHub repo existence** — verified via `curl` that neither `github.com/d-aniel-yi/tcpa` nor `github.com/d-aniel-yi/tcpa-visualizer` exists today (both 404). Ask user at outline-plan time whether one will be published.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new deps; all patterns live in repo today.
- Architecture / layout patterns: HIGH — mobi page.tsx is the canonical source and has been read verbatim.
- Infrastructure / CSP behavior: HIGH — web-stack.ts read verbatim; iframe-blocking confirmed by `frame-ancestors 'none'` + `X-Frame-Options: DENY` in both the default and path-specific response paths.
- Narrative content sources: HIGH — STATIC-BUILD.md and CONTEXT.md have rich, specific, accurate details for the stack-reasoning sections.
- MotherDuck product details: MEDIUM — sourced from web search; docs are current as of April 2026 but URLs can drift. Prose plan should re-verify.
- Outline/prose workflow mechanics: MEDIUM — no precedent in this repo for a two-plan phase with an outline gate. Research recommends 07-OUTLINE.md as the handoff artifact; the plan phase may legitimately choose a different format.

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days — stable codebase, stable product landscape)

---

*Phase: 07-tcpa-case-study-page*
*Research completed: 2026-04-19*
