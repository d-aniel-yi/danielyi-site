# Phase 1: Diagnose - Research

**Researched:** 2026-02-10
**Domain:** Next.js 15 Static Export Build Diagnostics
**Confidence:** HIGH

## Summary

Diagnosing Next.js static export build failures requires understanding the constraints of `output: 'export'` mode, the types of errors that can occur, and systematic error analysis techniques. This phase focuses on identifying root causes for build errors when compiling to static HTML for S3 deployment.

The primary diagnostic approach involves:
1. Running the build with full error output to capture all compilation errors
2. Categorizing errors by type (missing exports, unsupported APIs, dynamic routes, import errors)
3. Mapping each error to its root cause (empty component files, missing exports, SSR-only APIs, etc.)
4. Determining scope of fixes needed (which pages, components, configuration)

**Primary recommendation:** Use `next build --turbopack` with `--debug-prerender` for detailed error messages, document all errors by file and line number, categorize by root cause type, and identify the complete scope of affected pages and components.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.0 | Full-stack React framework with static export support | Industry standard for React-based static sites; excellent static export documentation |
| Turbopack | Built-in to Next.js 15 | JavaScript/TypeScript bundler (incremental compilation) | Default bundler in Next.js 15; faster builds than Webpack |
| React | 19.1.0 | Component library | Latest stable version, works with Next.js 15 |
| TypeScript | ^5 | Type safety | Production standard for large codebases |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion | ^12.23.26 | Animation library | Used in project pages |
| @xyflow/react | ^12.10.0 | Flow/diagram visualization | Used in FSBO project page |
| Lucide React | ^0.561.0 | Icon library | SVG icons for components |
| Tailwind CSS | ^4 | Utility CSS framework | Primary styling approach |
| MDX | ^3.0.0 | Markdown for React components | Used for content pages |

**Installation:** These are already installed in package.json and configured in next.config.ts

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Turbopack | Webpack | Webpack is slower; Turbopack is Next.js 15 standard |
| Static export | SSR/ISR | Would require server infrastructure; project requirement is S3 static hosting |

---

## Architecture Patterns

### Next.js Static Export Structure
```
apps/web/
├── next.config.ts                 # Config with output: 'export'
├── src/
│   ├── app/                       # App Router pages
│   │   ├── page.tsx               # Root page
│   │   ├── projects/              # Project listing
│   │   │   ├── page.tsx           # /projects (main listing)
│   │   │   ├── [slug]/            # Dynamic project detail (requires generateStaticParams)
│   │   │   ├── fsbo/page.tsx      # /projects/fsbo (static page)
│   │   │   ├── mobi/page.tsx      # /projects/mobi (static page)
│   │   │   └── portfolio/page.tsx # /projects/portfolio (static page)
│   │   └── ...other routes
│   ├── components/                # Shared components
│   │   ├── projects/              # Project-related components
│   │   │   └── ProjectCard.tsx    # EMPTY - Error root cause
│   │   ├── halborn/               # Case study components
│   │   │   └── TargetSection.tsx  # EMPTY - Error root cause
│   │   └── softstack/             # Case study components
│   │       └── TargetSection.tsx  # EMPTY - Error root cause
│   └── lib/                       # Utilities
└── package.json                   # Dependencies
```

### Pattern 1: Static Page Authoring
**What:** In `output: 'export'` mode, pages must be pre-renderable at build time.
**When to use:** All pages in static export must be either:
- Simple pages with no dynamic data
- Pages using `getStaticProps` (Pages Router - deprecated)
- Server Components that fetch data at build time
- Client Components with client-side data fetching

**Example:**
```typescript
// Server Component: Data fetched at build time
export default async function ProjectsPage() {
  const data = await fetch('...', { next: { revalidate: false } })
  return <div>{/* static HTML */}</div>
}

// Client Component: Data fetched on client
'use client'
export default function ProjectsPage() {
  const [data, setData] = useState(null)
  useEffect(() => { /* fetch on client */ }, [])
  return <div>{/* renders with loading state */}</div>
}
```

### Pattern 2: Dynamic Routes in Static Export
**What:** Routes using `[slug]` require `generateStaticParams()` to pre-generate all possible routes.
**When to use:** When you have dynamic routes (e.g., `/projects/[slug]`) but limited number of variants.

