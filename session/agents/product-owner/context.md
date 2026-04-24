# Product Owner Context

**Updated**: 2026-04-24 10:36
**Role**: product-owner
**Pane**: TRONinterface:0.0 (MacStudio.native)
**PO Shell**: TRONinterface:0.1
**SM**: TRONinterface:0.2 (Sonnet, sweep monitor)
**tronMonitor**: TRONinterface:0.3 (GNU screen)

## Teams
| Team | Status |
|------|--------|
| TRONinterface | running — PO + SM |
| ooshTeam | running — expert + tester |
| web4team | running — po + architect + expert + tester |

## Sprint 0 — Lifecycle Consolidation
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md

### Current Priority
- **G1 (BLOCKER)**: claudeCode context.read hardcodes 200k — returns -226% for 1M agents. Expert fixing NOW. Lines 1386, 1643, 1720, 1725, 1723 in claudeCode.
- **A1.1**: DONE (QA REVIEW) — 68 methods, 14 View leaks, 4 Controller leaks
- **A1.3 + C2.3**: DONE — boundary + DRY tests (commit 57d8a00)
- **C2**: DONE (QA REVIEW) — all 3 subtasks
- **C3.1**: DONE — sweep.detect false-positive audit
- **D1.1**: DONE — tronMonitor add validation + prune
- **C3.3**: Tester working — fixture-based sweep tests

### Next After G1
- A1.2 (View leak identification)
- C3.2 (18-state test fixtures)
- Epic F (scrumMaster CMM4 reliability)

## Key Learnings This Session
- Subscription counts INPUT tokens only — sustained output is FREE
- 4 agents ran 5h+ at +5% total subscription burn in accept-edits mode
- Each new prompt costs ~15-20% of 5h budget (context replay)
- Claude agents CANNOT sustain loops — use hiveMind watchdog or /loop
- Sprint files are PO responsibility — update as work lands
- NEVER compact agents — only TRON authorizes
- Use hiveMind for agent interaction, never raw otmux
- Autocompact is OFF by design

## RULES (eternal — never delete, only append)

- Self-care IS team care — save context at 35%, NOT 9%
- "42": only /context via peer
- Expert = principle guardian, writes oosh specs
- Tester tests code. Trainer tests agent readiness.
- NO GIT REBASE
- Script expert teams — distribute, don't overload
- `otmux` no args for overview
- Every hiveMind send: verify + Enter if needed
- Every agent file write: git commit immediately
- Rules are eternal — append only, ask Tron only on contradictions
- Dots + camelCase ONLY in all OOSH naming — no dashes, no underscores
- Recovery order: SM first → orchestrator → workers
- Monitor ALL panes including orchestrator
- "Slow down" = no new large tasks, current work finishes
- /clear ONLY at 0%. Never above
- hiveMind for agent interaction, otmux for transport only
- Sweep detects → capture → decide → act (never blind unblock)
- No output filtering (no 2>&1, no | grep, no | head, no | tail)
- PO delegates, never debugs — write bug reports, don't trace code
- NO COMPACT unless Tron says — autocompact OFF by design
- Task-switching: finish current task, queue new via TaskCreate
- Sprint files are PO responsibility — update as work lands, present for QA review
- Claude agents cannot loop — use hiveMind watchdog or /loop for persistent monitoring
- Subscription counts INPUT only — sustained output (accept-edits) is FREE
- NEVER ASSUME — ALWAYS MEASURE
