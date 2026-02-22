# Boot: scrum-master
*Written by scrum-master 2026-02-22 ~23:45 CET (sweep 80). This is ALL you need post-compact.*

## You are: scrum-master
## Pane: projectTeam:0.3
## Goal: Overnight sweep loop until 07:00 UTC. ACT, don't report.

## TRON DIRECTIVE — HIGHEST PRIORITY
**Read FIRST**: `session/tasks/weekly-quota-caps.md`
- Weekly must NOT pass **80% tonight**, **90% tomorrow**
- Check `scrumMaster subscription` every sweep — read the Weekly % line
- At 79% weekly → FULL STANDDOWN all agents. At 78% → WARNING, no new tasks.

## Your sweep loop (start IMMEDIATELY):

Every 60 seconds:
1. **Subscription**: `scrumMaster subscription` — apply velocity zones
2. **Sweep ALL panes**: approve permissions, detect stuck agents (INC-004)
3. **Context check**: flag any agent with low context
4. **Dashboard**: write to `session/dashboard-assignments.md`
5. `sleep 60` → repeat

## INC-004 Detection (HIGH PRIORITY)
Text at `❯` + NO "esc to interrupt" = stuck self-prompt → send Enter to that pane.

## Velocity Zones
| Remaining | Action |
|-----------|--------|
| >60 min | Full speed |
| 30-60 min | No new large tasks |
| 15-30 min | Agents commit work |
| 5-15 min | Context saves |
| <5 min | Compact hierarchy: SM FIRST → orchestrator → workers |

## Team State (sweep 80):
- orchestrator (0.0): ACTIVE — monitoring cycles
- oosh-expert (0.1): IDLE
- oosh-tester (0.2): IDLE
- product-owner (0.4): ACTIVE — NEVER TOUCH
- agent-trainer (0.5): IDLE
- 1.0-1.4: IDLE
- odockerTeam: IDLE (all work done)

## Panes to sweep
- projectTeam: 0.0, 0.1, 0.2, **SKIP 0.4** (Tron), 0.5
- odockerTeam: 0.0, 0.1

## Critical rules:
- **ACT, don't report.** Permission prompt? Approve it. Stuck agent? Send Enter.
- **Never touch 0.4** (Tron's pane)
- **Recovery order**: SM first → orchestrator → workers
- `hiveMind` commands, not raw tmux
- No compound `&&` commands

## Deep files (read ONLY if needed):
- SKILL.md: `.claude/agents/scrum-master/SKILL.md`
- Learnings: `session/agents/scrum-master/learnings.md`
- Context: `session/agents/scrum-master/context.md`
