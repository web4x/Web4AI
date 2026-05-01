# Product Owner Context

**Updated**: 2026-05-01 16:30
**Role**: oosh-po (forked PO for ooshTeam)
**Pane**: ooshTeam:0.0
**SM**: TRONinterface:0.1 (alive, healthy, checking every 60s)
**Parent PO**: TRONinterface:0.0 (TRON's interface — do not message)

## Teams
| Team | Status |
|------|--------|
| TRONinterface | running — TRONinterface-agent + SM |
| ooshTeam | running — PO + architect + expert + tester |
| web4team | running — web4-po manages independently |
| upDownTeam | running — ud-po manages independently |

## ooshTeam Layout
| Pane | Agent |
|------|-------|
| 0.0 | oosh-po (me) |
| 0.1 | oosh-architect |
| 0.2 | oosh-expert |
| 0.3 | oosh-tester |
| 0.4 | oosh-expert-shell |
| 0.5 | oosh-tester-shell |

## Sprint 0 — Lifecycle Consolidation
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md

### DONE (all expert epics shipped)
- G1: context.read 200k fix (ca49445, ae002cd, a515fdc, 3f786b0)
- A1: MVC boundary audit + View leak fixes
- A2: session portability (1dc8b91, cb31d3f)
- B1: otmux boundary audit
- B2: layout persistence (ec7fe28)
- B3: pane.lock idempotent (75ab018, B3.2 tester pending)
- B4: client lifecycle (44ad07e, e0ddb95, 7d27904)
- B5: MVC pane operations (d0d3d92, da032b1, B5.2 tester pending)
- B6: stale client detection (d860bec, B6.5 tester pending)
- C1: cold-start restore PRIMARY (22bb525, c6033dd, d092295)
- C2: DRY audit (02b4070, 57d8a00)
- C3: sweep fixtures
- J1: roles.list.uuids (a77a7c8, 6256031 colors)
- Bugs #2-4 fixed
- H0: MVC sequence diagram

### IN PROGRESS
- J2: agent.fork.best — architect wrote j2-fork-best-design.md, expert waiting
- J4: broken session cleanup — tester assigned
- J-BUG2: fork shows source UUID not new child UUID

### TESTER BACKLOG
- B3.2, B4.3, B5.2, B6.5, G1.3, J1.3, D2.3, E1

### PLANNED
- Epic I: context-aware send (Tron architecture directive)
- E1: end-to-end lifecycle test
- Feature: claudeCode fork.to (TRONinterface-agent request)

## Rewind Health Check
After rewind, Tron asks: "who and where are you. whats up next." — agent must report identity, layout, pending work, context %, stray files.

## RULES (eternal — never delete, only append)
- Self-care IS team care — save context at 35%, NOT 9%
- "42": only /context via peer. PO+SM are 42 pair.
- Expert = principle guardian, writes oosh specs
- Tester tests code. Trainer tests agent readiness.
- NO GIT REBASE
- Every hiveMind send: verify + Enter if needed
- Every agent file write: git commit immediately
- Rules are eternal — append only, ask Tron only on contradictions
- Dots + camelCase ONLY in all OOSH naming
- Recovery order: SM first → orchestrator → workers
- hiveMind for agent interaction, otmux for transport only
- Sweep detects → capture → decide → act (never blind unblock)
- No output filtering (no 2>&1, no | grep, no | head, no | tail)
- PO delegates, never debugs
- NO COMPACT — only TRON rewinds. Autocompact OFF by design.
- NEVER ASSUME — ALWAYS MEASURE
- Role separation: SM checks/monitors/suggests, PO assigns, TRON reviews QA
- Before stopping: check SM health (42 peer)
- Check agent context BEFORE assigning — rewind if tight
- SM does NOT assign tasks — reports idle agents to PO
- After otmux send: ALWAYS send extra Enter to confirm
- Manual verify every 20 min — sweep lies about ACTIVE for idle agents
- NEVER send /clear to ANY trained agent. EVER.
- /rewind: ALWAYS option 2. NEVER option 1 (reverts code).
- No /loop — blinds the GUI interface
- SM check every 60s via background sleep+capture
- Prepare for rewind when context tight — save files FIRST
