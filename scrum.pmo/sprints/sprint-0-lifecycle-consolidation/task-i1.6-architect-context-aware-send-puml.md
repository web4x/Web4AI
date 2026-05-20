[Back to Task I1](./task-i1-context-aware-send-design.md)

# Task I1.6: Architect - Context-Aware Send PUML diagrams
[task:uuid:i1a6-architect-2026-04-21]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task I1: Context-Aware Send Design](./task-i1-context-aware-send-design.md)

## Description
**Role: oosh-architect**

Produce two PUML diagrams illustrating Epic I architecture.

### Diagram 1 — Sequence: caller → agent.send → route → path
- Actors: Caller, hiveMind, sweep.detect, otmux, queue file
- Show 3 swim-lane variants:
  - **INFORM** (idle): `agent.send` → `sweep.detect=idle` → `otmux send` → "delivered"
  - **REMOTE CONTROL** (overlay): `agent.approve` → `sweep.detect=permission` → key map lookup → `otmux send.raw 1` → "controlled"
  - **QUEUE** (active): `agent.send` → `sweep.detect=active` → write queue file → "queued"
- Include drain: `agent.unblock` → `sweep.detect=idle` (transition) → read queue → dispatch each FIFO → empty queue

### Diagram 2 — State: pane states + enabled paths
- States: idle, permission, tool-confirm, accept-edits, queued, active, unknown
- Transitions (edges): which paths each state enables
  - idle → INFORM allowed; REMOTE CONTROL rejected
  - permission/tool-confirm/accept-edits → REMOTE CONTROL allowed; INFORM queued or rejected
  - active/queued/unknown → all sends queue
- Per-state highlight: which `agent.*` verbs are valid

### Output location
- `docs/puml/Sprint0_I1_ContextAwareSend_Sequence.puml`
- `docs/puml/Sprint0_I1_ContextAwareSend_State.puml`

### Reference
- Design doc: `task-i1-context-aware-send-design.md`
- Implementation tasks I1.1-I1.4 (parallel work)

---

*Sprint 0 - Lifecycle Consolidation*
*Epic I: Context-Aware Send*
