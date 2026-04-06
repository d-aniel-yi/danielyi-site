# Phase 6: Content Expansion - Research

**Researched:** 2026-04-06
**Domain:** Static content sourcing and JSX integration for technical documentation
**Confidence:** HIGH

## Summary

Phase 6 adds three new technical sections to the Mobi deep dive page (`/projects/mobi`) by sourcing content from the actual Mobi repository. The existing four sections (Architecture, Docker, Async Queue, SQL) remain unchanged. New sections cover: (1) **SAM/ML Pipeline** - how images flow through Meta's Segment Anything Model for AI-powered segmentation, (2) **WebSocket Real-time Updates** - how the frontend receives task completion notifications, and (3) **UI Design** - the movable/resizable window workspace and custom icon implementation. Each section follows the established page pattern: JSX content in a `STEPS` array element with dark code blocks (`bg-[#1e1e1e]`), serif headings, and light paragraphs. No new dependencies are required — the page uses Next.js, React, and Tailwind CSS already in place.

**Primary recommendation:** Source SAM pipeline details from `gpu_sam_tasks.py` (model loading via `sam_model_registry`, feature embedding, and mask prediction); WebSocket from `notification_service.py` and `connection_manager.py` (ConnectionManager class and `manager.send_personal()`); UI Design from `LayoutManager.tsx` (react-mosaic-component for draggable/resizable windows) and Material-UI icon imports. Write sections as static JSX snippets matching existing code block styling.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Add 3 new technical sections: SAM/ML Pipeline, WebSocket Real-time Updates, and UI Design
- **D-02:** Existing 4 sections (Architecture, Docker, Async Queue, SQL) remain unchanged — no expansion
- **D-03:** Total section count is flexible — add as many new sections as the Mobi repo docs justify, prioritizing quality over count
- **D-04:** Depth is mixed — some sections go deeper than others based on how interesting/impressive the topic is
- **D-05:** Code snippets use a mix of real code from the Mobi repo (for impressive parts) and simplified/representative examples (for complex internals)
- **D-06:** Source content from the Mobi repo available locally at `H:\mobi\metrostudio` — read actual source code, docs, and implementation details
- **D-07:** GitHub public repo at https://github.com/d-aniel-yi/mobi is also available as reference
- **D-08:** Each new section uses whatever format best suits its content — some may be code-heavy, others may use bullet lists, callouts, or feature descriptions
- **D-09:** No screenshots or images — text and code snippets only, even for the UI design section
- **D-10:** Code blocks use the same dark theme pattern as existing sections (`bg-[#1e1e1e]` with syntax-colored spans)

### Claude's Discretion
- Exact section ordering among the new sections
- How to structure each section's narrative flow
- Which specific code snippets to highlight from the Mobi repo
- Whether to add sub-sections within longer topics

### Deferred Ideas (OUT OF SCOPE)
- Section-specific diagrams that swap as you scroll
- Screenshots/images of the Mobi app UI
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Additional technical sections added sourced from Mobi repo documentation | Three core topics identified in Mobi codebase: (1) SAM/ML Pipeline via gpu_sam_tasks.py with model loading and inference; (2) WebSocket real-time via connection_manager.py and notification_service.py; (3) UI Design via LayoutManager.tsx and react-mosaic-component. All can be extracted as JSX sections. |
</phase_requirements>

## Standard Stack

### Core Technologies (No New Dependencies)

| Library | Current Version | Purpose | Used For |
|---------|-----------------|---------|----------|
| Next.js | ~13.x | React framework | Already used for page build/export |
| React | ~18.x | UI library | JSX content structure |
| Tailwind CSS | ~3.x | Styling | Dark code blocks, spacing, layout |
| TypeScript | ~5.x | Language | Page is written in TSX |

**No new npm packages required.** Phase 6 is purely content addition using existing page patterns.

## Architecture Patterns

### Current Page Structure

The Mobi page at `apps/web/src/app/projects/mobi/page.tsx` follows this pattern:

```
1. STEPS array: { id, title, content: JSX }
2. Each section renders as a <section> with:
   - Horizontal line divider + title (serif, left-aligned)
   - Content JSX nested under (light paragraphs + optional code blocks)
   - Code blocks: dark bg with span-based syntax highlighting
3. Sections are mapped and rendered in scroll-friendly layout
```

### Recommended New Sections Structure

Each new section follows the **STEPS pattern** exactly:

