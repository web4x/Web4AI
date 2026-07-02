> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.3: dev vs macos.latest — newer / more-reliable + reconcile
[task:uuid:ec3af15e-ae9c-4ef9-ad5d-61826c8fdbae]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Role: architect (analysis) → PO (reconcile decision).** Tron: "check if macos.latest is newer or more reliable." Determine per-capability (not global — see the layer-specific learning): commit recency, which branch leads on otmux-send / c2 / boot / install; where macos.latest is more reliable, plan the port TO dev (and vice-versa). Feeds the eventual S3 dev↔macos.latest merge (currently parked pending Tron a/b).

## Definition of Done
- per-capability newer/more-reliable verdict (otmux-send, c2, boot, install) with commit evidence
- reconcile direction per capability (port macos→dev or dev→macos)
- informs S3 merge decision

## Report-back
- Architect (per-capability analysis):
- PO (reconcile plan):
