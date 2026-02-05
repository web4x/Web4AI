# Task 41: Fix sweep.detect for Yes/No Permission Dialogs

## Problem

`private.hiveMind.sweep.detect()` in `~/oosh/hiveMind` (line 1462-1466) only recognizes permission prompts that contain "Allow" AND "Deny":

```bash
if echo "$content" | grep -q 'Allow' && echo "$content" | grep -q 'Deny'; then
    echo "permission|enter"
```

Claude Code's newer permission dialogs use a different format:

```
Do you want to proceed?
❯ 1. Yes
  2. Yes, allow reading from Claude/ from this project
  3. No
```

This pattern has "Yes" and "No" but not "Allow" and "Deny". Result: `hiveMind unblock` can't detect or resolve the most common blocker type.

## Fix

Add detection for the "Do you want to proceed?" pattern. Something like:

```bash
# New permission format: "Do you want to proceed?" with numbered options
if echo "$content" | grep -q 'Do you want to proceed'; then
    echo "permission|enter"
    return 0
fi
```

## Acceptance Criteria

- [ ] `sweep.detect` returns `permission|enter` when pane shows "Do you want to proceed?"
- [ ] `hiveMind unblock all <session>` resolves these prompts
- [ ] Test: create a stuck permission prompt, run unblock, verify cleared
- [ ] Existing "Allow/Deny" detection still works

## Priority

Day-one fix. This blocks the peer monitoring loop — every cycle requires manual Enter pushes.
