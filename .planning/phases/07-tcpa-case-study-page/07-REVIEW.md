---
phase: 07-tcpa-case-study-page
depth: standard
status: clean
files_reviewed: 1
files_reviewed_list:
  - apps/web/src/app/projects/tcpa/page.tsx
findings_total: 0
findings_blocker: 0
findings_high: 0
findings_medium: 0
findings_low: 0
reviewed: 2026-04-19
---

# Phase 07: Code Review Report

**Reviewed:** 2026-04-19
**Depth:** standard
**Files Reviewed:** 1 (`apps/web/src/app/projects/tcpa/page.tsx`, 418 lines)
**Status:** clean

## Summary

No issues found. The TCPA case-study page is a well-structured client component that mirrors the `/projects/mobi` template faithfully. Every design constraint called out in the phase plan (no `next/link`, no `next/image`, no outer `overflow-*` utility, external links wear `rel="noopener noreferrer"`, internal `/tcpa/` CTAs stay same-tab, no `dangerouslySetInnerHTML`) is honored. Prose is hand-authored JSX — React auto-escapes every dynamic expression, and the only data flowing into the DOM is the hard-coded `STEPS` array, so the XSS surface is zero in practice.

### Checks performed

**Security:**
- No `dangerouslySetInnerHTML`, no `eval(`, no `innerHTML` assignments. (grep-verified)
- All four external links (CourtListener, MotherDuck Dives docs, motherduckdb/mcp-server-motherduck, duckdb/duckdb-wasm) carry `target="_blank" rel="noopener noreferrer"` — reverse-tabnabbing mitigated. (lines 45-52, 162-169, 214-221, 301-308)
- All three `/tcpa/` CTAs are same-tab (no `target="_blank"`), consistent with the plan's A2 decision. (lines 357-364, 378-385, 403-410)
- No URL interpolation, no user input, no hrefs built from variables — every `href` is a string literal, so href-injection vectors do not apply.
- No hardcoded credentials, tokens, or secrets. The only token reference (`MOTHERDUCK_TOKEN`) appears inside prose text as documentation, not as a value.
- Screenshot is served as a static asset from `/public`; `<img>` alt text is descriptive (line 350), satisfying a11y without introducing untrusted HTML.

**Correctness / Next.js constraints:**
- `"use client"` directive is the first line. (line 1)
- Exactly 5 `STEPS` entries with the approved kebab-case IDs (`the-problem`, `motherduck-dives`, `motherduck-mcp`, `duckdb-wasm`, `closing`), each used as a `key` on the mapped `<section>` (line 390) — no key collisions.
- No `next/link` import (uses `<a>` as required — `/tcpa/` is a separate static bundle, not an app-router route).
- No `next/image` import (uses `<img>` — `images: { unoptimized: true }` in `next.config.ts` makes this intentional).
- No `@xyflow/react` or other diagram library (correct — TCPA page uses a screenshot instead of a diagram).
- No React hooks imported or used — the component is purely declarative, no effects or state, consistent with a prose page.

**Tailwind sticky-regression check:**
- Outer flex container at line 344 (`flex flex-col lg:flex-row`) has no `overflow-*` utility — sticky positioning on the left panel is preserved.
- The only `overflow-*` utilities are: `overflow-y-auto` on the right panel (line 369, expected — mobi's pattern) and `overflow-x-auto` on the two dark code blocks (lines 140, 257, expected — horizontal scroll for long SQL/JS lines).

**A11y:**
- `<img>` has a descriptive `alt` (line 350).
- All three "Try it live" CTAs have `aria-label` (lines 360, 381, 406).
- Heading hierarchy is sane: one `<h1>` (line 375), five `<h2>` rendered from STEPS (line 393), no skipped levels.

**Code quality:**
- No unused imports — `ExternalLink` from `lucide-react` is the sole import and is used in all three CTAs (lines 362, 383, 408).
- No unused variables, no dead code, no commented-out code.
- No `TODO`/`FIXME`/`XXX`/`HACK` markers.
- No `console.log`, `debugger`, or other debug artifacts.
- No `any` type assertions, no loose typing — the file uses inferred types throughout on a simple data-and-JSX structure where explicit types would add noise without value.
- Structural comments (lines 3-7, 11, 334, 338, 353) are terse and cite the source-of-truth for non-obvious decisions (e.g., "Pill style matches mobi page.tsx lines 391–400") — useful, not noise.
- Shared class strings (`LINK_CLASS`, `HERO_PILL_CLASS`, `FOOTER_PILL_CLASS`, lines 12-13, 335-336, 339-340) are extracted as module-level constants, which reduces the diff surface if the design tokens change later. Small point of craft, noted favorably.
- Middle-dot `·` in the caption (line 355) is the U+00B7 character called out in the plan; no mojibake.

**Content hygiene (spot-checks tied to plan success criteria):**
- `"MotherDuck Dive"` appears 3 times (in prose and section titles) — satisfies the A7 term-hygiene rule.
- `"DuckDB-WASM"`, `"MCP"`, `"Duguid"` each appear at least once.
- `"deep dive"` (case-insensitive) does not appear — the page is correctly framed as a case study.

## Notes (informational, not findings)

- The file imports and uses only one library symbol (`ExternalLink`). No new npm dependencies are introduced; supply-chain risk from this change is nil.
- The `min-h-screen` on the root div plus `h-screen overflow-y-auto` on the right panel is the same pattern mobi uses; scrolling behaves correctly at every viewport width.
- The five `STEPS` sections each end with an external link where the outline called for one; the inline-link class is consistent across all four external anchors.

---

_Reviewed: 2026-04-19_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
