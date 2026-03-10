# backup-tester Learnings

## L0: Self-Awareness (2026-03-09)
- See SKILL.md "Self-Awareness" section for boot commands
- **tmux splits open zsh by default — OOSH requires bash.** Always `otmux send <testPane> "bash" Enter` before running tests.
- **`otmux pane.get.target` returns the focused/active pane**, not the pane the command runs in. Works correctly from your own Claude Code Bash tool (you are the active pane). From a remote shell via `otmux send`, it returns whichever pane tmux has selected.
- Current: pane `backupTeam:0.2`, session ID `d45f08a4-fdcf-42e9-afc5-e1f8ba874f4f`, test pane `backupTeam:0.1`

## L1: Never source manually (Tron correction — 2026-03-03)
- **OOSH scripts self-bootstrap.** You NEVER `source` anything manually at a prompt.
- To run tests: `test.suite run backup [logLevel]` — that's it.
- Inside a test FILE, the `source` lines are internal structure (file bootstraps itself). That's NOT you sourcing manually.
- OOSH is on PATH. Direct invocation only. No prefix, no sourcing, no cd.
- Run test file directly: `bash test/test.backup [level]` or via framework: `test.suite run backup [level]`

## L2: test.suite API (from reading test.suite, test.config, docs/test-suite.md, docs/log-levels-and-testing.md)

### Test file structure
```bash
#!/usr/bin/env bash
# Inside the test file (internal bootstrapping — NEVER type these at a prompt):
# Run tests via: test.suite run backup <level>
level=$1
if [ -z "$level" ]; then level=1; else shift; fi
source this        # internal bootstrap — NEVER at a prompt
source test.suite
source backup      # loads script under test — ONLY inside test file
log.level $level
# ... test cases ...
test.suite.save.results
```

### API
- `test.case <logLevel|-> "description" function args` — runs test, captures RETURN_VALUE and RESULT
- `expect <returnCode> "<expectedResult>" "<message>"` — assertion comparing RETURN_VALUE and RESULT
- `expect.pass "msg"` / `expect.fail "msg"` — manual pass/fail
- `test.case.expect.error <code> "desc" function args` — for expected failures
- `create.result <code> "<result>"` — sets RETURN_VALUE and RESULT for assertions
- `test.suite.save.results` — ALWAYS at end, saves counters and prints summary
- Wildcard: `expect 0 "*" "msg"` — `*` means "accept any RESULT" or "accept any return code"

### Running
- `test.suite run backup 1` — clean, errors and assertions only
- `test.suite run backup 3` — see console.log from script under test
- `test.suite run backup 5` — full debug, see framework internals
- `test.suite all 1` — run all tests

### Isolation pattern (from test.config)
- Save original state, create temp dirs, cleanup function
- Numbered cases: T1, T2, T3...
- Custom assertions between test.case and expect using if/then + create.result

## L3: OOSH Architecture Essentials (from docs/oosh-architecture.md)
- **Naming**: camelCase + dots. No dashes. No underscores. Script.methodName().
- **Signatures**: `script.method() # <required> <?optional> <?optionalWithDefault:value> # description`
- **Completion**: `script.method.completion.paramName()` — must match parameter name exactly
- **Result system**: `create.result <code> "message"` → caller reads `$RESULT` and `$RETURN_VALUE`
- **Constructor**: `scriptname.start()` with `source this` + `this.start "$@"`
- **Method dispatch**: this.call tries: direct function → prefixed (script.method) → load from file

## L4: Log levels and testing (from docs/log-levels-and-testing.md)
- Level 0=silent, 1=errors, 2=warnings, 3=console(default), 4=info, 5=debug, 6=trace, 7=step
- **Config pollution bug**: tests that set `export LOG_LEVEL=5` can leak to ~/config/log.env via config.save
- **Test isolation**: save/restore LOG_* vars around tests that change them
- For backup tests: use level parameter, never hardcode LOG_LEVEL

