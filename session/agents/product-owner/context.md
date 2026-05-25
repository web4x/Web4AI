# Product Owner Context

**Updated**: 2026-05-25 pre-rewind
**Role**: TRONinterface-agent (master PO) / oosh-po
**Pane**: TRONinterface:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio

## Teams
| Team | Status | Agents |
|------|--------|--------|
| TRONinterface | running | TRONinterface-agent(0.0) + SM(0.1 stale loop) + PO-shell(0.2) + tronMonitor(0.3) |
| ooshTeam | running | po(0.0) + architect(0.1) + expert(0.2) + tester(0.3) + shells(0.4,0.5) |
| robbinTeam | running | po(0.0) + architect(0.1) + expert(0.2) + tester(0.3) + shells(0.4,0.5) + planner(1.0) + req(1.1) |
| web4team | idle | po + architect + expert + tester |
| upDownTeam | running | ud-po + ud-architect + ud-expert + ud-tester + shells |
| unitTeam | running | unit-po + architect + expert + tester + shells |

## Sprint 0 — DONE
All epics shipped. B5.2 8/8 PASS. Final QA items completed.

## Sprint 1 — State Correctness (IN PROGRESS)
- SC-A: 2/3 (diff b4447f6, audit 636489f — A.3 tester pending)
- SC-B: 1/3 (events 8feac46 — bash 3.2 compat fixed 194568a)
- SC-D: D.1 in progress
- SC-E: E.1 findings + E.2 shipped
- SC-C/F/G: not started
- Naming migration shipped (9c2cc70) — BUT pane title bug remains (fork/setup produce @model not @hostname)

## Completed This Session
- robbinTeam created (4 agents + 2 shells + planner + req engineer)
- robbin-planner bootstrapped at 1.0 (new window)
- robbin-req forked from architect at 1.1 (with /remote-control)
- Bash 3.2 compat fix (194568a) — declare -g + assoc arrays
- robbinTeam registry repaired after pane-shift incident
- Window size floor applied to robbinTeam windows 0+1
- Naming migration shipped (9c2cc70) — 9 write paths
- BUG-T5 source hang fix (bfb8d3c) — 0.055s vs 30s
- Task #26 configDir completion (c6af20e)
- Task #29 bash compat (194568a)
- McDonges clone trial complete — 6 bugs found
- Clone trial bug B1+B2 fixed
- tronMonitor MVC state sync (aa7d6ac)
- teams.env garbage fix (ebc8b5e)
- SM recovered from CMM4 loop (task #9)
- Git push enforcement (task #25)

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
- Monaco editor sprint planning — Tron asked to plan a big sprint adding Monaco editor to "the browser" for editing source files. Asked for clarification on which browser/UI. No answer yet.
- Naming convention bug — fork/setup produce @model not @hostname in pane titles. Reported to oosh-expert + tester.

## Token Economics
- Sustained generation: FREE (0%/hour)
- New prompt: ~15-20% per agent
- Push after every commit

## RULES (eternal)
- NO COMPACT — only TRON rewinds
- hiveMind for agents, otmux for transport
- Sweep → capture → decide → act
- No output filtering
- PO delegates, never debugs
- Save context at 35%
- NEVER ASSUME — ALWAYS MEASURE
- SM reports to oosh-po NOT TRONinterface:0.0
- /rewind ALWAYS option 2
- Git push after every commit
- Accept-edits on idle agents = expected, don't unblock
- Sprint files are PO responsibility
