---
phase: 6
slug: content-expansion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js static export validation |
| **Config file** | `next.config.js` (existing) |
| **Quick run command** | `npm run build` (from `apps/web`) |
| **Full suite command** | `npm run build && npm run export` (from `apps/web`) |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run export`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | CONT-01 | — | N/A | automated | `npm run build` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | CONT-01 | — | N/A | manual | Navigate to `/projects/mobi` and count sections | ✅ | ⬜ pending |
| 06-01-03 | 01 | 1 | CONT-01 | — | N/A | manual | Grep Mobi source for patterns matching page snippets | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| New sections visible on page | CONT-01, Success #1 | Visual content verification | Navigate to `/projects/mobi` in dev/export, count sections beyond original 4 |
| Content accuracy vs Mobi repo | CONT-01, Success #2 | Semantic correctness check | Compare code snippets on page with actual Mobi source files |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