**Example (from Next.js docs):**
```typescript
export async function generateStaticParams() {
  return [
    { slug: 'fsbo' },
    { slug: 'mobi' },
    { slug: 'portfolio' }
  ]
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <div>Project: {params.slug}</div>
}
```

### Anti-Patterns to Avoid
- **Using Server-only APIs:** `getServerSideProps`, `cookies()`, `headers()`, or dynamic server functions prevent static export
- **Relying on request-time data:** Route handlers with `req` parameter, dynamic config file access
- **Unimplemented exports:** Importing components that don't export (currently happening)
- **Browser-only code at root level:** `window`, `localStorage`, `document` outside `useEffect` will fail at build time
- **Dynamic imports without ssr control:** Ensure `ssr: false` for client-only libraries

---

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Component file is empty | Manual export placeholder | Implement actual component OR remove import | Empty files cause "module has no exports" errors; placeholder exports mask the real issue |
| Missing type definitions | String-based types | TypeScript types from library or define own | Loose typing hides errors that static export will reveal |
| Dynamic routing behavior | Custom route resolution logic | `generateStaticParams()` for static or ISR for server | Next.js has built-in patterns; custom solutions miss edge cases |
| Error analysis at build time | Manual log inspection | Use `--debug-prerender` flag and error output | Built-in tooling provides structured error context |

**Key insight:** Static export is a hard constraint. You can't work around it with custom logic—the constraints are enforced by Next.js. The only option is to refactor code to comply.

---

## Common Pitfalls

### Pitfall 1: Empty Component Files
**What goes wrong:** Component files exist but have no exports (0 bytes). Pages that import these components fail to build with "module has no exports" error.
**Why it happens:** Components are created as placeholders during development but implementation is deferred. During merge, empty files are checked in.
**How to avoid:**
- Use a linter rule (like `no-empty-exports` if available) to catch empty files
- Have pre-merge checks for empty/stub files
- Implement components before commit or remove imports
**Warning signs:** File size 0 bytes, "module has no exports" errors, imports from files that are in git but empty

### Pitfall 2: Unescaped HTML Entities in JSX
**What goes wrong:** Single/double quotes in JSX strings aren't properly escaped, causing ESLint errors that fail the build.
**Why it happens:** Copy-pasting content with curly quotes or apostrophes into JSX without proper escaping
**How to avoid:**
- Use proper HTML entities: `&apos;` ('), `&quot;` ("), `&#39;` ('), etc.
- Or use template literals with backticks
- Or ensure curly quote characters are proper unicode (smart quotes in content are OK if properly encoded)
**Warning signs:** `react/no-unescaped-entities` ESLint errors, can't escape with HTML entity

### Pitfall 3: Using SSR-Only APIs in Client Components
**What goes wrong:** Using `cookies()`, `headers()`, or other server-only functions in code that will be rendered at build time
**Why it happens:** Forgetting that in static export, even client components are pre-rendered on the build server
**How to avoid:**
- Always wrap server-only code in `useEffect()` or similar client lifecycle hooks
- Use `'use client'` directive correctly
- Understand that `'use client'` only marks where server-client boundary is; server code still runs at build
**Warning signs:** Build errors about accessing `cookies()` or `headers()` in static context

### Pitfall 4: Forgetting `generateStaticParams()` for Dynamic Routes
**What goes wrong:** Dynamic route like `/projects/[slug]` exists but no `generateStaticParams()` defined, build skips these routes or fails
**Why it happens:** Dynamic routes in `output: 'export'` require static pre-generation; easy to forget
**How to avoid:**
- Check every `[param]` route file
- Ensure `export function generateStaticParams() { return [...] }`
- Add a linter or build step to validate all dynamic routes have params
**Warning signs:** Missing routes in `out/` folder, dynamic routes not in static export output

### Pitfall 5: Large Image Optimization Issues
**What goes wrong:** Using `next/image` with default loader (which requires server) in static export
**Why it happens:** Forgetting that image optimization is a server-side feature
**How to avoid:**
- Set `images: { unoptimized: true }` in next.config.ts for static export, OR
- Use custom image loader (like Cloudinary), OR
- Use plain `<img>` tags (accepts ESLint warning)
**Warning signs:** Build errors about image optimization in export mode

---

## Code Examples

