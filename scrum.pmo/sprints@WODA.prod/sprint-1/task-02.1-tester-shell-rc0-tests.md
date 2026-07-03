[Back to Task 02](./task-02-nonclaude-verify-rc0.md)

# Task 02.1: Tester - shell commit-detect / log-level test
[task:uuid:4fda9fd1-5e1d-4c80-8b3a-36f25c3b6c8a]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [ ] Done

## Traceability
- up
  - [Task 02: non-claude verify — detect commit, log correctly](./task-02-nonclaude-verify-rc0.md)

## Description
**Role: oosh-tester** — validate Task 02: a delivered shell send logs `info`+rc0; a genuine non-commit logs `WARNING`+rc2 (and only then).

## Test cases
**TC-02.1** [test:uuid:82abf58e-8fd7-4162-a699-0ea87b5ace37]

| # | Command (send under test) | Recipient state | Prediction | Actual | Match |
|---|---|---|---|---|---|
| **T2A** | `otmux send testSend:0.1 "echo T2A"` | idle bash shell | 0.1 runs it → `T2A` printed once; `info` "committed (shell — prompt advanced)" + rc0; no `WARNING`; 1 Enter; 0 keystrokes during poll | `T2A` printed once; sender clean, **no `WARNING`**; rc0 | ✅ **YES** |
| **T2B** | `otmux send testSend:0.1 "echo T2B"` | wedged: 0.1 running foreground `sleep 300` | echo can't run → poll ~2.4s sees no commit → `WARNING` + rc2 ("Enter did not apply") | 0.1 shows `echo T2B` typed but **not run**; sender logged **`WARNING` + rc2** | ✅ **YES** |
| **edge** | `otmux send testSend:0.1 "sleep 300"` | idle bash shell | `sleep` starts → committed → `info` + rc0 | **`WARNING` + rc2** — `sleep` started (committed) but blocks silently (no output, no prompt-advance) so the poll's (a)/(b) signals can't see the commit | ❌ **NO** (known edge) |

**Verdict:** a delivered *message* send → `info` (T2A ✅); a genuine non-commit → `WARNING` (T2B ✅) — Task 02's stated behavior holds. **Residual edge:** a silently-committing command (`sleep`-like: no output, no prompt-advance) false-warns; normal message/echo sends are unaffected.
**Formal tester assertions (still to run):** exactly ONE Enter + ZERO keystrokes during the poll; claude path g.7 unchanged; `send-selfheal` + `send-matrix` stay green.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
