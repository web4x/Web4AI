# Task: tronMonitor.fit no-arg default — fit ALL registered teams

**Priority**: NORMAL
**Date**: 2026-06-01
**From**: TRONinterface-agent

## Current Behavior

`tronMonitor.fit <teamSession>` — requires a team name. Fits that team's panes to monitor size + tiled layout.

## Requested Behavior

`tronMonitor.fit` (no args) — iterate ALL registered teams from `hiveMind team.list`, fit each one. Keep single-team version when arg is given.

```bash
tronMonitor.fit() {
  if [ -n "$1" ]; then
    # existing: fit single team
  else
    # new: fit ALL registered teams
    for team in $(hiveMind team.list); do
      tronMonitor.fit "$team"
    done
  fi
}
```

## Acceptance Criteria

- [ ] `tronMonitor.fit` (no args) fits all registered teams
- [ ] `tronMonitor.fit ooshTeam` still works (single team)
- [ ] Tab completion unchanged
- [ ] No errors for stopped teams (skip gracefully)
