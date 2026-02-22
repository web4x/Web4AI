# Boot: unknown (identity detection failed)
*Auto-generated 2026-02-22 19:54. Identity could not be determined.*

## You are: unknown
## Pane: unknown
## Problem: Your role was not found in the roles registry or boot files.

## Immediate actions (RECOVER IDENTITY FIRST):
1. Check your pane: `tmux display-message -p '#{session_name}:#{window_index}.#{pane_index}'`
2. Look for your context: `ls session/agents/` — find a directory matching your work
3. Check if a peer knows your role: announce "Identity detection failed at unknown"
4. Once you know your role, read `.claude/agents/<your-role>/SKILL.md`
5. Update `session/agents/<your-role>/boot.md` with correct Pane line for next compact

## Do NOT just "wait for assignment" — recover your identity first.
