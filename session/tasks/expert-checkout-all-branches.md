# Task: Check out every OOSH remote branch into its own directory

**From**: PO (Tron directive)
**For**: oosh-expert
**Priority**: HIGH — do this first

## What to do

The OOSH repo at `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude/` has 17 remote branches.

For EACH remote branch, create a directory under `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/` and check out that branch there.

## Remote branches (from `git branch -r`)

```
origin/dev
origin/dev.claude          ← already exists as directory
origin/feature/fixLogging-in-mycmd-test
origin/feature/loglive
origin/feature/neom/N1-185_Several_fixes_for_ONCE_state_machine
origin/feature/neom/N1-37_Fix_c2_completion
origin/feature/neom/N1-418-test-086d8c0-on-oosh-repository-in-dev-branch
origin/feature/path
origin/feature/pathConfig
origin/fullDebug
origin/hannes
origin/main
origin/mkt-N1-134
origin/stable/bash4
origin/test/ish
origin/test/macos
origin/test/windows
```

## Method: git worktree

Use `git worktree add` from the existing repo. This is efficient — shares the .git data, just creates separate working directories.

```bash
cd /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude
git worktree add ../dev origin/dev
git worktree add ../main origin/main
# etc.
```

For branches with slashes (e.g., `origin/feature/neom/N1-185_...`), use the LAST meaningful segment as the directory name, or flatten with dots. Examples:
- `origin/feature/loglive` → `feature.loglive/`
- `origin/feature/neom/N1-185_Several_fixes...` → `feature.neom.N1-185/`
- `origin/test/macos` → `test.macos/`
- `origin/stable/bash4` → `stable.bash4/`

## Skip

- `origin/HEAD` — pointer, not a branch
- `origin/dev.claude` — directory already exists, it's the main worktree

## Verify

After all worktrees are created:
1. `git worktree list` — should show all directories
2. Each directory should contain the OOSH files for that branch
3. `ls /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/` — should show all branch directories

## Do NOT

- Don't modify the dev.claude directory
- Don't push anything
- Don't merge anything
- Don't change any branch — just check them out as-is
