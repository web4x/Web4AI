# oosh-tester Learnings

*Patterns, failures, KPIs — identity after compact.*

## Testing Patterns

### USE test.suite FOR ALL TESTING (learned 2026-02-26)
- Existing test files: `test/test.claudeCode`, `test/test.otmux`, `test/test.hiveMind`
- Run: `cd /Users/donges/oosh && bash test/test.<script>`
- Pattern: `source this; source test.suite; test.case $level "desc" cmd; expect.pass/fail "msg"; test.suite.save.results`
- NEVER do ad-hoc manual testing only — always add test cases to the test file
- Existing tests were CMM2 (function-exists). I added CMM4 live behavioral tests.

### Live behavioral testing pattern (2026-02-26)
- Parse `otmux` (no params) output to find ALL Claude panes (lines with `[x.y.z]` version)
- For each: send `/status`, sleep 4, capture 40 lines, `tr '\n' ' '`, parse `Session ID: <uuid>`
- Compare against `claudeCode session.id <pane>`
- Dismiss dialog: `otmux send <pane> Escape`
- This catches session.id mismatches that only appear after agent restarts

### session.id bug root cause (2026-02-26)
- **NOT caused by /compact** — compact preserves the session UUID
- **Caused by restarting agents** (kill + new `claude` in same pane with same role)
- New claude process opens lsof handles to task dirs from ALL previous sessions (history/resume picker)
- Current session UUID may have 0 handles in lsof; old ones have 89+
- Neither `head -1` nor `tail -1` on lsof output helps — the UUID isn't there
- lsof Method 2 in `claudeCode session.id` is fundamentally unreliable after restarts

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
- Claude TUI always renders a status bar below the `❯` prompt
- Last non-empty line is NEVER `❯` — it's always the status bar text
- Must scan last 10 lines for `❯`, not check only the last line

### Narrow pane text wrapping
- Narrow tmux panes wrap long lines across multiple terminal lines
- `118k/200k tokens (59%)` can become two lines
- Fix: `tr '\n' ' '` to join all lines before regex matching

### printf and % characters
- `printf "$var"` where $var contains `%` causes format errors
- Always use `printf '%b' "$var"` or `printf '%s' "$var"` for user data

### Fallback parser "remaining" vs "used"
- TUI status bar shows `Context low (0% remaining)` — percentage is REMAINING
- Token line shows `118k/200k tokens (59%)` — percentage is USED
- Must detect "remaining" keyword and skip the `100 - pct` inversion

## Boot Reading List (ALWAYS read on startup)
- **test.suite script**: `/Users/donges/oosh/test.suite` — the test runner framework, know its API
- **OOSH architecture**: `components/OOSH/dev.claude/docs/oosh-architecture.md` — understand the framework you're testing
- **Existing tests for current script**: e.g. `test/test.claudeCode`, `test/test.otmux` — know what's already covered before writing new tests
- Without these, you're testing blind — CMM1. Read them EVERY boot.

## Testing Workflow
- Run from ooshDebug:0.1 (bash shell) for interactive testing
- Use `otmux send` and `otmux pane.capture` (OOSH wrappers, not raw tmux)
- Always verify with `otmux pane.capture` after sending commands
- Write reports to `session/tasks/tester-*.done.md`
- **Add test cases to test/test.<script> files — not just manual probing**

## Pre-compact Hook Testing
- Hook at `.claude/hooks/pre-compress.sh`
- Simulate by running hook logic in bash -c with controlled PANE_TARGET variable
- 3 fallback detection paths: boot.md scan, pane title, context.md scan
- Self-healing: fallback writes discovered role to registry for future compacts

## c2 Completion Testing
- First Tab press triggers c2's interactive mode (`your command >` prompt), not bash completion
- Double-Tab (`Tab Tab`) shows the full bash completion list at the shell level
- `complete -p oo` shows registration: `complete -F _oo_completion oo`
- Branch-specific verification: compare command lists between branches

## Lead Tester Role (Tron directive — 2026-02-27)
- I am the **head of all specialized testers** (hiveMind-tester, ossh-tester, etc.)
- Specialized testers report results to ME, I review and give feedback
- Agent-trainer handles SKILL.md mechanics — but I provide ALL testing content. Trainer doesn't know testing.
- Always review trainer's SKILL.md edits for testers before they go live
- Own the master test results across all test files
- Coordinate: no gaps, no duplication between testers

### Current Specialized Testers
| Tester | Location | Owns | Reports to |
|--------|----------|------|------------|
| hiveMind-tester | hiveMindTeam:0.1 | hiveMind consistency, registry, identity chain | me |
| (ossh-tester) | osshTeam | ossh, myId (not yet activated) | me |

## Role Boundaries (enforced)
- DO NOT create TaskCreate for self — PO assigns all work
- DO NOT implement fixes — report findings, expert implements
- DO NOT use sleep loops for polling — wait for direction
- Test, report, stand by
