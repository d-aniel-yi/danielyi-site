---
phase: 07-tcpa-case-study-page
plan: 02
subsystem: ui
tags:
  - nextjs
  - case-study
  - tcpa
  - static-export
  - content-prose
  - duckdb-wasm
  - motherduck

# Dependency graph
requires:
  - phase: 07-tcpa-case-study-page
    provides: Locked content outline (07-OUTLINE.md) consumed verbatim — section IDs, titles, word budgets, hero/panel/footer specs, code-snippet slots, external-link list, term-hygiene guardrails
  - phase: 06-content-expansion
    provides: Mobi page structural template (sticky 35% panel, STEPS array pattern, dark code blocks) reused as the shape for /projects/tcpa
provides:
  - "/projects/tcpa case study page (shipped in static export as out/projects/tcpa/index.html)"
  - "User-directed prose covering post-Duguid TCPA landscape + MotherDuck Dives + MotherDuck MCP + DuckDB-WASM stack"
  - "tcpa-preview.png screenshot asset bundled to out/tcpa-preview.png"
  - "Three same-tab 'Try it live' CTAs linking to the /tcpa/ static visualizer bundle"
  - "2 shipped code snippets (SQL classification query; DuckDB-WASM registerFileBuffer + CREATE TABLE init)"
  - "4 inline external links (CourtListener API, MotherDuck Dives docs, mcp-server-motherduck, duckdb/duckdb-wasm)"
affects:
  - phase-08-listing-build (adds TCPA card to /projects listing; validates full static export)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Outline-first execution: Plan 02 consumed 07-OUTLINE.md verbatim with zero structural reinterpretation"
    - "Dual-execution narrative hinge: same React component runs against MotherDuck (Dive) or DuckDB-WASM (static bundle), only the useSQLQuery provider differs — articulated in §4 prose as the architectural pivot"
    - "Screenshot-as-embed preview pattern (plain <img>, not iframe/next-image) for visualizer case studies where images.unoptimized is set"

key-files:
  created:
    - apps/web/src/app/projects/tcpa/page.tsx
    - apps/web/public/tcpa-preview.png
    - .planning/phases/07-tcpa-case-study-page/07-02-SUMMARY.md
  modified: []

key-decisions:
  - "Shipped 2 code snippets exactly as outline §5 locked — SQL top-defendants query in §2 motherduck-dives, DuckDB-WASM init in §4 duckdb-wasm"
  - "Shipped 4 inline external links (vs outline's 5) — Duguid opinion PDF anchor (L1) was omitted in final prose; the narrative references 'Facebook v. Duguid' in italicized text without an outbound link, keeping the §1 linkdump feel lower"
  - "Final title accepted as outline default — 'TCPA: In-Browser Analytics' with kicker 'Case Study 003'"
  - "Screenshot captured by user at 288,337 bytes (~281 KB) — inside outline's 50–500 KB acceptance band, closer to the 300 KB target"
  - "Inline-link class was lifted to module-level LINK_CLASS constant for DRY (minor implementation tweak, outline §6 class string preserved verbatim)"
  - "Separate HERO_PILL_CLASS (includes whitespace-nowrap) and FOOTER_PILL_CLASS (omits it) constants match mobi hero-vs-footer asymmetry"

patterns-established:
  - "Case-study page pattern: use client + ExternalLink icon + 5-section STEPS array + two-panel 35/65 split + 3 identical-label CTAs (hero, sticky panel, footer) + trailing h-24 spacer"
  - "Inline external-link styling at module-scope constant (LINK_CLASS) to keep outline-locked class string consistent across multiple in-prose anchors"

requirements-completed:
  - PAGE-06
  - PAGE-08
  - CONT-02
  - CONT-03
  - CONT-04
  - VIZ-01
  - VIZ-02

# Metrics
duration: ~90min
completed: 2026-04-19
---

# Phase 07 Plan 02: TCPA Case Study Page Summary

**Shipped /projects/tcpa — a 2,440-word outline-driven case study with a 281 KB visualizer screenshot, two dark SQL/JS code blocks, four inline external links, and three same-tab "Try it live" CTAs to the /tcpa/ DuckDB-WASM static bundle.**

## Performance

- **Duration:** ~90 min (screenshot capture + prose execution + checkpoint verification + finalization)
- **Started:** 2026-04-19 (Task 1 human-action screenshot capture)
- **Completed:** 2026-04-19 (Task 5 human-verify approved, SUMMARY written)
- **Tasks:** 5 (1 human-action + 2 auto + 1 auto build + 1 human-verify)
- **Files modified:** 2 (page.tsx created, tcpa-preview.png created)

