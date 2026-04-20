---
phase: 08-listing-integration-build-validation
plan: 01
subsystem: ui
tags:
  - nextjs
  - projects-listing
  - static-export
  - build-validation
  - tcpa

requires:
  - phase: 07-tcpa-case-study-page
    provides: "/projects/tcpa static route, /tcpa-preview.png thumbnail asset, shipped TCPA narrative copy"
provides:
  - "TCPA Litigation Explorer card on /projects listing (fourth deep-dive entry)"
  - "Validated v1.2 full static-export build with new route present"
  - "Closes LIST-01 (listing integration) and PAGE-07 (v1.2 build validation)"
affects:
  - "v1.2 milestone complete — /projects listing now surfaces all four deep-dive case studies"

tech-stack:
  added: []
  patterns:
    - "Deep-dive card pattern: featured: true + detailsSlug routes via ProjectCard's linkHref resolution (internal, same-tab)"
    - "Static-export client-rendered listing: card href lives in compiled JS bundle, not in the HTML shell — static grep checks must target the bundle, not out/projects/index.html"

key-files:
  created:
    - ".planning/phases/08-listing-integration-build-validation/08-01-SUMMARY.md"
  modified:
    - "apps/web/src/app/projects/page.tsx"

key-decisions:
  - "Appended TCPA as fourth featuredProjects entry (order: FSBO, Mobi, Portfolio, TCPA) — preserves existing card ordering per scope_anchor"
  - "Reused Phase 7's /tcpa-preview.png asset as-is; no new public assets added"
  - "accentColor #f59e0b (amber-500) chosen to complement existing trio (#3b82f6 / #D9A16A / #8b5cf6) with a distinct warm gold"
  - "detailsSlug: \"tcpa\" drives internal same-tab navigation via ProjectCard.tsx linkHref resolution — no new card variant or prop added"

patterns-established:
  - "Client-rendered listing static-export verification: grep the compiled chunk (out/_next/static/chunks/*.js) for TCPA strings rather than out/projects/index.html, because the listing uses `\"use client\"` and hydrates card data from JS"

requirements-completed:
  - PAGE-07
  - LIST-01

duration: ~12min
completed: 2026-04-20
---

# Phase 08: listing-integration-build-validation Summary

**TCPA Litigation Explorer card added to /projects as the fourth deep-dive entry; full v1.2 static export validated with no regressions; deployed live to da.nielyi.com.**

## Performance

- **Duration:** ~12 min (executor worktree execution + merge + deploy)
- **Completed:** 2026-04-20
- **Tasks:** 3 (2 automated + 1 human-verify checkpoint)
- **Files modified:** 1 (`apps/web/src/app/projects/page.tsx` — 20 inserted lines)

## Accomplishments
- Appended fourth deep-dive card (TCPA Litigation Explorer) to `featuredProjects` — title, excerpt (~60 words), image `/tcpa-preview.png`, 3 tags (DuckDB-WASM / MotherDuck / Next.js), amber accent `#f59e0b`, 4 techDetails.highlights
- Clean full static export build (`rm -rf out .next && npm run build`) exited 0 — all five project routes (`/projects`, `/projects/tcpa`, `/projects/fsbo`, `/projects/mobi`, `/projects/portfolio`) + landing page + preview asset all present in `apps/web/out/`
- Deployed `apps/web/out/` to S3 (`webstack-sitebucket397a1860-ch6qspuydeub`) and created CloudFront invalidation `I9DQVCW09R7KF9OF7F2HWH69AB` for distribution `E2OT2XQ5FYA3UB`
- Closed v1.2 milestone: both PAGE-07 (build passes with v1.2 changes) and LIST-01 (TCPA card on listing) satisfied

## Task Commits

1. **Task 1: Append TCPA entry to featuredProjects array** — `1700076` (feat)
2. **Task 2: Full static-export build + no-regression validation** — no commit (build artifacts gitignored; all assertions green)
3. **Task 3: Visual confirmation of listing integration** — human-verified "approved" after worktree merge to main

**Worktree merge:** `740425d` (chore: merge executor worktree)

## Shipped values table — TCPA card entry

