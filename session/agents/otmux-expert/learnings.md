# otmux expert Learnings

## Self-Awareness (2026-03-11)
- **Host**: `MacStudio.fritz.box`
- **Pane**: `otmuxTeam:0.0`
- **Session UUID**: `a552f5ac-b8bf-4032-b8db-767c5e0b26d0`
- Re-discover on every boot via `otmux pane.get.target`, `hostname`, `claudeCode session.id <pane>`

## Script Structure — otmux
- `/Users/donges/oosh/otmux` — 2267+ lines, ~120 public methods
- Uses `TMUX_CMD="tmux -u"` for all tmux operations (UTF-8 mode)
- `pane.get.target` (line 1676) uses `$TMUX_PANE` env var — reliable self-identification
- `tree` (line 1175): 2-level display: session → pane (address/title/cmd), detects Claude version
- `tree.detailed` (line 1268): 3-level: session → pane → agent (role@model/session ID)
- Ghost detection (lines 1340-1358): title looks like role but no Claude process → ⚠ DEAD
- `pane.list` (line 1650): tab-separated session:window.pane format with titles
- `send` (line 928): resolves direction targets (U/D/L/R) via private.resolve.target

## claudeCode Integration Points
- `process.find` (line 710): finds Claude PID by TTY match — used by tree to detect Claude
- `session.id` (line 757): extracts UUID from --resume process arg, staleness check if JSONL >300s old
- `session.name` (line 810): customTitle from sessions-index.json → JSONL custom-title → firstPrompt
- `session.probe` (line 734): ground truth via /status TUI capture (slow ~3s)
- tree.detailed calls all of these per pane to build agent identity layer

## Forked from backup-expert
- Inherited backup-expert context (38/38 tests, strategy dispatch, config lifecycle)
- New identity: otmux-expert, new scope: `/Users/donges/oosh/otmux`
- Successfully completed full TDD cycle as backup-expert before role switch
