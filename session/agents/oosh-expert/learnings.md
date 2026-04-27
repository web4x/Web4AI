# OOSH Expert Learnings

## Boot rule — CRITICAL

**Re-read agent files (context.md, learnings.md, backlog.md, boot.md) on every fresh
session and after every context rewind.** The session memory ≠ persistent context. I
once thought I'd only delivered G1+A1.1+A1.2 audits when actually 14 commits + 6 audits
were in master. Context files are the single source of truth.

After reading agent files, verify with `git log --oneline -25 ~/oosh` to ground-truth
the commit history.

## Commit Rule (SM directive — never violate)

**Every task = one commit, one-liner message, no uncommitted work.**

Format: `<what changed> (ref: task-<id>-<name>.md)`

Example:
```
otmux pane.lock auto-unlock before relock (ref: task-b3.1-expert-pane-lock-idempotent.md)
```

**NOT** the multi-paragraph commit messages with Co-Authored-By tags I used early in
the sprint. Details belong in the task file.

**Checklist before reporting task done:**
1. `git status -sb` — must show only `## branch` line (no modified/untracked files I created)
2. `git log -1 --oneline` — most recent commit matches the task

## MVC Boundary Rules (Sprint 0 audit)

**Model purity rules (claudeCode):**
- Take data, not panes (`<uuid>`, `<jsonlFile>`, `<pid>` — NEVER `<pane>`)
- Return data, never send (no `otmux send*`)
- Read-only on shared state (may read `hivemind.sessions.env` as cache; never write)
- Observable not imperative (no `alert`/`notify`/push-into-pane methods)
- Work without `$TMUX` — plain bash callable

**Two-method split pattern for leaks:**
- Old: `claudeCode.foo <pane>` (View-coupled)
- New:
  - Model: `claudeCode.foo.byUuid <uuid>` OR `claudeCode.foo.fromCapture <text>` (pure data/parser)
  - Controller: `hiveMind.agent.foo <agentName>` (resolves pane → data → calls Model)

**Pure parser pattern** — take captured TUI text, extract data:
- `session.probe.fromCapture <captureText>` — extract UUID from `/status` output
- `context.read.fromCapture <captureText>` — extract `N%` from status bar
- `model.parse.statusBar <captureText>` — extract opus|sonnet|haiku
- Benefits: testable with fixture strings, zero tmux dependency, reusable by log scrapers

**Bridge-method handling:** For methods that NEED both layers (e.g. `process.find` needs
tty from pane for ps lookup), split into `byTty <tty>` (Model) + Controller wrapper that
does `otmux pane.get tty` → Model.

**Duplicates to delete:**
- `claudeCode.agent.recover` duplicates `hiveMind.agent.unblock` family — delete from Model
- `claudeCode.agent.start` duplicates `hiveMind.agent.start` — delete from Model

## OOSH first-principles violations to avoid

- **No `--flag` style args** — caught by T-ARCH-5. Use positional args: `<?mode:join|fork>` not `<?--fork>`. My C1 commit shipped `<?--fork>` and had to be fixed in c6033dd.
- **No raw tmux** — always `otmux ...` wrapper. Caught by T-BOUNDARY-4. `private.claudeCode.complete.panes` had `tmux list-panes` that I fixed to `otmux panes` in 66ddcd6.
- **No -dangerously-skip-permissions** when starting Claude agents.

## Sprint 0 Workflow

**Task file structure:** `## Status` checklist with `[x]` markers for Planned/In Progress
substeps/QA Review/Done. Grep pattern for state counting:
```bash
for f in task-*.md; do grep -E '^\- \[x\] Done' "$f"; done
```

**PO feedback loop:** Write findings doc `task-<id>-findings.md` beside task file. Update
task Status section with Deliverable block linking to findings. Report summary to
TRONinterface:0.0 via otmux send.

**SM role:** approves proceeding from one task to next, catches context overflow
(-224% warning ≠ joke — means compact NOW). SM also catches false alarms — G1's -226%
WAS the SM detecting the 1M-vs-200k bug, not a real overflow.

## Patterns

- OOSH is on PATH — run directly, no `./`, no `cd`, no `export PATH`
- NEVER source OOSH scripts — executables, not libraries
- Context path: `session/agents/oosh-expert/context.md` (subdirectory)
- Use `git rev-parse --show-toplevel` for workspace root
- `private.scrumMaster.parse.state()` sets METRIC_STATE as side effect — call directly, not in subshell
- **NEVER filter OOSH output** — no `2>&1`, no `2>/dev/null`, no `| tail`, no `| head`, no `| grep`
  - `otmux pane.capture <target> <?lines>` already takes a line count — use it, don't pipe to tail
  - OOSH scripts use their own log functions (error.log/info.log) that write to LOG_DEVICE — stderr merging breaks this
