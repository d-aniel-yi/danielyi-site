# Resume Site — Bug Fix & Merge

## What This Is

A personal resume/portfolio site built with Next.js and deployed to S3 via CDK. New pages were added on the `dev` branch (project deep dives, tech demos, portfolio) but they broke the S3 static export build. The changes were rolled back on `main` to keep the site live. This project is about diagnosing and fixing all build errors on `dev` and merging the working pages back into `main`.

## Core Value

The new pages build successfully as a static export and deploy to S3 without errors.

## Requirements

### Validated

- ✓ Existing site builds and deploys from `main` — existing
- ✓ Next.js static export to S3 via CDK — existing

### Active

- [ ] Projects listing page renders and builds for static export
- [ ] FSBO deep dive page (`/projects/fsbo`) renders and builds for static export
- [ ] Mobi deep dive page (`/projects/mobi`) renders and builds for static export
- [ ] Portfolio deep dive page (`/projects/portfolio`) renders and builds for static export
- [ ] Tech demos page (`/technical`) updates render and build for static export
- [ ] All new pages pass linting
- [ ] `dev` branch merged into `main` cleanly

### Out of Scope

- Mercury page and components — not in scope for this fix
- New features or design changes — fix what's there, don't add to it
- Infrastructure/CDK changes — deployment pipeline is working, just the build is broken

## Context

- Site is a Next.js app in `apps/web/` with CDK infrastructure in `infra/`
- Deployed as static export to S3 (likely `output: 'export'` in next.config)
- `dev` branch has ~3800 lines of additions across 34 files
- Key new files: project deep dive pages, updated projects listing, tech demos updates
- Some components were deleted (ProjectCard, TargetSection for halborn/softstack)
- The build broke when these changes were pushed — likely SSR-only APIs used in static context, missing dependencies, or import errors

## Constraints

- **Deployment**: Must produce valid static export (`next build` with `output: 'export'`)
- **Branch strategy**: Fixes go on `dev`, then merge to `main`
- **No regressions**: Existing pages on `main` must continue working after merge

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fix on dev, merge to main | Preserves working site on main while fixing | — Pending |
| Mercury page excluded | User specified scope; mercury is separate work | — Pending |

---
*Last updated: 2026-02-10 after initialization*
