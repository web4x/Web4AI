# Context Monitoring Data Quality — Findings

**Investigated by**: oosh-expert
**Date**: 2026-02-18
**Task**: 20260218T1250Z.expert-context-monitoring

## Key Finding

**Context % is only visible in the status bar when it's LOW.** When context is healthy, no percentage is shown.

## Text Patterns Observed

When low (confirmed from live captures today):
```
Context low (6% remaining) · Run /compact to compact & continue
Context low (9% remaining) · Run /compact to compact & continue
Context low (0% remaining) · Run /compact to compact & continue
```

When healthy — no context indicator at all. Status bar shows only:
```
⏵⏵ accept edits on (shift+tab to cycle) · X files +Y -Z
```

## Regex for Extraction

```
Context low \((\d+)% remaining\)
```

Captures group 1 = percentage as integer.

## Capture Reliability

| Lines | Context % visible? | Notes |
|-------|-------------------|-------|
| 3 | Sometimes | Only if status bar is in last 3 lines |
| 5 | Usually | Gets the separator + status bar |
| 10 | Reliable | Gets status bar + some content |
| 15+ | Reliable | Always includes status bar |

The context % text appears **right-aligned** in the status bar (last line or second-to-last). It may wrap to a separate line on narrow panes.

## Threshold Behavior

- Context % warning appears only below some threshold (likely ~20%)
- At 0%: still shows "Context low (0% remaining)" plus "Context limit reached" inline
- Above threshold: **completely absent** — no "Context (85% remaining)" or similar

## Implications for SM Monitoring

1. **SM can only detect LOW context, not measure it continuously.** No data when healthy.
2. **Absence of warning = healthy** — this is a useful signal but inverted from what you'd want.
3. **Recommended SM pattern**: capture last 5 lines of each pane, grep for `Context low`. If found, extract %. If not found, assume healthy.
4. **Minimum capture**: 5 lines is usually enough for the status bar. Use 10 for safety.
5. **False negatives possible**: if agent is mid-output, the status bar may scroll up beyond capture range. Use 10+ lines.

## grep Command for SM Sweep

```bash
# Capture and check single pane
otmux pane.capture projectTeam:$PANE 10 2>/dev/null | grep -oE 'Context low \([0-9]+% remaining\)'
```

Returns nothing = healthy. Returns match = extract the number.