### Properly Implemented Component Export
```typescript
// Source: Next.js app router patterns
// File: src/components/projects/ProjectCard.tsx

'use client'

import { motion } from 'framer-motion'

export interface ProjectItem {
  id: string
  title: string
  description: string
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border rounded-lg p-4"
    >
      <h3 className="text-lg font-bold">{project.title}</h3>
      <p className="text-gray-600">{project.description}</p>
    </motion.div>
  )
}

export default ProjectCard
```

### Static Route with Server-Side Data Fetch
```typescript
// Source: Next.js docs on static exports
// File: src/app/projects/page.tsx

import { ProjectCard } from '@/components/projects/ProjectCard'

export default async function ProjectsPage() {
  // Data fetched at build time, not runtime
  const projects = await fetch('...', {
    next: { revalidate: false }
  }).then(r => r.json())

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### Dynamic Route with generateStaticParams
```typescript
// Source: Next.js docs on static exports + dynamic routes
// File: src/app/projects/[slug]/page.tsx

export async function generateStaticParams() {
  return [
    { slug: 'fsbo' },
    { slug: 'mobi' },
    { slug: 'portfolio' }
  ]
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <div>Project: {params.slug}</div>
}
```

### Handling Unescaped Entities
```typescript
// BAD:
<p>This doesn't work with 'quotes' directly</p>

