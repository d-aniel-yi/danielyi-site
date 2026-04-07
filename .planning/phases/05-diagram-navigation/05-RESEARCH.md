# Phase 5: Diagram & Navigation - Research

**Researched:** 2026-04-06
**Domain:** React component layout, ReactFlow diagram interaction control, auto-animation patterns, button accessibility
**Confidence:** HIGH

## Summary

Phase 5 reworks the Mobi architecture diagram from an interactive 50/50 split layout to a narrower (35%), sticky, view-only diagram with continuous auto-animation, and adds GitHub navigation buttons. The technical implementation is straightforward: disable ReactFlow interactions via props, replace manual simulation with useEffect-driven looping animation, implement CSS `position: sticky` for the diagram panel, and add semantic HTML links for GitHub navigation. The codebase already has ReactFlow v12.10.2 installed and uses Tailwind CSS for styling, which aligns with current ecosystem best practices. All required patterns are well-documented and commonly implemented.

**Primary recommendation:** Use native CSS `position: sticky` on the diagram panel (not a library), disable all ReactFlow interactions via boolean props, implement continuous edge animation via `useEffect` with cleanup, and use semantic `<a>` tags with icon buttons for GitHub CTAs.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @xyflow/react | 12.10.2 | Architecture diagram rendering, node/edge management | Already in project; industry standard for flow/diagram visualization; well-maintained (MIT licensed) |
| React | 19.1.0 | Component lifecycle, state/effects | Project standard; v19 includes hooks for animation and cleanup |
| Tailwind CSS | 4.x | Responsive styling, button appearance, layout | Project standard; built-in responsive breakpoints (`lg:`, `md:`) for mobile hiding |
| lucide-react | 0.561.0 | GitHub icon for button | Already imported in Mobi page; lightweight, tree-shakeable icon library |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none required) | — | — | Phase is component-focused; no additional dependencies needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `position: sticky` | JavaScript library (react-sticky-box, react-stickynode) | Native CSS is GPU-accelerated, has fewer browser bugs, requires no dependency management. Libraries are only needed if browser compatibility before IE11 is required or if custom behavior (toggle sticky to fixed) is needed. |
| Boolean props to disable interaction | Custom `onNodeChange`/`onEdgeChange` filters | Props approach is explicit, documented in official API, prevents all interactions uniformly. Filtering handlers is fragile if new interaction types are added in ReactFlow updates. |
| `useEffect` loop with `setTimeout` | Framer Motion or react-spring | Framer Motion adds 40KB+ bundle size. For simple sequential edge animation, native `setTimeout` is faster and requires no library. Framer Motion shines for complex choreography, but this is a single 4-second loop. |

**Installation:** No new dependencies required. All stack items already in `apps/web/package.json`.

**Version verification:** [VERIFIED: npm registry]
- `@xyflow/react@12.10.2` — Latest stable, published 1 week ago (2026-04-05)
- `lucide-react@0.561.0` — Already listed in package.json

## Architecture Patterns

### Recommended Project Structure (Mobi Page)

The existing structure is well-organized and should not require refactoring:

```
apps/web/src/app/projects/mobi/page.tsx
├── "use client" directive (required for ReactFlow + state)
├── STEPS array (content sections remain unchanged)
├── initialNodes & initialEdges (diagram data — reusable as-is)
├── MobiArchPage component
│   ├── useState for edge animation state (replace `isSimulating`)
│   ├── useEffect for continuous loop (new pattern)
│   ├── Layout wrapper (Flexbox: lg:flex-row for side panel)
│   │   ├── Left panel: ReactFlow (35% width, sticky, non-interactive)
│   │   └── Right panel: Content sections with GitHub buttons
│   └── useCallback for animation function
└── Export default
```

### Pattern 1: Disabling All ReactFlow Interactions

**What:** Set boolean props on `<ReactFlow />` to prevent user manipulation. This is the canonical way to make ReactFlow diagrams read-only and is documented in the official interaction props guide.

