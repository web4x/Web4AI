[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 06: Case: node shell, not claude (kind false-positive g.1)
[task:uuid:783a7633-dafc-4c56-8004-faec1f9ba950]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [S] shell-provable** — exercises: a shell running node.
**Expected:** classifies SHELL, NO Escape (no false-claude)

## Test case
- **TC-6** [test:uuid:de9eb833-31e9-49a3-96af-5102f906af3f] — assert: classifies SHELL, NO Escape (no false-claude).
  - **Proven by:** send-matrix A4/G2 (g.1 188971a).
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
