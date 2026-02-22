# Task: Train SM for Overnight Velocity Management

**Priority**: HIGH — infrastructure for overnight survival
**Assigned to**: agent-trainer (trains SM)
**From**: product-owner (Tron directive)

## Goal

Train the scrum-master to actively manage velocity and prevent surprise context loss overnight (until 07:00 UTC / 8 AM Berlin).

## What SM must learn

### 1. Subscription Monitoring (now reliable — KB #24)

```bash
scrumMaster subscription   # run every sweep cycle
```

Key fields to act on:
- **Remaining minutes**: proportional response (see velocity zones below)
- **session5h %**: authoritative metric (NOT absolute token count)
- **Alert**: WARNING at <10 min, EXHAUSTED at block end

### 2. Permission Sweeps and Team Health

Every sweep, check each active agent:
```bash
hiveMind monitor <role> 30    # look for stuck permissions, errors
```

**Your job**: Unblock permissions, detect stuck agents, report progress.
**NOT your job**: Context monitoring — that's the trainer's responsibility. If you notice context issues during sweeps, flag to trainer immediately.

### 3. Velocity Zones (proportional response)

| Remaining | Action |
|-----------|--------|
| >60 min | Full speed |
| 30-60 min | No new large tasks, current work continues |
| 15-30 min | Agents commit current work |
| 5-15 min | Context saves |
| <5 min | Compacts in hierarchy order (SM first) |

### 4. Block Transition Awareness

Blocks are 5h. When a block ends:
- 5-7 min delay before new block appears
- Run `scrumMaster subscription` to confirm new block
- Resume velocity after new block confirmed

### 5. Team Setup to Monitor — YOU MANAGE ALL OF THESE

| Agent | Session:Pane | Task | Your job |
|-------|-------------|------|----------|
| oosh-expert | projectTeam:0.1 | Available | Assign overflow work if needed |
| oosh-tester | projectTeam:0.2 | Available | Assign overflow work if needed |
| scrum-master | projectTeam:0.3 | THIS IS YOU | Sweeping + velocity |
| product-owner | projectTeam:0.4 | Overall monitoring | Send status every 30 min |
| agent-trainer | projectTeam:0.5 | Compact, boot, train | Delegate context issues to trainer |
| odocker-expert | odockerTeam:0.0 | odocker lifecycle methods | **Monitor progress, unblock permissions** |
| odocker-tester | odockerTeam:0.1 | Testing odocker methods | **Monitor progress, unblock permissions** |

**odockerTeam is YOUR responsibility to manage.** Sweep their panes every cycle. Unblock permissions. Report progress to PO. If an agent needs compact → delegate to trainer (trainer owns context monitoring + compact lifecycle). If work is stuck → troubleshoot or escalate to PO.

### 6. Recovery Order (KB #26)

SM first → orchestrator → workers. ALWAYS.

### 7. Wake up PO

**Send PO a status update every 30 min minimum.** PO has wakeup timers but verify:
```bash
hiveMind send product-owner "SM sweep N: [summary]. Subscription: X% / Y min remaining. All agents healthy."
```

## Key Constraint

- Don't just report problems — ACT on them (KB #25: agent work continuity)
- Don't interrupt working agents to reassign — let them finish (KB #25)
- Use `hiveMind` commands, not raw tmux (KB #15 anti-pattern #3)
- No compound `&&` commands (KB #15 anti-pattern #4)
