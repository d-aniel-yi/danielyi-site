# Color Palette — Names and Usage

| Hex     | Name      | Tone/Feel           | Primary use cases |
|---------|-----------|---------------------|-------------------|
| #F5F1E9 | Parchment | warm off‑white      | Page background (light), hero/text on dark, card surfaces in dark |
| #161D18 | Ink       | near‑black greenish | Body text (light), page background (dark), overlays |
| #736355 | Walnut    | warm taupe          | Headings/eyebrow text, borders, subtle icons |
| #697358 | Sage      | muted green‑gray    | Secondary actions, success/subtle accents |
| #4C5D4A | Evergreen | deep green          | Primary accent, buttons/links, focus rings |
| #EDCEAF | Sand      | warm highlight      | Callouts, tags, underline accents |

Notes
- Parchment ↔ Ink are the core contrast pair (light ↔ dark) for backgrounds and body text.
- Evergreen works well for CTAs on Parchment; ensure contrast for small text.
- Walnut and Sage are supporting neutrals: good for secondary text and borders, not long‑form body copy.

## Semantic tokens (CSS custom properties)

```css
:root {
  /* base palette */
  --color-paper: #F5F1E9;  /* Parchment */
  --color-ink: #161D18;    /* Ink */
  --color-walnut: #736355; /* Walnut */
  --color-sage: #697358;   /* Sage */
  --color-evergreen: #4C5D4A; /* Evergreen */
  --color-sand: #EDCEAF;   /* Sand */

  /* semantic */
  --bg: var(--color-paper);
  --fg: var(--color-ink);
  --accent: var(--color-evergreen);
  --muted-fg: color-mix(in oklab, var(--fg), transparent 35%);
  --border: color-mix(in oklab, var(--fg), transparent 85%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: var(--color-ink);
    --fg: var(--color-paper);
    --muted-fg: color-mix(in oklab, var(--fg), transparent 35%);
    --border: color-mix(in oklab, var(--fg), transparent 85%);
  }
}
```

## Usage guidance
- Backgrounds: `--bg` (Parchment in light, Ink in dark). Cards in dark: translucent mixes.
- Text: primary `--fg`, secondary `--muted-fg`.
- Accents: `--accent` (Evergreen) for buttons/links/focus; `--color-sand` for highlights.
- Borders: `--border` or Walnut at low opacity.
#F5F1E9
#161D18
#736355
#697358
#4C5D4A
#EDCEAF
