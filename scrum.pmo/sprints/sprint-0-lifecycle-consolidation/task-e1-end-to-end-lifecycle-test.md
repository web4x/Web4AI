[Back to Planning Sprint 0](./planning.md)

# Task E1: End-to-End Lifecycle Test
[task:uuid:5e7bd287-e0dd-4338-a8e5-7a30fdb28df4]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic E (Integration)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task E1.1: Tester - Setup-Save-Kill-Restore Cycle](./task-e1.1-tester-setup-save-kill-restore-cycle.md)
    - [Task E1.2: Tester - Post-Restore Verification](./task-e1.2-tester-post-restore-verification.md)
    - [Task E1.3: Tester - tronMonitor Shows Restored Team](./task-e1.3-tester-tronmonitor-shows-restored-team.md)

## Task Description
The sprint's final validation: an end-to-end test that exercises the complete lifecycle across all MVC layers. Setup a team, save state, kill tmux server, restore from config, and verify everything works. This is the Definition of Done for the sprint.

## Context
This task depends on all other tasks being complete. It validates that the MVC layers work together correctly:
- claudeCode (Model) provides session data without tmux
- otmux (View) saves and restores layouts
- hiveMind (Controller) orchestrates the full restore
- tronMonitor (Monitor) auto-syncs with restored teams

The test cycle: setup -> save -> kill -> restore -> verify

Key files: `/Users/donges/oosh/claudeCode`, `/Users/donges/oosh/otmux`, `/Users/donges/oosh/hiveMind`, `/Users/donges/oosh/tronMonitor`

## Intention

### Why This Task Exists:
1. **Sprint Validation:** Proves the sprint goal is met
2. **Integration Confidence:** Verifies all layers work together
3. **Regression Gate:** This test must pass before sprint is Done

### Problems This Task Solves:
- **Unit vs integration gap:** Individual tasks may pass but integration may fail
- **Assumption validation:** Verifies cross-layer contracts actually work
- **Definition of Done enforcement:** Binary pass/fail for sprint completion

### How This Task Solves These Problems:
- **Full lifecycle exercise:** Tests the complete setup-save-kill-restore cycle
- **Cross-layer verification:** Checks Model, View, Controller, Monitor together
- **Pass/fail gate:** Sprint is not Done until this test passes

---

*Sprint 0 - Lifecycle Consolidation*
*Epic E: Integration*
*Priority: 1 (CRITICAL - Sprint Validation)*
