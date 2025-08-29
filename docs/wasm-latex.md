### In-Browser LaTeX (WASM) — SwiftLaTeX Vendoring Guide

Goal: Compile `apps/web/src/app/resume/resources/template.tex` to PDF in the browser using a vendored PdfTeX WASM engine (SwiftLaTeX), no server LaTeX install required.

Directory layout
- Place engine assets in: `apps/web/public/vendor/swiftlatex/`
- Existing UI entrypoint: `LatexWasmViewer` loads `/vendor/swiftlatex/PdfTeXEngine.js`

Steps
1) Download engine assets from SwiftLaTeX (PdfTeX engine release)
   - Required files (names may vary by release):
     - `PdfTeXEngine.js`
     - `PdfTeXEngine.wasm`
     - Optional data files the JS references (e.g., `.data`, fonts/resources)
   - Source: SwiftLaTeX GitHub releases
2) Vendor the files
   - Copy the files into `apps/web/public/vendor/swiftlatex/`
   - Keep them adjacent (the loader resolves `.wasm/.data` relative to the `.js`)
3) Test locally
   - `pnpm --filter ./apps/web dev`
   - Open `/resume` → click “Compile LaTeX (WASM)”
4) CSP considerations (if strict CSP is enabled at CDN)
   - WASM often needs `wasm-unsafe-eval` in `script-src` (or the engine’s documented requirement)
   - If required, add to CloudFront Response Headers Policy `Content-Security-Policy`:
     - `script-src 'self' 'wasm-unsafe-eval';`
5) Licensing
   - Add the upstream LICENSE file to `apps/web/public/vendor/swiftlatex/` or `docs/third-party-licenses.md`
6) Version pinning
   - Record engine version + SHA256 checksums in `docs/third-party-licenses.md` for integrity auditing

How it works in this repo
- `LatexWasmViewer` loads the class (`resume.cls`) and template (`template.tex`), then injects the class inline so the engine can compile a single `main.tex`.
- It dynamically injects the engine script from `/vendor/swiftlatex/PdfTeXEngine.js`, waits for `window.PdfTeXEngine`, then compiles to a PDF blob and embeds it.

Troubleshooting
- If the engine loads but compilation fails immediately: verify the `.wasm/.data` files are present alongside `PdfTeXEngine.js`.
- If the script fails to load: confirm path `/vendor/swiftlatex/PdfTeXEngine.js` is correct and reachable.
- If CSP blocks execution: add `wasm-unsafe-eval` (or `unsafe-eval` if the engine requires it) to `script-src`.


