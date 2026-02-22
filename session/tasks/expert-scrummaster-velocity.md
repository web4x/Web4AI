# Task: scrumMaster velocity — Actionable Velocity Zone Command

**Priority**: HIGH — completes subscription accuracy chain
**Assigned to**: oosh-expert
**From**: product-owner

## Problem

`scrumMaster subscription` now gives accurate data (commit f5b6c6b), but SM must manually interpret the numbers every cycle and decide what action to take. The velocity zones (>60 min, 30-60, 15-30, 5-15, <5) are documented in training files but not codified.

SM needs a single command that reads the subscription state and returns the **actionable directive** — not raw numbers.

## Implement: `scrumMaster velocity`

### Method: `scrumMaster velocity <?session>`

Reads rate-limit-cache.json (same source as subscription), determines the velocity zone, and outputs a single actionable directive.

### Output format

```
Velocity: FULL (68% used, 79 min remaining)
  → Assign freely. No restrictions.

Velocity: STEADY (78% used, 42 min remaining)
  → No new large tasks. Current work continues.

Velocity: WIND-DOWN (88% used, 22 min remaining)
  → Agents commit current work NOW. No new assignments.

Velocity: SAVE (94% used, 9 min remaining)
  → Trigger context saves. Prepare for compacts.

Velocity: COMPACT (98% used, 3 min remaining)
  → Compact in hierarchy order: SM → orchestrator → workers.

Velocity: EXHAUSTED (block ended)
  → Standing down. Next block in ~5-7 min. Run subscription to confirm.
```

### Zones (from MEMORY.md / KB)

| Zone | Condition | Directive |
|------|-----------|-----------|
| FULL | >60 min remaining | Assign freely |
| STEADY | 30-60 min remaining | No new large tasks |
| WIND-DOWN | 15-30 min remaining | Commit current work |
| SAVE | 5-15 min remaining | Context saves |
| COMPACT | <5 min remaining | Compacts in hierarchy |
| EXHAUSTED | 0 min / block ended | Stand down, wait for reset |

### Also check weekly quota

If weekly quota >90%, override to WIND-DOWN regardless of 5h block state.

### Return value

Set `RESULT` to the zone name (FULL/STEADY/WIND-DOWN/SAVE/COMPACT/EXHAUSTED) so SM can branch on it programmatically:

```bash
scrumMaster velocity
if [ "$RESULT" = "COMPACT" ]; then
  # trigger compact sequence
fi
```

### Completions

No parameters needed (optional session arg defaults to current).

## Files

- `/Users/donges/oosh/scrumMaster` — add method near subscription (line ~900)
- Reuse rate-limit-cache.json reading logic from subscription

## Test

```bash
scrumMaster velocity        # should show current zone
echo "$RESULT"              # should be zone name (FULL, STEADY, etc.)
```
