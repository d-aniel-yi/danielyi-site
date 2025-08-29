"use client";
import { useEffect, useState } from "react";

type CompileState = "idle" | "loading" | "ready" | "error";

export function LatexWasmViewer() {
  const [tex, setTex] = useState<string>("");
  const [cls, setCls] = useState<string>("");
  const [state, setState] = useState<CompileState>("idle");
  const [error, setError] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    async function loadSources() {
      try {
        const tex = await fetchFirst([
          "/resume/resources/template.tex",
          "/api/resume/tex",
          "/src/app/resume/resources/template.tex",
        ]);
        const clsContent = await fetchFirst([
          "/resume/resources/resume.cls",
          "/api/resume/cls",
          "/src/app/resume/resources/resume.cls",
        ]);
        setTex(tex);
        setCls(clsContent);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(`Failed to load LaTeX sources: ${msg}`);
      }
    }
    loadSources();
  }, []);

  async function compile() {
    setError("");
    setState("loading");
    try {
      const engine = await loadSwiftLatexEngine();
      // Minimal PdfTeXEngine API usage
      engine.writeMemFSFile("resume.cls", cls);
      engine.writeMemFSFile("main.tex", tex);
      if (engine.setEngineMainFile) engine.setEngineMainFile("main.tex");
      if (engine.setTexliveEndpoint) {
        try { engine.setTexliveEndpoint("https://texlive.swiftlatex.com"); } catch (_) {}
      }
      if (engine.flushCache) { try { engine.flushCache(); } catch (_) {}
      }
      const result: any = await withTimeout(engine.compileLaTeX(), 45000, "WASM engine compile timed out; ensure pdftex.wasm is present next to PdfTeXEngine.js and network is allowed to texlive.swiftlatex.com");
      const pdfBytes: Uint8Array = (result && (result.pdfBinary || result.pdf)) as Uint8Array;
      if (!pdfBytes) throw new Error("Engine returned no PDF bytes");
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setState("ready");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setState("error");
    }
  }

  const disabled = state === "loading" || !tex;

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          className="text-sm px-3 py-2 rounded-md border border-black/10 dark:border-white/10 hover:bg-white/10 disabled:opacity-60"
          onClick={compile}
          disabled={disabled}
        >
          {state === "loading" ? "Compiling…" : "Compile LaTeX (WASM)"}
        </button>
        {error && (
          <span className="text-xs opacity-70">{error}</span>
        )}
      </div>
      {pdfUrl && (
        <div className="mt-4 rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-white">
          <object data={pdfUrl} type="application/pdf" className="w-full h-[calc(100vh-220px)]">
            <p className="p-4 text-sm">PDF preview unavailable.</p>
          </object>
        </div>
      )}
    </div>
  );
}

async function fetchFirst(paths: string[]): Promise<string> {
  for (const p of paths) {
    try {
      const r = await fetch(p);
      if (r.ok) return await r.text();
    } catch (_) {}
  }
  throw new Error("All source paths failed");
}

declare global {
  interface Window {
    PdfTeXEngine?: any;
  }
}

async function loadSwiftLatexEngine(): Promise<any> {
  if (typeof window === "undefined") throw new Error("Window not available");
  if (window.PdfTeXEngine) {
    const e = new window.PdfTeXEngine();
    if (e.loadEngine) await withTimeout(e.loadEngine(), 15000, "Failed to load WASM engine (timeout). Verify wasm file path and CSP.");
    return e;
  }
  // Inject script from public vendor path
  // Prefer hosted engine first (it knows its own wasm path). If blocked by CSP/offline, fall back to local.
  await injectFirst([
    "https://www.swiftlatex.com/PdfTeXEngine.js",
    "/vendor/swiftlatex/PdfTeXEngine.js",
  ]);
  if (!window.PdfTeXEngine) throw new Error("PdfTeXEngine not found. Ensure vendor files are placed correctly.");
  const engine = new window.PdfTeXEngine();
  if ((window as any).Module == null) {
    // Hint for emscripten engines to resolve wasm path when using local copy
    (window as any).Module = {
      locateFile: (p: string) => {
        if (p.endsWith(".wasm")) return "/vendor/swiftlatex/pdftex.wasm";
        return p;
      },
    };
  }
  if (engine.loadEngine) await withTimeout(engine.loadEngine(), 45000, "Failed to load WASM engine (timeout). Verify wasm file path and CSP.");
  return engine;
}

function injectScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

async function injectFirst(paths: string[]) {
  let lastErr: any;
  for (const p of paths) {
    try {
      await injectScript(p);
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("Failed to load any engine script");
}

function withTimeout<T>(p: Promise<T>, ms: number, msg: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(msg)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}


