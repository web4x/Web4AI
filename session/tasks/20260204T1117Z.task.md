# Task 24 — Deterministic Agent Recovery Process (CMM3)

**Created**: 2026-02-03T11:54Z
**Status**: Steps 1,4 Done (commit c87e96d, Tester validated PASS) — Steps 2-3 pending (Agent Trainer)
**Requested by**: Product Owner (via claudeWoda/Tron — CMM2→CMM3 initiative)
**Assigned to**: oosh-expert

## Original Directive (verbatim)

> Recovery is agent-dependent not deterministic. Plan tasks to standardize agent lifecycle: deterministic recovery process.

## Problem

After compact/restart, each agent recovers differently. Some re-read SKILL.md first, some check context files, some just start working. Recovery success depends on individual agent behavior, not a defined process. This must become a deterministic sequence that any agent follows identically.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Define a deterministic recovery sequence (ordered steps every agent must follow post-compact) |
| 2 | oosh-expert | Implement recovery as a callable method (e.g., `agent.recover`) that enforces the sequence |
| 3 | agent-trainer | Update all SKILL.md files with the standardized recovery protocol |
| 4 | oosh-tester | Test recovery: compact an agent, verify it follows the defined sequence exactly |

## Acceptance Criteria

- [ ] Recovery sequence defined as ordered, non-optional steps
- [ ] Recovery method callable by any agent post-compact
- [ ] All agents follow the same recovery path (no agent-specific logic)
- [ ] All SKILL.md files updated
- [ ] Recovery tested end-to-end
