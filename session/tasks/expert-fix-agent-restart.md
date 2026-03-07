# Task: Fix agent restart chain — teams.restore, agent.bootstrap, claudeCode join
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-07
**Priority**: HIGH — computer restart pending, agents can't be restored

## Test performed
Tried to restart dead agent-trainer at baseTeam:0.0 (UUID: 564326f2-8e73-41ff-8653-2280049d8e35).

## Bugs found

### BUG-P: `teams.restore` uses raw `claude` — not on PATH in oosh bash
**File**: hiveMind line 1462
**Current**: `tmux send-keys -t "$pane_target" "claude --resume $uuid" Enter`
**Problem**: `claude` is at `$HOME/.local/bin/claude`, not on oosh bash PATH. Command fails: `bash: claude: command not found`
**Fix**: Use `claudeCode join $uuid` (which resolves `$CLAUDE_CMD` internally).
Line 1462 should become:
```bash
"$OOSH_DIR/otmux" send "$pane_target" "claudeCode join $uuid" Enter
```

### BUG-P2: `agent.bootstrap` also uses raw `claude`
**File**: hiveMind line 2213
**Current**: `otmux send.enter "$target_pane" "claude --dangerously-skip-permissions"`
**Fix**: Use `claudeCode yolo` or `"$OOSH_DIR/claudeCode" agent.start`
```bash
"$OOSH_DIR/otmux" send.enter "$target_pane" "claudeCode new"
```

### BUG-Q: Dead agents missing from teams.save snapshot
**Problem**: `teams.save` only captures panes with running Claude processes (iterates `ps` output). Dead agents like agent-trainer have registry entries + session UUIDs but no running process, so they're excluded from the snapshot.
**Impact**: After computer restart, `teams.restore` can't restore agents that were already dead.
**Fix**: `teams.save` should also include entries from roles.env + sessions.env that have no live process, marked as `(dead)`.

### BUG-R: `claudeCode join <name>` doesn't resolve role names
**Problem**: `claudeCode join agent-trainer` tries `claude --resume agent-trainer` which opens interactive picker (not a UUID match).
**Expected**: Should look up UUID from sessions.env by role name, then resume with that UUID.
**Fix**: In `claudeCode.join()`, if `$session` is not a UUID pattern, look it up in sessions.env:
```bash
# If not a UUID, try sessions.env lookup
if ! [[ "$session" =~ ^[0-9a-f]{8}-[0-9a-f]{4} ]]; then
  local ses="${HIVEMIND_SESSIONS:-${CONFIG_PATH:-$HOME/config}/hivemind.sessions.env}"
  local found_uuid
  found_uuid=$(grep "^${session}|" "$ses" 2>/dev/null | head -1 | cut -d'|' -f2)
  if [ -n "$found_uuid" ]; then
    session="$found_uuid"
  fi
fi
```

### BUG-S: `teams.restore` doesn't use OOSH wrappers
**Problem**: Uses raw `tmux send-keys`, `tmux new-session`, `tmux split-window`, `tmux select-pane` instead of otmux wrappers.
**Impact**: Breaks the OOSH-only rule. Also doesn't handle pane title setting via otmux.
**Fix**: Replace all raw tmux calls with otmux equivalents.

### BUG-T: `teams.restore` doesn't send boot prompt after resume
**Problem**: After `claude --resume`, the agent needs its boot.md sent to recover context. `teams.restore` doesn't do this.
**Fix**: After resume + sleep, send: `Read session/agents/<role>/boot.md`

## Priority order
1. **BUG-P** (fix `claude` → `claudeCode join`) — blocks all restore
2. **BUG-R** (role name lookup in `claudeCode join`) — enables `claudeCode join agent-trainer`
3. **BUG-Q** (dead agents in snapshot) — ensures full restore
4. **BUG-T** (boot prompt after restore) — ensures agents recover context
5. **BUG-P2** (agent.bootstrap raw claude) — consistency
6. **BUG-S** (raw tmux in restore) — OOSH compliance

### BUG-U: `CLAUDECODE` env var blocks restarting Claude after exit
**Problem**: When Claude exits, the shell keeps `CLAUDECODE` set. Starting a new `claude` fails: "cannot be launched inside another Claude Code session."
**Note**: `claudeCode` already handles this — line 19: `unset CLAUDECODE`. So using `claudeCode` wrapper avoids this bug entirely.

### BUG-V: Resumed exhausted session stays at 0% even after /compact and /clear
**Problem**: `--resume` of a session that hit context limit stays permanently at 0%. Neither /compact nor /clear frees space.
**Impact**: Dead agents can't be resumed if they died from context exhaustion. Must start fresh.
**Implication for teams.restore**: Need to detect exhausted sessions and start new instead of resume.

### BUG-W: `teams.restore` creates sessions with default shell (zsh), not bash
**Problem**: `tmux new-session` defaults to user's shell (zsh). OOSH needs bash. After creating the session, need to send `bash` to get OOSH on PATH before calling `claudeCode`.
**Fix**: After `tmux new-session`, send `bash` + Enter + sleep, then `claudeCode join`.

### BUG-X: `claudeCode` wrapper sets essential env vars missing from raw `claude`
**Problem**: `claudeCode` sets `FORCE_COLOR=2`, unsets `COLORTERM`, unsets `CLAUDECODE` (lines 17-19). Raw `claude` doesn't. All restart code MUST use `claudeCode`, never raw `claude`.
**Impact**: Agents started with raw `claude` have broken colors.

## Test to verify
After fixes:
1. `hiveMind teams.save` — should include dead agents
2. Kill agent-trainer: send `/exit` to baseTeam:0.0
3. `hiveMind teams.restore` — agent-trainer should resume with correct UUID
4. Verify: `hiveMind consistency.audit baseTeam` — should show consistent
5. Agent should have boot.md context