- Send tty-sensitive commands (ssh login, brew install, OSC 52 tests) to the paired
  expert-shell pane via `otmux send <team>:0.3 "<cmd>" Enter`, NOT the Claude Code Bash tool
  - Bash tool runs in a non-tty subprocess — terminal escapes never reach the user
  - Expert-shell pane has a real pty, escapes flow correctly

## Address by Role Name (MANDATORY)

`hiveMind resolve <name>` — pane addresses are implementation detail.
PO is "product-owner", not "0.0". My peer is "oosh-tester", not "0.2".

## Self-pane awareness

`otmux pane.get.target` returns my own pane (`ooshTeam:0.1`).
**NEVER send commands to my own pane** — sending /compact, /clear, slash commands
to self causes unpredictable behavior. Always check before sending.

I once sent a status report to ooshTeam:0.1 (myself) instead of TRONinterface:0.0 (PO).
Caught it and resent. Watch for this.

## Never Assume — Always Measure

| Instead of assuming... | MEASURE with... |
|------------------------|-----------------|
| Context is around X% | `claudeCode context.read <pane>` |
| The send worked | `otmux pane.capture` to verify |
| Git is clean/dirty | `git status` / `git log` |
| Agent is idle/active | Capture the pane |
| Tests will pass | Run `test.suite` |
| F1/F2 already done | Read git log, verify methods exist |

## UUID Discovery (Hard-Won)

- Process args UUID is WRONG for forks (`claudeCode fork <parentUUID>` shows parent)
- Process args UUID is STALE after autocompact (new JSONL created)
- JSONL first line has parentUuid for autocompact — NOT the session UUID
- JSONL FILENAME is the UUID: `basename "$f" .jsonl`
- UUID_RE must use ERE `{8}` with `grep -oE`, NOT BRE `\{8\}`
- sessions.env checked BEFORE process args (may have write-through data)
- Fork detection: both `--fork-session` AND `claudeCode fork` in args

## Per-session max_tokens detection (G1)

JSONL `"model"` field shows base name (`claude-opus-4-6`) — NEVER includes `[1m]`
suffix. The `[1m]` flag is CLI-only. To detect 1M sessions:
1. **Priority 1** — ps args of running claude process: `grep -F "$sid" | grep -q '\[1m\]'`
2. **Priority 2** — observed max from JSONL: any usage > default → must be 1M (a default-capped session would have compacted)
3. **Priority 3** — model from JSONL → base default (200k)

3 env constants at top of claudeCode for single-source config:
- `CLAUDE_MAX_TOKENS_DEFAULT=200000`
- `CLAUDE_MAX_TOKENS_1M=1000000`
- `CLAUDE_COMPACT_THRESHOLD_PCT=90`

Exported so python subprocesses inherit.

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

## Sed regex — greedy vs first-quote extraction

When extracting the FIRST quoted string from a line that may contain multiple,
`.*"([^"]+)".*` is WRONG — `.*` is greedy and grabs up to the last quote.
Correct: `[^"]*"([^"]+)".*` — non-quote chars until first quote, then capture.
Applies to test.suite label extraction and any `key "value" key "value2"` parsing.

## test.suite filter + list (framework pattern)

- Filter injection point: ONE `test.case` function in test.suite. Set
  `$TEST_CASE_FILTER` before dispatching to test file; early-return when label
  doesn't match. Zero per-script changes.
- Skip propagation: `$TEST_CASE_SKIPPED=y` on skip so expect.* calls following
  test.case (outside the case body) no-op. Set `=""` on run.
- Test case label: `"T-XXX-N: description"` or `"function - desc"`. Filter
  prefix-matches both the full label AND the `${label%%:*}` tag.

## Resolve / active-team pitfalls

- `hivemind.active.team` FILE can go stale after test runs leave `__test_hm_$$` entries —
  `private.hiveMind.active.team` must validate every candidate with `otmux has` before
  trusting it.
- When a role is registered in multiple teams, cross-team `grep -i` returns the first
  match by file order, which is rarely what the caller meant.
