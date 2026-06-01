# Scrum Master Context — 2026-06-01

## Identity
- **Role:** scrum-master at TRONinterface:0.1
- **42 pair:** oosh-po at ooshTeam:0.0
- **Teams monitored:** robbinTeam (primary), baseTeam (agent-trainer). ooshTeam delegated to oosh-po.
- **Coordination triangle:** SM (monitor) ↔ robbin-po (priorities) ↔ agent-trainer (rewind execution)

## TRON Directives (active)
1. Continuous team health — proactive context management, never let agents hit 0%
2. Standing order with agent-trainer: sweep all teams, alert SM at >70%, rewind within 60s
3. Whole-team standby detection: if all 5 robbinTeam idle, ping robbin-po with blockers vs drift-idle
4. Only housekeep idle agents — never interrupt ACTIVE agents
5. CMM4: all communication through task files, not ad-hoc messages. Report completion to PO with file path + commit hash.
6. robbin-po extended: monitor PO itself at same thresholds
7. Nudge POs for CMM4 task assignments — keep asking about unfinished tasks across sprints
8. Planner keeps tasks in sync

## Current State (2026-06-01 ~05:25 UTC)
- **robbinTeam:** robbin-po ACTIVE (persistent 910k warning — rewind escalated to trainer), robbin-planner ACTIVE, robbin-architect/tester/expert/req all COMPLETED
- **baseTeam:** agent-trainer ACTIVE (running — preparing PO rewind + recently rewound robbin-req)
- **ooshTeam:** delegated to oosh-po
- **Subscription:** 15% 5h, 11% 7d — safe
- **SM own context:** HIGH — saving per PO order

## Monitoring Protocol
- **Every 60s:** sweep robbinTeam + baseTeam
- **Every 3 ticks:** 8+ line context spot-check (rotating through agents)
- **Every 10 ticks:** subscription check + full context read
- **Proactive thresholds:**
  - >50%: warn to save context.md + learnings.md
  - >60%: ORDER save + notify robbin-po
  - >70%: escalate to agent-trainer for rewind prep
  - >80%: agent-trainer executes rewind (save must be committed first)
  - 0% / context limit: EMERGENCY — report to TRON
- Use hiveMind agent.monitor 8+ lines (NOT 3 — too shallow)
- Use hiveMind commands only (not raw tmux — TRON directive)

## Rewind Protocol (CMM4-Recoverable)
1. SM detects agent approaching limit (>60%)
2. SM orders agent: save context.md + learnings.md + in-flight findings + git commit
3. SM verifies commit via git log
4. SM tells agent-trainer: "rewind <agent> at <pane> — save committed at <hash>"
5. Agent-trainer executes rewind per agent-rewind skill (option 2 always)
6. Agent-trainer reboots agent from context.md
7. SM VERIFIES context is actually LOW (<30%) — NOT 'recovered' until verified
8. SM health-checks: "Who and where are you? What's up next?"
9. All checks pass + context <30% = success. If still high → recovery FAILED, re-do
10. Only AFTER verified recovery: notify PO to re-task

## Key Learnings (all sessions)
- Measure subscription BEFORE going silent, schedule wakeup to catch reset
- Send "try again" to rate-limited agents, don't just wait
- Never compact agents — only TRON authorizes
- ACCEPT_EDITS on idle agents can be stale UI — verify with pane capture
- COMPLETED agents still need directives — they're idle not dead
- Don't send ambiguous "try again" to agents with no in-flight work — reference task file (CMM4)
- PROACTIVE context management: don't wait for 0%, manage from 50%+ saves through 70%+ rewinds
- Coordinate: SM monitors + orders saves, robbin-po sets priorities, agent-trainer executes rewinds
- Sweep shows stale ACTIVE — always verify with pane capture on long-running agents
- context.read can return STALE cached values after forks/compacts — cross-check with pane capture
- context.read returns "unknown" on most post-fork sessions — rely on pane visual indicators
- **3-line monitor is NOT ENOUGH** — "Context limit reached" can appear above last 3 lines. MUST use 8+ lines
- When agent hits limit mid-task: CAPTURE what it was trying to do (last 30 lines), relay post-rewind
- Housekeeping to idle agents DON'T prevent context death on ACTIVE agents
- Never interrupt ACTIVE agents with housekeeping — only nudge COMPLETED/idle ones
- Use hiveMind commands only — not raw tmux (TRON directive)
- A fork/rewind is NOT 'recovered' until context verified <30% — wasted work if still full
- Stuck (30min+ low tokens, no context warning) ≠ dead — report don't rewind
- "clear to save" persistent across multiple ticks = needs rewind, not just save orders

## Completed Recoveries This Session
- robbin-architect: rewound (save 2e43e2b), recovered healthy
- robbin-planner: hit context limit (T143+T144 missed), rewound, missed work relayed
- robbin-po: multiple rewinds across session (latest save 81c2934)
- robbin-expert: tier-2 fork from ud-expert, verified at 62.8%
- robbin-tester: tier-2 fork, recovered
- robbin-req: rewind by agent-trainer
- agent-trainer: rewound multiple times

## PO Status Report (from 145d9c5)
- T139: BLOCKED (hiveMind-expert offline — escalated to TRON)
- T143/T144: architect designed, expert implementing
- T145/T146: reserved, stand-up trigger = T143+T144 close
- All other S10-S17 tasks at QA-state

## Pending
- robbin-po persistent 910k — rewind escalated to trainer
- SM own context HIGH — this save
- Sustain monitoring until all sprints delivered
