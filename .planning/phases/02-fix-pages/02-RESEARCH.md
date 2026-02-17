# Phase 2: Fix Pages - Research

**Researched:** 2026-02-10
**Domain:** Next.js static export component implementation and fixes
**Confidence:** HIGH

## Summary

Phase 2 requires implementing 4 critical empty components and fixing issues in 5 pages to enable successful static HTML export. The phase depends on Phase 1 diagnostics which identified zero-byte files blocking builds.

The research confirms all components follow Next.js 15/React 19 patterns with TypeScript, Tailwind v4, and Framer Motion. The implementation strategy is straightforward: stub implementations based on actual usage patterns in the pages that import them.

**Primary recommendation:** Implement each component in order of dependency chain (bottom-up: parseAddress → ProjectCard → pages), verify each against actual usage patterns in importing files, then build and test.

## Component Implementation Analysis

### 1. ProjectCard Component (`src/components/projects/ProjectCard.tsx`)

**Used by:** `apps/web/src/app/projects/page.tsx` (line 4)

**Required Exports:**
- `ProjectCard` - Main component
- `ProjectItem` - TypeScript type

**Usage Pattern (from projects/page.tsx lines 7-124):**

```typescript
// Type definition needed
interface ProjectItem {
  title: string;
  href: string;
  excerpt: string;
  image: string;
  tags: string[];
  featured?: boolean;
  accentColor?: string;
  detailsSlug?: string;  // Optional: links to /projects/[slug]
  techDetails?: {
    stack: string[];
    architecture: string;
    highlights: string[];
  };
}

// Component signature
<ProjectCard key={project.title} item={project} variant="deep-dive" />
// or
<ProjectCard key={project.title} item={project} />
```

**Implementation Requirements:**
- Accept `item: ProjectItem` prop
- Accept optional `variant?: "deep-dive" | undefined` prop
- Render project cards with different layouts based on variant
- Support featured vs standard projects (different grid layouts in page.tsx)
- Display title, excerpt, image, tags, and optional accent color
- If `detailsSlug` exists, make card a link to `/projects/{detailsSlug}`
- Otherwise, make card a link to `item.href` (external)
- Tech details section can be expandable or inline

**Stack:** Tailwind v4, React 19, TypeScript, Framer Motion for animations

---

### 2. TargetSection Component (`src/components/halborn/TargetSection.tsx` and `src/components/softstack/TargetSection.tsx`)

**Used by:**
- `apps/web/src/app/halborn/page.tsx` (lines 156-162)
- `apps/web/src/app/softstack/page.tsx` (lines 127-133)

**Key Finding:** Both pages have **identical implementations** of TargetSection. The page decision to abstract a shared component is correct.

**Usage Pattern (from halborn/page.tsx lines 111-162):**

```typescript
const targets = [
  {
    number: 1,
    title: "Robinhood Chain",
    subtitle: "Permissionless L2 for Tokenized Real-World Assets",
    logo: "/logos/robinhood.png",
    rationale: "...",
    approach: "...",
    value: "...",
    bonus?: "...", // Optional
  },
  // ... more targets
];

targets.map((target, index) => (
  <TargetSection
    key={target.title}
    {...target}
    isEven={index % 2 === 0}
  />
))
```

**Required Type Interface:**

```typescript
interface TargetProps {
  number: number;
  title: string;
  subtitle: string;
  logo: string;
  rationale: string;
  approach: string;
  value: string;
  bonus?: string;
  isEven: boolean;  // Alternates layout left/right
}
```

**Implementation Requirements:**
- Accept all props above using spread operator (`{...target, isEven}`)
- Render with alternating left-right layout based on `isEven` flag
- Display logo (image), number badge, title, subtitle
- Show rationale, approach, and value in expandable sections or readable text
- Bonus section optional
- Add `scroll-section` class to enable scroll tracking in halborn/softstack pages
- Match the design system used in HeroSection and IntroSection (CSS variables like `--op-black`, `--op-accent`, etc.)

