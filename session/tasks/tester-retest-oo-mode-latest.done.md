# Re-Test Report: oo mode with latest symlink + oo use (commit 96be66e)

**Agent**: oosh-tester
**Date**: 2026-02-20

## Results

| Test | Description | Result | Notes |
|------|-------------|--------|-------|
| T1 | `oo mode` show current | **PASS** | Shows "Mode: dev.claude", path, git status |
| T2 | `oo mode main` switch | **PASS** | Symlink switched, "Switched to: main" |
| T3 | Switch back from main | **FAIL** | **Bootstrap paradox NOT fixed** — main's `oo.mode()` is old version |
| T4 | `oo use latest` from main | **FAIL** | Main's `oo` has no `oo.use()` — `this` dispatcher fails |
| T5 | `oo use main oo mode` | **PASS** | Ran main's old `oo mode`, symlink unchanged |
| T6 | `oo use` invalid branch | **PASS** | Error message, exit code 1 |
| T7 | `oo use` invalid command | **PASS** | Error message, exit code 1 |
| T8 | Round-trip switching | **FAIL** | Stuck on main after first switch, same as T3 |
| T9 | Tab completion | **PASS** | Both `mode` and `use` completions list 20 branches incl. `latest` |

**Score: 6/9 PASS, 3 FAIL (same root cause)**

## Root Cause: Bootstrap delegation only exists in dev.claude

The expert's fix adds bootstrap delegation at `oo.mode()` lines 226-237:
```bash
if [ "$current_target" != "$WORKTREE_BASE/$latest_target" ]; then
    source "$LATEST/this" 2>/dev/null
    source "$LATEST/oo" 2>/dev/null
    oo.mode "$@"
```

**Problem**: This code only exists in `dev.claude/oo`. When `~/oosh` → `main`, running `oo mode` executes `main/oo`, which has the OLD `oo.mode()` (line 218: `# shows branch status`). The old version:
- Doesn't accept arguments
- Has no bootstrap delegation
- Has no `oo.use()` method

The `latest` symlink exists correctly (`latest` → `dev.claude`) but no code in other branches knows to use it.

## What works from dev.claude

When ON dev.claude, everything works perfectly:
- `oo mode` shows status (T1 PASS)
- `oo mode <branch>` switches (T2 PASS)
- `oo use <branch> <cmd>` runs one-shot (T5, T6, T7 PASS)
- Tab completion for both mode and use (T9 PASS)

## What fails after switching away

Once `~/oosh` points to any non-dev.claude branch:
- `oo mode <branch>` → runs old code, ignores argument
- `oo use <branch> <cmd>` → command not found

## Recommended Fix

The bootstrap code must live OUTSIDE the `~/oosh` symlink path. Options:

**Option A (simplest)**: Create `~/.local/bin/oo-mode` standalone script that always uses `latest`:
```bash
#!/usr/bin/env bash
LATEST="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/latest"
source "$LATEST/this" 2>/dev/null
source "$LATEST/oo" 2>/dev/null
oo.mode "$@"
```

**Option B**: Add a shell function to `~/.bashrc` that intercepts `oo mode` and delegates to latest before `oo` is invoked.

**Option C**: Copy just the `oo.mode()` function into every branch's `oo` file. Fragile — breaks on every update.

## Symlink Status

Restored to dev.claude after every failed test. Verified: `~/oosh` → `.../OOSH/dev.claude`.
