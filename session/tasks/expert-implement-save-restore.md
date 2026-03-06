# Task: Implement hiveMind teams.save and supporting methods
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-06
**Priority**: URGENT — needed before computer restart, all tmux sessions will be lost

---

## Situation

Computer restart imminent. All tmux sessions will vanish. No way to save or restore agent state. `process.lookup` has the data in `ps --resume` args but doesn't extract it. 7 out of 10 Claude instances show no UUID.

## Order of Implementation

### 1. Fix `process.lookup` / `process.list` to extract UUID from `ps --resume` args (GAP-4)

The UUID is RIGHT THERE in `ps -p <pid> -o args=` as `--resume <uuid>`. But `process.lookup` only gets UUID via `live.discover` → `sessions-index.json`, which misses most agents.

**Fix**: In `process.lookup`, after getting the PID, extract UUID from ps args:
```bash
local resume_uuid
resume_uuid=$(ps -p "$pid" -o args= 2>/dev/null | sed -n 's/.*--resume \([^ ]*\).*/\1/p')
```
Use this as primary UUID source. Fall back to `live.discover` only if empty.

Same fix needed in `process.list` — it should show UUID for every Claude process, not just the ones in sessions-index.json.

### 2. Implement `hiveMind teams.save` (GAP-1)

Save everything needed to restore all teams after restart. Output file: `~/config/hivemind.snapshot.<timestamp>.env`

What to save per Claude instance:
- Session name (tmux session)
- Pane address (window.pane)
- Role (from registry or live.discover)
- UUID (from `ps --resume` args — needs fix #1 above)
- Pane title

Format (one line per pane, pipe-separated):
```
session|window.pane|role|uuid|title
hiveMindTeam02_03_26|0.0|hiveMind-expert|75ce660f-ecca-4e48-8ffe-53f7e774a0a8|hiveMind-expert@opus
hiveMindTeam02_03_26|0.1|hiveMind-tester|004e5ea9-6ed5-4c20-bc9e-7db38677b14b|hiveMind-tester@opus
projectTeam|0.3|oosh-expert|<uuid-from-ps>|oosh-expert
projectTeam|0.5|scrum-master|<uuid-from-ps>|scrum-master
```

Implementation:
```bash
hiveMind.teams.save() {
  local outfile="${CONFIG_PATH:-$HOME/config}/hivemind.snapshot.$(date +%Y%m%dT%H%M%S).env"
  # For each tmux session with Claude processes:
  #   For each pane with a Claude process:
  #     Get role from registry or live.discover
  #     Get UUID from ps --resume args
  #     Get title from tmux
  #     Write line to outfile
  echo "Saved to $outfile"
}
```

Should iterate ALL sessions, not just registered ones. Use `process.list` output (after fix #1) as the data source.

### 3. Implement `hiveMind team.activate <session>` (GAP-5 / BUG-J)

Simple — write session name to `~/config/hivemind.active.team`. Also register in `teams.env` if not present.

```bash
hiveMind.team.activate() {
  local session="$1"
  [ -z "$session" ] && error.log "Usage: hiveMind team.activate <session>" && return 1
  tmux has-session -t "$session" 2>/dev/null || { error.log "Session '$session' not found"; return 1; }
  echo "$session" > "$HIVEMIND_ACTIVE_TEAM_FILE"
  # Also ensure it's in teams.env
  grep -q "^${session}|" "$HIVEMIND_TEAMS" 2>/dev/null || echo "${session}|" >> "$HIVEMIND_TEAMS"
  echo "Active team: $session"
}
```

### 4. Implement `hiveMind registry.set` / `registry.remove` (BUG-F)

Make public wrappers for the existing private methods:

```bash
hiveMind.registry.set() {
  local target="$1" role="$2"
  [ -z "$target" ] || [ -z "$role" ] && error.log "Usage: hiveMind registry.set <pane> <role>" && return 1
  private.hiveMind.registry.set "$target" "$role"
}

hiveMind.registry.remove() {
  local target="$1"
  [ -z "$target" ] && error.log "Usage: hiveMind registry.remove <pane>" && return 1
  local reg="$HIVEMIND_REGISTRY"
  grep -v "^${target}|" "$reg" > "${reg}.tmp" && mv "${reg}.tmp" "$reg"
  echo "Removed $target from registry"
}
```

### 5. Implement `hiveMind teams.restore` (GAP-2)

Read snapshot file, recreate tmux sessions and resume Claude instances:

```bash
hiveMind.teams.restore() {
  local snapfile="$1"
  [ -z "$snapfile" ] && { # find latest snapshot
    snapfile=$(ls -t ${CONFIG_PATH:-$HOME/config}/hivemind.snapshot.*.env 2>/dev/null | head -1)
  }
  [ -z "$snapfile" ] && error.log "No snapshot found" && return 1
  # For each unique session in snapshot:
  #   Create tmux session if not exists
  #   Split panes to match layout
  #   For each pane with a UUID:
  #     Start claude --resume <uuid> in that pane
  #   Set registry entries
  #   Set pane titles
}
```

This is the most complex one — start with a version that just lists what WOULD be restored, then add actual restore.

### 6. Fix `registry.refresh` `-a` → `-s` (BUG-D)

Line 1668: change `tmux list-panes -t "$session" -a` to `tmux list-panes -t "$session" -s`. One character fix. Unblocks automated reconciliation without disrupting all sessions.

---

## Implementation Order

```
#1 (process.lookup UUID extraction) ← everything else depends on this
  ↓
#2 (teams.save) ← URGENT, needed before restart
  ↓
#3 (team.activate) ← quick win, standalone
#4 (registry.set/remove) ← quick win, standalone
#6 (registry.refresh -a→-s) ← one char fix, standalone
  ↓
#5 (teams.restore) ← needs #1 and #2 done first
```

**#1 and #2 are blocking the restart.** Please implement those first so we can save state.
