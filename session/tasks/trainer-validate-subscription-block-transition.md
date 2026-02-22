# Task: Validate scrumMaster subscription — Block Transition

**Priority**: HIGH — completes #49 validation
**Assigned to**: agent-trainer
**From**: product-owner

## What

Expert committed fix `f5b6c6b` for `scrumMaster subscription`. PO validated:
- Subsequent measurements are consistent (tokens increase, remaining decreases)
- Raw cache data (`~/.claude/rate-limit-cache.json`) timestamps are accurate
- Reset time matches UTC conversion

## What you need to do

Run `scrumMaster subscription` periodically and record results. **Key test: block transition at 20:00 UTC (21:00 CET).**

### Measurement schedule

1. **Now**: Run `scrumMaster subscription` — record baseline
2. **Every 15 min**: Run again, verify:
   - Remaining minutes decreased by ~15
   - Tokens increased (consistent with burn rate)
   - Alert changes: OK → WARNING at <30 min, CRITICAL at <10 min
3. **At 19:55 UTC**: Run right before block end
4. **At 20:05 UTC**: Run right after block transition — **THIS IS THE KEY TEST**

### What to check at block transition (20:00 UTC)

After 20:00 UTC, the cache should update with new values:
- `session5h` should reset to near 0 (or small %)
- `reset5h` should move to a new timestamp (next block end, ~5h later)
- Token count should drop dramatically
- "Block" line should show new time window

### How to check raw cache

```bash
cat ~/.claude/rate-limit-cache.json | python3 -m json.tool
python3 -c "import datetime; import json; d=json.load(open('$HOME/.claude/rate-limit-cache.json')); print('reset5h:', datetime.datetime.fromtimestamp(d['reset5h'], tz=datetime.timezone.utc))"
```

### Report

Write results to `session/tasks/subscription-validation-report.md`:
- Each measurement: timestamp, key values, delta from previous
- Block transition result: did values reset properly?
- Final verdict: PASS or FAIL

### Important

- Use `scrumMaster subscription` directly — it's on PATH, no prefix needed
- Don't run other heavy tasks — keep burn rate predictable for accurate validation
- If the block transition doesn't happen exactly at 20:00 UTC, keep measuring every 2 min until it does
