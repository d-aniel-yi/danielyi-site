# Roadmap: Resume Site

## Overview

This roadmap covers three milestones:

**v1.0 — Bug Fix & Merge:** Diagnose and fix all build errors on the `dev` branch so that new project deep dive pages and tech demos updates build successfully as a static export. Merge working changes into `main` without regressions.

**v1.1 — Mobi Deep Dive Refinement:** Improve the Mobi tech deep dive page layout, interactivity, and content depth.

**v1.2 — TCPA Case Study:** Ship a new project case study at `/projects/tcpa` telling the story of why the TCPA Litigation Explorer was built (~30% narrative weight) and why the stack was chosen (~70% — MotherDuck Dives, MotherDuck MCP server, DuckDB-WASM). Page includes an embedded visualizer preview with a "Try it live" CTA to `/tcpa`, and a TCPA card on the `/projects` listing.

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

### v1.2

- [x] **Phase 7: TCPA Case Study Page** - Build `/projects/tcpa` deep dive with outline-approved narrative, embedded visualizer preview, and "Try it live" CTA (completed 2026-04-19)
- [ ] **Phase 8: Listing Integration & Build Validation** - Add TCPA card to `/projects` listing and validate full static export build

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

### Phase 7: TCPA Case Study Page
**Goal**: A visitor can navigate to `/projects/tcpa` and read the full TCPA case study — problem framing (~30%), stack reasoning (~70%), embedded visualizer preview, and a "Try it live" CTA to `/tcpa` — structured consistent with `/projects/mobi`
**Depends on**: Phase 6
**Requirements**: PAGE-06, PAGE-08, CONT-02, CONT-03, CONT-04, VIZ-01, VIZ-02
**Success Criteria** (what must be TRUE):
  1. Navigating to `/projects/tcpa` loads a case study page whose visual shape matches `/projects/mobi` (hero, section structure, type scale)
  2. The narrative reads roughly 30% problem context / 70% stack reasoning, covering MotherDuck Dives, MotherDuck MCP server, and DuckDB-WASM with user-directed insights (not generic template prose)
  3. A preview of the `/tcpa` visualizer is embedded on the page (iframe or screenshot — approach decided in plan phase)
  4. A visible "Try it live" CTA navigates the user to `/tcpa`
  5. Page content follows the outline-first workflow — the section outline is approved before prose is written and filled top-to-bottom
**Plans**: TBD
**UI hint**: yes

Plans:
- [x] 07-01-PLAN.md — Outline plan: produce and get approval on the section outline (headings, narrative weight per section, embed placement) — completed 2026-04-19
- [x] 07-02-PLAN.md — Prose plan: fill approved outline with user-directed content, wire up embed + CTA — completed 2026-04-19

### Phase 8: Listing Integration & Build Validation
**Goal**: The new TCPA case study is discoverable from `/projects` and the full site builds cleanly as a static export
**Depends on**: Phase 7
**Requirements**: PAGE-07, LIST-01
**Success Criteria** (what must be TRUE):
  1. A TCPA project card appears on the `/projects` listing page and links to `/projects/tcpa`
  2. `next build` with `output: 'export'` completes without errors after v1.2 changes
  3. `/projects/tcpa` and `/projects` both produce valid static HTML in the export output
  4. Existing deep dive pages (FSBO, Mobi, Portfolio) still render and build without regressions
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [ ] 08-01-PLAN.md — Add TCPA card to `/projects` listing and validate full static-export build (PAGE-07 + LIST-01)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Diagnose | 1/1 | ✓ Complete | 2026-02-10 |
| 2. Fix Pages | 4/4 | ✓ Complete | 2026-02-11 |
| 3. Validate | —/— | ✓ Complete | 2026-04-06 |
| 4. Integrate | —/— | ✓ Complete | 2026-04-06 |
| 5. Diagram & Navigation | 1/1 | Complete   | 2026-04-06 |
| 6. Content Expansion | 1/1 | Complete   | 2026-04-06 |
| 7. TCPA Case Study Page | 2/2 | Complete | 2026-04-19 |
| 8. Listing Integration & Build Validation | 0/1 | Not started | — |

---
*Created: 2026-02-10*
*Last updated: 2026-04-19 — Phase 8 planned (1 plan); Phase 7 complete; Phase 8 ready to execute*
