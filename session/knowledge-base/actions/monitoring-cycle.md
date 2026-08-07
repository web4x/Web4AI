# Action: Run a Monitoring Cycle

**Automated**: `hiveMind monitor.cycle <session>` — CMM3

1. Read background task output (peer pane capture)
2. Check peer context: `claudeCode context.read <peer-pane>` (context.read is unreliable near the wall — the authoritative measure is the `/context` Free-space header)
3. Check own context: `claudeCode context.read <my-pane>`
4. Check peer velocity: `claudeCode context.velocity <peer-pane>`
5. If EITHER near the wall: **Recovery = the 2-phase rewind (a peer/SM drives it); `/compact`+`/clear` are FORBIDDEN — see `session/base-skills/agent-rewind.md`.**
6. If permission prompt: READ OPTIONS FIRST (see unblock-permission.md)
7. If stuck/idle: ACT — Enter for idle, correct number for permission
8. VERIFY: After any action, capture pane to confirm it worked
9. Log both percentages to `session/context-burn-log.md`
10. Do 4 min of knowledge base work (WORK-NOT-WATCH)
11. Restart loop: `sleep 300 && otmux pane.capture <peer> 5`
