# Product Owner Context

**Updated**: 2026-05-01 11:46
**Role**: oosh-po (forked PO for ooshTeam)
**Pane**: ooshTeam:0.0
**SM**: TRONinterface:0.1 (dead — context exhausted)
**Parent PO**: TRONinterface:0.0 (TRON's interface — do not message)

## Teams
| Team | Status |
|------|--------|
| TRONinterface | running — parent PO + dead SM |
| ooshTeam | running — PO + architect + expert + tester |
| web4team | running — web4-po manages independently |

## ooshTeam Layout
| Pane | Agent | Last Known Context |
|------|-------|--------------------|
| 0.0 | oosh-po (me) | CRITICAL — needs rewind |
| 0.1 | oosh-architect | 8.9% — needs rewind |
| 0.2 | oosh-expert | 83% (835k) — last task B6 |
| 0.3 | oosh-tester | 17.9% — needs rewind |
| 0.4 | oosh-expert-shell | bash |
| 0.5 | oosh-tester-shell | bash |

## Sprint 0 — Lifecycle Consolidation
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md

### DONE
- G1: context.read 200k fix (ca49445, ae002cd, a515fdc, 3f786b0)
- A1: MVC boundary audit + View leak fixes (66ddcd6, 6d264df, de65ac2, 559e03a)
- A2: session portability (1dc8b91, cb31d3f)
- B1: otmux boundary audit (dc9d2cb, 9b7138e)
- B2: layout persistence (ec7fe28)
- B3: pane.lock idempotent (75ab018, B3.2 tester pending)
- B4: client lifecycle — attach readonly + window-size largest (44ad07e, e0ddb95, 7d27904)
- B5: MVC pane operations — View→Controller registry updates (d0d3d92, da032b1, 163b0a0, B5.2 tester pending)
- C1: cold-start restore PRIMARY (22bb525, c6033dd, d092295)
- C2: DRY audit (02b4070, 57d8a00)
- C3: sweep fixtures (eca047a, b3a63ae, bb76bb6, afc57d3)
- Bug #2: unblock-all allowlist (8d01421)
- Bug #3: sender prefix swap (163b0a0)
- Bug #4: send.message leak (19fa1b7, tester 654b177)
- H0: MVC sequence diagram PUML

### IN PROGRESS
- B6: client lifecycle — stale client detection + cleanup + layout restore (JUST ASSIGNED to expert)
- H1: architect use case diagrams (Tron reviewed — wants fully qualified object.method names)

### PLANNED
- Epic I: context-aware send (INFORM/REMOTE CONTROL/QUEUE — Tron architecture directive)
- E1: end-to-end lifecycle test

### BUGS REMAINING
- sweep.detect false-ACTIVE for idle agents (caught 3x during session, 50 min wasted each time)
- fallback-agents registry entries renamed to fallback-* prefix (done manually)
- SM dead — Sonnet context exhausted, needs restart

## Agents 30h+ sustained at 0% subscription
Expert and tester ran 30+ hours in sustained generation at 0% subscription cost. Proven: output tokens in accept-edits mode are free. Only input tokens (new prompts) cost.

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
- Check agent context BEFORE assigning — rewind if tight, never pump exhausted agents
- SM escalation: SM → team PO → oosh-PO (only if team PO dead)
- SM does NOT assign tasks — reports idle agents to PO
- Context check is part of EVERY sweep, not just when assigning
- After sending otmux send: ALWAYS send extra Enter to confirm submission
- Manual verify every 20 min — sweep lies about ACTIVE for idle agents
