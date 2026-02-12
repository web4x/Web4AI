# Trainer Task: Remove Unnecessary PATH Export from SKILL.md Files

## Background
OOSH is already on PATH via `~/.bashrc`. Every agent has been needlessly prepending `export PATH="/Users/donges/oosh:..."` before every command. This wastes tokens and triggers extra permission prompts.

## Task
1. Find ALL `.claude/agents/*/SKILL.md` files that contain `export PATH=` instructions
2. Remove the export PATH instructions — commands like `otmux`, `hiveMind` work directly
3. Update any examples that use `cd /Users/donges/oosh && ./` pattern to use direct commands
4. Commit each agent's changes separately

## Correct Pattern
```bash
# WRONG (old)
export PATH="/Users/donges/oosh:/Users/donges/oosh/otmux:/Users/donges/oosh/hiveMind:/Users/donges/oosh/ng:$PATH"
otmux pane.capture projectTeam:0.3 10

# RIGHT (new)
otmux pane.capture projectTeam:0.3 10
```

## Source
Discovered by scribe — documented in session/knowledge-base/ topic 10.
