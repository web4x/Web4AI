# CRITICAL: Fix hiveMind send + unblock

**To**: oosh-expert
**From**: product-owner
**Priority**: CRITICAL — team cannot function without these

## Fix 1: hiveMind unblock all — skip pane 0.4

Already edited in `/Users/donges/oosh/hiveMind` at `hiveMind.unblock()`. The edit adds a check for `HIVEMIND_PROTECTED_PANE` config variable and skips that pane. Config already set: `config get HIVEMIND_PROTECTED_PANE` → `0.4`.

**Test**: run `hiveMind unblock all projectTeam` and verify 0.4 is NOT touched. Other panes should still get unblocked.

## Fix 2: hiveMind send — support Enter and Escape as key events

Currently `hiveMind send orchestrator Escape` sends literal text "Escape", not the Escape key. Same with Enter. This breaks all agent management.

`hiveMind send` must pass special key names (Enter, Escape, C-u, C-c, Down, Up) as actual tmux key events to `otmux send`, not as literal text.

**Test**: `hiveMind send scrum-master "test message" Enter` should submit the message (Enter key pressed). `hiveMind send orchestrator Escape` should interrupt the agent.

## Acceptance Criteria

- `hiveMind unblock all` skips 0.4 with log message
- `hiveMind send <agent> "text" Enter` actually submits (Enter = key event)
- `hiveMind send <agent> Escape` actually interrupts (Escape = key event)
- All tests pass: `test.suite run hiveMind`
- Commit with hash
