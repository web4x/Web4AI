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

## Sprint 1 Learnings (2026-05-18 → 2026-06-01)

### SC-B.3 event dispatch testing
- events.register is idempotent — double-register, verify count=1
- events.emit isolates failures — register fail+ok handlers, verify ok still called
- Save/restore HIVEMIND_EVENT_HANDLERS around tests, skip on bash 3.2
- Protected CLI wrappers (protected.events.register/emit) exist for test access

### SC-C handler verification pattern
- 10 events × 25 handlers — verify via code-grep: handler registered to correct event, handler body writes correct store
- Map event→handler→store from sprint-1-design.md §4 event catalog
- team.destroyed has 5 handlers (most complex) — S1, S2, S3, S6, S8

### Bug verification workflow (CMM4)
- Read task file FIRST (SM directive — task files are single source of truth)
- Write verification results INTO the task file (not ad-hoc messages)
- Verdict line at bottom: "VERIFIED. Bug closed."
- 3-part verification: (a) code check, (b) behavior check, (c) regression check

### c2 apostrophe completion bug
- Single ' in method doc comment breaks c2.get.function.declaration
- xargs in line.format parses shell quotes — ' pops quote state
- Produces malformed current.method.env → bash falls back to filename completion
- Fix: sed "s/'//g" in c2 pipeline line 159 — one line fixes 9 methods

### Rate-limit scroll detection
- sweep.detect only captures 20 lines — rate-limit message scrolls off → idle
- Fix: 200-line history scan on idle path with prose-scrub filter
- Detail field "scrolled-history" distinguishes scrollback from visible detection
- Prose-scrub filters code comments/grep/sed to prevent false positives

### Test performance
- Full hiveMind test suite takes 1-2 hours with 18 sessions (~80 panes)
- Each agents.discover call scans ALL sessions — ~2 min per call
- Tests 1+2 (hiveMind.list, hiveMind.workers) alone take 10+ minutes
- Workaround: use test.suite filter mode (still slow due to 5000-line setup)

## Role Boundaries
- DO NOT implement fixes — report findings, expert implements
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep on commands)
- NEVER source oosh scripts from zsh Bash tool — use tester-shell (bash)
- NEVER use run_in_background with until-loops — they dangle, waste resources
- Write findings to task files (SM CMM4 directive — not ad-hoc messages)
- Use ooshTeam:0.4 for macOS tests, ooshTeam:0.5 for Termux
- Read specs BEFORE testing — know expected behavior
- Finish current task before handling new prompts
- Test, report, stand by

### Cross-platform testing (2026-06-01)
- `/tmp/` hardcoded is the #1 Termux killer — 33+ occurrences across 7 test files + production scripts
- Fix: `${TMPDIR:-/tmp}` everywhere, or bare `mktemp` (uses $TMPDIR automatically)
- Cascade effect: 1 failed mktemp can break 20+ downstream tests
- Production scripts (log, config, this) also had /tmp/ — not just test files
- Test on Termux AFTER macOS to catch platform-specific failures
- `oo update` pulls dev branch on any platform (uses oo.mode)
- Permission check: dirs 700, private keys 600, public keys 644

### SC-D.3 reconcile roundtrip pattern
- Create test session, register roles, inject violations per invariant
- Violations: ghost pane in S1 (I1), dead team in S3 (I3), unregistered live pane (I8), @opus in title (I9)
- After each: verify audit catches, reconcile --apply fixes, re-audit clean
- Final full roundtrip: reconcile all → zero violations
- Use private.hiveMind.reconcile.diff for programmatic violation count (not audit which has human output)
