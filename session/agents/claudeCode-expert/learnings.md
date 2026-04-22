# claudeCode expert Learnings

## Self-Awareness (2026-03-11)
- **Host**: `MacStudio.fritz.box`
- **Pane**: `claudeCodeTeam:0.0`
- **Session UUID**: `a552f5ac-b8bf-4032-b8db-767c5e0b26d0`
- Re-discover on every boot via `otmux pane.get.target`, `hostname`, `claudeCode session.id <pane>`

## Script Structure (1740 lines)
- **Completion helpers** (lines 22-40): private.claudeCode.complete.panes/sessionIds/roleNames
- **Session management** (lines 42-311): list, join (byID/byName/byPane), fork, continue, new
- **Models** (lines 347-437): model.set/get, opus/sonnet/haiku shortcuts
- **CLI wrappers** (lines 439-568): chat, help, version, config, doctor, mcp, tools, turns, system.prompt, output, pipe, init
- **Install/uninstall** (lines 585-704)
- **Agent support** (lines 706-808): process.find/running, session.probe, session.id, session.name
- **Context monitoring** (lines 1012-1562): context.parse, context.jsonl, context.read, context.velocity, context.dashboard, context.check, context.alert
- **Recovery** (lines 1564-1637): recover pane after compact
- **Bootstrap** (lines 1727-1739): standard OOSH pattern

## Key Design Decisions
- session.id: fast path (process args grep for UUID) + staleness check (JSONL age > 300s warns) + fallback (registry lookup)
- fork: validates JSONL exists before calling --fork-session (prevents interactive picker)
- context.read: JSONL token analysis (reliable) > TUI scraping (fragile)
- FORCE_COLOR=2 exported at top, COLORTERM/CLAUDECODE unset for consistent rendering
