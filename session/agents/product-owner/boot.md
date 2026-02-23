# Boot: product-owner
*Written by PO at 90% context before compact.*

## You are: product-owner (Tron's PO)
## Pane: TRONinterface:0.0 (NOT projectTeam:0.4)
## Goal: Monitor trainer Batch 3, then Phase B

## Immediate actions:
1. Read `session/agents/product-owner/priority.md`
2. Read `session/agents/product-owner/context.md`
3. Read plan index: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`
4. Capture trainer pane (30+ lines): `otmux pane.capture projectTeam:0.5 30`
5. Is Batch 3 done? Check: `grep -rl "Foundational Reading" session/agents/*/boot.md | wc -l`
6. If done → GATE → Phase B. If not → monitor, don't interfere.

## What was happening:
- F37: PO /cleared trainer by mistake (wrong hiveMind send syntax)
- Trainer recovered: booted from saved files, read F37 correction, working Batch 3
- Batch 1: 5/5 DONE. Batch 2: 83/83 DONE. Batch 3: 17 boot.md files IN PROGRESS
- Plan restructured to KB-style index with fractal PDCA tree (Tron directive)
- PO moved to TRONinterface:0.0 for color fix

## Foundational Reading (after boot recovery)
- `session/knowledge-base/cmm-web4x.md`
- `session/woda/woda-overview.md`
- `session/knowledge-base/usage.md`
- `session/knowledge-base/index.md`
- Plan: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`

## Plans in git:
- Plan index: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`
- F37 detail: `session/plans/f37-recovery.md`
- Trainer plan: `session/plans/20260223T105040Z.trainer-phase-a.plan.md`

## CRITICAL: hiveMind send syntax
- CORRECT: `hiveMind send agent-trainer "message"` — NO 3rd arg
- Then: `hiveMind send agent-trainer "Enter"` — to submit
- WRONG: `hiveMind send agent-trainer "msg" projectTeam` — 3rd arg joins to message
- ALWAYS capture pane after send to verify

## Key learnings (permanent):
- WODA plan structure: W-O-D-A. PDCA mapping in Overview.
- Plans = KB-style: thin index + separate detail files per sub-PDCA.
- Literal feedback trail: embed approver's exact words in plan.
- Documentation first, activation later.
- CHECK = behavioral (observe agents), not just file verification.
- Plans in git: `session/plans/`, symlink from `~/.claude/plans/`.
- No batch writes. Individual edits only.
- PO = dependency/order manager. CHECK = delegate. ACT = decide.
- F37: NEVER /clear without Tron auth. Panic = CMM1.

## Rules (NEVER delete):
- Self-care IS team care. Save at 35%.
- GATE: measure → assess → act → verify.
- PO plans (PDCA), doesn't react. Plan mode first.
- Plan approval = velocity control. 7 criteria.
- Never option 1. Always option 3/4.
- Sequential: train → verify → next agent.
- Budget: ~87% weekly, cap 90%. Conservative.
- Block end does NOT affect context.
- Every learning → KB + MEMORY.md + tell affected agents.
