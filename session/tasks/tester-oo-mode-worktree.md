# Test Task: oo mode worktree-based branch switching

**From**: PO
**For**: oosh-tester
**Priority**: HIGH

## What was built

The expert enhanced `oo mode` (in `/Users/donges/oosh/oo`) to:
1. Show current branch mode and list all available worktree branches
2. Switch `~/oosh` symlink between worktree directories under `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/`
3. Create a new worktree on-the-fly if a branch directory doesn't exist yet
4. Tab-complete branch names via `oo.mode.completion.branch()`

Commits: 205bd40 (initial), 5427ac7 (cleanup)

## How it works

- `~/oosh` is a symlink → currently points to `.../OOSH/dev.claude/`
- `oo mode` (no args) shows: current mode, path, git status of current branch
- `oo mode <branch>` switches the symlink to `.../OOSH/<branch>/`
- Each branch directory is a `git worktree` sharing .git data with dev.claude
- Tab completion: `oo mode <TAB>` lists directories under `.../OOSH/`

## Where to test

Use the **ooshDebug** tmux session. Panes available:
- `ooshDebug:0.1` — bash shell (McDonges-4.fritz.box)
- `ooshDebug:0.2` — bash shell (McDonges.fritz.box)

Send test commands via:
```bash
otmux send ooshDebug:0.1 "command" Enter
```

Capture results via:
```bash
otmux pane.capture ooshDebug:0.1 20
```

## Test Cases

### T1: Show current mode
```bash
oo mode
```
**Expected**: Shows "Mode: dev.claude", path to dev.claude, git status on dev.claude branch.

### T2: List available branches (tab completion)
```bash
oo.mode.completion.branch
```
**Expected**: Lists all directory names: dev, dev.claude, feature.fixLogging, feature.loglive, feature.neom.N1-185, feature.neom.N1-37, feature.neom.N1-418, feature.path, feature.pathConfig, fullDebug, hannes, hannes-v2, main, mkt-N1-134, once.sh, stable.bash4, test.ish, test.macos, test.windows

### T3: Switch to another branch
```bash
oo mode main
ls -la ~/oosh
```
**Expected**:
- Output says "Switched to: main"
- `~/oosh` symlink now points to `.../OOSH/main`
- IMPORTANT: switch back afterwards! See T5.

### T4: Verify branch is tracked (not detached HEAD)
```bash
cd ~/oosh && git status
```
**Expected**: "On branch main" (or whatever branch), "Your branch is up to date with 'origin/main'". NOT "Not currently on any branch."

### T5: Switch back to dev.claude
```bash
oo mode dev.claude
ls -la ~/oosh
```
**Expected**: `~/oosh` → `.../OOSH/dev.claude/`. ALWAYS switch back after testing.

### T6: Mode shows correct branch after switch
```bash
oo mode main && oo mode && oo mode dev.claude
```
**Expected**: `oo mode` (middle call) shows "Mode: main", then switches back.

### T7: Invalid branch name
```bash
oo mode nonexistent-branch-12345
```
**Expected**: Error message, symlink unchanged.

### T8: Verify OOSH still works after switch-and-back
```bash
oo mode main && oo mode dev.claude && oo mode
```
**Expected**: After switching back to dev.claude, all oosh commands work normally. The final `oo mode` shows dev.claude correctly.

## CRITICAL WARNING

Switching `~/oosh` away from `dev.claude` means ALL oosh commands (hiveMind, scrumMaster, otmux, etc.) use the target branch's code. The test branch may have older/different code.

**ALWAYS switch back to dev.claude after each test.** If you forget, oosh commands will break for the entire team.

## Test sequence (safe order)

1. T1 (show — safe, no switch)
2. T2 (completion — safe, no switch)
3. T7 (invalid — safe, should error)
4. T3 → T4 → T5 (switch to main, verify tracking, switch back)
5. T6 (combined switch-show-switch)
6. T8 (verify nothing broke)

## Report

After testing, report:
- PASS/FAIL for each test case
- Any unexpected behavior
- Whether completion works with actual tab key (if testable in the pane)
