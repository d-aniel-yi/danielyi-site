---
phase: 06-content-expansion
reviewed: 2026-04-06T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - apps/web/src/app/projects/mobi/page.tsx
findings:
  critical: 0
  warning: 2
  info: 4
  total: 6
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-04-06T00:00:00Z
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed the Mobi project case study page (`mobi/page.tsx`). This is a well-structured Next.js client component that documents a microservices architecture for image analysis. The component combines a React Flow diagram visualization with narrative content sections. Code quality is generally solid with proper use of React hooks and accessibility features. However, there are 2 warnings around resource cleanup and animation management, and 4 informational items regarding code organization and potential improvements.

## Critical Issues

No critical issues found.

## Warnings

### WR-01: Animation Timeouts Not Cleaned Up on Dependency Change

**File:** `apps/web/src/app/projects/mobi/page.tsx:293-346`

**Issue:** The `runAnimationLoop` callback creates multiple `setTimeout` calls and returns a cleanup function. However, when `runAnimationLoop` is called recursively (line 338), it does not store the returned cleanup function from the recursive call. This creates a resource leak where timeouts from the previous loop iteration remain pending in the event queue.

**Context:** Lines 336-340 show:
```typescript
timeouts.push(
    setTimeout(() => {
        runAnimationLoop();
    }, 4500)
);
```

The recursive call to `runAnimationLoop()` generates a new cleanup function internally, but it is never returned or stored, so those timeouts cannot be cleaned up properly.

**Fix:**
Store and manage all timeout IDs in a persistent state or use a cleanup registry across loop cycles:

```typescript
const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

const runAnimationLoop = useCallback((): void => {
    // Clear any previous timeouts
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    // Schedule animations...
    timeoutsRef.current.push(
        setTimeout(() => {
            setEdges(eds => eds.map(e =>
                e.id === 'e1' ? { ...e, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } } : e
            ));
        }, 500)
    );

    // ... more timeouts ...

    // Loop: schedule next cycle and allow cleanup
    timeoutsRef.current.push(
        setTimeout(() => {
            runAnimationLoop();
        }, 4500)
    );
}, [setEdges]);

useEffect(() => {
    runAnimationLoop();
    return () => {
        timeoutsRef.current.forEach(t => clearTimeout(t));
    };
}, [runAnimationLoop]);
```

### WR-02: Return Value Mismatch in runAnimationLoop

**File:** `apps/web/src/app/projects/mobi/page.tsx:293-352`

**Issue:** The `useCallback` is declared with a return type of `(() => void)` (line 293), and the function returns a cleanup function that clears timeouts (lines 343-345). However, in the `useEffect` hook (lines 349-352), the returned cleanup function is stored in `cleanup` and immediately returned — this is correct. But the type declaration suggests the function always returns a cleanup function, while the recursive call (line 338) does not use or return this value. The dependency array includes `[setEdges]` only, but `runAnimationLoop` calls itself recursively, which could theoretically cause stale closure issues if the callback identity changes unexpectedly during re-renders.

**Context:** The `useEffect` dependency array is `[runAnimationLoop]`, which is correct, but the recursive behavior combined with the callback abstraction makes the cleanup semantics unclear.

**Fix:**
Simplify by using a ref-based approach to avoid recursive callback returns:

```typescript
const runAnimationLoop = useCallback(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    timeouts.push(
        setTimeout(() => {
            setEdges(eds => eds.map(e =>
                e.id === 'e1' ? { ...e, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } } : e
            ));
        }, 500)
    );

    // ... other timeouts ...

    const nextCycleTimeout = setTimeout(() => {
        runAnimationLoop();
    }, 4500);
    
    timeouts.push(nextCycleTimeout);

    return () => {
        timeouts.forEach(t => clearTimeout(t));
    };
}, [setEdges]);

useEffect(() => {
    const cleanup = runAnimationLoop();
    return cleanup;
}, [runAnimationLoop]);
```

This approach ensures all timeouts (including the recursive next cycle) are tracked and cleaned up properly.

## Info

### IN-01: No Validation of GitHub URL

**File:** `apps/web/src/app/projects/mobi/page.tsx:394, 421`

**Issue:** The GitHub repository URL is hardcoded as a string without validation. If the URL becomes invalid or the repository is deleted, the link will silently fail at runtime. The link appears in two places (lines 394 and 421) with identical values — this is code duplication that could be centralized.

**Fix:**
Extract the URL to a constant and add a comment indicating expected format:

```typescript
const MOBI_GITHUB_URL = "https://github.com/d-aniel-yi/mobi";

// Then use it in both places:
<a href={MOBI_GITHUB_URL} target="_blank" rel="noopener noreferrer" ...>
```

### IN-02: Magic Numbers in Animation Timing

**File:** `apps/web/src/app/projects/mobi/page.tsx:300-339`

**Issue:** Animation timing is hardcoded as magic numbers: 500ms, 1500ms, 2500ms, 4000ms, 4500ms. These values lack semantic meaning and would be difficult to adjust consistently if animation pacing needs to change.

**Fix:**
Define timing constants at the top of the file:

```typescript
const ANIMATION_TIMINGS = {
    HTTP_REQUEST: 500,      // Frontend → Backend
    PUSH_JOB: 1500,         // Backend → Redis
    POP_JOB: 2500,          // Redis → Worker
    SAVE_RESULT: 4000,      // Worker → DB
    LOOP_CYCLE: 4500,       // Total cycle duration
} as const;
```

Then use them in `setTimeout` calls for clarity and maintainability.

### IN-03: Unused onNodesChange Handler

**File:** `apps/web/src/app/projects/mobi/page.tsx:290, 361`

**Issue:** The `onNodesChange` handler is destructured from `useNodesState` (line 290) and passed to the ReactFlow component (line 361), but nodes are explicitly set to `nodesDraggable={false}` (line 365), so nodes cannot actually be modified by the user. The handler is dead code.

**Fix:**
Remove the unused handler to simplify the component:

```typescript
const [nodes] = useNodesState(initialNodes);  // Remove onNodesChange
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

And remove it from ReactFlow props if it serves no purpose with user interactions disabled.

### IN-04: Accessibility: Missing Alt Text on Logo Icon

**File:** `apps/web/src/app/projects/mobi/page.tsx:400, 427`

**Issue:** The GitHub icon component (`<Github className="w-4 h-4" />`) lacks an accessible label. While the `aria-label` attribute is present on the parent `<a>` tag, the icon itself has no descriptive text, which may confuse screen reader users or users with CSS disabled.

**Fix:**
Consider adding a `title` attribute or wrapping the icon with a visually-hidden text label:

```typescript
<a
    href={MOBI_GITHUB_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-mono rounded hover:bg-gray-700 transition-colors"
    aria-label="View Mobi repository on GitHub"
>
    <Github className="w-4 h-4" aria-hidden="true" title="GitHub" />
    View on GitHub
</a>
```

Or ensure the icon is marked `aria-hidden="true"` so screen readers focus on the link text instead.

---

_Reviewed: 2026-04-06T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
