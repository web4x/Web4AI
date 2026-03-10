# Task 50 FIX #3 — ossh.login missing ControlPath

**Assigned to**: Expert (cursorOrchestrator:0.4)
**Priority**: High

## Bug

`ossh.login` at line 737 uses raw ssh without ControlPath:
```bash
ssh -o StrictHostKeyChecking=accept-new "$sshConfigHost"
```

## Fix
```bash
ssh -o ControlPath="$OSSH_CONTROL_PATH" -o StrictHostKeyChecking=accept-new "$sshConfigHost"
```

## Also

Grep ALL `ssh ` calls in ossh that are NOT inside `private.ossh.ssh` or `ossh.connection.*`. Every ssh call must use ControlPath. Fix any remaining gaps.

## When Done
Commit "Task 50 fix: ControlPath in ossh.login + remaining ssh calls"
Then say: "Task 50 login fix committed"
