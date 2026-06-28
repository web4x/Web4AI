# Improvement: rewind-readiness pre-flight check (no critical-path work lost)

**From**: oosh-po (ARON cycle — 1 improvement as task)
**Owner**: oosh-architect (contract) → oosh-expert (impl) → oosh-tester
**Priority**: MEDIUM-HIGH — protects every rewind of a working agent
**Status**: PLAN
**Date**: 2026-06-28

## Issue
The 2-phase rewind protocol (Tron-auth, trainer-exec) assumes the agent saved first — but there's no GATE that VERIFIES it. A critical-path agent (e.g. u24 expert) rewound with stale saves loses work. Today it was safe only because I manually checked the gate report-back was fresh (17:31) and noticed context.md was stale (16:42).

## Improvement
A single check the trainer/SM runs BEFORE authorizing/executing any rewind:
`hiveMind agent.rewind.ready <agent>` → GREEN only if:
1. The agent's context.md was modified within the last N minutes (fresh self-state).
2. Any task/sprint report-back the agent owns (its in-flight work) was modified within N minutes (work durably captured).
3. Working tree for the agent's files is committed (no uncommitted save).
Returns RED + the specific gap ("context.md stale 49m", "gate report-back current", "uncommitted: X") so the gap is fixed before the rewind, not discovered after.

## Acceptance
- [ ] `hiveMind agent.rewind.ready <agent>` returns GREEN/RED + named gaps
- [ ] Trainer's 2-phase rewind calls it as Phase-0 gate; refuses to deep-rewind on RED
- [ ] T-REWIND-READY: stale context.md → RED; fresh+committed → GREEN
- Composes with the 2-phase rewind protocol (Tron-auth, trainer-exec, never PO /clear)

## Report-back (edit here)
- Architect (readiness contract):
- Expert (impl + commit):
- Tester (T-REWIND-READY):
