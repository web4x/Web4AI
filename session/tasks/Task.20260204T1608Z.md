# Task 32 — Validate otmux pane.lock Feature

**Created**: 2026-02-04T15:07Z
**Status**: Open
**Priority**: Normal
**Requested by**: Product Owner (via Orchestrator)
**Assigned to**: oosh-tester

## Original Directive (verbatim)

> Expert implemented `otmux pane.lock` to prevent Claude Code from overwriting tmux pane titles. Needs tester validation.

## Problem

Claude Code overwrites tmux pane titles when running Task tools, losing the agent role names set during team setup. Expert implemented `otmux pane.lock` to prevent this. Needs validation.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-tester | Validate `./otmux pane.lock <pane> <title>` sets title and locks it |
| 2 | oosh-tester | Validate `./otmux pane.unlock <pane>` re-enables renaming |
| 3 | oosh-tester | Validate title persists after Claude Code runs a Task tool |
| 4 | oosh-tester | Validate Tab completion works for pane.lock and pane.unlock |
| 5 | oosh-tester | Validate `./otmux tree` shows clean role names with locked titles |

## Acceptance Criteria

- [ ] `./otmux pane.lock <pane> <title>` sets title and locks it
- [ ] `./otmux pane.unlock <pane>` re-enables renaming
- [ ] Title persists after Claude Code runs a Task tool
- [ ] Tab completion works for both methods
- [ ] `./otmux tree` shows clean role names
- [ ] No regression in other otmux functionality