**Stack:** React 19, TypeScript, Tailwind v4, CSS custom properties for theme

---

### 3. Address Parser (`src/lib/address-parser.ts`)

**Used by:** `apps/web/src/app/projects/fsbo/page.tsx` (line 110)

**Usage Pattern (from fsbo/page.tsx lines 216-217):**

```typescript
import { parseAddress } from "@/lib/address-parser";

// Called with Google Maps place data
const parsedResult = parseAddress(place.addressComponents, place.formattedAddress);
```

**Google Maps Place Structure:**
- `addressComponents` - Array of address component objects from Google Maps API
- `formattedAddress` - String like "123 Main St, Portland, OR 97214, USA"

**Required Function Signature:**

```typescript
export function parseAddress(
  addressComponents: google.maps.GeocoderAddressComponent[],
  formattedAddress: string
): Record<string, string>
```

**Expected Return Object (from DataLayer visualization lines 304-318):**
A normalized object with keys like:
- `street_number` / `street_address`
- `route` / `street_name`
- `locality` / `city`
- `administrative_area_level_1` / `state`
- `postal_code` / `zip`
- `country`

**Implementation Requirements:**
- Parse Google Maps addressComponents array
- Extract address parts using component types
- Return normalized, keyed object for database storage
- Handle edge cases (missing components, different locales)
- Stub initially with basic extraction to unblock build

**Stack:** TypeScript, No external dependencies for stub

---

## Page Analysis

### `/projects` (Static Export: HIGH confidence)
**File:** `apps/web/src/app/projects/page.tsx`
- Uses `"use client"` - Client component
- Imports ProjectCard from empty component (BLOCKING)
- Renders featured and standard projects with motion animations
- No dynamic routes or database calls
- Should render fine once ProjectCard is implemented

**Export Status:** Will render correctly after ProjectCard is fixed

---

### `/projects/fsbo` (Static Export: HIGH confidence)
**File:** `apps/web/src/app/projects/fsbo/page.tsx`
- Uses `"use client"` - Client component
- Complex interactive demo with React Flow, Google Maps, form inputs
- Imports `parseAddress` from empty lib (BLOCKING)
- All dependencies present (framer-motion, @xyflow/react, lucide-react)
- Google Maps API key is optional; page warns if missing but doesn't crash
- Should render with demo disabled if API key missing

**Export Status:** Will render correctly after parseAddress stub is implemented

---

### `/projects/mobi` (Static Export: HIGH confidence)
**File:** `apps/web/src/app/projects/mobi/page.tsx`
- Uses `"use client"` - Client component
- Interactive React Flow diagram with async simulation
- All dependencies present (lucide-react, @xyflow/react)
- No imports from empty files
- Self-contained architecture showcase
- No database calls or dynamic data

**Export Status:** Should render correctly as-is. No blockers detected.

---

### `/projects/portfolio` (Static Export: HIGH confidence)
**File:** `apps/web/src/app/projects/portfolio/page.tsx`
- Uses `"use client"` - Client component
- Interactive React Flow diagram with section-based state management
- All dependencies present
- No imports from empty files
- IntersectionObserver for scroll-triggered animations (works in static export)
- Complex TypeScript types for nodes/edges (all imported from @xyflow/react)

**Export Status:** Should render correctly as-is. No blockers detected.

---

### `/technical` (Static Export: HIGH confidence)
**File:** `apps/web/src/app/technical/page.tsx`
- Pure server component (no `"use client"`)
- Imports ApiHealth component from status module
- Imports Card, KeyValue, SectionHeader, CodeInline from technical/Sections
- Metadata export for SEO
- Static content only

**Export Status:** Will render correctly if ApiHealth and Sections components exist. Need to verify those files.

---

## Architecture Patterns

### Component Structure Pattern

Based on halborn/softstack examples, this codebase uses:

```typescript
"use client";

export function ComponentName() {
  return (
    <section className="..." style={{ ... }}>
      {/* Content */}
    </section>
  );
}
```

