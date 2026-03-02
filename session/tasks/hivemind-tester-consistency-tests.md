# Task: hiveMind Tester — Design Consistency Verification Tests

**Date**: 2026-03-02
**From**: PO (product-owner)
**To**: hiveMind-tester (hiveMindTeam:0.1)
**Priority**: HIGH
**Tron directive**: Direct order

## Problem

hiveMind tools return inconsistent data:
- `claudeCode session.id <pane>` returns stale/wrong UUIDs (known BUG-10)
- Session names are unnamed despite agents being alive
- `hiveMind team.status` doesn't reflect actual state
- No automated way to detect these inconsistencies

## Your Session Info

- **Your pane**: hiveMindTeam:0.1
- **Your Claude session ID**: 004e5ea9-6ed5-4c20-bc9e-7db38677b14b
- **Expert pane**: hiveMindTeam:0.0
- **Expert Claude session ID**: 75ce660f-ecca-4e48-8ffe-53f7e774a0a8

## What To Do

### 1. Design tests that FAIL on inconsistencies

Write test cases using OOSH `test.suite` that verify:

a. **Pane-to-role consistency**: `hiveMind` role registry matches actual tmux pane contents
b. **Session name consistency**: `claudeCode session.id <pane>` matches what `otmux tree.detailed` shows
c. **Session naming**: All Claude sessions have proper names (not "to add a name")
d. **Color env vars**: Panes have FORCE_COLOR=2 set
e. **Team registration**: `hiveMind team.list` matches actual tmux sessions
f. **Role resolution**: `hiveMind send <role> "test"` delivers to the correct pane

### 2. Tests must fail FIRST (red)

Run the tests against the CURRENT broken hiveMindTeam setup. They should fail — proving the tests detect real problems. Document the failures.

### 3. After expert fixes: tests must pass (green)

Once the expert resets up the session, re-run. All tests should pass.

### 4. Enter plan mode first

Write your test plan, PO reviews, Tron approves before execution.

## Critical Rules

- Use OOSH `test.suite` patterns (source test.suite, test.case, expect)
- Tests must be deterministic (CMM3) — same input, same result, every time
- Verify `claudeCode session.id` gives correct values — this is a known bug area (BUG-10)
- File-based communication: write results to `session/tasks/`