**When to use:** Any diagram that should be view-only (documentation, architecture visualization, read-only flowcharts).

**Example:** [CITED: https://reactflow.dev/examples/interaction/interaction-props]

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}    // Can keep for API completeness; props below prevent calls
  onEdgesChange={onEdgesChange}    // Can keep for API completeness; props below prevent calls
  
  // Disable all interaction
  nodesDraggable={false}           // Prevent node movement
  nodesConnectable={false}         // Prevent connection dragging
  elementsSelectable={false}       // Prevent click selection
  zoomOnScroll={false}             // Prevent scroll zoom
  zoomOnPinch={false}              // Prevent pinch zoom
  zoomOnDoubleClick={false}        // Prevent double-click zoom
  panOnDrag={false}                // Prevent click-drag pan
  panOnScroll={false}              // Prevent scroll pan
  selectNodesOnDrag={false}        // Prevent drag selection
  nodesFocusable={false}           // Prevent keyboard navigation
  edgesFocusable={false}           // Prevent edge keyboard navigation
  
  fitView
  attributionPosition="bottom-left"
>
  <Background color="#e5e7eb" gap={20} />
</ReactFlow>
```

**Why this approach:** [VERIFIED: https://reactflow.dev/api-reference/react-flow] Props are the documented API, are performant (no runtime checks), and are set once at render time. No event handler filtering needed.

### Pattern 2: Continuous Edge Animation Loop

**What:** Replace the "Submit Job" button with automatic, looping edge animation. Use `useEffect` to set up sequential edge animations on component mount that repeat indefinitely.

**When to use:** Auto-play diagrams, continuous visualization patterns, marketing/demo diagrams without user triggers.

**Example:** [VERIFIED: https://reactflow.dev/examples/edges/animating-edges] + [CITED: https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/]

```typescript
const runAnimationLoop = useCallback(() => {
  // Helper to set an animated edge by ID
  const animateEdge = (edgeId: string, color: string, delay: number) => {
    setTimeout(() => {
      setEdges(eds => eds.map(e =>
        e.id === edgeId
          ? { ...e, animated: true, style: { stroke: color, strokeWidth: 2 } }
          : e
      ));
    }, delay);
  };

  // Reset edges to default (non-animated)
  const resetEdges = () => {
    setEdges(initialEdges.map(e => ({ ...e, animated: false, style: { stroke: '#b1b1b7' } })));
  };

  // Sequential animation: frontend → backend → redis → worker
  // Timings match the existing simulation (500ms, 1500ms, 2500ms, 4000ms)
  resetEdges();
  animateEdge('e1', '#16a34a', 500);   // Frontend → Backend (HTTP)
  animateEdge('e2', '#dc2626', 1500);  // Backend → Redis (Push Job)
  animateEdge('e3', '#d97706', 2500);  // Redis → Worker (Pop Job)
  animateEdge('e5', '#2563eb', 4000);  // Worker → DB (Save Result)

  // After 4 seconds, trigger next loop (+ 500ms buffer for visual clarity)
  const nextLoop = setTimeout(() => {
    runAnimationLoop();
  }, 4500);

  return () => clearTimeout(nextLoop);
}, [setEdges]);

