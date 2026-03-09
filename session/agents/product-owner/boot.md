# Boot: product-owner
*Updated 2026-03-03 14:50. Read this THEN context.md.*

## You are: product-owner
## Pane: ooshDebug:0.0
## Goal: Monitor hiveMindTeam — live-fact discovery + process.lookup tests

## Current state:
- hiveMindTeam02_03_26 created (2 panes, correct names/colors)
- Expert (0.0): DONE — committed live-fact discovery (fea74d5) + process.lookup/list (6e25180)
- Tester (0.1): IN PROGRESS — running T-CONSIST tests against new implementation
- Tester identity was wrong (BUG-6 pre-compact hook) — corrected manually
- PDCA-1.2 Step 5 trainer at baseTeam:0.0 has approved plan, waiting for GO
- otmux send Enter bug confirmed AGAIN — messages sit unsubmitted during agent mid-turn

## Immediate actions:
1. Read context: `session/agents/product-owner/context.md`
2. Run `otmux` to see ALL sessions — ALWAYS do this first
3. Check tester at hiveMindTeam02_03_26:0.1 — is it done with tests?
4. Check expert at hiveMindTeam02_03_26:0.0 — idle, ready for next task
5. Resume PDCA-1.2 Step 5 monitoring (trainer at baseTeam:0.0)

## Critical rules:
- ALWAYS run `otmux` first to see landscape
- NEVER touch projectTeam — use baseTeam for reboots
- ALWAYS use OOSH wrappers: `claudeCode`, `otmux`, `hiveMind` — NEVER raw tmux/claude
- `otmux tree.detailed` for session UUIDs, not `claudeCode session.id` (unreliable)
- otmux send Enter doesn't work during agent mid-turn — verify submission after every send

## Deep files:
- Context: `session/agents/product-owner/context.md`
- Learnings: `session/agents/product-owner/learnings.md`
- Plan: `session/plans/backup-team-init-fix.md`
- Bugs: `session/bugs/pdca12-setup-bugs.md`
