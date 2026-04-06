# Phase 5: Diagram & Navigation - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Rework the Mobi architecture diagram layout and interactivity, and add a "View on GitHub" button. The diagram currently uses a 50/50 side panel split with full interactivity and a manual simulation button. This phase makes it narrower, non-interactive, auto-animating, and adds GitHub links.

</domain>

<decisions>
## Implementation Decisions

### Diagram Placement
- **D-01:** Keep the side panel layout (diagram left, content right) but reduce diagram width from 50% to 35%
- **D-02:** Diagram panel is sticky while its associated content section is in view — it stays fixed as you scroll the content, designed so future phases can swap diagrams per section
- **D-03:** On mobile (below `lg` breakpoint), hide the diagram entirely — mobile users see content sections directly

### Animation Style
- **D-04:** Remove the "Submit Job" simulation button and all manual simulation UI
- **D-05:** Auto-animate edges in a continuous loop — the sequential animation (frontend → backend → redis → worker → db) repeats indefinitely on page load
- **D-06:** Diagram edges animate with the existing sequential timing pattern (staggered activation), looping back to the start after the sequence completes

### Interactivity
- **D-07:** Disable all user interaction — no zoom, pan, or node dragging (remove `onNodesChange`/`onEdgesChange` handlers, set `nodesDraggable={false}`, `nodesConnectable={false}`, `zoomOnScroll={false}`, `panOnDrag={false}`, etc.)

### GitHub Button
- **D-08:** "View on GitHub" button appears in two locations: (1) in the page header area near the title, and (2) at the end of the content sections as a CTA
- **D-09:** Button links to https://github.com/d-aniel-yi/mobi

### Claude's Discretion
- Exact animation timing/intervals for the continuous loop
- Button styling (consistent with page design language)
- How to handle the ReactFlow attribution badge positioning with the narrower panel

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Mobi page implementation
- `apps/web/src/app/projects/mobi/page.tsx` — Current full implementation: nodes, edges, simulation logic, layout, content sections

### ReactFlow library
- `@xyflow/react` package — Used for the architecture diagram; check docs for `fitView`, `proOptions`, interaction props

No external specs — requirements fully captured in decisions above and REQUIREMENTS.md (DIAG-01, DIAG-02, DIAG-03, NAV-01)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `initialNodes` and `initialEdges` arrays: Node positions and edge definitions can be reused as-is
- `runSimulation` callback: Animation sequence logic (staggered timeouts) can be adapted for continuous loop
- `lucide-react` already imported for icons — can use for GitHub button icon

### Established Patterns
- Page uses `"use client"` directive (required for ReactFlow)
- Content sections defined as `STEPS` array with id, title, and JSX content
- Styling uses Tailwind CSS with a neutral/minimal aesthetic (gray-50 backgrounds, serif headings, mono labels)

### Integration Points
- Layout is self-contained in a single page component — no shared layout dependencies
- `@xyflow/react` and its CSS are already imported

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

- Section-specific diagrams that swap as you scroll to different content areas — belongs in a future phase when more sections/diagrams are added (Phase 6 or later)

</deferred>

---

*Phase: 05-diagram-navigation*
*Context gathered: 2026-04-06*