| Field | Contracted | Actual |
|-------|------------|--------|
| title | `TCPA Litigation Explorer` | ✓ |
| href | `/projects/tcpa` | ✓ |
| excerpt length | ~60 words | ✓ (61 words) |
| image | `/tcpa-preview.png` | ✓ |
| tags | `["DuckDB-WASM", "MotherDuck", "Next.js"]` (3) | ✓ (3) |
| featured | `true` | ✓ |
| accentColor | `#f59e0b` | ✓ |
| detailsSlug | `"tcpa"` | ✓ |
| techDetails.stack | 5 items | ✓ (5) |
| techDetails.highlights | 4 items | ✓ (4) |

## Build verification snapshot

- `npx tsc --noEmit` → exit 0
- `rm -rf out .next && npm run build` → exit 0, Next route summary includes all expected routes
- `test -f apps/web/out/projects/index.html` → OK (39 815 bytes)
- `test -f apps/web/out/projects/tcpa/index.html` → OK (39 995 bytes, Phase 7 regression gate)
- `test -f apps/web/out/projects/{fsbo,mobi,portfolio}/index.html` → all OK
- `test -f apps/web/out/index.html` → OK (landing page)
- `test -f apps/web/out/tcpa-preview.png` → OK (bundled)
- `grep "TCPA Litigation Explorer" apps/web/out/_next/static/chunks/a6034ff49a09edfb.js` → matches (card data in compiled bundle)
- `grep "tcpa-preview.png" apps/web/out/_next/static/chunks/a6034ff49a09edfb.js` → matches

## Decisions Made

None beyond those specified in plan — executed exactly as written.

## Deviations from Plan

**1. Static-export grep check on out/projects/index.html (contract adjustment, not auto-fix)**
- **Found during:** Task 2 (build validation)
- **Issue:** Plan's `grep -q '/projects/tcpa' out/projects/index.html` check did not match
- **Root cause:** `apps/web/src/app/projects/page.tsx` has `"use client"` at the top, so Next renders the HTML shell without the card data and hydrates from JS. The `/projects/tcpa` href lives in `out/_next/static/chunks/a6034ff49a09edfb.js`, not in the HTML shell.
- **Resolution:** Verified the card data (title, href, image) is present in the compiled chunk and that `/projects/tcpa/index.html` exists as a static-export route. The user-visible outcome (clicking the card navigates to the TCPA page) is unaffected. Documented this as a `patterns-established` entry so future build-validation plans for client-rendered listings target the chunk.
- **Files modified:** none (this is a verification-contract clarification, not a code fix)
- **Committed in:** n/a

**Total deviations:** 1 (contract clarification, not a code auto-fix)
**Impact on plan:** None — all user-visible must_haves hold, all automated checks pass on their revised target.

## Issues Encountered

- **Worktree → main desync during human-verify:** The executor ran in git worktree isolation (`worktree-agent-ae2d8d2f`), so its Task 1 commit was not visible to the user's main-repo dev server. Human-verify initially showed only 3 cards because the dev server was reading from an unmerged main. Resolved by merging the worktree branch (`--no-ff`) back to main (`740425d`) and force-removing the locked worktree; the user then confirmed the four-card grid and approved. Flagged for workflow awareness: `autonomous: false` plans under worktree isolation need the worktree merge to land BEFORE presenting the human-verify checkpoint.

## Deployment

- **Built:** `cd apps/web && rm -rf out .next && npm run build` (as part of Task 2)
- **Uploaded:** `aws s3 sync ./apps/web/out s3://webstack-sitebucket397a1860-ch6qspuydeub --delete`
- **Invalidated:** `aws cloudfront create-invalidation --distribution-id E2OT2XQ5FYA3UB --paths '/*'` → id `I9DQVCW09R7KF9OF7F2HWH69AB`
- **Live at:** https://da.nielyi.com/projects (and CloudFront default `d11xw7n5vhyibf.cloudfront.net`)

## User Setup Required

None — no external service configuration needed for a listing-page edit.

## Next Phase Readiness

- Phase 8 is the **final phase of milestone v1.2**. All v1.2 requirements (PAGE-07, LIST-01) are complete and deployed.
- No blockers. Recommend `/gsd-complete-milestone` to archive v1.2 artifacts, then `/gsd-new-milestone` when v1.3 scope is ready.

---
*Phase: 08-listing-integration-build-validation — closes milestone v1.2*
*Completed: 2026-04-20*
