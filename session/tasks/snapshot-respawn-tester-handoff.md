# Tester Handoff: Agent Snapshot + Respawn

**From**: oosh-expert (UpDown_ai_projectTeam:0.1)
**To**: oosh-tester
**Date**: 2026-04-15
**Parent task**: `session/tasks/agent-persistence-and-forking.md`

## What I did (test scaffolding)

I added a TDD test block to `/Users/donges/oosh/test/test.hiveMind` near the end (just before the cleanup section, after the fork UUID tests). 10 test cases labelled **T-SNAP-1..10**. These tests define the contract I am about to implement.

I scaffolded them because the plan said TDD-first and I wanted to capture the contract concretely. The tests are yours now — review, refine, own them.

## Test isolation

- Tests set `HIVEMIND_SNAPSHOTS=/tmp/__test_snap_$$.env` and restore the original value at the end — no pollution of live config.
- T-SNAP-10 explicitly verifies `~/config/hivemind.snapshots.env` is untouched.
- T-SNAP-9 briefly writes a fake pane→role entry to `HIVEMIND_REGISTRY` and cleans it up.

## What each test checks

| ID | Checks |
|----|--------|
| T-SNAP-1/1b/1c | `hiveMind.agent.snapshot`, `hiveMind.snapshot.list`, `hiveMind.agent.respawn` functions exist |
| T-SNAP-2 | `private.hiveMind.snapshot.set role uuid ctx` writes a 4-field `role|uuid|ts|ctx` line |
| T-SNAP-3 | Re-calling `set` for same role replaces (no duplicate lines) |
| T-SNAP-4 | `private.hiveMind.snapshot.get <role>` round-trips the uuid field |
| T-SNAP-5 | `hiveMind.snapshot.list` includes the role we just wrote |
| T-SNAP-6 | `hiveMind.snapshot.list` marks bogus-uuid entries as "stale" (case-insensitive substring match) |
| T-SNAP-7 | `hiveMind.agent.respawn.completion.agentName` exists |
| T-SNAP-8 | `hiveMind.agent.respawn <nonexistent-role>` returns non-zero |
| T-SNAP-9 | `hiveMind.agent.respawn <role>` with stale snapshot (JSONL missing) returns non-zero |
| T-SNAP-10 | Live `~/config/hivemind.snapshots.env` not polluted by test runs |

## What I am implementing next

1. `HIVEMIND_SNAPSHOTS` env var declaration at hiveMind:~line 36
2. `private.hiveMind.snapshot.get/set`, `private.hiveMind.snapshots.ensure.dir`
3. `hiveMind.agent.snapshot <agentName>` — register current pane's UUID as role snapshot
4. `hiveMind.snapshot.list` — print all snapshots with valid/stale flag
5. `hiveMind.agent.respawn <agentName>` — fork snapshot UUID into pane + /rename + re-register
6. Completions on agent.snapshot / agent.respawn

## What YOU (tester) should do

1. Review the T-SNAP-1..10 tests in `test.hiveMind` — adjust wording if too tight to my implementation choices.
2. Consider adding additional scenarios I may have missed:
   - Multiple snapshots for different roles — both show in `snapshot.list`
   - `snapshot.list` with no snapshots file at all (fresh install) — should not error
   - Concurrency: two `set` calls in parallel — does the grep+mv pattern survive? (Probably not, but documenting is enough)
3. Also add **T-CCL-1..4 to test.claudeCode** — I have not written those yet. They cover:
   - `claudeCode.list` flags DEAD (RED) for orphan JSONL (no pane, no live Claude)
   - `private.claudeCode.complete.sessionIds` excludes DEAD UUIDs
   - `claudeCode.list` flags FORK-READY (BOLD_CYAN) for 60-80% context + role
   - Completion includes UUIDs registered in `hivemind.sessions.env` even without live process
4. Run `test.suite run hiveMind 1` and `test.suite run claudeCode 1` after I commit implementation. Report pass/fail numbers.

## Detection rules (for your T-CCL tests)

- **DEAD**: JSONL exists, UUID NOT in any live Claude process args, UUID NOT in `hivemind.sessions.env`
- **FORK-READY**: not dead, has role (via sessions.env → roles.env chain), `private.claudeCode.context.from.jsonl` returns remaining in **[20, 40]** (= 60-80% used)

## Reusable helpers (DRY)

You already know these from your prior tester work:
- `private.hiveMind.claude.processes` (hiveMind:289-304) — live pane+UUID via PS+TTY
- `private.claudeCode.context.from.jsonl` (claudeCode:1135-1162) — returns *remaining* %
- Colors in `~/config/*color*.env`: `BOLD_RED`, `BOLD_CYAN`, `BOLD_GREEN`, `GRAY`

## Hand-off protocol

When I commit the implementation:
1. You pull
2. You run both test suites
3. You report numbers back to me via `hiveMind send oosh-expert "<summary>"`
4. I iterate until green
