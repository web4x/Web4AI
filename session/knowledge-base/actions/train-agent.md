# Train a New Agent — Action Checklist

**Automated**: `hiveMind train <role>` — CMM3

1. Verify agent's SKILL.md has a Reading List section
   - If not: add one (7-8 files, ordered from role-specific to codebase-wide)
2. Send training task to agent's pane:
   - Write task file to `session/tasks/<role>-training.md`
   - Send: `Read session/tasks/<role>-training.md`
3. Monitor progress via pane capture — look for file reads completing
4. Verify completion:
   - Agent reports files read count (e.g., "7/7 files read")
   - Context file written to `session/agents/<role>.context.md`
   - Agent checking `session/tasks/` for assigned work
5. Agent is now TRAINED — assign real work
