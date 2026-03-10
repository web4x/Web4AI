# Task 26 — Fix claudeCode status method (bug)

**Created**: 2026-02-03T13:15Z
**Status**: Done (commit 2eeafbd) — updated by Task Agent 2026-02-04
**Requested by**: Product Owner (via woda-writer)
**Assigned to**: oosh-expert, oosh-tester

## Original Directive (verbatim)

> claudeCode status method is broken - calling claudeCode status launches a new Claude Code instance instead of showing status. It should be a method that shows agent status without launching TUI. Fix it.

## Problem

`./claudeCode status` is not dispatching to a `claudeCode.status()` method — instead it falls through to launching the Claude Code TUI. The method either doesn't exist or the dispatch isn't matching it.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Diagnose why `claudeCode status` launches TUI instead of calling a status method |
| 2 | oosh-expert | Implement or fix `claudeCode.status()` to show agent status without launching TUI |
| 3 | oosh-tester | Validate `./claudeCode status` shows status output, does NOT launch TUI |

## Acceptance Criteria

- [ ] `./claudeCode status` calls `claudeCode.status()` method correctly
- [ ] Output shows agent status information (not a TUI launch)
- [ ] Other claudeCode methods still work (no dispatch regression)
- [ ] Tests pass
