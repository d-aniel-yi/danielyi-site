import { useState, useCallback } from "react";
import { useSQLQuery } from "./duckdb-provider";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from "recharts";

const N = (v: unknown): number => (v != null ? Number(v) : 0);

// ── Export helper: render element to canvas via html2canvas-style approach ──
function exportElement(
  elementId: string,
  filename: string,
  fmt: "svg" | "png",
  title?: string,
  legendColors?: { label: string; color: string }[],
  scale = 2,
) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Find a Recharts SVG if present
  const chartSvg = el.querySelector("svg.recharts-surface") || el.querySelector("svg");

  if (chartSvg) {
    // ── SVG-native export path (Recharts charts) ──
    const svgRect = chartSvg.getBoundingClientRect();
    const svgW = Math.ceil(svgRect.width);
    const svgH = Math.ceil(svgRect.height);
    const titleH = title ? 28 : 0;
    const legendH = legendColors && legendColors.length > 0 ? 30 : 0;
    const pad = 16;
    const totalW = svgW + pad * 2;
    const totalH = svgH + titleH + legendH + pad * 2;

    const clone = chartSvg.cloneNode(true) as SVGElement;
    // Add background
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", String(totalW));
    bg.setAttribute("height", String(totalH));
    bg.setAttribute("fill", "#0a0f1a");

    // Build wrapper SVG
    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    wrapper.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    wrapper.setAttribute("width", String(totalW));
    wrapper.setAttribute("height", String(totalH));
    wrapper.appendChild(bg);

    // Title
    if (title) {
      const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      titleEl.setAttribute("x", String(pad));
      titleEl.setAttribute("y", String(pad + 16));
      titleEl.setAttribute("fill", "#cbd5e1");
      titleEl.setAttribute("font-size", "15");
      titleEl.setAttribute("font-family", "Georgia, 'Times New Roman', serif");
      titleEl.textContent = title;
      wrapper.appendChild(titleEl);
    }

    // Embed the chart SVG via <g> transform
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.setAttribute("width", String(svgW));
    clone.setAttribute("height", String(svgH));
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${pad}, ${pad + titleH})`);
    // Move clone contents into the group via foreignObject-free nesting
    g.innerHTML = `<svg width="${svgW}" height="${svgH}">${clone.innerHTML}</svg>`;
    // Copy defs
    const defs = clone.querySelector("defs");
    if (defs) wrapper.appendChild(defs.cloneNode(true));
    wrapper.appendChild(g);

    // Legend
    if (legendColors && legendColors.length > 0) {
      let lx = pad;
      const ly = pad + titleH + svgH + 14;
      legendColors.forEach(({ label, color }) => {
        const swatch = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        swatch.setAttribute("x", String(lx));
        swatch.setAttribute("y", String(ly - 8));
        swatch.setAttribute("width", "10");
        swatch.setAttribute("height", "10");
        swatch.setAttribute("rx", "2");
        swatch.setAttribute("fill", color);
        wrapper.appendChild(swatch);
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", String(lx + 14));
        txt.setAttribute("y", String(ly));
        txt.setAttribute("fill", "#94a3b8");
        txt.setAttribute("font-size", "11");
        txt.setAttribute("font-family", "'Courier New', monospace");
        txt.textContent = label;
        wrapper.appendChild(txt);
        lx += 14 + label.length * 7 + 16;
      });
    }

    const svgStr = new XMLSerializer().serializeToString(wrapper);

    if (fmt === "svg") {
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${filename}.svg`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = totalW * scale; canvas.height = totalH * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `${filename}.png`; a.click();
          URL.revokeObjectURL(url);
        }, "image/png");
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    }
  } else {
    // ── HTML element export (tables, heatmaps, etc.) ──
    const clone = el.cloneNode(true) as HTMLElement;
    // Inline computed styles for faithful reproduction
    const inlineStyles = (source: Element, target: Element) => {
      const computed = window.getComputedStyle(source);
      const t = target as HTMLElement;
      for (let i = 0; i < computed.length; i++) {
        const prop = computed[i];
        t.style.setProperty(prop, computed.getPropertyValue(prop));
      }
      for (let i = 0; i < source.children.length; i++) {
        if (target.children[i]) inlineStyles(source.children[i], target.children[i]);
      }
    };
    inlineStyles(el, clone);
    // Strip buttons from export
    clone.querySelectorAll("[data-export-hide]").forEach((n) => n.remove());

    // Build HTML string with title + legend
    let html = "";
    if (title) {
      html += `<div style="color:#cbd5e1;font-size:15px;font-weight:400;margin-bottom:8px;font-family:Georgia,'Times New Roman',serif;">${title}</div>`;
    }
    html += clone.outerHTML;
    if (legendColors && legendColors.length > 0) {
      html += `<div style="display:flex;flex-wrap:wrap;gap:12px;padding:8px 4px 2px;">`;
      legendColors.forEach(({ label, color }) => {
        html += `<div style="display:flex;align-items:center;gap:5px;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0;"></span>
          <span style="color:#94a3b8;font-size:11px;font-family:'Courier New',monospace;">${label}</span>
        </div>`;
      });
      html += `</div>`;
    }

    const elRect = el.getBoundingClientRect();
    const w = Math.ceil(elRect.width) + 32;
    const h = Math.ceil(elRect.height) + (title ? 36 : 0) + (legendColors && legendColors.length > 0 ? 40 : 0) + 32;

    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="background:#0a0f1a;color:#e2e8f0;font-family:Georgia,'Times New Roman',serif;padding:16px;">
          ${html}
        </div>
      </foreignObject>
    </svg>`;

    if (fmt === "svg") {
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${filename}.svg`; a.click();
      URL.revokeObjectURL(url);
    } else {
      // For HTML content PNG, use a standalone HTML blob rendered in an iframe
      const htmlDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:#0a0f1a;color:#e2e8f0;font-family:Georgia,'Times New Roman',serif;padding:16px;}</style></head><body>${html}</body></html>`;
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:" + w + "px;height:" + h + "px;border:none;";
      document.body.appendChild(iframe);
      iframe.contentDocument!.open();
      iframe.contentDocument!.write(htmlDoc);
      iframe.contentDocument!.close();
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = w * scale; canvas.height = h * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(scale, scale);
        ctx.fillStyle = "#0a0f1a";
        ctx.fillRect(0, 0, w, h);
        // Fall back to foreignObject for PNG of HTML content
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `${filename}.png`; a.click();
            URL.revokeObjectURL(url);
          }, "image/png");
          document.body.removeChild(iframe);
        };
        img.onerror = () => {
          // If foreignObject fails for PNG, fall back to SVG download
          const blob = new Blob([svgStr], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `${filename}.svg`; a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(iframe);
        };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
      }, 100);
    }
  }
}

// Get/set default format from localStorage
function getDefaultFormat(): "svg" | "png" { return (localStorage.getItem("dl_format") as "svg" | "png") || "svg"; }
function setDefaultFormat(f: "svg" | "png") { localStorage.setItem("dl_format", f); }

// Get/set include-legend preference from localStorage
function getIncludeLegend(): boolean { return localStorage.getItem("dl_include_legend") === "true"; }
function setIncludeLegendPref(v: boolean) { localStorage.setItem("dl_include_legend", String(v)); }

// ── Download button with format picker popup ────────────────────

function DownloadBtn({ elementId, filename, legendColors, title }: {
  elementId: string;
  filename: string;
  legendColors?: { label: string; color: string }[];
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const defaultFmt = getDefaultFormat();

  const doDownload = (fmt: "svg" | "png") => {
    exportElement(
      elementId, filename, fmt, title,
      getIncludeLegend() ? legendColors : undefined,
    );
    setOpen(false);
  };

  return (
    <div data-export-hide style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => {
          // If user has a default, use it directly. Otherwise show picker.
          if (localStorage.getItem("dl_format")) {
            doDownload(defaultFmt);
          } else {
            setOpen(!open);
          }
        }}
        onContextMenu={(e) => { e.preventDefault(); setOpen(!open); }}
        title={`Download .${defaultFmt} (right-click for options)`}
        style={{
          background: "transparent", border: "1px solid #1e293b", color: "#475569",
          width: 24, height: 24, borderRadius: 2, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, lineHeight: 1, transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLElement).style.color = "#3b82f6"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLElement).style.color = "#475569"; }}
      >
        ↓
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 28, right: 0, zIndex: 100,
          background: "#1e293b", border: "1px solid #334155", borderRadius: 4,
          padding: "8px 0", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", minWidth: 172,
        }}>
          <button onClick={() => doDownload("svg")} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            background: "none", border: "none", color: "#e2e8f0", padding: "6px 14px",
            fontSize: 11, fontFamily: "'Courier New', monospace", cursor: "pointer", textAlign: "left",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#334155"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
          >
            Download .svg {defaultFmt === "svg" && <span style={{ color: "#3b82f6", fontSize: 9 }}>default</span>}
          </button>
          <button onClick={() => doDownload("png")} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            background: "none", border: "none", color: "#e2e8f0", padding: "6px 14px",
            fontSize: 11, fontFamily: "'Courier New', monospace", cursor: "pointer", textAlign: "left",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#334155"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
          >
            Download .png {defaultFmt === "png" && <span style={{ color: "#3b82f6", fontSize: 9 }}>default</span>}
          </button>
          <div style={{ borderTop: "1px solid #334155", margin: "6px 0" }} />
          {(["svg", "png"] as const).map((fmt) => (
            <button key={fmt} onClick={() => { setDefaultFormat(fmt); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              background: "none", border: "none", color: "#64748b", padding: "4px 14px",
              fontSize: 9, fontFamily: "'Courier New', monospace", cursor: "pointer", textAlign: "left",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
            >
              Set .{fmt} as default <span style={{ color: "#475569", fontSize: 8 }}>can change at page bottom</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Chart settings button (gear icon with color pickers) ────────

type ChartSettingsProps = {
  colors: { key: string; label: string; color: string }[];
  onChange: (key: string, color: string) => void;
};

function ChartSettingsBtn({ colors, onChange }: ChartSettingsProps) {
  const [open, setOpen] = useState(false);

  const defaults = colors.reduce((acc, { key, color }) => { acc[key] = color; return acc; }, {} as Record<string, string>);

  const handleReset = () => {
    colors.forEach(({ key }) => onChange(key, defaults[key]));
  };

  return (
    <div data-export-hide style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        title="Chart color settings"
        style={{
          background: "transparent", border: "1px solid #1e293b", color: "#475569",
          width: 24, height: 24, borderRadius: 2, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, lineHeight: 1, transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLElement).style.color = "#475569"; }}
      >
        ⚙
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 28, right: 0, zIndex: 101,
          background: "#1e293b", border: "1px solid #334155", borderRadius: 4,
          padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", minWidth: 180,
        }}>
          <p style={{ color: "#64748b", fontSize: 9, fontFamily: "'Courier New', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
            Chart Colors
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {colors.map(({ key, label, color }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, cursor: "pointer" }}>
                <span style={{ color: "#e2e8f0", fontSize: 11, fontFamily: "'Courier New', monospace" }}>{label}</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChange(key, e.target.value)}
                  style={{ width: 28, height: 20, border: "1px solid #334155", borderRadius: 2, padding: 1, background: "#0a0f1a", cursor: "pointer" }}
                />
              </label>
            ))}
          </div>
          <button
            onClick={handleReset}
            style={{
              marginTop: 10, width: "100%", background: "none", border: "1px solid #334155",
              color: "#64748b", padding: "4px 8px", borderRadius: 2, fontSize: 9,
              fontFamily: "'Courier New', monospace", cursor: "pointer", textAlign: "center",
              letterSpacing: 1, textTransform: "uppercase",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; (e.currentTarget as HTMLElement).style.borderColor = "#475569"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.borderColor = "#334155"; }}
          >
            Reset defaults
          </button>
        </div>
      )}
    </div>
  );
}

// Legacy aliases — all buttons now use DownloadBtn
const SvgDownloadBtn = ({ chartId, filename, legendColors, title }: { chartId: string; filename: string; legendColors?: { label: string; color: string }[]; title?: string }) =>
  <DownloadBtn elementId={chartId} filename={filename} legendColors={legendColors} title={title} />;
const HtmlDownloadBtn = ({ elementId, filename, legendColors, title }: { elementId: string; filename: string; legendColors?: { label: string; color: string }[]; title?: string }) =>
  <DownloadBtn elementId={elementId} filename={filename} legendColors={legendColors} title={title} />;

const STATUTES = ["TCPA", "FDCPA", "FCRA", "CFPB"] as const;

const COLORS: Record<string, string> = {
  TCPA:  "#3b82f6",
  FDCPA: "#f97316",
  FCRA:  "#22c55e",
  CFPB:  "#a78bfa",
};

const STATUTE_LABELS: Record<string, string> = {
  TCPA:  "Telephone Consumer Protection Act",
  FDCPA: "Fair Debt Collection Practices Act",
  FCRA:  "Fair Credit Reporting Act",
  CFPB:  "Consumer Financial Protection Bureau",
};

const mono = "'Courier New', Courier, monospace";
const serif = "Georgia, 'Times New Roman', serif";

// ── Industry classifier (keyword-based) ──────────────────────
const INDUSTRY_RULES: [RegExp, string][] = [
  [/experian|equifax|trans\s?union|lexisnexis|clarity services|first advantage|background/i, "Credit Bureaus"],
  [/bank|chase|citibank|wells fargo|barclays|discover|capital one|truist|american express|synchrony|navy federal|credit union|newrez|freedom mortgage/i, "Banking & Finance"],
  [/lvnv|portfolio recovery|midland credit|national credit|columbia debt|credence resource|debt/i, "Debt Collection"],
  [/at&t|t-mobile|verizon|sprint|comcast|spectrum|telecom|phone|wireless/i, "Telecom"],
  [/apple|google|meta|facebook|amazon|microsoft|tesla/i, "Tech"],
  [/insurance|allstate|geico|state farm|progressive|liberty mutual/i, "Insurance"],
  [/hospital|health|medical|pharma|cvs|walgreens/i, "Healthcare"],
  [/auto|ford|gm|toyota|honda|carmax|carvana/i, "Automotive"],
  [/upgrade|lending|loan|mortgage|fintech|sofi|affirm/i, "Fintech / Lending"],
  [/cfpb|consumer financial protection|department of|united states|fcc|ftc/i, "Government"],
  [/trump|noem/i, "Government"],
];

function classifyIndustry(defendant: string): string {
  for (const [re, label] of INDUSTRY_RULES) {
    if (re.test(defendant)) return label;
  }
  return "Other";
}

const INDUSTRY_COLORS: Record<string, string> = {
  "Credit Bureaus": "#3b82f6",
  "Banking & Finance": "#22c55e",
  "Debt Collection": "#f97316",
  "Telecom": "#a78bfa",
  "Tech": "#06b6d4",
  "Insurance": "#eab308",
  "Healthcare": "#ec4899",
  "Automotive": "#64748b",
  "Fintech / Lending": "#14b8a6",
  "Government": "#6366f1",
  "Other": "#475569",
};

