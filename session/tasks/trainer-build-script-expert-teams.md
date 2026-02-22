# Task: Build Script Expert Teams

**From**: product-owner (Tron directive)
**To**: agent-trainer
**Priority**: HIGH — foundation for scaling
**Date**: 2026-02-22

---

## Goal

Build specialized script expert teams so the oosh-expert and oosh-tester are NOT overloaded with all scripts knowledge. Each major script gets its own expert+tester pair.

## Why

The oosh-expert just built `hiveMind agent.context.status` (5 commits, 4 bug fixes). The oosh-tester ran 3 test rounds. Both are now at ~40% context. They can't keep accumulating every script's knowledge — they'll burn out context fast.

The **hiveMindTeam session already exists** with:
- `hiveMind-expert` (hiveMindTeam:0.0)
- `hiveMind-tester` (hiveMindTeam:0.1)

These agents are idle since Feb 12. They can be retrained as the hiveMind script specialists.

## The Model

```
oosh-expert = PRINCIPLE GUARDIAN (reviews, consistency, architecture)
  │
  ├── hiveMindTeam → hiveMind script specialists
  │     ├── hiveMind-expert (hiveMindTeam:0.0)
  │     └── hiveMind-tester (hiveMindTeam:0.1)
  │
  ├── [future] otmux team → otmux script specialists
  ├── [future] claudeCode team → claudeCode script specialists
  └── [future] odocker team → odocker script specialists
```

The oosh-expert stays as principle guardian — reviews all oosh changes for convention compliance. But implementation work on individual scripts goes to script teams.

## What to Do

### Phase 1: Retrain hiveMindTeam

1. **Check hiveMindTeam state**:
   ```bash
   otmux pane.capture hiveMindTeam:0.0 30
   otmux pane.capture hiveMindTeam:0.1 30
   ```
   Are they alive? What context %? What do they know?

2. **Boot them with proper roles**:
   - hiveMind-expert: owns hiveMind script, knows the recent fixes (088719a→7d336d2), reads hiveMind source
   - hiveMind-tester: tests hiveMind changes, knows the test cases from retest3.md

3. **Transfer knowledge from oosh-expert**:
   - The oosh-expert just built agent.context.status — that knowledge needs to transfer
   - Send the task file and all test reports to the hiveMind team
   - The minor issues from retest3.md (narrow pane wrapping, timing, printf format) are their first tasks

4. **Verify the team works**:
   - Give them one of the minor fixes (e.g., printf format error)
   - Expert fixes, tester tests
   - Trainer monitors and approves permissions

### Phase 2: Define Handoff Protocol

- When the oosh-expert builds a new feature in a script, the script team inherits maintenance
- Script teams handle polish, bug fixes, edge cases
- Oosh-expert handles architecture decisions and cross-script concerns
- Trainer manages all teams' context health

### Important Rules

- **hiveMindTeam had git rebase problems** (Feb 12 incident). First thing: verify pull.rebase=false and train them on NO REBASE rule
- **Don't send long messages** — write task files, send references
- **Monitor context %** on the hiveMindTeam agents too
- **Tester tests code, trainer tests agent readiness** — same rule applies to all teams

## Session Names

Available sessions (from `otmux`):
- `projectTeam` — main team (12 panes)
- `hiveMindTeam` — hiveMind specialists (2 panes)
- `ooshDebug` — debug/test environment
- `osshTeam` — another team (4 panes, from Feb 17)

## Report Back

Write results to `session/tasks/trainer-script-teams-report.md` and notify PO.