**Key patterns:**
- All interactive components are "use client"
- CSS custom properties for theming (--op-black, --op-accent, etc.)
- Tailwind v4 for styling
- data-animate attributes for scroll-triggered animations
- scroll-section class marker for intersection observer tracking

### Type Export Pattern

```typescript
// In component files that define types:
export interface MyType { ... }
export function MyComponent() { ... }

// In importing files:
import { MyComponent, type MyType } from "@/components/...";
```

## Don't Hand-Roll

**Problems that have existing solutions in this codebase:**

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Address normalization algorithm | Custom regex/parsing logic | Google Maps Places API (already integrated in fsbo) | Google handles locale variations, format changes, international formats |
| Form validation | Custom validation functions | Inline validation with state (pattern in technical page) | Type-safe and minimal for simple forms |
| Scroll animations | Custom scroll listeners | IntersectionObserver (used in portfolio page) | Native browser API, better performance |

---

## Common Pitfalls

### Pitfall 1: Mismatched Prop Interfaces
**What goes wrong:** TargetSection receives spread props from targets array but type doesn't match
**Why it happens:** Props come from data structure but component expects different names
**How to avoid:** Define interface to match exact data shape (number, title, subtitle, logo, rationale, approach, value, bonus, isEven)
**Warning signs:** TypeScript errors on spread operator, missing required props at call sites

### Pitfall 2: Google Maps API Missing
**What goes wrong:** fsbo page crashes if NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set
**Why it happens:** Script fails to load, autocomplete element fails to initialize
**How to avoid:** fsbo/page.tsx already has guard on line 148-151 and lines 294-298
**Warning signs:** Console errors about window.google undefined, disabled input field

### Pitfall 3: Static Export CSS Variables
**What goes wrong:** CSS custom properties (--op-black, --op-accent) undefined at runtime
**Why it happens:** Variables must be defined in global CSS or inline before use
**How to avoid:** Check halborn.css and softstack.css for variable definitions
**Warning signs:** Components render but with wrong colors or no styling

### Pitfall 4: Import Path Aliases
**What goes wrong:** Components fail to import because @/lib, @/components paths not configured
**Why it happens:** Next.js alias configuration missing in tsconfig.json
**How to avoid:** File already exists and works (other imports use @/ pattern)
**Warning signs:** Module not found errors on imports

---

## Code Examples

### ProjectCard Implementation Sketch

```typescript
// src/components/projects/ProjectCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ProjectItem {
  title: string;
  href: string;
  excerpt: string;
  image: string;
  tags: string[];
  featured?: boolean;
  accentColor?: string;
  detailsSlug?: string;
  techDetails?: {
    stack: string[];
    architecture: string;
    highlights: string[];
  };
}

interface ProjectCardProps {
  item: ProjectItem;
  variant?: "deep-dive" | "standard";
}

export function ProjectCard({ item, variant = "standard" }: ProjectCardProps) {
  const isDeepDive = variant === "deep-dive";
  const href = item.detailsSlug ? `/projects/${item.detailsSlug}` : item.href;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link href={href}>
        {/* Grid/flex layout based on variant */}
        {/* Image, title, excerpt, tags */}
      </Link>
    </motion.div>
  );
}
```

### Address Parser Implementation Sketch

```typescript
// src/lib/address-parser.ts
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export function parseAddress(
  addressComponents: AddressComponent[],
  formattedAddress: string
): Record<string, string> {
  const parsed: Record<string, string> = {};

  addressComponents.forEach(component => {
    const { long_name, types } = component;

    // Map Google types to stable keys
    if (types.includes('street_number')) parsed.street_number = long_name;
    if (types.includes('route')) parsed.street = long_name;
    if (types.includes('locality')) parsed.city = long_name;
    // ... more mappings
  });

  return parsed;
}
```

### TargetSection Implementation Sketch

