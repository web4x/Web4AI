[Back to Sprint 0](./planning.md)

# Task D1.10: Expert — tronMonitor matches proven Tron recipe
[task:uuid:d110-proven-recipe]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (recipe received from PO, verified by Tron)
  - [x] creating test cases (end-to-end requires bash-prompt state on pane 0.3)
  - [x] implementing (commit 0f9330b)
  - [x] testing (static code shape verified; live end-to-end blocked on pane state)
- [x] QA Review
- [x] Done

## PO spec
Implement exactly the Tron-verified recipe:

> CRITICAL RULES:
> 1. `TMUX=` prefix MANDATORY (unsets env, allows nesting)
> 2. `-r` flag MANDATORY (read-only, prevents layout destruction)
> 3. `exec bash` at end keeps window alive
>
> Methods to implement:
> - `setup <?pane>` — kill old screen, create new 'tronMon' with all registered teams via
>   `screen -S tronMon -X screen -t <team> bash -c "TMUX= tmux attach -r -t <team>; exec bash"`
> - `switch <team>` — Ctrl-A select window by name
> - `add <team>` — add screen window
> - `remove <team>` — kill screen window
> - `list` — show screen windows
> - `prune` — remove windows for dead tmux sessions

## Deliverable — commit `0f9330b`

### setup (destructive reset)
```bash
# 1. Kill existing tronMon if alive
# 2. Clear env tracking
# 3. Start fresh `screen -S tronMon` in monitor pane
# 4. Iterate hivemind.teams.env — for each LIVE team, call add
```

### add (canonical recipe)
```bash
screen -S tronMon -X screen -t "$teamSession" \
  bash -c "TMUX= tmux attach -r -t $teamSession; exec bash"
```
Window is NAMED by team (via `-t` on screen's `screen` command). Command is
inline — no more separate create → select → stuff sequence. Idempotent —
skip if team already tracked.

### switch (by name)
```bash
screen -S tronMon -X select "$teamSession"
```
Select command accepts window name OR index; name is unambiguous.

### remove (by name, atomic)
```bash
screen -S tronMon -p "$teamSession" -X kill
```
Target by window name (D1.10). Falls back to numeric index if env entry is
legacy format (backward compat).

### list / prune
Unchanged — they work against env tracking file, agnostic to naming scheme.

## Key architecture change — no auto-recovery in workflow paths

Removed `private.tronMonitor.screen.ensure` from `add` and `switch`. That
was the recursion hazard behind the SM-reported agent.monitor segfault
(mitigated defensively in f5bc1b8). New behavior: if screen died,
add/switch fail fast with `"run 'tronMonitor setup' first"` instead of
silently restarting the whole screen + re-adding all teams.

Rationale: explicit user-initiated reset (via `setup`) is the proven
model per PO. Agents should not self-heal tronMonitor state during
agent.monitor / send workflows.

## Live test caveat

End-to-end test requires the monitor pane (default `TRONinterface:0.3`)
to be at a BASH PROMPT when setup runs — not inside a nested tmux or
Claude Code TUI. On the live host, pane 0.3 was found attached to a
web4team nested tmux, so the `screen -S tronMon` command was typed into
the nested session rather than starting a new screen process.

For first test after D1.10 lands, user must either:
1. Manually detach pane 0.3 from whatever it's attached to (Ctrl-B d for
   nested tmux; Ctrl-A then `:quit` for screen); OR
2. Pass a known-bash pane as argument: `tronMonitor setup <some-bash-pane>`.

Subsequent setups are self-contained — they kill the tronMon screen and
the pane becomes bash automatically.

## Related commits
- `0f9330b` — D1.10 proven recipe implementation (this)
- `f5bc1b8` — agent.monitor timeout mitigation (complementary)
- `cd23b6e` — D1.6 screen.ensure (removed from workflow paths here)
