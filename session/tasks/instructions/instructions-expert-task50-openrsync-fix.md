# Task 50 FIX #2 — macOS openrsync compatibility

**Priority**: Critical — rsync calls may fail on macOS

## Problem

macOS ships `openrsync` (reports "version 2.6.9"), NOT GNU rsync.
- `--mkpath` is not supported (already handled by version check — good)
- `-z` (compress) may not be supported by openrsync
- `--rsync-path` trick works differently with openrsync as local client
- Need to verify ALL rsync flags work with openrsync

## What to Fix

1. **Test openrsync flag support** in the oosh shell (pane claudeWoda:0.4) using `otmux send`:
   ```
   otmux send claudeWoda:0.4 "rsync --version" Enter
   otmux send claudeWoda:0.4 "rsync -avz --dry-run /tmp/test localhost:/tmp/" Enter
   ```

2. **If `-z` fails**: Remove `-z` or detect openrsync and skip compression flag

3. **Make fallback more portable**: Instead of `--rsync-path="mkdir -p dir && rsync"`, consider:
   ```bash
   ssh -o ControlPath="$OSSH_CONTROL_PATH" $host "mkdir -p $remote_dir"
   rsync -av -e "ssh -o ControlPath=$OSSH_CONTROL_PATH" "$src" "$dest"
   ```
   This is two commands but works everywhere.

4. **Test with a REAL host from oosh shell** — not just grep/bash -n:
   ```
   otmux send claudeWoda:0.4 "cd ~/oosh && ./ossh connection.open KPP" Enter
   # Wait, then capture output
   tmux capture-pane -t claudeWoda:0.4 -p -S -10
   ```

## MANDATORY: Test in oosh shell via otmux

You MUST test your changes by running actual ossh commands in the oosh shell (claudeWoda:0.4). Use `otmux send` and `tmux capture-pane` to execute and verify. Do NOT rely only on grep/bash -n.

## When Done

Commit with message "Task 50 fix: openrsync compatibility on macOS"
Then say: "Task 50 openrsync fix committed and tested"
