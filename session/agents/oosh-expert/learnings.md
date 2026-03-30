# OOSH Expert Learnings

## Patterns
- OOSH is on PATH — run directly, no `./`, no `cd`, no `export PATH`
- NEVER source OOSH scripts — executables, not libraries
- NEVER use `head`, `tail`, `2>/dev/null` on output — show raw
- `git rev-parse --show-toplevel` for workspace root
- Tab completion goes through `config.completion.discover`, NOT c2
- `screen -ls` returns exit 1 always — use `|| true`
- macOS `screen -X` needs full PID.name when attached from different TTY
- macOS `sed -i ''` — use temp file pattern for cross-platform
- `grep -oE` uses ERE (`{8}`), NOT BRE (`\{8\}`)
- JSONL filenames ARE session UUIDs — use `basename file .jsonl`
- Autocompacted sessions: newest unassigned JSONL in same project dir
- Forked sessions: process args show PARENT UUID — detect via `--fork-session|claudeCode fork`

## Architecture
- `private.hiveMind.agents.discover` — single source for display methods
- `private.hiveMind.session.resolve.uuid` — pure bash, forks + autocompact, write-through
- UUID priority: sessions.env → process args → JSONL filename
- otmux.send = smart send (accept-edits, prefix, verify). send.raw = bare keys
- Sender prefix `[@role pane]` in otmux.send, flows to hiveMind (DRY)
- ossh dispatchers: `ossh get config.port host` → `ossh.config.port.get host`
- tronMonitor: `screen -X stuff` for commands, `screen -X select` for switching

## Failures
- `send.enter` deleted during DRY broke PO — keep backward-compat aliases
- `ossh.get.config` collided with `ossh.get` dispatcher — made private
- `config.get` log pollution: blank echo to stdout written into config files
- `claudeCode fork` needs `--model "claude-opus-4-6[1m]"` + auto-cd to project dir
