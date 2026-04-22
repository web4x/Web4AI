# OOSH Expert Learnings

## Patterns
- OOSH is on PATH — run directly, no `./`, no `cd`, no `export PATH`
- NEVER source OOSH scripts — executables, not libraries
- Context path: `session/agents/oosh-expert/context.md` (subdirectory)
- Use `git rev-parse --show-toplevel` for workspace root
- `private.scrumMaster.parse.state()` sets METRIC_STATE as side effect — call directly, not in subshell
- **NEVER filter OOSH output** — no `2>&1`, no `2>/dev/null`, no `| tail`, no `| head`, no `| grep`
  - `otmux pane.capture <target> <?lines>` already takes a line count — use it, don't pipe to tail
  - OOSH scripts use their own log functions (error.log/info.log) that write to LOG_DEVICE — stderr merging breaks this
  - If output is long, read it in full
- Send tty-sensitive commands (ssh login, brew install, OSC 52 tests) to the paired expert-shell pane
  via `otmux send <team>:0.3 "<cmd>" Enter`, not the Claude Code Bash tool
  - Claude Code Bash tool runs in a non-tty subprocess — terminal escapes never reach the user's local terminal
  - Expert-shell pane has a real pty on the SSH session — escapes flow through correctly

## UUID Discovery (Hard-Won)
- Process args UUID is WRONG for forks (`claudeCode fork <parentUUID>`)
- Process args UUID is STALE after autocompact (new JSONL created)
- JSONL first line has parentUuid for autocompact — NOT the session UUID
- JSONL FILENAME is the UUID: `basename "$f" .jsonl`
- UUID_RE must use ERE `{8}` with `grep -oE`, NOT BRE `\{8\}`
- sessions.env checked BEFORE process args (may have write-through data)
- Fork detection: both `--fork-session` AND `claudeCode fork` in args

## DRY
- Discovery in ONE place: `agents.discover` for display, `session.resolve.uuid` for UUIDs
- otmux = low-level (tmux), hiveMind = high-level (agents). Fixes belong in otmux
- `otmux.send` is smart by default — `send.raw` for key sequences
- Completion functions must match parameter names exactly
- os.check supports `private.method` fallback for OS-variant dispatch

## Cross-Platform
- `sed -i ''` is macOS — use temp file pattern: `sed ... > file.tmp && mv file.tmp file`
- `set-hook -p` needs tmux 3.2+ — background enforcer on older
- TTY: macOS `/dev/ttysN`, Linux `/dev/pts/N`
- OAuth: macOS Keychain, Linux direct `~/.claude/.credentials.json`
- `claudeCode session.name` needs python3 fallback (jq not on Linux)

## Failures & Fixes
- `$TMUX_CMD` only in otmux — use otmux wrappers from hiveMind
- Accept-edits: BTab×2 toggles back to normal prompt
- `source hiveMind` triggers status output — leak in tests
- hiveMind status must return 0 even for non-existent sessions

## Persistence file pattern (DRY)
- Env var at hiveMind:~36: `: ${HIVEMIND_X:=${CONFIG_PATH:-$HOME/config}/hivemind.x.env}`
- CRUD helpers follow team.register/remove/list (hiveMind:~3700-3834):
  - `private.*.ensure.dir` → mkdir
  - `private.*.get <key>` → grep + tail -1 + cut
  - `private.*.set <key> <value...>` → grep -v > tmp && mv && append (atomic upsert)
- List formatter: green=valid (underlying resource exists), red=stale

## Forking mechanics
- `claudeCode fork <uuid>` = `claude --resume <uuid> --fork-session` → NEW child UUID
- After fork, let the child start (sleep 5), then call `private.hiveMind.session.resolve.uuid $pane`
  to write-through sessions.env with the child UUID
- For /rename after fork: `otmux send.raw "$target" "/rename $role" Enter`
- Registry re-affirm: `private.hiveMind.registry.set $pane $role`

## Sed regex — greedy vs first-quote extraction

When extracting the FIRST quoted string from a line that may contain multiple,
`.*"([^"]+)".*` is WRONG — `.*` is greedy and grabs up to the last quote.
Correct: `[^"]*"([^"]+)".*` — matches any non-quote chars until the first quote,
then captures the first quoted string. Applies to test.suite label extraction
and any similar `key "value" key "value2"` parsing.

## test.suite filter + list (framework pattern)

- Filter injection point: ONE `test.case` function in test.suite. Set
  `$TEST_CASE_FILTER` before dispatching to test file; early-return from
  test.case when label doesn't match. Zero per-script changes.
- Skip propagation: set `$TEST_CASE_SKIPPED=y` on skip so the expect.*
  calls that typically follow a test.case (outside the case body) no-op.
  Set `=""` on run. Clears naturally between runs; no scope pollution.
- Test case label shape: `"T-XXX-N: description"` or `"function - desc"`.
  Filter prefix-matches both the full label AND the `${label%%:*}` tag.
- List pattern: `grep '^\s*test\.case' file | sed 's/^[^"]*"([^"]+)".*/\1/'`.
  Include line number via `grep -n` + sed group for navigation UX.

## Resolve / active-team pitfalls

- `hivemind.active.team` FILE can go stale after test runs leave `__test_hm_$$` entries —
  `private.hiveMind.active.team` must validate every candidate with `otmux has` before
  trusting it, otherwise `resolve` falls straight through to the cross-team grep.
- When a role is registered in multiple teams (e.g. `projectTeam` and `UpDown_ai_projectTeam`
  both have `oosh-expert` after a fork-based migration), cross-team `grep -i` returns the
  first match by file order, which is rarely the one the caller meant.
- Correct scope order for resolve: explicit session (if given) → active team → caller's own
  tmux session (when `$TMUX` set) → cross-team fallback. Always emit `debug.log` per scope
  for future diagnosis.

## error.log writes to stdout, not stderr (GOTCHA)

- `error.log` prints to stdout. A function that captures a callee's output into a variable
  AND then checks `[ -z "$var" ]` will be FOOLED by the error string — the variable is
  non-empty because it contains the error message itself.
- Always check rc AND (where applicable) validate format: e.g. for `hiveMind.resolve`,
  require `rc == 0` AND the captured value matches `^[A-Za-z0-9_.-]+:[0-9]+\.[0-9]+$`.

## teams.save role priority (correct cascade)

- customTitle (via `private.hiveMind.live.discover` → `claudeCode session.name`) must win
  over the pane title — `/rename` reflects the TRUE role, pane title can be stale from
  plan mode, prior rename, etc.
- Cascade: `live.discover` → `registry.get` → `role.fromTitle` → `"unknown"`.
- `role.fromTitle` already strips prefixes (`✳ ⠐ ⠂ ✻ ✢ ✶`), `@model`, whitespace,
  and rejects generic values. Do NOT duplicate that cleanup inline.

## claudeCode.list semantics
- DEAD: JSONL on disk but UUID not in live Claude process args (orphan)
- FORK-READY: has pane + role + context remaining in [20,40] (= 60-80% used)
- Color hierarchy (strongest wins): RED > CYAN > GREEN > YELLOW > GRAY
- Keep GREEN = "has pane / active" — don't reuse for fork-ready