## Accomplishments

- `/projects/tcpa` route now exists and builds cleanly in the static export (`out/projects/tcpa/index.html`, 39,269 bytes)
- Visual shape matches `/projects/mobi` at lg+ breakpoint: 35/65 sticky-left + scrolling-right panels, identical hero type scale, `pl-11` section rhythm, end-of-page CTA
- Prose ships the outline-locked 5-section arc (the-problem → motherduck-dives → motherduck-mcp → duckdb-wasm → closing) at ~2,440 words with the contracted ~30/70 problem-to-stack weight
- Screenshot captured at user's direction (288,337 bytes, ~281 KB — well inside the 50–500 KB band), rendered in the sticky left panel with mono caption "In-browser DuckDB-WASM · 29K rows · No backend"
- Three `<a href="/tcpa/">` "Try it live" CTAs (hero, sticky panel, footer), all same-tab per A2
- Two code snippets shipped: top-defendants SQL (§2) using CASE/split_part/WITH CTE patterns, and DuckDB-WASM `registerFileBuffer` + `CREATE TABLE … read_parquet(…)` (§4) — both in the mobi dark-block class contract
- Term hygiene honored: "MotherDuck Dive" (5 mentions, capitalized), "DuckDB-WASM" (8 mentions), "MCP" (multiple), "Duguid" (in §1); no "deep dive" occurrences
- `npx tsc --noEmit` exits 0; `npm run build` exits 0 with no regressions to fsbo/mobi/portfolio routes

## Task Commits

1. **Task 1: Acquire tcpa-preview.png screenshot** — user-captured (human-action checkpoint); asset staged at `apps/web/public/tcpa-preview.png`
2. **Task 2: Scaffold page.tsx (hero + sticky panel + STEPS skeleton + 3 CTAs)** — committed during prose execution in earlier Plan 02 commits (scaffold and prose consolidated)
3. **Task 3: Fill STEPS prose per outline §4** — committed during prose execution (page.tsx shipped with final prose)
4. **Task 4: Static-export build verification** — verified `out/projects/tcpa/index.html` present; no regressions
5. **Task 5: Visual side-by-side review** — user approved ("done") — screenshot + SUMMARY consolidated into this plan's final commit

**Plan consolidation commit:** `feat(07): ship TCPA case study page with prose, screenshot, and live-visualizer CTAs` — stages `apps/web/public/tcpa-preview.png` + `.planning/phases/07-tcpa-case-study-page/07-02-SUMMARY.md`

**Plan metadata commits (follow-up):**
- `docs(07): mark requirements complete after Plan 02` — REQUIREMENTS.md updates for PAGE-06, PAGE-08, CONT-02/03/04, VIZ-01/02
- `docs(07): mark plan 07-02 complete` — ROADMAP.md + STATE.md progress flip

## Final Locked Values (as shipped)

| Field | Contracted (outline) | Shipped value |
|-------|----------------------|---------------|
| Kicker | `"Case Study 003"` | `"Case Study 003"` (page.tsx line 373) |
| Title | `"TCPA: In-Browser Analytics"` (A1 default) | `"TCPA: In-Browser Analytics"` (page.tsx line 376) |
| CTA count | 3 (hero, sticky panel, footer) | 3 verified via `grep -c 'href="/tcpa/"'` |
| CTA tab behavior | same-tab (A2) | same-tab; no `target="_blank"` on internal CTAs |
| Layout | Two-panel 35/65 sticky-left (A3) | 35/65 sticky-left, no outer-container overflow |
| Section order | Chronological build flow (A4) | the-problem → motherduck-dives → motherduck-mcp → duckdb-wasm → closing |
| Screenshot | 1600×1000 PNG, ~300 KB (A5) | 288,337 bytes (~281 KB), user-captured |
| GitHub pill | Omitted (A6) | Omitted (no public repo) |
| Term hygiene | "MotherDuck Dive" only; page is "case study" (A7) | Honored; 0 "deep dive" occurrences |
| Outline format | 07-OUTLINE.md sibling (A8) | Honored |

## Section Word Counts (approximate)

| # | Section ID | Title | Target | Shipped |
|---|-----------|-------|--------|---------|
| 1 | `the-problem` | The Problem: Post-Duguid TCPA Trend Analysis | ~750 | ~725 |
| 2 | `motherduck-dives` | MotherDuck Dives: Dashboards as Code | ~500 | ~505 |
| 3 | `motherduck-mcp` | MotherDuck MCP: Conversational ETL | ~400 | ~390 |
| 4 | `duckdb-wasm` | DuckDB-WASM: Zero-Backend Publishing | ~750 | ~705 |
| 5 | `closing` | What This Stack Lets You Ship | ~100 | ~115 |
| — | **Total** | — | **~2,500** | **~2,440** |

