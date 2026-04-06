---
phase: 06-content-expansion
plan: 01
subsystem: content
tags: [mobi, content, static-export, jsx, tailwind]
dependency_graph:
  requires: []
  provides: [CONT-01]
  affects: [apps/web/src/app/projects/mobi/page.tsx]
tech_stack:
  added: []
  patterns: [STEPS-array-extension, dark-code-block-bg-1e1e1e, span-syntax-highlighting]
key_files:
  created: []
  modified:
    - apps/web/src/app/projects/mobi/page.tsx
decisions:
  - "Three new sections appended to STEPS array after existing 'sql' entry (index 4, 5, 6)"
  - "All code blocks sourced from Mobi repo files; simplified lightly for JSX readability"
  - "No new imports added; existing dark code block pattern reused verbatim"
metrics:
  duration_seconds: 141
  completed_date: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 1
---

# Phase 06 Plan 01: SAM/ML Pipeline, WebSocket, and Workspace UI Content Summary

Added three new technical sections to the Mobi deep dive page sourced from the Mobi repository codebase, expanding the STEPS array from 4 to 7 entries and satisfying CONT-01.

## What Was Built

Three new `STEPS` array entries appended to `apps/web/src/app/projects/mobi/page.tsx`:

| Section | id | Source File(s) |
|---------|-----|----------------|
| SAM/ML Pipeline | `sam-ml-pipeline` | `backend/app/services/task_queue/gpu_sam_tasks.py` |
| Real-time Notifications | `websocket-notifications` | `backend/app/core/connection_manager.py`, `backend/app/services/notification_service.py` |
| Workspace UI | `ui-design` | `frontend/src/core/components/layout/LayoutManager.tsx`, `frontend/src/core/components/layout/BottomBar.tsx` |

### New Sections Detail

**Section 5 — SAM/ML Pipeline** (`sam-ml-pipeline`)
- Opening: explains SAM for AI image segmentation, embedding caching in Redis
- Code block 1: `get_sam_predictor_on_gpu()` — global worker cache, registry pattern, `.to(device="cuda")`
- Narrative: embedding generation, `predictor.features`, Redis TTL, polling
- Code block 2: `generate_embedding_gpu_task` — Celery task decorator, cv2 BGR-to-RGB, `set_image`, `cache_image_embedding`

**Section 6 — Real-time Notifications** (`websocket-notifications`)
- Opening: WebSocket push vs polling; narrowly scoped to notification events only
- Code block 1: `ConnectionManager` class — `Dict[str, List[WebSocket]]`, `asyncio.Lock()`, `connect`, `send_personal`
- Narrative: persistence-first pattern (PostgreSQL then WebSocket fan-out)
- Code block 2: `create_and_dispatch` — `crud_notification.create_notification`, `manager.send_personal` with JSON payload

**Section 7 — Workspace UI** (`ui-design`)
- Opening: multi-panel tiling workspace delegated to `react-mosaic-component`
- Code block 1: `LayoutManager` component — `import { Mosaic }`, controlled wrapper, `minimumPaneSizePercentage: 1`
- Narrative: Material-UI icons, semantic mapping per panel type
- Code block 2: three MUI icon imports from `BottomBar.tsx`, usage example

## Code Snippets: Verbatim vs. Simplified

Per decision D-05 — mix of real and representative code:

| Section | Verbatim | Simplified | Notes |
|---------|----------|------------|-------|
| `get_sam_predictor_on_gpu` | Yes | Minor: removed try/except and logger.error, condensed path setup | Core model registry pattern and CUDA call are exact |
| `generate_embedding_gpu_task` | Yes | Minor: collapsed `from app.services import sam_service` import line | All API calls and data structure are exact |
| `ConnectionManager` | Yes | Minor: removed `pass` and comment in except block | Class structure, lock, and setdefault pattern are exact |
| `create_and_dispatch` | Yes | None | Verbatim match to source (lines 12-20) |
| `LayoutManager` | Yes | Minor: simplified generic constraint display | Core Mosaic props and `minimumPaneSizePercentage` are exact |
| `BottomBar` icon imports | Yes | None | Verbatim three-line import block |

## Final STEPS Array

| # | id | Title |
|---|-----|-------|
| 1 | `overview` | Microservices Architecture |
| 2 | `docker` | Containerization Strategy |
| 3 | `async` | Async Task Queue |
| 4 | `sql` | SQL Proficiency |
| 5 | `sam-ml-pipeline` | SAM/ML Pipeline |
| 6 | `websocket-notifications` | Real-time Notifications |
| 7 | `ui-design` | Workspace UI |

## Build Output Confirmation

```
npm run build (from apps/web) — exit code 0

/projects/mobi  5.88 kB  184 kB  (included in static export)

No TypeScript errors.
No "Failed to compile" in output.
Static export completed successfully.
```

## Verification Results

| Check | Result |
|-------|--------|
| 7 section IDs in STEPS array | PASS — overview, docker, async, sql, sam-ml-pipeline, websocket-notifications, ui-design |
| bg-[#1e1e1e] occurrences | PASS — 9 total (2 existing + 6 new, 2 per new section) |
| Build exits 0 | PASS |
| sam_model_registry in page.tsx | PASS |
| ConnectionManager in page.tsx | PASS |
| minimumPaneSizePercentage in page.tsx | PASS |
| Existing sections unchanged | PASS — "Mobi is a complex image analysis platform", "Dockerfile.backend", "process_image", "measurement_count" all present |
| No img src or Image import in new sections | PASS |

## Deviations from Plan

None — plan executed exactly as written. Task 2 (build verification) required no file modifications; the build passed on first attempt.

## Known Stubs

None. All new sections are fully wired with real code content sourced from the Mobi repository.

## Self-Check: PASSED

- `apps/web/src/app/projects/mobi/page.tsx` exists and modified: FOUND
- Commit `7bfdafa` (feat(06-01)): FOUND via `git log`
- Build output includes `/projects/mobi`: CONFIRMED
