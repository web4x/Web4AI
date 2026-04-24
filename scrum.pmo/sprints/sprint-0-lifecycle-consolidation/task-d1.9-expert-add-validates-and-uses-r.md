[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.9: Expert — add validates session exists + uses `-r`
[task:uuid:d19-add-validates-r]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (satisfied by D1.4 + validation already present)
  - [x] creating test cases
  - [x] implementing (validation already present; -r enforced in D1.4 commit e9723ff)
  - [x] testing
- [x] QA Review
- [x] Done

## Spec (from Tron)
`tronMonitor add <team>` must:
1. Validate that the target session exists in tmux before adding
2. Use `tmux attach -r` (not bare attach) for the read-only viewer

## Current implementation

```bash
tronMonitor.add() # <teamSession>
{
  local teamSession="$1"
  [ -z "$teamSession" ] && { error.log "..."; return 1; }

  # ✅ Validation — session must exist in tmux
  if ! otmux has "$teamSession" 2>/dev/null; then
    error.log "Not a live tmux session: '$teamSession' — skipping. ..."
    return 1
  fi

  # D1.6 resilience — screen auto-recovery if dead
  private.tronMonitor.screen.ensure || { error.log "..."; return 1; }

  # Check if already added (idempotent)
  local existing=$(private.tronMonitor.findWindow "$teamSession")
  [ -n "$existing" ] && { info.log "already in window $existing"; return 0; }

  local windowNum=$(private.tronMonitor.nextWindow)

  # D1.5 — make team tolerant of small read-only viewers
  tmux set-option -t "$teamSession" window-size largest 2>/dev/null

  # D1.4 — MANDATORY -r flag (read-only)
  screen -S "..." -X screen "$windowNum"
  sleep 0.5
  screen -S "..." -X select "$windowNum"
  sleep 0.3
  screen -S "..." -X stuff "TMUX= tmux attach -r -t $teamSession$(printf '\r')"
  sleep 1

  echo "${windowNum}|${teamSession}" >> "$TRON_MONITOR_ENV"
  ...
}
```

## Spec coverage
- ✅ Validates session exists via `otmux has`
- ✅ Uses `tmux attach -r` (hardened in D1.4 commit e9723ff)
- ✅ Idempotent — skips if team already has a window
- ✅ Sets `window-size=largest` (D1.5) before attach
- ✅ Self-heals screen session via `screen.ensure` (D1.6)

No additional code changes required — all requirements met by the D1.4 + D1.5 + D1.6 commit chain.

## Commit references
- `26c4fdf` — D1.7 prune (renumbered from my old D1.4)
- `a030f68` — D1.9b pane resolution (renumbered from my old D1.5)
- `cd23b6e` — D1.9c screen resilience (renumbered from my old D1.6)
- `e9723ff` — D1.4 + D1.5 attach-r + window-size largest