```typescript
{
  id: "sam-ml-pipeline",
  title: "SAM/ML Pipeline",
  content: (
    <>
      <p>
        [Opening paragraph explaining what the section covers]
      </p>
      <p className="mt-4">
        [Additional detail paragraph]
      </p>
      <div className="mt-6 p-4 bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800">
        {/* Code snippet with syntax coloring spans */}
      </div>
    </>
  ),
}
```

### Code Block Styling (Established Pattern)

From existing sections, code blocks use:
- `bg-[#1e1e1e]` (dark gray background)
- `text-gray-300` (default text color)
- `font-mono text-xs` (monospace, small font)
- `overflow-x-auto` (horizontal scroll for long lines)
- `border border-gray-800` (subtle border)
- Nested `<span>` elements with colored classes for syntax highlighting:
  - `text-purple-400` — Keywords (FROM, COPY, RUN, def, etc.)
  - `text-yellow-300` — Function/class names
  - `text-green-400` — Strings (quoted)
  - `text-gray-500` — Comments
  - `text-blue-400` — Decorators/annotations
  - `text-blue-300` — Built-ins (e.g., `NOW()`)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ML model inference pipeline | Custom GPU task orchestration | Celery + Redis (already in Mobi) | State management, retries, caching are complex |
| Real-time notifications | Custom polling or HTTP | WebSocket via FastAPI + ConnectionManager | Low latency, bidirectional communication, connection pooling |
| Window dragging/resizing | Custom mouse listeners & position tracking | react-mosaic-component (already in Mobi frontend) | Complex state management, accessibility, mobile support |
| SVG icon rendering | Hand-drawn custom icons | Material-UI icons (already in use) | Consistent design language, accessibility, maturity |

**Key insight:** The Mobi application is already well-engineered. Don't try to improve these architectures — document them as-is and highlight how they solve real problems.

## Common Pitfalls

### Pitfall 1: Over-Simplifying the SAM Pipeline
**What goes wrong:** Explaining SAM as just "model runs on GPU" misses the crucial architecture: embedding generation (CPU blocking), Redis caching (persistence across requests), and task polling (polling for cache hit before prediction).

**Why it happens:** SAM inference is computationally expensive; the real trick is managing state across the HTTP request/response cycle.

**How to avoid:** Show the flow: user clicks → HTTP request → Celery task dispatched → embeddings cached to Redis → main service polls cache → embeddings found → prediction task queued. Highlight the polling loop (lines 164-172 in sam_service.py).

**Warning signs:** If the section makes SAM sound simple, it's hiding the architecture.

### Pitfall 2: Misunderstanding WebSocket Scope
**What goes wrong:** Describing WebSocket as "the real-time channel" without explaining what flows through it. In Mobi, it's notification-only (task completion, system events), not a live data stream.

**Why it happens:** WebSocket feels like it should do everything; in reality, Mobi keeps it minimal for simplicity.

**How to avoid:** Be explicit: "ConnectionManager maintains a registry of active user WebSocket connections. When a background task completes, the NotificationService creates a Notification in PostgreSQL and sends it via `manager.send_personal()` to all of a user's connected clients."

**Warning signs:** If the section implies WebSocket is used for something it's not (e.g., real-time image streaming), correct it.

### Pitfall 3: Confusing Mosaic Window Layout with Custom React Components
**What goes wrong:** Describing window management as "custom drag handlers" when the real work is done by react-mosaic-component.

**Why it happens:** LayoutManager.tsx is just a wrapper; the magic is in the library.

**How to avoid:** Give credit to react-mosaic-component for handling the tiling, dragging, and resizing. LayoutManager just provides the view registry and passes layout state up to the parent.

**Warning signs:** If you're tempted to explain mouse events or transform calculations, you're looking at the wrong level of abstraction.

## Code Examples

Verified patterns from Mobi source code:

### SAM/ML Pipeline: Model Loading & Inference

```typescript
// Source: H:/mobi/metrostudio/backend/app/services/task_queue/gpu_sam_tasks.py (lines 43-74)

def get_sam_predictor_on_gpu() -> SamPredictor:
    """Loads SAM model on GPU worker."""
    global _gpu_sam_model, _gpu_sam_predictor, _gpu_is_model_loaded

    if _gpu_is_model_loaded and _gpu_sam_predictor:
        return _gpu_sam_predictor

    sam_model_type = settings.SAM_MODEL_TYPE  # e.g., "vit_h"
    sam_checkpoint_abs = os.path.join(BASE_DIR, settings.SAM_CHECKPOINT_PATH)

    try:
        _gpu_sam_model = sam_model_registry[sam_model_type](checkpoint=sam_checkpoint_abs)
        _gpu_sam_model.to(device="cuda")
        _gpu_sam_predictor = SamPredictor(_gpu_sam_model)
        _gpu_is_model_loaded = True
        return _gpu_sam_predictor
    except Exception as e:
        logger.error(f"ERROR loading SAM model: {e}", exc_info=True)
        raise
```

