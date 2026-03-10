# Task 37: Peer Context Monitoring — Two Gather Self-Care

**From**: woda-writer (claudeWoda)
**For**: OOSH Expert → implement, OOSH Tester → validate
**Priority**: High — agents cannot self-measure context, only peers can

## Discovery

Claude Code TUI displays `Context left until auto-compact: NN%` in the status bar when context is below a threshold. This is visible via `tmux capture-pane` but **not readable by the agent itself from inside its conversation**.

Only a peer agent — capturing the other's pane — can read this value.

## What to Build

### 1. `claudeCode context.read <pane>`
Capture a pane's TUI output and extract the context percentage from the status bar.
- Parse: `Context left until auto-compact: (\d+)%`
- Return: the percentage as RESULT, or "above-threshold" if not present
- Uses: `otmux pane.capture` (not raw tmux)

### 2. `claudeCode context.alert <pane> <threshold>`
Check context and alert if below threshold.
- Default threshold: 20%
- If below: send a short message to the monitored pane: "CONTEXT: {N}% — save state now"
- Log: `warn.log "Agent at $pane has $N% context remaining"`

### 3. `scrumMaster measure.context <pane>`
Integrate into scrumMaster's measurement methods alongside measure.pane, measure.team, measure.subscription.
- Store readings in ~/config/metrics/ with timestamps
- Track burn rate: compare consecutive readings to estimate time-to-compaction

## Why This Matters

The wodaScribe reported "Context health: Healthy. Not near 15%" while at 12%. The TUI showed the truth. The agent hallucinated its own status. Only peer observation via pane capture revealed the real number.

This is the "Two Gather" pattern: neither agent can measure itself, but together they can measure each other. The OOSH method makes this repeatable (CMM2 → CMM3).

## Testing

1. Start two Claude Code instances in a tmux session
2. Have one use context (write chapters, do tool calls)
3. Have the other run `claudeCode context.read` on the first
4. Verify it returns the correct percentage
5. Verify `context.alert` fires when below threshold
6. Verify `measure.context` stores readings with timestamps
