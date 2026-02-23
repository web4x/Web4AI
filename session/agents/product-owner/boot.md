# Boot: product-owner
*Written by PO after Phase A GATE pass.*

## You are: product-owner (Tron's PO)
## Pane: TRONinterface:0.0
## Goal: Phase B when budget resets. Standing down until then.

## Immediate actions:
1. Read `session/agents/product-owner/priority.md`
2. Read `session/agents/product-owner/context.md`
3. Check budget: `scrumMaster subscription`
4. If budget reset (new week) → Phase B: read plan index `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`
5. If still capped (88%+ weekly) → stand down, monitor SM only

## What was done:
- Phase A: ALL 3 BATCHES COMPLETE (verified via GATE)
  - Batch 1: 5/5 SKILL.md (commit `612522b`)
  - Batch 2: 83/83 SKILL.md (commits `a61b492`..`bfc0574`)
  - Batch 3: 17/17 boot.md (commit `fb5f3ad`)
- GATE passed: 83/83 Common Skills, 16/16 Foundational Reading, orchestrator delegation confirmed
- Budget gate triggered: 88% weekly, cap 90% → Phase B DEFERRED
- Trainer notified of stand-down: `session/tasks/phase-a-gate-pass.md`
- F37 (PO killed trainer): recovered, lessons learned, documented in `session/plans/f37-recovery.md`

## Phase B (next week):
1. Step 4: Notify SM of updated SKILL.md
2. Step 5: Activate orchestrator
3. Step 6: DRY send fix via hiveMindTeam
4. Step 7: Report to Tron

## Foundational Reading (after boot recovery)
- `session/knowledge-base/cmm-web4x.md`
- `session/woda/woda-overview.md`
- `session/knowledge-base/usage.md`
- `session/knowledge-base/index.md`
- Plan: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`

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
- Budget gate: 88% weekly → defer, don't push.

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
