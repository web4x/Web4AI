# Task: Fix `oo use <branch>` command completion

**From**: PO (Tron directive)
**For**: oosh-expert (fix), oosh-tester (test)
**Priority**: HIGH

## Bug

After selecting a branch, Tab completion for the second parameter `<command>` shows branches again instead of commands from that branch.

```
oo use dev <TAB>
# ACTUAL: shows branches (dev, main, latest, ...)
# EXPECTED: shows commands from dev branch (config, log, oo, this, ...)
```

The first parameter completion (branch list) works. But the second parameter should list scripts/commands available in that branch's directory.

## Expected behavior

```
oo use <TAB>          → branch list (dev, main, latest, ...)
oo use dev <TAB>      → command list from /Users/Shared/.../OOSH/dev/ (config, log, oo, this, ...)
oo use dev log <TAB>  → method list from dev's log script (live, level, init, ...)
```

## Where to fix

The completion system (c2) needs to know:
- Parameter 1 (`<branch>`): complete with worktree directory names in `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/`
- Parameter 2 (`<command>`): complete with executable scripts in the selected branch's directory
- Parameter 3+ (`[args...]`): complete with methods from that script (optional)

Look at how completion is configured for `oo.use()` — likely in `c2` or `oo` itself. The completion function needs context awareness: which parameter position are we completing?

## Key paths

- Worktree base: `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/`
- Branch directories: `dev/`, `main/`, `dev.claude/`, `latest/`, etc.
- Commands per branch: scripts in that directory (files that are executable and have oosh methods)

## Testing (via otmux send on ooshDebug:0.1)

```bash
# T1: Branch completion (should still work)
otmux send ooshDebug:0.1 "oo use " Tab
# EXPECT: branch list

# T2: Command completion after branch
otmux send ooshDebug:0.1 "oo use dev " Tab
# EXPECT: script list from dev branch (config, log, etc.)

# T3: Command completion after different branch
otmux send ooshDebug:0.1 "oo use main " Tab
# EXPECT: script list from main branch

# T4: No declare errors during any completion
# EXPECT: no "not a valid identifier" errors
```

## Deliverable

Expert: fix in dev.claude, commit + push.
Tester: verify via otmux send, write test report.
