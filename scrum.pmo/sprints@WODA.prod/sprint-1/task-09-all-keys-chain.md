[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 09: Case: all-keys chain
[task:uuid:0aaf7791-2c52-426b-b58b-32ed7d2f7153]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [S] shell-provable** — exercises: otmux send <t> Down Down Enter.
**Expected:** ALL raw keys, NO prefix, sequential

## Test case
- **TC-9** [test:uuid:b1441006-c493-40ff-9b29-0dd924f0dbfd] — assert: ALL raw keys, NO prefix, sequential.
  - **Proven by:** send-matrix K5.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
