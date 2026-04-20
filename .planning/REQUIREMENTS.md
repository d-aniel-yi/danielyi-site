# Requirements: Resume Site

**Defined:** 2026-02-10
**Updated:** 2026-04-19
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

## v1.1 Requirements (Complete)

### Diagram Layout

- [x] **DIAG-01**: Mobi architecture diagram is inline in the page content flow (not a fixed side panel)
- [x] **DIAG-02**: Diagram is view-only — no zoom, pan, or node dragging
- [x] **DIAG-03**: Diagram edges auto-animate on page load (no simulation button/UI)

### Navigation

- [x] **NAV-01**: "View on GitHub" button links to https://github.com/d-aniel-yi/mobi

### Content

- [x] **CONT-01**: Additional technical sections added sourced from Mobi repo documentation

## v1.2 Requirements

### Case Study Page

- [ ] **PAGE-06**: Visitor can navigate to `/projects/tcpa` and see a case study page
- [ ] **PAGE-07**: Case study page builds successfully in `next build` static export
- [ ] **PAGE-08**: Case study page visual shape is consistent with existing deep dives (uses `/projects/mobi` as structural reference)

### Content Narrative

- [ ] **CONT-02**: Case study conveys the problem context — why the TCPA Litigation Explorer was built (~30% of narrative weight)
- [ ] **CONT-03**: Case study conveys stack reasoning — why MotherDuck Dives, MotherDuck MCP server, and DuckDB-WASM were chosen (~70% of narrative weight)
- [ ] **CONT-04**: Case study content reflects user-directed reasoning and insights, not generic template prose

### Visualizer Integration

- [ ] **VIZ-01**: Case study page embeds a preview of the `/tcpa` visualizer (iframe or screenshot — approach decided in plan phase)
- [ ] **VIZ-02**: Case study page includes a "Try it live" CTA that opens `/tcpa`

### Projects Listing

- [ ] **LIST-01**: TCPA project card appears on the `/projects` listing page linking to `/projects/tcpa`

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mercury page | Not in scope for this milestone |
| FSBO / Portfolio deep dive refinements | Only the TCPA case study is being added |
| Changes to the embedded TCPA visualizer source (`external/tcpa-visualizer/`) | v1.2 is case-study-page-only |
| Infrastructure/CDK changes | Deployment pipeline is working |
| Architecture diagram on TCPA page | Not requested; page is narrative-driven, not diagram-driven |

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
| PAGE-06 | TBD | Active |
| PAGE-07 | TBD | Active |
| PAGE-08 | TBD | Active |
| CONT-02 | TBD | Active |
| CONT-03 | TBD | Active |
| CONT-04 | TBD | Active |
| VIZ-01 | TBD | Active |
| VIZ-02 | TBD | Active |
| LIST-01 | TBD | Active |

**Coverage:**
- v1.2 requirements: 8 total
- Mapped to phases: 0 (roadmap pending)
- Unmapped: 8 (will be resolved by roadmapper)

---
*Requirements defined: 2026-02-10*
*Last updated: 2026-04-19 — v1.2 TCPA Case Study requirements added*
