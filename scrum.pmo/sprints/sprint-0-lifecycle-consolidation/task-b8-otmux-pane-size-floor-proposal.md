# Task B8 (PROPOSAL) — otmux pane size floor: prevent 0×0 collapse

**Status:** Proposal awaiting PO approval (no code shipped yet)
**Author:** oosh-expert
**Date:** 2026-04-21

## Problem

When **no tmux client is attached** to a session, panes collapse — `tmux list-panes`
reports them at `1x1` (effectively 0×0). Live evidence:

```
UpDown_ai_po:0.0       1x1
UpDown_ai_projectTeam:0.0  1x1
backupTeam:0.0,0.1,0.2  1x1, 1x1, 3x1
baseTeam:0.0,0.1,0.2    1x1, 1x1, 3x1
TRONinterface:0.0..0.3  1x1, 1x1, 1x1, 1x3
```

Only sessions with a currently-attached client (e.g. `ooshTeam`) show real sizes
(`200x49`). The collapse happens because `window-size = largest` (B4.2) means
"use the largest attached client" — with **no** clients, tmux has nothing to
size against and the windows stay at the minimum.

**Impact:** background agents in unattached sessions cannot render their TUI —
output truncates, prompts wrap unreadably, restored sessions look broken until
the user attaches a client. This blocks teams.save / teams.restore and any
"agent works in the background while I'm elsewhere" workflow.

## Proposed solution

Add **size-floor** methods to otmux: enforce a minimum size (default 80×40) on
collapsed panes, lockable so subsequent client attaches don't shrink them, and
unlockable to restore dynamic sizing.

### Mechanism

tmux has 4 `window-size` modes:
- `largest` — match largest attached client (current default; collapses with no clients)
- `smallest` — match smallest attached client (default before tmux 2.9)
- `manual` — fixed size, set explicitly via `resize-window -x W -y H`
- `latest` — match most-recently-active client

`manual` mode is the lock: once set, the window stays at the explicit size
regardless of client attach/detach. To unlock = revert to `largest`.

### Proposed methods

```bash
otmux.window.size.lock <?session> <?width:80> <?height:40>
  # For each window in session (or ALL sessions if omitted):
  #   1. setw -t <session>:<win> window-size manual
  #   2. resize-window -t <session>:<win> -x W -y H
  # Persist to ~/config/otmux.size.locks.env: session:win|W|H|epoch

otmux.window.size.unlock <?session>
  # For each locked window:
  #   1. setw -t <session>:<win> window-size largest
  # Remove from persistence file.

otmux.window.size.status
  # Tabular: SESSION | WINDOW | SIZE | LOCKED | clients
  # Color: red = collapsed (<80×40), yellow = locked, green = healthy

otmux.window.size.floor.apply <?width:80> <?height:40>
  # Sweep: find every window with <W or <H, lock at W×H.
  # Idempotent — already-floored windows skipped.
  # Use case: cron-style "fix collapsed sessions" sweep.
```

### Persistence file format

`~/config/otmux.size.locks.env` (one line per locked window):

```
ooshTeam:0|80|40|1747834800
backupTeam:0|80|40|1747835100
```

- `epoch` lets us age out stale locks (e.g. session no longer exists)
- Cleanup on `otmux.window.size.status` if session/window gone

### Hook points

1. **`teams.restore`** could call `window.size.lock` after restoring a session
   that has no attached client — guarantees the restored team is renderable.
2. **`hiveMind.team.setup.full`** could lock new team sessions at 80×40 if the
   creating client is small (avoid initial collapse for headless team creation).
3. **Periodic** — SM could optionally call `floor.apply` every N minutes as a
   self-healing sweep. (Discuss with SM before adding to its monitor cycle.)

### Lock semantics — when does it auto-unlock?

Two options for PO to choose:

