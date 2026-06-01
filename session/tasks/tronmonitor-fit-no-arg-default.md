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

## Part 2: tronMonitor screen cleanup (from TRONinterface-agent)

The screen session in TRONinterface:0.3 has 22 stale entries pointing to dead tmux sessions. Tron sees nothing — the monitor is broken.

### Required:

1. **Clean tronMonitor.env** — remove entries for dead/stopped tmux sessions. Only keep live teams (robbinTeam, baseTeam, ooshTeam, web4team, TRONinterface + any actually running)
2. **Rebuild screen session** — kill stale screen windows, create fresh ones for live teams only
3. **tronMonitor.reset** — must work end-to-end: clean env → kill screen → rebuild with live teams

### Implementation:

```bash
tronMonitor.reset() {
  # 1. Read registered teams from hiveMind team.list
  # 2. Filter to only RUNNING teams (otmux has <session>)
  # 3. Rewrite tronMonitor.env with only live teams
  # 4. Kill existing screen session
  # 5. Create new screen session with one window per live team
  # 6. Each window: TMUX= tmux attach -t <team> -r
}
```

### Both tasks share the same code area — implement together.

## Acceptance Criteria

- [ ] `tronMonitor.fit` (no args) fits all registered teams
- [ ] `tronMonitor.fit ooshTeam` still works (single team)
- [ ] Tab completion unchanged
- [ ] No errors for stopped teams (skip gracefully)
- [ ] tronMonitor.env contains only live teams after reset
- [ ] Screen session in TRONinterface:0.3 shows only live teams
- [ ] `tronMonitor.reset` rebuilds from scratch — zero stale windows
- [ ] Tron can Ctrl-a 0/1/2/... to switch between live team views
