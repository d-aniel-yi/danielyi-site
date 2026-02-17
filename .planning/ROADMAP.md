# Roadmap: Resume Site — Bug Fix & Merge

## Overview

Diagnose and fix all build errors on the `dev` branch so that new project deep dive pages and tech demos updates build successfully as a static export. Once builds pass and quality checks are green, merge the working changes into `main` without regressions.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Diagnose** - Identify root causes of build failures
- [x] **Phase 2: Fix Pages** - Repair broken pages for static export
- [ ] **Phase 3: Validate** - Ensure quality checks pass
- [ ] **Phase 4: Integrate** - Merge to main without regressions

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
**Requirements**: BUILD-01, BUILD-02, QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. `next build` with `output: 'export'` completes without errors
  2. All new pages produce valid static HTML in export output
  3. No linting errors in new or modified files
  4. No TypeScript errors in new or modified files
**Plans**: TBD

Plans:
- [ ] TBD (to be created during phase planning)

### Phase 4: Integrate
**Goal**: Changes are merged to main and site continues working
**Depends on**: Phase 3
**Requirements**: INTG-01, INTG-02
**Success Criteria** (what must be TRUE):
  1. `dev` branch merges into `main` without conflicts
  2. Existing pages from `main` still render correctly after merge
  3. Full site builds successfully from `main` branch
**Plans**: TBD

Plans:
- [ ] TBD (to be created during phase planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Diagnose | 1/1 | ✓ Complete | 2026-02-10 |
| 2. Fix Pages | 4/4 | ✓ Complete | 2026-02-11 |
| 3. Validate | 0/TBD | Not started | - |
| 4. Integrate | 0/TBD | Not started | - |

---
*Created: 2026-02-10*
*Last updated: 2026-02-11*