**Option A — explicit unlock only (proposed):**
- Lock persists until `otmux.window.size.unlock` is called.
- Pro: predictable; user owns the dynamic-resize decision.
- Con: a real client attach won't grow the window unless user unlocks.

**Option B — auto-unlock on first real-client attach:**
- Once a client of size ≥ floor attaches, switch back to `largest`.
- Requires hook on `client-attached` event (tmux 3.0+) or polling.
- Pro: feels magical, "just works".
- Con: hidden state change; harder to debug; couples lock to attach events.

**Recommendation: Option A.** Simpler, predictable, follows OOSH first-principles
(explicit > implicit). User unlocks with one command when they want dynamic
sizing back. Could revisit Option B later if pain emerges.

### tmux version requirements

- `window-size` option: tmux 2.9+
- `resize-window` (interactive flag): tmux 2.9+
- We're on tmux 3.6a — fully supported. No fallback needed.

## Out of scope

- **Per-pane minimums.** Pane sizes are derived from window size and layout.
  This proposal locks the WINDOW; pane sizes follow the layout. If a window is
  80×40 with 4 evenly-tiled panes, each pane is 40×20 — that's a layout
  concern, not a size-floor concern. (We could add `pane.size.lock` later if
  needed.)
- **Cross-machine restore size.** When `teams.restore` brings up a team on a
  different machine, the saved window dimensions might not match the new screen.
  Locking at the saved size could cut off content. The floor (80×40) is
  conservative — won't over-stretch.
- **Active client preferences.** If a user is actively working with their own
  larger window, locking at 80×40 would shrink them. Lock should NOT apply to
  windows currently showing as larger than the floor. (Implementation: only
  apply lock if current size < floor.)

## Test handoff (for B8.3 tester)

- `T-FLOOR-1` — Detect: capture a session with no clients, verify panes at 1x1
- `T-FLOOR-2` — Apply: `window.size.floor.apply 80 40`, verify panes ≥ 80×40
- `T-FLOOR-3` — Lock persists: detach all clients, panes still 80×40
- `T-FLOOR-4` — Unlock: `window.size.unlock <session>`, panes free to dynamic
- `T-FLOOR-5` — Idempotent: apply twice, no duplicate persistence entries
- `T-FLOOR-6` — Floor not over-applied: window already 200×49 not shrunk
- `T-FLOOR-7` — Status: `window.size.status` shows all windows + lock state

## Implementation estimate

- 4 new methods in otmux: ~80 lines
- Persistence helpers (private.otmux.size.lock.{set,remove,list}): ~30 lines
- Status formatter: ~30 lines
- One commit, one task file
- ~150 lines, ~1 hour with tests scaffold for tester

## Open questions for PO

1. **Approve Option A** (explicit unlock only)? Or prefer Option B (auto-unlock
   on first real attach)?
2. **Floor default 80×40** OK? (`default-size` in tmux is `80×24`. Choosing 80×40
   gives more vertical room for agent TUIs which use ~30 lines for chat.)
3. **Hook into `teams.restore`** automatically, or keep it as a separate manual
   call? Recommend automatic — restore guarantees usable state.
4. **Persistence path** — `~/config/otmux.size.locks.env` follow existing OOSH
   convention. OK?
5. **Naming** — `window.size.lock` / `unlock` / `status` / `floor.apply`. OK or
   prefer different verb hierarchy? Considered alternatives:
   - `pane.size.*` (misleading — operates on windows)
   - `size.lock/unlock` (too generic, conflicts with future shape methods)
   - `window.lock 80x40` (compact but combines two args into one parsed string)

## Next steps after PO approval

1. Implement methods in `/Users/donges/oosh/otmux`
2. Wire optional hook in `hiveMind.teams.restore` if Q3 = automatic
3. Update `otmux.usage` documentation
4. One-line commit `otmux window.size.lock/unlock/floor.apply (ref: task-b8-otmux-pane-size-floor.md)`
5. Hand off T-FLOOR-1..7 to tester (B8.3)