```typescript
// src/components/halborn/TargetSection.tsx
"use client";

export interface TargetProps {
  number: number;
  title: string;
  subtitle: string;
  logo: string;
  rationale: string;
  approach: string;
  value: string;
  bonus?: string;
  isEven: boolean;
}

export function TargetSection(props: TargetProps) {
  const { number, title, subtitle, logo, isEven, ... } = props;

  return (
    <section className="scroll-section" style={{ backgroundColor: 'var(--op-white)' }}>
      <div className={`grid grid-cols-${isEven ? 1 : 2}`}>
        {/* Image on left if even, right if odd */}
        {/* Content on right if even, left if odd */}
      </div>
    </section>
  );
}
```

---

## State of the Art

| Aspect | Current Approach | Notes |
|--------|------------------|-------|
| Static Export | Output as HTML files to S3 | Next.js 15 with `output: 'export'` in next.config.js |
| Component System | React 19 with Server/Client Components | Server by default, Client where interactivity needed |
| Styling | Tailwind v4 with CSS custom properties | No runtime CSS-in-JS, all static |
| Animations | Framer Motion + IntersectionObserver | Works in static export without server |

---

## Open Questions

1. **CSS Variables Definition**
   - What we know: halborn.css and softstack.css exist with --op-* variables
   - What's unclear: Are these variables shared or page-specific?
   - Recommendation: Check both CSS files to confirm variable definitions exist

2. **ApiHealth Component Availability**
   - What we know: technical/page.tsx imports it (line 2)
   - What's unclear: Does the component exist or is it also empty?
   - Recommendation: Verify `src/components/status/ApiHealth.tsx` exists and is non-empty

3. **Google Maps Types**
   - What we know: fsbo page uses google.maps.GeocoderAddressComponent
   - What's unclear: Are @types/google.maps installed?
   - Recommendation: Check if @google/maps types are in package.json devDependencies

---

## Required Verifications Before Implementation

These should be checked before starting Phase 2 tasks:

1. Confirm halborn.css and softstack.css define all --op-* custom properties
2. Confirm src/components/status/ApiHealth.tsx exists
3. Confirm src/components/technical/Sections.tsx exists with Card, KeyValue, SectionHeader, CodeInline exports
4. Run `npm list | grep @types` to verify Google Maps types installed
5. Verify next.config.js has `output: 'export'` set
6. Check tsconfig.json paths configuration for @/ aliases

---

## Sources

### Primary (HIGH confidence)
- **Next.js 15.5.0 Documentation** - Static export behavior, dynamic routes, metadata
- **React 19 Documentation** - Server/Client components, hooks, types
- **Source Files Analysis** - Direct inspection of usage patterns in importing pages (fsbo/page.tsx, projects/page.tsx, halborn/page.tsx, softstack/page.tsx, technical/page.tsx)
- **Package.json** - Dependency versions and scripts (Next.js 15.5.0, React 19.1.0, Tailwind 4, Framer Motion 12.23.26, @xyflow/react 12.10.0)

### Secondary (MEDIUM confidence)
- **Existing Component Patterns** - HeroSection, IntroSection, ClosingSection, NavigationDots components serve as implementation templates
- **Type Definitions** - projectItems data structure in projects/page.tsx shows exact ProjectItem interface needs
- **Google Maps API** - fsbo/page.tsx usage pattern shows expected addressComponents and formattedAddress inputs

---

## Metadata

**Confidence breakdown:**
- **Component interfaces:** HIGH - Exact usage patterns visible in importing pages
- **ProjectCard requirements:** HIGH - Detailed usage with 69 lines of data structures
- **TargetSection requirements:** HIGH - Both halborn and softstack pages show identical usage
- **parseAddress requirements:** HIGH - fsbo page shows exact call signature and inputs
- **Page rendering status:** HIGH - Direct inspection of source code
- **Pitfalls:** MEDIUM - Based on patterns in similar Next.js static export projects

**Research date:** 2026-02-10
**Valid until:** 2026-02-24 (14 days - stable domain, unlikely to change in next.config)
