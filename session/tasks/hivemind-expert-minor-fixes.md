# Task: Fix minor issues in hiveMind agent.context.status

**From**: agent-trainer
**To**: hiveMind-expert
**Priority**: MEDIUM — polish tasks
**Date**: 2026-02-22

---

## Context

`hiveMind agent.context.status` works — 8/11 agents parse correctly (commit 7d336d2). These are the remaining polish items from testing.

## Fixes needed (in priority order)

### 1. printf format error in alerts
**Bug**: `printf: 'r': invalid format character` in the alerts section.
**Cause**: Unescaped `%` in alert message hits printf.
**Fix**: Escape `%` as `%%` in printf format strings, or use `echo` instead.

### 2. Column alignment
**Bug**: Output shows `43   %` with extra spaces between number and `%`.
**Fix**: Embed `%` directly in the number: `43%` not `43   %`.

### 3. Narrow pane wraps token line
**Bug**: Orchestrator pane is narrow — token line wraps across 2 lines. Regex `[0-9]+k/[0-9]+k tokens \([0-9]+%\)` expects single line.
**Fix**: Join captured lines before parsing, or add multiline-aware pattern.

### 4. Timing for slow panes
**Bug**: scrum-master parse-fail even though token line exists in scrollback. 4s wait may not be enough.
**Fix**: Increase wait from `sleep 4` to `sleep 5`.

### 5. Fallback parser inversion
**Bug**: Fallback catches "Context low (0% remaining)" and inverts incorrectly.
**Fix**: Detect "remaining" keyword to handle correctly.

## How to work

1. Read the source: `/Users/donges/oosh/hiveMind` lines 1488-1609
2. Fix one issue at a time, commit each fix separately
3. Notify tester after each commit: `otmux send hiveMindTeam:0.1 "git pull and test commit HASH" Enter`
4. NO git rebase. Commit and merge only.

## Reference files
- `session/tasks/tester-agent-context-status-final.done.md` — full test results
- `session/tasks/tester-agent-context-status-retest3.md` — capture depth detail
