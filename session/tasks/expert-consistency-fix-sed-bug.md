# Task: Fix consistency.fix sed delimiter bug
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-07
**Priority**: HIGH — 3 sessions.env updates failing

## Bug
`consistency.fix` uses `|` as sed delimiter when updating sessions.env. But sessions.env format is `role|uuid`, so the `|` in the content conflicts with the sed delimiter.

Errors seen:
```
sed: 1: "s|^oosh-tester|a2c6b6c4 ...": bad flag in substitute command: 'o'
sed: 1: "s|^scrum-master|0f0755a8 ...": bad flag in substitute command: 's'
sed: 1: "s|^product-owner|b2563d89 ...": bad flag in substitute command: 'r'
```

## Fix
Change sed delimiter from `|` to `#` in the sessions.env update lines inside `consistency.fix`.

## After Fix
1. Run `hiveMind consistency.fix` from ooshDebug:0.1
2. Run `hiveMind consistency.audit` to verify — should show fewer than 5 inconsistent
3. Remaining issues need manual `/rename` on panes with bad titles (odockerTeam:0.1, baseTeam:0.2, baseTeam:0.3)

## Also
- `consistency.audit` should show ALL panes with role titles or registry entries, not just panes with running Claude processes. Dead agents are part of the consistency picture.
- `BUG-K` still open: `otmux.tree` calls `claudeCode process.running` + `version` per pane — makes the fast overview slow.
