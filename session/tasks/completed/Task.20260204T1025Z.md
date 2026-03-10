# Task 22 — Defined Context File Schema (CMM3)

**Created**: 2026-02-03T11:54Z
**Status**: Done (commits 7afef99, a351e09) — updated by Task Agent 2026-02-03
**Requested by**: Product Owner (via claudeWoda/Tron — CMM2→CMM3 initiative)
**Assigned to**: oosh-expert, agent-trainer

## Original Directive (verbatim)

> Context file format is a loose template not a validated schema. Plan tasks to standardize agent lifecycle: defined context format.

## Problem

Agent context files (`session/agents/*.context.md`) follow a loose prose template. Each agent writes different sections in different formats. No validation exists — recovery depends on whatever the agent happened to save.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Define a strict context file schema (required sections, field names, format) |
| 2 | oosh-expert | Implement a `context.validate` method that checks a context file against the schema |
| 3 | agent-trainer | Update all SKILL.md files with the defined context format |
| 4 | oosh-tester | Validate that all current context files pass the schema check |

## Acceptance Criteria

- [ ] Context file schema documented with required/optional sections
- [ ] Validation method exists and can be called programmatically
- [ ] All SKILL.md files reference the defined schema
- [ ] Existing context files conform or are migrated
