# OOSH Expert Backlog

## CMM4 — task files are single source of truth

Anything actively in flight or queued lives at `session/tasks/<task>.md`. This backlog is the **index + status overview**. For details, open the task file.

## Sprint 1 — CLOSED 2026-05-25

All expert work shipped. Tester confirmations landed. Only architect-scope SC-G.3 (PUMLs) and tester-scope SC-D.3/E.3 fixtures remain across all Sprint 1 work.

See `session/agents/oosh-expert/achievements.md` for the full delivery log.

## Post-Sprint 1 — bug-fix wave (2026-05-26)

| Task file | Commit | Status |
|-----------|--------|--------|
| `bug-otmux-send-window-gt-0.md` | `82213a6` | DONE — tester pending |
| `bug-otmux-fit-too-small.md` | `4338d2c` | DONE — tester PASS |
| `bug-tab-completion-accept-edits.md` | (closed as duplicate of `4338d2c`) | DONE — tester PASS |
| `otmux-layout-dynamic.md` | `da48c11` | DONE — tester PASS |
| `bug-rate-limit-invisible-to-sweep.md` | `3a4bfbc` | DONE — tester pending |

## Outstanding handoffs (tester)

- Live verification of `82213a6` agent.send visibility on real busy agents
- Live verification of `3a4bfbc` rate-limit detection — wait for a real rate-limit event to occur, observe sweep.detect picks it up from scrollback

## Open follow-ups (no task file yet — flag when PO prioritizes)

- **S11 state-store** for previous-state tracking — Option 2 in `bug-rate-limit-invisible-to-sweep.md`. Adds true state-transition detection (ACTIVE→IDLE without commit/file-change = suspicious). Current 200-line history scan handles the common case; S11 is for the long tail. Defer until false-negatives observed.
- **c2 robustness audit** — apostrophe fix (`4338d2c`) was one class. Are there other xargs/printf quote-parse cases? PO-deferred unless new breakage seen.
- **agent.bootstrap dev-flow events on bash 3.2** — Gap A `1b2d59b` uses pidfile-guarded fallback; verify no double-schedule under load.

## Architect collaboration (cross-pane)

- Architect spec corrections in `docs/send-prefix-spec.md` — 2 wording fixes pending (row 12 queue.drain, broadcast indirection). Cosmetic; canonical spec is otherwise accurate.

## Sprint 2 — TBD

Awaiting PO direction. Likely candidates from Sprint 1 follow-ups:
- Event-emit on tronMonitor client cleanups (deferred from D5)
- True state-transition tracking (S11)
- Snapshot v2 schema with explicit field type registry (post-SC-F.1 if format evolves)