export default function TCPALitigationExplorer() {
  const [selectedStatutes, setSelectedStatutes] = useState<Set<string>>(
    new Set(STATUTES)
  );
  const [drillStatute, setDrillStatute] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  // Pivot filters — set by clicking heatmap cells, chart areas, court bars
  const [pivotCourt, setPivotCourt] = useState<string | null>(null);
  const [pivotMonth, setPivotMonth] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"filings" | "litigators" | "trends" | "methodology">("filings");

  // ── Trend comparison — multi-period with independent filters ───
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const prevMm = today.getMonth() === 0 ? 12 : today.getMonth();
  const prevYyyy = today.getMonth() === 0 ? yyyy - 1 : yyyy;

  type TrendPeriod = {
    id: string; label: string; start: string; end: string;
    statutes: Set<string>; claimTypes: Set<string>; states: Set<string>; verticals: Set<string>;
    expanded: boolean;
  };

  const makePeriod = (id: string, label: string, start: string, end: string): TrendPeriod => ({
    id, label, start, end, statutes: new Set(STATUTES), claimTypes: new Set(), states: new Set(), verticals: new Set(), expanded: false,
  });

  const [trendPeriods, setTrendPeriods] = useState<TrendPeriod[]>([
    makePeriod("a", "Current (MTD)", `${yyyy}-${mm}-01`, todayStr),
    makePeriod("b", "Previous Month", `${prevYyyy}-${String(prevMm).padStart(2, "0")}-01`, `${prevYyyy}-${String(prevMm).padStart(2, "0")}-${dd}`),
  ]);

  const updatePeriod = useCallback((id: string, patch: Partial<TrendPeriod>) => {
    setTrendPeriods((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  }, []);

  const addPeriod = useCallback(() => {
    const id = String.fromCharCode(97 + trendPeriods.length); // a, b, c, d...
    setTrendPeriods((prev) => [...prev, makePeriod(id, `Period ${prev.length + 1}`, "2021-04-01", todayStr)]);
  }, [trendPeriods.length]);

  const removePeriod = useCallback((id: string) => {
    setTrendPeriods((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const applyPreset = useCallback((preset: "mtd" | "ytd") => {
    if (preset === "mtd") {
      setTrendPeriods([
        makePeriod("a", "Current (MTD)", `${yyyy}-${mm}-01`, todayStr),
        makePeriod("b", "Previous Month", `${prevYyyy}-${String(prevMm).padStart(2, "0")}-01`, `${prevYyyy}-${String(prevMm).padStart(2, "0")}-${dd}`),
      ]);
    } else {
      setTrendPeriods([
        makePeriod("a", "Current (YTD)", `${yyyy}-01-01`, todayStr),
        makePeriod("b", "Previous Year", `${yyyy - 1}-01-01`, `${yyyy - 1}-${mm}-${dd}`),
      ]);
    }
  }, [yyyy, mm, dd, todayStr, prevYyyy, prevMm]);

  // Build per-period SQL WHERE clauses
  const periodWhere = (p: TrendPeriod) => {
    const parts = [`date_filed BETWEEN '${p.start}' AND '${p.end}'`];
    const pStatutes = Array.from(p.statutes);
    if (pStatutes.length > 0 && pStatutes.length < 4) parts.push(`statute IN (${pStatutes.map(s => `'${s}'`).join(",")})`);
    if (p.claimTypes.size > 0) parts.push(`claim_type IN (${Array.from(p.claimTypes).map(c => `'${c}'`).join(",")})`);
    if (p.verticals.size > 0) {
      const hasUntagged = p.verticals.has("Untagged");
      const named = Array.from(p.verticals).filter(v => v !== "Untagged");
      const clauses = [];
      if (named.length > 0) clauses.push(`vertical IN (${named.map(v => `'${v}'`).join(",")})`);
      if (hasUntagged) clauses.push("vertical IS NULL");
      parts.push(`(${clauses.join(" OR ")})`);
    }
    if (p.states.size > 0) {
      const codes = Object.entries(COURT_STATE).filter(([_, st]) => p.states.has(st)).map(([c]) => `'${c}'`);
      if (codes.length > 0) parts.push(`court IN (${codes.join(",")})`);
    }
    return parts.join(" AND ");
  };

  // ── "Who Is Getting Sued" panel state (hoisted from trends tab) ──
  const [defSort, setDefSort] = useState<"total" | "a" | "b" | "delta" | "name">("total");
  const [defMinCases, setDefMinCases] = useState(1);
  const [defIndustryFilter, setDefIndustryFilter] = useState<string | null>(null);
  const [defView, setDefView] = useState<"defendants" | "plaintiffs">("defendants");

  // ── Vertical filter ────────────────────────────────────────────
  const [verticalFilter, setVerticalFilter] = useState<string | null>(null);

  // ── Expanded filters ──────────────────────────────────────────
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedClaimTypes, setSelectedClaimTypes] = useState<Set<string>>(new Set());
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState({ start: "2021-04-01", end: "" });

  // ── Color overrides (per-chart color customization) ───────────
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});
  const getColor = (key: string, defaultColor: string) => colorOverrides[key] ?? defaultColor;
  const setChartColor = (key: string, color: string) => setColorOverrides(prev => ({ ...prev, [key]: color }));

  // ── Litigator explanation tooltips ──────────────────────────────
  const [showExplain, setShowExplain] = useState(false);
  const [explainTooltip, setExplainTooltip] = useState<{ tier: string; line: string; text: string; x: number; y: number } | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  // ── Unclassified data toggle ──────────────────────────────────
  const [includeUnclassified, setIncludeUnclassified] = useState(false);
  const [showUnclassifiedTooltip, setShowUnclassifiedTooltip] = useState(false);
  const casesTable = includeUnclassified
    ? `(SELECT * FROM "consumer_litigation"."main"."cases" UNION ALL SELECT * FROM "consumer_litigation"."main"."cases_unclassified")`
    : `"consumer_litigation"."main"."cases"`;

  const activeStatutes = drillStatute
    ? [drillStatute]
    : Array.from(selectedStatutes);
  const statuteFilter = activeStatutes.map((s) => `'${s}'`).join(",");
  const hasFilter = activeStatutes.length > 0;

  // ── Court-to-state mapping ─────────────────────────────────────
  const COURT_STATE: Record<string, string> = {
    almd:"AL",alnd:"AL",alsd:"AL",akd:"AK",azd:"AZ",ared:"AR",arwd:"AR",
    cacd:"CA",caed:"CA",cand:"CA",casd:"CA",cod:"CO",ctd:"CT",ded:"DE",dcd:"DC",
    flmd:"FL",flnd:"FL",flsd:"FL",gamd:"GA",gand:"GA",gasd:"GA",hid:"HI",idd:"ID",
    ilcd:"IL",ilnd:"IL",ilsd:"IL",innd:"IN",insd:"IN",iand:"IA",iasd:"IA",
    ksd:"KS",kyed:"KY",kywd:"KY",laed:"LA",lamd:"LA",lawd:"LA",med:"ME",mdd:"MD",
    mad:"MA",mied:"MI",miwd:"MI",mnd:"MN",msnd:"MS",mssd:"MS",moed:"MO",mowd:"MO",
    mtd:"MT",ned:"NE",nvd:"NV",nhd:"NH",njd:"NJ",nmd:"NM",
    nyed:"NY",nynd:"NY",nysd:"NY",nywd:"NY",nced:"NC",ncmd:"NC",ncwd:"NC",ndd:"ND",
    ohnd:"OH",ohsd:"OH",oked:"OK",oknd:"OK",okwd:"OK",ord:"OR",
    paed:"PA",pamd:"PA",pawd:"PA",rid:"RI",scd:"SC",sdd:"SD",
    tned:"TN",tnmd:"TN",tnwd:"TN",txed:"TX",txnd:"TX",txsd:"TX",txwd:"TX",
    utd:"UT",vtd:"VT",vaed:"VA",vawd:"VA",waed:"WA",wawd:"WA",
    wvnd:"WV",wvsd:"WV",wied:"WI",wiwd:"WI",wyd:"WY",vid:"VI",prd:"PR",gud:"GU",
  };

  // Build extra SQL WHERE clauses from expanded filters
  const claimTypeClause = selectedClaimTypes.size > 0
    ? `AND claim_type IN (${Array.from(selectedClaimTypes).map(c => `'${c}'`).join(",")})`
    : "";
  const stateCourtCodes = selectedStates.size > 0
    ? Object.entries(COURT_STATE).filter(([_, st]) => selectedStates.has(st)).map(([c]) => `'${c}'`)
    : [];
  const stateClause = stateCourtCodes.length > 0
    ? `AND court IN (${stateCourtCodes.join(",")})`
    : "";
  const dateClause = dateRange.start || dateRange.end
    ? `${dateRange.start ? `AND date_filed >= '${dateRange.start}'` : ""} ${dateRange.end ? `AND date_filed <= '${dateRange.end}'` : ""}`
    : "";
  const verticalGlobalClause = verticalFilter
    ? verticalFilter === "Untagged"
      ? "AND vertical IS NULL"
      : `AND vertical = '${verticalFilter}'`
    : "";
  const extraFilters = `${claimTypeClause} ${stateClause} ${dateClause} ${verticalGlobalClause}`;

  // Count active filters for badge
  const activeFilterCount = (selectedClaimTypes.size > 0 ? 1 : 0) + (selectedStates.size > 0 ? 1 : 0) + (dateRange.start !== "2021-04-01" || dateRange.end ? 1 : 0) + (verticalFilter ? 1 : 0);

  // All US states for the picker
  const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  const CLAIM_TYPES = ["SMS", "Voice", "Fax", "Unknown"];

  // ── Last updated ───────────────────────────────────────────────
  const lastUpdated = useSQLQuery(
    `SELECT strftime(MAX(ingested_at), '%Y-%m-%d %H:%M') as last_ingest,
            strftime(MAX(date_filed), '%Y-%m-%d') as latest_filing
     FROM ${casesTable}`
  );

  // ── Core queries ──────────────────────────────────────────────
  const kpis = useSQLQuery(
    `SELECT
       COUNT(*) as total_cases,
       COUNT(DISTINCT court) as courts,
       COUNT(date_terminated) as terminated,
       ROUND(COUNT(date_terminated) * 100.0 / COUNT(*), 1) as pct_terminated,
       COUNT(*) - COUNT(date_terminated) as active_cases
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}`,
    { enabled: hasFilter }
  );

  const monthly = useSQLQuery(
    `WITH spine AS (
       SELECT strftime(d, '%Y-%m') as month, d
       FROM generate_series(DATE '2024-04-01', DATE '2026-04-01', INTERVAL 1 MONTH) AS t(d)
     )
     SELECT s.month,
       ${STATUTES.map(
         (st) => `COALESCE(SUM(CASE WHEN c.statute = '${st}' THEN 1 END), 0) as "${st}"`
       ).join(", ")}
     FROM spine s
     LEFT JOIN ${casesTable} c
       ON strftime(date_trunc('month', c.date_filed), '%Y-%m') = s.month
       AND c.statute IN (${statuteFilter})
     GROUP BY s.month, s.d ORDER BY s.d`,
    { enabled: hasFilter }
  );

  // ── Plaintiff frequency distribution ───────────────────────────
  const plaintiffDist = useSQLQuery(
    `WITH plaintiff_counts AS (
       SELECT
         CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 1)
              WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 1)
              ELSE case_name END as plaintiff,
         COUNT(*) as cnt
       FROM ${casesTable}
       WHERE statute IN (${statuteFilter}) ${extraFilters}
       GROUP BY 1
     )
     SELECT
       CASE WHEN cnt = 1 THEN '1 (First-time)'
            WHEN cnt = 2 THEN '2 (Repeat)'
            WHEN cnt BETWEEN 3 AND 5 THEN '3-5 (Serial)'
            WHEN cnt BETWEEN 6 AND 10 THEN '6-10 (Prolific)'
            ELSE '11+ (Professional)' END as tier,
       CASE WHEN cnt = 1 THEN 1 WHEN cnt = 2 THEN 2 WHEN cnt BETWEEN 3 AND 5 THEN 3
            WHEN cnt BETWEEN 6 AND 10 THEN 4 ELSE 5 END as sort_order,
       COUNT(*) as plaintiffs,
       SUM(cnt) as total_cases
     FROM plaintiff_counts
     GROUP BY 1, 2
     ORDER BY sort_order`,
    { enabled: hasFilter }
  );

  // ── Serial litigators ─────────────────────────────────────────
  const serialLitigators = useSQLQuery(
    `SELECT
       CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 1)
            WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 1)
            ELSE case_name END as plaintiff,
       COUNT(*) as cases,
       COUNT(DISTINCT court) as courts,
       strftime(MIN(date_filed), '%Y-%m-%d') as first_filed,
       strftime(MAX(date_filed), '%Y-%m-%d') as last_filed,
       ROUND(COUNT(date_terminated) * 100.0 / COUNT(*), 0) as pct_resolved
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
     GROUP BY 1
     HAVING COUNT(*) >= 3
     ORDER BY cases DESC
     LIMIT 15`,
    { enabled: hasFilter }
  );

  // ── Financial exposure ────────────────────────────────────────
  const exposureByStatute = useSQLQuery(
    `SELECT
       statute,
       COUNT(*) as cases,
       COUNT(*) - COUNT(date_terminated) as active,
       COUNT(date_terminated) as resolved,
       ROUND(AVG(CASE WHEN date_terminated IS NOT NULL AND date_terminated > date_filed
         THEN date_terminated - date_filed END), 0) as avg_duration_days,
       ROUND(MEDIAN(CASE WHEN date_terminated IS NOT NULL AND date_terminated > date_filed
         THEN date_terminated - date_filed END), 0) as median_duration_days
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
     GROUP BY statute
     ORDER BY cases DESC`,
    { enabled: hasFilter }
  );

  // ── Verticals list ─────────────────────────────────────────────
  const verticals = useSQLQuery(
    `SELECT COALESCE(vertical, 'Untagged') as vertical, COUNT(*) as cnt
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
       AND vertical IS NOT NULL
     GROUP BY 1
     ORDER BY cnt DESC`,
    { enabled: hasFilter }
  );
  const verticalRows = Array.isArray(verticals.data) ? verticals.data : [];

  const verticalClause = verticalFilter
    ? verticalFilter === "Untagged"
      ? "AND vertical IS NULL"
      : `AND vertical = '${verticalFilter}'`
    : "";

  // ── Top defendants (filtered + all-time) ────────────────────────
  const topDefendants = useSQLQuery(
    `WITH filtered AS (
       SELECT
         CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 2)
              WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 2)
              ELSE NULL END as defendant,
         vertical,
         COUNT(*) as cases,
         COUNT(DISTINCT
           CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 1)
                WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 1)
                ELSE NULL END
         ) as unique_plaintiffs,
         COUNT(DISTINCT court) as courts
       FROM ${casesTable}
       WHERE statute IN (${statuteFilter}) ${extraFilters} AND case_name LIKE '% v%'
       ${verticalClause}
       GROUP BY 1, 2
     ), all_time AS (
       SELECT
         CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 2)
              WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 2)
              ELSE NULL END as defendant,
         COUNT(*) as all_cases
       FROM ${casesTable}
       WHERE case_name LIKE '% v%'
       GROUP BY 1
     )
     SELECT f.defendant, f.vertical, f.cases, f.unique_plaintiffs, f.courts,
            COALESCE(a.all_cases, f.cases) as all_cases
     FROM filtered f
     LEFT JOIN all_time a ON f.defendant = a.defendant
     WHERE f.cases >= 1
     ORDER BY f.cases DESC
     LIMIT 30`,
    { enabled: hasFilter }
  );

  // ── Heatmap (court × month) ────────────────────────────────────
  const heatmap = useSQLQuery(
    `WITH top_courts AS (
       SELECT court FROM ${casesTable}
       WHERE statute IN (${statuteFilter}) ${extraFilters}
       GROUP BY court ORDER BY COUNT(*) DESC LIMIT 10
     ),
     spine AS (
       SELECT strftime(d, '%Y-%m') as month
       FROM generate_series(DATE '2024-04-01', DATE '2026-04-01', INTERVAL 1 MONTH) AS t(d)
     )
     SELECT tc.court, s.month, COUNT(c.id) as cnt
     FROM top_courts tc
     CROSS JOIN spine s
     LEFT JOIN ${casesTable} c
       ON c.court = tc.court
       AND strftime(date_trunc('month', c.date_filed), '%Y-%m') = s.month
       AND c.statute IN (${statuteFilter})
     GROUP BY tc.court, s.month
     ORDER BY tc.court, s.month`,
    { enabled: hasFilter && activeTab === "filings" }
  );

  // ── Courts ────────────────────────────────────────────────────
  const courts = useSQLQuery(
    `SELECT court, COUNT(*) as cnt
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
     GROUP BY court ORDER BY cnt DESC LIMIT 8`,
    { enabled: hasFilter }
  );

  // ── Drilldown table ───────────────────────────────────────────
  const pageSize = 10;
  const drilldown = useSQLQuery(
    `SELECT statute, case_name, court, docket_number,
            strftime(date_filed, '%Y-%m-%d') as filed,
            strftime(date_terminated, '%Y-%m-%d') as terminated,
            source_url
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
     ORDER BY date_filed DESC
     LIMIT ${pageSize} OFFSET ${page * pageSize}`,
    { enabled: hasFilter }
  );

  // ── Pivot detail query (separate from main table) ─────────────
  const hasPivot = !!(pivotCourt || pivotMonth);
  const [pivotPage, setPivotPage] = useState(0);
  const pivotDetail = useSQLQuery(
    `SELECT statute, case_name, court, docket_number,
            strftime(date_filed, '%Y-%m-%d') as filed,
            strftime(date_terminated, '%Y-%m-%d') as terminated,
            source_url
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
     ${pivotCourt ? `AND court = '${pivotCourt}'` : ""}
     ${pivotMonth ? `AND strftime(date_filed, '%Y-%m') = '${pivotMonth}'` : ""}
     ORDER BY date_filed DESC
     LIMIT 20 OFFSET ${pivotPage * 20}`,
    { enabled: hasFilter && hasPivot }
  );
  const pivotCount = useSQLQuery(
    `SELECT COUNT(*) as cnt
     FROM ${casesTable}
     WHERE statute IN (${statuteFilter}) ${extraFilters}
     ${pivotCourt ? `AND court = '${pivotCourt}'` : ""}
     ${pivotMonth ? `AND strftime(date_filed, '%Y-%m') = '${pivotMonth}'` : ""}`,
    { enabled: hasFilter && hasPivot }
  );

  // ── Trend comparison queries — multi-period UNION ALL ─────────
  // Trends always pull from the full dataset; filtering is per-period only
  const _trendEnabled = activeTab === "trends" && trendPeriods.length > 0;

  const trendSnapshot = useSQLQuery(
    trendPeriods.map((p) =>
      `SELECT '${p.id}' as pid, '${p.label.replace(/'/g, "''")}' as plabel,
         COUNT(*) as total,
         COUNT(DISTINCT court) as courts,
         COUNT(date_terminated) as resolved,
         COUNT(*) - COUNT(date_terminated) as active,
         SUM(CASE WHEN is_class_action THEN 1 ELSE 0 END) as class_actions,
         ROUND(AVG(CASE WHEN date_terminated IS NOT NULL AND date_terminated > date_filed
           THEN date_terminated - date_filed END), 0) as avg_duration
       FROM ${casesTable}
       WHERE ${periodWhere(p)}`
    ).join("\nUNION ALL\n"),
    { enabled: _trendEnabled }
  );

  const trendClaimBreakdown = useSQLQuery(
    (trendPeriods.map((p) =>
      `SELECT '${p.id}' as pid, claim_type, COUNT(*) as cnt
       FROM ${casesTable}
       WHERE ${periodWhere(p)}
         AND claim_type IS NOT NULL AND claim_type != 'Unknown'
       GROUP BY claim_type`
    ).join("\nUNION ALL\n")) + "\nORDER BY pid, cnt DESC",
    { enabled: _trendEnabled }
  );

  const trendTheoryBreakdown = useSQLQuery(
    (trendPeriods.map((p) =>
      `SELECT '${p.id}' as pid, legal_theory, COUNT(*) as cnt
       FROM ${casesTable}
       WHERE ${periodWhere(p)}
         AND legal_theory IS NOT NULL AND legal_theory != 'Unknown'
       GROUP BY legal_theory`
    ).join("\nUNION ALL\n")) + "\nORDER BY pid, cnt DESC",
    { enabled: _trendEnabled }
  );

  // Top plaintiffs — first period only
  const _p0 = trendPeriods[0];
  const trendTopPlaintiffs = useSQLQuery(
    `SELECT plaintiff, COUNT(*) as cases, COUNT(DISTINCT court) as courts
     FROM ${casesTable}
     WHERE ${_p0 ? periodWhere(_p0) : "1=0"}
       AND plaintiff IS NOT NULL
     GROUP BY plaintiff
     HAVING COUNT(*) >= 2
     ORDER BY cases DESC
     LIMIT 5`,
    { enabled: _trendEnabled }
  );

  const trendDefendants = useSQLQuery(
    `WITH all_defs AS (
       SELECT 'all' as pid,
         CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 2)
              WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 2)
              ELSE NULL END as defendant,
         vertical, COUNT(*) as cnt
       FROM ${casesTable}
       WHERE case_name LIKE '% v%'
       GROUP BY 2, 3
       ORDER BY cnt DESC
       LIMIT 50
     ), per_period AS (
       ${trendPeriods.map((p) =>
         `SELECT '${p.id}' as pid,
            CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 2)
                 WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 2)
                 ELSE NULL END as defendant,
            vertical, COUNT(*) as cnt
          FROM ${casesTable}
          WHERE ${periodWhere(p)} AND case_name LIKE '% v%'
          GROUP BY 1, 2, 3`
       ).join("\nUNION ALL\n")}
     )
     SELECT * FROM all_defs
     UNION ALL
     SELECT * FROM per_period WHERE defendant IN (SELECT defendant FROM all_defs)
     ORDER BY pid, cnt DESC`,
    { enabled: _trendEnabled }
  );

  const trendCourts = useSQLQuery(
    (trendPeriods.map((p) =>
      `SELECT '${p.id}' as pid, court, COUNT(*) as cnt
       FROM ${casesTable}
       WHERE ${periodWhere(p)}
       GROUP BY court`
    ).join("\nUNION ALL\n")) + "\nORDER BY pid, cnt DESC",
    { enabled: _trendEnabled }
  );

  const trendLitigators = useSQLQuery(
    (trendPeriods.map((p) =>
      `SELECT '${p.id}' as pid,
         CASE WHEN case_name LIKE '% v. %' THEN split_part(case_name, ' v. ', 1)
              WHEN case_name LIKE '% v %' THEN split_part(case_name, ' v ', 1)
              ELSE case_name END as plaintiff,
         COUNT(*) as cnt
       FROM ${casesTable}
       WHERE ${periodWhere(p)}
       GROUP BY 1, 2 HAVING COUNT(*) >= 2`
    ).join("\nUNION ALL\n")) + "\nORDER BY pid, cnt DESC",
    { enabled: _trendEnabled }
  );

  // ── Handlers ──────────────────────────────────────────────────
  const toggle = useCallback((s: string) => {
    setDrillStatute(null);
    setSelectedStatutes((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
    setPage(0);
  }, []);

  const handleDrill = useCallback((statute: string) => {
    setDrillStatute((prev) => (prev === statute ? null : statute));
    setPage(0);
  }, []);

  const handlePivot = useCallback((court: string | null, month: string | null) => {
    setPivotCourt((pc) => court ?? pc);
    setPivotMonth((pm) => month ?? pm);
    setPivotPage(0);
  }, []);

  const clearPivot = useCallback(() => {
    setPivotCourt(null);
    setPivotMonth(null);
    setPivotPage(0);
  }, []);

  // ── Derived ───────────────────────────────────────────────────
  const kpiRow = (Array.isArray(kpis.data) ? kpis.data : [])[0];
  const chartData = (Array.isArray(monthly.data) ? monthly.data : []).map(
    (r) => ({
      month: r.month as string,
      TCPA: N(r.TCPA), FDCPA: N(r.FDCPA), FCRA: N(r.FCRA), CFPB: N(r.CFPB),
    })
  );
  const litigatorRows = Array.isArray(serialLitigators.data) ? serialLitigators.data : [];
  const exposureRows = Array.isArray(exposureByStatute.data) ? exposureByStatute.data : [];
  const defendantRows = Array.isArray(topDefendants.data) ? topDefendants.data : [];
  const courtRows = Array.isArray(courts.data) ? courts.data : [];
  const caseRows = Array.isArray(drilldown.data) ? drilldown.data : [];
  const maxCourt = courtRows.length > 0 ? N(courtRows[0]?.cnt) : 1;

  // TCPA statutory damage estimate: $500/violation (negligent), $1,500 (willful)
  const totalCases = kpiRow ? N(kpiRow.total_cases) : 0;
  const activeCases = kpiRow ? N(kpiRow.active_cases) : 0;

  const Skeleton = ({ h, w }: { h: number; w?: string }) => (
    <div className="animate-pulse rounded" style={{ height: h, width: w || "100%", background: "#1e293b" }} />
  );

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "10px 14px", borderRadius: 4 }}>
        <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6, fontFamily: serif }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2" style={{ fontSize: 12, marginBottom: 2 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: p.color }} />
            <span style={{ color: "#e2e8f0" }}>{p.dataKey}</span>
            <span style={{ color: p.color, fontWeight: 700, marginLeft: "auto", fontFamily: mono }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Multi-period derived data — group query results by pid
  const trendSnapshotRows = Array.isArray(trendSnapshot.data) ? trendSnapshot.data : [];
  const trendClaimRows = Array.isArray(trendClaimBreakdown.data) ? trendClaimBreakdown.data : [];
  const trendTheoryRows = Array.isArray(trendTheoryBreakdown.data) ? trendTheoryBreakdown.data : [];
  const trendCourtAllRows = Array.isArray(trendCourts.data) ? trendCourts.data : [];
  const trendLitigatorAllRows = Array.isArray(trendLitigators.data) ? trendLitigators.data : [];
  const trendDefendantAllRows = Array.isArray(trendDefendants.data) ? trendDefendants.data : [];

  // Group by pid helpers
  const groupByPid = <T extends { pid?: unknown }>(rows: T[]) => {
    const map: Record<string, T[]> = {};
    for (const r of rows) {
      const pid = String(r.pid ?? "");
      if (!map[pid]) map[pid] = [];
      map[pid].push(r);
    }
    return map;
  };

  const snapByPid = groupByPid(trendSnapshotRows);
  const claimByPid = groupByPid(trendClaimRows);
  const theoryByPid = groupByPid(trendTheoryRows);
  const courtByPid = groupByPid(trendCourtAllRows);
  const litByPid = groupByPid(trendLitigatorAllRows);
  const defByPid = groupByPid(trendDefendantAllRows);

  // Period totals (first two periods for simple pct change headline)
  const _pid0 = trendPeriods[0]?.id ?? "a";
  const _pid1 = trendPeriods[1]?.id ?? "b";
  const totalP0 = (snapByPid[_pid0] ?? []).reduce((s, r) => s + N(r.total), 0);
  const totalP1 = (snapByPid[_pid1] ?? []).reduce((s, r) => s + N(r.total), 0);
  const pctChange = totalP1 > 0 ? ((totalP0 - totalP1) / totalP1 * 100) : 0;

  const DeltaBadge = ({ val }: { val: number }) => {
    const color = val > 0 ? "#22c55e" : val < 0 ? "#ef4444" : "#64748b";
    const arrow = val > 0 ? "\u25b2" : val < 0 ? "\u25bc" : "";
    return (
      <span style={{ color, fontSize: 11, fontFamily: mono, fontWeight: 700 }}>
        {arrow}{val > 0 ? "+" : ""}{val}
      </span>
    );
  };

  const tabs = [
    { id: "filings" as const, label: "Filings" },
    { id: "litigators" as const, label: "Serial Litigators" },
    { id: "trends" as const, label: "Trend Analysis" },
    { id: "methodology" as const, label: "Methodology" },
  ];

  return (
    <div style={{ background: "#0a0f1a", minHeight: "100vh", fontFamily: serif }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "28px 32px 0" }}>
        <div className="flex items-end justify-between">
          <div>
            <p style={{ color: "#475569", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: mono, marginBottom: 8 }}>
              Phone &amp; Text Litigation · Federal Courts · Apr 2024 – Apr 2026
            </p>
            <h1 style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 400, letterSpacing: -0.5, lineHeight: 1.1 }}>
              TCPA Litigation Explorer
            </h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            {(() => {
              const luRow = (Array.isArray(lastUpdated.data) ? lastUpdated.data : [])[0];
              return luRow ? (
                <>
                  <span style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1 }}>
                    Data through {luRow.latest_filing as string}
                  </span>
                  <span style={{ color: "#334155", fontSize: 9, fontFamily: mono }}>
                    Last pull: {luRow.last_ingest as string} UTC
                  </span>
                </>
              ) : null;
            })()}
            {drillStatute && (
            <button
              onClick={() => { setDrillStatute(null); setPage(0); }}
              className="flex items-center gap-2"
              style={{
                background: "transparent", border: `1px solid ${COLORS[drillStatute]}`,
                color: COLORS[drillStatute], padding: "4px 12px", borderRadius: 2,
                fontSize: 11, fontFamily: mono, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase",
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>×</span> Exit {drillStatute}
            </button>
          )}
          </div>
        </div>

        {/* ── Filter bar + tabs ─────────────────────────── */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2">
            {activeTab !== "trends" && activeTab !== "methodology" && (
              <>
                {/* Statute pills */}
                {STATUTES.map((s) => {
                  const active = selectedStatutes.has(s);
                  const drilled = drillStatute === s;
                  return (
                    <button key={s} onClick={() => toggle(s)} style={{
                      background: drilled ? COLORS[s] : active ? `${COLORS[s]}18` : "transparent",
                      border: `1px solid ${active ? COLORS[s] : "#334155"}`,
                      color: drilled ? "#0a0f1a" : active ? COLORS[s] : "#475569",
                      padding: "6px 14px", borderRadius: 2, fontSize: 11, fontFamily: mono,
                      cursor: "pointer", letterSpacing: 0.5, transition: "all 0.15s ease",
                    }}>
                      {s}
                    </button>
                  );
                })}

                <span style={{ color: "#1e293b", margin: "0 4px" }}>|</span>

                {/* Filters toggle */}
                <button onClick={() => setFiltersExpanded(!filtersExpanded)} style={{
                  background: filtersExpanded || activeFilterCount > 0 ? "#1e293b" : "transparent",
                  border: `1px solid ${filtersExpanded || activeFilterCount > 0 ? "#3b82f6" : "#334155"}`,
                  color: filtersExpanded || activeFilterCount > 0 ? "#e2e8f0" : "#475569",
                  padding: "6px 12px", borderRadius: 2, fontSize: 11, fontFamily: mono,
                  cursor: "pointer", letterSpacing: 0.5, transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {filtersExpanded ? "▾" : "▸"} Filters
                  {activeFilterCount > 0 && (
                    <span style={{
                      background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 700,
                      borderRadius: "50%", width: 16, height: 16, display: "inline-flex",
                      alignItems: "center", justifyContent: "center",
                    }}>{activeFilterCount}</span>
                  )}
                </button>

                {/* Quick clear */}
                {activeFilterCount > 0 && (
                  <button onClick={() => {
                    setSelectedClaimTypes(new Set());
                    setSelectedStates(new Set());
                    setVerticalFilter(null);
                    setDateRange({ start: "2021-04-01", end: "" });
                    setIncludeUnclassified(false);
                  }} style={{
                    background: "transparent", border: "none", color: "#ef4444",
                    fontSize: 10, fontFamily: mono, cursor: "pointer", padding: "4px 6px",
                  }}>
                    Clear all
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex gap-0">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #3b82f6" : "2px solid transparent",
                color: activeTab === t.id ? "#e2e8f0" : "#475569",
                padding: "8px 16px", fontSize: 12, fontFamily: mono, cursor: "pointer",
                letterSpacing: 0.5, transition: "all 0.15s ease",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Expanded filters panel ─────────────────────── */}
        {filtersExpanded && activeTab !== "trends" && activeTab !== "methodology" && (
          <div style={{ background: "#111827", borderRadius: 4, padding: "16px 20px", marginTop: 12, borderLeft: "3px solid #3b82f6" }}>
            <div className="grid grid-cols-4 gap-6">

              {/* Claim Type (multi-select) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                    Claim Type
                  </p>
                  {selectedClaimTypes.size > 0 && (
                    <button onClick={() => setSelectedClaimTypes(new Set())} style={{
                      background: "none", border: "none", color: "#ef4444", fontSize: 8, fontFamily: mono, cursor: "pointer", padding: 0,
                    }}>reset</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {CLAIM_TYPES.map((ct) => {
                    const active = selectedClaimTypes.has(ct);
                    return (
                      <button key={ct} onClick={() => {
                        setSelectedClaimTypes((prev) => {
                          const next = new Set(prev);
                          if (next.has(ct)) next.delete(ct); else next.add(ct);
                          return next;
                        });
                      }} style={{
                        background: active ? "#3b82f620" : "transparent",
                        border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                        color: active ? "#3b82f6" : "#475569",
                        padding: "3px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer",
                      }}>
                        {ct}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                    Vertical
                  </p>
                  {verticalFilter && (
                    <button onClick={() => setVerticalFilter(null)} style={{
                      background: "none", border: "none", color: "#ef4444", fontSize: 8, fontFamily: mono, cursor: "pointer", padding: 0,
                    }}>reset</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {verticalRows.map((v, i) => {
                    const vName = v.vertical as string;
                    const active = verticalFilter === vName;
                    return (
                      <button key={i} onClick={() => setVerticalFilter(active ? null : vName)} style={{
                        background: active ? "#3b82f620" : "transparent",
                        border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                        color: active ? "#3b82f6" : "#475569",
                        padding: "3px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer",
                      }}>
                        {vName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State (multi-select) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                    State {selectedStates.size > 0 && <span style={{ color: "#3b82f6" }}>({selectedStates.size})</span>}
                  </p>
                  {selectedStates.size > 0 && (
                    <button onClick={() => setSelectedStates(new Set())} style={{
                      background: "none", border: "none", color: "#ef4444", fontSize: 8, fontFamily: mono, cursor: "pointer", padding: 0,
                    }}>reset</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1" style={{ maxHeight: 80, overflowY: "auto" }}>
                  {US_STATES.map((st) => {
                    const active = selectedStates.has(st);
                    return (
                      <button key={st} onClick={() => {
                        setSelectedStates((prev) => {
                          const next = new Set(prev);
                          if (next.has(st)) next.delete(st); else next.add(st);
                          return next;
                        });
                      }} style={{
                        background: active ? "#3b82f620" : "transparent",
                        border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                        color: active ? "#3b82f6" : "#475569",
                        padding: "2px 5px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                        minWidth: 28, textAlign: "center",
                      }}>
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range + Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
                    Date Range
                  </p>
                  {(dateRange.start !== "2021-04-01" || dateRange.end) && (
                    <button onClick={() => setDateRange({ start: "2021-04-01", end: "" })} style={{
                      background: "none", border: "none", color: "#ef4444", fontSize: 8, fontFamily: mono, cursor: "pointer", padding: 0,
                    }}>reset</button>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input type="date" value={dateRange.start}
                    onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
                    min="2021-04-01"
                    style={{ background: "#0a0f1a", border: "1px solid #334155", color: "#e2e8f0",
                      padding: "3px 6px", borderRadius: 2, fontSize: 11, fontFamily: mono, width: "100%" }} />
                  <span style={{ color: "#475569", fontSize: 10 }}>→</span>
                  <input type="date" value={dateRange.end}
                    onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
                    min="2021-04-01"
                    style={{ background: "#0a0f1a", border: "1px solid #334155", color: "#e2e8f0",
                      padding: "3px 6px", borderRadius: 2, fontSize: 11, fontFamily: mono, width: "100%" }} />
                </div>

                {/* Unclassified toggle */}
                <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={includeUnclassified}
                    onChange={(e) => setIncludeUnclassified(e.target.checked)}
                    style={{ accentColor: "#f97316", width: 12, height: 12, cursor: "pointer" }} />
                  <span style={{ color: includeUnclassified ? "#f97316" : "#475569", fontSize: 9, fontFamily: mono }}>
                    Include unclassified TCPA
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {!hasFilter ? (
        <p style={{ color: "#475569", padding: 32, fontSize: 13, fontFamily: mono }}>
          Select at least one statute above.
        </p>
      ) : (
        <div style={{ padding: "24px 32px" }}>
          {/* ── KPIs (always visible) ──────────────────────── */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Cases", value: kpiRow ? N(kpiRow.total_cases).toLocaleString() : "—" },
              { label: "Active Cases", value: kpiRow ? N(kpiRow.active_cases).toLocaleString() : "—", color: "#22c55e" },
              { label: "Federal Courts", value: kpiRow ? N(kpiRow.courts).toString() : "—" },
              { label: "Termination Rate", value: kpiRow ? `${N(kpiRow.pct_terminated)}%` : "—" },
            ].map((kpi, i) => (
              <div key={i}>
                {kpis.isLoading ? <Skeleton h={40} w="60%" /> : (
                  <p style={{
                    color: kpi.color || "#f1f5f9", fontSize: 36, fontWeight: 400,
                    fontFamily: mono, letterSpacing: -1, lineHeight: 1,
                  }}>{kpi.value}</p>
                )}
                <p style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontFamily: mono }}>
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>

          {/* ═══════════ TAB: FILINGS ═══════════ */}
          {activeTab === "filings" && (
            <>
              {/* ── Area chart ───────────────────────────────── */}
              <div style={{ marginBottom: 32 }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>Monthly Filings</h2>
                  {drillStatute && (
                    <span style={{ color: getColor(drillStatute, COLORS[drillStatute]), fontSize: 12, fontFamily: mono }}>
                      {STATUTE_LABELS[drillStatute]}
                    </span>
                  )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ChartSettingsBtn
                      colors={STATUTES.filter(s => selectedStatutes.has(s)).map(s => ({ key: s, label: s, color: getColor(s, COLORS[s]) }))}
                      onChange={setChartColor}
                    />
                    <SvgDownloadBtn
                      chartId="chart-monthly-filings"
                      filename="monthly-filings"
                      title="Monthly Filings"
                      legendColors={STATUTES.filter(s => selectedStatutes.has(s)).map(s => ({ label: s, color: getColor(s, COLORS[s]) }))}
                    />
                  </div>
                </div>
                <p style={{ color: "#475569", fontSize: 10, fontFamily: mono, letterSpacing: 1, marginBottom: 12 }}>
                  CLICK LEGEND TO DRILL DOWN
                </p>
                {monthly.isLoading ? <Skeleton h={220} /> : (
                  <div id="chart-monthly-filings">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} style={{ cursor: "pointer" }}>
                      <defs>
                        {STATUTES.map((s) => (
                          <linearGradient key={s} id={`grad-${s}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={getColor(s, COLORS[s])} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={getColor(s, COLORS[s])} stopOpacity={0.02} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" fontSize={10} stroke="#334155"
                        tick={{ fill: "#64748b", fontFamily: mono }} tickFormatter={(v) => v.slice(2)}
                        axisLine={{ stroke: "#1e293b" }} />
                      <YAxis fontSize={10} stroke="#334155"
                        tick={{ fill: "#64748b", fontFamily: mono }} axisLine={{ stroke: "#1e293b" }} />
                      <Tooltip content={<ChartTooltip />} />
                      {STATUTES.filter((s) => selectedStatutes.has(s)).map((s) => (
                        <Area key={s} type="linear" dataKey={s} stackId="1" stroke={getColor(s, COLORS[s])}
                          fill={`url(#grad-${s})`}
                          strokeWidth={drillStatute === s ? 2.5 : drillStatute ? 0.5 : 1.5}
                          fillOpacity={drillStatute ? (drillStatute === s ? 1 : 0.08) : 1}
                          strokeOpacity={drillStatute ? (drillStatute === s ? 1 : 0.2) : 1}
                          onClick={() => handleDrill(s)} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                  </div>
                )}
                <div className="flex gap-5 mt-3">
                  {STATUTES.filter((s) => selectedStatutes.has(s)).map((s) => (
                    <button key={s} onClick={() => handleDrill(s)} className="flex items-center gap-2"
                      style={{ background: "none", border: "none", cursor: "pointer",
                        opacity: drillStatute ? (drillStatute === s ? 1 : 0.3) : 1, transition: "opacity 0.15s ease" }}>
                      <span style={{ display: "inline-block", width: 10, height: 3, background: getColor(s, COLORS[s]), borderRadius: 1 }} />
                      <span style={{ color: "#94a3b8", fontSize: 10, fontFamily: mono, letterSpacing: 0.5 }}>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Heatmap (court × month) ──────────────────── */}
              <div style={{ marginBottom: 32 }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                    Filing Hotspots
                  </h2>
                  <div className="flex items-center gap-2">
                    <ChartSettingsBtn
                      colors={[{ key: "heatmap", label: "Heatmap", color: getColor("heatmap", drillStatute ? COLORS[drillStatute] : "#3b82f6") }]}
                      onChange={setChartColor}
                    />
                    <HtmlDownloadBtn elementId="chart-heatmap" filename="filing-hotspots-heatmap" title="Filing Hotspots" />
                  </div>
                </div>
                <p style={{ color: "#475569", fontSize: 10, fontFamily: mono, letterSpacing: 1, marginBottom: 12 }}>
                  TOP 10 COURTS × MONTH · CLICK TO FILTER TABLE
                </p>
                {heatmap.isLoading ? <Skeleton h={220} /> : (() => {
                  const hmRows = Array.isArray(heatmap.data) ? heatmap.data : [];
                  const courtSet = [...new Set(hmRows.map((r) => r.court as string))];
                  const monthSet = [...new Set(hmRows.map((r) => r.month as string))].sort();
                  const lookup: Record<string, number> = {};
                  let maxVal = 1;
                  hmRows.forEach((r) => {
                    const v = N(r.cnt);
                    lookup[`${r.court}|${r.month}`] = v;
                    if (v > maxVal) maxVal = v;
                  });
                  // Sort courts by total volume desc
                  const courtTotals = courtSet.map((c) => ({
                    court: c,
                    total: monthSet.reduce((s, m) => s + (lookup[`${c}|${m}`] || 0), 0),
                  }));
                  courtTotals.sort((a, b) => b.total - a.total);
                  const sortedCourts = courtTotals.map((c) => c.court);

                  return (
                    <div id="chart-heatmap" style={{ overflowX: "auto" }}>
                      <div style={{ display: "grid", gridTemplateColumns: `50px repeat(${monthSet.length}, 1fr)`, gap: 1 }}>
                        {/* Header row — months */}
                        <div />
                        {monthSet.map((m) => (
                          <div key={m} onClick={() => handlePivot(null, m)} style={{
                            color: pivotMonth === m ? "#e2e8f0" : "#475569", fontSize: 8, fontFamily: mono, textAlign: "center",
                            padding: "2px 0", letterSpacing: 0.5, cursor: "pointer",
                            background: pivotMonth === m ? "#1e293b" : "transparent", borderRadius: 1,
                          }}>
                            {m.slice(2)}
                          </div>
                        ))}
                        {/* Data rows */}
                        {sortedCourts.map((court) => (
                          <>
                            <div key={`label-${court}`} onClick={() => handlePivot(court, null)} style={{
                              color: pivotCourt === court ? "#e2e8f0" : "#94a3b8", fontSize: 10, fontFamily: mono, textAlign: "right",
                              paddingRight: 6, display: "flex", alignItems: "center", justifyContent: "flex-end",
                              cursor: "pointer", background: pivotCourt === court ? "#1e293b" : "transparent", borderRadius: 1,
                            }}>
                              {court.toUpperCase()}
                            </div>
                            {monthSet.map((month) => {
                              const val = lookup[`${court}|${month}`] || 0;
                              const intensity = val > 0 ? Math.max(0.08, Math.min(1, val / maxVal)) : 0;
                              const bg = getColor("heatmap", drillStatute ? COLORS[drillStatute] : "#3b82f6");
                              const isSelected = pivotCourt === court && pivotMonth === month;
                              return (
                                <div
                                  key={`${court}-${month}`}
                                  title={`${court.toUpperCase()} · ${month}: ${val} cases — click to filter`}
                                  onClick={() => val > 0 ? handlePivot(court, month) : undefined}
                                  style={{
                                    background: val > 0 ? bg : "#0f172a",
                                    opacity: val > 0 ? intensity : 1,
                                    borderRadius: 1,
                                    height: 18,
                                    cursor: val > 0 ? "pointer" : "default",
                                    transition: "opacity 0.2s ease",
                                    outline: isSelected ? "2px solid #e2e8f0" : "none",
                                    outlineOffset: -1,
                                  }}
                                />
                              );
                            })}
                          </>
                        ))}
                      </div>
                      {/* Legend */}
                      <div className="flex items-center gap-2 mt-3" style={{ justifyContent: "flex-end" }}>
                        <span style={{ color: "#475569", fontSize: 9, fontFamily: mono }}>0</span>
                        <div className="flex" style={{ height: 8, width: 80, borderRadius: 1, overflow: "hidden" }}>
                          {[0.08, 0.2, 0.35, 0.5, 0.65, 0.8, 1].map((op, i) => (
                            <div key={i} style={{
                              flex: 1,
                              background: getColor("heatmap", drillStatute ? COLORS[drillStatute] : "#3b82f6"),
                              opacity: op,
                            }} />
                          ))}
                        </div>
                        <span style={{ color: "#475569", fontSize: 9, fontFamily: mono }}>{maxVal}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* ── Pivot detail (inline below heatmap) ────── */}
                {hasPivot && (() => {
                  const pvRows = Array.isArray(pivotDetail.data) ? pivotDetail.data : [];
                  const pvTotal = (Array.isArray(pivotCount.data) ? pivotCount.data : [])[0];
                  const totalCount = pvTotal ? N(pvTotal.cnt) : 0;
                  return (
                    <div style={{ marginTop: 12, background: "#0f172a", borderRadius: 4, border: "1px solid #1e293b", padding: "12px 16px" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 400 }}>
                            Drill-Down
                          </h3>
                          {pivotCourt && (
                            <span style={{ background: "#1e293b", color: "#3b82f6", padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono }}>
                              {pivotCourt.toUpperCase()}
                            </span>
                          )}
                          {pivotMonth && (
                            <span style={{ background: "#1e293b", color: "#3b82f6", padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono }}>
                              {pivotMonth}
                            </span>
                          )}
                          <span style={{ color: "#475569", fontSize: 10, fontFamily: mono }}>
                            {totalCount.toLocaleString()} cases
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setPivotPage((p) => Math.max(0, p - 1))} disabled={pivotPage === 0}
                            style={{ background: "none", border: "1px solid #334155", color: pivotPage === 0 ? "#1e293b" : "#64748b",
                              padding: "2px 10px", borderRadius: 2, fontSize: 11, cursor: pivotPage === 0 ? "default" : "pointer", fontFamily: mono }}>‹</button>
                          <span style={{ color: "#475569", fontSize: 10, fontFamily: mono }}>{pivotPage + 1}</span>
                          <button onClick={() => setPivotPage((p) => p + 1)} disabled={pvRows.length < 20}
                            style={{ background: "none", border: "1px solid #334155", color: pvRows.length < 20 ? "#1e293b" : "#64748b",
                              padding: "2px 10px", borderRadius: 2, fontSize: 11, cursor: pvRows.length < 20 ? "default" : "pointer", fontFamily: mono }}>›</button>
                          <button onClick={clearPivot} style={{
                            background: "none", border: "1px solid #334155", color: "#64748b",
                            padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer", marginLeft: 4,
                          }}>
                            × close
                          </button>
                        </div>
                      </div>
                      {pivotDetail.isLoading ? (
                        <div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} h={16} />)}</div>
                      ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid #1e293b" }}>
                              {["", "Case", "Court", "Docket #", "Filed", "Status"].map((h) => (
                                <th key={h} style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5,
                                  textTransform: "uppercase", textAlign: "left", padding: "4px 8px 6px 0", fontWeight: 400 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pvRows.map((r, i) => (
                              <tr key={i} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s ease" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                                <td style={{ padding: "4px 6px 4px 0", width: 8 }}>
                                  <span style={{ display: "inline-block", width: 3, height: 12, background: getColor(r.statute as string, COLORS[r.statute as string]), borderRadius: 1 }} />
                                </td>
                                <td style={{ padding: "4px 6px 4px 0", fontSize: 11, maxWidth: 300,
                                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.case_name as string}>
                                  <a href={r.source_url as string} target="_blank" rel="noopener noreferrer"
                                    style={{ color: "#cbd5e1", textDecoration: "none", borderBottom: "1px solid #334155" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#3b82f6"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#cbd5e1"; }}>
                                    {r.case_name as string}
                                  </a>
                                </td>
                                <td style={{ padding: "4px 6px 4px 0", color: "#64748b", fontSize: 10, fontFamily: mono }}>
                                  {(r.court as string).toUpperCase()}
                                </td>
                                <td style={{ padding: "4px 6px 4px 0", color: "#475569", fontSize: 10, fontFamily: mono, maxWidth: 120,
                                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.docket_number as string}>
                                  {r.docket_number as string}
                                </td>
                                <td style={{ padding: "4px 6px 4px 0", color: "#64748b", fontSize: 10, fontFamily: mono }}>
                                  {r.filed as string}
                                </td>
                                <td style={{ padding: "4px 0" }}>
                                  {(r.terminated as string) ? (
                                    <span style={{ color: "#475569", fontSize: 9, fontFamily: mono }}>{r.terminated as string}</span>
                                  ) : (
                                    <span style={{ color: "#22c55e", fontSize: 8, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Active</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* ── Courts + Table ────────────────────────────── */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>Top Courts</h2>
                    <div className="flex items-center gap-2">
                      <ChartSettingsBtn
                        colors={[{ key: "courts_bar", label: "Bar fill", color: getColor("courts_bar", "#3b82f6") }]}
                        onChange={setChartColor}
                      />
                      <HtmlDownloadBtn elementId="chart-top-courts" filename="top-courts" title="Top Courts" />
                    </div>
                  </div>
                  {courts.isLoading ? <Skeleton h={200} /> : (
                    <div id="chart-top-courts" className="flex flex-col gap-1">
                      {courtRows.map((r, i) => {
                        const pct = (N(r.cnt) / maxCourt) * 100;
                        return (
                          <div key={i} className="flex items-center gap-3" onClick={() => handlePivot(r.court as string, null)}
                            style={{ height: 24, cursor: "pointer", background: pivotCourt === r.court ? "#111827" : "transparent", borderRadius: 2, padding: "0 4px", margin: "0 -4px" }}>
                            <span style={{ color: pivotCourt === r.court ? "#e2e8f0" : "#94a3b8", fontSize: 11, fontFamily: mono, width: 42, textAlign: "right", flexShrink: 0 }}>
                              {(r.court as string).toUpperCase()}
                            </span>
                            <div style={{ flex: 1, height: 14, background: "#111827", borderRadius: 1, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%",
                                background: drillStatute ? getColor(drillStatute, COLORS[drillStatute]) : `linear-gradient(90deg, ${getColor("courts_bar", "#3b82f6")}, ${getColor("CFPB", COLORS.CFPB)})`,
                                opacity: pivotCourt === r.court ? 1 : 0.7, borderRadius: 1, transition: "all 0.4s ease" }} />
                            </div>
                            <span style={{ color: "#64748b", fontSize: 10, fontFamily: mono, width: 36, textAlign: "right", flexShrink: 0 }}>
                              {N(r.cnt).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                      Recent Filings{drillStatute ? ` — ${drillStatute}` : ""}
                    </h2>
                    <div className="flex items-center gap-2">
                      <HtmlDownloadBtn elementId="table-recent-filings" filename="recent-filings" title="Recent Filings" />
                      <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                        style={{ background: "none", border: "1px solid #334155", color: page === 0 ? "#1e293b" : "#64748b",
                          padding: "2px 10px", borderRadius: 2, fontSize: 11, cursor: page === 0 ? "default" : "pointer", fontFamily: mono }}>‹</button>
                      <span style={{ color: "#475569", fontSize: 10, fontFamily: mono }}>{page + 1}</span>
                      <button onClick={() => setPage((p) => p + 1)} disabled={caseRows.length < pageSize}
                        style={{ background: "none", border: "1px solid #334155", color: caseRows.length < pageSize ? "#1e293b" : "#64748b",
                          padding: "2px 10px", borderRadius: 2, fontSize: 11, cursor: caseRows.length < pageSize ? "default" : "pointer", fontFamily: mono }}>›</button>
                    </div>
                  </div>
                  {drilldown.isLoading ? (
                    <div className="flex flex-col gap-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={18} />)}</div>
                  ) : (
                    <div id="table-recent-filings">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #1e293b" }}>
                          {["", "Case", "Court", "Filed", "Status"].map((h) => (
                            <th key={h} style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5,
                              textTransform: "uppercase", textAlign: "left", padding: "4px 8px 6px 0", fontWeight: 400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {caseRows.map((r, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                            <td style={{ padding: "5px 8px 5px 0", width: 8 }}>
                              <span style={{ display: "inline-block", width: 3, height: 14, background: getColor(r.statute as string, COLORS[r.statute as string]), borderRadius: 1 }} />
                            </td>
                            <td style={{ padding: "5px 8px 5px 0", fontSize: 12, maxWidth: 280,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.case_name as string}>
                              <a href={r.source_url as string} target="_blank" rel="noopener noreferrer"
                                style={{ color: "#cbd5e1", textDecoration: "none", borderBottom: "1px solid #334155" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#3b82f6"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#cbd5e1"; }}>
                                {r.case_name as string}
                              </a>
                            </td>
                            <td style={{ padding: "5px 8px 5px 0", color: "#64748b", fontSize: 11, fontFamily: mono }}>
                              {(r.court as string).toUpperCase()}
                            </td>
                            <td style={{ padding: "5px 8px 5px 0", color: "#64748b", fontSize: 11, fontFamily: mono }}>
                              {r.filed as string}
                            </td>
                            <td style={{ padding: "5px 0" }}>
                              {(r.terminated as string) ? (
                                <span style={{ color: "#475569", fontSize: 10, fontFamily: mono }}>{r.terminated as string}</span>
                              ) : (
                                <span style={{ color: "#22c55e", fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Active</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Who Is Getting Sued ────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                    Who Is Getting Sued
                  </h2>
                  <HtmlDownloadBtn elementId="table-who-sued-filings" filename="who-is-getting-sued-filings" title="Who Is Getting Sued" />
                </div>
                <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 12 }}>
                  Filtered count vs all-time — sorted by current filter
                </p>

                {/* Vertical filter pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <button onClick={() => setVerticalFilter(null)} style={{
                    background: !verticalFilter ? "#1e293b" : "transparent",
                    border: `1px solid ${!verticalFilter ? "#3b82f6" : "#1e293b"}`,
                    color: !verticalFilter ? "#e2e8f0" : "#475569",
                    padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                  }}>All Verticals</button>
                  {verticalRows.map((v, i) => {
                    const vName = v.vertical as string;
                    const active = verticalFilter === vName;
                    return (
                      <button key={i} onClick={() => setVerticalFilter(active ? null : vName)} style={{
                        background: active ? "#1e293b" : "transparent",
                        border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                        color: active ? "#e2e8f0" : "#475569",
                        padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                      }}>{vName} ({N(v.cnt)})</button>
                    );
                  })}
                  <button onClick={() => setVerticalFilter(verticalFilter === "Untagged" ? null : "Untagged")} style={{
                    background: verticalFilter === "Untagged" ? "#1e293b" : "transparent",
                    border: `1px solid ${verticalFilter === "Untagged" ? "#3b82f6" : "#1e293b"}`,
                    color: verticalFilter === "Untagged" ? "#e2e8f0" : "#334155",
                    padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                  }}>Untagged</button>
                </div>

                {topDefendants.isLoading ? <Skeleton h={200} /> : (
                  <div id="table-who-sued-filings">
                    <div className="flex items-center gap-3 mb-2" style={{ height: 16 }}>
                      <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 70, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>Vertical</span>
                      <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, flex: 1, letterSpacing: 1, textTransform: "uppercase" }}>Defendant</span>
                      <span style={{ color: "#3b82f6", fontSize: 7, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>Filtered</span>
                      <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>All Time</span>
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                      {defendantRows.map((r, i) => (
                        <div key={i} className="flex items-center gap-3" style={{ height: 24, transition: "background 0.1s ease", padding: "0 4px", borderRadius: 2 }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <span style={{ color: "#64748b", fontSize: 8, fontFamily: mono, width: 70, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={(r.vertical as string) || "Untagged"}>
                            {((r.vertical as string) || "—").toUpperCase()}
                          </span>
                          <span style={{ color: "#e2e8f0", fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={r.defendant as string}>
                            {r.defendant as string}
                          </span>
                          <span style={{ color: "#3b82f6", fontSize: 11, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0, fontWeight: 600 }}>
                            {N(r.cases)}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0 }}>
                            {N(r.all_cases)}
                          </span>
                        </div>
                      ))}
                      {defendantRows.length === 0 && (
                        <p style={{ color: "#475569", fontSize: 11, fontFamily: mono }}>No defendants match current filters</p>
                      )}
                    </div>
                    <span style={{ color: "#334155", fontSize: 9, fontFamily: mono }}>
                      Showing {defendantRows.length} defendants
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ═══════════ TAB: SERIAL LITIGATORS ═══════════ */}
          {activeTab === "litigators" && (() => {
            const distRows = Array.isArray(plaintiffDist.data) ? plaintiffDist.data : [];
            const totalPlaintiffs = distRows.reduce((s, r) => s + N(r.plaintiffs), 0);
            const totalDistCases = distRows.reduce((s, r) => s + N(r.total_cases), 0);
            const tierColors: Record<string, string> = {
              "1 (First-time)": getColor("tier_first", "#22c55e"),
              "2 (Repeat)": getColor("tier_repeat", "#eab308"),
              "3-5 (Serial)": getColor("tier_serial", "#f97316"),
              "6-10 (Prolific)": getColor("tier_prolific", "#ef4444"),
              "11+ (Professional)": getColor("tier_pro", "#dc2626"),
            };
            return (
            <>
              {/* ── Plaintiff frequency distribution ─────────── */}
              <div style={{ marginBottom: 28 }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400, margin: 0 }}>
                    Plaintiff Filing Frequency
                  </h2>
                  {/* Info tooltip */}
                  <span
                    onMouseEnter={() => setShowInfoTooltip(true)}
                    onMouseLeave={() => setShowInfoTooltip(false)}
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 16, height: 16, borderRadius: "50%",
                      border: "1px solid #475569", color: "#475569",
                      fontSize: 10, fontFamily: mono, fontWeight: 700, cursor: "help",
                      lineHeight: 1, position: "relative",
                    }}
                  >
                    i
                    {showInfoTooltip && (
                      <div style={{
                        position: "absolute", top: 22, left: -10, zIndex: 50,
                        background: "#1e293b", border: "1px solid #334155", borderRadius: 4,
                        padding: "12px 16px", width: 340, boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                      }}>
                        <p style={{ color: "#e2e8f0", fontSize: 11, lineHeight: 1.7, margin: 0 }}>
                          Plaintiffs are grouped by how many cases they've filed. Each tier shows three numbers:
                        </p>
                        <ul style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.8, paddingLeft: 14, margin: "8px 0 0" }}>
                          <li><span style={{ color: "#e2e8f0" }}>Large %</span> — what share of all unique plaintiffs fall in this tier</li>
                          <li><span style={{ color: "#e2e8f0" }}>Plaintiffs count</span> — how many unique people/entities in this tier</li>
                          <li><span style={{ color: "#e2e8f0" }}>Cases count (%)</span> — total cases filed by this tier, and what % of all cases that represents</li>
                        </ul>
                        <p style={{ color: "#64748b", fontSize: 10, lineHeight: 1.6, margin: "8px 0 0" }}>
                          The key insight: a small % of "Professional" plaintiffs often generate a disproportionate share of total cases.
                        </p>
                      </div>
                    )}
                  </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChartSettingsBtn
                      colors={[
                        { key: "tier_first", label: "First-time", color: getColor("tier_first", "#22c55e") },
                        { key: "tier_repeat", label: "Repeat", color: getColor("tier_repeat", "#eab308") },
                        { key: "tier_serial", label: "Serial", color: getColor("tier_serial", "#f97316") },
                        { key: "tier_prolific", label: "Prolific", color: getColor("tier_prolific", "#ef4444") },
                        { key: "tier_pro", label: "Professional", color: getColor("tier_pro", "#dc2626") },
                      ]}
                      onChange={setChartColor}
                    />
                    <HtmlDownloadBtn
                      elementId="chart-plaintiff-frequency"
                      filename="plaintiff-filing-frequency"
                      title="Plaintiff Filing Frequency"
                      legendColors={[
                        { label: "First-time", color: getColor("tier_first", "#22c55e") },
                        { label: "Repeat", color: getColor("tier_repeat", "#eab308") },
                        { label: "Serial (3-5)", color: getColor("tier_serial", "#f97316") },
                        { label: "Prolific (6-10)", color: getColor("tier_prolific", "#ef4444") },
                        { label: "Professional (11+)", color: getColor("tier_pro", "#dc2626") },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, margin: 0 }}>
                    Distribution of unique plaintiffs by number of cases filed
                  </p>
                  <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                    <input type="checkbox" checked={showExplain}
                      onChange={(e) => { setShowExplain(e.target.checked); setExplainTooltip(null); }}
                      style={{ accentColor: "#3b82f6", width: 12, height: 12, cursor: "pointer" }} />
                    <span style={{ color: showExplain ? "#3b82f6" : "#475569", fontSize: 9, fontFamily: mono }}>
                      Show explanation on hover
                    </span>
                  </label>
                </div>
                {plaintiffDist.isLoading ? <Skeleton h={120} /> : (
                  <div id="chart-plaintiff-frequency">
                    {/* ── Segmented bar ──────────────────────────── */}
                    <div className="flex" style={{ height: 28, borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
                      {distRows.map((r, i) => {
                        const pct = totalPlaintiffs > 0 ? (N(r.plaintiffs) / totalPlaintiffs) * 100 : 0;
                        const tier = r.tier as string;
                        return pct > 0 ? (
                          <div key={i} title={`${tier}: ${N(r.plaintiffs)} plaintiffs (${pct.toFixed(1)}%)`}
                            style={{
                              width: `${pct}%`, background: tierColors[tier] || "#64748b",
                              opacity: 0.8, transition: "width 0.4s ease", minWidth: pct > 2 ? undefined : 4,
                            }} />
                        ) : null;
                      })}
                    </div>

                    {/* ── Tier detail grid ────────────────────────── */}
                    <div className="grid grid-cols-5 gap-3 mb-4" style={{ position: "relative" }}>
                      {distRows.map((r, i) => {
                        const tier = r.tier as string;
                        const pct = totalPlaintiffs > 0 ? (N(r.plaintiffs) / totalPlaintiffs * 100) : 0;
                        const casePct = totalDistCases > 0 ? (N(r.total_cases) / totalDistCases * 100) : 0;
                        const plaintiffCount = N(r.plaintiffs).toLocaleString();
                        const caseCount = N(r.total_cases).toLocaleString();

                        const explanations: Record<string, string> = {
                          pct: `${pct.toFixed(1)}% of all ${totalPlaintiffs.toLocaleString()} unique plaintiffs (${plaintiffCount} people) have filed ${tier.split(" ")[0]} case${tier.startsWith("1") ? "" : "s"} each.`,
                          plaintiffs: `There are ${plaintiffCount} unique plaintiffs who have each filed ${tier.split(" ")[0]} case${tier.startsWith("1") ? "" : "s"}.`,
                          cases: `Those ${plaintiffCount} plaintiffs account for ${caseCount} total cases — ${casePct.toFixed(1)}% of all ${totalDistCases.toLocaleString()} cases in the dataset.`,
                        };

                        const makeHover = (line: string) => showExplain ? {
                          onMouseEnter: (e: React.MouseEvent) => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setExplainTooltip({ tier, line, text: explanations[line], x: rect.left, y: rect.bottom + 4 });
                          },
                          onMouseLeave: () => setExplainTooltip(null),
                          style: { cursor: "help", borderBottom: "1px dotted #334155" } as React.CSSProperties,
                        } : {};

                        return (
                          <div key={i} style={{ borderLeft: `3px solid ${tierColors[tier] || "#64748b"}`, paddingLeft: 10 }}>
                            <p style={{ color: tierColors[tier] || "#64748b", fontSize: 10, fontFamily: mono, fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>
                              {tier}
                            </p>
                            <p style={{ color: "#f1f5f9", fontSize: 22, fontFamily: mono, lineHeight: 1 }}>
                              <span {...makeHover("pct")}>{pct.toFixed(1)}%</span>
                            </p>
                            <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>
                              <span {...makeHover("plaintiffs")}>{plaintiffCount} plaintiffs</span>
                            </p>
                            <p style={{ color: "#475569", fontSize: 9, fontFamily: mono, marginTop: 2 }}>
                              <span {...makeHover("cases")}>{caseCount} cases ({casePct.toFixed(1)}%)</span>
                            </p>
                          </div>
                        );
                      })}

                      {/* Floating explanation tooltip */}
                      {explainTooltip && (
                        <div style={{
                          position: "fixed", left: explainTooltip.x, top: explainTooltip.y, zIndex: 100,
                          background: "#1e293b", border: "1px solid #334155", borderRadius: 4,
                          padding: "10px 14px", maxWidth: 320, boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        }}>
                          <p style={{ color: "#e2e8f0", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                            {explainTooltip.text}
                          </p>
                        </div>
                      )}
                    </div>

                    <div style={{ background: "#111827", borderRadius: 4, padding: "10px 14px", borderLeft: "3px solid #334155" }}>
                      <p style={{ color: "#64748b", fontSize: 10, fontFamily: mono, lineHeight: 1.6 }}>
                        Based on plaintiff name matching across {totalPlaintiffs.toLocaleString()} unique plaintiffs
                        in {totalDistCases.toLocaleString()} cases. Data window: Apr 2024 – Apr 2026 (trailing 2 years, federal courts only via CourtListener RECAP).
                        Plaintiffs with prior litigation history outside this window will appear as "first-time."
                        Name matching is approximate — different name spellings for the same litigant may undercount repeat filers.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Repeat plaintiffs table ──────────────────── */}
              <div style={{ marginBottom: 24 }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                    Top Repeat Plaintiffs
                  </h2>
                  <HtmlDownloadBtn elementId="table-serial-litigators" filename="serial-litigators-table" title="Top Repeat Plaintiffs" />
                </div>
                <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 16 }}>
                  Plaintiffs with 3+ filings — potential serial litigators targeting outbound dialers
                </p>
                {serialLitigators.isLoading ? <Skeleton h={300} /> : (
                  <div id="table-serial-litigators">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        {["Plaintiff", "Cases", "Courts", "First Filed", "Last Filed", "Resolved"].map((h) => (
                          <th key={h} style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5,
                            textTransform: "uppercase", textAlign: "left", padding: "4px 10px 6px 0", fontWeight: 400 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {litigatorRows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s ease" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <td style={{ padding: "6px 10px 6px 0", color: "#e2e8f0", fontSize: 12 }}>
                            {r.plaintiff as string}
                          </td>
                          <td style={{ padding: "6px 10px 6px 0" }}>
                            <span style={{
                              color: N(r.cases) >= 20 ? "#ef4444" : N(r.cases) >= 10 ? "#f97316" : "#e2e8f0",
                              fontSize: 13, fontWeight: 700, fontFamily: mono,
                            }}>
                              {N(r.cases)}
                            </span>
                          </td>
                          <td style={{ padding: "6px 10px 6px 0", color: "#94a3b8", fontSize: 11, fontFamily: mono }}>
                            {N(r.courts)}
                          </td>
                          <td style={{ padding: "6px 10px 6px 0", color: "#64748b", fontSize: 11, fontFamily: mono }}>
                            {r.first_filed as string}
                          </td>
                          <td style={{ padding: "6px 10px 6px 0", color: "#64748b", fontSize: 11, fontFamily: mono }}>
                            {r.last_filed as string}
                          </td>
                          <td style={{ padding: "6px 0" }}>
                            <span style={{
                              color: N(r.pct_resolved) >= 80 ? "#22c55e" : N(r.pct_resolved) >= 50 ? "#eab308" : "#ef4444",
                              fontSize: 11, fontFamily: mono,
                            }}>
                              {N(r.pct_resolved)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>

              {/* ── Who Is Getting Sued ────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                    Who Is Getting Sued
                  </h2>
                  <HtmlDownloadBtn elementId="table-who-sued-litigators" filename="who-is-getting-sued-litigators" title="Who Is Getting Sued" />
                </div>
                <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 12 }}>
                  Filtered count vs all-time — sorted by current filter
                </p>

                {/* Vertical filter pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <button onClick={() => setVerticalFilter(null)} style={{
                    background: !verticalFilter ? "#1e293b" : "transparent",
                    border: `1px solid ${!verticalFilter ? "#3b82f6" : "#1e293b"}`,
                    color: !verticalFilter ? "#e2e8f0" : "#475569",
                    padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                  }}>All Verticals</button>
                  {verticalRows.map((v, i) => {
                    const vName = v.vertical as string;
                    const active = verticalFilter === vName;
                    return (
                      <button key={i} onClick={() => setVerticalFilter(active ? null : vName)} style={{
                        background: active ? "#1e293b" : "transparent",
                        border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                        color: active ? "#e2e8f0" : "#475569",
                        padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                      }}>{vName} ({N(v.cnt)})</button>
                    );
                  })}
                  <button onClick={() => setVerticalFilter(verticalFilter === "Untagged" ? null : "Untagged")} style={{
                    background: verticalFilter === "Untagged" ? "#1e293b" : "transparent",
                    border: `1px solid ${verticalFilter === "Untagged" ? "#3b82f6" : "#1e293b"}`,
                    color: verticalFilter === "Untagged" ? "#e2e8f0" : "#334155",
                    padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                  }}>Untagged</button>
                </div>

                {topDefendants.isLoading ? <Skeleton h={200} /> : (
                  <div id="table-who-sued-litigators">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2" style={{ height: 16 }}>
                      <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 70, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>Vertical</span>
                      <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, flex: 1, letterSpacing: 1, textTransform: "uppercase" }}>Defendant</span>
                      <span style={{ color: "#3b82f6", fontSize: 7, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>Filtered</span>
                      <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>All Time</span>
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                      {defendantRows.map((r, i) => (
                        <div key={i} className="flex items-center gap-3" style={{ height: 24, transition: "background 0.1s ease", padding: "0 4px", borderRadius: 2 }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <span style={{ color: "#64748b", fontSize: 8, fontFamily: mono, width: 70, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={(r.vertical as string) || "Untagged"}>
                            {((r.vertical as string) || "—").toUpperCase()}
                          </span>
                          <span style={{ color: "#e2e8f0", fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={r.defendant as string}>
                            {r.defendant as string}
                          </span>
                          <span style={{ color: "#3b82f6", fontSize: 11, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0, fontWeight: 600 }}>
                            {N(r.cases)}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: mono, width: 55, textAlign: "right", flexShrink: 0 }}>
                            {N(r.all_cases)}
                          </span>
                        </div>
                      ))}
                      {defendantRows.length === 0 && (
                        <p style={{ color: "#475569", fontSize: 11, fontFamily: mono }}>No defendants match current filters</p>
                      )}
                    </div>
                    <span style={{ color: "#334155", fontSize: 9, fontFamily: mono }}>
                      Showing {defendantRows.length} defendants
                    </span>
                  </div>
                )}
              </div>
            </>
            );
          })()}

          {/* ═══════════ TAB: FINANCIAL EXPOSURE ═══════════ */}
          {activeTab === "exposure" && (
            <>
              {/* ── Statutory damage estimates ────────────────── */}
              <div style={{ marginBottom: 32 }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                    Estimated Statutory Exposure
                  </h2>
                  <HtmlDownloadBtn elementId="table-exposure-estimates" filename="statutory-exposure-estimates" title="Estimated Statutory Exposure" />
                </div>
                <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 16 }}>
                  TCPA: $500/violation (negligent) · $1,500/violation (willful) · Based on active case count
                </p>

                <div id="table-exposure-estimates" className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    {kpis.isLoading ? <Skeleton h={50} w="80%" /> : (
                      <p style={{ color: "#f97316", fontSize: 32, fontWeight: 400, fontFamily: mono, lineHeight: 1 }}>
                        ${(activeCases * 500).toLocaleString()}
                      </p>
                    )}
                    <p style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontFamily: mono }}>
                      Min Exposure ($500×)
                    </p>
                  </div>
                  <div>
                    {kpis.isLoading ? <Skeleton h={50} w="80%" /> : (
                      <p style={{ color: "#ef4444", fontSize: 32, fontWeight: 400, fontFamily: mono, lineHeight: 1 }}>
                        ${(activeCases * 1500).toLocaleString()}
                      </p>
                    )}
                    <p style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontFamily: mono }}>
                      Max Exposure ($1,500×)
                    </p>
                  </div>
                  <div>
                    {kpis.isLoading ? <Skeleton h={50} w="80%" /> : (
                      <p style={{ color: "#22c55e", fontSize: 32, fontWeight: 400, fontFamily: mono, lineHeight: 1 }}>
                        {activeCases.toLocaleString()}
                      </p>
                    )}
                    <p style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontFamily: mono }}>
                      Active Cases
                    </p>
                  </div>
                </div>

                <div style={{ background: "#111827", borderRadius: 4, padding: "12px 16px", borderLeft: "3px solid #f97316", marginBottom: 24 }}>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontFamily: mono, lineHeight: 1.6 }}>
                    Note: These are per-case statutory minimums. Actual exposure depends on the number of
                    violations per case (each call/text = 1 violation). Class actions can multiply exposure
                    by thousands. TCPA class action settlements typically range from $5M–$75M+.
                  </p>
                </div>
              </div>

              {/* ── Case duration by statute ──────────────────── */}
              <div style={{ marginBottom: 32 }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                    Case Duration by Statute
                  </h2>
                  <div className="flex items-center gap-2">
                    <ChartSettingsBtn
                      colors={STATUTES.map(s => ({ key: s, label: s, color: getColor(s, COLORS[s]) }))}
                      onChange={setChartColor}
                    />
                    <HtmlDownloadBtn
                      elementId="table-case-duration"
                      filename="case-duration-by-statute"
                      title="Case Duration by Statute"
                      legendColors={STATUTES.map(s => ({ label: s, color: getColor(s, COLORS[s]) }))}
                    />
                  </div>
                </div>
                <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 16 }}>
                  Time from filing to termination (resolved cases only)
                </p>
                {exposureByStatute.isLoading ? <Skeleton h={150} /> : (
                  <div id="table-case-duration" className="grid grid-cols-4 gap-4">
                    {exposureRows.map((r) => {
                      const statute = r.statute as string;
                      return (
                        <div key={statute} style={{ borderLeft: `3px solid ${getColor(statute, COLORS[statute])}`, paddingLeft: 16 }}>
                          <p style={{ color: getColor(statute, COLORS[statute]), fontSize: 12, fontFamily: mono, fontWeight: 700, marginBottom: 8 }}>
                            {statute}
                          </p>
                          <div style={{ marginBottom: 6 }}>
                            <p style={{ color: "#f1f5f9", fontSize: 24, fontFamily: mono, lineHeight: 1 }}>
                              {N(r.median_duration_days)}
                            </p>
                            <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>
                              Median Days
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <p style={{ color: "#94a3b8", fontSize: 13, fontFamily: mono }}>{N(r.avg_duration_days)}</p>
                              <p style={{ color: "#475569", fontSize: 8, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Avg</p>
                            </div>
                            <div>
                              <p style={{ color: "#94a3b8", fontSize: 13, fontFamily: mono }}>{N(r.active)}</p>
                              <p style={{ color: "#475569", fontSize: 8, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Active</p>
                            </div>
                            <div>
                              <p style={{ color: "#94a3b8", fontSize: 13, fontFamily: mono }}>{N(r.resolved)}</p>
                              <p style={{ color: "#475569", fontSize: 8, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Resolved</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── CFPB enforcement placeholder ─────────────── */}
              <div style={{ background: "#111827", borderRadius: 4, padding: "16px 20px", borderLeft: "3px solid #a78bfa" }}>
                <p style={{ color: "#a78bfa", fontSize: 12, fontFamily: mono, fontWeight: 700, marginBottom: 4 }}>
                  CFPB Enforcement Penalties
                </p>
                <p style={{ color: "#64748b", fontSize: 11, fontFamily: mono, lineHeight: 1.6 }}>
                  Run the enrichment script to load CFPB enforcement actions with structured penalty amounts:
                </p>
                <p style={{ color: "#94a3b8", fontSize: 11, fontFamily: mono, marginTop: 6, padding: "6px 10px", background: "#0a0f1a", borderRadius: 2, display: "inline-block" }}>
                  python3 ingest_cfpb_enforcement.py
                </p>
              </div>
            </>
          )}

          {/* ═══════════ TAB: TREND ANALYSIS ═══════════ */}
          {activeTab === "trends" && (
            <>
              {/* ── Preset + period controls ─────────────────── */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span style={{ color: "#64748b", fontSize: 10, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>
                  Preset:
                </span>
                <button onClick={() => applyPreset("mtd")} style={{
                  background: "transparent", border: "1px solid #1e293b",
                  color: "#475569", padding: "5px 12px", borderRadius: 2, fontSize: 11, fontFamily: mono,
                  cursor: "pointer", transition: "all 0.15s ease",
                }}>
                  MTD vs Prev Month
                </button>
                <button onClick={() => applyPreset("ytd")} style={{
                  background: "transparent", border: "1px solid #1e293b",
                  color: "#475569", padding: "5px 12px", borderRadius: 2, fontSize: 11, fontFamily: mono,
                  cursor: "pointer", transition: "all 0.15s ease",
                }}>
                  YTD vs Prev Year
                </button>
                <span style={{ color: "#1e293b", margin: "0 4px" }}>|</span>
                {trendPeriods.length < 5 && (
                  <button onClick={addPeriod} style={{
                    background: "transparent", border: "1px solid #22c55e",
                    color: "#22c55e", padding: "5px 12px", borderRadius: 2, fontSize: 11, fontFamily: mono,
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}>
                    + Add Period
                  </button>
                )}
              </div>

              {/* ── Period cards ─────────────────────────────── */}
              <div className="flex flex-col gap-3 mb-6">
                {trendPeriods.map((p, pi) => {
                  const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[pi] || "#64748b";
                  return (
                    <div key={p.id} style={{ background: "#111827", border: `1px solid #1e293b`, borderLeft: `3px solid ${pColor}`, borderRadius: 4, overflow: "hidden" }}>
                      {/* Card header */}
                      <div className="flex items-center justify-between" style={{ padding: "10px 14px", cursor: "pointer" }}
                        onClick={() => updatePeriod(p.id, { expanded: !p.expanded })}>
                        <div className="flex items-center gap-3">
                          <span style={{ color: pColor, fontSize: 10, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                            P{pi + 1}
                          </span>
                          <input
                            type="text"
                            value={p.label}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updatePeriod(p.id, { label: e.target.value })}
                            style={{ background: "transparent", border: "none", color: "#e2e8f0", fontSize: 13, fontFamily: serif,
                              outline: "none", width: 200, cursor: "text" }}
                          />
                          <span style={{ color: "#475569", fontSize: 10, fontFamily: mono }}>
                            {p.start || "—"} → {p.end || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {trendPeriods.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); removePeriod(p.id); }} style={{
                              background: "transparent", border: "1px solid #334155", color: "#475569",
                              padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer",
                            }}>
                              ×
                            </button>
                          )}
                          <span style={{ color: "#475569", fontSize: 12 }}>{p.expanded ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {/* Expanded filter panel */}
                      {p.expanded && (
                        <div style={{ borderTop: "1px solid #1e293b", padding: "14px 16px" }}>
                          <div className="grid grid-cols-2 gap-6">
                            {/* Date range */}
                            <div>
                              <p style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                                Date Range
                              </p>
                              <div className="flex items-center gap-2">
                                <input type="date" value={p.start}
                                  onChange={(e) => updatePeriod(p.id, { start: e.target.value })}
                                  style={{ background: "#0a0f1a", border: "1px solid #334155", color: "#e2e8f0",
                                    padding: "4px 8px", borderRadius: 2, fontSize: 12, fontFamily: mono }} />
                                <span style={{ color: "#475569", fontSize: 11 }}>→</span>
                                <input type="date" value={p.end}
                                  onChange={(e) => updatePeriod(p.id, { end: e.target.value })}
                                  style={{ background: "#0a0f1a", border: "1px solid #334155", color: "#e2e8f0",
                                    padding: "4px 8px", borderRadius: 2, fontSize: 12, fontFamily: mono }} />
                              </div>
                            </div>

                            {/* Vertical (multi-select dropdown) */}
                            <div style={{ position: "relative" }}>
                              <p style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                                Vertical {p.verticals.size > 0 && <span style={{ color: "#3b82f6" }}>({p.verticals.size})</span>}
                              </p>
                              <select multiple value={Array.from(p.verticals)}
                                onChange={(e) => {
                                  const selected = new Set(Array.from(e.target.selectedOptions, o => o.value));
                                  updatePeriod(p.id, { verticals: selected });
                                }}
                                style={{ background: "#0a0f1a", border: "1px solid #334155", color: "#e2e8f0",
                                  padding: "4px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, width: "100%",
                                  height: 72, overflow: "auto" }}>
                                {verticalRows.map((v, vi) => (
                                  <option key={vi} value={v.vertical as string}>{v.vertical as string}</option>
                                ))}
                                <option value="Untagged">Untagged</option>
                              </select>
                              {p.verticals.size > 0 && (
                                <button onClick={() => updatePeriod(p.id, { verticals: new Set() })} style={{
                                  background: "none", border: "none", color: "#ef4444", fontSize: 8, fontFamily: mono,
                                  cursor: "pointer", padding: 0, marginTop: 4,
                                }}>reset</button>
                              )}
                            </div>

                            {/* Statutes */}
                            <div>
                              <p style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                                Statutes
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {(STATUTES as readonly string[]).map((s) => {
                                  const active = p.statutes.has(s);
                                  return (
                                    <button key={s} onClick={() => {
                                      const next = new Set(p.statutes);
                                      if (next.has(s)) next.delete(s); else next.add(s);
                                      updatePeriod(p.id, { statutes: next });
                                    }} style={{
                                      background: active ? `${COLORS[s]}18` : "transparent",
                                      border: `1px solid ${active ? COLORS[s] : "#334155"}`,
                                      color: active ? COLORS[s] : "#475569",
                                      padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer",
                                    }}>{s}</button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Claim types */}
                            <div>
                              <p style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                                Claim Types
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {CLAIM_TYPES.map((ct) => {
                                  const active = p.claimTypes.has(ct);
                                  return (
                                    <button key={ct} onClick={() => {
                                      const next = new Set(p.claimTypes);
                                      if (next.has(ct)) next.delete(ct); else next.add(ct);
                                      updatePeriod(p.id, { claimTypes: next });
                                    }} style={{
                                      background: active ? "#1e293b" : "transparent",
                                      border: `1px solid ${active ? "#3b82f6" : "#334155"}`,
                                      color: active ? "#e2e8f0" : "#475569",
                                      padding: "2px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer",
                                    }}>{ct}</button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* States (multi-select dropdown) */}
                            <div>
                              <p style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                                States {p.states.size > 0 && <span style={{ color: "#3b82f6" }}>({p.states.size})</span>}
                              </p>
                              <select multiple value={Array.from(p.states)}
                                onChange={(e) => {
                                  const selected = new Set(Array.from(e.target.selectedOptions, o => o.value));
                                  updatePeriod(p.id, { states: selected });
                                }}
                                style={{ background: "#0a0f1a", border: "1px solid #334155", color: "#e2e8f0",
                                  padding: "4px 8px", borderRadius: 2, fontSize: 10, fontFamily: mono, width: "100%",
                                  height: 72, overflow: "auto" }}>
                                {US_STATES.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                              {p.states.size > 0 && (
                                <button onClick={() => updatePeriod(p.id, { states: new Set() })} style={{
                                  background: "none", border: "none", color: "#ef4444", fontSize: 8, fontFamily: mono,
                                  cursor: "pointer", padding: 0, marginTop: 4,
                                }}>reset</button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Per-period snapshot cards ─────────────────── */}
              {trendPeriods.map((p, pi) => {
                const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[pi] || "#64748b";
                const snap = (snapByPid[p.id] ?? [])[0];
                const claims = claimByPid[p.id] ?? [];
                const theories = theoryByPid[p.id] ?? [];
                const topPl = pi === 0 ? (Array.isArray(trendTopPlaintiffs.data) ? trendTopPlaintiffs.data : []) : [];
                return (
                  <div key={p.id} style={{ background: "#111827", borderRadius: 4, padding: "20px 24px", marginBottom: 16, borderLeft: `3px solid ${pColor}` }}>
                    <p style={{ color: pColor, fontSize: 10, fontFamily: mono, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
                      {p.label} — {p.start} to {p.end}
                    </p>

                    {/* KPI row */}
                    <div className="grid grid-cols-6 gap-4 mb-8">
                      {[
                        { label: "Total Filings", val: snap ? N(snap.total).toLocaleString() : "—", color: "#f1f5f9" },
                        { label: "Active", val: snap ? N(snap.active).toLocaleString() : "—", color: "#22c55e" },
                        { label: "Resolved", val: snap ? N(snap.resolved).toLocaleString() : "—", color: "#94a3b8" },
                        { label: "Class Actions", val: snap ? N(snap.class_actions).toLocaleString() : "—", color: "#f97316" },
                        { label: "Courts", val: snap ? N(snap.courts).toLocaleString() : "—", color: "#a78bfa" },
                        { label: "Avg Duration", val: snap && snap.avg_duration ? `${N(snap.avg_duration)}d` : "—", color: "#06b6d4" },
                      ].map((k, i) => (
                        <div key={i}>
                          {trendSnapshot.isLoading ? <Skeleton h={32} w="60%" /> : (
                            <p style={{ color: k.color, fontSize: 24, fontWeight: 400, fontFamily: mono, lineHeight: 1 }}>
                              {k.val}
                            </p>
                          )}
                          <p style={{ color: "#475569", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6, fontFamily: mono }}>
                            {k.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Claim, theory, top plaintiffs (first period only for plaintiffs) */}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                          Claim Type
                        </p>
                        {trendClaimBreakdown.isLoading ? <Skeleton h={60} /> : claims.length === 0 ? (
                          <p style={{ color: "#334155", fontSize: 11, fontFamily: mono }}>No classified claims</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {claims.map((r, i) => {
                              const total = claims.reduce((s: number, x: any) => s + N(x.cnt), 0);
                              const pct = total > 0 ? (N(r.cnt) / total * 100) : 0;
                              return (
                                <div key={i} className="flex items-center gap-2">
                                  <span style={{ color: "#e2e8f0", fontSize: 11, fontFamily: mono, width: 50 }}>{r.claim_type as string}</span>
                                  <div style={{ flex: 1, height: 8, background: "#0a0f1a", borderRadius: 2, overflow: "hidden" }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: pColor, borderRadius: 2 }} />
                                  </div>
                                  <span style={{ color: "#94a3b8", fontSize: 10, fontFamily: mono, width: 36, textAlign: "right" }}>{N(r.cnt)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                          Legal Theory
                        </p>
                        {trendTheoryBreakdown.isLoading ? <Skeleton h={60} /> : theories.length === 0 ? (
                          <p style={{ color: "#334155", fontSize: 11, fontFamily: mono }}>No classified theories</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {theories.map((r, i) => {
                              const total = theories.reduce((s: number, x: any) => s + N(x.cnt), 0);
                              const pct = total > 0 ? (N(r.cnt) / total * 100) : 0;
                              return (
                                <div key={i} className="flex items-center gap-2">
                                  <span style={{ color: "#e2e8f0", fontSize: 11, fontFamily: mono, width: 50 }}>{r.legal_theory as string}</span>
                                  <div style={{ flex: 1, height: 8, background: "#0a0f1a", borderRadius: 2, overflow: "hidden" }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: "#a78bfa", borderRadius: 2 }} />
                                  </div>
                                  <span style={{ color: "#94a3b8", fontSize: 10, fontFamily: mono, width: 36, textAlign: "right" }}>{N(r.cnt)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ color: "#64748b", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                          {pi === 0 ? "Most Active Plaintiffs" : ""}
                        </p>
                        {pi === 0 && (trendTopPlaintiffs.isLoading ? <Skeleton h={60} /> : topPl.length === 0 ? (
                          <p style={{ color: "#334155", fontSize: 11, fontFamily: mono }}>No repeat filers</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {topPl.map((r, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span style={{ color: "#e2e8f0", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}
                                  title={r.plaintiff as string}>
                                  {r.plaintiff as string}
                                </span>
                                <span style={{ color: pColor, fontSize: 10, fontFamily: mono, fontWeight: 700 }}>
                                  {N(r.cases)} cases
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Comparison KPIs (first 2 periods) ────────── */}
              {trendPeriods.length >= 2 && (
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div>
                    {trendSnapshot.isLoading ? <Skeleton h={40} w="60%" /> : (
                      <p style={{
                        color: pctChange > 0 ? "#ef4444" : pctChange < 0 ? "#22c55e" : "#f1f5f9",
                        fontSize: 36, fontWeight: 400, fontFamily: mono, lineHeight: 1,
                      }}>
                        {pctChange > 0 ? "+" : ""}{pctChange.toFixed(1)}%
                      </p>
                    )}
                    <p style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontFamily: mono }}>
                      P1 vs P2 Change
                    </p>
                  </div>
                  {trendPeriods.slice(0, 4).map((p, pi) => {
                    const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa"] as const)[pi] || "#64748b";
                    const total = (snapByPid[p.id] ?? []).reduce((s, r) => s + N(r.total), 0);
                    return (
                      <div key={p.id}>
                        {trendSnapshot.isLoading ? <Skeleton h={40} w="60%" /> : (
                          <p style={{ color: pColor, fontSize: 36, fontWeight: 400, fontFamily: mono, lineHeight: 1 }}>
                            {total.toLocaleString()}
                          </p>
                        )}
                        <p style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontFamily: mono }}>
                          {p.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Comparison Charts ─────────────────────────── */}
              {(() => {
                const PCOLORS_DEFAULT = ["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"];
                const PCOLORS = PCOLORS_DEFAULT.map((c, i) => getColor(`trend_period_${i}`, c));

                // 1. Total filings per period bar chart
                const filingsData = trendPeriods.map((p, pi) => ({
                  name: p.label,
                  total: N((snapByPid[p.id] ?? [])[0]?.total),
                  fill: PCOLORS[pi] || "#64748b",
                }));

                // 2. Claim type comparison — grouped bars
                const claimTypes = ["SMS", "Voice", "Fax"];
                const claimData = claimTypes.map((ct) => {
                  const row: Record<string, any> = { claim: ct };
                  trendPeriods.forEach((p) => {
                    const match = (claimByPid[p.id] ?? []).find((r: any) => r.claim_type === ct);
                    row[p.id] = match ? N(match.cnt) : 0;
                  });
                  return row;
                });

                // 3. Top courts comparison — grouped bars
                const allCourtRows = Object.values(courtByPid).flat() as any[];
                const courtTotals: Record<string, number> = {};
                allCourtRows.forEach((r: any) => { courtTotals[r.court as string] = (courtTotals[r.court as string] || 0) + N(r.cnt); });
                const topCourts = Object.entries(courtTotals).sort(([, a], [, b]) => b - a).slice(0, 8).map(([c]) => c);
                const courtData = topCourts.map((court) => {
                  const row: Record<string, any> = { court: court.toUpperCase() };
                  trendPeriods.forEach((p) => {
                    const match = (courtByPid[p.id] ?? []).find((r: any) => r.court === court);
                    row[p.id] = match ? N(match.cnt) : 0;
                  });
                  return row;
                });

                const ChartTip = ({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "10px 14px", borderRadius: 4 }}>
                      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 6, fontFamily: mono }}>{label}</p>
                      {payload.map((p: any) => (
                        <div key={p.dataKey} className="flex items-center gap-2" style={{ fontSize: 12, marginBottom: 2 }}>
                          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: p.color || p.fill }} />
                          <span style={{ color: "#e2e8f0" }}>{p.name || p.dataKey}</span>
                          <span style={{ color: "#e2e8f0", fontWeight: 700, marginLeft: "auto", fontFamily: mono }}>{p.value?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  );
                };

                return (
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Total Filings per Period */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 style={{ color: "#cbd5e1", fontSize: 14, fontWeight: 400, margin: 0 }}>
                          Total Filings by Period
                        </h2>
                        <div className="flex items-center gap-2">
                          <ChartSettingsBtn
                            colors={trendPeriods.map((p, pi) => ({ key: `trend_period_${pi}`, label: p.label, color: PCOLORS[pi] || "#64748b" }))}
                            onChange={setChartColor}
                          />
                          <SvgDownloadBtn
                            chartId="chart-trend-filings"
                            filename="trend-filings-by-period"
                            title="Total Filings by Period"
                            legendColors={trendPeriods.map((p, pi) => ({ label: p.label, color: PCOLORS[pi] || "#64748b" }))}
                          />
                        </div>
                      </div>
                      {trendSnapshot.isLoading ? <Skeleton h={180} /> : (
                        <div id="chart-trend-filings">
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={filingsData} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" fontSize={9} stroke="#334155" tick={{ fill: "#64748b", fontFamily: mono }}
                              axisLine={{ stroke: "#1e293b" }} tickFormatter={(v) => v.length > 10 ? v.slice(0, 10) + "…" : v} />
                            <YAxis fontSize={10} stroke="#334155" tick={{ fill: "#64748b", fontFamily: mono }} axisLine={{ stroke: "#1e293b" }} />
                            <Tooltip content={<ChartTip />} />
                            <Bar dataKey="total" radius={[2, 2, 0, 0]}>
                              {filingsData.map((d, i) => (
                                <Cell key={i} fill={d.fill} opacity={0.85} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* Claim Type Comparison */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 style={{ color: "#cbd5e1", fontSize: 14, fontWeight: 400, margin: 0 }}>
                          Claim Type by Period
                        </h2>
                        <div className="flex items-center gap-2">
                          <ChartSettingsBtn
                            colors={trendPeriods.map((p, pi) => ({ key: `trend_period_${pi}`, label: p.label, color: PCOLORS[pi] || "#64748b" }))}
                            onChange={setChartColor}
                          />
                          <SvgDownloadBtn
                            chartId="chart-trend-claims"
                            filename="trend-claim-type-by-period"
                            title="Claim Type by Period"
                            legendColors={trendPeriods.map((p, pi) => ({ label: p.label, color: PCOLORS[pi] || "#64748b" }))}
                          />
                        </div>
                      </div>
                      {trendClaimBreakdown.isLoading ? <Skeleton h={180} /> : (
                        <div id="chart-trend-claims">
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={claimData} barSize={14}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="claim" fontSize={10} stroke="#334155" tick={{ fill: "#64748b", fontFamily: mono }} axisLine={{ stroke: "#1e293b" }} />
                            <YAxis fontSize={10} stroke="#334155" tick={{ fill: "#64748b", fontFamily: mono }} axisLine={{ stroke: "#1e293b" }} />
                            <Tooltip content={<ChartTip />} />
                            {trendPeriods.map((p, pi) => (
                              <Bar key={p.id} dataKey={p.id} name={p.label} fill={PCOLORS[pi] || "#64748b"} radius={[2, 2, 0, 0]} opacity={0.85} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* Top Courts Comparison */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 style={{ color: "#cbd5e1", fontSize: 14, fontWeight: 400, margin: 0 }}>
                          Top Courts by Period
                        </h2>
                        <div className="flex items-center gap-2">
                          <ChartSettingsBtn
                            colors={trendPeriods.map((p, pi) => ({ key: `trend_period_${pi}`, label: p.label, color: PCOLORS[pi] || "#64748b" }))}
                            onChange={setChartColor}
                          />
                          <SvgDownloadBtn
                            chartId="chart-trend-courts"
                            filename="trend-courts-by-period"
                            title="Top Courts by Period"
                            legendColors={trendPeriods.map((p, pi) => ({ label: p.label, color: PCOLORS[pi] || "#64748b" }))}
                          />
                        </div>
                      </div>
                      {trendCourts.isLoading ? <Skeleton h={180} /> : (
                        <div id="chart-trend-courts">
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={courtData} layout="vertical" barSize={6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis type="number" fontSize={10} stroke="#334155" tick={{ fill: "#64748b", fontFamily: mono }} axisLine={{ stroke: "#1e293b" }} />
                            <YAxis type="category" dataKey="court" fontSize={9} stroke="#334155" tick={{ fill: "#64748b", fontFamily: mono }} axisLine={{ stroke: "#1e293b" }} width={45} />
                            <Tooltip content={<ChartTip />} />
                            {trendPeriods.map((p, pi) => (
                              <Bar key={p.id} dataKey={p.id} name={p.label} fill={PCOLORS[pi] || "#64748b"} radius={[0, 2, 2, 0]} opacity={0.85} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* ── Court volume by period (pivoted) ─────────── */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                      Court Volume by Period
                    </h2>
                    <HtmlDownloadBtn elementId="table-court-volume-period" filename="court-volume-by-period" title="Court Volume by Period" />
                  </div>
                  {trendCourts.isLoading ? <Skeleton h={150} /> : (() => {
                    // Collect all courts across periods
                    const allCourts = Array.from(new Set(trendCourtAllRows.map((r: any) => r.court as string))).slice(0, 10);
                    return (
                      <div id="table-court-volume-period">
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1e293b" }}>
                            <th style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "left", padding: "4px 10px 6px 0", fontWeight: 400 }}>Court</th>
                            {trendPeriods.map((p, pi) => {
                              const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[pi] || "#64748b";
                              return (
                                <th key={p.id} style={{ color: pColor, fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "right", padding: "4px 10px 6px 0", fontWeight: 400 }}>
                                  P{pi + 1}
                                </th>
                              );
                            })}
                            {trendPeriods.length === 2 && (
                              <th style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "right", padding: "4px 0 6px 0", fontWeight: 400 }}>Δ</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {allCourts.map((court, i) => {
                            const counts = trendPeriods.map((p) => {
                              const row = (courtByPid[p.id] ?? []).find((r: any) => r.court === court);
                              return row ? N(row.cnt) : 0;
                            });
                            return (
                              <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                                <td style={{ padding: "6px 10px 6px 0", color: "#94a3b8", fontSize: 11, fontFamily: mono }}>
                                  {court.toUpperCase()}
                                </td>
                                {counts.map((cnt, ci) => {
                                  const cColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[ci] || "#64748b";
                                  return (
                                    <td key={ci} style={{ padding: "6px 10px 6px 0", color: ci === 0 ? "#e2e8f0" : "#94a3b8", fontSize: 12, fontFamily: mono, textAlign: "right" }}>
                                      {cnt}
                                    </td>
                                  );
                                })}
                                {trendPeriods.length === 2 && (
                                  <td style={{ padding: "6px 0", textAlign: "right" }}><DeltaBadge val={counts[0] - counts[1]} /></td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      </div>
                    );
                  })()}
                </div>

                {/* ── Litigator activity by period ────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                      Litigator Activity by Period
                    </h2>
                    <HtmlDownloadBtn elementId="table-litigator-activity" filename="litigator-activity-by-period" title="Litigator Activity by Period" />
                  </div>
                  <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 12 }}>
                    Repeat filers (2+ cases) — watch for new entrants
                  </p>
                  {trendLitigators.isLoading ? <Skeleton h={150} /> : (() => {
                    const allPlaintiffs = Array.from(new Set(trendLitigatorAllRows.map((r: any) => r.plaintiff as string))).slice(0, 10);
                    return (
                      <div id="table-litigator-activity">
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1e293b" }}>
                            <th style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "left", padding: "4px 10px 6px 0", fontWeight: 400 }}>Plaintiff</th>
                            {trendPeriods.map((p, pi) => {
                              const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[pi] || "#64748b";
                              return (
                                <th key={p.id} style={{ color: pColor, fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "right", padding: "4px 10px 6px 0", fontWeight: 400 }}>
                                  P{pi + 1}
                                </th>
                              );
                            })}
                            {trendPeriods.length === 2 && (
                              <th style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "right", padding: "4px 0 6px 0", fontWeight: 400 }}>Signal</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {allPlaintiffs.map((plaintiff, i) => {
                            const counts = trendPeriods.map((p) => {
                              const row = (litByPid[p.id] ?? []).find((r: any) => r.plaintiff === plaintiff);
                              return row ? N(row.cnt) : 0;
                            });
                            let signal = "STEADY"; let sigColor = "#64748b";
                            if (trendPeriods.length >= 2) {
                              if (counts[0] > 0 && counts[1] === 0) { signal = "NEW"; sigColor = "#ef4444"; }
                              else if (counts[0] > counts[1]) { signal = "ACCEL"; sigColor = "#f97316"; }
                              else if (counts[0] < counts[1]) { signal = "SLOWING"; sigColor = "#22c55e"; }
                            }
                            return (
                              <tr key={i} style={{ borderBottom: "1px solid #111827", transition: "background 0.1s ease" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                                <td style={{ padding: "6px 10px 6px 0", color: "#e2e8f0", fontSize: 11, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  title={plaintiff}>{plaintiff}</td>
                                {counts.map((cnt, ci) => (
                                  <td key={ci} style={{ padding: "6px 10px 6px 0", color: ci === 0 ? "#e2e8f0" : "#94a3b8", fontSize: 12, fontFamily: mono, textAlign: "right" }}>
                                    {cnt}
                                  </td>
                                ))}
                                {trendPeriods.length === 2 && (
                                  <td style={{ padding: "6px 0", textAlign: "right" }}>
                                    <span style={{ color: sigColor, fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{signal}</span>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* ── Who Is Getting Sued (pivoted by period) ─── */}
              {(() => {
                // Pivot defendant rows by defendant name
                const allDefRows = defByPid["all"] ?? [];
                const defNames = Array.from(new Set(
                  allDefRows.map((r: any) => r.defendant as string).filter(Boolean)
                )).slice(0, 50);

                const sourceRows = defView === "defendants"
                  ? defNames.map((name) => {
                      const allRow = allDefRows.find((r: any) => r.defendant === name);
                      const vertical = (allRow?.vertical as string) || "Untagged";
                      const counts = trendPeriods.map((p) => {
                        const row = (defByPid[p.id] ?? []).find((r: any) => r.defendant === name);
                        return row ? N(row.cnt) : 0;
                      });
                      const all = N(allRow?.cnt ?? 0);
                      return { name, vertical, counts, all };
                    })
                  : Array.from(new Set(trendLitigatorAllRows.map((r: any) => r.plaintiff as string))).slice(0, 50).map((name) => {
                      const counts = trendPeriods.map((p) => {
                        const row = (litByPid[p.id] ?? []).find((r: any) => r.plaintiff === name);
                        return row ? N(row.cnt) : 0;
                      });
                      return { name, vertical: "—", counts, all: counts.reduce((s, c) => s + c, 0) };
                    });

                const filtered = sourceRows.filter((r) => r.counts.reduce((s, c) => s + c, 0) >= defMinCases);
                const sorted = [...filtered].sort((a, b) => {
                  switch (defSort) {
                    case "a": return b.counts[0] - a.counts[0];
                    case "b": return (b.counts[1] ?? 0) - (a.counts[1] ?? 0);
                    case "delta": return trendPeriods.length >= 2 ? Math.abs((b.counts[0] - (b.counts[1] ?? 0))) - Math.abs((a.counts[0] - (a.counts[1] ?? 0))) : 0;
                    case "name": return a.name.localeCompare(b.name);
                    default: return b.all - a.all;
                  }
                });

                const maxDef = sorted.length > 0 ? Math.max(...sorted.flatMap((r) => r.counts), 1) : 1;

                return (
                  <div style={{ marginTop: 28 }}>
                    <div className="flex items-center justify-between mb-1">
                      <h2 style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 400 }}>
                        Who Is Getting Sued
                      </h2>
                      <HtmlDownloadBtn elementId="table-who-sued-trends" filename="who-is-getting-sued-trends" title="Who Is Getting Sued" />
                    </div>
                    <p style={{ color: "#475569", fontSize: 11, fontFamily: mono, marginBottom: 12 }}>
                      Period comparison by vertical
                    </p>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex gap-0">
                        {(["defendants", "plaintiffs"] as const).map((v) => (
                          <button key={v} onClick={() => setDefView(v)} style={{
                            background: defView === v ? "#1e293b" : "transparent",
                            border: `1px solid ${defView === v ? "#3b82f6" : "#1e293b"}`,
                            color: defView === v ? "#e2e8f0" : "#475569",
                            padding: "4px 10px", fontSize: 10, fontFamily: mono, cursor: "pointer",
                            borderRadius: v === "defendants" ? "2px 0 0 2px" : "0 2px 2px 0",
                          }}>
                            {v === "defendants" ? "Defendants" : "Plaintiffs"}
                          </button>
                        ))}
                      </div>
                      <span style={{ color: "#1e293b" }}>|</span>
                      <span style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Sort:</span>
                      {(["total", "a", "b", "delta", "name"] as const).map((s) => (
                        <button key={s} onClick={() => setDefSort(s)} style={{
                          background: defSort === s ? "#1e293b" : "transparent",
                          border: `1px solid ${defSort === s ? "#3b82f6" : "#1e293b"}`,
                          color: defSort === s ? "#e2e8f0" : "#475569",
                          padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                          textTransform: "uppercase", letterSpacing: 0.5,
                        }}>
                          {s === "a" ? "P1" : s === "b" ? "P2" : s === "delta" ? "Change" : s === "name" ? "A-Z" : "Total"}
                        </button>
                      ))}
                      <span style={{ color: "#1e293b" }}>|</span>
                      <span style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>Min:</span>
                      <input type="range" min={1} max={10} value={defMinCases}
                        onChange={(e) => setDefMinCases(Number(e.target.value))}
                        style={{ width: 60, accentColor: "#3b82f6" }} />
                      <span style={{ color: "#94a3b8", fontSize: 10, fontFamily: mono }}>{defMinCases}+</span>
                    </div>

                    {/* Vertical filter pills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      <button onClick={() => setVerticalFilter(null)} style={{
                        background: !verticalFilter ? "#1e293b" : "transparent",
                        border: `1px solid ${!verticalFilter ? "#3b82f6" : "#1e293b"}`,
                        color: !verticalFilter ? "#e2e8f0" : "#475569",
                        padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                      }}>All Verticals</button>
                      {verticalRows.map((v, vi) => {
                        const vName = v.vertical as string;
                        const active = verticalFilter === vName;
                        return (
                          <button key={vi} onClick={() => setVerticalFilter(active ? null : vName)} style={{
                            background: active ? "#1e293b" : "transparent",
                            border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                            color: active ? "#e2e8f0" : "#475569",
                            padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                          }}>{vName}</button>
                        );
                      })}
                      <button onClick={() => setVerticalFilter(verticalFilter === "Untagged" ? null : "Untagged")} style={{
                        background: verticalFilter === "Untagged" ? "#1e293b" : "transparent",
                        border: `1px solid ${verticalFilter === "Untagged" ? "#3b82f6" : "#1e293b"}`,
                        color: verticalFilter === "Untagged" ? "#e2e8f0" : "#334155",
                        padding: "3px 8px", borderRadius: 2, fontSize: 9, fontFamily: mono, cursor: "pointer",
                      }}>Untagged</button>
                    </div>

                    {trendDefendants.isLoading ? <Skeleton h={200} /> : (
                      <div id="table-who-sued-trends">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2" style={{ height: 16 }}>
                          <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 70, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>Vertical</span>
                          <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, flex: 1, letterSpacing: 1, textTransform: "uppercase" }}>Name</span>
                          {trendPeriods.map((p, pi) => {
                            const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[pi] || "#64748b";
                            return (
                              <span key={p.id} style={{ color: pColor, fontSize: 7, fontFamily: mono, width: 50, textAlign: "right", flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>
                                {p.label.length > 8 ? p.label.slice(0, 8) + "…" : p.label}
                              </span>
                            );
                          })}
                          <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 40, textAlign: "right", flexShrink: 0, letterSpacing: 1, fontWeight: 700 }}>ALL TIME</span>
                          {trendPeriods.length === 2 && (
                            <span style={{ color: "#334155", fontSize: 7, fontFamily: mono, width: 70, flexShrink: 0, letterSpacing: 1, textTransform: "uppercase" }}>Signal</span>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 mb-4">
                          {sorted.map((r, i) => {
                            let signal = "STEADY"; let sigColor = "#64748b";
                            if (trendPeriods.length >= 2) {
                              const c0 = r.counts[0]; const c1 = r.counts[1] ?? 0;
                              if (c0 > 0 && c1 === 0) { signal = defView === "defendants" ? "NEW TARGET" : "NEW"; sigColor = "#ef4444"; }
                              else if (c0 > c1) { signal = defView === "defendants" ? "ESCALATING" : "ACCEL"; sigColor = "#f97316"; }
                              else if (c0 < c1) { signal = defView === "defendants" ? "DECLINING" : "SLOWING"; sigColor = "#22c55e"; }
                            }
                            return (
                              <div key={i} className="flex items-center gap-3" style={{ height: 24, transition: "background 0.1s ease", padding: "0 4px", borderRadius: 2 }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                                <span style={{ color: "#64748b", fontSize: 8, fontFamily: mono, width: 70, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  title={r.vertical}>
                                  {(r.vertical || "—").toUpperCase()}
                                </span>
                                <span style={{ color: "#e2e8f0", fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  title={r.name}>
                                  {r.name}
                                </span>
                                {r.counts.map((cnt, ci) => {
                                  const pColor = (["#3b82f6","#f97316","#22c55e","#a78bfa","#06b6d4"] as const)[ci] || "#64748b";
                                  return (
                                    <span key={ci} style={{ color: pColor, fontSize: 11, fontFamily: mono, width: 50, textAlign: "right", flexShrink: 0, fontWeight: 600 }}>
                                      {cnt || "—"}
                                    </span>
                                  );
                                })}
                                <span style={{ color: "#e2e8f0", fontSize: 11, fontFamily: mono, width: 40, textAlign: "right", flexShrink: 0, fontWeight: 700 }}>{r.all}</span>
                                {trendPeriods.length === 2 && (
                                  <span style={{ color: sigColor, fontSize: 7, fontFamily: mono, letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 700, width: 70, flexShrink: 0 }}>
                                    {signal}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                          {sorted.length === 0 && (
                            <p style={{ color: "#475569", fontSize: 11, fontFamily: mono }}>No results — try lowering the minimum case threshold</p>
                          )}
                        </div>

                        {/* Showing count */}
                        <span style={{ color: "#334155", fontSize: 9, fontFamily: mono }}>
                          Showing {sorted.length} of {sourceRows.length}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}

          {/* ═══════════ TAB: METHODOLOGY ═══════════ */}
          {activeTab === "methodology" && (
            <>
              <div style={{ maxWidth: 720 }}>
                <h2 style={{ color: "#cbd5e1", fontSize: 18, fontWeight: 400, marginBottom: 16 }}>
                  Data Sources & Methodology
                </h2>

                {/* ── Source ─────────────────────────────────── */}
                <div style={{ borderLeft: "3px solid #3b82f6", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#3b82f6", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Primary Source
                  </p>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>
                    CourtListener RECAP Archive — a free, open database of federal court records maintained by Free Law Project.
                    Data is accessed via the CourtListener REST API v4 (<span style={{ fontFamily: mono, fontSize: 11, color: "#94a3b8" }}>courtlistener.com/api/rest/v4/</span>).
                  </p>
                </div>

                {/* ── Coverage ──────────────────────────────── */}
                <div style={{ borderLeft: "3px solid #22c55e", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#22c55e", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Coverage Window
                  </p>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>
                    Trailing 2 years from date of initial pull, with a hard floor
                    of <span style={{ fontFamily: mono, fontSize: 11, color: "#94a3b8" }}>April 1, 2021</span> — the date
                    of <em>Facebook v. Duguid</em>, which narrowed the ATDS definition and reshaped TCPA litigation
                    strategy. All data is post-Duguid to avoid mixing pre/post-Duguid precedent.
                    Federal courts only — state court filings are not included
                    in the RECAP dataset. Data is updated incrementally via <span style={{ fontFamily: mono, fontSize: 11, color: "#94a3b8" }}>python3 ingest.py --update</span>.
                  </p>
                </div>

                {/* ── Statutes ─────────────────────────────── */}
                <div style={{ borderLeft: "3px solid #f97316", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#f97316", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Statute Queries & Filtering
                  </p>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
                    Each statute is searched independently. For TCPA cases, we additionally classify sub-claims
                    using keyword heuristics on docket entry text:
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        {["Category", "Classification", "Keywords Scanned"].map((h) => (
                          <th key={h} style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "left", padding: "4px 10px 6px 0", fontWeight: 400 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { category: "Claim Type", cls: "SMS", keywords: '"text message", "SMS", "MMS"' },
                        { category: "", cls: "Voice", keywords: '"prerecorded", "robocall", "artificial voice", "ringless voicemail", "RVM"' },
                        { category: "", cls: "Fax", keywords: '"junk fax", "unsolicited fax", "fax"' },
                        { category: "Legal Theory", cls: "ATDS", keywords: '"automatic telephone dialing system", "ATDS", "autodialer"' },
                        { category: "", cls: "DNC", keywords: '"national do not call", "DNC registry", "internal do not call"' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
                          <td style={{ padding: "6px 10px 6px 0", color: "#3b82f6", fontSize: 12, fontFamily: mono, fontWeight: 700 }}>
                            {row.category}
                          </td>
                          <td style={{ padding: "6px 10px 6px 0", color: "#e2e8f0", fontSize: 11, fontFamily: mono }}>
                            {row.cls}
                          </td>
                          <td style={{ padding: "6px 0", color: "#94a3b8", fontSize: 11, fontFamily: mono }}>
                            {row.keywords}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Process ──────────────────────────────── */}
                <div style={{ borderLeft: "3px solid #a78bfa", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#a78bfa", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Ingestion Process
                  </p>
                  <ol style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
                    <li>Text-search CourtListener RECAP dockets for each statute query</li>
                    <li>Post-filter using nature-of-suit codes (e.g., NOS 485 for TCPA) to remove false positives from keyword matching</li>
                    <li>PDF rescue: cases rejected by NOS filter get a second chance — if the complaint PDF mentions TCPA, the case is kept (catches court miscodes)</li>
                    <li>Extract plaintiff names from search result party data and complaint descriptions; regex-clean class action boilerplate</li>
                    <li>Download the complaint PDF from RECAP storage and extract full text via pdfplumber</li>
                    <li>Classify claim type (SMS/Voice/Fax) and legal theory (ATDS/DNC) from complaint text keywords</li>
                    <li>Flag class actions based on case name patterns and complaint text</li>
                    <li>Deduplicate on (docket ID, statute) and load into MotherDuck</li>
                  </ol>
                </div>

                {/* ── Serial litigator ─────────────────────── */}
                <div style={{ borderLeft: "3px solid #ef4444", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#ef4444", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Serial Litigator Identification
                  </p>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>
                    Plaintiffs are extracted from the CourtListener search result's inline party data and complaint
                    document descriptions (parsing "filed by" text). A regex cleaner strips class-action boilerplate
                    from names — phrases like "individually and on behalf of all others similarly situated," "et al.,"
                    "on behalf of himself," and "and all others" — before loading into MotherDuck. This produces
                    highly accurate exact-match counts for serial litigator identification (~99% extraction rate).
                    Professional litigator databases (e.g., Trestle, WebRecon) may provide additional matching
                    via phone numbers and attorney networks.
                  </p>
                </div>

                {/* ── Class Action ─────────────────────────── */}
                <div style={{ borderLeft: "3px solid #06b6d4", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#06b6d4", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Class Action Flagging
                  </p>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>
                    Each case is flagged as a class action if the case name contains "similarly situated" or "on behalf of,"
                    or if the docket entry text contains the phrase "class action." Dashboard exposure figures represent the
                    statutory minimum per individual case ($500/$1,500), but flagged class actions carry substantially
                    higher aggregate exposure due to the multiplied plaintiff class.
                  </p>
                </div>

                {/* ── Unclassified data ─────────────────────── */}
                <div style={{ borderLeft: "3px solid #f97316", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ color: "#f97316", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Unclassified TCPA Data
                  </p>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>
                    Some TCPA dockets were filed under TCPA statutes in federal court but could not be automatically
                    classified into SMS/Voice or ATDS/DNC sub-categories. These cases are confirmed TCPA litigation
                    (matched by statute query and nature-of-suit codes), but the complaint text available via RECAP
                    did not contain sufficient keywords to determine the specific claim type or legal theory.
                    By default, the dashboard excludes these cases to provide clean, actionable breakdowns.
                    Use the <span style={{ fontFamily: mono, fontSize: 11, color: "#f97316" }}>Include unclassified</span> toggle
                    in the filter bar to add them back into all views for a more complete case count.
                  </p>
                </div>

                {/* ── Limitations ──────────────────────────── */}
                <div style={{ background: "#111827", borderRadius: 4, padding: "16px 20px", borderLeft: "3px solid #334155" }}>
                  <p style={{ color: "#94a3b8", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                    Known Limitations
                  </p>
                  <ul style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
                    <li style={{ color: "#f97316", fontWeight: 600 }}>State-level Mini-TCPAs (e.g., Florida FTSA, Washington WADAD, Oklahoma TSHA) are a massive source of phone/SMS litigation but are entirely excluded from this dashboard. CourtListener's RECAP API only covers Federal PACER dockets; state court filings are not captured unless they are removed to federal court.</li>
                    <li>RECAP coverage is extensive but not 100% of federal dockets</li>
                    <li>Recent dockets may have null nature_of_suit/cause until CourtListener indexes them</li>
                    <li>Text-search may still include some false positives despite post-filtering</li>
                    <li>Claim type and legal theory classification relies on keyword heuristics on complaint document text — cases without matching keywords are separated into an unclassified dataset (toggleable via the filter bar)</li>
                    <li>Settlement and judgment amounts are not available from docket metadata</li>
                    <li>No outcome data (win/loss/settlement) — would require opinion/document analysis</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Download settings (bottom of page) ── */}
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span style={{ color: "#334155", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Download format
            </span>
            {(["svg", "png"] as const).map((fmt) => {
              const active = getDefaultFormat() === fmt;
              return (
                <button key={fmt} onClick={() => { setDefaultFormat(fmt); setPage(0); }} style={{
                  background: active ? "#1e293b" : "transparent",
                  border: `1px solid ${active ? "#3b82f6" : "#1e293b"}`,
                  color: active ? "#3b82f6" : "#475569",
                  padding: "3px 10px", borderRadius: 2, fontSize: 10, fontFamily: mono, cursor: "pointer",
                  transition: "all 0.15s ease",
                }}>
                  .{fmt}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2" style={{ cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={getIncludeLegend()}
              onChange={(e) => { setIncludeLegendPref(e.target.checked); setPage(0); }}
              style={{ accentColor: "#3b82f6", width: 11, height: 11, cursor: "pointer" }}
            />
            <span style={{ color: getIncludeLegend() ? "#94a3b8" : "#334155", fontSize: 9, fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Include legend in downloads
            </span>
          </label>
        </div>
        <span style={{ color: "#1e293b", fontSize: 9, fontFamily: mono }}>
          Right-click any ↓ button to choose format per-download
        </span>
      </div>
    </div>
  );
}
