[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 8: Case: text + trailing key
[task:uuid:8fd1297d-70ce-4daa-ad00-14160cb0e649]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [S] shell-provable** — exercises: otmux send <t> "text" Enter.
**Expected:** text delivered then ONE Enter (no redundant 2nd Enter)

## Test case
- **TC-8** [test:uuid:e4b604d5-729d-4077-81ec-99390ed7963e] — assert: text delivered then ONE Enter (no redundant 2nd Enter).
  - **Proven by:** Task 1 TC-1.1 + send-matrix case-2.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
