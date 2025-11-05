# PowerPoint Generator

Standalone Node.js script to generate PowerPoint (.pptx) presentations matching the Mongoose presentation layout. Compatible with PowerPoint Desktop, PowerPoint Online, and Google Slides.

## Installation

```bash
cd powerpoint-generator
npm install
```

## Usage

### Basic Usage

Generate a presentation using the default `config.json`:

```bash
node build-powerpoint.mjs
```

The presentation will be saved to `./output/Monsters_University_Expansion_Plan.pptx`

### Custom Configuration

Use a custom config file:

```bash
node build-powerpoint.mjs --config custom-config.json
```

### Custom Output

Specify a custom output directory:

```bash
node build-powerpoint.mjs --output ./presentations/
```

Specify a custom filename:

```bash
node build-powerpoint.mjs --filename "My_Presentation.pptx"
```

Combine options:

```bash
node build-powerpoint.mjs --config custom-config.json --output ./presentations/ --filename "Custom_Name.pptx"
```

## Configuration

Edit `config.json` to customize:

- **Colors**: All color values used in the presentation
- **Fonts**: Font families for headings and body text
- **Sizes**: Font sizes for title, headings, and body
- **Design**: Border radius, shadows, margins, padding
- **Presentation**: Title, subtitle, author, and all section content
- **Output**: Default filename and directory

### Customizing Colors

```json
{
  "colors": {
    "black": "#100f0f",
    "white": "#ffffff",
    "accent": "#23ddbe",
    ...
  }
}
```

### Customizing Content

Edit the `presentation.sections` array in `config.json`. Each section has a `type` field:

- `intro` - Current State & Context slide
- `strategic` - Strategic priority alignment slides
- `twoColumn` - Two-column layout slides
- `content` - Single content column slides
- `divider` - Section divider slides (black background)
- `closing` - Closing slide with contact info

## Slide Types

### Title Slide
- Black background
- Large centered title
- Subtitle and author credit

### Intro Slide
- Two-column layout showing customer and university profiles

### Strategic Alignment Slides
- Left: Priority title and description
- Right: Mongoose platform alignment and opportunities

### Two-Column Slides
- Side-by-side columns with lists
- Alternating white/gray backgrounds

### Content Slides
- Left: Section title
- Right: Content box with text

### Divider Slides
- Black background
- Large title and subtitle

### Closing Slide
- Black background
- Closing message and contact information

## Requirements

- Node.js 18+ (for ES modules support)
- pptxgenjs (installed via `npm install`)

## Output

The generated `.pptx` file is compatible with:
- Microsoft PowerPoint (Desktop)
- Microsoft PowerPoint Online
- Google Slides (via import)

## Troubleshooting

If you encounter errors:

1. Ensure Node.js 18+ is installed: `node --version`
2. Ensure dependencies are installed: `npm install`
3. Check that `config.json` is valid JSON
4. Verify output directory permissions

## Examples

See `config.json` for the complete default configuration with all placeholder content matching the web presentation.

