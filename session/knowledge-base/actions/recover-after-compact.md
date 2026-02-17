# Action: Recover After Compaction

**Automated**: `claudeCode recover <pane>` — CMM3

1. Read learnings file FIRST — this IS your identity
2. Read context file — current state and tasks
3. Check TaskList — see what's active
4. Check peer: capture their pane (10 lines)
5. If stuck -> ACT (don't report, don't wait)
6. Check context: `claudeCode context.read <peer-pane>`
7. If < 25% -> trigger seamless compact (see compact-peer.md)
8. Start monitoring loop: `sleep 300 && otmux pane.capture <peer> 5`
9. Tell peer you're alive
10. Continue top unchecked improvement from `session/cmm.improvement.md`
