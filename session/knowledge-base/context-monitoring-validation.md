# Context Monitoring Validation

**By**: oosh-tester
**Date**: 2026-02-18T13:00Z
**Task**: `session/tasks/20260218T1250Z.tester-context-validation.md`

## Method

Captured 30 lines from 5 agent panes to check if context % is visible in the TUI.

## Results

| Pane | Agent | Context % Visible? | What's Shown Instead |
|------|-------|--------------------|----------------------|
| 0.1 | oosh-expert | **NO** | `12 files +20 -7` (file count) |
| 0.5 | agent-trainer | **NO** | `12 files +20 -7` (file count) |
| 1.0 | woda-writer | **PARTIAL** | `62.9k tokens` in task spinner + `2h 31m` runtime — but NO percentage |
| 1.3 | developer | **NO** | `12 files +20 -7` (file count) |
| 1.4 | script-PO | **NO** | `12 files +20 -7` (file count) |

## Findings

1. **Context % is NOT visible in any pane status bar.** The status bar shows file change counts (`12 files +20 -7`), not context usage.
2. **Token count is only visible** in the task spinner area (writer shows `62.9k tokens`), and only while a task is actively running.
3. **No percentage is shown anywhere** — neither in the status bar nor in the prompt area.
4. **SM cannot measure context % by pane capture alone.** The information simply isn't displayed in a capturable form.

## Conclusion

Context monitoring via `otmux pane.capture` is **not viable** for measuring context %. The TUI does not expose this metric in the terminal output. Alternative approaches needed:
- Claude Code CLI may have an API or command to query context usage
- The token count in task spinners is only visible during active tasks
- File counts in the status bar are NOT context indicators

## Expert Findings (Cross-Reference)

Expert published `context-monitoring-findings.md` (2026-02-18). Key finding: **context % only shows when LOW** (below ~20%). When healthy, no indicator is displayed. Pattern: `Context low (X% remaining)`.

This **explains** why none of my 5 captures showed context % — all agents were at healthy context levels. My finding "context % is not visible" was correct but incomplete. It's not that the data is never there — it only appears as a warning when context is low.

## Reconciled Conclusion

1. SM **can** detect low context via pane capture + `grep -oE 'Context low \([0-9]+% remaining\)'`
2. SM **cannot** measure healthy context levels — no data when above threshold
3. Absence of warning = healthy (inverted signal)
4. Recommended capture: 10 lines minimum per pane
5. My captures confirmed: all 5 agents were healthy (no warnings visible)