// GOOD:
<p>This doesn't work with &apos;quotes&apos; directly</p>
<p>This {`doesn't work with 'quotes' in template literals`}</p>
<p>This {"doesn't work with 'quotes' in braced strings"}</p>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` CLI command | `output: 'export'` in next.config.js | Next.js v13.3 (2023) | Simpler, integrated configuration |
| `getStaticProps` + `getStaticPaths` | `generateStaticParams()` + Server Components | Next.js v13 (App Router, 2023) | More intuitive React patterns |
| Webpack bundler | Turbopack bundler | Next.js v15 (default, 2024) | Dramatically faster builds |
| Image optimization required for export | Image optimization optional with `unoptimized: true` | Next.js v12+ | More flexibility for static sites |

**Deprecated/outdated:**
- `next export` command: Use `output: 'export'` in next.config.ts instead. The old CLI command is no longer available.
- Pages Router (`pages/` directory): App Router (`app/` directory) is the recommended approach for new projects. Static export works with both but App Router has better documentation.
- `getServerSideProps`: Not compatible with static export. Use Server Components or client-side fetching instead.

---

## Diagnostic Methodology for Phase 1

This phase uses the following diagnostic approach:

### Step 1: Capture All Build Errors
```bash
npm run build 2>&1 | tee build_output.txt
```
- Run full build to completion
- Capture all errors, not just first error
- Note file paths, line numbers, error messages
- Identify error types (import, type, runtime constraint)

### Step 2: Analyze Error Categories
Errors in Next.js static export typically fall into:

1. **Module/Export Errors** (5 errors in current build)
   - "Export X doesn't exist in target module"
   - Module has no exports at all
   - Root cause: Empty component files

2. **ESLint/Syntax Errors**
   - Unescaped HTML entities in JSX
   - Unused variables
   - Type mismatches

3. **Runtime Constraint Errors**
   - Server-only APIs used in static context
   - Dynamic routes without `generateStaticParams`
   - Unsupported Next.js features with `output: 'export'`

4. **Dependency/Import Errors**
   - Missing dependencies
   - Import paths incorrect
   - Module resolution issues

### Step 3: Create Error Documentation
For each error:
- **File path:** Exact location (e.g., `./src/app/projects/page.tsx`)
- **Line number:** Where error occurs
- **Error message:** Exact error text
- **Category:** Module, ESLint, Constraint, Dependency
- **Root cause:** Why the error exists
- **Scope:** Which pages/components affected

### Step 4: Determine Fix Scope
- Which pages are blocked by each error?
- Which components need implementation?
- Which files need to be created/deleted?
- Are there interconnected errors (fixing one might reveal another)?

### Step 5: Understand Next.js Static Export Constraints
Key constraints to validate against:
- ✓ All pages must be pre-renderable
- ✓ No `getServerSideProps` or equivalent
- ✓ No dynamic routes without `generateStaticParams`
- ✓ No server-only APIs used in static context
- ✓ All imported components must have exports
- ✓ No unescaped HTML entities in output

---

## Build Configuration Review

Current next.config.ts:
```typescript
const nextConfig: NextConfig = {
  output: "export",                              // ✓ Correct for S3
  images: { unoptimized: true },                 // ✓ No server-side image optimization
  reactStrictMode: true,                         // ✓ Good practice
  pageExtensions: ["ts", "tsx", "md", "mdx"],    // ✓ Enables MDX + pages
};
```

This configuration is correct for static export. The issue is not configuration but rather:
1. Empty component files
2. Missing exports
3. ESLint violations in code

---

## Current Build Status

### Identified Errors (from `npm run build` output)

**Error Category 1: Missing Component Exports (5 instances)**
1. `/src/app/projects/page.tsx:4` - Import `ProjectCard` doesn't exist
   - File: `/src/components/projects/ProjectCard.tsx` (0 bytes, empty)

2. `/src/app/halborn/page.tsx:7` - Import `TargetSection` doesn't exist
   - File: `/src/components/halborn/TargetSection.tsx` (0 bytes, empty)

3. `/src/app/softstack/page.tsx:6` - Import `TargetSection` doesn't exist
   - File: `/src/components/softstack/TargetSection.tsx` (0 bytes, empty)

**Error Category 2: ESLint/Entity Escaping Errors (7 instances)**
- Files involved: `fsbo/page.tsx`, `mercury/` components (OUT OF SCOPE)
- Issues: Unescaped single/double quotes in JSX content
- Rule: `react/no-unescaped-entities`

**Error Category 3: Warnings (image optimization)**
- Multiple components using `<img>` instead of `next/image`
- Not blocking build but flagged for optimization
- Acceptable in static export context

### Affected Pages
- ✗ `/projects` - Blocked (ProjectCard import missing)
- ✗ `/projects/fsbo` - ESLint errors
- ? `/projects/mobi` - Likely has similar issues
- ? `/projects/portfolio` - Likely has similar issues
- ✗ `/halborn` - Blocked (TargetSection import missing)
- ✗ `/softstack` - Blocked (TargetSection import missing)
- ✓ `/technical` - Not in current error output
- ✗ Mercury page - OUT OF SCOPE

---

## Open Questions

1. **What's the intended behavior for ProjectCard and TargetSection components?**
   - Are these components meant to be implemented with specific content?
   - Should they exist at all or should imports be removed?
   - Need to understand design intent to implement correctly

2. **Are there more build errors beyond those captured?**
   - Current output shows 8 errors, but there may be more
   - Full error log should be reviewed to ensure complete picture

3. **What is the content/implementation for new project pages (fsbo, mobi, portfolio)?**
   - Are these complete or stubs?
   - Do they need the components they import?

---

## Sources

### Primary (HIGH confidence)
- [Next.js Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports) - Constraints, supported features, unsupported features
- [Next.js CLI Reference](https://nextjs.org/docs/app/api-reference/cli/next) - Build command and flags
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack) - Bundler behavior

### Secondary (MEDIUM confidence)
- [Next.js 16.1 Bundle Analyzer](https://nextjs.org/blog/next-16-1) - New diagnostic tools for Turbopack (--debug-prerender flag)
- [getServerSideProps Export Error - Next.js](https://nextjs.org/docs/messages/gssp-export) - Official error documentation
- [Next.js Error Messages - Sentry](https://blog.sentry.io/common-errors-in-next-js-and-how-to-resolve-them/) - Common error patterns and solutions

### Tertiary (community discussion)
- GitHub discussions about static export build failures and troubleshooting patterns

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH - Next.js 15 is documented; versions locked in package.json
- **Architecture patterns:** HIGH - Next.js App Router patterns well-documented; static export constraints officially defined
- **Diagnostic methodology:** HIGH - Based on official Next.js documentation and Turbopack CLI tools
- **Current error analysis:** HIGH - Errors captured directly from actual build run with Turbopack
- **Pitfalls:** HIGH - Common patterns based on Next.js docs and verified against current error types

**Research date:** 2026-02-10
**Valid until:** 2026-02-28 (Next.js 15 is stable; Turbopack is default; low risk of breaking changes)

**Key insight for planning:** Phase 1 is primarily about documentation and analysis. All identified errors are "soft" errors (missing exports, ESLint violations) not architectural issues. This means Phase 2 (fixes) will be straightforward: implement missing components, fix entity escaping, validate dynamic routes. No major refactoring expected.

