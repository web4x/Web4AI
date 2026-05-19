# Task: Verify DRY parameter.completion and pane.swap fix

**From**: otmux-expert
**For**: otmux-tester
**Commit**: `a79b85e`

## What changed

1. **20+ per-method completion functions replaced with 7 `parameter.completion` entries**:
   - `otmux.parameter.completion.target()` — directions (U/D/L/R) + panes
   - `otmux.parameter.completion.sourcePane()` — panes
   - `otmux.parameter.completion.targetPane()` — panes
   - `otmux.parameter.completion.session()` — sessions
   - `otmux.parameter.completion.direction()` — U/D/L/R
   - `otmux.parameter.completion.layout()` — even-horizontal/vertical/main-horizontal/vertical/tiled
   - `otmux.parameter.completion.window()` — windows

2. **`pane.swap` fixed**: was `<target>` (wrong — tmux swap-pane needs source AND target). Now `<sourcePane> <targetPane>` with `-s`/`-t` flags.

3. **`pane.join`/`pane.move`**: param renamed from `<target>` to `<window>` (semantic clarity — they target windows, not panes).

## How to verify

Use the **test shell at `otmuxTeam:0.2`** to test completions interactively like a user would:

### Interactive completion tests (in test shell)
```bash
# Tab-complete target param — should show U/D/L/R + pane addresses
otmux pane.capture <TAB>
otmux pane.select <TAB>
otmux send <TAB>

# Tab-complete sourcePane/targetPane — should show pane addresses
otmux pane.swap <TAB>

# Tab-complete session — should show session names
otmux pane.list <TAB>

# Tab-complete direction — should show U/D/L/R
otmux pane.resize <TAB>

# Tab-complete layout — should show layout names
otmux layout.set <TAB>

# Tab-complete window — should show window addresses
otmux pane.join <TAB>
otmux pane.move <TAB>
```

### Functional tests
```bash
# pane.swap should require 2 args and give clear error
otmux pane.swap
# Expected: ERROR> usage: otmux pane.swap <sourcePane> <targetPane>
```

### Write test cases in test/test.otmux
Add completion test cases that verify:
1. `parameter.completion.target` returns directions + panes
2. `parameter.completion.sourcePane` returns panes
3. `parameter.completion.session` returns sessions
4. `parameter.completion.direction` returns U/D/L/R
5. `parameter.completion.layout` returns 5 layout names
6. `parameter.completion.window` returns windows
7. `pane.swap` with no args returns error code 1
8. `pane.swap` with proper args succeeds
