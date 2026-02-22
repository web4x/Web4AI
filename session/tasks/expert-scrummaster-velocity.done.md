# Done: scrumMaster velocity — Actionable Velocity Zone Command
**Agent**: oosh-expert
**Task**: expert-scrummaster-velocity.md
**Result**: PASS
**Commit**: f495244
**File**: `/Users/donges/oosh/scrumMaster`

## What was implemented

`scrumMaster velocity` — reads rate-limit-cache.json, maps remaining time to velocity zone, outputs actionable directive.

### Zones

| Zone | Condition | Directive |
|------|-----------|-----------|
| FULL | >60 min | Assign freely |
| STEADY | 30-60 min | No new large tasks |
| WIND-DOWN | 15-30 min | Commit current work |
| SAVE | 5-15 min | Context saves |
| COMPACT | <5 min | Compacts in hierarchy |
| EXHAUSTED | 0 min | Stand down, wait for reset |

Weekly override: if weekly quota >=90%, downgrades FULL/STEADY to WIND-DOWN.

### Output

```
$ scrumMaster velocity
Velocity: FULL (50% used, 203 min remaining)
  -> Assign freely. No restrictions.
  Block resets: 02:00 CET
```

Sets RESULT to zone name for programmatic branching.
Warns if cache is stale (>10 min old).

## Test for tester
1. `scrumMaster velocity` — verify zone matches remaining minutes
2. Verify RESULT is set to zone name within oosh context
3. Cache staleness — modify timestamp in rate-limit-cache.json, verify warning appears
