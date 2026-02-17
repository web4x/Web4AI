# Action: Trigger Seamless Compact for Peer

**Automated**: `hiveMind peer.compact <name-or-pane>` — CMM3

The agent being compacted does ZERO manual steps.

1. Capture peer's pane (30 lines): `otmux pane.capture <peer> 30`
2. Read their current context file
3. Update their context file with what you observe (tasks, state, what they were working on)
4. Kill rogue hook processes: check `/tmp/resume-<pane>.pid`
5. Clear their input: `otmux send <peer> C-u`
6. Send compact: `otmux send <peer> "/compact" Enter Enter`
7. Wait ~20 seconds for hook to process
8. Verify recovery: `otmux pane.capture <peer> 10`
