---
phase: 02-fix-pages
plan: 03
subsystem: ui-components
tags: [react, typescript, tailwind, shared-components]
requires:
  - 02-01: Address parser for location functionality
provides:
  - Shared TargetSection component for case study pages
affects:
  - halborn page: Uses TargetSection via re-export
  - softstack page: Uses TargetSection via re-export
tech-stack:
  added: []
  patterns:
    - Shared component abstraction with re-export wrappers
    - CSS custom properties for theming
    - Alternating layout pattern with isEven prop
key-files:
  created:
    - apps/web/src/components/shared/TargetSection.tsx
  modified:
    - apps/web/src/components/halborn/TargetSection.tsx
    - apps/web/src/components/softstack/TargetSection.tsx
decisions: []
metrics:
  duration: 2 min
  completed: 2026-02-11
---

# Phase 02 Plan 03: Shared TargetSection Component Summary

**One-liner:** Shared TargetSection component with alternating layouts, scroll tracking, and re-export wrappers for halborn/softstack pages

## Objective Achieved

Implemented shared TargetSection component to eliminate duplication between halborn and softstack pages, resolving module export errors that blocked the build.

**Key accomplishment:** Per decision diag-004, abstracted identical TargetSection implementations into a single shared component while maintaining backward compatibility through re-export wrappers.

## What Was Built

### Shared Component Architecture

**Core Component** (`apps/web/src/components/shared/TargetSection.tsx`):
- TargetProps interface with 9 properties (number, title, subtitle, logo, rationale, approach, value, bonus?, isEven)
- Client-side component with "use client" directive
- Alternating layout system based on isEven prop (even = image left, odd = image right)
- scroll-section class for navigation dot tracking
- CSS custom property theming (--op-black, --op-accent, --op-white, etc.)
- Animation support via data-animate attributes with staggered delays
- Optional bonus section with conditional rendering

**Re-export Wrappers**:
- `apps/web/src/components/halborn/TargetSection.tsx`: Single-line re-export maintaining existing import path
- `apps/web/src/components/softstack/TargetSection.tsx`: Single-line re-export maintaining existing import path

### Component Features

**Layout System**:
- Two-column grid layout (image + content)
- MD breakpoint responsive with order swapping
- isEven prop controls left-right alternation
- Target card with hover effect (border color change)
- Minimum 400px height for image container

**Content Sections**:
1. Number badge (circular, accent color background)
2. Title (display-serif, 4xl-5xl)
3. Subtitle (lg, gray color)
4. Rationale (left border: accent-darker)
5. Approach (left border: dark-gray)
6. Capital Potential (left border: accent)
7. Bonus (optional, accent-dark background)

**Styling Approach**:
- Tailwind v4 utilities for layout and spacing
- Inline style objects for color theming via CSS variables
- Consistent with existing halborn/softstack design system
- Matches IntroSection component patterns

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1-2 | Implement shared TargetSection with re-exports | 49fe705 | shared/TargetSection.tsx, halborn/TargetSection.tsx, softstack/TargetSection.tsx |

## Technical Implementation

### Interface Design

```typescript
export interface TargetProps {
  number: number;        // Badge number
  title: string;         // Company name
  subtitle: string;      // One-line description
  logo: string;          // Image path
  rationale: string;     // Why target this company
  approach: string;      // How to approach them
  value: string;         // Capital potential assessment
  bonus?: string;        // Optional additional value
  isEven: boolean;       // Controls layout direction
}
```

### Usage Pattern

Both pages use identical spread operator pattern:
```typescript
{targets.map((target, index) => (
  <TargetSection
    key={target.title}
    {...target}
    isEven={index % 2 === 0}
  />
))}
```

### Import Path Maintenance

Pages continue importing from their respective directories:
- `import { TargetSection } from "@/components/halborn/TargetSection"`
- `import { TargetSection } from "@/components/softstack/TargetSection"`

Re-export wrappers redirect to shared implementation transparently.

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

None - implemented per existing design patterns and decision diag-004.

## Known Issues

None identified.

## Next Phase Readiness

**Unblocks:**
- halborn page can now build without module export errors
- softstack page can now build without module export errors

**Dependencies satisfied:**
- Address parser (02-01) already implemented
- No further dependencies for TargetSection

**Build status:**
- TargetSection module errors resolved
- Two of four critical empty stub components now implemented
- Remaining: ProjectCard (02-02 - next plan), ContactForm (02-04)

**Ready for next plan:** Yes - can proceed to 02-04 ContactForm implementation

## Self-Check: PASSED

All created files verified to exist:
- apps/web/src/components/shared/TargetSection.tsx (157 lines)
- apps/web/src/components/halborn/TargetSection.tsx (1 line)
- apps/web/src/components/softstack/TargetSection.tsx (1 line)

All commits verified in git log:
- 49fe705: feat(02-03): implement shared TargetSection component
