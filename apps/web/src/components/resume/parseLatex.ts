import fs from "node:fs";
import path from "node:path";
import type { ResumeData, ResumeItem, ResumeSection } from "./ResumeTypes";

// Very pragmatic parser tailored to the provided resume.cls/template.tex style.
// It extracts: contact name (from \name{} and \address{}), sections via rSection, and items via rSubsection/\item.

export function parseResumeLatex(filePath: string): ResumeData {
  const raw = fs.readFileSync(filePath, "utf8");
  const normalized = raw.replace(/\r\n/g, "\n");

  const contact = extractContact(normalized);
  const sections = extractSections(normalized);

  return {
    contact,
    sections,
  };
}

function extractContact(src: string) {
  const name = matchFirst(src, /\\name\{([^}]*)\}/);
  const addresses = Array.from(src.matchAll(/\\address\{([^}]*)\}/g)).map((m) => m[1].replace(/\\\\/g, " ").trim());
  const location = addresses[0];
  const contactLine = addresses[1] || "";
  const email = (contactLine.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [""])[0];
  const phone = (contactLine.match(/(?:\+?\d[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/) || [""])[0];
  return {
    name: name || "",
    location: location || undefined,
    email: email || undefined,
    phone: phone || undefined,
  };
}

function extractSections(src: string): ResumeSection[] {
  const sections: ResumeSection[] = [];
  const sectionRegex = /\\begin\{rSection\}\{([^}]*)\}([\s\S]*?)\\end\{rSection\}/g;
  let m: RegExpExecArray | null;
  while ((m = sectionRegex.exec(src))) {
    const heading = cleanupText(m[1]);
    const body = m[2];
    let items = extractSubsections(body);
    // If no rSubsection, try to interpret direct \item bullets as summary
    if (items.length === 0) {
      const bullets = Array.from(body.matchAll(/\\item\s+([\s\S]*?)(?=(\\item|\\end\{rSection\}|\\begin\{rSubsection\}))/g)).map((b) => cleanupText(b[1]));
      if (bullets.length > 0) {
        items.push({ bullets });
      }
    }
    // Special handling for Education and Technical Strengths if present as inline content
    const lower = heading.toLowerCase();
    if (lower.includes("education") && items.length === 0) {
      const edu = parseEducation(body);
      if (edu) items = [edu];
    }
    if ((lower.includes("technical") || lower.includes("strengths")) && items.length === 0) {
      const tech = parseTechnicalStrengths(body);
      if (tech.length > 0) items = [{ bullets: tech }];
    }
    sections.push({ heading, items });
  }
  return sections;
}

function parseEducation(body: string): ResumeItem | undefined {
  // Example lines:
  // \textbf{University of Washington} \hfill June 2016 \\
  // B.S. in Physiology\\
  const uniMatch = body.match(/\\textbf\{([^}]*)\}[^\n]*?\hfill\s*([^\\\n]*)/);
  const degreeMatch = body.match(/\n\s*([^\n]*?Physiology[^\n]*)/i) || body.match(/\n\s*([^\n]*?B\.[^\n]*)/i);
  if (!uniMatch) return undefined;
  const company = cleanupText(uniMatch[1]);
  const end = cleanupText((uniMatch[2] || "").trim());
  const role = cleanupText((degreeMatch ? degreeMatch[1] : "").trim());
  return { company, role, end };
}

function parseTechnicalStrengths(body: string): string[] {
  // Extract rows inside tabular if present
  const tab = body.match(/\\begin\{tabular\}[\s\S]*?\n([\s\S]*?)\\end\{tabular\}/);
  const rowsBlock = tab ? tab[1] : body;
  const rows: string[] = [];
  const rowRegex = /(.*)\\\\/g;
  let rm: RegExpExecArray | null;
  while ((rm = rowRegex.exec(rowsBlock))) {
    const rawRow = rm[1];
    const trimmed = rawRow.trim();
    if (!trimmed || trimmed.startsWith("%")) continue;
    const idx = findUnescapedAmp(trimmed);
    if (idx === -1) continue;
    const keyRaw = trimmed.slice(0, idx);
    const valRaw = trimmed.slice(idx + 1);
    const key = cleanupText(keyRaw);
    const value = cleanupText(valRaw);
    if (key) rows.push(`${key}: ${value}`);
  }
  return rows;
}

function findUnescapedAmp(s: string): number {
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '&') {
      // count preceding backslashes
      let bs = 0;
      let j = i - 1;
      while (j >= 0 && s[j] === '\\') {
        bs++;
        j--;
      }
      if (bs % 2 === 0) return i; // even number of backslashes → unescaped
    }
  }
  return -1;
}

