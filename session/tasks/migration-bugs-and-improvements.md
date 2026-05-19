# Migration Bugs & Improvements — 2026-03-26

**From**: master-product-owner
**To**: oosh-expert (implementation), oosh-tester (tests), agent-trainer (SKILL.md updates)
**Priority**: HIGH

## Context

We migrated the full agent fleet from UpDown.ai Docker to MacStudio.native using hiveMind team.pull + teams.restore. During the process we found several bugs and improvements needed.

---

## BUG-1: teams.save uses pane title instead of session customTitle for role name

**Evidence**: Pane projectTeam:0.4 had title `agent-trainer` (from pane.identify at bootstrap) but Claude session was `/rename`'d to `oosh-expert`. Snapshot recorded wrong name. We forked the wrong agent.

**Fix (expert)**: In `hiveMind.teams.save`, prefer `claudeCode session.name $sid` (customTitle from /rename) over pane title. Same DRY pattern as the UUID fix — live truth over cached data. Fall back to pane title only if session.name returns empty.

**Test (tester)**: Create a pane with title "fake-role", mock a session.name that returns "real-role". Verify snapshot uses "real-role".

---

## BUG-2: agent.restart doesn't pull missing JSONL before fork

**Evidence**: `hiveMind agent.restart /tmp/hivemind.UpDown.ai agent-trainer` said "no JSONL, starting fresh" because the JSONL wasn't on MacStudio. Only `team.pull` downloads JONSLs, not `agent.restart`.

**Fix (expert)**: In `hiveMind.agent.restart`, before forking, check if the JSONL exists locally. If not and a remote host can be inferred from the pullDir name (`hivemind.pull.<host>`), pull the JSONL via `ossh scp`. Pattern: extract host from dir name, `ossh scp $host:~/.claude/projects/*/${uuid}.jsonl $localProjectDir/`.

**Test (tester)**: Create fixture with UUID but no local JSONL. Verify agent.restart attempts to pull (or at minimum warns clearly about missing JSONL with the host name).

---

## IMPROVEMENT-1: hiveMind agent.rename — atomic rename command

**Status**: Already committed (ea17c19) but needs test verification.

**Test (tester)**: Verify `/rename` sent, pane title locked, registry updated — all three consistent after one command.

---

## IMPROVEMENT-2: Fork UUID auto-registration in sessions.env

**Status**: Already committed (502b553) but test run was interrupted.

**Test (tester)**: Rerun `test.suite run hiveMind 1` and verify T-FORK tests pass. Report results.

---

## SKILL.md Updates (agent-trainer)

After expert+tester fix the bugs, update these SKILL.md files:
1. **hiveMind-expert/SKILL.md**: Add fd 3 rule for while-read loops, session.resolve.uuid as single UUID source
2. **oosh-tester/SKILL.md**: Add pattern test technique (grep-based, not execution-based for infrastructure bugs)
3. **product-owner/SKILL.md**: Add migration workflow reference (team.pull → agent.restart)

---

## Execution Order

1. **Tester**: Rerun hiveMind tests first — report current pass/fail count (IMPROVEMENT-2 verification)
2. **Expert**: Fix BUG-1 (teams.save customTitle)
3. **Expert**: Fix BUG-2 (agent.restart JSONL pull)
4. **Tester**: Write tests for BUG-1 and BUG-2, verify fixes
5. **Tester**: Verify IMPROVEMENT-1 (agent.rename tests)
6. **Agent-trainer**: Update SKILL.md files after all fixes committed
