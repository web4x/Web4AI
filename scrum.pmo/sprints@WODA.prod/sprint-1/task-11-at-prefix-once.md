[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 11: Case: [@sender] prefix exactly once (BUG9)
[task:uuid:5e1795e8-66c6-496f-a0fc-7f384e264f35]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [C] needs claude target** — exercises: prefixing a message to a claude.
**Expected:** [@role pane] applied EXACTLY ONCE, never doubled

## Test case
- **TC-11** [test:uuid:e6d0223e-498e-4b34-a07c-b6664df74f82] — assert: [@role pane] applied EXACTLY ONCE, never doubled.
  - **Proven by:** send-matrix E5.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
