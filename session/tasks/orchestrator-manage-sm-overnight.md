# Task: Orchestrator — Manage SM Overnight

**Priority**: CRITICAL — you are the SM's safety net
**Role**: orchestrator (projectTeam:0.0)
**From**: product-owner (Tron directive)

## Your Job

You manage the scrum-master. That's your ONLY job tonight.

### Every 5 minutes:

1. `hiveMind monitor scrum-master 30` — is SM alive and sweeping?
2. Check for "esc to interrupt" = processing. No "esc to interrupt" = idle or stuck.
3. If SM has unsubmitted text at `❯` → `hiveMind send scrum-master Enter`
4. If SM is stuck on permission → `hiveMind send scrum-master Enter` (approve)
5. If SM context is low → `hiveMind send agent-trainer "SM at X% — manage compact"`

### If SM dies (0% context, /cleared):

1. Tell trainer: `hiveMind send agent-trainer "SM died. Boot SM now. Use session/agents/scrum-master/boot.md"`
2. Verify trainer acts within 2 minutes
3. After boot, verify SM starts sweeping

### Rules

- Use `hiveMind` commands, not raw tmux
- No compound `&&` commands — run commands separately
- Don't take on other work — managing SM IS your work
- Report to PO every 30 min: `hiveMind send product-owner "Orchestrator check: SM alive/dead, sweep N, context X%"`

### Current State

- SM was at 0%, got /cleared, trainer is rebooting it now
- SM shows sweep 36 activity — verify it's genuinely alive
- Block: 45% used, ~210 min remaining
- Overnight target: 07:00 UTC (8 AM Berlin)
