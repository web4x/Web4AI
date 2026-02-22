# Done: Fix scrumMaster subscription — Block End Time Accuracy
**Agent**: oosh-expert
**Task**: expert-fix-subscription-accuracy.md (Task #49)
**Result**: PASS
**Commit**: f5b6c6b
**File**: `/Users/donges/oosh/scrumMaster` (lines 758-900)

## What was fixed

**Root cause**: ccusage derived block boundaries from log parsing (`rate-limit-cache.json` was never read). The TUI uses `~/.claude/rate-limit-cache.json` which reflects actual API rate limit headers.

### Before (ccusage only):
```
Block: 14:00-19:00 UTC (ACTIVE)
Tokens: 74394093 / 32 min remaining
Alert: OK
```

### After (rate-limit-cache primary):
```
Block: 16:00 CET — 21:00 CET (ACTIVE)
Reset: 20:00 UTC / 21:00 CET
Used: 73% of 5h block / 79 min remaining
Weekly: 69% of 7d quota (resets Tue 16:00 CET)
Tokens: 87820101 / burn 317390 tok/min
Cost: $54.18
Alert: OK
Source: rate-limit-cache
```

## Key improvements

1. **Accurate reset time** — from API rate limit headers, not log-derived
2. **Real percentage** — `session5h` field (0.68 = 68%), not projected
3. **Remaining minutes** — computed from `reset5h - now`, not ccusage estimate
4. **Weekly quota** — `weekly7d` + `reset7d` for 7-day visibility
5. **Local timezone** — shows CET/CEST alongside UTC
6. **Alert uses real time** — thresholds on actual remaining minutes
7. **Source transparency** — shows which data source + staleness warning
8. **ccusage fallback** — degrades gracefully if cache missing

## Test for tester
1. `scrumMaster subscription` — verify output matches TUI footer reset time
2. Wait for block boundary — verify "EXHAUSTED" alert when remaining_min <= 0
3. Delete rate-limit-cache.json — verify ccusage fallback works with "(may be inaccurate)" warning
4. Dashboard metrics file — verify scenario.env exports are correct
