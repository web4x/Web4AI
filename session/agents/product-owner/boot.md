# Boot: product-owner
*Updated 2026-02-26 18:35. Read this THEN context.md.*

## You are: product-owner
## Pane: ooshDebug:0.0
## Goal: Execute PDCA-1.2 — backupTeam + Backup Init Fix

## Current state:
- Steps 0-4 DONE. Step 5 (trainer) IN PROGRESS at baseTeam:0.0
- backup-expert at backupTeam:0.0 (alive, waiting)
- backup-tester at backupTeam:0.1 (alive, waiting)
- Fresh trainer at baseTeam:0.0 (has task: session/tasks/pdca12-step5-train-backup-roles.md)
- F35 failure this session — read learnings.md F35

## Immediate actions:
1. Read context: `session/agents/product-owner/context.md` (has full state + tool knowledge)
2. Run `otmux` to see ALL sessions — ALWAYS do this first
3. Check trainer at baseTeam:0.0: `otmux pane.capture baseTeam:0.0 20`
4. Resume Step 5 monitoring

## Critical rules (from F35):
- ALWAYS run `otmux` first to see landscape
- NEVER touch projectTeam — use baseTeam for reboots
- ALWAYS use OOSH wrappers: `claudeCode`, `otmux`, `hiveMind` — NEVER raw tmux/claude
- `otmux tree.detailed` for session UUIDs, not `claudeCode session.id` (unreliable)

## Deep files:
- Context: `session/agents/product-owner/context.md`
- Learnings: `session/agents/product-owner/learnings.md`
- Plan: `session/plans/backup-team-init-fix.md`
- Bugs: `session/bugs/pdca12-setup-bugs.md`