## L5: Test file gotchas (2026-03-09)
- **`local` only works inside functions.** Test files run at top level — use plain variable assignment.
- **test.case splits args by space.** `backup.normalize.filename "my:file with spaces.txt"` becomes 4 args. Use filenames without spaces for test.case, or test space handling separately.
- **RESULT persists between tests.** If a test.case doesn't set RESULT, the previous test's RESULT leaks into the expect assertion. Always create.result before expect.

## L6: Bugs found and fixed (2026-03-09, commit 743b6e5)
- **Bug #1**: `config.create` concatenated target_base+pwd for ALL targets. Local targets got double-path. Fix: detect `@` for remote, use target as-is for local.
- **Bug #2**: `backup.run` rsync copied `.backup.env` to target. Fix: added `--exclude .backup.env`.
- Both fixes verified with 13/13 tests passing.

## L7: Completion system (2026-03-09)
- Completion function naming: `script.method.completion.paramName()` — must match param name exactly
- `c2 folders.completion "$1"` — lists directories matching prefix
- `compgen -o dirnames "$1"` — also works for folder completion
- `backup.to.completion()` uses `private.complete.folders` (compgen)
- `backup.parameter.completion.dir()` uses `c2 folders.completion`
- config.create needs: rename param to camelCase `targetBase`, add `backup.config.create.completion.targetBase()`

## L8: Working with expert (coordination pattern)
- Write task files to `session/tasks/`, send reference via `otmux send backupTeam:0.0 "Read session/tasks/<file>" Enter`
- Monitor expert: `otmux pane.capture backupTeam:0.0 20`
- Approve permissions: `otmux send backupTeam:0.0 "" Enter` when permission prompt visible
- Expert commits to oosh repo, I verify by re-running tests in test pane

## L9: backup script methods inventory (from reading /Users/donges/oosh/backup)
- Config: config.discover, config.which, config.save, config.create, config.register, config.unregister, config.list.all, config.register.existing, config.list
- Core: from, to, strategy, run, here, status, stop
- Normalization: normalize.filename, normalize.file, normalize.scan, normalize.all, normalize.revert
- Verification: verify.sync, sync.and.remove
- Diff/listing: diff, full.diff, list.errors, list.last.result.raw, list.last.diff.result, list.onlyInSource, list.onlyInTarget, list.same
- Utilities: get.relative.path, get.backupPath, capture.log.mode
- BACKUP_CONFIGS_DIR="$HOME/config/backup.configs" — tracking directory for registered configs
- Key internal: BACKUP_BAD_CHARS=':|\?*"<> ' — chars normalized for Linux filesystem safety
- config.repair: `backup.config.repair` + `backup.config.repair.completion.configPath()`

## L10: Sed delimiter escaping (2026-03-09)
- When using `|` as sed delimiter: escape `&` and `|`, NOT `/`. The `/` only needs escaping for `/`-delimited sed.
- Bug found: expert's first config.repair used `sed 's/[&/\]/\\&/g'` to escape for `|`-delimited sed — the `\/` didn't match literal `/` in the file.
- Fix: `sed 's/[&|]/\\&/g'` for `|`-delimited sed commands.
- General rule: escape the DELIMITER character + `&` (replacement backreference) + `\` (escape char itself).

## L11: Phase 2 complete (2026-03-09)
- All 3 phase 2 tasks done: completion for config.create, config.repair method, tests T14-T17
- 17/17 tests passing
- Expert implements, tester writes tests and finds bugs — the pattern works

## Achievement: backup config lifecycle — full coverage (2026-03-09)
From zero tests to 17/17 passing. Built the entire backup test infrastructure from scratch:
- Created test fixtures (test.backup.source, test.backup.target)
- Found 3 bugs through manual testing (config.create double-path, .backup.env sync leak, sed escaping)
- All 3 bugs fixed by expert and verified by tester
- Coordinated with expert via task files + otmux messaging — smooth TDD cycle
- Config lifecycle works end-to-end: create → save → register → discover → run → repair
