[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 07: Case: single key
[task:uuid:aa47857b-6bf9-4d63-8c31-4c71c038684c]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done
## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)

## Description
**Case [S] shell-provable** — exercises: send.raw Enter / C-u / arrow.
**Expected:** raw key event, NO prefix, NO verify, NO queue

## Test case
- **TC-7** [test:uuid:d07c9927-77c6-4b67-a8d4-5ce1d98f8534] — assert: raw key event, NO prefix, NO verify, NO queue.
  - **Proven by:** send-matrix K1-K5.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*


## ✅ Go-through PROOF (oosh-tester, non-interactive capture, 2026-07-03)
Ran `otmux send.raw <scratch> "echo T7RAW" Enter`.
**PREDICT** = raw key event, NO `[@` prefix, NO verify/queue.
**ACTUAL (captured)**: delivered-once=**1** · prefix-`[@`=**0** · `send.raw` body invokes prefix/verify/poke/queue = **0** [S]. **MATCH ✅** (send-matrix K1/K6 — a key ≠ a message).
