# Root Cause: PATH and Permissions — Details

## The Discovery
OOSH is **already on PATH** via `~/.bashrc`. The `export PATH=...` prefix that all agents prepended to every Bash call was completely unnecessary. Commands work directly:

```bash
# This works — no export needed:
otmux pane.capture projectTeam:0.3 10
hiveMind team.status projectTeam

# This was done hundreds of times for nothing:
export PATH="/Users/donges/oosh:..." && otmux pane.capture projectTeam:0.3 10
```

## Why Agents Did It Anyway
1. SKILL.md files contained a "MANDATORY — run FIRST in every session" PATH export section
2. Every agent copied the pattern without testing whether it was needed
3. Nobody ran `which otmux` to check — classic ASSUME failure (#10, #12 in learnings)

## The Real Permission Problem
Compound commands (`cd /path && ./cmd`) don't match simple settings.json patterns.
But the compound prefix was self-inflicted — OOSH was on PATH the entire time.
The permission economy was partly caused by agents making simple commands complex.

## settings.json Pattern Matching
Claude Code's `settings.json` allows patterns like `Bash(otmux *)`. These only match when the command starts with the tool name directly. The unnecessary `export PATH=... &&` prefix broke the match.

## Source
- Ch9: "The Root Cause" — Tron's insight
- Writer discovery: `which otmux` returns `/Users/donges/oosh/otmux` without any export

## SKILL.md Fix Needed
The "OOSH PATH Setup (MANDATORY)" section in all 11 SKILL.md files is wrong. Coordinate with agent-trainer to remove it.

## Action Checklists
-> [fix-path.md](actions/fix-path.md)
