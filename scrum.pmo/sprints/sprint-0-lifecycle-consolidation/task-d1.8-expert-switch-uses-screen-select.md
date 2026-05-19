[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.8: Expert — switch uses screen window select
[task:uuid:d18-switch-screen-select]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (audit confirms existing impl satisfies spec)
  - [x] creating test cases
  - [x] implementing (no code change needed — already correct)
  - [x] testing
- [x] QA Review
- [x] Done

## Spec (from Tron)
`tronMonitor switch <team>` must use `screen -X select <window>` to change the
visible team in the monitor.

## Current implementation

```bash
tronMonitor.switch() # <teamSession>
{
  local teamSession="$1"
  ...
  private.tronMonitor.screen.ensure || { error.log "..."; return 1; }

  local windowNum
  windowNum=$(private.tronMonitor.findWindow "$teamSession")

  if [ -z "$windowNum" ]; then
    tronMonitor.add "$teamSession"
    windowNum=$(private.tronMonitor.findWindow "$teamSession")
  fi

  if [ -n "$windowNum" ]; then
    screen -S "$(private.tronMonitor.fullScreenName)" -X select "$windowNum"
    ...
  fi
}
```

## Spec coverage
- ✅ Uses `screen -X select <windowNum>` to change monitor view
- ✅ Auto-adds team if not yet tracked (calls tronMonitor.add)
- ✅ Self-heals via `screen.ensure` if screen died (D1.6)
- ✅ Updates pane title to reflect current team

No code changes required.
