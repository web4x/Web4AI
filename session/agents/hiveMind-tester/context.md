# hiveMind tester Agent Context
**Session**: hiveMindTeam02_03_26
**Role**: hiveMind-tester
**Pane**: hiveMindTeam02_03_26:0.1
**Updated**: 2026-03-25 (post-compact #2)

## Active Work: T-RESTART tests for d94e9cc, full test suite running

### T-SCP Tests — DONE (7/8 PASS)
- Expert commit `ceec723`: ossh.scp method + replaced all 6 raw scp in hiveMind
- T-SCP-1..7 all PASS — zero raw scp/ssh, ossh.scp method exists
- T-SCP-8: Fixed — scoped to team.pull method (was checking global file, task.transfer is separate)
- Committed: `93e861e` (tests), `3fc2947` (T-SCP-8 fix)
- Done report: session/tasks/hivemind-team-pull-scp-fix.done.md

### T-RESTART Tests — WRITTEN, COMMITTED (9540a33)
- PO task: session/tasks/hivemind-agent-restart-single.md
- Expert commit `d94e9cc`: agent.restart now takes <configDir> <role> (single agent)
- Old all-agents behavior renamed to `team.restart`
- Tests added:
  - T-ARESTART-2b: completion.role lists roles from snapshot
  - T-ARESTART-3b: no-role shows usage with available roles
  - T-ARESTART-4b: unknown role returns error
  - T-ARESTART-6: single-role restart creates correct pane
  - T-ARESTART-6c: only requested role restarted (not all)
  - T-TRESTART-1..4: team.restart function exists, completion, no-args error, creates all panes
- Full test suite running (background bv4ckgg8p)

### Consistency.fix — 14/5 (was 8 inconsistent)
- Done report: session/tasks/consistency-fix-verification.done.md

### Send prefix bug — FIXED
- Expert commit e4a165c: guard with isClaudeCode

## Pending Tasks
1. Wait for full test suite results → analyze failures
2. Run T-GHOST and T-TRUTH tests
3. bash 5 PATH permanent config fix

## Commits This Session
- `93e861e` T-SCP-1..8 tests committed
- `9540a33` T-ARESTART/T-TRESTART tests for single-role agent.restart
- `3fc2947` T-SCP-8 scoped to team.pull method

## Rules (memorize)
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.**
- OOSH is on PATH — no export, no cd, no ./ prefix.
- **NEVER source OOSH scripts in Bash tool.**
- **OOSH: positional args ONLY, never --flags.**
- **Read ALL OOSH docs on every boot.**
- **Do NOT approve expert's permission prompts — PO's job.**
- **Use otmux send, not raw tmux send-keys.**
- Tests must be fixture-based, not machine-specific.
- **Always MEASURE, never assume.**
