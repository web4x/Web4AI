# hiveMind tester Agent Context
**Session**: hiveMindTeam02_03_26
**Role**: hiveMind-tester
**Pane**: hiveMindTeam02_03_26:0.1
**Updated**: 2026-03-07

## Active Work
- **Goal**: Identity chain consistency — detect, fix systemically, fix manually
- **Status**: Major progress. Expert implemented teams.save, consistency.audit, consistency.fix. 7/12 panes now consistent (was 2/12). 5 remaining issues.

## Expert Commits (oosh repo, branch dev.claude)
| Commit | What |
|--------|------|
| c056918 | consistency.fix method |
| 8f4210f | find.agents.dir returns 0 to avoid ERR trap EPERM |
| 54a8b47 | session.probe fallback for UUID in save/list |
| 016b3d0 | teams.save/restore, registry.set/remove, team.activate |
| de85de2 | registry.refresh -a → -s (BUG-D fix) |

## My Commits (oosh repo)
| Commit | What |
|--------|------|
| 4e1aa85 | T-STATUS tests for BUG-H, BUG-I, BUG-J |
| 7e8c2cd | T-PROCESS + T-LIVE tests, gate live-probing |

## My Commits (Claude workspace)
| Commit | What |
|--------|------|
| 12608d5 | task: consistency.audit spec |
| c3b9ffc | task: consistency.fix spec |
| 8ea74ab | task: fix find.agents.dir EPERM + UUID gap |
| 6604418 | task: teams.save/restore urgent order |
| 5e0056f | comprehensive bug list |
| 4e21ad2 | BUG-H, BUG-I, BUG-J added to bug report |

## Consistency Audit (last run after consistency.fix)
```
7 consistent, 5 inconsistent:
- projectTeam:0.4   ✗ dup UUID (oosh-tester shares a2c6b6c4 with oosh-expert — sed bug skipped update)
- ooshDebug:0.0     ✗ UUID stale (sessions.env has b2563d89, live is c2775135 — sed bug skipped update)
- odockerTeam:0.1   ✗ title≠reg (got "CommittoExpertPane" — needs /rename to proper role)
- baseTeam:0.2      ✗ title≠reg (got "ClaudeCode" — needs /rename)
- baseTeam:0.3      ✗ title≠reg,dup UUID (same as 0.2)
```

## Expert Bug to Fix Next
- **consistency.fix sed delimiter bug**: uses `|` as sed delimiter but role names can conflict. Change to `#`. Causes sessions.env update to fail for oosh-tester, scrum-master, product-owner.
- After fix: re-run `hiveMind consistency.fix` then `hiveMind consistency.audit` to verify.

## Manual Fixes Still Needed
- `/rename` on odockerTeam:0.1, baseTeam:0.2, baseTeam:0.3 to proper role names
- These panes have title "Claude Code" or "Commit to Expert Pane" — not valid role names

## Comprehensive Bug List
See `session/tasks/hivemind-all-bugs-comprehensive.md` — full inventory of all bugs and gaps.

## RECOVERY AFTER COMPACT
1. Read `.claude/agents/hiveMind-tester/SKILL.md`
2. Read `session/agents/hiveMind-tester/context.md` (this file)
3. Read `session/agents/hiveMind-tester/learnings.md`
4. Tell expert: `Read session/tasks/expert-consistency-fix-sed-bug.md`
5. Run `hiveMind consistency.audit` from ooshDebug:0.1 to see current state

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
- **Check expert's context** before sending work — don't force work on an agent at low context.
