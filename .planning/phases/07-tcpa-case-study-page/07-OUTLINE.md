---
phase: 07-tcpa-case-study-page
artifact: outline
status: draft           # flip to `approved` at Task 2 approval
created: 2026-04-19
consumes: []            # read-only inputs are cited below, not consumed via dep graph
produces_for:
  - 07-02-PLAN.md       # prose plan consumes this outline
locked_decisions:
  A1_kicker: "Case Study 003"
  A2_target_tab: "same-tab"
  A3_layout: "two-panel (mobi shape preserved)"
  A4_section_order: "chronological build flow"
  A5_screenshot: "apps/web/public/tcpa-preview.png, 1600x1000 PNG, ~300KB"
  A6_github_pill: "omitted (no public repo exists)"
  A7_dive_term: "MotherDuck Dive only; case study for the page itself"
  A8_outline_format: "this file"
---

# 07-OUTLINE.md — TCPA Case Study Content Outline

> **Purpose:** Locked content contract consumed by `07-02-PLAN.md` (the prose plan). This file freezes the section list, hero/panel/footer specs, answers to A1–A8, code-snippet slots, and external-link list so the prose executor has zero structural ambiguity.
>
> **Status:** `draft` — flip to `approved` in the frontmatter before Plan 02 runs.
>
> **Source documents** (re-read during prose execution, NOT during outline review):
> - `external/tcpa-visualizer/CONTEXT.md` — post-Duguid framing, 4 statutes, MotherDuck schema, 5-tab Dive, MCP pipeline.
> - `external/tcpa-visualizer/STATIC-BUILD.md` — DuckDB-WASM architecture flip, 29K rows, COOP/COEP, query rewrite pattern.
> - `external/tcpa-visualizer/.dive-preview/src/dive.tsx` — dive component (read at prose-write time for SQL snippet sourcing; not required during outline review).
> - `.planning/phases/07-tcpa-case-study-page/07-RESEARCH.md` — Gray Areas 1–7 and Assumptions Log A1–A8.
> - `apps/web/src/app/projects/mobi/page.tsx` — structural template for hero, two-panel layout, STEPS pattern, dark code blocks.

---

## 1. Metadata

See the YAML frontmatter above — it contains all eight `A*` locked decisions, the artifact status flag, and the downstream consumer (`07-02-PLAN.md`).

---

## 2. Hero spec

Located in the **right panel** (`max-w-xl mx-auto px-8 py-24`), inside a `<header className="mb-16">` block. Structural contract per `apps/web/src/app/projects/mobi/page.tsx` lines 384–401.

### 2.1 Kicker
- **Value:** `"Case Study 003"` (locked per A1; Mobi is `"Case Study 002"` — mobi page.tsx line 386).
- **Classes:** `font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase`.
- **Rationale:** TCPA is the next numbered deep-dive after Mobi. Per RESEARCH.md Gray Area 5.

