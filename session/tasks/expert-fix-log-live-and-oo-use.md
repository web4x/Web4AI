# Task: Fix `log live` and `oo use` errors

**From**: PO (Tron directive)
**For**: oosh-expert (fix), oosh-tester (test via otmux send)
**Priority**: HIGH

## Context

The ooshDebug tmux session has 5 panes:
- `ooshDebug:0.0` — Claude Code session
- `ooshDebug:0.1` — oosh shell (bottom left)
- `ooshDebug:0.2` — `log live` (BROKEN)
- `ooshDebug:0.3` — `log live.result`
- `ooshDebug:0.4` — `log live.error`

## Bug 1: `log live` is broken

`log live` used to work but recently broke. The `log.live()` function (log script, line 362) does `tail -f $LOG_LIVE`. The variable `LOG_LIVE` must be set during oosh bootstrap. Investigate which recent change broke it.

Check:
- Is `LOG_LIVE` set in `config` or `oosh.env`?
- Was it removed or renamed by a recent commit?
- Does `log live` work from dev.claude? From main? From other branches?

Use `git log --oneline -20` and `git diff` to find the breaking change.

## Bug 2: `oo use` gives errors

`oo use dev log live` was attempted in ooshDebug:0.2 and produced:
```
/Users/Shared/.../OOSH/dev/this: line 476: important.log: command not found
/Users/Shared/.../OOSH/dev/config: line 270: console.log: command not found
/Users/Shared/.../OOSH/dev/config: line 304: important.log: command not found
```

Root cause: `oo.use()` (oo line 321) runs:
```bash
OOSH_DIR="$branch_dir" "$branch_dir/$command" "$@"
```

This sets OOSH_DIR but the target branch's `this` kernel bootstraps in a new process where `log` functions aren't yet loaded. The target's `config` script calls `console.log` and `important.log` before `log` is sourced.

The fix needs to ensure the target branch bootstraps correctly. Options:
- Source `this` from the target branch before running the command
- Or run the command through the target's `this` dispatcher (which bootstraps everything)

## Testing: Use otmux send (test as a user would)

The tester MUST test by sending commands to ooshDebug panes via `otmux send`, NOT by running commands directly. This simulates real user interaction:

```bash
# Test log live
otmux send ooshDebug:0.2 "log live" Enter
sleep 2
otmux pane.capture ooshDebug:0.2 10

# Test log live.result
otmux send ooshDebug:0.3 "log live.result" Enter
sleep 2
otmux pane.capture ooshDebug:0.3 10

# Test log live.error
otmux send ooshDebug:0.4 "log live.error" Enter
sleep 2
otmux pane.capture ooshDebug:0.4 10

# Test oo use
otmux send ooshDebug:0.1 "oo use dev log live" Enter
sleep 2
otmux pane.capture ooshDebug:0.1 10

otmux send ooshDebug:0.1 "oo use main log live" Enter
sleep 2
otmux pane.capture ooshDebug:0.1 10
```

## Exploration across branches

Expert should compare `log live` across branches to find where it broke:
```bash
# Check dev.claude (latest)
oo use latest log live

# Check main (stable)
oo use main log live

# Check dev
oo use dev log live

# Compare log scripts
diff <(oo use latest log) <(oo use main log)
```

## Fix in latest branch

All fixes go into dev.claude (which is `latest`). Do NOT modify other branches.

## Files likely involved

- `/Users/donges/oosh/log` — `log.live()` at line 362
- `/Users/donges/oosh/oo` — `oo.use()` at line 292-321
- `/Users/donges/oosh/this` — bootstrap/kernel
- `/Users/donges/oosh/config` — may set LOG_LIVE
- `~/config/user.env` or `~/config/oosh.env` — config files where LOG_LIVE lives

## Deliverables

1. Expert: diagnose both bugs, fix in dev.claude, commit+push
2. Tester: test via otmux send to ooshDebug panes, verify log live/result/error all work, verify oo use works across branches
