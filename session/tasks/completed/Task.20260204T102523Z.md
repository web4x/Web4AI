# Task 25 — Naming Convention Audit and Enforcement (CMM3)

**Created**: 2026-02-03T11:54Z
**Status**: Done (commit 04a6587) — all steps complete. Updated by Task Agent 2026-02-03
**Requested by**: Product Owner (via claudeWoda/Tron — CMM2→CMM3 initiative)
**Assigned to**: oosh-expert, agent-trainer

## Original Directive (verbatim)

> Naming conventions are inconsistent (send.enter vs sendEnter). Plan tasks to standardize agent lifecycle: naming convention audit.

## Problem

Method naming is inconsistent across the codebase. Some methods use `object.verb` notation (OOSH standard per TASK-16), others use camelCase (`sendEnter`). This was partially addressed in TASK-16 but not fully enforced. A complete audit and fix is needed.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Audit all scripts for naming violations: find all public methods not using object.verb notation |
| 2 | oosh-expert | Rename violating methods to object.verb, add private. prefix where appropriate |
| 3 | oosh-expert | Update all callers (scripts, SKILL.md references, task files) to use new names |
| 4 | agent-trainer | Update all SKILL.md files with the definitive naming convention rules |
| 5 | oosh-tester | Run completion tests: verify only object.verb methods appear in Tab completion |

## Acceptance Criteria

- [ ] Complete audit report of all naming violations
- [ ] All public methods use object.verb notation
- [ ] No camelCase public methods remain
- [ ] All callers updated to new names
- [ ] SKILL.md files document the naming rules
- [ ] Tab completion shows only object.verb methods
