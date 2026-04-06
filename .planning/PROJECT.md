# Resume Site

## What This Is

A personal resume/portfolio site built with Next.js and deployed to S3 via CDK. Features project deep dive pages (FSBO, Mobi, Portfolio), tech demos, and a projects listing. The site builds as a static export and deploys via CDK.

## Core Value

Showcase technical work through polished, detailed project deep dives that demonstrate real engineering depth.

## Current Milestone: v1.1 Mobi Deep Dive Refinement

**Goal:** Improve the Mobi tech deep dive page layout, interactivity, and content depth.

**Target features:**
- Rework diagram: inline into scrolling page, disable zoom/pan, remove simulation button, auto-animate
- Add "View on GitHub" button (repo is now public)
- Expand content sections with more technical detail from Mobi's documentation

## Requirements

### Validated

- ✓ Existing site builds and deploys from `main` — v1.0
- ✓ Next.js static export to S3 via CDK — v1.0
- ✓ Projects listing page renders and builds — v1.0
- ✓ FSBO deep dive page renders and builds — v1.0
- ✓ Mobi deep dive page renders and builds — v1.0
- ✓ Portfolio deep dive page renders and builds — v1.0
- ✓ Tech demos page renders and builds — v1.0

### Active

- [ ] Mobi diagram is inline in the page flow (not a fixed side panel)
- [ ] Mobi diagram is non-interactive (no zoom/pan)
- [ ] Mobi diagram auto-animates on load (no simulation button)
- [ ] "View on GitHub" button links to https://github.com/d-aniel-yi/mobi
- [ ] Expanded technical content sourced from Mobi repo documentation

### Out of Scope

- Mercury page and components — not in scope
- Other deep dive pages — only Mobi is being updated
- Infrastructure/CDK changes — deployment pipeline is working

## Context

- Site is a Next.js app in `apps/web/` with CDK infrastructure in `infra/`
- Deployed as static export to S3 (`output: 'export'` in next.config)
- Mobi page uses `@xyflow/react` for the architecture diagram
- Mobi repo (https://github.com/d-aniel-yi/mobi) has extensive technical documentation that can inform deeper content
- Current page has 4 sections: Microservices Architecture, Containerization Strategy, Async Task Queue, SQL Proficiency

## Constraints

- **Deployment**: Must produce valid static export (`next build` with `output: 'export'`)
- **No regressions**: Existing pages must continue working

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fix on dev, merge to main | Preserves working site on main while fixing | ✓ Good |
| Mercury page excluded | User specified scope; mercury is separate work | ✓ Good |
| Inline diagram instead of side panel | User wants diagram as part of page flow, not prominent split view | — Pending |

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
*Last updated: 2026-04-06 after milestone v1.1 started*
