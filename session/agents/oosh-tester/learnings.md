# oosh-tester Learnings

*Patterns, failures, KPIs — identity after compact.*

## Testing Patterns

### test.suite filter mode
- `test.suite run hiveMind 1 T-B5` — runs single filtered test
- Filter still executes ALL setup code — slow for large files (~5000 lines)
- Interactive prompts in setup code BLOCK filtered runs (consistency.audit y/N)
- Workaround: `< /dev/null` redirects stdin to auto-dismiss prompts
- Use `test.def` for callable function tests (migration opt-in)

### BRE vs ERE (hard-won, repeated mistake)
- `grep -qE` uses ERE: `|` is alternation, `\|` is literal
- `grep -q` (no -E) uses BRE: `\|` is alternation
- `grep -P` NOT available on macOS — use `grep -E` instead
- ALWAYS check which grep flag before writing alternation patterns

### Self-contained tests
- Use `__test_` prefix + `$$` for isolation
- Create/destroy tmux sessions for live tests
- Gate live tests behind `LIVE_SESSION` or `otmux sessions` check
- Code-level grep tests always work — prefer these for speed
- NEVER execute the bug pattern in tests (stdin consumption test hung suite)

### CMM4 measured testing
- Capture pane BEFORE and AFTER each send with md5 comparison
- Record: input, expected behavior, actual behavior, PASS/FAIL
- Report coverage %: pass/total
- Don't just test pass/fail — MEASURE

### Prefix testing
- Prefix only applies to Claude Code target panes (isClaudeCode check)
- Bash shell targets get NO prefix — by design (shell = Tron)
- send.prefix uses $TMUX_PANE (not display-message) for subprocess context
- HIVEMIND_ROLE env var NOT used — registry is single source of truth
- Test prefix by sending to a Claude Code pane, not a bash shell

### Tab completion testing
- Send Tab via `otmux send.raw pane Tab`
- c2 first Tab shows usage, second shows completions
- Namespace collision: `ossh.get.config()` made c2 see `get` as sub-method

### Remote testing
- Use remote-tester-shell for SSH sessions
- `oo mode <branch>` switches oosh branch (instant symlink swap)
- NEVER manually rm/ln framework files — use oo mode

### Event dispatch testing (SC-B.3)
- Mock handlers with simple bash functions
- Save/restore HIVEMIND_EVENT_HANDLERS around tests
- Test isolation: failing handler must not abort siblings (U1 lock)

### Invariant fixture testing (SC-A.3)
- Inject deliberate violations into config files
- Backup config files before test, restore in EXIT trap
- Call `reconcile.diff` with specific invariant filter (i1, i2, etc.)
- Output format: SEVERITY|INVARIANT|STORE|ACTION|KEY|REASON|DETAIL
- Verify severity sorting: CRITICAL → HIGH → MEDIUM → LOW

## Sprint 0+1 Learnings

### MVC boundaries
- claudeCode = Model (no otmux.send, no pane.capture)
- otmux = View (no claudeCode, no hiveMind except protected callbacks)
- hiveMind = Controller (delegates UUID to claudeCode, pane ops to otmux)

### UUID discovery chain
- JSONL filename IS the UUID — never parse line 1
- session.resolve.uuid → session.current → session.discover
- sessions.env updated by registry.refresh, not by Claude Code
- Three sources must agree: sessions.env, process args, JSONL file

### Pane operations (B5)
- split/swap/move renumber pane indices
- Registry must update: panes.shifted, panes.swapped, pane.moved
- registry.set has 3-field format: pane|role|timestamp
- TTL=0 must short-circuit to "not recent" (was bug: 0<=0 is true)

### Target validation (Bug #4)
- error.log writes to STDOUT not stderr
- hiveMind.resolve failure captured as non-empty $target (error message)
- otmux.send needs format validation: session:win.pane or %NN

### Context-aware send (Epic I)
- idle → INFORM (deliver directly)
- active/unknown → QUEUE (persist, drain on idle)
- overlay → REJECT (use approve/reject/dismiss)
- Queue depth bounded at 50, age-bounded at 1h
- Mock sweep.detect via function override for state control

### Empty-send DRY (Tron P0)
- this.isEmpty: kernel predicate for empty/whitespace detection
- 8 call sites: 3 in otmux, 5 in hiveMind
- Empty/whitespace → rc=0, silent no-op, no pane change
- /commands → no prefix (starts with /)
- Keys (Enter, Tab, etc.) → no prefix (is.key detection)

## Role Boundaries
- DO NOT implement fixes — report findings, expert implements
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep on commands)
- NEVER source oosh scripts from zsh Bash tool — use tester-shell (bash)
- Use oosh-tester-shell (ooshTeam:0.5) for commands
- Read specs BEFORE testing — know expected behavior
- Finish current task before handling new prompts
- Test, report, stand by
