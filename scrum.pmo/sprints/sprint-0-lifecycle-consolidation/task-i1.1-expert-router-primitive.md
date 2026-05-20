[Back to Task I1](./task-i1-context-aware-send-design.md)

# Task I1.1: Expert - Context-Aware Send Router Primitive
[task:uuid:i1a1-router-2026-04-21]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (inherits I1 design)
  - [x] creating test cases (handed to I1.5)
  - [x] implementing
  - [x] testing (I1.5 13/13 PASS — commit 449ee34)
- [x] QA Review
- [x] Done

## Traceability
- up
  - [Task I1: Context-Aware Send Design](./task-i1-context-aware-send-design.md)

## Description
**Role: oosh-expert**

Implement the routing primitive that classifies pane state and dispatches to one
of three paths (INFORM / REMOTE CONTROL / QUEUE).

### Required methods
- `hiveMind.agent.send <agent|pane> <text>` — main entry, intent = INFORM
- `private.hiveMind.agent.route <pane>` — returns `inform|remote-control|queue|reject`

### Key behaviour
- Resolve `<agent>` to pane via existing `hiveMind.resolve` + Bug#4 target validation
- Call `sweep.detect <pane>` to classify state
- Route based on state:
  - `idle` → INFORM (delegates to I1.2)
  - `permission|tool-confirm|accept-edits` → REJECT (caller should use approve/reject/dismiss/option)
  - `active|queued|unknown` → QUEUE (delegates to I1.4)
- TTL=0 cache (per PO decision 3) — call sweep.detect every time, no caching
- Return-value contract from I1 design § "Return values"

### Backward compat (per PO decision 2 — Phase 2 wrapper)
- `hiveMind.send` becomes a thin wrapper that calls `hiveMind.agent.send` with same args
- `hiveMind.send.message` same — both gain routing safety automatically
- Add deprecation comment block pointing to `agent.send`

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic I: Context-Aware Send*
