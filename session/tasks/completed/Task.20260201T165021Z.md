# TASK-13: Fix otmux sendEnter + hiveMind send exit code

## User Directive (verbatim)

> All agents have trouble reliably sending Enter to unblock accept-edits prompts. Create a task for Expert and Tester to fix otmux sendEnter so it works reliably. Also hiveMind send just failed with exit code 1 - that needs fixing too.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | Expert | Fix otmux sendEnter with -l flag + separate Enter + sleep |
| 2 | Expert | Fix hiveMind send exit code 1 with explicit return 0 |
| 3 | Expert | Add otmux send.keys helper for TUI interactions |
| 4 | Tester | Validate all fixes |

## Status: DONE

- Committed 9ec0742
- otmux sendEnter fixed with -l flag + separate Enter + sleep for TUI reliability
- hiveMind send exit code 1 fixed with explicit return 0
- Added otmux send.keys helper for ScrumMaster TUI interactions