### 2.2 Title
- **Default value:** `"TCPA: In-Browser Analytics"` — three-word title that foreshadows the marquee DuckDB-WASM beat (research recommendation, RESEARCH.md §Gray Area 5).
- **Alternates** (capture user's choice by replacing the default if overridden):
  1. `"TCPA: Litigation Data in the Browser"`
  2. `"TCPA Explorer: A Dashboard as a Static File"`
- **Classes:** `font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900`.

### 2.3 CTA pill — "Try it live"
- **Element:** `<a>`, NOT `<Link>` from `next/link` (per RESEARCH.md Pitfall 1 — `/tcpa/` is a static asset bundle, not an app-router route).
- **href:** `"/tcpa/"` — trailing slash required. Verified `apps/web/next.config.ts` line 14 has `trailingSlash: true`; CloudFront redirects `/tcpa` → `/tcpa/`.
- **Target tab:** same-tab per A2 (no `target="_blank"`, no `rel="noopener noreferrer"`). `/tcpa/` is a full-viewport replacement, so same-tab reads as "open the app."
- **Icon:** `lucide-react` `<ExternalLink className="w-4 h-4" />`. Mobi imports `Github`; TCPA imports `ExternalLink` from the same package.
- **Label text:** `Try it live`.
- **Classes:** `inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs font-mono tracking-wide uppercase rounded hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap`.
- **aria-label:** `"Open the TCPA Litigation Explorer"`.

### 2.4 Secondary GitHub pill
- **Omitted** per A6. RESEARCH.md verified both `github.com/d-aniel-yi/tcpa` and `github.com/d-aniel-yi/tcpa-visualizer` return 404. If the user publishes a repo before prose execution, add a secondary pill matching mobi's shape here.

---

## 3. Sticky left-panel spec (lg+ only)

Located in the **left panel**, visible only at `lg+` breakpoint. Structural contract per mobi lines 357–379 (replacing ReactFlow with `<img>`).

### 3.1 Container
- **Classes:** `hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative`.
- **Inner wrapper:** `h-full flex flex-col items-center justify-center p-8`.
- **Outer flex container MUST NOT have any `overflow-*` utility** — per STATE.md line 41 / RESEARCH.md Pitfall 3. Adding overflow breaks sticky behavior.

### 3.2 Screenshot
- **Element:** plain `<img>` (NOT `next/image` — `images: { unoptimized: true }` in next.config.ts line 15 makes `<Image>` offer no benefit).
- **src:** `/tcpa-preview.png` (resolves to `apps/web/public/tcpa-preview.png`).
- **alt:** `"TCPA Litigation Explorer dashboard preview"`.
- **Classes:** `w-full rounded-sm shadow-lg border border-gray-200`.
- **File spec (A5):** 1600×1000 PNG, ~300 KB target (acceptable range 50–500 KB per VALIDATION.md row 7-02-T1). Source = screenshot of `/tcpa/` Filings tab showing real post-Duguid data (not a loading state).

### 3.3 Mono caption
- **Text (locked):** `"In-browser DuckDB-WASM · 29K rows · No backend"`.
- **Classes:** `mt-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest text-center`.
- **Rationale:** RESEARCH.md Code Examples, Left sticky panel variant. Three-part rhythm mirrors the marquee story (engine · data · deployment posture).

### 3.4 Panel CTA
- **Same pill** as hero §2.3. Same `href="/tcpa/"`, same icon, same classes, same `"Try it live"` label, same-tab.
- **Wrapping class:** `mt-4` (separates from caption).

---

## 4. Section list — scrolling right panel

Rendered via `STEPS.map((step) => <section key={step.id}>...</section>)` — verbatim from mobi lines 403–414. Each entry shape: `{ id: "kebab-case", title: string, content: (<>JSX</>) }`.

Default ordering per A4 (chronological build flow):

| # | id (kebab) | Title | Purpose (1 sentence) | Word target | Source material |
|---|-----------|-------|---------------------|-------------|-----------------|
| 1 | `the-problem` | The Problem: Post-Duguid TCPA Trend Analysis | Frame why trend-tracking consumer-protection litigation requires a new tool after the April 2021 *Facebook v. Duguid* boundary redefined ATDS liability. | ~750 | CONTEXT.md lines 7–18 (Duguid boundary, 4 statutes); CONTEXT.md lines 100–142 (RECAP federal-only scope, state Mini-TCPA blind spot, 5-tab structure) |
| 2 | `motherduck-dives` | MotherDuck Dives: Dashboards as Code | Explain what a Dive is (BI-as-code, 5-tab structure) and why it beats a traditional BI tool for a narrative dashboard. | ~500 | CONTEXT.md lines 137–142 (5 tabs, presets, snapshot panel); https://motherduck.com/docs/key-tasks/ai-and-motherduck/dives/ |
| 3 | `motherduck-mcp` | MotherDuck MCP: Conversational ETL | Show how the 3-step enrichment pipeline (ingest → keyword search → PDF extraction) evolved via Claude + MCP, and why schema-aware iteration changed the build loop. | ~400 | CONTEXT.md lines 121–134 (pipeline + supplementary scripts); https://motherduck.com/docs/sql-reference/mcp/; https://github.com/motherduckdb/mcp-server-motherduck |
| 4 | `duckdb-wasm` | DuckDB-WASM: Zero-Backend Publishing | The marquee beat: the Dive is not the final form — the `/tcpa` static bundle exists so viewers need no account. Cover the architecture flip, 29K rows, COOP/COEP, same-React-different-provider. | ~750 | STATIC-BUILD.md lines 7–17 (architecture + hosting posture); line 91 (COOP/COEP); lines 215–220 (registerFileBuffer + CREATE TABLE); lines 252–263 (query rewrite); lines 423–441 (performance numbers, MotherDuck vs static diff table) |
| 5 | `closing` | What This Stack Lets You Ship | One-paragraph reflection: a live dashboard deployed as a static file — what a traditional BI tool can't do. | ~100 | — |

**Total word target:** ~2,500. Ratio: 750 / 1,750 = ~30% problem / ~70% stack — satisfies CONT-02 (~30% problem context) and CONT-03 (~70% stack reasoning).

**Adjustment rule (for the user during approval):** If you adjust word counts, keep the problem:stack ratio within **~30/70 ± 5pp** so CONT-02 and CONT-03 remain satisfied. That is: problem ≥ 625 and ≤ 875, stack ≥ 1,625 and ≤ 1,875 at a 2,500 total. If you change the total, scale proportionally.

**Section rendering contract** (applies to every entry — from mobi lines 405–413):
```tsx
<section key={step.id} className="scroll-mt-24">
    <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-[1px] bg-gray-300"></div>
        <h2 className="font-serif text-xl text-gray-900">{step.title}</h2>
    </div>
    <div className="text-gray-600 leading-relaxed text-sm pl-11">
        {step.content}
    </div>
</section>
```

---

## 5. Code-snippet slots (default: 2)

RESEARCH.md §Gray Area 6 recommended up to 3 snippets; this outline locks **2 by default** to stay closer to TCPA's narrative-first tone (mobi uses 5 snippets across 7 sections; TCPA has 5 shorter sections and a tighter word budget).

Each snippet uses the mobi dark-block contract (per RESEARCH.md Pattern 2, mobi page.tsx line 37):
```
mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800
```
Syntax colors: `text-purple-400` (keywords), `text-yellow-300` (function/class names), `text-green-400` (strings), `text-gray-500` (comments), `text-blue-400` (types/decorators), `text-orange-400` (numbers).

### 5.1 Snippet #1 — MotherDuck Dives section
- **Location:** inside section #2 (`motherduck-dives`), after the BI-as-code paragraph.
- **Content:** ~10–12 lines of SQL showing the claim-classification or top-plaintiffs query from the Dive. Keywords (`SELECT`, `FROM`, `WHERE`, `GROUP BY`, `CASE`, `WHEN`, `THEN`, `END`) in `text-purple-400`; string literals in `text-green-400`; comments in `text-gray-500`.
- **Source:** `external/tcpa-visualizer/.dive-preview/src/dive.tsx` — prose-plan executor reads this at write-time (it is NOT in the planning-phase read-set). If that file is unavailable at prose time, reconstruct a plausible query from the schema in CONTEXT.md lines 54–90 (tables: `cases`, `cases_unclassified`; columns include `claim_type`, `legal_theory`, `is_class_action`, `plaintiff`, `statute`, `date_filed`).

### 5.2 Snippet #2 — DuckDB-WASM section
- **Location:** inside section #4 (`duckdb-wasm`), after the architecture-flip paragraph.
- **Content:** ~8 lines showing `registerFileBuffer` + `CREATE TABLE … AS SELECT * FROM read_parquet(…)`. Keywords (`CREATE`, `TABLE`, `AS`, `SELECT`, `FROM`) in `text-purple-400`; `read_parquet` in `text-yellow-300`; file-path string literal in `text-green-400`; comment in `text-gray-500`.
- **Source:** `external/tcpa-visualizer/STATIC-BUILD.md` lines 215–220 (verified). Combine with the one-line `await db.registerFileBuffer(...)` call immediately before the `CREATE TABLE`.

### 5.3 Optional snippet (NOT included by default)
- **MCP `.mcp.json` config excerpt** was considered (RESEARCH.md §Gray Area 6, snippet #2). Omitted by default — the MCP story reads as prose without requiring a config snippet to land. User may add this at review time by listing it here; if added, source it from `github.com/motherduckdb/mcp-server-motherduck` README.

**Final locked count:** `2` (will be updated to `0`, `1`, or `3` if user overrides at Task 2).

---

## 6. External links (in-prose anchor tags)

In-prose anchor tags — NOT hero CTAs. Styled as subtle inline links (mobi has no in-prose link precedent, so this is a small extension; recording the class string here locks it for the prose executor).

**Inline link classes (locked):**
```
text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900
```

**Link list (recommended — user marks accepted/rejected at review):**

| # | Section | URL | Label context |
|---|---------|-----|---------------|
| L1 | §1 `the-problem` | `https://www.supremecourt.gov/opinions/20pdf/19-511_p86b.pdf` | Anchor for *Facebook v. Duguid* citation |
| L2 | §1 `the-problem` | `https://www.courtlistener.com/help/api/rest/` | CourtListener REST API (data source) |
| L3 | §2 `motherduck-dives` | `https://motherduck.com/docs/key-tasks/ai-and-motherduck/dives/` | MotherDuck Dives product docs |
| L4 | §3 `motherduck-mcp` | `https://github.com/motherduckdb/mcp-server-motherduck` | MCP server repo (prefer this over the docs URL — more actionable) |
| L5 | §4 `duckdb-wasm` | `https://github.com/duckdb/duckdb-wasm` | DuckDB-WASM project repo |

**Cap:** 1–2 outbound links per stack section keeps the page narrative-first and prevents the prose from feeling like a linkdump.

---

## 7. End-of-page footer spec

Mirrors mobi lines 417–430 (divider + single CTA + spacer).

### 7.1 Horizontal divider
- **Classes:** `mt-24 pt-8 border-t border-gray-200`. No label — just the rule + CTA.

### 7.2 Footer CTA
- **Same pill** as hero §2.3 and sticky panel §3.4. Same `href="/tcpa/"`, same icon, same classes, same `"Try it live"` label, same-tab.

### 7.3 Trailing spacer
- **Element:** `<div className="h-24" />` — matches mobi line 430 exactly. Prevents the final CTA from touching the viewport bottom on short scrolls.

**CTA total count on page:** 3 (hero + sticky panel + footer) — per RESEARCH.md §Gray Area 3 recommendation.

---

## 8. Term hygiene guardrails

Enforced against Plan 02 prose. Prose-plan verification (VALIDATION.md row 7-02-T3) greps for these.

- **Use `"MotherDuck Dive"` (capitalized, two words)** when referring to the MotherDuck product. Never `"dive"` lowercase without the `MotherDuck` prefix. (Per A7 / STATE.md line 47 / RESEARCH.md Pitfall 4.)
- **Call the page a `"case study"`, NOT a `"deep dive"`.** Reserve `"dive"` for the MotherDuck product. VALIDATION.md grep: `! grep -qi 'deep dive' src/app/projects/tcpa/page.tsx` must pass.
- **When referring to `/tcpa/` itself,** prefer `"the live visualizer"`, `"the /tcpa app"`, or `"the static visualizer"`. Avoid `"the dive at /tcpa"` — the static bundle is a **DuckDB-WASM derivative** of the MotherDuck Dive, not the Dive itself. This distinction is the narrative hinge of section #4 and must not be collapsed.
- **Required term occurrences** (VALIDATION.md row 7-02-T3 greps these are present):
  - `MotherDuck Dive` — at least once in section #2.
  - `DuckDB-WASM` — at least once in section #4.
  - `MCP` — at least once in section #3.
  - `Duguid` — at least once in section #1.

---

## 9. Locked Answers summary (A1–A8)

| # | Claim (from RESEARCH.md Assumptions Log) | Research default | Decision |
|---|------------------------------------------|------------------|----------|
| A1 | Kicker string | `"Case Study 003"` | **accepted** (default) |
| A2 | Target-tab behavior for all 3 CTAs | same-tab | **accepted** (default) |
| A3 | Layout shape | Two-panel (mobi 35%/65% sticky-left preserved) | **accepted** — single-column rejected because PAGE-08 mandates visual consistency with `/projects/mobi` |
| A4 | Section ordering | Chronological build flow: Problem → Dives → MCP → DuckDB-WASM → Closing | **accepted** (default) |
| A5 | Screenshot format | `apps/web/public/tcpa-preview.png`, 1600×1000 PNG, ~300 KB | **accepted** (default); source = `/tcpa/` Filings tab with real post-Duguid data |
| A6 | Secondary GitHub pill | Omitted (no public repo exists per verified 404s on both candidate URLs) | **accepted** (default) |
| A7 | "Dive" term hygiene | `MotherDuck Dive` only; page is a `case study`; `/tcpa` is `the live visualizer` | **accepted** (default) |
| A8 | Outline artifact format | `07-OUTLINE.md` as sibling to `07-0*-PLAN.md` (this file) | **accepted** — no precedent in the repo, but natural fit per ROADMAP.md Phase 7 plan descriptions |

**Override protocol:** If you want to override any default, edit the "Decision" cell (e.g., `"accepted" → "override: Case Study 002.5"`) and update the corresponding section above. Do NOT leave any cell showing `TBD`, `?`, or a blank — every row must be a locked statement before the frontmatter flips to `approved`.

---

## 10. Handoff note to Plan 02

When `07-02-PLAN.md` executes, it consumes the following from this outline **verbatim** — no interpretation:

1. **Section list (§4)** → `STEPS` array in `apps/web/src/app/projects/tcpa/page.tsx`. Use `id`, `title`, and `source material` columns; the prose executor writes `content` JSX by reading the cited source lines.
2. **Hero spec (§2)** → `<header>` block: kicker string, title string, CTA element (`<a>` not `<Link>`, `href="/tcpa/"`, `<ExternalLink />` icon, same-tab, classes).
3. **Sticky left-panel spec (§3)** → left-panel `<div>`: container classes, `<img>` src/alt/classes, caption text + classes, CTA pill (same as hero).
4. **Code-snippet slots (§5)** → which sections get blocks, which source files to read at write-time, exact dark-block + syntax-color classes.
5. **External-link list (§6)** → inline link URLs + the `text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900` class string.
6. **Footer spec (§7)** → divider + third CTA pill + `<div className="h-24" />` spacer.
7. **Term-hygiene guardrails (§8)** → prose constraints that VALIDATION.md row 7-02-T3 greps against.
8. **Locked answers table (§9)** → final values for A1–A8; prose executor treats these as ground truth.

**Prose executor MUST NOT:**
- Change the section count, IDs, or ordering.
- Add an architecture diagram (out of scope per REQUIREMENTS.md / RESEARCH.md Anti-Patterns).
- Use `<Link>` from `next/link` for the `/tcpa/` href (per Pitfall 1).
- Add `overflow-*` utilities to the outer flex container (per Pitfall 3).
- Modify anything under `external/tcpa-visualizer/` or `infra/` (per REQUIREMENTS.md Out of Scope).

**Prose executor CAN / SHOULD:**
- Read `external/tcpa-visualizer/.dive-preview/src/dive.tsx` at write-time to ground the SQL snippet.
- Re-verify external-link URLs are alive (MotherDuck docs may relocate).
- Scale per-section word counts if the user requested a total other than 2,500, maintaining the 30/70 ± 5pp ratio.

---

*End of outline. Flip `status: draft` → `status: approved` in the frontmatter to hand off to Plan 02.*