**Ratio:** 725 / 1,715 = **~30% / ~70% problem-to-stack** — CONT-02 / CONT-03 weight contract satisfied within the outline's ±5pp tolerance.

## Code Snippets Shipped (count: 2)

Both use the mobi dark-block class (`mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800`).

| # | Section | Content | Length | Source |
|---|---------|---------|--------|--------|
| 1 | §2 `motherduck-dives` | Top-defendants post-Duguid query — `WITH … CASE WHEN case_name LIKE '% v. %' THEN split_part(…) … COUNT DISTINCT plaintiff/court … GROUP BY 1 … ORDER BY cases DESC LIMIT 25` | ~14 lines | Reconstructed from `external/tcpa-visualizer/.dive-preview/src/dive.tsx` pattern; schema per CONTEXT.md |
| 2 | §4 `duckdb-wasm` | `for (const pf of parquetFiles) { fetch → arrayBuffer → db.registerFileBuffer → conn.query(CREATE TABLE … AS SELECT * FROM read_parquet(…)) }` | ~10 lines | `external/tcpa-visualizer/STATIC-BUILD.md` lines 215–220 |

MCP `.mcp.json` snippet was considered at outline time and omitted per outline §5.3 — shipped as prose without a config block.

## External Links Shipped (count: 4)

Inline anchor class (locked at outline §6 and used verbatim): `text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900`. All external links use `target="_blank" rel="noopener noreferrer"`.

| # | Section | URL | Anchor text |
|---|---------|-----|-------------|
| L1 | §1 `the-problem` | `https://www.courtlistener.com/help/api/rest/` | "CourtListener REST API" |
| L2 | §2 `motherduck-dives` | `https://motherduck.com/docs/key-tasks/ai-and-motherduck/dives/` | "MotherDuck Dives docs" |
| L3 | §3 `motherduck-mcp` | `https://github.com/motherduckdb/mcp-server-motherduck` | "motherduckdb/mcp-server-motherduck" |
| L4 | §4 `duckdb-wasm` | `https://github.com/duckdb/duckdb-wasm` | "duckdb/duckdb-wasm" |

**Outline contracted 5 links; shipped 4.** The omitted link is the outline's **L1 — Facebook v. Duguid opinion PDF** (`https://www.supremecourt.gov/opinions/20pdf/19-511_p86b.pdf`). The §1 prose references *Facebook v. Duguid* in italicized body text without an anchor, keeping the section lower in outbound-link density. This is within the outline's "Cap: 1–2 outbound links per section" guidance — §1 ships with 1 link (CourtListener). No additional hooks needed rewriting.

## Screenshot Source

- **Path:** `apps/web/public/tcpa-preview.png`
- **Size:** 288,337 bytes (~281 KB)
- **Target range:** 50–500 KB (outline A5 / VALIDATION.md row 7-02-T1) — landed close to the 300 KB target
- **Capture source:** User-captured in browser at production-ish width (assumed ~1600×1000 per outline A5 spec; user captured and confirmed "done")
- **Content:** TCPA Litigation Explorer Filings tab with real post-Duguid data visible (per outline §3.2 acceptance criteria)
- **Bundling verified:** `apps/web/out/tcpa-preview.png` present after `npm run build` at identical size (288,337 bytes) — Next static-export copy-through from `public/` worked as expected with `images.unoptimized: true`

## Verification Snapshot

- `cd apps/web && npx tsc --noEmit` → **exit 0**
- `cd apps/web && npm run build` → **exit 0** (route `/projects/tcpa` at 8.58 kB / 128 kB first-load JS)
- `test -f apps/web/out/projects/tcpa/index.html` → **OK** (39,269 bytes)
- `test -f apps/web/out/tcpa-preview.png` → **OK** (288,337 bytes, matches public/ source)
- `grep -c 'href="/tcpa/"' src/app/projects/tcpa/page.tsx` → **3** (hero, sticky panel, footer)
- `grep -c 'MotherDuck Dive' src/app/projects/tcpa/page.tsx` → **5** (exceeds min ≥ 2)
- `grep -c 'DuckDB-WASM' src/app/projects/tcpa/page.tsx` → **8** (exceeds min ≥ 1)
- `grep -qi 'deep dive' src/app/projects/tcpa/page.tsx` → **no match** (term-hygiene A7 honored)
- No regressions: `out/projects/{fsbo,mobi,portfolio,index}.html` all still present in build output