function extractSubsections(body: string): ResumeItem[] {
  const items: ResumeItem[] = [];
  // Remove inline size commands that introduce nested braces inside arguments
  const sanitized = body.replace(/\\relsize\{[^}]*\}/g, "");
  const subRegex = /\\begin\{rSubsection\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{rSubsection\}/g;
  let s: RegExpExecArray | null;
  while ((s = subRegex.exec(sanitized))) {
    const company = cleanupText(stripSizeCommands(s[1]));
    const sectionDates = cleanupText(s[2]);
    const roleArg = cleanupText(stripSizeCommands(s[3]));
    const location = cleanupText(s[4]);
    const content = s[5];

    // Find italic role headers with positions
    const italics: Array<{ text: string; index: number; endIndex: number }> = [];
    const italicRegex = /\\textit\{([\s\S]*?)\}/g;
    let im: RegExpExecArray | null;
    while ((im = italicRegex.exec(content))) {
      italics.push({ text: cleanupText(im[1]), index: im.index, endIndex: italicRegex.lastIndex });
    }

    // Find bullets with positions; stop at next \item or \textit or subsection end
    const bulletsMatches: Array<{ text: string; index: number }> = [];
    const bulletRegex = /\\item\s+([\s\S]*?)(?=(\\item|\\textit\{|$))/g;
    let bm: RegExpExecArray | null;
    while ((bm = bulletRegex.exec(content))) {
      bulletsMatches.push({ text: cleanupText(bm[1]), index: bm.index });
    }

    // Build segments: first segment is before first italic (initial roleArg), then one per italic
    const segments: Array<{ header: string; start: number; end: number }> = [];
    if (italics.length === 0) {
      segments.push({ header: roleArg, start: 0, end: content.length });
    } else {
      segments.push({ header: roleArg, start: 0, end: italics[0].index });
      for (let i = 0; i < italics.length; i++) {
        const segStart = italics[i].endIndex;
        const segEnd = i + 1 < italics.length ? italics[i + 1].index : content.length;
        segments.push({ header: italics[i].text, start: segStart, end: segEnd });
      }
    }

    for (const seg of segments) {
      const roleHeader = seg.header;
      const roleInfo = parseRoleAndDates(roleHeader);
      const segBullets = bulletsMatches
        .filter((b) => b.index >= seg.start && b.index < seg.end)
        .map((b) => b.text);
      const bullets = dedupe(segBullets);
      const { start, end } = roleInfo.start || roleInfo.end ? roleInfo : splitDates(sectionDates);
      items.push({ company, role: roleInfo.role, location, start, end, bullets });
    }
  }
  return items;
}

function splitDates(s: string) {
  const m = s.match(/(.+?)\s*-\s*(.+)/);
  if (!m) return { start: s || undefined, end: undefined };
  return { start: m[1].trim(), end: m[2].trim() };
}

function stripSizeCommands(s: string) {
  return s.replace(/\\relsize\{[^}]*\}/g, "");
}

function cleanupText(s: string) {
  // Protect escaped percent signs before removing LaTeX comments
  const PCT = "<<PERCENT_ESCAPED>>";
  return s
    .replace(/\\%/g, PCT)
    // Remove comments that start with an unescaped %
    .replace(/(^|[^\\])%.*$/gm, "$1")
    .replace(/\\&/g, "&")
    .replace(new RegExp(PCT, "g"), "%")
    .replace(/\\\$/g, "$")
    .replace(/\$\\cdot\$/g, "·")
    .replace(/\\_/g, "_")
    .replace(/\$\$/g, "$")
    .replace(/\\textit\{([^}]*)\}/g, "$1")
    .replace(/\\textbf\{([^}]*)\}/g, "$1")
    .replace(/\\hfill/g, " ")
    .replace(/\\smallskip/g, " ")
    .replace(/\\newpage|\\\\/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupe(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of arr) {
    const key = v.toLowerCase();
    if (!seen.has(key) && v.trim()) {
      seen.add(key);
      out.push(v);
    }
  }
  return out;
}

function matchFirst(src: string, re: RegExp): string | undefined {
  const m = src.match(re);
  return m ? m[1] : undefined;
}

export function getTemplatePath() {
  return path.join(process.cwd(), "src", "app", "resume", "resources", "template.tex");
}

function parseRoleAndDates(text: string): { role: string; start?: string; end?: string } {
  // Attempt to split on middle dot separator: "Role · start - end"
  const dotIdx = text.lastIndexOf("·");
  if (dotIdx !== -1) {
    const role = text.slice(0, dotIdx).trim();
    const datePart = text.slice(dotIdx + 1).trim();
    const { start, end } = splitDates(datePart);
    return { role, start, end };
  }
  // Fallback: find last hyphen-separated range
  const m = text.match(/(.+?)\s*[–—-]\s*(.+)/);
  if (m) {
    // Heuristic: if right side looks like a year or mm/yy, treat as dates
    const right = m[2].trim();
    if (/\d/.test(right)) {
      return { role: m[1].trim(), ...splitDates(m[0].replace(m[1], "").trim()) } as any;
    }
  }
  return { role: text.trim() };
}


