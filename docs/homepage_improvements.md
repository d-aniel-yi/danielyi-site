### Homepage Improvements — Guided Journey Under the Hero

This document proposes several design concepts for a beautifully designed, guided “journey” section directly under the homepage hero. The goal is to preview and connect visitors to key site areas — `Resume`, `Projects`, `Technical`, `Letter`, and `Contact` — in a way that feels editorial, elegant, and fast.

## Objectives
- Lead visitors through a narrative sequence of highlights, inviting exploration.
- Showcase authentic snippets from each page to set expectations and build intrigue.
- Maintain performance (static-export friendly), accessibility, and responsiveness.
- Use the established palette and tone (Parchment/Ink/Evergreen; confident and concise).
- Enable experimentation via feature flags (variants) without code churn.

## Content Sources
- Snippets authored in MDX or colocated TS/JSON to keep page sections decoupled from the homepage.
- Each destination (`/resume`, `/projects`, `/technical`, `/letter`, `/contact`) provides a short teaser blurb (≤ 120 chars), an optional micro-asset (icon or small image), and a primary link.

### Suggested teaser shape
```ts
export type Teaser = {
  id: 'resume' | 'projects' | 'technical' | 'letter' | 'contact';
  title: string;            // Short label, e.g., "Resume"
  excerpt: string;          // ≤ 120 chars; editorial, metric-forward where possible
  href: `/${string}`;       // Target route
  accentColor?: string;     // Optional accent override (defaults to --accent)
  icon?: React.ReactNode;   // Small inline icon or SVG path ref
  image?: string;           // Optional small image (lazy)
};
```

## Design Concepts (Variants)

### Variant A — Narrative Strip (Horizontal Chapters)
An eye-level horizontal strip of “chapters” that gently scrolls on overflow, with strong focus/keyboard support. Each chapter is a wide card with title, 1–2 line excerpt, and a rightward affordance.

- Layout
  - Desktop: 5 cards in a row (edge-fading gradient hints more content). Card size ~280–320px width.
  - Tablet: 3–4 visible; Mobile: 1.1–1.3 per viewport with snap scrolling.
  - Cards adopt glass treatment over the hero’s lower edge or a parchment section background.
- Motion
  - On hover/focus: subtle translate-y (2–4px) and glass highlight; arrow nudge →.
  - Reduced motion: opacity-only emphasis; no translation.
- Visual language
  - Background: `--bg` (Parchment in light, Ink in dark).
  - Text: `--fg` primary, `--muted-fg` for excerpts; underline/arrow uses `--accent`.
  - Borders use `--border`; rounded corners with subtle inner shadow.
- Accessibility
  - Entire card is a single link; visible focus ring (2px) using `--accent` with offset.
  - Scroll area announces position (x of y) via `aria-roledescription` + live region optional.
- Performance
  - No heavy JS; CSS scroll snap + small icons; images lazy with intrinsic sizing.
- Implementation notes
  - Component: `JourneyStrip` + `ChapterCard`.
  - Static props from a local `teasers.ts` or MDX exports.
  - Flag: `enableHomepageJourney` with variant `journeyVariant = 'strip'`.
- Pros
  - Strong sense of forward motion; playful and modern.
- Cons
  - Horizontal scroll patterns can be missed if not hinted well.

### Variant B — Stacked Editorial Modules (Vertical Reveal)
Five vertically stacked mini-sections, each with a distinct yet cohesive layout (asymmetry), creating a magazine-like flow.

- Layout
  - Each module alternates media/text alignment; consistent vertical rhythm (e.g., 64–80px gaps).
  - Cards sit on parchment with soft dividers using `--border`.
- Motion
  - On reveal: small fade + scale-in of the headline underline; staggered by 60–90ms.
  - Reduced motion: no transforms.
- Visual language
  - Headings in display serif; excerpts in muted sans; accent underline in Evergreen.
- Accessibility
  - Modules are semantic sections with heading hierarchy (h2/h3) and single primary link.
- Performance
  - Static content; optional small inline SVG icons; no carousels.
- Implementation notes
  - Component: `JourneyStack` with `SectionTeaser` variations.
  - Flag: `journeyVariant = 'stack'`.
- Pros
  - Clear, accessible, SEO-friendly; great for readers who scroll.
- Cons
  - Taller page; pushes subsequent sections further down.

### Variant C — Timeline “Your path through the site”
Displays a vertical timeline with five steps (dots/nodes), each node containing a teaser and a CTA. Feels purposeful and linear.

- Layout
  - Vertical line centered or left-aligned; alternating nodes left/right on desktop.
  - Mobile collapses to single column with line on the left.
- Motion
  - Node highlight on hover/focus; gentle pulse on the next recommended step.
  - Reduced motion: color/weight changes only.
- Visual language
  - Line and nodes use Walnut/Sage neutrals; active node uses Evergreen.
- Accessibility
  - Render as `<ol>` with 1–5; announce number and destination.
- Performance
  - Pure CSS with lightweight SVG; minimal interactivity.
- Implementation notes
  - Component: `JourneyTimeline`.
  - Flag: `journeyVariant = 'timeline'`.
- Pros
  - Strong sense of guided progression; visually distinct.
- Cons
  - Implies strict sequence; may not reflect free exploration.

### Variant D — Grid of Curated Moments (Matrix)
A clean 2×3 responsive grid (one item spans 2× width as a hero) showcasing concise teasers with subtle imagery.

