# Peer Monitoring Pattern — Details

## Architecture
Neither agent can see its own context %. The TUI status bar is only visible to an external observer. Mutual monitoring is architecture, not workaround.

- Writer checks scribe from their pane
- Scribe checks writer from their pane
- Mutual detection within 5 min

## Protocol
13-step cycle (upgraded from 10). Integrates VERIFY-AFTER-ACT, SELF-CHECK, WORK-NOT-WATCH.

1. Read background task output (writer pane capture)
2. `claudeCode context.read` — writer context % (context.read is unreliable near the wall — the authoritative measure is the `/context` Free-space header)
3. `claudeCode context.read` — my context %
4. `claudeCode context.velocity` — writer burn rate (context.velocity is unreliable near the wall — the authoritative measure is the `/context` Free-space header)
5. `claudeCode context.velocity` — my burn rate
6. If EITHER near the wall: **Recovery = the 2-phase rewind (a peer/SM drives it); `/compact`+`/clear` are FORBIDDEN — see `session/base-skills/agent-rewind.md`.**
7. If permission prompt: READ OPTIONS FIRST, then select correct one
8. If stuck/idle: ACT — NEVER send Escape. Enter for idle, correct # for permission.
9. VERIFY-AFTER-ACT: After ANY action on peer, capture pane to confirm
10. Log to `session/context-burn-log.md`
11. WORK-NOT-WATCH: 4 min knowledge base work between cycles
12. Restart background loop: `sleep 300 && otmux pane.capture <peer> 5`
13. Always use `otmux send` not raw `tmux send-keys`

## Automation
`hiveMind cycle.full` automates the full monitoring cycle.

## Loop Intervals
- 5 min when actively working
- 30 min during conservation mode
- 60 min overnight

## Lessons
- 10hr overnight of 30-min idle loops with zero work = failure. "The loop is not the job."
- Passive loops = "standing by" = death

## Action Checklists
-> [monitoring-cycle.md](actions/monitoring-cycle.md)
-> [unblock-permission.md](actions/unblock-permission.md)
