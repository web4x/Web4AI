# Product Owner Context

**Updated**: 2026-04-25 19:59
**Role**: oosh-PO (forked from TRONinterface-agent)
**Pane**: ooshTeam:0.0
**SM**: TRONinterface:0.2 (Sonnet, just restarted — needs periodic nudges)

## Teams
| Team | Status |
|------|--------|
| TRONinterface | running — TRONinterface-agent + SM |
| ooshTeam | running — oosh-po + expert + tester |
| web4team | running — po + architect + expert + tester |
| fallback-agents | parked — causes ambiguity in hiveMind resolve |

## Sprint 0 — Lifecycle Consolidation
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md

### DONE (QA Review for Tron)
- G1: context.read 200k fix — ca49445 + ae002cd
- A1: boundary audit + fixes — 66ddcd6/6d264df/de65ac2, T-BOUNDARY 7/7
- A2: session portability — 1dc8b91 + tester cb31d3f
- B1: otmux boundary audit — done
- B2: layout persistence — done
- B3: pane.lock idempotent — 75ab018
- C1: COLD-START RESTORE (primary deliverable) — 22bb525 + tester d092295 (8 tests)
- C2: DRY audit — done
- C3.1+C3.2: sweep.detect audit + 25 fixtures — afc57d3
- D1: tronMonitor full (D1.1-D1.10) — including Tron-proven recipe 0f9330b
- D2: tronMonitor-hiveMind integration — 597f93e
- F3: subscription API resilience — 7c818c3

### In Progress
- B4: otmux client lifecycle (attach -r, window-size largest) — assigned to expert
- D1.2+D1.3: tronMonitor auto-sync + idempotent setup — assigned to expert
- F1: subscription velocity tracking — assigned to expert
- Tester backlog: B3.2, B4.3, B1.3, B2.3, C3.3, D2.3

### Remaining
- F2: sweep false-positive hardening
- E1: end-to-end lifecycle test (sprint capstone)

## Known Bugs
- fallback-agents causes ambiguous resolve for web4 + SM agents — SM can't unblock web4team via hiveMind
- web4-expert hits PERMISSION every cycle — needs project-level allow rule
- SM (Sonnet) can't sustain loops — needs periodic nudges or watchdog (task #4)

## Token Economics (proven across 10+ hours)
- Subscription counts INPUT only — sustained output FREE
- Each new prompt: ~15-20% of 5h budget (context replay)
- 4+ agents sustained 5h+ at <5% total burn in accept-edits mode

## RULES (eternal — never delete, only append)
- Self-care IS team care — save context at 35%, NOT 9%
- "42": only /context via peer. PO+SM are 42 pair
- Expert = principle guardian, writes oosh specs
- Tester tests code. Trainer tests agent readiness
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
- NO COMPACT unless Tron says — autocompact OFF by design
- Sprint files are PO responsibility — update as work lands
- Role separation: SM checks/monitors/suggests/impediments. PO assigns. TRON reviews QA
- Before stopping: ALWAYS check SM health first
- PO and SM are 42 team — peer measurement, neither alone can self-care
- /rewind option 2 — NEVER option 1 (summarize destroys context)
- Every task = one git commit: '<what changed> (ref: task-<id>.md)'
- After each task: git commit with one-liner referencing task file
- /rewind trigger: prompt too long / context full → rewind to known-good checkpoint
- Every task = one git commit with task file reference
- Commit format: '<what changed> (ref: task-<id>.md)'
- NEVER ASSUME — ALWAYS MEASURE
