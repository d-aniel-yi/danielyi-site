---
phase: 07-tcpa-case-study-page
plan: 01
subsystem: planning
tags:
  - content-outline
  - narrative-planning
  - tcpa
  - case-study
  - outline-first

# Dependency graph
requires:
  - phase: 06-content-expansion
    provides: Mobi page structural template (sticky 35% panel, STEPS array pattern, dark code blocks) reused as the shape for /projects/tcpa
provides:
  - Locked content outline (.planning/phases/07-tcpa-case-study-page/07-OUTLINE.md) approved by user
  - Final A1–A8 decisions consumed verbatim by Plan 02 prose executor
  - 5-section list with kebab-case IDs, titles, word budgets, and source-material citations
  - Hero / sticky-panel / footer specs aligned to mobi page.tsx structural slots
  - Code-snippet slot count locked at 2 (SQL + DuckDB-WASM init)
  - External-link list (5 inline anchors) with locked Tailwind class string
  - Term-hygiene guardrails ("MotherDuck Dive" only; page is "case study"; /tcpa is "the live visualizer")
affects:
  - 07-02-PLAN.md (prose plan — consumes this outline as its content contract)
  - phase-08-listing-build (depends on /projects/tcpa shipping)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Outline-first content workflow: section structure approved as a sibling OUTLINE.md artifact before prose plan executes"
    - "Locked-decisions frontmatter: A1–A8 assumptions log values reproduced as machine-readable YAML in the outline header"
    - "Inline link Tailwind class string locked at the outline level so prose executor does not reinvent styling"

key-files:
  created:
    - .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md
    - .planning/phases/07-tcpa-case-study-page/07-01-SUMMARY.md
  modified: []

key-decisions:
  - "All eight Assumptions Log items (A1–A8) accepted at research-recommended defaults — zero overrides"
  - "Section ordering locked to chronological build flow: Problem → MotherDuck Dives → MotherDuck MCP → DuckDB-WASM → Closing"
  - "Word budget locked at ~2,500 total with 750/1,750 (~30/70) problem-to-stack ratio satisfying CONT-02 and CONT-03"
  - "Code-snippet count locked at 2 (SQL classification query in §2; registerFileBuffer + read_parquet init in §4) — MCP .mcp.json snippet omitted"
  - "External-link list kept at 5 entries (Duguid PDF, CourtListener API, MotherDuck Dives docs, MCP server repo, DuckDB-WASM repo) — none removed"
  - "Term hygiene guardrails kept verbatim from outline §8 — no additions"

patterns-established:
  - "Outline-first workflow: per-phase OUTLINE.md sibling to PLAN.md, status flips draft→approved at human-verify checkpoint"
  - "Locked-decisions frontmatter block: assumption IDs (A1, A2, ...) become YAML keys for machine-readable contract"

requirements-completed: []  # Plan 01 produces the content contract; Plan 02 satisfies CONT-02/03/04 by writing the prose page

# Metrics
duration: ~30min
completed: 2026-04-19
---

# Phase 07 Plan 01: TCPA Case Study Outline Summary

**Locked content contract for /projects/tcpa — 5-section list, hero/sticky-panel/footer specs aligned to mobi structural slots, A1–A8 decisions accepted at research defaults, ~2,500-word ~30/70 problem-to-stack budget, 2 code-snippet slots, 5 inline external links.**

## Performance

- **Duration:** ~30 min (Task 1 draft + Task 2 user review + this finalization)
- **Started:** 2026-04-20T04:59:25Z (Task 1 draft start)
- **Completed:** 2026-04-19 (user-approved + locked)
- **Tasks:** 2 (1 auto draft + 1 human-verify checkpoint)
- **Files modified:** 1 (07-OUTLINE.md created and approved); 1 metadata commit covers OUTLINE.md + this SUMMARY.md

## Accomplishments

- Drafted `07-OUTLINE.md` with all 10 required sections (metadata, hero, sticky panel, section list, code snippets, external links, footer, term hygiene, locked answers, handoff note)
- Locked all eight A1–A8 assumption items at research-recommended defaults — zero overrides required from user
- Section list committed: 5 sections totaling ~2,500 words at ~30% problem / ~70% stack ratio (CONT-02 and CONT-03 weight requirements satisfied by contract)
- Code-snippet menu committed at 2 slots (SQL classification query in `motherduck-dives` section; `registerFileBuffer` + `read_parquet` init in `duckdb-wasm` section)
- External-link list locked at 5 entries spanning all four narrative sections
- Term-hygiene guardrails captured for VALIDATION.md row 7-02-T3 grep enforcement
- User reviewed and approved on 2026-04-19; frontmatter `status` flipped from `draft` to `approved`

