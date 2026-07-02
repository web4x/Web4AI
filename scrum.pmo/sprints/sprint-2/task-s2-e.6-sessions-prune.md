> ⬆ **[Sprint 2 · task-s2-e](./task-s2-e-tooling-hygiene.md)** — sub-task; back to parent task.

# claudeCode sessions.prune — archive DEAD sessions + clean test-project artifacts
[task:uuid:ff7339b7-ddab-411e-a701-4b1e8e2b1a5d]

**From**: oosh-po
**Owners**: oosh-architect (archive-not-delete contract) → claudeCode-expert (impl) → oosh-tester (verify)
**Priority**: LOW
**Status**: PLAN
**Date**: 2026-06-28
**Sprint**: — (hygiene)
**Related**: `claudeCode list` (cluttered view), `pushed-team-data-discovery.md` (#7, same projects dir)

## Problem / Why
`claudeCode list` on WODA.prod shows ~25+ `[DEAD]` JSONL sessions + leftover `__test_jsonl_project_2266258`/`_2582821` test dirs in `~/.claude/projects` — live agents buried in dead noise. No prune exists; test runs leak `__test_jsonl_project_*` (no teardown).

## Design / Approach
`claudeCode sessions.prune [days]` — ARCHIVE (move, not delete) DEAD (no-live-process, >N-day default 7) JSONLs → `~/.claude/projects/.archive/`; remove orphan `__test_jsonl_project_*`; test suites clean their own via trap EXIT. DRY: reuse claudeCode's existing live-vs-dead detection. Self-care: archive (recoverable), report counts. No flags.

## Acceptance Criteria
- [ ] `claudeCode sessions.prune` archives DEAD, leaves LIVE untouched
- [ ] `__test_jsonl_project_*` orphans removed; suites clean own via trap EXIT
- [ ] Archive recoverable (move not delete); reports archived/skipped counts
- [ ] T-SESSIONS-PRUNE: seed DEAD + live → prune → DEAD archived, live kept
- [ ] DRY: reuses existing liveness detection (no duplicate ps/uuid scan)

## PDCA
- Plan: this spec · Do: expert adds sessions.prune + test teardown · Check: T-SESSIONS-PRUNE + list shows only live/recent · Act: tune N-days

## Report-back (owners edit here; one line each, with commit hash)
- Architect (archive contract):
- Expert (sessions.prune impl):
- Tester (T-SESSIONS-PRUNE + teardown hygiene):
