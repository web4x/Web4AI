[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 17: Case: capture methods (read-only)
[task:uuid:56cd878e-23af-4a93-8273-2f019932b3df]

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
**Case [S] shell-provable** — exercises: pane.capture / .visible / .history.
**Expected:** return correct visible/scrollback content; READ-ONLY (zero send-keys, never closes a picker)

## Test case
- **TC-17** [test:uuid:2bad5a5f-bb46-455c-8cd2-a8f0950add9d] — assert: return correct visible/scrollback content; READ-ONLY (zero send-keys, never closes a picker).
  - **Proven by:** T-SWEEP-ALL + every send.verified verify + the picker-close investigation.
  - **Go-through (live):** predict the behavior → run in session `testSend` (or a claude pane for [C], a remote host for [R]) → capture (full output, no truncation) → verify expected == actual → TRON accepts.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