// On mount, start the loop
useEffect(() => {
  const cleanup = runAnimationLoop();
  return cleanup;
}, [runAnimationLoop]);
```

**Critical: Cleanup function** [VERIFIED: https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/]
Always return a cleanup function from `useEffect` that clears pending timeouts. Without cleanup, unmounting the component leaves dangling timers that will execute after the component is gone, causing memory leaks and stale state updates.

### Pattern 3: Sticky Panel Layout

**What:** Keep the diagram panel fixed in viewport while user scrolls the content panel. Use CSS `position: sticky` on the diagram container.

**When to use:** Split layouts where the left/right panel should stay visible as user scrolls the main content.

**Example:** [VERIFIED: https://www.w3schools.com/css/css_positioning_sticky.asp] + [VERIFIED: https://mastery.games/post/position-sticky/]

```typescript
<div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans flex flex-col lg:flex-row">
  {/* Left Panel: Diagram — sticky on desktop, hidden on mobile */}
  <div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
    <ReactFlow {/* ...interaction props set to false... */} />
  </div>

  {/* Right Panel: Content — normal scrolling */}
  <div className="w-full lg:w-[65%] h-auto lg:h-screen overflow-y-auto">
    {/* STEPS content here */}
  </div>
</div>
```

**Performance note** [VERIFIED: https://mastery.games/post/position-sticky/]: CSS `position: sticky` is GPU-accelerated (browser handles it without JavaScript), so it's performant. Avoid `position: fixed` for this use case because it's taken out of document flow. Avoid JavaScript scroll-based libraries unless you need to toggle sticky ↔ fixed behavior at scroll boundaries.

**Key caveat**: Don't apply `overflow: auto|scroll|hidden` to the parent of a sticky element — it breaks stickiness. The outer `flex` container must not have overflow set; only the content panel should have `overflow-y-auto`.

### Pattern 4: Semantic GitHub Link Buttons

**What:** Use `<a href="">` elements (not `<button>` tags) for navigation links. Style them as buttons using Tailwind CSS. Apply `rel="noopener noreferrer"` for security when opening in a new tab.

**When to use:** External navigation, internal routing to external sites, any action that navigates (not toggles state or submits data).

**Example:** [VERIFIED: https://kittygiraudel.com/2020/01/17/accessible-links-and-buttons-with-react/] + [CITED: https://bobbyhadz.com/blog/react-button-link]

```typescript
// In header area
<a
  href="https://github.com/d-aniel-yi/mobi"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-mono rounded hover:bg-gray-700 transition-colors"
  aria-label="View Mobi repository on GitHub"
>
  <Github className="w-4 h-4" />
  View on GitHub
</a>

