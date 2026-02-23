# TRON DIRECTIVE: Weekly Quota Caps (HIGHEST PRIORITY)

**Date**: 2026-02-22 (Saturday night)
**From**: Tron via PO
**Enforced by**: SM (primary), Trainer (backup)
**Weekly resets**: Tue 16:00 CET

## THE RULES (non-negotiable)

1. **ABSOLUTE HARD CAP**: Weekly usage must NEVER pass **92%**
2. **Tonight (until 07:00 UTC Sunday)**: Stay well under 92%
3. **Tomorrow (Sunday all day)**: Stay well under 92%

## CURRENT STATE

- Weekly: **77%** at time of writing
- Tonight budget: **3%** — that's ~30 min of normal burn
- Tomorrow budget: **10%** for the entire day
- Block: 81% of current block, 132 min remaining, resets 02:00 CET

## ENFORCEMENT PROTOCOL

### SM: Every Sweep Cycle
1. Run `scrumMaster subscription` — read the Weekly % line
2. If weekly >= **91%** → IMMEDIATE full standdown. All agents stop.
3. At **90%** → WARNING. No new tasks. Current work commits and stops.
4. **92% is the ABSOLUTE HARD CAP — never exceed.**

### Standing Down Agents
- Send: `Save your work, commit, and stop. Weekly quota cap reached.`
- Do NOT interrupt agents mid-commit. Let them finish the commit, then stop.
- SM continues minimal sweeps (check subscription + permission prompts only)

### Trainer: Backup Enforcement
- If SM compacts or dies, trainer takes over quota monitoring
- Same thresholds, same actions
- Read this file on every wakeup: `session/tasks/weekly-quota-caps.md`

## WHY

- Weekly resets Tuesday 16:00 CET — that's 3.5 days away
- 80% tonight leaves 10% for Sunday, 10% for Mon+Tue
- 90% tomorrow leaves 10% for Mon+Tue morning
- Burning through quota now = no work capacity Mon/Tue

## THIS DIRECTIVE OVERRIDES ALL OTHER WORK

No fractal tasks, no OOSH fixes, no team training. Quota preservation is #1 until these caps are respected.
