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

**RESOLVED as duplicate root cause of bug-otmux-fit-too-small.md.**

The "pletion on" fragment was bash's filename completion line-wrapping `.bashrc.bak.without.completion` (a real file in $HOME) — broken into two lines as `complet` + `ion`. Tron's terminal width was small enough that the wrap exposed the tail fragment `pletion on`.

Why filename completion fired: c2 completion was failing (because of apostrophes in 9 method doc comments), producing malformed `current.method.env`, sourcing failed with "unexpected EOF", c2 returned no candidates, bash fell back to default filename completion. `.bashrc.bak.without.completion` matched the `.` prefix in $HOME.

Accept-edits hypothesis dismissed — no TUI interference. Purely a c2 pipeline bug.

## Fix

Same fix as bug-otmux-fit-too-small.md — commit `4338d2c` strips apostrophes from c2 signature pipeline.

## Verification

Post-fix interactive test: `hiveMind join ` + Tab → shows agent names (`TRONinterface-agent`, `agent-trainer`, `fallback-oosh-expert`, etc.) instead of $HOME filenames. No "pletion on" fragment.

## Commit

(none — closed as duplicate, fixed by `4338d2c` shipped under bug-otmux-fit-too-small.md)

## Status (closure)

- **Resolution**: duplicate root cause; closed without separate commit.
- **Single fix** at `4338d2c` resolves both bugs simultaneously.
- **Handoff**: tester verify second symptom (filename completion fallback) is gone in addition to first (no Tab completion).
