---
phase: 05
slug: diagram-navigation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-04-06
---

# Phase 05 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| page → external URL | GitHub buttons navigate to github.com in a new tab | No sensitive data — static URL only |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-05-01 | Elevation of Privilege | `<a target="_blank">` to external URL | mitigate | `rel="noopener noreferrer"` on both GitHub `<a>` elements — prevents tabnapping and Referer leakage | closed |
| T-05-02 | Information Disclosure | ReactFlow `window.opener` via diagram | accept | No PII, secrets, or sensitive state in diagram. Node/edge data is static hardcoded content. | closed |
| T-05-03 | Tampering | Animation state (edge colors) via devtools | accept | Animation state is cosmetic only. No business logic, auth state, or data integrity depends on it. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-05-01 | T-05-02 | ReactFlow renders static hardcoded data only — no user input, no PII, no secrets | gsd-security-audit | 2026-04-06 |
| AR-05-02 | T-05-03 | Edge animation colors are cosmetic — altering via devtools has zero impact on functionality or security | gsd-security-audit | 2026-04-06 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-04-06 | 3 | 3 | 0 | gsd-secure-phase orchestrator |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-04-06
