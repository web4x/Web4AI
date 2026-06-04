# Scrum Master Context — 2026-06-04

## Identity
- **Role:** scrum-master at TRONinterface:0.1
- **42 pair:** oosh-po at ooshTeam:0.0
- **Teams monitored:** robbinTeam (primary), baseTeam (agent-trainer)
- **Coordination triangle:** SM (monitor) ↔ robbin-po (priorities) ↔ agent-trainer (rewind execution)

## Current State
- **robbinTeam:** po COMPLETED (save 4ac9642+842278f), architect COMPLETED (needs rewind — T180 cert + T178 mapping), tester ACTIVE, planner COMPLETED, req ACTIVE, expert ACTIVE
- **baseTeam:** agent-trainer ACTIVE — alerted for architect rewind
- **Subscription:** ~18% 5h, 62% 7d — safe
- **SM context:** high — saving now for rewind

## Monitoring Protocol
- 60s polling (ACTIVE coordination mode per robbin-po directive)
- Sweep robbinTeam every tick
- Context spot-check via hiveMind agent.monitor 8+ lines every 3rd tick (rotating)
- Subscription check every 4th tick
- Report state changes to robbinTeam:0.0 proactively
- Detect whole-team standby — ping PO if all idle
- Only housekeep IDLE agents — never interrupt ACTIVE

## HARD RULES (violations = catastrophe)
1. **NEVER mention context levels/percentages/token counts to agents** — auto-mode self-prescribes /compact when told context is high. ROOT CAUSE: SM telling architect "723k warning" caused self-/compact.
2. **NEVER say "compact" to any agent** — not in save orders, not in any message. The word itself triggers auto-mode.
3. **Save order = ONLY "commit your current work to context.md and learnings now"** — normal work instruction, nothing about context/tokens/limits/compact.
4. **NEVER send /compact or /clear to any pane** — only TRON authorizes.
5. **Rewind = silent order to agent-trainer** — agent is NOT told it's being rewound for context. Numbers stay between SM, PO, and trainer.

## Rewind Protocol
1. SM detects agent needs rewind (via 8-line pane capture showing "clear to save")
2. SM sends clean save order: "commit your current work to context.md and learnings now"
3. SM verifies commit via git log
4. SM tells trainer SILENTLY: "agent X needs rewind. Save confirmed at <hash>."
5. Trainer executes rewind (option 2 always)
6. SM VERIFIES context healthy post-rewind (no "clear to save" in pane)
7. Only after verified: notify PO

## Key Learnings (all sessions)
- 3-line monitor NOT ENOUGH — use 8+ lines (Context limit can hide above 3 lines)
- context.read returns stale values after forks — cross-check with pane capture
- Sweep ACTIVE can be stale — verify with pane capture on long-running agents
- Stuck (30min+ low tokens no warning) ≠ dead — report don't rewind
- "clear to save" persistent across ticks = needs rewind not just saves
- Fork/rewind NOT recovered until context verified healthy
- When agent hits limit mid-task: capture last 30 lines, relay post-rewind
- CMM4: all communication through task files with path + commit hash
- Measure subscription BEFORE going silent, schedule wakeup to catch reset
- NEVER tell agents their context level — causes self-/compact (catastrophe)
- NEVER say "compact" in any message to any agent
- Save orders = clean work instructions only
- PO nudge after 3+ idle ticks, but don't spam

## Completed Recoveries This Session
- All robbinTeam agents rewound multiple times (PO, architect, expert, tester, planner, req)
- Agent-trainer rewound twice
- Protocol fixes: verified recovery <30%, never mention context to agents, never say compact
