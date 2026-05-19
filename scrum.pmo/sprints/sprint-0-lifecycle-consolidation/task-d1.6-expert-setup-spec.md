[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.6: Expert — Setup spec (accept monitor pane, start screen, idempotent)
[task:uuid:d16-setup-spec]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (current implementation audited against spec)
  - [x] creating test cases
  - [x] implementing (commits a030f68 + cd23b6e already satisfy spec — verified)
  - [x] testing (live idempotency verified)
- [x] QA Review
- [x] Done

## Spec (from Tron)
`tronMonitor setup` must:
1. Accept monitor pane param, default `TRONinterface:0.3`
2. Start GNU screen in that pane
3. One screen window per team with `tmux attach -r` (add's responsibility)
4. Idempotent

## Current implementation

```bash
tronMonitor.setup() # <?monitorPane:TRONinterface:0.3>
{
  local userProvided="${1:-}"
  local monitorPane="${userProvided:-$(private.tronMonitor.pane)}"
  local screenName=$(private.tronMonitor.screenSession)

  if [ -n "$userProvided" ]; then
    config set TRON_MONITOR_PANE "$monitorPane"
  fi

  # Check if screen is already running — idempotent
  if screen -ls "$screenName" 2>/dev/null | grep -q "$screenName"; then
    info.log "Screen session $screenName already running"
    return 0
  fi

  # Start named screen session in the monitor pane
  otmux send.raw "$monitorPane" "screen -S $screenName" Enter
  sleep 1

  [ ! -f "$TRON_MONITOR_ENV" ] && touch "$TRON_MONITOR_ENV"

  success.log "Screen session $screenName started in $monitorPane"
}
```

## Spec coverage
- ✅ Monitor pane param (positional `$1`, default via 3-tier resolution)
- ✅ Default `TRONinterface:0.3` — hardcoded fallback in `private.tronMonitor.pane`
- ✅ Starts GNU screen via `otmux send.raw` of `screen -S <name>`
- ✅ Idempotent — early return if screen already running
- Team windows are added later via `tronMonitor.add <session>` (design: setup creates
  container, add creates per-team windows). Each add uses `-r` (D1.4).
