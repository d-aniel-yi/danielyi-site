#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const appRoot = process.cwd();
const srcDir = path.join(appRoot, "src", "app", "resume", "resources");
const exportOutDir = path.join(appRoot, "out", "resume", "resources");
const publicDir = path.join(appRoot, "public", "resume", "resources");

mkdirSync(publicDir, { recursive: true });

const files = ["template.tex", "resume.cls"];
for (const f of files) {
  copyFileSync(path.join(srcDir, f), path.join(publicDir, f));
  console.log(`Synced ${f}`);
}

// If a built resume exists at out/resume/resources/main.tex, mirror it into public for runtime access
try {
  copyFileSync(path.join(exportOutDir, "main.tex"), path.join(publicDir, "main.tex"));
  console.log("Synced main.tex from out/resume/resources to public.");
} catch {}


