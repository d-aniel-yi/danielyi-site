# Phase 5: Diagram & Navigation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06
**Phase:** 05-diagram-navigation
**Areas discussed:** Diagram placement, Animation style, Diagram sizing, GitHub button placement

---

## Diagram Placement

| Option | Description | Selected |
|--------|-------------|----------|
| After the header, before sections | Diagram sits right below the title, then content sections follow | |
| Between header and first section | Brief intro text first, then diagram, then detailed sections | |
| After the 'Microservices Architecture' section | Overview text explains architecture, then diagram visualizes it | |

**User's choice:** Keep side panel layout but narrower (30-40% instead of 50%)
**Notes:** User prefers the diagram staying on the left side, just taking less screen real estate. Chose sticky behavior — diagram stays visible while scrolling content, with the intent that future phases could swap diagrams per section.

## Diagram Scroll Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky on left | Diagram stays visible as you scroll content | ✓ |
| Scrolls with page | Diagram scrolls away as you read down | |

**User's choice:** Sticky but static positionally — scrolls away to next diagram when reaching a new section (future-proofing)
**Notes:** Since Phase 5 has only one diagram, it will be sticky for the full page.

## Animation Style

| Option | Description | Selected |
|--------|-------------|----------|
| Loop continuously | Sequential edge animation plays on repeat forever | ✓ |
| Play once on load | Edges animate through sequence once, stay in final state | |
| Play once, then reset | Edges animate once, return to default non-animated state | |

**User's choice:** Loop continuously
**Notes:** Gives a sense of data always flowing through the system.

## Diagram Sizing

| Option | Description | Selected |
|--------|-------------|----------|
| 30% width (narrow) | More room for content, diagram compact | |
| 35% width (balanced) | Middle ground — diagram has breathing room | ✓ |
| 40% width (generous) | Diagram prominent, content column slightly narrower | |

**User's choice:** 35% width (balanced)

## Mobile Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Show above content | Diagram appears as block above content at fixed height | |
| Hide on mobile | Diagram is desktop-only, mobile users see content directly | ✓ |

**User's choice:** Hide on mobile

## GitHub Button Placement

| Option | Description | Selected |
|--------|-------------|----------|
| In the page header | Next to or below the title — prominent and immediately visible | ✓ |
| Below the diagram panel | Under the sticky diagram — associates link with visualization | |
| At the end of content | After last content section — natural CTA after reading | ✓ |

**User's choice:** Both in the header and end of content
**Notes:** Two placements for maximum visibility.

## Claude's Discretion

- Exact animation timing/intervals for the continuous loop
- Button styling
- ReactFlow attribution badge positioning with narrower panel

## Deferred Ideas

- Section-specific diagrams that swap per content section — future phase
