# Fix: team.setup.extended layout bug

**From**: Tester validation
**Assigned**: oosh-expert

## Bug 1 (BLOCKING): Window 1 split sequence wrong

Current layout produces:
```
┌─────────────────────────────────────────┐
│         1.1 ORCHESTRATOR                │
├───────────────────────┬─────────────────┤
│ 1.2 SCRUMMASTER       │ 1.3 EXPERT      │  ← WRONG
└───────────────────────┴─────────────────┘
```

Desired layout:
```
┌─────────────────────────────────────────┐
│         1.1 ORCHESTRATOR                │
├───────────────────────┬─────────────────┤
│ 1.3 EXPERT            │ 1.4 TESTER      │
├───────────────────────┴─────────────────┤
│         1.2 SCRUMMASTER                 │
└─────────────────────────────────────────┘
```

Fix: Change the Window 1 split order to: split.v → split.v → split.h on the middle pane. ScrumMaster must be full-width at bottom.

## Bug 2 (minor): Dead code

Line ~1296: `local session="${1:-projectTeam}"` provides a default, so the `-z` check on line ~1298 never fires. Either remove the default (make session truly required) or remove the dead `-z` check.
