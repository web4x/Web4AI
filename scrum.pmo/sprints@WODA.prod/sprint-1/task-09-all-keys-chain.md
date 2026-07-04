[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 09: Case: all-keys chain
[task:uuid:0aaf7791-2c52-426b-b58b-32ed7d2f7153]

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
**Case [S] shell-provable** — exercises: otmux send <t> Down Down Enter.
**Expected:** ALL raw keys, NO prefix, sequential

## Test case
- **TC-9** [test:uuid:b1441006-c493-40ff-9b29-0dd924f0dbfd] — assert: ALL raw keys, NO prefix, sequential.
  - **Proven by:** send-matrix K5.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*


## ✅ Go-through PROOF (oosh-tester, non-interactive capture, 2026-07-03)
Ran `otmux send <scratch> Down Down Enter`, keystream counted via a forwarding tmux stub.
**PREDICT** = ALL raw keys (Down Down Enter), NO `[@` prefix, sequential.
**ACTUAL (captured)**: keys-sent = `Down Down Enter` (down=**2**, enter=**1**) · prefix-`[@`=**0**. **MATCH ✅** (send-matrix K5).
