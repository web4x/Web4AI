[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 03: Case: bash-SHELL target
[task:uuid:91e7cf57-4ee6-4265-a122-b875ef6baeeb]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [ ] Done

## Description
Send to a bash-shell target (kind=shell). The shell path must add NO `[@` prefix, send NO Escape (a shell has no autocomplete to dismiss and must not be interrupted), stage the text and submit with exactly ONE Enter, deliver exactly once, and log `info` (Task 02) — never a false `WARNING`.

## Test case
**TC-03** [test:uuid:44f89f9c-54a7-4d59-ac8f-f366b37a956f]

| Field | Value |
|---|---|
| **Command** | `otmux send testSend:0.1 "echo T3C-SHELL"` |
| **Recipient state** | 0.1 = idle bash shell |
| **Prediction** | NO `[@` prefix · NO Escape · stage + exactly ONE Enter · 0.1 runs it → prints `T3C-SHELL` exactly once · log `info` "committed (shell — prompt advanced)" + rc0 · no `WARNING` |
| **Actual** | 0.1 printed `T3C-SHELL` **once** · no prefix · no Escape · one Enter · `info`/rc0, **no `WARNING`** (post Task 02 poll fix `466655d`) |
| **Match** | ✅ YES |

**Proven by:** live testSend (T3C) + send-matrix A2/E3/G1 + Task 01 (one-Enter) + Task 02 (shell-log).
**Note:** pre-Task-02, this send delivered but false-`WARNING`ed (rc2); Task 02's poll fix made the log `info`. Delivery was always correct; the log is now correct too.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
