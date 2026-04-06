# Phase 6: Content Expansion - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add richer technical sections to the Mobi deep dive page sourced from the Mobi repo's actual codebase and documentation. The existing 4 sections stay as-is; new sections are added to showcase additional engineering depth.

</domain>

<decisions>
## Implementation Decisions

### Content Scope
- **D-01:** Add 3 new technical sections: SAM/ML Pipeline, WebSocket Real-time Updates, and UI Design (icons + movable/resizable workspace windows)
- **D-02:** Existing 4 sections (Architecture, Docker, Async Queue, SQL) remain unchanged — no expansion
- **D-03:** Total section count is flexible — add as many new sections as the Mobi repo docs justify, prioritizing quality over count

### Content Depth & Format
- **D-04:** Depth is mixed — some sections go deeper than others based on how interesting/impressive the topic is
- **D-05:** Code snippets use a mix of real code from the Mobi repo (for impressive parts) and simplified/representative examples (for complex internals)

### Content Sourcing
- **D-06:** Source content from the Mobi repo available locally at `H:\mobi\metrostudio` — read actual source code, docs, and implementation details
- **D-07:** GitHub public repo at https://github.com/d-aniel-yi/mobi is also available as reference

### Visual Treatment
- **D-08:** Each new section uses whatever format best suits its content — some may be code-heavy, others may use bullet lists, callouts, or feature descriptions
- **D-09:** No screenshots or images — text and code snippets only, even for the UI design section
- **D-10:** Code blocks use the same dark theme pattern as existing sections (`bg-[#1e1e1e]` with syntax-colored spans)

### Claude's Discretion
- Exact section ordering among the new sections
- How to structure each section's narrative flow
- Which specific code snippets to highlight from the Mobi repo
- Whether to add sub-sections within longer topics

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Mobi page implementation
- `apps/web/src/app/projects/mobi/page.tsx` — Current page with 4 STEPS sections, code block styling patterns, and layout structure

### Mobi repo (source material)
- `H:\mobi\metrostudio` — Local clone of the Mobi repo; read source code, docs, and READMEs for content sourcing
- `https://github.com/d-aniel-yi/mobi` — Public GitHub repo for reference

### Content topics to research in the Mobi repo
- SAM/ML pipeline: Look for model loading, inference code, image processing pipeline
- WebSocket: Look for real-time update mechanisms, socket connections, event handling
- UI design: Look for icon design, workspace/window management, drag/resize implementation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `STEPS` array pattern: New sections follow the same `{ id, title, content: JSX }` structure
- Dark code block pattern: `bg-[#1e1e1e] text-gray-300 rounded-sm font-mono text-xs overflow-x-auto border border-gray-800`
- Tailwind styling: serif headings, light font paragraphs, `mt-4` spacing between paragraphs

### Established Patterns
- Content is defined as static JSX in the `STEPS` array — no dynamic data fetching
- Each section has a title and free-form JSX content body
- Code snippets are hand-styled with span elements for syntax highlighting (not a syntax highlighter library)

### Integration Points
- New sections are added to the `STEPS` array — the page maps over them to render
- No routing or navigation changes needed — all content is on the single `/projects/mobi` page

</code_context>

<specifics>
## Specific Ideas

- UI design section should cover icon design and the workspace where windows can all be moved and resized
- SAM section should explain the ML pipeline — how images flow through, model loading, inference
- WebSocket section should cover real-time updates — how the frontend knows when processing completes

</specifics>

<deferred>
## Deferred Ideas

- Section-specific diagrams that swap as you scroll (noted in Phase 5 deferred ideas)
- Screenshots/images of the Mobi app UI — decided against for now, text + code only

</deferred>

---

*Phase: 06-content-expansion*
*Context gathered: 2026-04-06*