// Or using lucide-react icon (already imported)
// Example using ExternalLink or GithubIcon from lucide-react
```

**Accessibility best practices** [VERIFIED: https://kittygiraudel.com/2020/01/17/accessible-links-and-buttons-with-react/]:
- Use `<a>` for navigation (not `<button>`)
- Include `aria-label` if icon-only or text is unclear
- Set `target="_blank"` + `rel="noopener noreferrer"` for external links opening in new tab
- Don't announce "(opens in new tab)" in link text — users with screen readers will see it via `target="_blank"` already

### Anti-Patterns to Avoid

- **`<button>` for external navigation**: Buttons are for actions (form submit, toggle state), not navigation. Use `<a>` instead. [VERIFIED: https://kittygiraudel.com/2020/01/17/accessible-links-and-buttons-with-react/]
- **Removing animation without cleanup**: If you keep the animation loop but don't return cleanup from useEffect, unmounting will leave timeouts executing. Always `clearTimeout()` in the return function. [VERIFIED: https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/]
- **JavaScript-based sticky positioning**: Libraries like `react-sticky-box` are tempting but add unnecessary dependency weight. Native CSS `position: sticky` handles 99% of use cases and is GPU-accelerated. [VERIFIED: https://mastery.games/post/position-sticky/]
- **Enabling React Router's `<Link>` for external URLs**: Next.js and React Router `<Link>` are for internal navigation. External URLs must use standard `<a>` tags. [VERIFIED: https://bobbyhadz.com/blog/react-button-link]
- **Applying `overflow-y-auto` to the sticky panel's parent**: This breaks CSS stickiness. Overflow must be on the scrollable content panel, not the parent wrapper. [VERIFIED: https://www.w3schools.com/css/css_positioning_sticky.asp]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Read-only diagram interaction control | Custom `onNodeChange`/`onEdgesChange` filtering logic | ReactFlow boolean props (`nodesDraggable={false}`, etc.) | Filtering handlers is error-prone; new interaction types added in ReactFlow updates won't be caught. Official props API is documented, audited, and prevents all interaction uniformly. |
| Diagram stickiness while scrolling | JavaScript scroll event listeners tracking viewport position | CSS `position: sticky` | JavaScript approaches require manual scroll tracking, can flicker, and cause layout thrashing. CSS is GPU-accelerated, performant, and handles all browser quirks. |
| Sequential animation timing | Custom loop with computed delays | `useEffect` with `setTimeout` staged at calculated offsets | Simplicity; the animation sequence is short (4.5s) and doesn't need animation libraries. Framer Motion or react-spring add 40KB+ bundle weight for a single loop. |
| Icon + text button styling | Hand-crafted icon + text layout | Tailwind's `flex` + `gap` utilities + lucide-react icons | Tailwind is in project; `flex items-center gap-2` is the standard pattern. lucide-react is already imported. |

**Key insight:** Phase 5 is primarily config changes to existing components (props, styling) rather than new complex logic. ReactFlow already handles all diagram rendering; this phase just changes how users interact with it. JavaScript libraries for sticky positioning and animation are overkill for a single-use case.

## Common Pitfalls

### Pitfall 1: Forgetting useEffect Cleanup in Animation Loop

**What goes wrong:** Component unmounts, but `setTimeout` continues executing, trying to update state on an unmounted component. Browser console shows "Can't perform a React state update on an unmounted component."

**Why it happens:** Easy to forget the return statement in `useEffect` when the main logic is interesting. Developers focus on the animation sequence, not cleanup.

**How to avoid:** Make cleanup boilerplate automatic:
```typescript
useEffect(() => {
  const cleanup = runAnimationLoop();
  return () => {
    if (cleanup) cleanup();  // Cleanup function returns another cleanup
  };
}, [runAnimationLoop]);
```

**Warning signs:** Browser warning about state updates on unmounted components; memory usage grows over time if the component remounts repeatedly.

### Pitfall 2: Disabling `onNodesChange`/`onEdgesChange` Handlers Entirely

**What goes wrong:** You remove the handlers from the `<ReactFlow />` component or set them to `null`, but then internal edge/node updates from the diagram rendering break.

**Why it happens:** Thinking handlers = interaction. Actually, handlers manage state; disabling interaction is separate (via boolean props). The diagram still needs handlers for internal updates.

**How to avoid:** Keep `onNodesChange` and `onEdgesChange` attached to the component. Disable interaction via props only:
```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}    // KEEP these
  onEdgesChange={onEdgesChange}    // KEEP these
  nodesDraggable={false}           // Disable interaction via props
  nodesConnectable={false}
  {/* ... other disabling props ... */}
/>
```

**Warning signs:** Diagram visually breaks or doesn't render edges correctly.

### Pitfall 3: Applying `overflow-y-auto` to Parent of Sticky Element

**What goes wrong:** The diagram panel has `sticky top-0` but stops scrolling correctly. It acts like `position: relative` instead of sticking.

**Why it happens:** CSS spec: `overflow: auto|scroll|hidden` on a sticky element's parent container establishes a new stacking context that breaks the sticky behavior.

**How to avoid:** Put `overflow-y-auto` only on the content panel that should scroll, not the flexbox wrapper:
```typescript
{/* WRONG */}
<div className="flex overflow-y-auto">
  <div className="sticky top-0">Diagram</div>  {/* Won't stick */}
  <div>Content</div>
</div>

{/* RIGHT */}
<div className="flex">
  <div className="sticky top-0">Diagram</div>  {/* Will stick */}
  <div className="overflow-y-auto">Content</div>
