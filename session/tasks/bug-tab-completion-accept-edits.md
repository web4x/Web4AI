# BUG — Tab completion shows 'pletion on' — accept-edits completion interfering

**Reporter**: Tron via PO (ooshTeam:0.0) 2026-05-26
**Symptom**: Tab completion produces fragment 'pletion on' — likely accept-edits TUI state intercepting Tab
**Impact**: MEDIUM — operator workflow disrupted; cosmetic+functional
**Assignee**: oosh-expert
**Status**: QUEUED — investigated after bug-otmux-fit-too-small

## Hypothesis

"pletion on" looks like a fragment of "completion on" — possibly from a Claude Code accept-edits banner ("⏵⏵ accept-edits on" / "⏵⏵ auto mode on") being captured into a completion suggestion. Could be:

1. c2 completion engine reading the wrong scope — picking up TUI text instead of method names
2. tmux Tab key intercepted by Claude Code TUI before reaching shell
3. accept-edits prompt active in operator pane during Tab — Tab dismisses prompt rather than triggering bash completion
4. The send.smart accept-edits detection (otmux line ~1078) injects `BTab BTab` to clear — if a Tab arrives mid-clear, completion picks up the residual

## Investigation plan

1. Reproduce: in oosh-expert-shell pane, type partial command and Tab — observe behavior
2. Check otmux.send.smart `⏵⏵ accept` detection path for any leak
3. Check c2 completion engine — does it filter TUI content?
4. Inspect bash completion config for any otmux/oosh customization

## Findings

(filled during investigation)

## Fix

(filled after diagnosis)

## Commit

(filled after fix)

## Status

(filled after closure)
