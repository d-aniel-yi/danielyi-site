# Resume Site

## What This Is

A personal resume/portfolio site built with Next.js and deployed to S3 via CDK. Features project deep dive pages (FSBO, Mobi, Portfolio), tech demos, and a projects listing. The site builds as a static export and deploys via CDK.

## Core Value

Showcase technical work through polished, detailed project deep dives that demonstrate real engineering depth.

## Current Milestone: v1.2 TCPA Case Study

**Goal:** Ship a new project case study at `/projects/tcpa` telling the story of why the TCPA Litigation Explorer was built and why the stack was chosen — with an embedded preview + CTA to the live visualizer.

**Target features:**
- New Next.js deep dive page at `/projects/tcpa`, shape similar to `/projects/mobi`
- Outline-first content workflow — section structure approved up front, filled top-to-bottom with user direction
- Narrative weighted 30% problem / 70% stack reasoning — MotherDuck Dives + MCP-driven build flow, DuckDB-WASM for in-browser analytics, rationale per choice
- Embedded visualizer preview (iframe/screenshot) with "Try it live" CTA linking to `/tcpa`
- TCPA card added to the `/projects` listing

## Requirements

### Validated

- ✓ Existing site builds and deploys from `main` — v1.0
- ✓ Next.js static export to S3 via CDK — v1.0
- ✓ Projects listing page renders and builds — v1.0
- ✓ FSBO deep dive page renders and builds — v1.0
- ✓ Mobi deep dive page renders and builds — v1.0
- ✓ Portfolio deep dive page renders and builds — v1.0
- ✓ Tech demos page renders and builds — v1.0
- ✓ Mobi diagram is inline in the page flow (sticky 35% side panel) — Validated in Phase 5: Diagram & Navigation
- ✓ Mobi diagram is non-interactive (no zoom/pan/drag) — Validated in Phase 5: Diagram & Navigation
- ✓ Mobi diagram auto-animates on load (no simulation button) — Validated in Phase 5: Diagram & Navigation
- ✓ "View on GitHub" button links to https://github.com/d-aniel-yi/mobi — Validated in Phase 5: Diagram & Navigation
- ✓ Expanded technical content sourced from Mobi repo documentation — Validated in Phase 6: Content Expansion

### Active

v1.2 requirements defined in `.planning/REQUIREMENTS.md`.

### Out of Scope

- Mercury page and components — not in scope
- FSBO / Portfolio deep dive refinements — not in scope for v1.2
- Changes to the embedded TCPA visualizer source (`external/tcpa-visualizer/`) — v1.2 is case-study-page-only
- Infrastructure/CDK changes — deployment pipeline is working

## Context

- Site is a Next.js app in `apps/web/` with CDK infrastructure in `infra/`
- Deployed as static export to S3 (`output: 'export'` in next.config)
- Mobi page uses `@xyflow/react` for the architecture diagram
- Mobi repo (https://github.com/d-aniel-yi/mobi) has extensive technical documentation that can inform deeper content
- Mobi page has 7 sections: Microservices Architecture, Containerization Strategy, Async Task Queue, SQL Proficiency, SAM/ML Pipeline, WebSocket Notifications, Workspace UI Design
- TCPA Litigation Explorer ships at `/tcpa` — an embedded standalone vite app built from `external/tcpa-visualizer/static-site/src/` into `apps/web/public/tcpa/`
- Visualizer stack: DuckDB-WASM in the browser, parquet data files, MotherDuck Dives (the source of the "dive" naming), MotherDuck MCP server used during development for fast iteration
- The `/projects/mobi` page is the template shape to follow for `/projects/tcpa`

## Constraints

- **Deployment**: Must produce valid static export (`next build` with `output: 'export'`)
- **No regressions**: Existing pages must continue working

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fix on dev, merge to main | Preserves working site on main while fixing | ✓ Good |
| Mercury page excluded | User specified scope; mercury is separate work | ✓ Good |
| Inline diagram instead of side panel | User wants diagram as part of page flow, not prominent split view | ✓ Phase 5 |
| TCPA case study is NextJS-native, visualizer untouched | User wants a narrative case study page, not more work on the embedded app | ✓ v1.2 scoping |
| Reasoning-weighted narrative (30% problem / 70% stack) | User wants to showcase build-reasoning (MotherDuck Dives, MCP, DuckDB-WASM) more than domain context | ✓ v1.2 scoping |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 — milestone v1.2 started (TCPA Case Study)*
