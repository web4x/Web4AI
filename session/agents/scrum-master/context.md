# Scrum Master Context — 2026-06-08

## Identity
- **Role:** scrum-master at TRONinterface:0.1
- **Teams monitored:** robbinTeam (primary), ooshTeam, baseTeam (agent-trainer)
- **Coordination triangle:** SM (monitor) ↔ robbin-po (priorities) ↔ agent-trainer (rewind execution)

## Current State (pre-rewind save)
- **robbinTeam:** robbin-po COMPLETED (was at 100%, needs rewind), architect COMPLETED, expert ACTIVE (62.8% — recovered via tier-2 fork from ud-expert, implementing T110 S16 UI build), tester ACTIVE (63.2%), planner COMPLETED, req ACTIVE
- **ooshTeam:** oosh-po PERMISSION (unblocked, at 100%), oosh-architect ACTIVE, oosh-expert ACTIVE, oosh-tester ACTIVE
- **baseTeam:** agent-trainer ACTIVE (53% after rewind, standing order to sweep + alert SM on >70%)
- **SM context:** 80.3% — needs deep rewind
- **Subscription:** 23% 5h, safe

## Standing Duties (from robbin-po + TRON)
1. **IDLE-CATCH** — flag PO when ANY agent idle with impl/test-pending work
2. **UNSENT-CATCH** — if PO dispatches but agent stays idle, flag unsent
3. **REPORT-DISCIPLINE** — agents write results INTO task files, chat = one-line pointer only
4. **MONITOR LIMITS** — check ALL agent panes every tick for "clear to save"
5. **CONTEXT/REWIND** — save+commit first, trainer rewinds, verify <30% before declaring recovered
6. **PO pane check EVERY tick** — PO must NEVER hit 0%
7. **TEAM with agent-trainer** — standing order from TRON: never let an agent hit context limit again

## HARD RULES
1. NEVER mention context levels/percentages/token counts to agents
2. NEVER say "compact" to any agent
3. Save order = ONLY "commit your current work to context.md and learnings now"
4. NEVER send /compact or /clear to any pane
5. Rewind = silent order to agent-trainer
6. At 0% agent CANNOT process — don't send messages, just rewind
7. Use hiveMind commands ONLY — no raw tmux or shell loops (permission prompts)
8. Fork/rewind NOT recovered until verified healthy (no "clear to save" in pane)
9. context.read returns stale values — cross-check with pane capture
10. NEVER tell agents their context level — causes self-/compact

## Rewind Protocol (CMM4-Recoverable)
1. SM detects agent approaching limit (check pane for "clear to save")
2. SM orders agent: "commit your current work to context.md and learnings now"
3. SM verifies commit via pane capture
4. SM tells agent-trainer: "rewind <agent> at <pane>"
5. Agent-trainer executes rewind (option 2 always)
6. Agent-trainer reboots agent from context.md
7. **SM VERIFIES no "clear to save" in pane — fork/rewind NOT recovered until verified**
8. SM health-checks: "Who and where are you? What's up next?"
9. Only AFTER verified: notify PO to re-task

## Monitoring Cadence
- **Every 60s:** sweep all teams — unblock PERMISSION/ACCEPT_EDITS, retry RATE_LIMIT
- **Every 3 ticks:** spot-check panes for "clear to save" warnings
- **Every 10 ticks:** subscription velocity check
- **Proactive:** catch at first warning, not at 0%

## Key Learnings
- Check ALL agent panes every tick, not just PO — missed 5 agents drifting to pressure
- "clear to save Nk tokens" in pane = act immediately
- context.read returns stale values — cross-check with pane capture
- At 0% skip save, rewind immediately
- Proactive > reactive: catch at first warning, not at 0%
- NEVER tell agents their context level — causes self-/compact
- CMM4: report-back in task file, chat = one-line pointer
- Measure subscription BEFORE going silent, schedule wakeup to catch reset
- COMPLETED agents still need directives — idle not dead
- Sweep shows stale ACTIVE — verify with pane capture on long-running agents

## Pending
- robbin-po needs rewind (100%)
- oosh-po needs rewind (100%)
- SM (me) needs deep rewind (80.3%)
- robbin-expert 62.8%, robbin-tester 63.2% — watching
- Agent-trainer has standing order to sweep + alert on >70%
