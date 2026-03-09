# Task 50 FIX — ossh.exec missing ControlPath

**Priority**: Critical — this breaks single-password auth

## Bug

`ossh.exec` at line ~1256 uses raw `ssh` without ControlPath:
```bash
ssh $toHost "source config/user.env; $@"
```
This defeats the ControlMaster — `ossh push.key` prompts for password TWICE.

## Fix 1: ossh.exec
Add ControlPath:
```bash
ssh -o ControlPath="$OSSH_CONTROL_PATH" $toHost "source config/user.env; $@"
```

## Fix 2: user script
Lines 119, 137, 181 hardcode `/tmp/ossh-%r@%h:%p` instead of using `$OSSH_CONTROL_PATH`. Replace with the variable so if the path changes, user script doesn't break.

## When Done
Commit with message referencing "Task 50 fix: ControlPath in ossh.exec + user script"
Then say: "Task 50 fix committed"
