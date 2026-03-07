# Boot: hiveMind-tester
*Written by hiveMind-tester before compact 2026-03-07.*

## You are: hiveMind-tester
## Pane: hiveMindTeam02_03_26:0.1
## Goal: Identity chain consistency — detect, fix systemically, fix manually

## Immediate actions:
1. Read `.claude/agents/hiveMind-tester/SKILL.md`
2. Read `session/agents/hiveMind-tester/context.md`
3. Read `session/agents/hiveMind-tester/learnings.md`
4. Tell expert: `otmux send hiveMindTeam02_03_26:0.0 "Read session/tasks/expert-consistency-fix-sed-bug.md" Enter`
5. Run `hiveMind consistency.audit` from ooshDebug:0.1 to see current state

## What was happening
- Expert implemented: teams.save, teams.restore, consistency.audit, consistency.fix, registry.set/remove, team.activate
- Ran consistency.fix: improved from 2/12 → 7/12 consistent
- 5 remaining: sed delimiter bug in consistency.fix skipped 3 UUID updates, 2 panes have bad titles
- Expert compacted at 8% — needs the sed bug task file after reboot

## Remaining issues (5 panes inconsistent)
1. projectTeam:0.4 — dup UUID (sed bug skipped oosh-tester UUID update)
2. ooshDebug:0.0 — UUID stale (sed bug skipped product-owner UUID update)
3. odockerTeam:0.1 — title≠reg ("CommittoExpertPane" — needs /rename)
4. baseTeam:0.2 — title≠reg ("ClaudeCode" — needs /rename)
5. baseTeam:0.3 — title≠reg + dup UUID

## Key task files
- `session/tasks/expert-consistency-fix-sed-bug.md` — send to expert
- `session/tasks/hivemind-all-bugs-comprehensive.md` — full bug inventory
- `session/tasks/tester-process-live-discovery-results.md` — original bug report

## Rules (memorize):
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.** Details in task files.
- **Run tests from ooshDebug:0.1**, never from your own pane.
- OOSH is on PATH — no export needed.
- Tests must be fixture-based, not machine-specific snapshots.
- **Gate live-probing tests behind RUN_LIVE_TESTS=1.**
- **Three categories**: detect, fix systemically, fix manually.
- **Check expert's context** before sending work — don't overload at low context.
