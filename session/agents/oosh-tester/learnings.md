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
- T-ALIGN-8 used to hang scanning 80+ panes — fixed by #9 cap (44726ab, max 20 Claude panes)
- claudeCode suite runs ~10min end-to-end now (was infinite before #9 cap)
- hiveMind suite still impractical at fleet scale — 28 lines in 10min, needs optimization

### Audit verification workflow (2026-06-19)
- Run `hiveMind consistency.audit 2>&1 | tee /tmp/audit-results.txt` — capture to file
- Grep file for specific patterns (UUID-stale, MISMATCH, @host) — pane history truncates
- Compare violation counts before/after fix (128→120 = 8 fork stales removed)
- Report in the task file report-back section, not chat

### Test relaxation pattern
- When a test fails because reality is legitimate (dormant shells have no agentName), relax the assertion
- Change `all X must have Y` to `some X must have Y` — tolerate known exceptions
- Document the reason in the test comment (PO triage decision)

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

### Systemic EPERM fix (2026-06-16)
- Root cause: debug script onError() overrides init/once version
- init/once suppressed code 1, debug version had -z/-n bug — never suppressed
- Fix: bd39c80 adds code-1 suppression + fixes -z→-n logic
- problem.log sets STEP_DEBUG=ON at 4 sites (log lines 117,206,230,253) — separate bug (task #40)
- ERR trap + set -E in init/once inherits to ALL functions — any [ ] test failure fires onError
- Cherry-pick fixes to remote hosts (WODA.test, Docker) — same codebase

### SC-D.3 reconcile roundtrip pattern
- Create test session, register roles, inject violations per invariant
- Violations: ghost pane in S1 (I1), dead team in S3 (I3), unregistered live pane (I8), @opus in title (I9)
- After each: verify audit catches, reconcile --apply fixes, re-audit clean
- Final full roundtrip: reconcile all → zero violations
- Use private.hiveMind.reconcile.diff for programmatic violation count (not audit which has human output)

### Verification workflow (2026-06-21/22)
- Use ooshTeam:0.4 (macOS shell) for running tests — NEVER ooshTeam:0.3 (own pane)
- test.suite filter mode (`T-ZOOM`) still runs ALL setup code in 6000-line files — takes 10+ min
- For fast verification: run test logic inline via `otmux send` to shell pane
- Use `otmux pane.history` to retrieve results (not `pane.capture` which is current screen only)
- Monitor tool with until-loop for async test waits — don't sleep-poll
- Role names must start with a letter (`this.isRoleName` rejects `__test_*`): use `rw-test-*` not `__test_rewind_*`
- state.set resolves role→pane via hiveMind.resolve — needs REAL tmux session, not fake pane name
- completion.discover COMP_CWORD is 0-based: word 0=script, word 1=method
- Exact single match returns empty completion (resolved) — test with multi-match prefix like "l" not "list"

### Task file discipline (CMM4)
- Tick acceptance criteria checkboxes in task file
- Add report-back line with: date + commit + test count + pass/fail + what was verified
- One-line ping to PO via otmux send after each verified task
- Task files are single source of truth — not chat messages

### Capture-bridge verification (2026-07-04) — pane.capture -p fix (dev 7059a36 → macos.latest b2dd551)
- **Redrawing-pane delta is the decisive local repro**: scratch pane `while true; do clear; echo REDRAW-MARK-$RANDOM; sleep 1; done`. NEW `-p` reads the live MARK; OLD `-S` scrollback form reads `[]` blank. Proves (a) fix reads live content, (b) NEW≠OLD → fix is not a no-op. Stronger than a static-pane A/B.
- **Negative-control the fence or it's a tautology**: assert the same grep flips RED on the buggy `-S` code before trusting a GREEN on the fixed code.
- **F-T20 lie-instrument**: a zsh-context inline A/B returned empty==empty and falsely reported MATCH. ALWAYS oracle against raw `tmux capture-pane -p` + an explicit render `sleep`, so empty-vs-empty cannot pass.
- **Bash tool is zsh — sourcing oosh hangs**: run oosh via `bash -c '...'` (works) or the tester-shell pane; never source `this` in the Bash tool directly.
- **Fence must strip comments**: the fix's own doc-comment mentions `-S`; grep the `capture-pane` command line only (`grep -v '^[[:space:]]*#'`) or it false-positives.
- **Two-repo commit pattern**: CODE/tests → the oosh repo branch (dev / test/macos.latest, push origin); REPORT-BACK → workspace `main` (session/tasks, push origin). Mailbox is live — `git pull --no-edit` before push on main.
- **Remote bridge exec is user-gated**: `ossh exec WODA.prod` AND `WODA.test` both denied by auto-mode classifier when peer-directed (no user intent). Surface for Tron auth; do NOT bypass. Local redrawing-delta proves the same invariant (fix reads visible screen, nothing for a bridge to desync).
- Gate commits: dev `1c5a4e8`, macos.latest `a6a98dc`.

## console.log is LOG_LEVEL≥3 gated — tests asserting on it must force the level (2026-07-15)
**Measured** (with oosh-expert, test.opy T12): `console.log` output is suppressed at
`LOG_LEVEL=1` **regardless of `LOG_DEVICE`** — a file device does NOT make it visible;
only `error.log`/`important.log` (lower min-level) survive level 1. The suite runs at
exported `LOG_LEVEL=1`.
- **Trap**: capturing a subprocess's `console.log` line via `LOG_DEVICE=<file>`/`2>&1`
  gives EMPTY at level 1. A test that greps for a console.log message then FAILS even
  though the code is correct. Pointing LOG_DEVICE at a file "fixes" it only if ambient
  LOG_LEVEL happens to be ≥3 (brittle, order-dependent — passed once by accident).
- **Rule**: when a test must assert on a `console.log` message from a subprocess, force
  the level on that subprocess: `OUT=$(LOG_LEVEL=3 LOG_DEVICE=/dev/stdout <cmd> 2>&1)`.
  Or, if a guard already proves the branch, assert on RC alone and drop the message grep.
- My earlier "LOG_DEVICE=/dev/null swallowed it" diagnosis was INCOMPLETE — the real gate
  is LOG_LEVEL, not the device. Measure the level, not just the device.
