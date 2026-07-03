[Back to Task 01](./task-01-clean-single-submit-send.md)

# Task 01.3: Tester - single-submit test cases
[task:uuid:b8d2cf7d-a913-412e-88f0-82c20f9ec3d5]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done
## Traceability
- up
  - [Task 01: clean single-submit send.verified](./task-01-clean-single-submit-send.md)

## Description
**Role: oosh-tester** — validate the clean single-submit contract of Task 01. Suites: `test.send-selfheal` (5/5), `T-SEND-MATRIX` (12/12 superset). Live proof by oosh-po in session `testSend` (full output, no truncation).

## Test cases
- **TC-1.1** [test:uuid:3e382087-17ee-4146-b36e-ea1b49babb17] — **exactly ONE Enter per send.** Keystream count: shell = 1 Enter / 0 Escape; claude = 1 Escape / 1 Enter; no 2nd Enter on any path. → **PASS** (keystream-verified on `494597e`).
- **TC-1.2** [test:uuid:ead5acdc-57ae-49ac-9980-c7d8ff7e12c5] — **no duplicate.** A single send delivered exactly once. → **PASS** (live `testSend`: `CLEAN-RX-from-0.0` once; `send-selfheal` D3).
- **TC-1.3** [test:uuid:a003e3f0-b6fb-49fb-a9bf-949cd5d811f4] — **no stray-Enter spray on a shell.** Zero blank prompts after send. → **PASS** (live: 1 prompt after `CLEAN-RX` vs pre-fix TEST-1's 3 blank ` >`).
- **TC-1.4** [test:uuid:48388150-fb02-4bfc-ad13-da547550f189] — **honest rc, no re-Enter.** rc0 committed / rc2 staged; rc2 logs `NOT re-Entered (drain retries fresh)`. → **PASS** (live log + matrix rc contract).

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
