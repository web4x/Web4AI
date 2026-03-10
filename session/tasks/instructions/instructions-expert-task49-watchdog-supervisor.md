# Task 49: Watchdog Supervisor — restart mechanism

**Priority**: Medium
**Source**: CMM4 Ch12 — Watchdog died silently, stale PID, no supervisor, no restart

## Bug

`hiveMind.watchdog()` starts a bash loop in a tmux pane, but:
1. If the pane is closed or the loop crashes, nobody restarts it
2. Stale PID file left behind — `watchdog.status` says "not running (stale PID file)" but doesn't restart
3. No supervisor mechanism — once dead, stays dead until manually restarted
4. No heartbeat — can't tell if watchdog is alive vs stuck

## Current Code

File: `components/OOSH/dev.claude/hiveMind` lines 1709-1782

The watchdog is a `while true; do ... sleep N; done` loop spawned via `tmux split-window`. PID is stored in `/tmp/hivemind.watchdog.pid`. Status checks PID with `kill -0`.

## Required Fix

Add a `hiveMind.watchdog.supervisor()` method that:

1. **Checks watchdog health** — is the PID alive? Is the pane still there?
2. **Auto-restarts** if dead — calls `hiveMind.watchdog` to respawn
3. **Writes heartbeat** — watchdog loop should touch a heartbeat file each cycle (e.g., `/tmp/hivemind.watchdog.heartbeat`)
4. **Detects stale heartbeat** — if heartbeat file is older than 2x interval, watchdog is stuck even if PID exists
5. **Logs restarts** — append to watchdog log when supervisor restarts the watchdog

### Implementation Details

In `hiveMind.watchdog()` loop, add heartbeat:
```bash
# Inside the while loop, add:
touch /tmp/hivemind.watchdog.heartbeat
```

New method `hiveMind.watchdog.supervisor()`:
```bash
hiveMind.watchdog.supervisor() # <?interval:60> # monitor and restart watchdog if it dies
{
  local check_interval="${1:-60}"
  local heartbeat_file="/tmp/hivemind.watchdog.heartbeat"
  local max_stale=$((check_interval * 3))  # 3x check interval = stale

  # Check if watchdog is running
  if ! hiveMind.watchdog.status > /dev/null 2>&1; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') SUPERVISOR: Watchdog dead, restarting..." >> "$HIVEMIND_WATCHDOG_LOG"
    hiveMind.watchdog
    return $?
  fi

  # Check heartbeat freshness
  if [ -f "$heartbeat_file" ]; then
    local last_beat=$(stat -f %m "$heartbeat_file" 2>/dev/null)  # macOS stat
    local now=$(date +%s)
    local age=$(( now - last_beat ))
    if [ "$age" -gt "$max_stale" ]; then
      echo "$(date '+%Y-%m-%d %H:%M:%S') SUPERVISOR: Watchdog stale (${age}s), restarting..." >> "$HIVEMIND_WATCHDOG_LOG"
      hiveMind.watchdog.stop
      hiveMind.watchdog
      return $?
    fi
  fi

  echo "healthy"
  return 0
}
```

Also add a convenience method to start both:
```bash
hiveMind.watchdog.supervised() # <?seconds:30> # start watchdog with supervisor auto-restart
```
This starts the watchdog AND adds a cron-like check (or a second loop) that calls `supervisor()` periodically.

### OOSH Patterns to Follow

- All methods need matching `.completion()` stubs
- Use `console.log` / `error.log` for output
- Follow existing watchdog code style
- Use `$HIVEMIND_WATCHDOG_LOG` for all logging

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n hiveMind

# 2. Start watchdog
./hiveMind watchdog 10

# 3. Check heartbeat file exists
ls -la /tmp/hivemind.watchdog.heartbeat

# 4. Kill watchdog to simulate crash
kill $(cat /tmp/hivemind.watchdog.pid)

# 5. Run supervisor — should detect death and restart
./hiveMind watchdog.supervisor

# 6. Verify watchdog restarted
./hiveMind watchdog.status

# 7. Clean up
./hiveMind watchdog.stop
```

## When Done
Commit: "Task 49: Add watchdog supervisor — heartbeat + auto-restart"
Then say: "Task 49 committed"
