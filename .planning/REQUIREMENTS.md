# Requirements: Resume Site — Bug Fix & Merge

**Defined:** 2026-02-10
**Core Value:** New pages build successfully as static export and deploy to S3

## v1 Requirements

### Build Fixes

- [ ] **BUILD-01**: `next build` with `output: 'export'` completes without errors
- [ ] **BUILD-02**: All new pages produce valid static HTML in the export output

### Page Fixes

- [ ] **PAGE-01**: Projects listing page (`/projects`) renders correctly in static export
- [ ] **PAGE-02**: FSBO deep dive page (`/projects/fsbo`) renders correctly in static export
- [ ] **PAGE-03**: Mobi deep dive page (`/projects/mobi`) renders correctly in static export
- [ ] **PAGE-04**: Portfolio deep dive page (`/projects/portfolio`) renders correctly in static export
- [ ] **PAGE-05**: Tech demos page (`/technical`) updates render correctly in static export

### Code Quality

- [ ] **QUAL-01**: All new/modified files pass linting (`next lint` or eslint)
- [ ] **QUAL-02**: No TypeScript errors in new/modified files

### Integration

- [ ] **INTG-01**: `dev` branch merges into `main` without conflicts
- [ ] **INTG-02**: Existing pages on `main` still work after merge (no regressions)

## v2 Requirements

(None — this is a fix-and-merge project)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mercury page fixes | User excluded from scope |
| New features or design changes | Fix what's there, don't add |
| CDK/infrastructure changes | Deployment pipeline works, only build is broken |
| Visual polish or redesign | Goal is functional, not aesthetic |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUILD-01 | Phase 1, Phase 3 | In Progress (Phase 1 diagnosed) |
| BUILD-02 | Phase 2, Phase 3 | Pending |
| PAGE-01 | Phase 2 | Pending |
| PAGE-02 | Phase 2 | Pending |
| PAGE-03 | Phase 2 | Pending |
| PAGE-04 | Phase 2 | Pending |
| PAGE-05 | Phase 2 | Pending |
| QUAL-01 | Phase 3 | Pending |
| QUAL-02 | Phase 3 | Pending |
| INTG-01 | Phase 4 | Pending |
| INTG-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11 (100%)
- Unmapped: 0

**Note:** BUILD-01 and BUILD-02 appear in multiple phases because they're validated at different stages (diagnosis, fixing, and final validation).

---
*Requirements defined: 2026-02-10*
*Last updated: 2026-02-10 after roadmap creation*
