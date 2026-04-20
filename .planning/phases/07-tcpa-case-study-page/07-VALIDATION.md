---
phase: 7
slug: tcpa-case-study-page
status: planning-complete
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-19
updated: 2026-04-19
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js static export build (no unit-test framework in-repo; verification is typecheck + build + manual visual) |
| **Config file** | `apps/web/next.config.ts` |
| **Quick run command** | `cd apps/web && npx tsc --noEmit` |
| **Full suite command** | `cd apps/web && npm run build` |
| **Estimated runtime** | ~5s typecheck / ~30–60s full build |

---

## Sampling Rate

- **After every task commit:** Run `cd apps/web && npx tsc --noEmit`
- **After every plan wave:** Run `cd apps/web && npm run build`
- **Before `/gsd-verify-work`:** Full build green AND outline + prose plans both user-approved
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 7-01-T1 | 01 (outline) | 1 | CONT-02, CONT-03, CONT-04 | T-07-02 | Scope-anchored to `.planning/phases/07-*/07-OUTLINE.md` only | file-exists + grep | `test -f .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md && grep -q 'A1_kicker' .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md && grep -q 'A8_outline_format' .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md && grep -q 'the-problem' .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md && grep -q 'duckdb-wasm' .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md && grep -q 'tcpa-preview.png' .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md && grep -q 'href="/tcpa/"' .planning/phases/07-tcpa-case-study-page/07-OUTLINE.md` | ❌ W0 | ⬜ pending |
| 7-01-T2 | 01 (outline) | 1 | CONT-02, CONT-03, CONT-04 | — | User-approval gate before prose plan runs | manual | User flips `status: draft` → `status: approved` in OUTLINE.md frontmatter; resume-signal = "approved" | ❌ W0 | ⬜ pending |
| 7-02-T1 | 02 (prose) | 2 | VIZ-01 | T-07-06 | Asset ≤ 500 KB, ≥ 50 KB; shows real data (human-verified) | human-action | Human capture; verify `test -f apps/web/public/tcpa-preview.png` and file size in [50000, 500000] bytes | ❌ W0 | ⬜ pending |
| 7-02-T2 | 02 (prose) | 2 | PAGE-06, PAGE-08, VIZ-01, VIZ-02 | T-07-03 | No outer-container overflow (preserves sticky); no `<Link>` for static asset; no diagram | typecheck + grep | `cd apps/web && npx tsc --noEmit && grep -q '"use client"' src/app/projects/tcpa/page.tsx && grep -q 'href="/tcpa/"' src/app/projects/tcpa/page.tsx && grep -q 'tcpa-preview.png' src/app/projects/tcpa/page.tsx && grep -c 'id: "the-problem"\|id: "motherduck-dives"\|id: "motherduck-mcp"\|id: "duckdb-wasm"\|id: "closing"' src/app/projects/tcpa/page.tsx \| grep -q '^5$' && ! grep -q 'from "next/link"' src/app/projects/tcpa/page.tsx && ! grep -q '@xyflow/react' src/app/projects/tcpa/page.tsx` | ❌ W0 | ⬜ pending |
| 7-02-T3 | 02 (prose) | 2 | CONT-02, CONT-03, CONT-04 | T-07-04 | Prose is authored JSX; React escapes; no `dangerouslySetInnerHTML`; term hygiene (no "deep dive") | typecheck + grep | `cd apps/web && npx tsc --noEmit && grep -q 'MotherDuck Dive' src/app/projects/tcpa/page.tsx && grep -q 'DuckDB-WASM' src/app/projects/tcpa/page.tsx && grep -q 'MCP' src/app/projects/tcpa/page.tsx && grep -q 'Duguid' src/app/projects/tcpa/page.tsx && ! grep -qi 'deep dive' src/app/projects/tcpa/page.tsx` | ❌ W0 | ⬜ pending |
| 7-02-T4 | 02 (prose) | 2 | PAGE-06 | — | Static export under `output: 'export'` | build | `cd apps/web && npm run build && test -f out/projects/tcpa/index.html` | ❌ W0 | ⬜ pending |
| 7-02-T5 | 02 (prose) | 2 | PAGE-08, CONT-04, VIZ-01, VIZ-02 | — | Visual shape + prose quality + CTA behavior + sticky regression | manual | Side-by-side `/projects/mobi` vs `/projects/tcpa` in `npm run dev`; click each of 3 CTAs; scroll-test sticky panel | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Requirement → Task Coverage Audit

