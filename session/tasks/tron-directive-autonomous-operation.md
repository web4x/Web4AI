# Tron Directive: Autonomous Operation (HIGHEST PRIORITY)

**From PO, authorized by Tron. Feb 19, ~17:00 Berlin.**
**This is the NEW HIGHEST GOAL alongside CMM4.**

## The Problem

Every block, the team:
1. Runs into subscription walls "surprised" at 90%
2. Runs into context walls (mass 0% on Feb 17)
3. SM forgets to schedule wakeups, drops sweep loop after compact
4. Tron must manually intervene to keep the team running
5. Nobody peer-monitors — dead agents stay dead

**Target**: Team runs autonomously across block boundaries with ZERO Tron intervention. No subscription walls. No context walls. Reliable wakeups.

## Three Workstreams

### WS1: Subscription Accuracy + Interpretation (Expert)

**Findings from PO audit (Feb 19):**
- `scrumMaster.subscription()` reads `~/.claude/rate-limit-cache.json` — same source as TUI footer
- Percentage calculation is CORRECT: `(1 - session5h) * 100`
- The 5h window is ROLLING — as agents go idle, remaining % increases
- ccusage secondary data (tokens, burn rate) may lag or conflict
- Alert thresholds (60/80/90/95%) are binary, NOT CMM4 velocity

**Expert tasks:**
1. **Verify cache matches TUI**: Run `scrumMaster subscription` and compare with TUI footer. Document any delta. If they match, close the accuracy issue.
2. **Replace binary alert thresholds with CMM4 velocity**: Instead of 60/80/90/95% thresholds at lines 816-824, calculate projected exhaustion time: `remaining_fraction * time_until_reset`. Then map to velocity response:
   - >60 min projected → OK
   - 30-60 min → MODERATE
   - 15-30 min → WARNING
   - 5-15 min → HIGH
   - <5 min → CRITICAL
3. **Add trend output**: Show last 3 readings (direction: accelerating/stable/decelerating) so agents can INTERPRET, not just read.
4. **Test**: Run subscription 5 times over 10 min, compare with TUI each time. Log results.

### WS2: Wakeup Reliability (Expert + Trainer)

**Current failure mode**: Agent runs `sleep N &`, then compacts or dies. Timer fires to dead context. Nobody notices.

**Expert tasks:**
1. **Create `scrumMaster.wakeup` method**:
   - Writes wakeup record to `session/wakeups/` with: agent role, scheduled time, purpose
   - SM reads wakeup dir on every cycle — if a wakeup is overdue and no agent is running, SM reboots that agent
   - This makes wakeups PERSISTENT and PEER-MONITORED
2. **Add wakeup check to `scrumMaster.cycle`**: Every cycle, scan `session/wakeups/` for overdue entries. Act on them.
3. **Add context % check to `scrumMaster.cycle`**: Every cycle, check context % of all agents (via `claudeCode context.pct` or pane status). Flag <20%, act at <10%.

**Trainer tasks:**
1. **Add to ALL SKILL.md**: "Before yielding or sleeping, register wakeup: write to session/wakeups/<role>.md with time and purpose"
2. **Add to SM SKILL.md**: "On every cycle: check session/wakeups/ for overdue wakeups. Reboot dead agents."
3. **Verify FIRST 3 ACTIONS** in SM and orchestrator SKILL.md still include context check and wakeup scheduling

### WS3: Autonomous Recovery (Trainer + Expert)

**Current failure mode**: SM compacts → loses sweep loop → sits idle → nobody notices → Tron must intervene.

**Recovery chain that must work WITHOUT Tron:**
1. SM compacts → auto-boot file triggers → SM reads boot-curated.md → SM starts `scrumMaster cycle projectTeam 60`
2. If SM doesn't start cycle within 2 min → orchestrator notices (checks SM every 10-15 min) → sends boot-curated.md again
3. If orchestrator doesn't notice → PO's 15-min results check detects zero deliveries → PO corrects orchestrator
4. Each layer has a LONGER interval — SM 60s, orchestrator 10-15min, PO 15min. No over-monitoring.

**Expert tasks:**
1. **SM auto-cycle on boot**: After SM reads boot file, it should auto-start `scrumMaster cycle projectTeam 60` without needing a separate prompt. Consider a post-compact hook that sends this command.
2. **Orchestrator SM-health check**: Add to `scrumMaster.cycle` or create `orchestrator.checkSM` — captures SM pane, verifies it's cycling (not idle, not marathoning).

**Trainer tasks:**
1. **Boot file auto-execution**: Ensure boot-curated.md ends with a clear instruction: "NOW RUN: scrumMaster cycle projectTeam 60"
2. **Verify orchestrator SKILL.md** includes: "Check SM is alive and cycling every 10-15 min. If not → send boot-curated.md."

## Success Criteria

After implementing all three workstreams:
1. Run team for one full 5h block
2. SM compacts at least once during the block — and recovers automatically
3. Subscription never exceeds WARNING level (>80%) without proportional response already active
4. No agent hits 0% context without SM having triggered compact at 20%
5. Tron does NOT need to intervene at any point

## Priority & Assignment

| # | Task | Owner | Goal |
|---|------|-------|------|
| 1 | Verify cache vs TUI + document | Expert | WS1 |
| 2 | CMM4 velocity alerts (replace binary) | Expert | WS1 |
| 3 | scrumMaster.wakeup method | Expert | WS2 |
| 4 | Wakeup + context check in cycle | Expert | WS2 |
| 5 | SM auto-cycle on boot | Expert | WS3 |
| 6 | Wakeup registration in all SKILL.md | Trainer | WS2 |
| 7 | Verify FIRST 3 ACTIONS in SM+orch | Trainer | WS2/3 |
| 8 | Boot file auto-execution instruction | Trainer | WS3 |

Expert does 1-5 first (tools). Trainer does 6-8 (SKILL.md). Both can work in parallel.