</div>
```

**Warning signs:** Diagram scrolls with content instead of staying in place.

### Pitfall 4: Not Hiding Diagram on Mobile

**What goes wrong:** Diagram panel (35% width) takes up 35% of a mobile viewport, cramping the content. Layout breaks on small screens.

**Why it happens:** The design decision says "hide on mobile" but it's easy to miss the responsive class.

**How to avoid:** Use Tailwind's responsive prefix on the diagram panel:
```typescript
<div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 {/* ... */}">
  <ReactFlow />
</div>
```

The `hidden lg:block` ensures it's display:none below `lg` breakpoint (1024px), and the right panel stretches to full width.

**Warning signs:** Diagram visible on phones and tablets; content is cramped.

### Pitfall 5: Animation Sequence Doesn't Loop Smoothly

**What goes wrong:** After the 4-second animation completes, there's a visible jump or the edges don't reset cleanly for the next loop. Animation feels jarring.

**Why it happens:** Reset timing is off, or the reset doesn't complete before the next sequence starts.

**How to avoid:** Ensure:
1. Reset all edges to default state (animated: false, style unchanged) at the start of each loop
2. Stagger delays match the original simulation (500ms, 1500ms, 2500ms, 4000ms)
3. Add a 500ms buffer before the next loop starts (4500ms total)

```typescript
resetEdges();  // Reset first
animateEdge('e1', '#16a34a', 500);
animateEdge('e2', '#dc2626', 1500);
animateEdge('e3', '#d97706', 2500);
animateEdge('e5', '#2563eb', 4000);
// 4500ms before looping again
```

**Warning signs:** Edges stay highlighted between loops, or sequence timing looks off.

## Code Examples

Verified patterns from official sources:

### Complete Mobi Page Refactor (Skeleton)

[CITED: https://reactflow.dev/api-reference/react-flow] + [CITED: https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/]

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow, Background, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Github } from "lucide-react";

// --- Data (unchanged) ---

const STEPS = [ /* ... */ ];

const initialNodes = [ /* ... */ ];

const initialEdges = [ /* ... */ ];

export default function MobiArchPage() {
  const [nodes] = useNodesState(initialNodes);
  const [edges, setEdges, onNodesChange, onEdgesChange] = useEdgesState(initialEdges);

  // Animation loop
  const runAnimationLoop = useCallback(() => {
    // Reset
    setEdges(initialEdges.map(e => ({ ...e, animated: false, style: { stroke: '#b1b1b7' } })));

    // Sequence (timings from existing simulation)
    const timeouts = [];
    timeouts.push(
      setTimeout(() => {
        setEdges(eds => eds.map(e =>
          e.id === 'e1' ? { ...e, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } } : e
        ));
      }, 500)
    );
    timeouts.push(
      setTimeout(() => {
        setEdges(eds => eds.map(e =>
          e.id === 'e2' ? { ...e, animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } } : e
        ));
      }, 1500)
    );
    timeouts.push(
      setTimeout(() => {
        setEdges(eds => eds.map(e =>
          e.id === 'e3' ? { ...e, animated: true, style: { stroke: '#d97706', strokeWidth: 2 } } : e
        ));
      }, 2500)
    );
    timeouts.push(
      setTimeout(() => {
        setEdges(eds => eds.map(e =>
          e.id === 'e5' ? { ...e, animated: true, style: { stroke: '#2563eb', strokeWidth: 2 } } : e
        ));
      }, 4000)
    );

    // Loop after 4.5s
    const nextLoop = setTimeout(() => {
      runAnimationLoop();
    }, 4500);
    timeouts.push(nextLoop);

    // Cleanup: clear all pending timeouts
    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [setEdges]);

  // Start loop on mount
  useEffect(() => {
    const cleanup = runAnimationLoop();
    return cleanup;
  }, [runAnimationLoop]);

  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] min-h-screen font-sans flex flex-col lg:flex-row">
      {/* Diagram Panel: Hidden on mobile, sticky on desktop, 35% width */}
      <div className="hidden lg:block lg:w-[35%] h-screen sticky top-0 border-r border-gray-200 bg-gray-50/50 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          
          // Disable all interactions
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          selectNodesOnDrag={false}
          nodesFocusable={false}
          edgesFocusable={false}
          
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#e5e7eb" gap={20} />
        </ReactFlow>
      </div>

      {/* Content Panel: Full width on mobile, 65% on desktop */}
      <div className="w-full lg:w-[65%] h-auto lg:h-screen overflow-y-auto">
        <div className="max-w-xl mx-auto px-8 py-24">
          {/* Header with GitHub button */}
          <header className="mb-16 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-gray-500 mb-4 tracking-widest uppercase">
                Case Study 002
              </p>
              <h1 className="font-serif text-4xl font-medium tracking-tight mb-6 text-gray-900">
                Mobi: Microservices
              </h1>
            </div>
            <a
              href="https://github.com/d-aniel-yi/mobi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-mono rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
              aria-label="View Mobi repository on GitHub"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </header>

          {/* Content sections */}
          <div className="space-y-24">
            {STEPS.map((step) => (
              <section key={step.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[1px] bg-gray-300"></div>
                  <h2 className="font-serif text-xl text-gray-900">{step.title}</h2>
                </div>
                <div className="text-gray-600 leading-relaxed text-sm pl-11">
                  {step.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer CTA button */}
          <div className="mt-24 pt-8 border-t border-gray-200">
            <a
              href="https://github.com/d-aniel-yi/mobi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-mono rounded hover:bg-gray-700 transition-colors"
              aria-label="View Mobi repository on GitHub"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual trigger (button click) for animation | Auto-play animation on load | ReactFlow v12+ standard | Better UX for demos/documentation; no user action required |
| 50/50 split layout | Responsive: hide on mobile, 35%/65% on desktop | Tailwind v4 responsive utilities standard | Mobile-friendly; better content space on desktop |
| Custom interaction filtering | Boolean props on ReactFlow component | ReactFlow v11+ (well-established) | Simpler, more maintainable; official API vs. workaround |
| JavaScript sticky positioning (libraries) | CSS `position: sticky` | CSS 2017 (broad support now) | GPU-accelerated; no library dependency |

**Deprecated/outdated:**
- Manual "Submit Job" button UI: Removed in favor of auto-play. Button was useful for learning but unnecessary for final product.
- React Flow v9 API: Project uses v12.10.2. v9 required custom edge shapes for animation; v12+ supports `animated` property natively.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | CSS `position: sticky` has broad browser support (IE not supported, but not a project requirement) | Pattern 3 | If IE11 support is needed, use react-sticky-box or react-stickynode. Check CLAUDE.md or browser support matrix. |
| A2 | The GitHub URL https://github.com/d-aniel-yi/mobi is the canonical public repository | Pattern 4, Code Examples | If URL is wrong or repo is private, the button won't work. Verify with user before implementation. |
| A3 | Animation loop timing (500ms, 1500ms, 2500ms, 4000ms offsets, 4500ms total) matches design intent | Pattern 2, Pitfalls | If timing should differ, adjust delays. Current timing reuses existing simulation logic. |
| A4 | No testing framework is required for this phase (no test files in REQUIREMENTS.md) | — | If regression testing is needed, check REQUIREMENTS.md Phase 5 entry. May need to add test infrastructure in Wave 0. |

**If this table has entries:** A1–A4 are assumed based on training knowledge or CONTEXT.md. Discuss-phase and planner should validate before locking implementation.

## Open Questions

1. **Animation speed preference**
   - What we know: Current simulation uses 500ms, 1500ms, 2500ms, 4000ms offsets (sequential stagger)
   - What's unclear: Should the loop repeat exactly, or is a different cadence preferred?
   - Recommendation: Use existing timings (already tested and familiar), adjust if feedback indicates too slow/fast

2. **Button placement and count**
   - What we know: CONTEXT.md specifies two locations (header and footer)
   - What's unclear: Should both be identical, or should footer be larger/more prominent?
   - Recommendation: Match styles for consistency; let design guidance from project lead confirm

3. **Mobile diagram handling**
   - What we know: CONTEXT.md D-03 says hide diagram on mobile (below `lg` breakpoint)
   - What's unclear: Should there be a "view diagram" toggle on mobile, or is hidden acceptable?
   - Recommendation: Implement as hidden; can add toggle in a future iteration if users request it

## Environment Availability

No external dependencies (databases, APIs, build tools) are required for this phase. All work is within the Next.js app codebase:
- React 19.1.0 — already installed
- @xyflow/react 12.10.2 — already installed
- Tailwind CSS 4.x — already installed
- lucide-react 0.561.0 — already installed
- TypeScript — project already uses strict mode

**Status:** All dependencies available. No fallbacks needed.

## Validation Architecture

Skip this section entirely — workflow.nyquist_validation is not present in `.planning/config.json` (defaults to disabled, not enabled). No automated test framework detected in project, and REQUIREMENTS.md does not specify test requirements for Phase 5.

## Security Domain

This phase involves:
- External link to GitHub (open in new tab)
- No authentication, no user input, no data processing

**Applicable ASVS Categories:**

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | — (no user input) |
| V6 Cryptography | no | — |
| V10 Malicious Code | no | — (no dynamic content) |
| V14 Configuration | yes | External link uses `rel="noopener noreferrer"` to prevent window.opener exposure [VERIFIED: https://bobbyhadz.com/blog/react-button-link] |

**No security concerns:** Phase is pure UI/layout changes with one external link. No sensitive data, no user input, no authentication flow.

## Sources

### Primary (HIGH confidence)

- [npm registry (npm view @xyflow/react)] — Verified v12.10.2 is installed and current
- [ReactFlow official docs](https://reactflow.dev/api-reference/react-flow) — Complete API reference for interaction props and edge properties
- [ReactFlow interaction props guide](https://reactflow.dev/examples/interaction/interaction-props) — Official pattern for disabling interactions
- [ReactFlow edge animation guide](https://reactflow.dev/examples/edges/animating-edges) — Official pattern for edge animations
- [React LogRocket useEffect cleanup guide](https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/) — Best practices for useEffect cleanup and memory leak prevention
- [CSS Sticky Positioning (W3Schools)](https://www.w3schools.com/css/css_positioning_sticky.asp) — Official CSS spec behavior
- [Sticky Positioning Performance (Mastery Games)](https://mastery.games/post/position-sticky/) — Performance characteristics of CSS sticky vs. JavaScript libraries
- [Accessible Links and Buttons (Kitty Giraudel)](https://kittygiraudel.com/2020/01/17/accessible-links-and-buttons-with-react/) — Semantic HTML best practices for links vs. buttons

### Secondary (MEDIUM confidence)

- [React Button as Link guide (bobbyhadz)](https://bobbyhadz.com/blog/react-button-link) — Practical implementation patterns for external links with styling
- [Tailwind CSS buttons](https://tailwindcss.com/docs/buttons) — Button styling approach (though Tailwind doesn't ship pre-designed buttons; using utilities)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All packages verified in npm registry and project package.json
- Architecture patterns: HIGH — All patterns are official ReactFlow/React documentation; widely used in production
- Pitfalls: HIGH — Based on official docs, verified behavior, and ecosystem best practices
- Assumptions: LOW (for A1–A4) — See Assumptions Log; user should validate before lock-in

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (30 days; ReactFlow and React are stable, unlikely to change significantly in one month)

---

*Research for Phase 5: Diagram & Navigation*
*Scope: Layout, interactivity control, animation, navigation buttons*
*Next: Planner creates PLAN.md with concrete task breakdown*
