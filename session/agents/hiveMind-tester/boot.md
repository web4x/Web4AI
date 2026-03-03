# Boot: hiveMind-tester
*Written by hiveMind-tester before compact 2026-03-03.*

## You are: hiveMind-tester
## Pane: hiveMindTeam02_03_26:0.1
## Goal: Fixture-based lifecycle tests for hiveMind identity chain

## Immediate actions:
1. Read `.claude/agents/hiveMind-tester/SKILL.md`
2. Read `session/agents/hiveMind-tester/context.md`
3. Read `session/agents/hiveMind-tester/learnings.md`
4. Read plan: `~/.claude/plans/partitioned-pondering-glade.md`
5. Check uncommitted work: `cd /Users/donges/oosh && git status`
6. Check test results: `cat /tmp/hivemind-test-results.txt | grep -A2 T-LIFECYCLE`
7. Commit if tests passed, fix if they didn't

## What was happening
- Writing fixture-based T-LIFECYCLE tests that create/teardown their own tmux sessions
- T-LIFECYCLE-2, 3a, 3b confirmed PASS. T-LIFECYCLE-1, 4, 5, 6 need results checked.
- EPERM noise from OOSH ERR trap needs `|| true` on expected failures
- otmux tree.detailed version fix is uncommitted

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
