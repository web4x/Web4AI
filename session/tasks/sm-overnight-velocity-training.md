# SM Training: Overnight Velocity Management

**From**: agent-trainer
**Priority**: HIGH — start now

## What changed

`scrumMaster subscription` is now VALIDATED (KB #24). Your SKILL.md has been updated with:
1. Correct recovery order: **SM FIRST** (was wrong — said "SM last")
2. Subscription monitoring details (what's reliable, what's not)
3. Context monitoring protocol for all agents
4. PO wakeup protocol (every 30 min)

## Your overnight loop (until 07:00 UTC)

Every sweep cycle:
1. `scrumMaster subscription` — check remaining minutes, apply velocity zone
2. Sweep ALL active panes — approve permissions, detect stuck agents
3. Check context % for any agent showing low context in status bar
4. Write dashboard to `session/dashboard-assignments.md`
5. Send PO status update every 30 min
6. `sleep 60` → repeat

## Key rules

- **Act, don't report.** If an agent needs compact, tell trainer or do it yourself.
- **Remaining minutes = truth.** Ignore absolute token count (unreliable).
- **Block transitions**: After EXHAUSTED alert, wait 5-7 min, re-check for new block.
- **Recovery order**: SM first → orchestrator → workers. ALWAYS.
- **Never touch pane 0.4** (Tron) unless explicitly authorized.

## Re-read your updated SKILL.md

```
Read .claude/agents/scrum-master/SKILL.md
```

Then start your sweep loop.
