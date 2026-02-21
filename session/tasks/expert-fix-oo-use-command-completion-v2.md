# Task: Fix `oo use <branch>` command completion (v2 — corrected approach)

**From**: PO (Tron directive)
**For**: oosh-expert
**Priority**: HIGH

## Bug

After selecting a branch, Tab completion for the second parameter `<command>` shows branches again instead of commands from that branch.

```
oo use dev <TAB>
# ACTUAL: shows branches (dev, main, latest, ...)
# EXPECTED: shows commands from dev branch (config, log, oo, this, ...)
```

## IMPORTANT: How to fix

1. **Edit source files in /Users/donges/oosh/ directly.** Use Read and Edit tools.
2. **Do NOT define functions via otmux send.** That was the wrong approach.
3. **Do NOT send long commands to ooshDebug panes.** They garble.
4. **Test via otmux send to ooshDebug:0.1** — short commands only: `oo use dev ` + Tab

## Where to look

The completion system needs to know which parameter position we're completing:
- Position 1 (`<branch>`): list worktree dirs in `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/`
- Position 2 (`<command>`): list scripts in the selected branch dir

Start by reading:
1. `/Users/donges/oosh/c2` — the completion engine
2. `/Users/donges/oosh/oo` — look for `oo.use.completion` functions
3. How does c2 know about parameter positions? Look for how other multi-param methods handle positional completion.

## Git history check

Run `git log --oneline -5 /Users/donges/oosh/c2` to see recent changes to the completion system.

## Deliverable

Fix in dev.claude source files, commit + push. Then tester verifies.
