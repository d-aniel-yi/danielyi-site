# Roadmap: Resume Site

## Overview

This roadmap covers two milestones:

**v1.0 — Bug Fix & Merge:** Diagnose and fix all build errors on the `dev` branch so that new project deep dive pages and tech demos updates build successfully as a static export. Merge working changes into `main` without regressions.

**v1.1 — Mobi Deep Dive Refinement:** Improve the Mobi tech deep dive page layout, interactivity, and content depth.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

### v1.0

- [x] **Phase 1: Diagnose** - Identify root causes of build failures
- [x] **Phase 2: Fix Pages** - Repair broken pages for static export
- [x] **Phase 3: Validate** - Ensure quality checks pass
- [x] **Phase 4: Integrate** - Merge to main without regressions

### v1.1

- [x] **Phase 5: Diagram & Navigation** - Rework diagram layout/interactivity and add GitHub link (completed 2026-04-06)
- [x] **Phase 6: Content Expansion** - Add technical depth to Mobi page from repo documentation (completed 2026-04-06)

## Phase Details

### Phase 1: Diagnose
**Goal**: Build failures are identified and root causes are understood
**Depends on**: Nothing (first phase)
**Requirements**: BUILD-01
**Success Criteria** (what must be TRUE):
  1. All build errors from `next build` are documented with file paths and error messages
  2. Root causes are identified for each failure (SSR-only APIs, missing dependencies, import errors, etc.)
  3. Scope of required fixes is known (which pages, which files)
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Run build diagnostics and document all errors with categorization

### Phase 2: Fix Pages
**Goal**: All new pages render correctly in static export
**Depends on**: Phase 1
**Requirements**: BUILD-02, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05
**Success Criteria** (what must be TRUE):
  1. Projects listing page (`/projects`) renders without errors
  2. FSBO deep dive page (`/projects/fsbo`) renders without errors
  3. Mobi deep dive page (`/projects/mobi`) renders without errors
  4. Portfolio deep dive page (`/projects/portfolio`) renders without errors
  5. Tech demos page (`/technical`) updates render without errors
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Implement parseAddress utility for FSBO page
- [x] 02-02-PLAN.md — Implement ProjectCard component for projects listing
- [x] 02-03-PLAN.md — Implement shared TargetSection for halborn/softstack pages
- [x] 02-04-PLAN.md — Verify build succeeds with all component implementations

### Phase 3: Validate
**Goal**: Build succeeds and code quality checks pass
**Depends on**: Phase 2
**Requirements**: BUILD-01, BUILD-02
**Success Criteria** (what must be TRUE):
  1. `next build` with `output: 'export'` completes without errors
  2. All new pages produce valid static HTML in export output
  3. No linting errors in new or modified files
  4. No TypeScript errors in new or modified files
**Plans**: TBD

Plans:
- [x] TBD (completed as part of v1.0)

### Phase 4: Integrate
**Goal**: Changes are merged to main and site continues working
**Depends on**: Phase 3
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05
**Success Criteria** (what must be TRUE):
  1. `dev` branch merges into `main` without conflicts
  2. Existing pages from `main` still render correctly after merge
  3. Full site builds successfully from `main` branch
**Plans**: TBD

Plans:
- [x] TBD (completed as part of v1.0)

### Phase 5: Diagram & Navigation
**Goal**: The Mobi architecture diagram is inline, non-interactive, auto-animating, and the page links to the GitHub repo
**Depends on**: Phase 4
**Requirements**: DIAG-01, DIAG-02, DIAG-03, NAV-01
**Success Criteria** (what must be TRUE):
  1. The diagram appears in the normal page scroll flow — not in a fixed side panel
  2. The diagram cannot be zoomed, panned, or have its nodes dragged
  3. Diagram edges animate automatically when the page loads — no button required
  4. A "View on GitHub" button is visible on the page and navigates to https://github.com/d-aniel-yi/mobi
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [x] 05-01-PLAN.md — Refactor Mobi page: sticky 35% diagram panel, view-only interactions, auto-animation loop, GitHub CTA buttons

### Phase 6: Content Expansion
**Goal**: The Mobi page contains richer technical sections sourced from the Mobi repo's documentation
**Depends on**: Phase 5
**Requirements**: CONT-01
**Success Criteria** (what must be TRUE):
  1. At least one new technical section appears on the page beyond the existing four
  2. Content accurately reflects implementation details found in the Mobi repo documentation
  3. The page builds successfully as a static export after content additions
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Add SAM/ML Pipeline, WebSocket notifications, and Workspace UI sections to Mobi page

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Diagnose | 1/1 | ✓ Complete | 2026-02-10 |
| 2. Fix Pages | 4/4 | ✓ Complete | 2026-02-11 |
| 3. Validate | —/— | ✓ Complete | 2026-04-06 |
| 4. Integrate | —/— | ✓ Complete | 2026-04-06 |
| 5. Diagram & Navigation | 1/1 | Complete   | 2026-04-06 |
| 6. Content Expansion | 1/1 | Complete   | 2026-04-06 |

---
*Created: 2026-02-10*
*Last updated: 2026-04-06*
