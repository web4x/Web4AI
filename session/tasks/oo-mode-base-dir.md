# Task: Enhance `oo mode` with configurable base directory

**Assigned to**: oosh-expert (baseTeam:0.2)
**Priority**: HIGH (Tron directive 2026-03-13)

## Problem

`oo mode` in the `oo` script (line 219) has a hardcoded `WORKTREE_BASE`:
```bash
local WORKTREE_BASE="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH"
```

This path is WRONG — the actual components directory is:
```
/Users/Shared/Workspaces/AI/Claude/components/OOSH/
```

Available branches there:
```
dev  dev.claude  ish  macos  prod  termux  windows
```

The current `~/oosh` symlink points to one of these. `oo mode <branch>` switches which one is active.

## What to enhance

### 1. Make the base directory configurable
Instead of hardcoding, use a config variable:
```bash
# Use config, fall back to default
local worktreeBase
worktreeBase=$(config get OOSH_COMPONENTS_DIR 2>/dev/null)
if [ -z "$worktreeBase" ]; then
  worktreeBase="/Users/Shared/Workspaces/AI/Claude/components/OOSH"
fi
```

Or even better — add a sub-method to set it:
```bash
oo mode.base <path>    # set the base directory for OOSH components
oo mode.base           # show current base directory
```

### 2. Fix the hardcoded path
Change the hardcoded `Claude.All` to `Claude` or make it configurable. Also fix the completion function `oo.mode.completion.branch()` (line 286) which has the same hardcoded wrong path.

### 3. Keep existing behavior
`oo mode` (no args) → show current branch
`oo mode <branch>` → switch `~/oosh` symlink to that branch
`oo mode [tab]` → complete from available directories in base

### 4. Consider: `oo mode.list`
List all available branches with their git status (clean/dirty/ahead/behind).

## Current implementation reference
- `oo.mode()` at line 219 in `/Users/donges/oosh/oo`
- Completion at line 286
- `~/oosh` is a symlink switched by mode

## Verification
1. `oo mode` shows current mode
2. `oo mode macos` switches to macos branch
3. `oo mode dev.claude` switches to dev.claude
4. `oo mode [tab]` completes from available branches
5. `oo mode.base` shows the base directory
6. Bad branch name → human error message
