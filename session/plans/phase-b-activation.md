# Phase B Detail: Agent Activation

**Parent**: PDCA-1 Team Coordination
**Date**: 2026-02-26
**Resumes after**: PDCA-1.2 completes

## Steps

1. **Notify SM**: Send task file about updated SKILL.md (4 governance responsibilities)
   - Status: DONE (sent `session/tasks/phase-b-sm-notification.md`)

2. **Activate orchestrator**: Boot with updated files, enter plan mode, PO approves
   - Task file: `session/tasks/phase-b-orchestrator-activation.md`
   - Note: orchestrator (projectTeam:0.0) currently DEAD (bare shell). Reboot in own team session per Tron directive.

3. **DRY send fix**: Orchestrator coordinates hiveMindTeam -- `hiveMind send` appends Enter
   - INC-004 / DRY consolidation
   - Problem: `hiveMind.send()` calls `otmux.send()` which does NOT call the INC-001 fixed code path
   - Solution: Change `hiveMind.send()` to use `otmux.send.enter()`

4. **scrumMaster wrapper**: `scrumMaster team.context.status` (budget permitting)

5. **Report to Tron**: Deliverables, commits, what remains
