# PO Overnight Protocol — Until 07:00 UTC (8 AM Berlin)

**Self-reference**: Read this after every wakeup/compact.

## Wakeup Cycle

1. Wake every 30 min (others wake you if timer fails)
2. On each wakeup:
   - `scrumMaster subscription` — block status
   - `hiveMind monitor agent-trainer 15` — trainer alive?
   - `hiveMind monitor scrum-master 15` — SM sweeping?
   - Read any status messages from SM/trainer
   - If all healthy → set next 30-min wakeup
   - If problem → act per velocity zones

## Oversight Schedule

- **First 2 hours (until 22:00 UTC)**: Check every 15 min (frequent oversight per Tron)
- **After 22:00 UTC**: Every 30 min
- **Block transitions**: Extra check when subscription shows EXHAUSTED/new block

## What's Running

- odockerTeam: lifecycle methods (disk, prune, build.all, status)
- SM: velocity management (trained by trainer)
- Trainer: compact lifecycle, learnings, SM coaching
- Expert/tester: available for odockerTeam overflow or issues

## Self-Care

- Save context at 35%
- Write boot.md before compact
- Ask trainer to manage your compact if needed
