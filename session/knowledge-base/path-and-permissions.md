# Root Cause: PATH and Permissions — Details

## The Problem Chain
1. OOSH tools live in `/Users/donges/oosh/` — not on PATH
2. Agents must `cd /Users/donges/oosh && ./otmux send ...` to invoke them
3. `cd` + `&&` + `./` = compound command
4. Compound commands don't match simple patterns in `settings.json` (e.g., `Bash(otmux *)`)
5. Unmatched commands trigger permission prompts
6. Permission prompts block agents until a human or peer sends approval

## The Fix
Add `/Users/donges/oosh` to PATH in shell profile. Then:
- `otmux send projectTeam:0.3 Enter` — simple, matchable, auto-approvable
- No `cd`, no `./`, no `&&`

## settings.json Pattern Matching
Claude Code's `settings.json` allows patterns like `Bash(otmux *)`. These only match when the command starts with the tool name directly. Prefixing with `cd /path &&` breaks the match.

## Source
- Ch9: "The Root Cause" — Tron's insight after watching 33 sweeps fail
- Ch3-8: Permission economy symptoms

## Action Checklists
-> [fix-path.md](actions/fix-path.md)
