# Product Owner Context

**Updated**: 2026-05-12
**Role**: TRONinterface-agent (master PO)
**Pane**: TRONinterface:0.0

## CRITICAL: Pane Layout (VERIFY ON BOOT)
TRONinterface:
- 0.0 = TRONinterface-agent (ME)
- 0.1 = scrum-master (SM, 42 pair with oosh-po)
- 0.2 = PO-shell (bash)
- 0.3 = TRON-Monitor (GNU screen, FIXED f671d3d but MVC state desync bugs remain)

## Teams
| Team | Session | Agents |
|------|---------|--------|
| TRONinterface | running | TRONinterface-agent + SM |
| ooshTeam | running | oosh-po(0.0) + oosh-architect(0.1) + oosh-expert(0.2) + oosh-tester(0.3) + shells(0.4,0.5) |
| web4team | idle | po + architect + expert + tester |
| upDownTeam | running | ud-po(0.0) + ud-architect(0.1) + ud-expert(0.2) + ud-tester(0.4) + shells(0.3,0.5) |
| unitTeam | running | unit-po(0.0) + unit-architect(0.1) + unit-expert(0.2) + unit-tester(0.4) + shells(0.3,0.5) |
| fallback-agents | parked | 16 forked backups (4 windows: oosh, web4, ud, unit) |

## Sprint 0 — Lifecycle Consolidation
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md
All expert implementation DONE. Remaining tester subtasks. oosh-PO manages from ooshTeam:0.0.

## Bugs Reported to oosh-po (MVP blockers)
- tronMonitor MVC state desync: header says upDownTeam, shows web4team content
- tronMonitor switch doesn't verify actual screen window matches
- Registry pollution: stale test entries (0.99/0.98 test-alpha/test-beta with timestamps)
- Duplicate registry: oosh-po at both 0.0 AND 0.4
- team.sweep shows wrong data from polluted registry
- registry.refresh must prune non-existent panes, timestamp entries, duplicates
- otmux client.list and lifecycle methods broken

## Active Directives
- oosh-po: fix registry+tronMonitor bugs (MVP blockers), manage Sprint 0
- ud-po: Sprint 3 QnD multiplayer game
- unit-po: Unit component tootsie tests
- web4-po: idle

## Token Economics (proven)
- Subscription counts INPUT only — sustained output FREE
- Each new prompt: ~15-20% of 5h budget
- /rewind option 2 for context recovery

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
- Rewind depth: go DEEP, ~1/3 back. Shallow (3-10) is useless.
- Every task = one git commit: '<what> (ref: task-<id>.md)'
- VERIFY PANE NUMBERS before every send
- Before rewind: ask agent to update files + git commit FIRST
- fallback-agents = last resort if agent does stupid things
- SM reports to oosh-po NOT TRONinterface:0.0
- After rewind: health check "who and where are you, what's up next"
- API rate limit "Server temporarily limiting" → send "try again"
