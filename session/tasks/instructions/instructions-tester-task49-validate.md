# Task 49 Validation — watchdog supervisor

**Assigned to**: Tester (cursorOrchestrator:0.5)

## What Changed

Expert added watchdog supervisor with heartbeat + auto-restart to `hiveMind`.
Commit: 6dd4f57

## Tests to Run

From `components/OOSH/dev.claude/`:

1. **Syntax check**: `bash -n hiveMind` — must PASS
2. **Heartbeat variable exists**: `grep 'HIVEMIND_WATCHDOG_HEARTBEAT' hiveMind` — should show definition
3. **Supervisor method exists**: `grep 'hiveMind.watchdog.supervisor()' hiveMind` — should show the method
4. **Completion stubs**: `grep 'watchdog.supervisor.completion' hiveMind` — should exist
5. **Heartbeat in loop**: `grep 'touch.*heartbeat' hiveMind` — should show heartbeat touch in the watchdog loop
6. **Start watchdog**: `./hiveMind watchdog 10` — should start
7. **Check heartbeat file**: `ls -la /tmp/hivemind.watchdog.heartbeat` — should exist after a cycle
8. **Run supervisor on healthy watchdog**: `./hiveMind watchdog.supervisor` — should report "healthy"
9. **Kill watchdog**: `kill $(cat /tmp/hivemind.watchdog.pid)` — simulate crash
10. **Run supervisor on dead watchdog**: `./hiveMind watchdog.supervisor` — should detect death and restart
11. **Verify restart**: `./hiveMind watchdog.status` — should show running with new PID
12. **Cleanup**: `./hiveMind watchdog.stop`

## Do NOT interact with claudeWoda panes

## Reporting
When ALL PASS, send to pane 0.6: "Task 49 ALL PASS — watchdog supervisor validated"
