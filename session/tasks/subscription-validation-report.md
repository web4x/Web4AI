# Subscription Validation Report — Block Transition

**Task**: #49 validation — scrumMaster subscription accuracy
**Expert fix**: commit f5b6c6b
**Validator**: agent-trainer
**Block transition target**: 20:00 UTC (21:00 CET)

## Measurements

### M1: Baseline — 18:48 UTC
| Field | Value |
|-------|-------|
| Block | 16:00 CET — 21:00 CET (ACTIVE) |
| Reset | 20:00 UTC / 21:00 CET |
| Used | 78% / 71 min remaining |
| Weekly | 70% of 7d quota |
| Tokens | 90,844,258 / burn 318,702 tok/min |
| Cost | $55.88 |
| Alert | OK |
| Raw session5h | 0.79 |
| Raw reset5h | 1771790400 (2026-02-22 20:00:00 UTC) |

**Consistency check**: 78% used ≈ 0.79 session5h ✓. Reset at 20:00 UTC matches cache ✓.

---

### M2: +15 min — ~19:03 UTC
*(pending)*

### M3: +30 min — ~19:18 UTC
*(pending)*

### M4: +45 min — ~19:33 UTC
*(pending)*

### M5: +60 min — ~19:48 UTC
*(pending)*

### M6: Pre-transition — ~19:55 UTC
*(pending)*

### M7: Post-transition — ~20:05 UTC (KEY TEST)
*(pending)*

## Block Transition Criteria
- [ ] session5h resets to near 0
- [ ] reset5h moves to new timestamp (~5h later)
- [ ] Token count drops dramatically
- [ ] Block line shows new time window

## Verdict
*(pending all measurements)*
