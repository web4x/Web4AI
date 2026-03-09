# Task 23 — Automated Save-Before-Compact (CMM3)

**Created**: 2026-02-03T11:54Z
**Status**: Done (commit 9f1180b) — updated by Task Agent 2026-02-03
**Requested by**: Product Owner (via claudeWoda/Tron — CMM2→CMM3 initiative)
**Assigned to**: oosh-expert

## Original Directive (verbatim)

> Save-before-compact is prose instructions not a state machine. Plan tasks to standardize agent lifecycle: automated save triggers.

## Problem

Current save-before-compact is a prose instruction in SKILL.md: "at 20% context, stop and save." This is unreliable — agents forget, misjudge context level, or save incomplete state. Needs to be a deterministic state machine, not a voluntary checklist.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Design a state machine for agent lifecycle: active → low-context → saving → compacting → recovering |
| 2 | oosh-expert | Implement automated save trigger using OOSH `state` script — detects low context and forces save |
| 3 | agent-trainer | Update all SKILL.md files to reference the state machine instead of prose instructions |
| 4 | oosh-tester | Test state transitions: simulate low-context → verify save fires → verify compact proceeds |

## Acceptance Criteria

- [ ] State machine defined with explicit states and transitions
- [ ] Save trigger is automated, not voluntary
- [ ] State machine uses OOSH `state` script
- [ ] All SKILL.md files updated to reference the mechanism
- [ ] Tests cover each state transition
