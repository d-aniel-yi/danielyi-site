---
phase: 5
slug: diagram-navigation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build (`next build`) + TypeScript (`tsc --noEmit`) |
| **Config file** | `next.config.js`, `tsconfig.json` |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx next build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx next build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | DIAG-01 | — | N/A | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | DIAG-02 | — | N/A | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-01-03 | 01 | 1 | DIAG-03 | — | N/A | build | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 05-01-04 | 01 | 1 | NAV-01 | — | External link uses rel="noopener noreferrer" | build | `npx tsc --noEmit` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Diagram appears inline in scroll flow | DIAG-01 | Visual layout verification | Load /projects/mobi, confirm diagram is in page flow not side panel |
| Diagram cannot be zoomed/panned/dragged | DIAG-02 | Interaction testing | Attempt scroll-zoom, drag nodes, pan — all should be no-ops |
| Edges auto-animate on load | DIAG-03 | Animation verification | Load page, observe edges animate without clicking |
| GitHub button navigates correctly | NAV-01 | Link verification | Click "View on GitHub", confirm navigates to github.com/d-aniel-yi/mobi |
| Diagram hidden on mobile | D-03 | Responsive layout | Resize to <1024px, confirm diagram panel is hidden |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
