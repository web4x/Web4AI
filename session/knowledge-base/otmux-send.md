# otmux send Reliability — Details

## Core Issue
Claude TUI doesn't process remote keystrokes like a terminal. Enter=newline not submit. Escape inserts literal `^[` that poisons buffer permanently. Tab doesn't accept edits. No feedback on failure.

## Failure Modes
1. Single Enter = newline, not submit (need double-Enter)
2. Messages queue behind permission dialogs
3. Tab doesn't accept pending edits
4. Rapid sends cause spam ("2222")
5. No failure feedback
6. C-u/C-a/C-k show as literal chars in TUI
7. **NEVER send Escape** — poisons buffer irreversibly, 12 cycles stuck
8. New agent != restored peer — use `claude --resume` first
9. `otmux send.verified` method: send + verify via pane capture (805aecc)

## Fix
`otmux send.verified` (commit 805aecc) captures before/after, confirms delivery. Use for ALL sends.

## If Buffer Poisoned
Only manual keyboard input fixes it. No remote fix exists.

## References
- Bug list: `session/oosh-bugs.md`
- Commit: 805aecc (send.verified implementation)

## Action Checklists
-> session/knowledge-base/actions/send-message.md
-> session/knowledge-base/actions/unblock-permission.md