Every Phase 7 requirement from REQUIREMENTS.md maps to at least one task:

| Requirement | Task IDs | Verification Type |
|-------------|----------|-------------------|
| PAGE-06 | 7-02-T2, 7-02-T4 | scaffold + build |
| PAGE-08 | 7-02-T2, 7-02-T5 | scaffold check + manual visual |
| CONT-02 | 7-01-T1, 7-01-T2, 7-02-T3 | outline lock + approval + prose |
| CONT-03 | 7-01-T1, 7-01-T2, 7-02-T3 | outline lock + approval + prose |
| CONT-04 | 7-01-T1, 7-01-T2, 7-02-T3, 7-02-T5 | outline lock + approval + prose + user visual approval |
| VIZ-01 | 7-02-T1, 7-02-T2, 7-02-T5 | asset capture + reference in page + visual render check |
| VIZ-02 | 7-02-T2, 7-02-T5 | grep for `href="/tcpa/"` + click-through manual |

No requirement is unmapped. No task is missing a verification row.

---

## Wave 0 Requirements

- [ ] `.planning/phases/07-tcpa-case-study-page/07-OUTLINE.md` — outline artifact produced by Plan 01 Task 1 and approved at Task 2 before prose plan runs
- [ ] `apps/web/src/app/projects/tcpa/page.tsx` — new file created by Plan 02 Task 2 (scaffold) and filled by Task 3 (prose)
- [ ] `apps/web/public/tcpa-preview.png` — screenshot asset acquired by Plan 02 Task 1 (human-action) before Task 2 can embed it

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Outline reflects user intent before prose plan runs | CONT-04 (upstream gate) | Content structure is judgment | Plan 01 Task 2 — user reviews A1–A8 locked answers, section list, and word budgets in OUTLINE.md; flips `status` to `approved` |
| Screenshot shows a representative, non-empty visualizer view | VIZ-01 | Image quality + data completeness are subjective | Plan 02 Task 1 — human captures PNG from live `/tcpa/` Filings tab with real data, not a loading state |
| Content reads as user-directed, not generic template prose | CONT-04 | Subjective quality bar | Plan 02 Task 5 — user reviews rendered page side-by-side with mobi; confirms voice, examples, and stack rationale |
| Narrative weight is roughly 30% problem / 70% stack | CONT-02, CONT-03 | Word counts are estimates; balance is judgment | Plan 02 Task 5 — user spot-checks word counts per section against OUTLINE.md §4 targets |
| Visual shape matches `/projects/mobi` | PAGE-08 | Visual similarity requires eyeball comparison | Plan 02 Task 5 — open both pages side-by-side in `npm run dev`; confirm hero, kicker, type scale, section rhythm, sticky-panel split, end-of-page CTA all track mobi |
| `"Try it live"` CTAs navigate to live visualizer same-tab | VIZ-02 | Interaction test | Plan 02 Task 5 — user clicks each of 3 CTAs (hero, sticky panel, footer); verifies `/tcpa/` loads each time |
| Sticky left panel stays in place on scroll | PAGE-08 (Phase 5 regression) | Requires actual scroll in browser | Plan 02 Task 5 — scroll the right panel slowly; left panel must remain visible. If it scrolls away, outer flex container accidentally got `overflow-*` utility |

---

## Validation Sign-Off

- [x] All tasks have automated verify or documented manual verification (T-07-all)
- [x] Sampling continuity: typecheck after each code task (7-02-T2, 7-02-T3); full build at the end of Plan 02 (7-02-T4); manual review gates at 7-01-T2 and 7-02-T5
- [x] Wave 0 covers the three MISSING references (page.tsx, screenshot asset, OUTLINE.md)
- [x] No watch-mode flags
- [x] Feedback latency < 60s for typecheck, < 120s for build
- [x] `nyquist_compliant: true` set in frontmatter after planner filled per-task rows

**Approval:** planning-complete — ready for execution
