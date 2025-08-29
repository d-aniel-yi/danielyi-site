#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const appRoot = process.cwd();
const srcDir = path.join(appRoot, "src", "app", "resume", "resources");
const outDir = path.join(appRoot, "public", "resume", "resources");

mkdirSync(outDir, { recursive: true });

const files = ["template.tex", "resume.cls"];
for (const f of files) {
  copyFileSync(path.join(srcDir, f), path.join(outDir, f));
  console.log(`Synced ${f}`);
}


