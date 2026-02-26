# Product Owner Context

**Updated**: 2026-02-26
**Role**: product-owner
**Pane**: ooshDebug:0.0
**State**: PDCA-1.2 approved, about to compact, then execute

## CURRENT GOAL: Execute PDCA-1.2 — backupTeam + Backup Init Fix

Tron-approved plan for highest priority backup script fix. Backup fails on remote MacStudio (no backup.env). Need to create backupTeam, train agents, fix init.

## PLAN APPROVED — Steps 0-8

Plan file: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`

0. Split plan into detail files (backup-team-init-fix.md, phase-b-activation.md)
1. Create `hiveMind plan.create` method (oosh-expert, plan mode)
2. Add backup-expert/tester role prompts to hiveMind (oosh-expert, plan mode)
3. Register backupTeam + create tmux session (PO)
4. Bootstrap backup-expert + backup-tester (PO)
5. Train backup roles via agent-trainer (plan mode)
6. Fix backup init (backup-expert, plan mode)
7. GATE: verify all
8. Return to Phase B

## TRON DIRECTIVES

- Do NOT touch projectTeam session layout
- Reboot stuck agents in their own team sessions
- Every agent enters plan mode. PO reviews. Tron approves before kickoff.
- Budget cap: 98% weekly

## BUDGET

- Weekly: 1% (fresh reset Feb 26)
- Cap: 98%
- Plenty of room for slow continuous work

## AGENT STATES (last measured)

- Trainer (projectTeam:0.5 or 0.6): idle, was at 43%, received stand-down
- SM (projectTeam:0.4): running, may be low context
- Orchestrator (projectTeam:0.0): DEAD (bare shell, killed force)
- oosh-expert (projectTeam:0.2): unknown (may be at 0%)

## KEY FILES

- Plan: `session/plans/20260223T104218Z.pdca-team-coordination.plan.md`
- Backup script: `/Users/donges/oosh/backup` (1108 lines)
- hiveMind: `/Users/donges/oosh/hiveMind`
- SKILL.md files: `.claude/agents/backup-expert/SKILL.md`, `.claude/agents/backup-tester/SKILL.md`

## NEXT ACTION AFTER COMPACT

1. Read boot.md → this context
2. Read plan file
3. Begin Step 0: create detail files, commit
4. Then Step 1+2: send oosh-expert to plan mode
