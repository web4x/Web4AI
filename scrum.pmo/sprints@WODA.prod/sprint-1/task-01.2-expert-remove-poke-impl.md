[Back to Task 01](./task-01-clean-single-submit-send.md)

# Task 01.2: Expert - remove-poke impl
[task:uuid:2271c9e0-9657-4416-8704-beff4beee302]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done (commit `494597e`)

## Traceability
- up
  - [Task 01: clean single-submit send.verified](./task-01-clean-single-submit-send.md)

## Description
**Role: oosh-expert**
Rewrite `otmux.send.verified` (`/root/oosh/otmux`, commit `494597e`): DELETE the for-loop, `maxpokes`, `timeout` arg, 2nd Enter, all poke logs, all retry. New body = stage ONCE (`C-u` + `send-keys -l`) → Escape (CLAUDE + IDLE only) → SINGLE Enter → one-shot g.7 region-verify → honest rc{0 committed / 2 staged}; on rc2 log `NOT re-Entered (drain/caller retries fresh)`. `send.smart` drops the dead timeout arg. `bash -n` clean (goes live to all agents).
**Verified by keystream count:** shell = 1 Enter / 0 Escape; claude = 1 Escape / 1 Enter. `send-matrix` 12/12.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
