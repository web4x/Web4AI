# Product Owner Context

**Updated**: 2026-04-30
**Role**: TRONinterface-agent (master PO)
**Pane**: TRONinterface:0.0

## CRITICAL: Pane Layout (VERIFY ON BOOT)
- 0.0 = TRONinterface-agent (ME)
- 0.1 = scrum-master (SM)
- 0.2 = PO-shell (bash)
- 0.3 = TRON-Monitor (screen)
ALWAYS run `otmux pane.list TRONinterface` to verify before sending. NEVER assume pane numbers.

## Teams
| Team | Session | Agents |
|------|---------|--------|
| TRONinterface | running | TRONinterface-agent + SM |
| ooshTeam | running | oosh-po(0.0) + expert(0.1) + tester(0.2) |
| web4team | running | po(0.0) + architect(0.1) + expert(0.2) + tester(0.3) |
| fallback-agents | parked | 8 forked backups — rename to fallback-<role> pending |

## Sprint 0 — Lifecycle Consolidation (NEARLY COMPLETE)
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md
**All expert implementation DONE.** Remaining: ~6 tester subtasks + E1 capstone test.

### Done (QA Review for Tron)
G1, A1, A2, B1, B2, B3, B4, C1 (primary!), C2, C3.1+C3.2, D1 (all), D2, F1, F2, F3

### oosh-PO manages Sprint 0 from ooshTeam:0.0
I delegate to oosh-PO, oosh-PO assigns expert+tester.

## Active Directives
- web4-po: reread web4 principles, plan DRY architecture to eliminate re-import duplication (black-box interfaces only)
- oosh-architect: fix UC diagrams — every UC must be fully qualified object.method (e.g. otmux.new not just new)
- SM permission bug: ask SM what command triggers prompts, add to settings.json allow list

## Known Bugs
- fallback-agents causes ambiguous hiveMind resolve — rename to fallback-<role>
- hiveMind send.message leaks option numbers into wrong panes (Bug 5)
- hiveMind needs INFORM vs REMOTE CONTROL paths (sweep.detect before send)
- SM can't sustain loops — needs periodic nudges

## Token Economics (proven)
- Subscription counts INPUT only — sustained output FREE
- Each new prompt: ~15-20% of 5h budget
- /rewind option 2 for context recovery — NEVER option 1 (reverts code)

## RULES (eternal — never delete, only append)
- NEVER ASSUME — ALWAYS MEASURE
- Self-care IS team care — save at 35%
- "42": peer measurement — ask, don't assume
- NO GIT REBASE
- Every agent file write: git commit immediately
- Rules are eternal — append only
- Dots + camelCase ONLY
- hiveMind for agent interaction, otmux for transport only
- No output filtering
- PO delegates, never debugs
- NO COMPACT unless Tron says
- Sprint files are PO responsibility
- Role separation: SM monitors/suggests. PO assigns. TRON reviews QA.
- PO+SM are 42 pair
- /rewind: ALWAYS option 2. Ask agent to save files first. 10 steps. NEVER summarize.
- Every task = one git commit: '<what> (ref: task-<id>.md)'
- VERIFY PANE NUMBERS before every send — I confused 0.1/0.2 and caused chaos
- Before rewind: ask agent to update files + git commit FIRST
- fallback-agents = last resort if agent does stupid things
