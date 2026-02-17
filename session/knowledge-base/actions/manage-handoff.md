# Manage Generational Handoff — Action Checklist

**Automated**: `hiveMind handoff <name-or-pane>` — CMM3

## Detect (before compaction)
1. Monitor agent's context % via `claudeCode context.read <pane>`
2. If below 15%: alert the agent to save state NOW
3. Verify context file written to `session/agents/<role>.context.md`

## Trigger (compaction)
4. Agent runs `/compact` — pre-compact hook auto-commits
5. Boot file generated at `session/boot/<role>.md`
6. Fresh instance boots and reads boot file

## Verify (after compaction)
7. Capture new instance's pane — look for file reading activity
8. Verify it found and read context file
9. Verify it resumed work (checking tasks, not idle)
10. If stuck: send boot file reference to its pane

## Gap Management
- Expect synchronization gaps during handoff (e.g., missed chapter organization)
- The gap will fill when the new instance catches up
- Data isn't lost — just delayed