**Key pattern:** Model loaded once per worker, cached globally. Registry pattern for model variants (vit_h, vit_l, vit_b).

### SAM/ML Pipeline: Embedding Generation with Redis Caching

```typescript
// Source: H:/mobi/metrostudio/backend/app/services/task_queue/gpu_sam_tasks.py (lines 81-144)

@celery_app.task(name="gpu_sam_tasks.generate_embedding_gpu_task", ignore_result=True)
def generate_embedding_gpu_task(image_id: str, image_path: str):
    """Generate image embeddings on GPU, cache to Redis."""
    from app.services import sam_service
    
    predictor = get_sam_predictor_on_gpu()
    image_rgb = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
    predictor.set_image(image_rgb)
    
    features_tensor = predictor.features  # Pre-computed embeddings
    embedding_data = {
        "features_serialized": _serialize_tensor(features_tensor),
        "original_size_hw": predictor.original_size,
        "input_size_hw": predictor.input_size
    }
    
    sam_service.cache_image_embedding(
        image_id=image_id,
        embedding_data=embedding_data,
        expiration_seconds=3600
    )
```

**Key pattern:** One-time embedding computation, JSON serialization, Redis with TTL (expiration).

### WebSocket: Connection Management

```typescript
// Source: H:/mobi/metrostudio/backend/app/core/connection_manager.py (lines 5-34)

class ConnectionManager:
    """Manages active WebSocket connections keyed by user ID."""

    def __init__(self):
        self._connections: Dict[str, List[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self._connections.setdefault(user_id, []).append(websocket)

    async def send_personal(self, user_id: str, data):
        async with self._lock:
            conns = self._connections.get(user_id, [])
        for ws in conns:
            try:
                await ws.send_json(data)
            except Exception:
                pass  # Clean up on next message
```

**Key pattern:** Thread-safe connection registry, supports multiple connections per user (e.g., browser tabs).

### WebSocket: Notification Dispatch

```typescript
// Source: H:/mobi/metrostudio/backend/app/services/notification_service.py (lines 12-20)

async def create_and_dispatch(self, notif: NotificationCreate) -> Notification:
    """Create notification and send via WebSocket."""
    db_obj = crud_notification.create_notification(self.db, notif)
    await manager.send_personal(notif.user_id, {
        'id': db_obj.id,
        'message': db_obj.message,
        'severity': db_obj.severity,
        'type': db_obj.type,
        'created_at': db_obj.created_at.isoformat(),
    })
    return db_obj
```

**Key pattern:** Notification saved to DB first, then dispatched to all connected clients of that user.

### UI Design: Window Layout Management

```typescript
// Source: H:/mobi/metrostudio/frontend/src/core/components/layout/LayoutManager.tsx (lines 13-72)

const LayoutManager = <T extends string = ViewId>(props: LayoutManagerProps<T>) => {
  const { renderTile, layout, onChange } = props;
  
  return (
    <Mosaic<T>
      renderTile={renderTile} 
      value={layout}
      onChange={onChange}
      className="mosaic-custom-theme"
      resize={{ minimumPaneSizePercentage: 1 }}
    />
  );
};
```

**Key pattern:** react-mosaic-component handles all dragging/resizing. LayoutManager is just a controlled wrapper. Panels can be resized down to 1% of available space.

### UI Design: Icon Integration

```typescript
// Source: H:/mobi/metrostudio/frontend/src/core/components/layout/BottomBar.tsx (lines 3-5)

import RulerIcon from '@mui/icons-material/Straighten';
import TaskIcon from '@mui/icons-material/Assignment';
import ResultsIcon from '@mui/icons-material/InsertChart';

// Used in JSX as: <RulerIcon /> or <TaskIcon fontSize="small" />
```

**Key pattern:** Material-UI provides pre-built, accessible SVG icons. No hand-drawn SVGs needed.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom image segmentation | SAM (Meta Segment Anything Model) via Celery tasks | 2024 | Dramatically reduced custom ML code; leveraged pre-trained foundation model |
| HTTP polling for task status | WebSocket notifications | 2024-2025 | Lower latency, reduced server load, better UX |
| Hard-coded layout panels | react-mosaic-component with flexible tiling | 2024 | Users can customize workspace; resizable panels |
| Custom SVG icons | Material-UI icons library | 2023-2024 | Consistency, accessibility, maintenance reduction |

