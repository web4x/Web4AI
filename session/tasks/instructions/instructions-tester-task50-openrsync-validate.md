# Task 50 openrsync Validation

**Assigned to**: Tester (cursorOrchestrator:0.5)

## What Changed
Expert replaced --mkpath/--rsync-path fallback with portable `ssh mkdir -p` then `rsync` approach.
Commit: d90d22f

## Tests to Run

From `components/OOSH/dev.claude/`:

1. **Syntax check**: `bash -n ossh` — must PASS
2. **No --mkpath in code**: `grep -n 'mkpath' ossh` — should be 0 (or only in comments)
3. **No --rsync-path trick**: `grep -n 'rsync-path' ossh` — should be 0 (or only in comments)
4. **mkdir -p pattern present**: `grep -n 'mkdir -p' ossh` — should find the portable fallback
5. **All ssh calls have ControlPath**: `grep -n 'ssh.*\$toHost\|ssh.*\$host' ossh | grep -v ControlPath | grep -v '#' | grep -v 'ControlMaster'` — should be empty
6. **test.suite**: `./test.suite run ossh 1` — all assertions must pass
7. **oosh shell test** (MANDATORY): Use otmux to test in claudeWoda:0.4:
   ```
   otmux send claudeWoda:0.4 "cd ~/oosh && rsync --version | head -1" Enter
   ```
   Verify it's openrsync, then:
   ```
   otmux send claudeWoda:0.4 "./ossh connection.open KPP" Enter
   ```
   (May fail due to network — that's OK, we're testing the code path not the network)

## Reporting
When ALL PASS, send to pane 0.6: "Task 50 openrsync fix ALL PASS — tested"
