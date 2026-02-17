# Fix PATH for OOSH — Action Checklist

**Automated**: `hiveMind fix.path` — CMM3

## Status: PATH Already Works
OOSH is on PATH via `~/.bashrc`. No per-session export needed.

## Verify (do this, don't assume)
1. Run `which otmux` — should return `/Users/donges/oosh/otmux`
2. Run `otmux pane.capture projectTeam:1.0 5` without any export prefix — should work
3. If it works: stop prepending `export PATH=...` to every command

## Cleanup: Remove Unnecessary SKILL.md Sections
1. Coordinate with agent-trainer (pane 0.5)
2. Remove "OOSH PATH Setup (MANDATORY — run FIRST in every session)" from all 11 SKILL.md files
3. Replace with note: "OOSH is on PATH via ~/.bashrc. No export needed. Run commands directly."

## Update settings.json Patterns
1. Patterns like `Bash(otmux *)` should match now that commands are simple
2. Remove any compound-command patterns that were workarounds (e.g., `Bash(sleep * && cd *)`)
