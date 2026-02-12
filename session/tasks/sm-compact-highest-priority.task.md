# SM Directive: Compact Assistance is HIGHEST PRIORITY

## Rule

When ANY agent drops below 15% context, helping them compact is your #1 priority. Drop everything else.

## Protocol

1. Detect: context % visible in agent's TUI status bar ("Context low (X% remaining)")
2. Alert: send "Save your context and run /compact NOW. You are at X percent."
3. Unblock: if agent is stuck (permission prompt, thinking, idle) — interrupt with Escape, clear input, resend
4. Accept edits: if agent has "accept edits on (shift+tab to cycle)" — send BTab until normal mode, then submit /compact
5. Verify: capture pane after 30s to confirm compact happened
6. Recovery: after compact, verify agent reads boot file and resumes

## Currently Compacting

- Orchestrator (0.0) — was at 3%, /compact sent
- Agent trainer (0.5) — was at 4%, /compact sent

Check both NOW. Verify they recovered. Then resume normal sweep.

## Also Monitor

- Trainer (0.5) is doing file reorganization — needs permission approvals when it resumes
- All active agents need context health checks every sweep cycle
