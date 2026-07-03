[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 10: Case: /command opens a picker
[task:uuid:418988cb-41d4-4b36-bf84-fad57edd4297]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [C] needs claude target** — exercises: otmux send <t> /rewind.
**Expected:** controlled single post opens the picker; NOT the send.verified loop (which closes it)

## Test case
- **TC-10** [test:uuid:3fd6f314-b361-41f4-a5ed-a1c48d622455] — assert: controlled single post opens the picker; NOT the send.verified loop (which closes it).
  - **Proven by:** task-s2-j rewind.drive / T-REWIND-DRIVE.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