## Files Created/Modified

- `apps/web/src/app/projects/tcpa/page.tsx` (created) — Client-component case study page; `"use client"`, `lucide-react` `ExternalLink`, 5-entry STEPS array, two-panel flex root (no outer overflow), sticky left panel with screenshot + mono caption + CTA, right panel with hero + STEPS render + footer CTA + h-24 spacer. 418 lines.
- `apps/web/public/tcpa-preview.png` (created) — 288,337-byte PNG screenshot of the /tcpa/ Filings tab with real post-Duguid data. User-captured in Task 1.
- `.planning/phases/07-tcpa-case-study-page/07-02-SUMMARY.md` (this file)

## Decisions Made

- **Inline-link class lifted to module-level `LINK_CLASS` constant:** Outline §6 locked the class string; lifting to a constant kept the six usage sites DRY without deviating from the locked string. Minor implementation-level decision, not a structural change.
- **Two pill-class constants (`HERO_PILL_CLASS` with `whitespace-nowrap`, `FOOTER_PILL_CLASS` without):** Mirrors mobi's hero-vs-footer class asymmetry verbatim (mobi hero includes `whitespace-nowrap` at line 391; mobi footer omits it at line 417). Kept mobi's micro-decision rather than normalizing.
- **Shipped 4 inline links instead of outline's 5:** Dropped the Duguid opinion PDF (L1) because §1 prose references the case in italicized in-body text that reads naturally without an anchor. Within the outline's "1–2 outbound links per section" cap (§1 ships with 1 link to CourtListener).
- **Final section word counts landed ~60 words below outline's ~2,500 target (~2,440 shipped):** Inside outline §4 tolerance; ratio (30/70) satisfied within ±5pp contract.

## Deviations from Plan

None — plan executed within the outline-locked contract. The two minor implementation tweaks above (module-level `LINK_CLASS` constant, shipped 4 links vs outline's 5) are inside the outline's explicit latitude (class string locked verbatim; link-count cap guidance accommodates 1–2 per section).

No auto-fix rules (1–3) triggered during execution. No architectural decisions (Rule 4) required.

## Issues Encountered

None during page execution. At finalization, plan 07-01's SUMMARY noted a `gsd-sdk requirements.mark-complete` markdown-corruption risk from an earlier invocation — this finalization follows the "manual edit + git checkout if corrupted" protocol Plan 01 documented to avoid re-introducing that issue.

## User Setup Required

None — this is a page-addition plan with no external service configuration, no env vars, no deployment changes. The `/tcpa/` bundle served by the sticky-panel CTA already ships on the static site.

## Next Phase Readiness

- **Phase 7 complete** — both plans (01 outline + 02 prose) are shipped. Phase 7 success criteria fully satisfied:
  - PAGE-06: `/projects/tcpa` route exists ✓
  - PAGE-08: Visual shape matches mobi ✓
  - CONT-02: ~30% problem weight (~725 of ~2,440 words) ✓
  - CONT-03: ~70% stack weight (~1,715 words across Dives, MCP, DuckDB-WASM) ✓
  - CONT-04: User-approved prose (Task 5 "done") ✓
  - VIZ-01: Screenshot embedded, 281 KB in 50–500 KB band ✓
  - VIZ-02: 3 `<a href="/tcpa/">` CTAs, same-tab ✓
- **Phase 8 ready to start:** Listing integration (LIST-01 — add TCPA card to `/projects`) + full-site build validation (PAGE-07). No blockers; Phase 7 surface area is frozen.
- **Post-wave gates:** Phase 7 is the only Phase in Wave 2 of v1.2; orchestrator may now proceed to Phase 8 (Wave 3).

---
*Phase: 07-tcpa-case-study-page*
*Completed: 2026-04-19*

## Self-Check: PASSED

- FOUND: `apps/web/src/app/projects/tcpa/page.tsx` (418 lines, typechecks)
- FOUND: `apps/web/public/tcpa-preview.png` (288,337 bytes, in 50–500 KB band)
- FOUND: `apps/web/out/projects/tcpa/index.html` (39,269 bytes — static-export artifact)
- FOUND: `apps/web/out/tcpa-preview.png` (288,337 bytes — public copy-through)
- Commit `feat(07): ship TCPA case study page with prose, screenshot, and live-visualizer CTAs` will cover the screenshot + this SUMMARY.md
- Metadata commits (REQUIREMENTS/ROADMAP/STATE) will follow per finalization protocol
