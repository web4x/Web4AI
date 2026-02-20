# Test Report: oo mode worktree-based branch switching

**Agent**: oosh-tester
**Date**: 2026-02-20

## Results

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T1 | Show current mode | **PASS** | Shows "Mode: dev.claude", path, git branch tracking |
| T2 | Completion lists branches | **PASS** | 19 branches listed, all expected names present |
| T7 | Invalid branch name | **PASS** | Error message, exit code 1, symlink unchanged |
| T3 | Switch to main | **PASS** | Symlink switched, "Switched to: main" |
| T4 | Branch tracking (not detached) | **PASS** | "On branch main", "up to date with origin/main" |
| T5 | Switch back to dev.claude | **FAIL** | **CRITICAL BUG** — see below |
| T6 | Combined switch-show-switch | **FAIL** | Same root cause as T5 |
| T8 | OOSH works after manual restore | **PASS** | All commands work after manual symlink fix |

**Score: 6/8 PASS, 2 FAIL (same root cause)**

## CRITICAL BUG: Cannot switch back after leaving dev.claude

### Root Cause

When `oo mode main` switches `~/oosh` to the `main` branch, the `oo` script now comes from `main`. The `main` branch has the OLD `oo.mode()` which only shows branch status — it does NOT accept a branch argument or switch symlinks.

Same issue with `hannes-v2` — confirmed the old `oo.mode()` exists there too.

**Result**: After `oo mode main`, running `oo mode dev.claude` does NOT switch back. The user is stuck on the target branch until they manually fix the symlink:
```bash
rm ~/oosh && ln -s /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude ~/oosh
```

### Why This Happens

The new `oo.mode()` with worktree switching only exists in `dev.claude`. When you switch to any other branch, you lose access to the switching feature itself. It's a bootstrap paradox.

### Recommended Fix

**Option A**: Store the `oo mode` switching logic outside the symlink path. For example:
- A standalone `~/.local/bin/oosh-mode` script that doesn't depend on `~/oosh`
- Or use the absolute path `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude/oo` for the switch-back command

**Option B**: Before switching, check if the target branch has the new `oo.mode()`. If not, warn the user and provide a one-liner to switch back.

**Option C**: Cherry-pick the `oo.mode()` commits (205bd40, 5427ac7) into all worktree branches. Fragile — needs re-doing on every change.

## Other Observations

- `oo mode` (no args) runs `git status --short --branch` which produces massive output due to hundreds of untracked `session/metrics/*.scenario.env` files. Consider adding `--no-untracked` or a `.gitignore` for metrics.
- The error output on T5's failed switch-back included warnings about push origin URL mismatch — these come from the main branch's `oo` startup code, not from `oo.mode()`.
- Symlink was manually restored after each failed switch-back. Current state: `~/oosh` → dev.claude (verified).
