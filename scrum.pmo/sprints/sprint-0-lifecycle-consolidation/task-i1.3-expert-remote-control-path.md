[Back to Task I1](./task-i1-context-aware-send-design.md)

# Task I1.3: Expert - REMOTE CONTROL path
[task:uuid:i1a3-remote-2026-04-21]

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

Implement REMOTE CONTROL — the overlay-only branch. New verbs separate intent
from dispatch.

### New verbs
- `hiveMind.agent.approve  <agent>` — affirmative response in current overlay
- `hiveMind.agent.reject   <agent>` — negative response
- `hiveMind.agent.dismiss  <agent>` — Esc (universal)
- `hiveMind.agent.option   <agent> <N>` — arbitrary option N

### Behaviour
- Eligible state: `permission` / `tool-confirm` / `accept-edits` (per PO decision 5,
  approve must work on accept-edits via per-overlay key map)
- Reject if state == idle ("not in overlay")
- Mechanism: `otmux send.raw <pane> <key>` (key sequence; no Enter)

### Per-overlay key map (PO decision 5)
| State            | approve | reject | option N |
|------------------|---------|--------|----------|
| permission       | `1`     | `2`    | `<N>`    |
| tool-confirm     | `1`     | `2`    | `<N>`    |
| accept-edits     | `Tab`   | `Esc`  | `<N>`    |
| (all overlays)   | dismiss = `Escape` |

### Implementation
- Helper `private.hiveMind.agent.overlay.key <state> <verb> <?option>` returns
  the key sequence per the table above
- Each verb composes: detect state → look up key → `otmux send.raw <pane> <key>`
- Returns `controlled <agent> <pane> <key>` on success

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic I: Context-Aware Send*
