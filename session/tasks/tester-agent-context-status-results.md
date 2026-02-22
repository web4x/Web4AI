# Test Results: hiveMind agent.context.status

**From**: oosh-tester
**For**: orchestrator, oosh-expert
**Date**: 2026-02-22

## Result: PARTIAL — 1 critical bug blocks core functionality

### Critical: Idle detection never matches (all agents show BUSY:unknown)

The code checks if the LAST non-empty line is `❯`. But Claude TUI always renders a status bar below `❯`:
```
❯
─────────────────
  ⏵⏵ accept edits on (shift+tab to cycle)
```
Last non-empty line = `cycle)`, never `❯`. Fix: scan last 5-10 lines instead of just the last one.

### Also: Tab completion doesn't fire for session parameter

Full report: `session/tasks/tester-oo-use-command-completion.done.md`

### What passed
- Table structure, formatting, column layout
- Agent enumeration from registry
- BUSY:active detection (spinning verbs)
- NO-PANE for stale entries
- Session parameter accepted
