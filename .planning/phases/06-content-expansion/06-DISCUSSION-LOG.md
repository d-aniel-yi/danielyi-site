# Phase 6: Content Expansion - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06
**Phase:** 06-content-expansion
**Areas discussed:** Content scope, Content depth & format, Content sourcing, Visual treatment

---

## Content Scope

| Option | Description | Selected |
|--------|-------------|----------|
| SAM/ML Pipeline | Segment Anything Model integration — how images flow through the ML pipeline | ✓ |
| WebSocket Real-time | Real-time updates via WebSockets — how the frontend gets notified when processing completes | ✓ |
| Testing & CI/CD | Testing strategy, CI pipeline, deployment approach | |
| You decide | Claude picks the most compelling topics | |

**User's choice:** SAM/ML Pipeline, WebSocket Real-time, plus custom: UI design (icons, redoing the workspace so windows can be moved and resized)

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, expand all | Add more depth to all 4 existing sections too | |
| Leave as-is | Existing sections are fine — focus on new sections only | ✓ |
| Expand selectively | Only expand sections that feel thin | |

**User's choice:** Leave as-is

| Option | Description | Selected |
|--------|-------------|----------|
| 5-6 total | Add 1-2 new sections — keep it focused | |
| 7-8 total | Add 3-4 new sections — comprehensive showcase | |
| Whatever fits | Add as many as the Mobi repo docs justify — quality over count | ✓ |

**User's choice:** Whatever fits

---

## Content Depth & Format

| Option | Description | Selected |
|--------|-------------|----------|
| Brief overview + code | Same depth as existing sections | |
| Deep technical dive | More detailed — explain the why, show multiple code snippets, discuss tradeoffs | |
| Mixed | Some sections deeper than others based on how interesting the topic is | ✓ |

**User's choice:** Mixed

| Option | Description | Selected |
|--------|-------------|----------|
| Real code | Pull actual snippets from the Mobi repo | |
| Simplified | Write clean representative examples | |
| Mix of both | Real code for impressive parts, simplified for complex internals | ✓ |

**User's choice:** Mix of both

---

## Content Sourcing

| Option | Description | Selected |
|--------|-------------|----------|
| Clone and read the Mobi repo | Clone the repo and read actual source code and docs | |
| You provide key details | User describes the content, Claude writes it up | |
| Use what's public on GitHub | Fetch files from the GitHub API without cloning | |
| I'll paste relevant docs | User pastes documentation into chat | |

**User's choice:** Custom — "Use what's public on GitHub, but also, we should have the repo locally at H:\mobi\metrostudio"
**Notes:** Local repo available for direct file reading

---

## Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Same pattern | Consistent look — text paragraphs + one dark code block per section | |
| Enhanced pattern | Allow richer elements like callout boxes, bullet lists, before/after comparisons | |
| Section-specific | Each section uses whatever format best suits its content | ✓ |

**User's choice:** Section-specific

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include images | Add screenshots showing the UI | |
| Text + code only | Describe the UI work with text and code snippets, no images | ✓ |
| If good images exist | Include images only if they're already available and polished | |

**User's choice:** Text + code only

---

## Claude's Discretion

- Exact section ordering among the new sections
- How to structure each section's narrative flow
- Which specific code snippets to highlight from the Mobi repo
- Whether to add sub-sections within longer topics

## Deferred Ideas

- Section-specific diagrams that swap as you scroll (carried from Phase 5)
- Screenshots/images of the Mobi app UI — decided against for now
