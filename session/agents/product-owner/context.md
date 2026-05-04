# Product Owner Context

**Updated**: 2026-05-04 pre-rewind
**Role**: oosh-po (forked PO for ooshTeam)
**Pane**: ooshTeam:0.0
**SM**: TRONinterface:0.1 (Sonnet, reports to me)
**Parent PO**: TRONinterface:0.0 (TRON's interface — do not message)

## ooshTeam Layout
| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | oosh-po (me) | 80% context — being rewound |
| 0.1 | oosh-architect | ~18% — needs rewind |
| 0.2 | oosh-expert | 100% + rate limited — needs rewind |
| 0.3 | oosh-tester | active, test backlog |
| 0.4 | oosh-expert-shell | bash |
| 0.5 | oosh-tester-shell | bash |

## Sprint 0 — Lifecycle Consolidation
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md

### DONE
- G1: context.read 200k fix (ca49445, ae002cd, a515fdc, 3f786b0)
- A1: MVC boundary audit + View leak fixes
- A2: session portability
- B1: otmux boundary audit
- B2: layout persistence
- B3.1: pane.lock idempotent (tester pending B3.2)
- B4: client lifecycle
- B5.1: MVC pane operations (tester pending B5.2)
- B6: stale client detection (tester pending B6.5)
- B7.1: completion DRY fix — commit adee4cb (tester pending B7.2)
- C1: cold-start restore PRIMARY DELIVERABLE
- C2: DRY audit
- C3: sweep fixtures
- F1-F3: scrumMaster CMM4 reliability
- H0: MVC sequence diagram
- J1: roles.list.uuids — expert delivered + color

### IN PROGRESS
- J2: agent.fork.best — architect delivered design at session/tasks/j2-fork-best-design.md. Key: "most recent" is WRONG, need JSONL size/duration/tool count heuristics to find last TRAINED session
- J3: architect PUML updates
- H1: use case diagrams
- Tester backlog: G1.3, B3.2, B5.2, B4.3, B6.5, B7.2

### PLANNED
- Epic I: context-aware send (INFORM/REMOTE CONTROL/QUEUE)
- E1: end-to-end lifecycle test
- J2 implementation (after design review)

### BUGS
- sweep.detect false-ACTIVE for idle agents
- c2 boot bug (line 636 cd ng) — pre-existing
- SM "Down" keypress leaks

## After Rewind
1. Read this file
2. Read learnings.md
3. hiveMind team.sweep ooshTeam
4. scrumMaster subscription
5. Check agent contexts before assigning
6. Continue sprint from planning.md

## RULES (eternal — never delete, only append)
- Self-care IS team care — save context at 35%, NOT 9%
- "42": only /context via peer
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
- Manual verify every 20 min — sweep lies about ACTIVE for idle agents
- After sending otmux send: ALWAYS send extra Enter to confirm
- NEVER send /clear to ANY trained agent — fork from fallback-agents instead
- /rewind: ALWAYS option 2. NEVER option 1 (reverts code)
- No /loop — blinds GUI
- Wakeups via "sleep xx && echo '...'" — Tron or SM will wake PO
- parameter.completion over method completion for DRY
- PO and SM are a 42 team
