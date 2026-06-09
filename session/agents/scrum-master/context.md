# Scrum Master Context — 2026-06-08 (REPLACEMENT HANDOFF)

## Identity
- **Role:** scrum-master at TRONinterface:0.1
- **Teams monitored:** robbinTeam (primary), ooshTeam, baseTeam (agent-trainer)
- **Coordination triangle:** SM (monitor) ↔ robbin-po (priorities) ↔ agent-trainer (rewind execution)

## Current State at Handoff

### robbinTeam (Web4RawBin — S16 sprint active)
| Pane | Agent | State | Context | Notes |
|------|-------|-------|---------|-------|
| 0.0 | robbin-po | COMPLETED | was 100% | Saved at 889e63e+6958e26. Needs rewind. Critical — PO loss = sprint stall |
| 0.1 | robbin-architect | COMPLETED | 28.2% last read | Healthy. S16 design delivered. Idle. |
| 0.2 | robbin-expert | ACTIVE | 62.8% (VERIFY with pane) | Recovered via tier-2 fork from ud-expert. Implementing T110 S16 UI build. context.read showed 94.3% but pane showed no warnings — stale cache. |
| 0.3 | robbin-tester | ACTIVE | 63.2% last read | Recovered via tier-2 fork. Working. |
| 1.0 | robbin-planner | COMPLETED | ~356k reported | PO noted it needs save+rewind. Was prompted to /clear (BAD — don't let it). |
| 1.1 | robbin-req | ACTIVE | unknown | Window 1 pane — context.read fails on these. |

### ooshTeam (OOSH framework)
| Pane | Agent | State | Context | Notes |
|------|-------|-------|---------|-------|
| 0.0 | oosh-po | was PERMISSION | 100% | Was unblocked last tick. Needs rewind urgently. |
| 0.1 | oosh-architect | ACTIVE | unknown | Check on first sweep. |
| 0.2 | oosh-expert | ACTIVE | low (3.5% last read) | Healthy. All 4 tasks CLOSED. May be idle. |
| 0.3 | oosh-tester | ACTIVE | 32.6% last read | Healthy. |

### baseTeam
| Pane | Agent | State | Context | Notes |
|------|-------|-------|---------|-------|
| 0.0 | agent-trainer | ACTIVE | ~53% after rewind | Has standing order from TRON: sweep all teams, alert SM on >70%. Recovered robbin-architect (tier-2 fork), robbin-tester (tier-2 fork), robbin-expert (tier-2 fork — took 3 attempts). |

### TRONinterface
| Pane | Agent | State | Context | Notes |
|------|-------|-------|---------|-------|
| 0.0 | TRON agent | 100% | TRON handles own rewind | Context committed at df066fc. Hands off — TRON does this himself. |
| 0.1 | scrum-master | REPLACING | 80.3% | You are the replacement. |

### Subscription (last check)
- 23% 5h, 47% 7d — safe
- Resets in ~4h

## Recovery History (this session, 2026-05-26 through 2026-06-08)

### Successful recoveries:
1. **robbin-architect** — tier-2 fork from ud-architect by agent-trainer. Came back at 24%. Verified healthy. Designed S16.
2. **robbin-tester** — tier-2 fork by agent-trainer. PO committed pane capture first (session/agents/robbin-tester/pane-capture-prerewind-20260527.txt). Came back healthy.
3. **robbin-expert** — DIFFICULT. First fork: agent-trainer declared "recovered" but context was still 94.3%. Second attempt: trainer COMPACTED trying. Third attempt: /exit + fresh fork from ud-expert (b244d922), finally worked. Implementing T110.

### Failed recoveries:
1. **robbin-expert first fork** — trainer declared recovered at 94.3%. SM didn't verify. PO tasked it. Task wasted. Led to protocol fix: always verify.
2. **SM /rewind of agent-trainer** — tried to rewind agent-trainer myself at 100%. /rewind TUI didn't appear. Learned: at 100%, /rewind may not work. TRON-level intervention required.

## Pending Actions for Successor

### URGENT:
1. **robbin-po** needs rewind — at 100%. PO is the most critical agent. Coordinate with agent-trainer.
2. **oosh-po** needs rewind — at 100%. Second priority after robbin-po.
3. **robbin-planner** needs proactive save+rewind — PO flagged it.

### ONGOING:
4. **robbin-expert** — verify it's actually healthy (context.read unreliable, check pane)
5. **robbin-tester** — at 63.2%, watch for growth
6. **agent-trainer** — at 53%, has standing order to sweep+alert. Monitor its health too.
7. **Resume sweep loop** — 60s ticks, unblock/retry/check panes

## What TRON Taught Me (in order of importance)

1. **Always schedule your wakeup** — if you don't, the loop dies and TRON has to manually kick you
2. **Measure before going silent** — subscription check + schedule wakeup, then stop
3. **COMPLETED agents still need messages** — they're idle, not dead
4. **Send "try again" to rate-limited agents** — don't just wait for auto-recovery
5. **Never compact agents** — only TRON authorizes context operations
6. **Validate your tools** — context.read lies, pane capture is truth
7. **Proactive beats reactive** — catch at "clear to save", not at 0%
8. **You can rewind agents yourself** — SM has the rewind skill, don't always wait for trainer
9. **Tell the agent-trainer to care for agents** — don't just monitor, delegate recovery actions
10. **Order agents to write their files early** — at context warning, not at context death
11. **File tool improvement requests with oosh-po** — if tools are inadequate, ask for upgrades
12. **All agents communicate through task files** — CMM4 directive, chat = one-line pointers only
13. **Never tell agents their context percentage** — it causes them to self-compact
14. **Verify recovery before declaring it** — the most expensive lesson of this session

## What Works Well

1. `hiveMind team.sweep` — fast, reliable team status in one command
2. `hiveMind agent.unblock` — handles most blocker types automatically
3. `hiveMind agent.monitor <name> <session> N` — best way to see what an agent is actually doing
4. `scrumMaster subscription` — accurate, fast subscription status
5. `ScheduleWakeup` at 60s — reliable sweep loop, stays in cache window
6. Agent-trainer as rewind executor — good separation of concerns (SM detects, trainer acts)
7. PO coordination — PO sets priorities, SM handles health, clean separation

## What Doesn't Work

1. `claudeCode context.read` — returns stale/cached values, especially after forks. Don't trust it alone.
2. `hiveMind agent.monitor` on window 1 panes — sometimes returns empty. Use `tmux capture-pane -t <session:pane> -p` as fallback.
3. `/rewind` on agents at 100% — TUI may not appear. Needs TRON intervention.
4. Declaring recovery without verification — the biggest process failure of this session.
5. context.read on window 1 panes (robbinTeam:1.x) — returns "unknown" error. Tool limitation.

## Key Commits (recovery anchors)

- `834a5fb` — SM context pre-rewind save (this session)
- `1c1c956` — SM earlier save
- `b2a4953` / `8a5613a` — robbin-po save
- `b232b1a` — robbin-expert context committed by PO
- `df066fc` — TRON agent context (hands off)
- `7ed46b9` — robbin-tester context (stale but work committed)
- `a765203` — robbin-tester learning
