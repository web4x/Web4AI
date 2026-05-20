[Back to Task I1](./task-i1-context-aware-send-design.md)

# Task I1.2: Expert - INFORM path
[task:uuid:i1a2-inform-2026-04-21]

## Status
- [x] Planned
- [x] In Progress
  - [x] implementing
  - [x] testing (I1.5 13/13 PASS — commit 449ee34)
- [x] QA Review
- [x] Done

## Traceability
- up
  - [Task I1: Context-Aware Send Design](./task-i1-context-aware-send-design.md)

## Description
**Role: oosh-expert**

Implement the INFORM path — the eligible-only-when-idle branch of the router.

### Behaviour
- Eligible state: `idle` only (else router queues — that's I1.4's job)
- Mechanism: delegates to existing `otmux send <pane> <text>` (smart-prefix
  from B5 + target validation from Bug#4 already in place)
- Returns `delivered <agent> <pane>` per the I1 contract

### Implementation
- Internal helper `private.hiveMind.agent.inform <pane> <text>` that the router
  invokes when `state == idle`
- Reuses existing `otmux.send` smart mode (no special key handling — just text)

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic I: Context-Aware Send*
