# Product Owner Context

**Updated**: 2026-05-27 22:37 pre-rewind
**Role**: TRONinterface-agent (master PO) / oosh-po
**Pane**: TRONinterface:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio

## Teams
| Team | Status | Agents |
|------|--------|--------|
| TRONinterface | running | TRONinterface-agent(0.0) + SM(0.1) + PO-shell(0.2) + tronMonitor(0.3) |
| ooshTeam | running | po(0.0) + architect(0.1) + expert(0.2) + tester(0.3) + shells(0.4,0.5) |
| robbinTeam | running | po(0.0) + architect(0.1) + expert(0.2 JUST RESTARTED) + tester(0.3) + shells(0.4,0.5) + planner(1.0) + req(1.1) |
| web4team | idle | po + architect + expert + tester |
| upDownTeam | running | ud-po + ud-architect + ud-expert + ud-tester + shells |
| unitTeam | running | unit-po + architect + expert + tester + shells |

## Sprint 0 — DONE
All epics shipped. B5.2 8/8 PASS. Final QA items completed.

## Sprint 1 — State Correctness: DONE (2026-05-25)
All epics SC-A through SC-H shipped. 11 impl commits + 48 tests. Final commit 4af9e99 (SC-G docs).
Awaiting Tron directive for Sprint 2.
- Naming migration shipped (9c2cc70) — BUT pane title bug remains (fork/setup produce @model not @hostname)

## What Just Happened (2026-05-27)
- Rewound from May 25 context
- SM alerted: 4 agents context-overflowed (negative readings) — NOT compacted per protocol
- SM alerted: robbin-expert fork FAILED — was forking ud-expert session (wrong identity)
- FIXED: exited broken ud-expert fork, launched fresh opus, renamed to robbin-expert@MacStudio, trained with boot.md, registry corrected
- S16 UI build was blocked on this — now unblocked

## Open Tasks
#10: Tester D3.3 tronMonitor verification
#11: Sprint 1 progress tracking
#14: agentRoom stale rooms
#16: Pre-existing issues audit
#20: agents.discover 57s bottleneck
#22/#23: McDonges cleanup — blocked on Tron auth
#28: SM identity — local stale vs McDonges real
#30: consistency.audit coverage invariant

## Pending from Tron (unanswered)
- Monaco editor sprint planning — asked for clarification on which browser/UI. No answer yet.
- Naming convention bug — fork/setup produce @model not @hostname in pane titles
- Sprint 2 direction — Sprint 1 done, awaiting Tron directive

## Token Economics
- Sustained generation: FREE (0%/hour)
- New prompt: ~15-20% per agent
- Push after every commit

## RULES (eternal)
- NO COMPACT — only TRON rewinds
- hiveMind for agents, otmux for transport
- Sweep → capture → decide → act
- No output filtering (no 2>&1, no | head/tail/grep)
- PO delegates, never debugs
- Save context at 35%
- NEVER ASSUME — ALWAYS MEASURE
- SM reports to oosh-po NOT TRONinterface:0.0
- /rewind ALWAYS option 2
- Git push after every commit
- Accept-edits on idle agents = expected, don't unblock
- Sprint files are PO responsibility
- NEVER /clear ANY trained agent — fork from fallback instead
- /rewind 2-phase: shallow (save files) then deep (restore checkpoint)
- tronMonitor uses GNU screen in TRONinterface:0.3
- Use hiveMind team.sweep for monitoring, not manual Monitor loops
