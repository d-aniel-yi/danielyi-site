# Requirements: Resume Site

**Defined:** 2026-02-10
**Updated:** 2026-04-06
**Core Value:** Showcase technical work through polished, detailed project deep dives

## v1.0 Requirements (Complete)

### Build Fixes

- [x] **BUILD-01**: `next build` with `output: 'export'` completes without errors
- [x] **BUILD-02**: All new pages produce valid static HTML in the export output

### Page Fixes

- [x] **PAGE-01**: Projects listing page (`/projects`) renders correctly in static export
- [x] **PAGE-02**: FSBO deep dive page (`/projects/fsbo`) renders correctly in static export
- [x] **PAGE-03**: Mobi deep dive page (`/projects/mobi`) renders correctly in static export
- [x] **PAGE-04**: Portfolio deep dive page (`/projects/portfolio`) renders correctly in static export
- [x] **PAGE-05**: Tech demos page (`/technical`) updates render correctly in static export

## v1.1 Requirements

### Diagram Layout

- [x] **DIAG-01**: Mobi architecture diagram is inline in the page content flow (not a fixed side panel)
- [x] **DIAG-02**: Diagram is view-only — no zoom, pan, or node dragging
- [x] **DIAG-03**: Diagram edges auto-animate on page load (no simulation button/UI)

### Navigation

- [x] **NAV-01**: "View on GitHub" button links to https://github.com/d-aniel-yi/mobi

### Content

- [x] **CONT-01**: Additional technical sections added sourced from Mobi repo documentation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mercury page | Not in scope for this milestone |
| Other deep dive pages | Only Mobi is being updated |
| Infrastructure/CDK changes | Deployment pipeline is working |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUILD-01 | Phase 1, 3 | Complete |
| BUILD-02 | Phase 2, 3 | Complete |
| PAGE-01 | Phase 2, 4 | Complete |
| PAGE-02 | Phase 2, 4 | Complete |
| PAGE-03 | Phase 2, 4 | Complete |
| PAGE-04 | Phase 2, 4 | Complete |
| PAGE-05 | Phase 2, 4 | Complete |
| DIAG-01 | Phase 5 | Complete |
| DIAG-02 | Phase 5 | Complete |
| DIAG-03 | Phase 5 | Complete |
| NAV-01 | Phase 5 | Complete |
| CONT-01 | Phase 6 | Complete |

**Coverage:**
- v1.1 requirements: 5 total
- Mapped to phases: 5
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-10*
*Last updated: 2026-04-06 after milestone v1.1 roadmap*
