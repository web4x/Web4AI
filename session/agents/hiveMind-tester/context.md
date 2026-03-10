# hiveMind tester Agent Context
**Session**: hiveMindTeam02_03_26
**Role**: hiveMind-tester
**Pane**: hiveMindTeam02_03_26:0.1
**UUID**: 004e5ea9-6ed5-4c20-bc9e-7db38677b14b
**Updated**: 2026-03-10 (post T-RESTORE tests)

## Active Work: Full MacStudio Restore

### Cross-Machine Fork: PROVEN WORKING
1. Root cause of "Rate limit reached" = `opus[1m]` in MacStudio `~/.claude/settings.json`
2. Changed to `opus` (200k) → fresh session works, fork works, API calls work
3. Verified with live `date` command on forked PO: `Tue Mar 10 14:25:04 CET 2026`
4. Expert implemented F1-F4 in commit `1604e3e`:
   - F1: JSONL transfer via scp in teams.migrate
   - F2: `--fork` flag for teams.restore
   - F3: Model compatibility check (opus[1m] → opus)
   - F4: teams.migrate always uses --fork

### T-RESTORE Tests: ALL 15 PASS
- Commit `5cb6eb9`: T-RESTORE-1..15 all green
- Function existence, snapshot format, cross-machine readiness, fixture restore
- Previous commit `6ab741a`: initial tests (7 failures), then `5cb6eb9` fixed all

### Full MacStudio Restore: PARTIALLY WORKING (Task #8)
- `teams.migrate MacStudio.native` ran — created all 7 sessions, 15 panes, forked all agents
- **BUG**: Only 1 of 12 JSONL files was transferred by teams.migrate (transferred rest manually via scp)
- **BUG**: After re-restore with all JNSONLs present, only 3 of 15 agents running (show [2.1.72])
- Most panes show [zsh] — Claude fork failed silently. PO pane blank.
- Possible causes: cd to project dir didn't work, or effort dialog blocking, or fork command garbled
- Reported to expert for investigation
- Agents running: claudeOpus2kTMUX:0.0, odockerTeam:0.1, osshTeam:0.3

### MacStudio Current State
- 7 sessions recreated with correct pane layout
- Most agents NOT running — need expert to fix teams.restore fork reliability
- All 12 unique JNSONLs now present on MacStudio

### Expert State
- Idle after commit 1604e3e
- Can assign more work if needed

## Previous Completed Work
- **claudeCode fork**: commit 2efbdec, claudeCode.fork method
- **agent.restart.remote**: commit 6207f8f, hiveMind method
- **Cross-machine restart research**: scp JSONL + fork = working recipe
- **All previous work**: see learnings.md

## Pending Tasks
1. **Full MacStudio restore** — Task #8, IN PROGRESS
2. **hiveMind whoami** — NOT STARTED
3. **claudeCode test plan** — NOT STARTED
4. **otmux raw tmux migration** — Plan exists

## Rules (memorize)
- **NO git rebase. EVER.** Pull with merge only.
- **ONE LINE git commit messages.**
- OOSH is on PATH — no export needed.
- **NEVER source OOSH scripts.** Executables only.
- **NEVER use raw `claude` or `tmux`** — always claudeCode/otmux.
- **NEVER drop files from reading list** — only add, never remove.
- **ossh login <host>** not `ossh <host>`.
- Tests must be fixture-based, not machine-specific.
- **Always MEASURE, never assume.**
- **Graceful exit before kill.** Escape → /exit → Ctrl-C → kill (last resort).
- **Use hiveMind commands, not raw otmux** — I'm the hiveMind tester!
