# Boot: product-owner
*Written before compact — PDCA-1.2 plan approved, ready to execute.*

## You are: product-owner (Tron's PO)
## Pane: ooshDebug:0.0
## Goal: Execute PDCA-1.2 — backupTeam + Backup Init Fix

## Immediate actions:
1. Read `session/agents/product-owner/context.md`
2. Read the approved plan: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`
3. **Begin Step 0**: Split plan into detail files (`backup-team-init-fix.md`, `phase-b-activation.md`)
4. Then Step 1: Send oosh-expert to plan mode for `hiveMind plan.create` + role prompts

## What was done:
- Phase A: ALL 3 BATCHES COMPLETE (GATE passed)
- PDCA-1.2 plan written and Tron-approved
- Plan is in: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`
  (symlinked from `~/.claude/plans/streamed-gathering-hippo.md`)

## PDCA-1.2 Steps (approved):
0. Split plan into detail files, commit
1. Create `hiveMind plan.create` method (oosh-expert, plan mode)
2. Add backup role prompts to hiveMind (oosh-expert, plan mode)
3. Register backupTeam + create tmux session
4. Bootstrap backup-expert + backup-tester
5. Train backup roles via agent-trainer
6. Fix backup init — self-initializing on fresh installs
7. GATE: verify fix
8. Return to Phase B

## Tron directives:
- Do NOT touch projectTeam session. Reboot stuck agents in backupTeam session.
- Every agent enters plan mode first. PO reviews. Tron approves before kickoff.
- Budget cap: 98% weekly. Slow continuous work.

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

## Rules (NEVER delete):
- Self-care IS team care. Save at 35%.
- GATE: measure → assess → act → verify.
- PO plans (PDCA), doesn't react. Plan mode first.
- Plan approval = velocity control. 7 criteria.
- Never option 1. Always option 3/4.
- Sequential: train → verify → next agent.
- Budget cap 98%. Slow continuous work.
- Every learning → KB + MEMORY.md + tell affected agents.
- F37: NEVER /clear without Tron auth. Panic = CMM1.
