# Subscription Accuracy — Token Reset & Block Boundaries

*KB #24 — 2026-02-22, product-owner + oosh-expert*

## Problem

`scrumMaster subscription` showed wrong block end times. The SM uses this for velocity management — wrong reset time = blind pacing. The TUI footer is the ground truth but only visible to Tron.

**Root cause**: ccusage derived block boundaries from log parsing. The TUI reads `~/.claude/rate-limit-cache.json` which reflects actual API rate limit headers. These are different data sources with different accuracy.

## Fix (f5b6c6b)

Expert rewrote `scrumMaster.subscription()` (lines 758-900) to read `rate-limit-cache.json` as primary source, ccusage as enrichment only.

### rate-limit-cache.json structure

```json
{
    "session5h": 0.78,       // % of 5h block used (0.0-1.0)
    "weekly7d": 0.70,        // % of 7d quota used (0.0-1.0)
    "reset5h": 1771790400,   // Unix timestamp: when 5h block ends
    "reset7d": 1771945200,   // Unix timestamp: when weekly quota resets
    "timestamp": 1771785822758  // ms: when cache was last written
}
```

- `reset5h` converts to actual UTC time — this matches TUI footer
- `session5h` is the real percentage — not projected/estimated
- Remaining minutes = `reset5h - now` — accurate to the second
- ccusage adds: token counts, cost, model names, burn rate

### Output format (after fix)

```
Subscription Status:
  Block: 16:00 CET — 21:00 CET (ACTIVE)
  Reset: 20:00 UTC / 21:00 CET
  Used: 78% of 5h block / 73 min remaining
  Weekly: 70% of 7d quota (resets Tue 16:00 CET)
  Tokens: 89875544 / burn 318180 tok/min
  Cost: $55.34
  Alert: OK
  Source: rate-limit-cache
```

## Validation Method

To verify subscription accuracy, take sequential measurements:

1. **Consistency**: Run twice, 1 min apart. Tokens increase, remaining decreases, % stable or +1
2. **Time accuracy**: Compare `remaining min` to `reset5h - now`. Should be within 1 min
3. **Raw cache**: `cat ~/.claude/rate-limit-cache.json | python3 -m json.tool`
4. **Timestamp conversion**: `python3 -c "import datetime; print(datetime.datetime.fromtimestamp(EPOCH, tz=datetime.timezone.utc))"`
5. **Block transition**: Measure before and after block end. `session5h` should reset, `reset5h` should advance

## Calibration Data (2026-02-22)

| Time (UTC) | Used % | Remaining | Tokens | Burn rate | Consistent? |
|------------|--------|-----------|--------|-----------|-------------|
| 18:46 | 78% | 73 min | 89,875,544 | 318,180/min | Baseline |
| 18:47 | 78% | 72 min | 90,027,645 | 317,949/min | Yes: -1 min, +152K tok |
| 18:51 | 79% | 68 min | 91,607,665 | 320,353/min | Yes: -5 min, +1.7M tok |

Block end 20:00 UTC vs "73 min remaining" at 18:46 = 74 min actual → 1 min off. Acceptable.

## Alert Thresholds

- `OK`: >30 min remaining
- `WARNING`: 10-30 min remaining
- `CRITICAL`: <10 min remaining
- `EXHAUSTED`: remaining <= 0

## Key Insight

**Never trust ccusage for timing.** It derives boundaries from logs — subject to stale data and shifting times. The rate-limit-cache.json is written by Claude Code itself from actual API rate limit headers. Same source as TUI = ground truth.
