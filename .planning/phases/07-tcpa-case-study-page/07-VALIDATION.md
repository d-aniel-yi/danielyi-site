---
phase: 7
slug: tcpa-case-study-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-19
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
| 7-01-* | 01 (outline) | 1 | CONT-02, CONT-03, CONT-04 | — | N/A (content-only plan) | manual | User approval of `07-OUTLINE.md` at plan-review gate | ❌ W0 | ⬜ pending |
| 7-02-* | 02 (prose) | 1 | PAGE-06, PAGE-08 | — | N/A | build | `cd apps/web && npm run build` produces `out/projects/tcpa/index.html` | ❌ W0 | ⬜ pending |
| 7-02-* | 02 (prose) | 1 | VIZ-01 | — | screenshot is local asset, not cross-origin | grep | `test -f apps/web/public/tcpa-preview.png && grep -q 'tcpa-preview' apps/web/src/app/projects/tcpa/page.tsx` | ❌ W0 | ⬜ pending |
| 7-02-* | 02 (prose) | 1 | VIZ-02 | — | CTA uses `<a href="/tcpa/">` (not next/link — /tcpa is static) | grep | `grep -q 'href="/tcpa/"' apps/web/src/app/projects/tcpa/page.tsx` | ❌ W0 | ⬜ pending |
| 7-02-* | 02 (prose) | 1 | PAGE-08 | — | visual shape matches /projects/mobi | manual | Side-by-side compare `/projects/mobi` vs `/projects/tcpa` in `npm run dev` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/web/src/app/projects/tcpa/page.tsx` — new file created by prose plan
- [ ] `apps/web/public/tcpa-preview.png` — screenshot asset acquired before prose plan can reference it (content asset, not code)
- [ ] `.planning/phases/07-tcpa-case-study-page/07-OUTLINE.md` — outline artifact produced by outline plan and approved by user before prose plan runs

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Content reads as user-directed, not generic template prose | CONT-04 | Subjective quality bar | User reviews prose during Plan 02 approval gate; confirm language, examples, and stack rationale reflect user direction captured at outline time |
| Narrative weight is roughly 30% problem / 70% stack | CONT-02, CONT-03 | Word counts are estimates; balance is judgment call | During prose review, spot-check word counts per section; ~750 problem / ~1750 stack for a ~2500-word page |
| Visual shape matches `/projects/mobi` | PAGE-08 | Visual similarity requires eyeball comparison | Open both pages side-by-side in `npm run dev`; confirm hero, kicker, type scale, section rhythm, sticky-panel split, end-of-page CTA all track mobi |
| Screenshot shows a representative, non-empty visualizer view | VIZ-01 | Image quality is subjective | User reviews screenshot before embedding; confirm it shows real data, readable UI, no dev artifacts |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or documented manual verification
- [ ] Sampling continuity: build runs at least once per wave
- [ ] Wave 0 covers the three MISSING references (page.tsx, screenshot asset, OUTLINE.md)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s for typecheck, < 120s for build
- [ ] `nyquist_compliant: true` set in frontmatter after planner fills per-task rows

**Approval:** pending
