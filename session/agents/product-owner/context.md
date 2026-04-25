# Product Owner Context

**Updated**: 2026-04-25 01:00
**Role**: TRONinterface-agent (master PO)
**Pane**: TRONinterface:0.0
**Forked oosh-PO**: ooshTeam:0.0
**SM**: TRONinterface:0.2 (Sonnet, rewound, reports to oosh-po)
**Fallback session**: fallback-agents (8 forked agents)

## Teams
| Team | Status |
|------|--------|
| TRONinterface | running — TRONinterface-agent + SM |
| ooshTeam | running — oosh-po + expert + tester |
| web4team | running — po + architect + expert + tester |
| fallback-agents | parked — 8 forked backups |

## Sprint 0 — Status
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md

### Completed (QA REVIEW for Tron)
- G1: context.read 200k fix — ca49445 + ae002cd (DRY constants)
- A1: boundary audit — 68 methods, 14 View leaks
- A2: session portability — 1dc8b91
- B1: otmux boundary audit — done
- B2: layout persistence — done
- C1: COLD-START RESTORE (primary deliverable) — 22bb525 + 971f68a
- C2: DRY audit — done
- F3: subscription API resilience — 7c818c3

### In Progress
- C3: sweep.detect fixtures — C3.1 done, C3.2+C3.3 pending
- D1: tronMonitor — D1.1 done, D1.2+D1.3 assigned (TMUX= -r requirements sent)
- E1: end-to-end test — expert ran verification, 125/201 claudeCode passing, 51 environmental

### Planned
- D2: tronMonitor-hiveMind integration
- F1: subscription velocity tracking
- F2: sweep false-positive hardening

## Token Economics (proven)
- Subscription counts INPUT only — sustained output (accept-edits) is FREE
- Each new prompt: ~15-20% of 5h budget (context replay)
- 4 agents ran 5h+ at +5% total in sustained generation

## RULES (eternal — never delete, only append)
- Self-care IS team care — save context at 35%, NOT 9%
- "42": only /context via peer
- Expert = principle guardian, writes oosh specs
- Tester tests code. Trainer tests agent readiness.
- NO GIT REBASE
- Script expert teams — distribute, don't overload
- Every hiveMind send: verify + Enter if needed
- Every agent file write: git commit immediately
- Rules are eternal — append only, ask Tron only on contradictions
- Dots + camelCase ONLY in all OOSH naming
- Recovery order: SM first → orchestrator → workers
- Monitor ALL panes including orchestrator
- hiveMind for agent interaction, otmux for transport only
- Sweep detects → capture → decide → act (never blind unblock)
- No output filtering (no 2>&1, no | grep, no | head, no | tail)
- PO delegates, never debugs
- NO COMPACT unless Tron says — autocompact OFF by design
- Sprint files are PO responsibility — update as work lands
- Role separation: SM checks/monitors/suggests/impediments. PO assigns. TRON reviews QA.
- Before stopping: ALWAYS check SM health first
- PO and SM are 42 team — peer measurement
- /rewind option 1 "Restore code and conversation" — NEVER option 2 (summarize destroys context)
- /rewind trigger: prompt too long / context full → rewind to known-good checkpoint
- Every task = one git commit with task file reference
- Commit format: '<what changed> (ref: task-<id>.md)'
