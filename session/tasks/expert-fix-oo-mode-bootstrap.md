# Bug Fix: oo mode bootstrap paradox

**From**: Tester report (6/8 PASS, 2 FAIL)
**For**: oosh-expert
**Priority**: HIGH — blocks all branch testing

## The Bug

After `oo mode main` switches `~/oosh` → main, you can't switch back. Main's `oo` script has the OLD `oo.mode()` which doesn't support worktree switching. Same for ALL other branches — only dev.claude has the new code.

It's a bootstrap paradox: the switching feature only exists in dev.claude, but switching away removes access to it.

## Failed Tests

- **T5 FAIL**: `oo mode dev.claude` from main → runs main's old code, does `git checkout` instead of symlink switch
- **T6 FAIL**: Combined switch-show-switch → can't return from any non-dev.claude branch

Manual recovery (tester used twice):
```bash
rm ~/oosh && ln -s /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude ~/oosh
```

## Additional Bug

Switching to main triggers: `/Users/donges/oosh/oo: line 221: /oosh.env: No such file or directory`
This is the `source $CONFIG_PATH/oosh.env` line — config path differs between branches.

## Required Fix

The switching logic must NOT depend on which branch `~/oosh` points to.

**Option A** (tester's suggestion): Install a standalone `oosh-mode` script in `~/.local/bin/`:
- Independent of `~/oosh` symlink
- Always available regardless of active branch
- Calls the same logic but from a fixed location

**Option B**: Make `oo mode` always source the switching function from a fixed path:
```bash
# Inside oo.mode(), at the very top:
local WORKTREE_BASE="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH"
local DEV_OO="$WORKTREE_BASE/dev.claude/oo"
# If we're not on dev.claude, source the switching logic from dev.claude
if [ "$(readlink ~/oosh)" != "$WORKTREE_BASE/dev.claude" ]; then
  source "$DEV_OO"
  oo.mode "$@"
  return
fi
```

**Option C**: Copy just the mode function into ALL branch worktrees. But this is fragile — changes would need to be synced.

**PO recommendation**: Option B is cleanest — zero installation, always falls back to dev.claude's code for switching. Option A is more robust but requires separate installation.

## Acceptance Criteria

1. `oo mode main` switches to main
2. From main: `oo mode dev.claude` switches BACK to dev.claude
3. From ANY branch: `oo mode <other>` works
4. No `/oosh.env: No such file or directory` error
5. Tester re-runs all 8 tests, all PASS

## Files

- `/Users/donges/oosh/oo` — fix `oo.mode()` function
- Test report: `session/tasks/tester-oo-mode-worktree.done.md`
