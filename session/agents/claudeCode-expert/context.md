# claudeCode expert Agent Context
**Session**: claudeCode-expert
**Role**: claudeCode-expert
**Updated**: 2026-03-11
**State**: active — bootstrapped, script read

## Identity
| Field | Value |
|-------|-------|
| **Host** | `MacStudio.fritz.box` |
| **Pane** | `claudeCodeTeam:0.0` |
| **Session UUID** | `a552f5ac-b8bf-4032-b8db-767c5e0b26d0` |
| **Forked from** | backup-expert (backupTeam:0.0) |

## CURRENT GOAL
Awaiting first task assignment. Script fully read (1740 lines).

## Script Knowledge
- claudeCode is a 1740-line OOSH wrapper around `~/.local/bin/claude`
- Key areas: session management (join/fork/list), context monitoring (read/velocity/dashboard), agent support (process.find/session.id/recover)
- session.id uses process args → JSONL staleness check → registry fallback
- fork validates JSONL existence before calling --fork-session
- context.read tries JSONL token analysis first, falls back to TUI scraping