- Correct scope order for resolve: explicit session → active team → caller's tmux session
  (when `$TMUX` set) → cross-team fallback. Always emit `debug.log` per scope.

## error.log writes to stdout, not stderr (GOTCHA)

`error.log` prints to stdout. A function that captures a callee's output into a
variable AND then checks `[ -z "$var" ]` will be FOOLED — the var contains the
error message. Always check rc AND validate format (e.g. for `hiveMind.resolve`,
require `rc == 0` AND captured value matches `^[A-Za-z0-9_.-]+:[0-9]+\.[0-9]+$`).

## teams.save role priority (correct cascade)

customTitle (via `private.hiveMind.live.discover` → `claudeCode session.name`) must
WIN over the pane title — `/rename` reflects TRUE role; pane title can be stale.

Cascade: `live.discover` → `registry.get` → `role.fromTitle` → `"unknown"`.
`role.fromTitle` already strips prefixes (`✳ ⠐ ⠂ ✻ ✢ ✶`), `@model`, whitespace,
generic markers — do NOT duplicate that cleanup inline.

## claudeCode.list semantics

- DEAD: JSONL on disk but UUID not in live Claude process args (orphan)
- FORK-READY: has pane + role + context remaining in [20,40] (= 60-80% used)
- Color hierarchy (strongest wins): RED > CYAN > GREEN > YELLOW > GRAY
- Keep GREEN = "has pane / active" — don't reuse for fork-ready

## Cold-restart composition (C1)

- teams.save schema: `sess|addr|role|uuid|title|cwd|model|kind` (8 fields)
  - `kind` ∈ `{claude, shell, monitor, unknown}` — drives restore dispatch
  - `model` extracted via `pgrep -P <wrapper>` to find child claude PID — wrapper
    bash doesn't have `--model` flag, child does
- teams.restore composition order:
  1. Group entries by session
  2. `otmux layout.restore <session> [--force]` per session FIRST (geometry)
  3. Iterate panes, kind-aware dispatch:
     - `shell` → `cd <cwd>` only, stay bash
     - `monitor` → skip (tronMonitor.setup handles)
     - `claude`/default → cd cwd, `claudeCode join.byID <uuid>`, poll for alive
  4. Idempotency: skip if `claudeCode.process.running` already true
  5. Re-register team via `hiveMind.team.register` at end
- Polling beats `sleep 5` — `private.hiveMind.wait.for.claude <pane> 30`
- Backward compat: old 5-field snapshots default `kind=claude` if uuid present, else `shell`

## Subscription API resilience (F3)

- Capture HTTP status from curl with `-o body -w "%{http_code}"`
- On 429 (rate_limit) / network / 5xx / parse failure: source cached file, mark
  `SUBSCRIPTION_STALE=1` + `SUBSCRIPTION_STALE_REASON` (rate_limit / server_NNN / etc)
- `SUBSCRIPTION_TIMESTAMP_EPOCH` field added to cache for reliable age math
  (BSD vs GNU date ISO parsing differs — always prefer epoch when possible)
- `subscription.cache.age` returns int seconds, `"no-cache"`, or `"unknown"`
- Display appends `(cached Xs, rate_limit)` to one-liner status when stale

## Persistence file pattern (DRY)

- Env var at hiveMind:~36: `: ${HIVEMIND_X:=${CONFIG_PATH:-$HOME/config}/hivemind.x.env}`
- CRUD helpers follow team.register/remove/list pattern:
  - `private.*.ensure.dir` → mkdir
  - `private.*.get <key>` → grep + tail -1 + cut
  - `private.*.set <key> <value...>` → grep -v > tmp && mv && append (atomic upsert)
- List formatter: green=valid (underlying resource exists), red=stale

## Forking mechanics

- `claudeCode fork <uuid>` = `claude --resume <uuid> --fork-session` → NEW child UUID
- After fork, let the child start (poll for process alive — see C1 wait.for.claude),
  then call `private.hiveMind.session.resolve.uuid $pane` to write-through sessions.env
- For /rename after fork: `otmux send.raw "$target" "/rename $role" Enter`
- Registry re-affirm: `private.hiveMind.registry.set $pane $role`

## Auto mode rules

- Execute autonomously, minimize interruptions, prefer action over planning
- BUT: don't take destructive actions without explicit greenlight
- If a refactor touches >5 callers, ask first (e.g. A1.2 fix 2b — 8 callers, queued)
- Read agent files BEFORE acting after rewind (don't trust session memory)
