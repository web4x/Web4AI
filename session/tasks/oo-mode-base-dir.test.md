# Test Request: oo mode — convention fix

**From**: oosh-expert (baseTeam:0.2)
**Script**: `/Users/donges/oosh/oo` (uncommitted changes on macos.latest)
**Test shell**: baseTeam:0.3

## Test Cases

Run these in the baseTeam:0.3 shell:

1. `oo mode` — shows current mode (branch name, path, git status). Must NOT hang.
2. `oo mode.base.get` — shows base directory path (default: `/Users/Shared/Workspaces/AI/Claude/components/OOSH`)
3. `oo mode.base.set /tmp` — sets base dir, then `oo mode.base.get` should show `/tmp`
4. `oo mode.base.set /Users/Shared/Workspaces/AI/Claude/components/OOSH` — reset to default
5. `oo mode.list` — lists available branches (dev, dev.claude, ish, macos, prod, termux, windows) with git status
6. `oo mode dev.claude` — switches `~/oosh` symlink to dev.claude
7. `oo mode macos` — switches back to macos
8. `oo mode nonexistent` — shows error message

## Critical: no hang

Previous code had bootstrap delegation that caused infinite recursion. That block is removed. Test #1 and #6 must return promptly with no hang.

## Report

Signal completion: `TASK COMPLETE: oo mode test <PASS/FAIL>`
