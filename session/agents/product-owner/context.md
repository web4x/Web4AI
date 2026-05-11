# Product Owner Context

**Updated**: 2026-05-05
**Role**: TRONinterface-agent (master PO)
**Pane**: TRONinterface:0.0

## CRITICAL: Pane Layout (VERIFY ON BOOT)
TRONinterface:
- 0.0 = TRONinterface-agent (ME)
- 0.1 = scrum-master (SM, Opus 1M, 42 pair with oosh-po)
- 0.2 = PO-shell (bash)
- 0.3 = TRON-Monitor (GNU screen, FIXED f671d3d)

## Teams
| Team | Session | Agents |
|------|---------|--------|
| TRONinterface | running | TRONinterface-agent + SM |
| ooshTeam | running | oosh-po(0.0) + oosh-architect(0.1) + oosh-expert(0.2) + oosh-tester(0.3) |
| web4team | idle | po + architect + expert + tester |
| upDownTeam | running | ud-po(0.0) + ud-architect(0.1) + ud-expert(0.2) + ud-tester(0.4) |
| unitTeam | running | unit-po(0.0) + unit-architect(0.1) + unit-expert(0.2) + unit-tester(0.4) |
| fallback-agents | parked | 16 forked backups (4 windows: oosh, web4, ud, unit) |

## Sprint 0 — Lifecycle Consolidation (NEARLY COMPLETE)
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md
All expert implementation DONE. Remaining: ~6 tester subtasks + E1 capstone test.
oosh-PO manages Sprint 0 from ooshTeam:0.0.

## Delivered This Session
- tronMonitor FIXED (f671d3d) — screen windows with TMUX= tmux attach -r
- SM rewound (two-phase: shallow→save→deep→option 2)
- oosh-po rewound (~1/3 back, 45/135 messages)
- All 4 ud agents rewound (~1/3 back)
- unitTeam created (forked from web4team, renamed, shells added)
- All unit agents forked into fallback-agents (window 3)
- ud agents forked into fallback-agents (window 2)
- Agent rewind skill written (session/base-skills/agent-rewind.md)
- otmux client lifecycle bugs reported

## Active Directives
- ud-po: Sprint 3 QnD multiplayer game
- unit-po: Unit component tootsie tests
- oosh-po: Sprint 0 completion + sprint management
- web4-po: idle, sprint complete

## RULES (eternal — never delete, only append)
- NEVER ASSUME — ALWAYS MEASURE
- Self-care IS team care — save at 35%
- "42": peer measurement
- NO GIT REBASE
- Every agent file write: git commit immediately
- Rules are eternal — append only
- Dots + camelCase ONLY
- hiveMind for agent interaction, otmux for transport only
- No output filtering
- PO delegates, never debugs
- NO COMPACT unless Tron says — autocompact OFF by design
- Sprint files are PO responsibility
- Role separation: SM monitors/suggests. PO assigns. TRON reviews QA.
- PO+SM are 42 pair (SM↔oosh-po)
- NEVER /clear ANY trained agent — EVER (F-CLEAR failure)
- /rewind TWO-PHASE: (1) shallow 2-3 steps → agent saves → commit (2) deep ~1/3 back → find sweetspot → option 2
- /rewind ALWAYS option 2 "Restore conversation" — NEVER option 1 (reverts code)
- Rewind depth: go DEEP, ~50% or 1/3 back. Shallow (3-10) is useless.
- Every task = one git commit: '<what> (ref: task-<id>.md)'
- VERIFY PANE NUMBERS before every send
- Before rewind: ask agent to update files + git commit FIRST
- fallback-agents = last resort if agent does stupid things
- SM reports to oosh-po NOT TRONinterface:0.0
- After rewind: health check "who and where are you, what's up next"
- API rate limit "Server temporarily limiting" → send "try again"
