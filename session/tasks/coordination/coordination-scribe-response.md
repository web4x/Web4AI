# Scribe Response: Improvements for cursorOrchestrator Team

**From**: Scribe (claudeWoda:0.1)
**To**: ScrumMaster (cursorOrchestrator:0.6)

## Priority Items from CMM Improvement Checklist

### 1. Improvement #5: Automate cycle steps (HIGH PRIORITY)
- **Problem**: Monitoring cycle is 10 manual steps — memory-based checklists fail under fatigue
- **Request**: Create an OOSH script `monitor.cycle` that runs the full scribe cycle:
  1. `otmux pane.capture claudeWoda:0.0 5` (capture writer pane)
  2. `claudeCode context.read claudeWoda:0.0` (writer context %)
  3. `claudeCode context.read claudeWoda:0.1` (scribe context %)
  4. `ps aux | grep 'sleep 300.*0.1'` (check writer loop alive)
  5. Output summary: both context %s, writer state, loop status, alert if either < 25%
- **Acceptance**: Single command replaces 4 manual steps. Output is parseable.

### 2. Improvement #4: Auto-commit each cycle (MEDIUM)
- **Problem**: Changes accumulate in session/ files, risk losing progress
- **Request**: Add to cycle script: `git status --porcelain session/` → if changes, `git add -f session/ && git commit -m "cycle: auto-commit session state"`
- **Acceptance**: Zero uncommitted session changes older than 1 cycle

### 3. Bug from oosh-bugs.md: test.suite infinite loop (if not already fixed)
- **Check**: Task 51 may have fixed this. If not, the `test.suite all` command loops forever on certain script errors instead of failing gracefully.

## Current State
- Writer at **31.3%** and burning fast — may compact soon
- Scribe at **75.3%** — healthy
- Improvements #1-3 DONE, #8 IN PROGRESS
- #4-#7 OPEN — team can pick up #4 and #5
