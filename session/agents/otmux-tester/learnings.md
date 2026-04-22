# otmux-tester Learnings

## L0: Self-Awareness (2026-03-11)
- `otmux pane.get.target` → own pane address
- `hostname` → host identity
- `claudeCode session.id <pane>` → session UUID
- Always run these on boot to confirm identity

## L1: Split methods bug — root cause (2026-03-11)
- `otmux split.h`, `split.v`, `split` all do `$TMUX_CMD split-window -h "$@"`
- They pass `"$@"` raw — tmux interprets the first positional arg as a shell command, NOT a target
- Fix needed: if first arg looks like a target (contains `:`) use `-t $1` and shift
- Same bug in pane.split, pane.split.h, pane.split.v

## L2: Send drops first char in narrow panes (2026-03-11)
- PO observed: `claudeCode fork a552f5ac-...` arrived as `laudeCode fork...`
- Workaround: send empty line first, then command
- Need to test at various widths: 20, 40, 80, 200 cols

## L3: claudeCode session chain (2026-03-11)
- process.find: PID via TTY + grep 'claude' in args
- session.id: UUID from `--resume` in process args (FAST but stale after compact)
- session.probe: ground truth via /status TUI capture (SLOW ~3s)
- session.name: UUID → name via sessions-index.json customTitle or firstPrompt
- After fork: --resume arg shows SOURCE UUID, not new session UUID

## L4: Fixture pattern for otmux tests (2026-03-11)
- Create `__test_*_$$` session (PID-scoped naming prevents collision)
- Teardown: `tmux kill-session -t __test_*_$$`

## L5: Inherited from backup-tester (2026-03-09)
- NEVER source OOSH scripts at a prompt — they're executables on PATH
- `local` keyword only works inside functions — test files run at top level
- test.case splits args by space — avoid spaces in test values
- RESULT persistence: previous test RESULT leaks — always create.result before expect
- console.log needs LOG_LEVEL >= 3 to output

## L6: COMP_WORDBREAKS colon bug (2026-03-14)
- Bash default COMP_WORDBREAKS includes `:` — splits pane addresses into 3 words
- Fix must be GLOBAL: `COMP_WORDBREAKS=${COMP_WORDBREAKS//:}` at shell init (in 2c.intsall top level)
- `local` inside completion function does NOT work — bash splits COMP_WORDS before function runs
- Fixed in f38c12c (global), not cda06e7 (local, broken)

## L7: DRY parameter.completion pattern (2026-03-14)
- 7 `parameter.completion` entries replace 20+ per-method functions
- c2 tries per-method first, falls back to `otmux.parameter.completion.<paramName>`
- Completions: target (U/D/L/R + panes), sourcePane, targetPane, session, direction, layout, window

## L8: Interactive completion testing (2026-03-14)
- ALWAYS test completions in test shell (otmuxTeam:0.2) via `otmux send` + TAB key
- Calling functions directly tests the function but NOT the c2 integration
- Use `tmux capture-pane -t <pane> -p -e` for ANSI color capture
- `cat -v` makes escape codes visible: `^[[33m` = yellow, `^[[96m` = cyan
- Check `~/config/current.method.env` for param parsing, `~/config/completion.result.txt` for values

## L9: tree.detailed output verification (2026-03-14)
- 3d98c20: shells no longer expanded, agent names show role@model, full 36-char UUIDs
- `@<synthetic>` means model detection failed

## L10: OOSH architecture & test.suite — always read on boot (2026-03-14)
- SKILL.md contains embedded OOSH fundamentals and test.suite API reference
- Boot.md step 1: read SKILL.md FIRST (mandatory every boot)

## L11: Mid-line completion edge case (2026-03-14)
- Cursor mid-line + TAB garbles: readline inserts completion suffix without removing trailing text
- Expert v2 fix: detect midline (COMP_POINT < #COMP_LINE), suppress display output
- Only pass words_to_cursor to c2, not all COMP_WORDS
- Testing was in progress when context ran low — needs verification after compact

## L12: send.key method (2026-03-14)
- `otmux send.key <target> <key> <?count:1>` — sends key N times
- Keys: BSpace DC Down End Enter Home Left Right Tab Up
- Verified: Left 5 correctly moves cursor (ABCDE_X_FGHIJ test)
- Also: `otmux send.keys <target> <keys>` for key sequences

## L13: Mid-line completion v2 VERIFIED (2026-03-14)
- Expert's v2 fix: detects midline (COMP_POINT < #COMP_LINE), passes only words_to_cursor to c2
- Interactive test: typed `otmux tree.de hiveMindTeam02_03_26`, moved cursor back 21, pressed TAB
- Result: `otmux tree.detailed hiveMindTeam02_03_26` — correct, no garbling
- Previous v1 garbled to `tailed.de` suffix — v2 fixed it
- 37/37 tests all passing after adding T33-T37 (send.key + midline detection)
