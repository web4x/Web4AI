# oosh-tester Learnings

*Patterns, failures, KPIs — identity after compact.*

## Testing Patterns

### Claude TUI /context output
- `/context` produces ~400+ lines: model info, system prompt, tools, agents, skills
- Token line format: `claude-opus-4-6 · 118k/200k tokens (59%)`
- Token line is near the TOP (~line 5), skills list fills ~400 lines below
- Capture depth must be `-S -` (full scrollback) or `-S -500` minimum
- Use `tail -1` when grepping to get most recent result from multiple /context runs

### Claude TUI slash-command autocomplete
- Typing `/context` triggers a dropdown menu in Claude TUI
- Single `Enter` selects from dropdown, doesn't submit
- Fix: type text + first Enter (accepts selection) + second Enter (submits)
- Or: type text + Escape (dismiss dropdown) + Enter (submit)
- Double-Enter is more reliable than Escape approach

### Claude TUI idle detection
- Claude TUI always renders a status bar below the `❯` prompt:
  ```
  ❯
  ──────────────
    ⏵⏵ accept edits on (shift+tab to cycle)
  ```
- Last non-empty line is NEVER `❯` — it's always the status bar text
- Must scan last 10 lines for `❯`, not check only the last line

### Narrow pane text wrapping
- Narrow tmux panes wrap long lines across multiple terminal lines
- `118k/200k tokens (59%)` can become two lines: `118k/200k` and `tokens (59%)`
- Fix: `tr '\n' ' '` to join all lines before regex matching

### printf and % characters
- `printf "$var"` where $var contains `%` causes format errors
- Always use `printf '%b' "$var"` or `printf '%s' "$var"` for user data

### Fallback parser "remaining" vs "used"
- TUI status bar shows `Context low (0% remaining)` — percentage is REMAINING
- Token line shows `118k/200k tokens (59%)` — percentage is USED
- Must detect "remaining" keyword and skip the `100 - pct` inversion

## Testing Workflow
- Run from ooshDebug:0.1 (bash shell) for interactive testing
- Use `otmux send` and `otmux pane.capture` (OOSH wrappers, not raw tmux)
- Always verify with `otmux pane.capture` after sending commands
- Write reports to `session/tasks/tester-*.done.md`

## Pre-compact Hook Testing
- Hook at `.claude/hooks/pre-compress.sh`
- Simulate by running hook logic in bash -c with controlled PANE_TARGET variable
- 3 fallback detection paths: boot.md scan, pane title, context.md scan
- Self-healing: fallback writes discovered role to registry for future compacts

## c2 Completion Testing
- First Tab press triggers c2's interactive mode (`your command >` prompt), not bash completion
- Double-Tab (`Tab Tab`) shows the full bash completion list at the shell level
- This is existing c2 behavior, not a bug — test with double-Tab
- `complete -p oo` shows registration: `complete -F _oo_completion oo`
- To cancel c2 interactive mode: `C-c` returns to bash prompt
- Branch-specific verification: compare command lists between branches (dev vs main show different scripts)

## Role Boundaries (enforced)
- DO NOT create TaskCreate for self — PO assigns all work
- DO NOT implement fixes — report findings, expert implements
- DO NOT use sleep loops for polling — wait for direction
- Test, report, stand by
