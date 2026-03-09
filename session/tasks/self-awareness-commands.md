# Self-Awareness: Know Your Pane and Session ID

## What
Two OOSH commands let you discover your own identity in the tmux environment.

## Commands

```bash
# 1. Find your pane address
otmux pane.get.target
# Returns e.g.: backupTeam:0.0

# 2. Find your Claude Code session UUID
claudeCode session.id <your-pane>
# e.g.: claudeCode session.id backupTeam:0.0
# Returns e.g.: d45f08a4-fdcf-42e9-afc5-e1f8ba874f4f
```

## Action
1. Run both commands now to learn your identity
2. Add a "Self-Awareness" section to your SKILL.md (`.claude/agents/backup-expert/SKILL.md`) with these commands and a note to run them on every boot
3. Add the results to your learnings.md

## Why
- Knowing your pane address lets you verify which pane you're in
- Session ID is your unique Claude Code identity
- Both change on restart/compact — must re-discover on every boot
