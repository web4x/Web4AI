[Back to Task I1](./task-i1-context-aware-send-design.md)

# Task I1.5: Tester - Context-Aware Send Tests
[task:uuid:i1a5-tester-2026-04-21]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task I1: Context-Aware Send Design](./task-i1-context-aware-send-design.md)

## Description
**Role: oosh-tester**

Validate the routing + 3 paths + queue drain. Test cases:

| ID | Pane state | Action | Expected |
|----|-----------|--------|----------|
| T-CTX-1 | idle | `agent.send` text | INFORM delivers; `delivered` rc=0 |
| T-CTX-2a | permission | `agent.send` text | rejected (must use approve/reject) |
| T-CTX-2b | permission | `agent.approve` | sends `1`; `controlled` rc=0 |
| T-CTX-2c | accept-edits | `agent.approve` | sends `Tab` (per-overlay map); `controlled` rc=0 |
| T-CTX-2d | tool-confirm | `agent.reject` | sends `2`; `controlled` rc=0 |
| T-CTX-2e | any overlay | `agent.dismiss` | sends `Escape`; `controlled` rc=0 |
| T-CTX-2f | idle | `agent.approve` | rejected (not in overlay) |
| T-CTX-3a | active | `agent.send` text | queued; `queued <pos>` rc=0 |
| T-CTX-3b | unknown | `agent.send` text | queued (conservative); rc=0 |
| T-CTX-4 | active → idle | queued msg | drained automatically via agent.unblock; FIFO order |
| T-CTX-5 | active | 51 sends | depth bound drops oldest; warn.log fires |
| T-CTX-6 | active | send 1h+1s ago | age bound drops on drain |
| T-CTX-7 | (n/a) | legacy hiveMind.send | works, gains routing safely |
| T-CTX-8 | (n/a) | queue.list / clear | inspect + cancel work |

### Test fixtures
Reuse C3.2 fixtures for state setup. Mock `sweep.detect` output via env var
override or fixture-mode flag (per existing test convention).

Key file: `/Users/donges/oosh/test/test.hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic I: Context-Aware Send*
