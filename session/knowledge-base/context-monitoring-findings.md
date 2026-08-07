# Context Monitoring Data Quality — Findings

**Investigated by**: oosh-expert
**Date**: 2026-02-18
**Task**: 20260218T1250Z.expert-context-monitoring

## Key Finding

**Context % is only visible in the status bar when it's LOW.** When context is healthy, no percentage is shown.

> **★ Authoritative measure (2026-08-07; folds context-monitoring-validation.md).** The status-bar `Context low (X%)` is a **binary LOW-ALERT only** — it appears just below the wall and cannot distinguish 50% from 90% (validation: 0/5 agents showed % when healthy, 1/5 when the trainer hit 5%). **The authoritative context % at ANY level is the peer-injected `/context` Free-space header** — an agent CANNOT self-read its own context (42); a peer injects `/context` on its pane and reads the Free-space line. `context.read`/`context.velocity` are unreliable (invert near the wall). And the status bar's `Run /compact` is **Claude's UI suggestion — IGNORE it**: the only recovery is the 2-phase rewind ([[agent-rewind]]); `/compact` + `/clear` are FORBIDDEN.

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
# Binary LOW-ALERT scan only; for the real % at any level, peer-inject /context (see the Authoritative-measure note above)
otmux pane.capture <session>:$PANE 10 | grep -oE 'Context low \([0-9]+% remaining\)'
```

Returns nothing = healthy (or scrolled — use 10+ lines). Returns match = extract the number for the binary low-alert; then peer-inject `/context` for the authoritative figure.