## Task Commits

1. **Task 1: Draft 07-OUTLINE.md with full section spec and locked answers** — `9f7b4ce` (docs)
2. **Task 2: User approval checkpoint** — approval flip and SUMMARY captured in this plan's metadata commit

**Plan metadata:** (this commit) — `docs(07): lock TCPA case-study outline`

## Final Locked Values (A1–A8)

All eight items accepted at the research-recommended default. No overrides.

| # | Claim | Final value | Source default |
|---|-------|-------------|----------------|
| A1 | Kicker string | `"Case Study 003"` | RESEARCH.md §Gray Area 5 — Mobi is `"Case Study 002"`, TCPA is the next numbered deep-dive |
| A2 | Target-tab behavior for all 3 CTAs | same-tab (no `target="_blank"`) | RESEARCH.md §Gray Area 1 — `/tcpa/` is a full-viewport static bundle; same-tab reads as "open the app" |
| A3 | Layout shape | Two-panel (mobi 35%/65% sticky-left preserved) | RESEARCH.md §Gray Area 2 — PAGE-08 mandates visual consistency with `/projects/mobi` |
| A4 | Section ordering | Chronological build flow: Problem → Dives → MCP → DuckDB-WASM → Closing | RESEARCH.md §Gray Area 4 — narrative arc from "why" to "how" to "ship" |
| A5 | Screenshot format | `apps/web/public/tcpa-preview.png`, 1600×1000 PNG, ~300 KB target (50–500 KB acceptable per VALIDATION.md row 7-02-T1) | RESEARCH.md §Gray Area 7 — source = `/tcpa/` Filings tab with real post-Duguid data |
| A6 | Secondary GitHub pill | Omitted | RESEARCH.md verified both `github.com/d-aniel-yi/tcpa` and `/tcpa-visualizer` return 404; no public repo exists |
| A7 | "Dive" term hygiene | `"MotherDuck Dive"` (capitalized) only; page is a `"case study"`, NOT a `"deep dive"`; `/tcpa` is `"the live visualizer"` | STATE.md line 47 / RESEARCH.md Pitfall 4 — distinguishes MotherDuck product from page genre |
| A8 | Outline artifact format | `07-OUTLINE.md` as sibling to `07-0*-PLAN.md` (this file's path) | No precedent in repo; natural fit per ROADMAP.md Phase 7 plan descriptions |

## Final Word-Count Budget

Total target: **~2,500 words**. Ratio: **750 / 1,750 = ~30% problem / ~70% stack** (CONT-02 + CONT-03 satisfied).

| # | Section ID | Title | Word target |
|---|------------|-------|-------------|
| 1 | `the-problem` | The Problem: Post-Duguid TCPA Trend Analysis | ~750 |
| 2 | `motherduck-dives` | MotherDuck Dives: Dashboards as Code | ~500 |
| 3 | `motherduck-mcp` | MotherDuck MCP: Conversational ETL | ~400 |
| 4 | `duckdb-wasm` | DuckDB-WASM: Zero-Backend Publishing | ~750 |
| 5 | `closing` | What This Stack Lets You Ship | ~100 |

**Adjustment rule for Plan 02:** if total scales away from 2,500, maintain the 30/70 ratio within ±5 percentage points (problem 25–35%, stack 65–75%).

## Final Code-Snippet Count

**2 snippets** (locked default; no override). Both use the mobi dark-block class contract:

```
mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800
```

| # | Section | Content | Source |
|---|---------|---------|--------|
| 1 | §2 `motherduck-dives` | ~10–12 lines of SQL — claim-classification or top-plaintiffs query (keywords purple, strings green, comments gray) | `external/tcpa-visualizer/.dive-preview/src/dive.tsx` (read at prose-write time, not in planning read-set); fallback schema in CONTEXT.md lines 54–90 |
| 2 | §4 `duckdb-wasm` | ~8 lines — `await db.registerFileBuffer(...)` + `CREATE TABLE … AS SELECT * FROM read_parquet(...)` | `external/tcpa-visualizer/STATIC-BUILD.md` lines 215–220 |

The optional MCP `.mcp.json` config snippet (RESEARCH.md §Gray Area 6 candidate #2) is **omitted** — the MCP story reads as prose without requiring a config block.

## External-Link List (Final — 5 Links Kept)

Inline anchor classes locked at outline level: `text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900`.

| # | Section | URL | Purpose |
|---|---------|-----|---------|
| L1 | §1 `the-problem` | `https://www.supremecourt.gov/opinions/20pdf/19-511_p86b.pdf` | *Facebook v. Duguid* opinion anchor |
| L2 | §1 `the-problem` | `https://www.courtlistener.com/help/api/rest/` | CourtListener REST API (data source) |
| L3 | §2 `motherduck-dives` | `https://motherduck.com/docs/key-tasks/ai-and-motherduck/dives/` | MotherDuck Dives product docs |
| L4 | §3 `motherduck-mcp` | `https://github.com/motherduckdb/mcp-server-motherduck` | MCP server repo (chosen over docs URL — more actionable) |
| L5 | §4 `duckdb-wasm` | `https://github.com/duckdb/duckdb-wasm` | DuckDB-WASM project repo |

**Cap rule for Plan 02:** 1–2 outbound links per stack section keeps the page narrative-first and prevents linkdump feel.

## Term-Hygiene Guardrails (Unchanged from Outline §8)

- `"MotherDuck Dive"` (capitalized, two words) when referring to the MotherDuck product — never `"dive"` lowercase without the `MotherDuck` prefix
- Page is a `"case study"`, NOT a `"deep dive"` — VALIDATION.md row 7-02-T3 will grep `! grep -qi 'deep dive' src/app/projects/tcpa/page.tsx`
- `/tcpa/` itself is `"the live visualizer"` / `"the /tcpa app"` / `"the static visualizer"` — never `"the dive at /tcpa"` (it is a DuckDB-WASM derivative of the Dive, not the Dive itself; this distinction is the §4 narrative hinge)
- Required term occurrences (VALIDATION.md row 7-02-T3 enforces presence):
  - `MotherDuck Dive` — at least once in §2
  - `DuckDB-WASM` — at least once in §4
  - `MCP` — at least once in §3
  - `Duguid` — at least once in §1

No additional guardrails were added during user review.

## Files Created/Modified

- `.planning/phases/07-tcpa-case-study-page/07-OUTLINE.md` — Locked content contract for /projects/tcpa case study; consumed verbatim by Plan 02 prose executor (status flipped to `approved` in this plan's metadata commit)
- `.planning/phases/07-tcpa-case-study-page/07-01-SUMMARY.md` — This summary

## Decisions Made

All decisions are accepted research defaults; see "Final Locked Values (A1–A8)" table above for the full set with citations. The single user-facing decision in this plan was **whether to override any A1–A8 default**, and the user accepted all eight defaults without modification.

## Deviations from Plan

None — plan executed exactly as written. Task 1 produced the outline matching the spec in the plan's `<action>` block; Task 2 reached the human-verify checkpoint and resumed with `"approved"` per the resume-signal contract.

## Issues Encountered

None during planning execution. One minor housekeeping note during this finalization step: the `gsd-sdk requirements.mark-complete` handler was initially invoked for CONT-02/03/04 (which appear in this plan's `requirements` frontmatter) but those requirements are satisfied by the **prose deliverable in Plan 02**, not by the outline contract in Plan 01. The handler edit was reverted with `git checkout`. Plan 02 will mark CONT-02/03/04 complete after the prose page ships and validation passes.

## User Setup Required

None — this is a planning-only plan; no external service configuration, no env vars, no manual steps.

## Next Phase Readiness

- **Plan 02 can proceed:** `07-OUTLINE.md` is `status: approved` and contains a complete content contract (sections, IDs, word budgets, snippet slots, link list, term hygiene, handoff note)
- **No blockers** — all A1–A8 decisions are locked; Plan 02 has zero structural ambiguity
- **Source-material reads required at Plan 02 write-time** (NOT in planning read-set):
  - `external/tcpa-visualizer/.dive-preview/src/dive.tsx` — for SQL snippet content
  - Re-verify external-link URLs (MotherDuck docs may relocate)

---
*Phase: 07-tcpa-case-study-page*
*Completed: 2026-04-19*

## Self-Check: PASSED

- FOUND: `.planning/phases/07-tcpa-case-study-page/07-OUTLINE.md` (status: approved)
- FOUND: `.planning/phases/07-tcpa-case-study-page/07-01-SUMMARY.md` (this file)
- FOUND: commit `9f7b4ce` (Task 1 draft commit)
- Plan metadata commit covers OUTLINE.md (frontmatter flip) + 07-01-SUMMARY.md + STATE.md updates
