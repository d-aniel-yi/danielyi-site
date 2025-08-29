#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..");
const appRoot = process.cwd();
const resourcesDir = path.join(appRoot, "src", "app", "resume", "resources");
const outDir = path.join(appRoot, "public", "resume");
const texFile = path.join(resourcesDir, "template.tex");

if (!existsSync(texFile)) {
  console.error(`Missing template: ${texFile}`);
  process.exit(1);
}
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { stdio: "inherit", cwd, shell: process.platform === "win32" });
  return res.status === 0;
}

// Prefer tectonic (fast, self-contained). Fallback to pdflatex.
const tryTectonic = () => run("tectonic", ["--outdir", outDir, texFile], resourcesDir);
const tryPdfLaTeX = () => run("pdflatex", ["-interaction=nonstopmode", `-output-directory=${outDir}`, texFile], resourcesDir);

let ok = false;
console.log("Building resume PDF…");
ok = tryTectonic();
if (!ok) {
  console.warn("tectonic not found or failed; trying pdflatex…");
  ok = tryPdfLaTeX();
}

if (!ok) {
  console.error("Failed to build resume. Install tectonic (recommended) or a LaTeX distribution with pdflatex.");
  console.error("Windows (Chocolatey): choco install tectonic | macOS (Homebrew): brew install tectonic");
  process.exit(1);
}

console.log(`Resume built → ${path.join(outDir, "template.pdf")} (rename to resume.pdf if desired)`);
// Standardize output filename to resume.pdf for the viewer
// Many LaTeX engines name output after the .tex file; ensure we have resume.pdf
const builtPath = path.join(outDir, "template.pdf");
const targetPath = path.join(outDir, "resume.pdf");
try {
  if (existsSync(builtPath)) {
    // Windows doesn't support atomic rename across drives; both paths are in same dir
    spawnSync(process.platform === "win32" ? "cmd" : "mv", process.platform === "win32" ? ["/c", "move", "/y", builtPath, targetPath] : [builtPath, targetPath], { stdio: "inherit" });
  }
} catch (_) {}

console.log(`Ready: ${targetPath}`);


