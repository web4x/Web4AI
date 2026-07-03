[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 04: Case: claude-TUI target
[task:uuid:81f8b88e-80b5-4ef7-9bc7-80579522f169]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [C] needs claude target** — exercises: send.smart to a Claude Code pane (kind=claude).
**Expected:** prefix applied + Escape dismisses autocomplete + ❯-region commit-verify + honest rc

## Test case
- **TC-4** [test:uuid:8758865b-7e7a-4da7-a737-ca0d65f6107b] — assert: prefix applied + Escape dismisses autocomplete + ❯-region commit-verify + honest rc.
  - **Proven by:** send-matrix A1/B/C + live pong test.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