- Layout
  - Desktop: 3 columns; the featured (e.g., Resume) spans two columns.
  - Tablet: 2 columns; Mobile: single column stack.
- Motion
  - Hover/focus: background glass intensity and underline draw; arrow slide 2–4px.
- Visual language
  - Cards with translucent backgrounds in dark; parchment cards in light; consistent border radius.
- Accessibility
  - Single-link cards; clear focus states; reading order matches visual order.
- Performance
  - Static grid; small images only where helpful.
- Implementation notes
  - Component: `JourneyGrid` + `TeaserCard`.
  - Flag: `journeyVariant = 'grid'`.
- Pros
  - Scannable; balanced density and clarity.
- Cons
  - Less narrative than timeline/strip.

### Variant E — Chapter Carousel (Auto-advancing, Optional)
An accessible carousel with five slides, each slide a full-width teaser panel. Auto-advance disabled by default; enable as an experiment.

- Layout
  - Each slide occupies the full content width below hero; pagination dots and next/prev controls.
- Motion
  - Slide transition between panels; reduced motion swaps to fade-only.
- Accessibility
  - Buttons have labels; slides are announced; keyboard operable.
- Performance
  - Prefer CSS snap; if JS carousel is used, keep bundle small and defer.
- Implementation notes
  - Component: `JourneyCarousel` (only if needed; otherwise defer).
  - Flag: `journeyVariant = 'carousel'`.
- Pros
  - Focused storytelling per panel.
- Cons
  - Carousels are often skipped; complexity higher.

## Copy Guidance (per destination)
- **Resume**: “The facts, fast. Roles, impact, and quantified wins.”
- **Projects**: “Selected builds and experiments — a taste of what I ship.”
- **Technical**: “Architecture, tradeoffs, and telemetry — choices explained.”
- **Letter**: “Who I am and why I build — concise and candid.”
- **Contact**: “Say hello — I read every note.”

Keep excerpts ≤ 120 chars; favor metrics and specificity over adjectives.

## Visual & Theming Notes
- Use palette tokens from `docs/color_palette.md`:
  - Background `--bg`, foreground `--fg`, muted `--muted-fg`, border `--border`, accent `--accent`.
- Ensure 4.5:1 contrast for body text; 3:1 for large headings where allowable.
- Focus ring: 2px `--accent` with 2px offset; avoid outline suppression.

## Accessibility & Motion
- Keyboard-first interaction: each card is one link with visible focus states.
- Honors `prefers-reduced-motion`: disable transforms; use opacity and color changes only.
- Semantic structure (sections/headings/lists) to aid screen readers.

## Performance Considerations
- Static data: import local teaser content at build time; no client fetch.
- Avoid heavy libs; rely on CSS scroll snap and transitions.
- Lazy-load optional images; prefetch destination routes via Next.js when idle.

## Feature Flags & Experimentation
- Primary toggle: `enableHomepageJourney` (default on in prod once validated).
- Variant flag: `journeyVariant` with values `strip | stack | timeline | grid | carousel`.
- Metrics to monitor:
  - Teaser click-through rate (CTR) by destination and variant.
  - Dwell time on landing section and scroll depth to next section.
  - Downstream conversions (e.g., contact submissions).

## Implementation Plan (Incremental)
1) Data & flags
   - Add `apps/web/src/content/teasers.ts` with five `Teaser` items.
   - Add LaunchDarkly defaults in code; wire `useFlags()` to pick variant.
2) MVP variant
   - Build Variant D (`JourneyGrid`) first for simplicity and clarity.
   - Integrate under the hero in `apps/web/src/app/page.tsx` (or the relevant hero page).
3) Polish & a11y
   - Focus states, reduced motion, high-contrast audit; responsive tuning.
4) Experiment
   - Implement Variant A (`JourneyStrip`) and Variant B (`JourneyStack`).
   - Run limited traffic experiment to compare CTR and engagement.
5) Follow-ups (optional)
   - Add subtle background motif or shader for capable devices; keep fallback pure CSS.

## Acceptance Criteria
- The homepage renders a guided journey section under the hero that previews Resume, Projects, Technical, Letter, and Contact with concise excerpts and links.
- Meets a11y baseline (keyboard/focus/reduced motion) and passes Lighthouse ≥ 90.
- Static-export compatible; no client data fetch for teasers.
- Feature-flagged with at least two variants selectable at runtime.

## Risks & Mitigations
- Over-animated UI could harm clarity → keep motion subtle; honor reduced motion.
- Horizontal scroll discoverability (Variant A) → edge fade hints and visible scrollbars.
- Content staleness → co-locate teaser snippets with their pages or central `teasers.ts` reviewed alongside page edits.

## Component Sketches (high-level)
```tsx
// JourneyGrid.tsx
export function JourneyGrid({ items }: { items: Teaser[] }) { /* ... */ }

// JourneyStrip.tsx
export function JourneyStrip({ items }: { items: Teaser[] }) { /* ... */ }

// JourneyStack.tsx
export function JourneyStack({ items }: { items: Teaser[] }) { /* ... */ }

// JourneyTimeline.tsx
export function JourneyTimeline({ items }: { items: Teaser[] }) { /* ... */ }
```

## Next Steps
- Decide on the initial shipped variant (recommend: `grid`).
- Draft final copy for five teasers.
- Implement MVP and QA across devices; then add a second variant and enable experiment.



