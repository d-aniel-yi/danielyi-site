#!/usr/bin/env node

import PptxGenJS from 'pptxgenjs';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    config: 'config.json',
    output: './output',
    filename: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node build-powerpoint.mjs [options]

Options:
  --config <path>     Use custom config file (default: config.json)
  --output <path>      Custom output directory (default: ./output)
  --filename <name>   Custom filename (default: from config.json)
  --help, -h           Show this help message

Examples:
  node build-powerpoint.mjs
  node build-powerpoint.mjs --config custom-config.json
  node build-powerpoint.mjs --filename "My_Presentation.pptx"
  node build-powerpoint.mjs --output ./presentations/
`);
      process.exit(0);
    } else if (args[i] === '--config' && args[i + 1]) {
      options.config = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--filename' && args[i + 1]) {
      options.filename = args[i + 1];
      i++;
    }
  }

  return options;
}

// Helper: Convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper: Convert RGB to hex for pptxgenjs (it uses hex strings)
function rgbToHex(rgb) {
  if (!rgb) return '000000';
  return `${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
}

// Helper: Load config file
function loadConfig(configPath) {
  try {
    const fullPath = resolve(__dirname, configPath);
    const content = readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading config file: ${error.message}`);
    process.exit(1);
  }
}

// Helper: Ensure directory exists
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Helper: Get color hex string for pptxgenjs
function getColorHex(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb);
}

// Create title slide
function createTitleSlide(pres, config) {
  const slide = pres.addSlide();
  const colors = config.colors;
  
  slide.background = { color: getColorHex(colors.black) };
  
  slide.addText(config.presentation.title, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1.5,
    fontSize: config.sizes.title,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.white),
    bold: true,
    align: 'center',
    valign: 'middle',
  });

  slide.addText(config.presentation.subtitle, {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 0.8,
    fontSize: config.sizes.body + 4,
    fontFace: config.fonts.body,
    color: getColorHex(colors.gray),
    align: 'center',
    valign: 'middle',
  });

  slide.addText(config.presentation.author, {
    x: 0.5,
    y: 6,
    w: 9,
    h: 0.5,
    fontSize: config.sizes.body - 2,
    fontFace: config.fonts.body,
    color: getColorHex(colors.gray),
    align: 'center',
    valign: 'middle',
  });
}

// Create intro slide
function createIntroSlide(pres, config, sectionData) {
  const slide = pres.addSlide();
  const colors = config.colors;
  const design = config.design;
  
  slide.background = { color: getColorHex(colors.white) };
  
  // Title
  slide.addText(sectionData.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: config.sizes.heading + 6,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
    align: 'center',
  });

  // Subtitle
  if (sectionData.subtitle) {
    slide.addText(sectionData.subtitle, {
      x: 0.5,
      y: 1.4,
      w: 9,
      h: 0.4,
      fontSize: config.sizes.body + 2,
      fontFace: config.fonts.body,
      color: getColorHex(colors.gray),
      align: 'center',
    });
  }

  // Left column - Customer Profile
  const leftBox = {
    x: 0.5,
    y: 2.2,
    w: 4.5,
    h: 4.5,
  };

  slide.addShape(pres.ShapeType.rect, {
    ...leftBox,
    fill: { color: getColorHex(colors.white) },
    line: { color: getColorHex(colors.gray), width: design.borderWidth },
    rectRadius: design.borderRadius,
  });

  slide.addText('Current Customer Profile', {
    x: leftBox.x + design.padding,
    y: leftBox.y + design.padding,
    w: leftBox.w - (design.padding * 2),
    h: 0.5,
    fontSize: config.sizes.heading - 8,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
  });

  let yPos = leftBox.y + 1;
  const profile = sectionData.customerProfile;
  
  slide.addText(`Current ARR: ${profile.currentARR}`, {
    x: leftBox.x + design.padding,
    y: yPos,
    w: leftBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.darkGray),
  });

  yPos += 0.6;
  slide.addText('Current Products:', {
    x: leftBox.x + design.padding,
    y: yPos,
    w: leftBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.black),
    bold: true,
  });

  yPos += 0.5;
  profile.currentProducts.forEach((product, idx) => {
    slide.addText(`• ${product}`, {
      x: leftBox.x + design.padding + 0.2,
      y: yPos + (idx * 0.4),
      w: leftBox.w - (design.padding * 2),
      h: 0.4,
      fontSize: config.sizes.body,
      fontFace: config.fonts.body,
      color: getColorHex(colors.darkGray),
    });
  });

  yPos += profile.currentProducts.length * 0.4 + 0.3;
  slide.addText(`Status: ${profile.status}`, {
    x: leftBox.x + design.padding,
    y: yPos,
    w: leftBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.darkGray),
  });

  // Right column - University Profile
  const rightBox = {
    x: 5.25,
    y: 2.2,
    w: 4.5,
    h: 4.5,
  };

  slide.addShape(pres.ShapeType.rect, {
    ...rightBox,
    fill: { color: getColorHex(colors.white) },
    line: { color: getColorHex(colors.gray), width: design.borderWidth },
    rectRadius: design.borderRadius,
  });

  slide.addText('University Profile', {
    x: rightBox.x + design.padding,
    y: rightBox.y + design.padding,
    w: rightBox.w - (design.padding * 2),
    h: 0.5,
    fontSize: config.sizes.heading - 8,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
  });

  yPos = rightBox.y + 1;
  const university = sectionData.universityProfile;
  
  slide.addText(`Student Population: ${university.studentPopulation}`, {
    x: rightBox.x + design.padding,
    y: yPos,
    w: rightBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.darkGray),
  });

  yPos += 0.6;
  slide.addText('Technology Stack:', {
    x: rightBox.x + design.padding,
    y: yPos,
    w: rightBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.black),
    bold: true,
  });

  yPos += 0.5;
  university.technologyStack.forEach((tech, idx) => {
    slide.addText(`• ${tech}`, {
      x: rightBox.x + design.padding + 0.2,
      y: yPos + (idx * 0.4),
      w: rightBox.w - (design.padding * 2),
      h: 0.4,
      fontSize: config.sizes.body,
      fontFace: config.fonts.body,
      color: getColorHex(colors.darkGray),
    });
  });

  yPos += university.technologyStack.length * 0.4 + 0.3;
  slide.addText(`Strategic Plan: ${university.strategicPlan}`, {
    x: rightBox.x + design.padding,
    y: yPos,
    w: rightBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.darkGray),
  });
}

// Create strategic alignment slide
function createStrategicAlignmentSlide(pres, config, priorityData, isEven) {
  const slide = pres.addSlide();
  const colors = config.colors;
  const design = config.design;
  
  slide.background = { color: getColorHex(isEven ? colors.white : colors.lightBackground) };
  
  // Left side - Priority info
  slide.addText(priorityData.priority, {
    x: 0.5,
    y: 1,
    w: 4.5,
    h: 1,
    fontSize: config.sizes.heading,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
  });

  slide.addText(priorityData.description, {
    x: 0.5,
    y: 2.2,
    w: 4.5,
    h: 1,
    fontSize: config.sizes.body + 2,
    fontFace: config.fonts.body,
    color: getColorHex(colors.gray),
  });

  // Right side - Mongoose alignment box
  const alignmentBox = {
    x: 5.25,
    y: 1,
    w: 4.5,
    h: 5.5,
  };

  slide.addShape(pres.ShapeType.rect, {
    ...alignmentBox,
    fill: { color: getColorHex(colors.white) },
    line: { color: getColorHex(colors.gray), width: design.borderWidth },
    rectRadius: design.borderRadius,
  });

  slide.addText('Mongoose Platform Alignment', {
    x: alignmentBox.x + design.padding,
    y: alignmentBox.y + design.padding,
    w: alignmentBox.w - (design.padding * 2),
    h: 0.4,
    fontSize: config.sizes.body - 2,
    fontFace: config.fonts.body,
    color: getColorHex(colors.gray),
    bold: true,
    isUpperCase: true,
  });

  slide.addText(priorityData.mongooseAlignment, {
    x: alignmentBox.x + design.padding,
    y: alignmentBox.y + 0.8,
    w: alignmentBox.w - (design.padding * 2),
    h: 2.5,
    fontSize: config.sizes.body,
    fontFace: config.fonts.body,
    color: getColorHex(colors.darkGray),
  });

  if (priorityData.opportunities && priorityData.opportunities.length > 0) {
    slide.addText('Expansion Opportunities:', {
      x: alignmentBox.x + design.padding,
      y: alignmentBox.y + 3.5,
      w: alignmentBox.w - (design.padding * 2),
      h: 0.4,
      fontSize: config.sizes.body - 2,
      fontFace: config.fonts.body,
      color: getColorHex(colors.gray),
      bold: true,
    });

    priorityData.opportunities.forEach((opp, idx) => {
      slide.addText(`• ${opp}`, {
        x: alignmentBox.x + design.padding + 0.2,
        y: alignmentBox.y + 4 + (idx * 0.4),
        w: alignmentBox.w - (design.padding * 2),
        h: 0.4,
        fontSize: config.sizes.body - 1,
        fontFace: config.fonts.body,
        color: getColorHex(colors.darkGray),
      });
    });
  }
}

// Create two-column slide
function createTwoColumnSlide(pres, config, sectionData, isEven) {
  const slide = pres.addSlide();
  const colors = config.colors;
  const design = config.design;
  
  slide.background = { color: getColorHex(isEven ? colors.white : colors.lightBackground) };
  
  // Title
  slide.addText(sectionData.title, {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: config.sizes.heading + 6,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
    align: 'center',
  });

  if (sectionData.subtitle) {
    slide.addText(sectionData.subtitle, {
      x: 0.5,
      y: 1.4,
      w: 9,
      h: 0.4,
      fontSize: config.sizes.body + 2,
      fontFace: config.fonts.body,
      color: getColorHex(colors.gray),
      align: 'center',
    });
  }

  // Left column
  const leftBox = {
    x: 0.5,
    y: 2.2,
    w: 4.5,
    h: 4.5,
  };

  slide.addShape(pres.ShapeType.rect, {
    ...leftBox,
    fill: { color: getColorHex(colors.white) },
    line: { color: getColorHex(colors.gray), width: design.borderWidth },
    rectRadius: design.borderRadius,
  });

  slide.addText(sectionData.leftColumn.title, {
    x: leftBox.x + design.padding,
    y: leftBox.y + design.padding,
    w: leftBox.w - (design.padding * 2),
    h: 0.5,
    fontSize: config.sizes.heading - 8,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
  });

  let yPos = leftBox.y + 1;
  sectionData.leftColumn.items.forEach((item, idx) => {
    slide.addText(`• ${item}`, {
      x: leftBox.x + design.padding + 0.2,
      y: yPos + (idx * 0.35),
      w: leftBox.w - (design.padding * 2),
      h: 0.35,
      fontSize: config.sizes.body,
      fontFace: config.fonts.body,
      color: getColorHex(colors.darkGray),
    });
  });

  // Right column
  const rightBox = {
    x: 5.25,
    y: 2.2,
    w: 4.5,
    h: 4.5,
  };

  slide.addShape(pres.ShapeType.rect, {
    ...rightBox,
    fill: { color: getColorHex(colors.white) },
    line: { color: getColorHex(colors.gray), width: design.borderWidth },
    rectRadius: design.borderRadius,
  });

  slide.addText(sectionData.rightColumn.title, {
    x: rightBox.x + design.padding,
    y: rightBox.y + design.padding,
    w: rightBox.w - (design.padding * 2),
    h: 0.5,
    fontSize: config.sizes.heading - 8,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
  });

  yPos = rightBox.y + 1;
  sectionData.rightColumn.items.forEach((item, idx) => {
    slide.addText(`• ${item}`, {
      x: rightBox.x + design.padding + 0.2,
      y: yPos + (idx * 0.35),
      w: rightBox.w - (design.padding * 2),
      h: 0.35,
      fontSize: config.sizes.body,
      fontFace: config.fonts.body,
      color: getColorHex(colors.darkGray),
    });
  });
}

// Create content slide
function createContentSlide(pres, config, sectionData, isEven) {
  const slide = pres.addSlide();
  const colors = config.colors;
  const design = config.design;
  
  slide.background = { color: getColorHex(isEven ? colors.white : colors.lightBackground) };
  
  // Left side - Title
  slide.addText(sectionData.title, {
    x: 0.5,
    y: 1,
    w: 4.5,
    h: 1,
    fontSize: config.sizes.heading,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.black),
    bold: true,
  });

  if (sectionData.subtitle) {
    slide.addText(sectionData.subtitle, {
      x: 0.5,
      y: 2.2,
      w: 4.5,
      h: 0.6,
      fontSize: config.sizes.body + 2,
      fontFace: config.fonts.body,
      color: getColorHex(colors.gray),
    });
  }

  // Right side - Content box
  const contentBox = {
    x: 5.25,
    y: 1,
    w: 4.5,
    h: 5.5,
  };

  slide.addShape(pres.ShapeType.rect, {
    ...contentBox,
    fill: { color: getColorHex(colors.white) },
    line: { color: getColorHex(colors.gray), width: design.borderWidth },
    rectRadius: design.borderRadius,
  });

  // Split content into lines for better formatting
  const lines = sectionData.content.split('\n');
  let yPos = contentBox.y + design.padding;
  
  lines.forEach((line, idx) => {
    if (line.trim()) {
      slide.addText(line.trim(), {
        x: contentBox.x + design.padding,
        y: yPos,
        w: contentBox.w - (design.padding * 2),
        h: 0.4,
        fontSize: config.sizes.body,
        fontFace: config.fonts.body,
        color: getColorHex(colors.darkGray),
      });
      yPos += 0.4;
    } else {
      yPos += 0.2; // Empty line spacing
    }
  });
}

// Create divider slide
function createDividerSlide(pres, config, sectionData) {
  const slide = pres.addSlide();
  const colors = config.colors;
  
  slide.background = { color: getColorHex(colors.black) };
  
  slide.addText(sectionData.title, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1.5,
    fontSize: config.sizes.heading + 10,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.white),
    bold: true,
    align: 'center',
    valign: 'middle',
  });

  if (sectionData.subtitle) {
    slide.addText(sectionData.subtitle, {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.8,
      fontSize: config.sizes.body + 6,
      fontFace: config.fonts.body,
      color: getColorHex(colors.accent),
      align: 'center',
      valign: 'middle',
    });
  }
}

// Create closing slide
function createClosingSlide(pres, config, sectionData) {
  const slide = pres.addSlide();
  const colors = config.colors;
  
  slide.background = { color: getColorHex(colors.black) };
  
  slide.addText(sectionData.title, {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.2,
    fontSize: config.sizes.heading + 14,
    fontFace: config.fonts.heading,
    color: getColorHex(colors.white),
    bold: true,
    align: 'center',
    valign: 'middle',
  });

  slide.addText(sectionData.subtitle, {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.8,
    fontSize: config.sizes.body + 10,
    fontFace: config.fonts.body,
    color: getColorHex(colors.accent),
    align: 'center',
    valign: 'middle',
  });

  slide.addText(`— ${sectionData.author}`, {
    x: 0.5,
    y: 5,
    w: 9,
    h: 0.5,
    fontSize: config.sizes.body + 4,
    fontFace: config.fonts.body,
    color: getColorHex(colors.lightGray),
    align: 'center',
  });

  if (sectionData.contact) {
    slide.addText(sectionData.contact.phone, {
      x: 0.5,
      y: 5.8,
      w: 9,
      h: 0.4,
      fontSize: config.sizes.body + 6,
      fontFace: config.fonts.body,
      color: getColorHex(colors.gray),
      align: 'center',
    });

    slide.addText(sectionData.contact.email, {
      x: 0.5,
      y: 6.3,
      w: 9,
      h: 0.4,
      fontSize: config.sizes.body + 6,
      fontFace: config.fonts.body,
      color: getColorHex(colors.gray),
      align: 'center',
    });
  }
}

// Main function
async function main() {
  console.log('Building PowerPoint presentation...');

  // Parse CLI arguments
  const cliOptions = parseArgs();

  // Load config
  const config = loadConfig(cliOptions.config);

  // Merge CLI overrides
  if (cliOptions.filename) {
    config.output.filename = cliOptions.filename;
  }
  if (cliOptions.output) {
    config.output.directory = cliOptions.output;
  }

  // Ensure output directory exists
  const outputDir = resolve(__dirname, config.output.directory);
  ensureDir(outputDir);

  // Initialize presentation
  const pres = new PptxGenJS();
  pres.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 });
  pres.layout = 'CUSTOM';

  // Generate slides
  let isEven = false;

  // Title slide
  createTitleSlide(pres, config);
  isEven = !isEven;

  // Process sections
  config.presentation.sections.forEach((section, index) => {
    switch (section.type) {
      case 'intro':
        createIntroSlide(pres, config, section);
        isEven = !isEven;
        break;
      case 'strategic':
        createStrategicAlignmentSlide(pres, config, section, isEven);
        isEven = !isEven;
        break;
      case 'twoColumn':
        createTwoColumnSlide(pres, config, section, isEven);
        isEven = !isEven;
        break;
      case 'content':
        createContentSlide(pres, config, section, isEven);
        isEven = !isEven;
        break;
      case 'divider':
        createDividerSlide(pres, config, section);
        break;
      case 'closing':
        createClosingSlide(pres, config, section);
        break;
    }
  });

  // Write file
  const outputPath = join(outputDir, config.output.filename);
  await pres.writeFile({ fileName: outputPath });

  console.log(`✓ Presentation generated successfully!`);
  console.log(`  Location: ${outputPath}`);
}

// Run
main().catch(error => {
  console.error('Error generating presentation:', error);
  process.exit(1);
});

