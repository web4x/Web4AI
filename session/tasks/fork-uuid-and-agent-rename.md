# Tasks: Fork UUID Auto-Registration + agent.rename

**Priority**: HIGH
**Date**: 2026-03-25

## Task 1: Fork UUID auto-registration in sessions.env

### Problem

When `claudeCode fork <uuid>` creates a new session, the child gets a NEW UUID but sessions.env still has the parent UUID. `session.id` returns stale data until someone manually runs `consistency.fix`.

Evidence: We forked PO into UpDown_ai_projectTeam:0.0. Parent UUID `936cb9cc`, child UUID `c0726138`. sessions.env had no entry for the child.

### Expert

Read `claudeCode.fork()` in `/Users/donges/oosh/claudeCode` (~line 290). It calls `$CLAUDE_CMD --resume "$sessionId" --fork-session`. After fork completes, the new Claude process has a new UUID — but nobody captures it.

Also check `hiveMind agent.restart` and `hiveMind teams.restore` — they call `claudeCode fork` too. After the fork, they should call `session.probe` to get the child UUID and write it via `private.hiveMind.session.store`.

Fix: after every fork path, probe the pane for the new UUID and store it. One private helper if possible.

### Tester

Write test: simulate fork flow → check sessions.env → UUID should be child, not parent. Test that `session.resolve.uuid` returns the child UUID after fork.

---

## Task 2: hiveMind agent.rename (blocked by Task 1)

### Problem

Renaming an agent currently takes 3 manual steps:
1. `/rename name@model` in TUI
2. `otmux pane.lock <pane> <title>`
3. `hiveMind registry.set <pane> <name>`

### Expert

New method: `hiveMind agent.rename <name> <newName>` — resolves name to pane, then:
1. `otmux send.enter <pane> "/rename <newName>"`
2. `otmux pane.lock <pane> <newName>`
3. `private.hiveMind.registry.set <pane> <newName>`

Tab completion: name from registry, newName free text. One atomic command.

### Tester

Test: rename → verify /rename was sent, pane title matches, registry updated. All three consistent.