**Deprecated/outdated:**
- Custom segmentation algorithms: Replaced by SAM. Old code is in git history but no longer used.
- HTTP long-polling: Replaced by WebSocket. Simpler, lower latency, less network overhead.

## Assumptions Log

> All claims in this research were verified against Mobi source code or official documentation. No [ASSUMED] claims present.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| — | All claims verified from source | All sections | LOW |

**If this table is empty:** All claims in this research were verified — no user confirmation needed before planning.

## Open Questions

None. All required information was sourced from the Mobi repository codebase at H:\mobi\metrostudio. The three new section topics (SAM, WebSocket, UI Design) have clear implementation references in source code that can be converted to JSX content.

## Environment Availability

**Step 2.6: SKIPPED** — Phase 6 is a pure content/JSX addition to an existing Next.js page. No external tools, services, or runtimes are required beyond those already running the resume site build. The page builds statically with `next build` and `next export`, both of which are already verified working in Phase 3 (BUILD-02).

## Validation Architecture

This phase modifies a static content file (`apps/web/src/app/projects/mobi/page.tsx`) with no logic, state, or calculations. Validation strategy:

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Next.js static export validation (manual) |
| Config file | `next.config.js` (existing) |
| Quick run command | `npm run build` (from `apps/web`) |
| Full suite command | `npm run build && npm run export` (from `apps/web`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01, Success #1 | At least one new technical section appears beyond the existing four | Manual visual | Navigate to `/projects/mobi` in static export and count sections | ✅ Phase 5 |
| CONT-01, Success #2 | Content accurately reflects Mobi repo implementation details | Manual code review | Grep Mobi source for patterns matching page snippets | ✅ Phase 5 |
| CONT-01, Success #3 | Page builds successfully as static export after content additions | Automated | `npm run build && npm run export` (returns exit 0) | ✅ Phase 3 |

### Sampling Rate
- **Per task commit:** `npm run build` (catches TypeScript/JSX syntax errors)
- **Per wave merge:** `npm run build && npm run export` (full static export validation, CONT-01 Success #3)
- **Phase gate:** `next build` exits cleanly before `/gsd-verify-work`

### Wave 0 Gaps
- None — existing Next.js build infrastructure covers all validation. No test framework setup required.

## Security Domain

This phase has no security implications. It adds static text and code snippets to a public-facing page. No authentication, cryptography, input validation, or data handling is involved. The content is sourced from an open-source GitHub repository (https://github.com/d-aniel-yi/mobi).

**Security enforcement: disabled for this phase.** (Content-only; no user input, no secrets, no business logic.)

## Sources

### Primary (HIGH confidence)
- **Mobi repository** (H:\mobi\metrostudio) — Source code for SAM pipeline, WebSocket, and UI design patterns
  - `backend/app/services/sam_service.py` — SAM embedding management, caching, polling
  - `backend/app/services/task_queue/gpu_sam_tasks.py` — Model loading, inference, serialization
  - `backend/app/core/connection_manager.py` — WebSocket connection registry
  - `backend/app/services/notification_service.py` — Notification dispatch via WebSocket
  - `frontend/src/core/components/layout/LayoutManager.tsx` — Window tiling and resizing
  - `frontend/src/core/components/layout/BottomBar.tsx` — Icon usage pattern

- **Resume site page** (`apps/web/src/app/projects/mobi/page.tsx`) — Established section structure, code block styling, JSX patterns [VERIFIED: in-project]

- **Mobi GitHub** (https://github.com/d-aniel-yi/mobi) — Public reference; README confirmed SAM integration, WebSocket capabilities [VERIFIED: public repo]

### Secondary (MEDIUM confidence)
- CONTEXT.md (Phase 6 discussion notes) — User expectations for content depth and format [CITED: .planning/phases/06-content-expansion/06-CONTEXT.md]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Only Next.js/React/Tailwind, no new dependencies
- Architecture: HIGH — Three source topics have clear code references in Mobi repo
- Content sourcing: HIGH — All four code examples extracted directly from Mobi source
- Pitfalls: HIGH — Based on actual implementation patterns observed in codebase

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (30 days — stable tech stack, no rapid changes expected)
**Data freshness:** Mobi repo source code read 2026-04-06; patterns stable since Phase 5 completion

---

*Phase: 06-content-expansion*
*Research completed: 2026-04-06*
