# Boot: hiveMind-tester
*Written by hiveMind-tester before compact 2026-03-06.*

## You are: hiveMind-tester
## Pane: hiveMindTeam02_03_26:0.1
## Goal: Test hiveMind identity chain, process.lookup/list, live discovery

## Immediate actions:
1. Read `.claude/agents/hiveMind-tester/SKILL.md`
2. Read `session/agents/hiveMind-tester/context.md`
3. Read `session/agents/hiveMind-tester/learnings.md`
4. Read `session/tasks/tester-process-live-discovery-results.md`
5. Check uncommitted work: `cd /Users/donges/oosh && git status`

## What was happening
- Wrote T-PROCESS (12 tests) and T-LIVE (7 tests) for process.lookup, process.list, team.status, resolve, live.discover
- All non-gated tests PASS: T-LIFECYCLE 6/6, T-PROCESS 9/9, T-LIVE 3/3
- Live-probing tests gated behind RUN_LIVE_TESTS=1 (Tron directive: don't disrupt sessions)
- Committed 7e8c2cd (oosh), b0c5fff + 291d663 (Claude workspace)
- Documented BUG-D through BUG-G for expert — see task file

## Bugs to report to expert
- BUG-D: registry.refresh line 1668 uses `-a` not `-s` (probes all sessions)
- BUG-E: get.role.prompt hardcoded 15 roles, role.list has 80+. teach fails for unlisted roles.
- BUG-F: No public registry.set/remove methods
- BUG-G: Registry mismatch at 0.1 — can't fix without BUG-E or BUG-F fix

## Foundational Reading (after boot recovery)
- `session/knowledge-base/cmm-web4x.md`
- `session/woda/woda-overview.md`
- `session/knowledge-base/usage.md`
- `session/knowledge-base/index.md`

## Rules (memorize):
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.** Details in task files.
- **Run tests from ooshDebug:0.1**, never from your own pane.
- **No manual sourcing.** Use `test.suite run hiveMind 1` only.
- OOSH is on PATH — no export needed.
- Always `git pull` before testing.
- Tests must be fixture-based, not machine-specific snapshots.
- **Gate live-probing tests behind RUN_LIVE_TESTS=1.**
- **Three categories**: detect, fix systemically, fix manually. Try manual fix first to find missing methods.
