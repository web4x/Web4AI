# Task A1.2 — claudeCode View Leak Refactor Plan

**Date:** 2026-04-24
**Role:** oosh-expert
**Target:** `/Users/donges/oosh/claudeCode` (1881 lines)
**Input:** A1.1 findings — 14 View leaks + 4 Controller leaks + 1 raw tmux
**Goal:** Concrete refactor blueprint. For each leak: current behavior → proposed target layer → pure Model interface.
**Non-goal:** Implementation. A1.3 tester writes coverage; fixes happen in later tasks after tests pass.

---

## Design Principles (Model API)

Pure Model claudeCode methods must satisfy all of:

1. **Take data, not panes** — `<uuid>`, `<jsonlFile>`, `<pid>` — never `<pane>`
2. **Return data, never send** — no `otmux send*` / `tmux send-keys`
3. **Read-only on shared state** — may read `hivemind.sessions.env` as cache, never write
4. **Observable not imperative** — `get` / `read` / `find` / `list`, no `alert` / `notify` / `set` that push into a pane
5. **Work without `$TMUX`** — callable from plain bash, script, or CI

The clean pattern: **pane → Controller extracts data → calls Model with data**.

---

## Leak-by-Leak Refactor Plan

### Leak 1 — `session.probe <pane>` (GROSS — biggest violator)

**Current** (lines 984-1028):
```bash
otmux send.raw "$target" "/status" Enter   # INTERACTIVE COMMAND
sleep 3                                      # waits for TUI render
capture=$(otmux pane.capture "$target" 40)   # reads pane
otmux send.raw "$target" Escape              # dismisses modal
# then parses capture for Session ID / name → JSONL correlation
```

**Problem:** This method **controls** a running agent (opens a modal, reads it, closes it). That is Controller, not Model. A Model cannot change the state of a View.

**Target layer:** `hiveMind` (Controller) — it already coordinates agent interactions.

**Proposed split:**

| Layer | New method | Responsibility |
|-------|-----------|---------------|
| **Model** | `claudeCode.session.probe.fromCapture <captureText>` | Pure parser: given `/status` output text, extract UUID via legacy format OR customTitle→JSONL correlation. **No I/O, no otmux**. Returns UUID or empty. |
| **Controller** | `hiveMind.agent.session.probe <agentName\|pane>` | 1. Resolve name→pane. 2. `otmux send.raw /status Enter`. 3. `sleep 3`. 4. `otmux pane.capture`. 5. `otmux send.raw Escape`. 6. Call `claudeCode.session.probe.fromCapture` with captured text. 7. Write result to `hivemind.sessions.env`. |

**Clean Model interface:**
```bash
claudeCode.session.probe.fromCapture() # <captureText> # parse /status output, return UUID
# No args use stdin:
# echo "$captured" | claudeCode.session.probe.fromCapture
```

**Benefits:**
- Model testable with fixture strings (no tmux needed in tests)
- Controller can retry / cache / rate-limit probes
- `claudeCode.session.probe.fromCapture` reusable by other pane-to-UUID paths (e.g. headless log scraping)

---

### Leak 2 — `agent.recover <pane>` (duplicate + leak)

**Current** (lines 1830-1909):
- Calls `hiveMind resolve.reverse "$pane"` (Controller leak)
- Calls `otmux send "$pane" "Read ..." Enter` (View leak)
- Calls `otmux pane.capture` to verify (View leak)

**Problem:** This method orchestrates. It's a Controller action living in the Model file. Also it duplicates `hiveMind.agent.unblock` family (hiveMind:4893+).

**Target layer:** `hiveMind` — already present as `agent.unblock` / `agent.handoff`.

**Proposed action:** **Delete `claudeCode.agent.recover` entirely**. Move any unique logic (boot file path lookup, recovery file reading) to a Model helper:

**Clean Model interface:**
```bash
claudeCode.session.recover.read() # <?file:session/agent.context.md> # read recovery file, no side effects
# Already exists as claudeCode.session.recover (lines 1215-1234) — that's the Model piece. Keep.
```

No replacement needed — the Controller's `hiveMind.agent.recover` already composes Model reads + View sends correctly. Model just exposes the file-reading half.

---

### Leak 3 — `model.set <pane> <model>` + `model.get <pane>`

**Current** (lines 502-549):
- `model.set` line 516: `otmux send.enter "$pane" "/model $model"` — sends slash command
- `model.get` line 533: `otmux pane.capture "$pane" 10` + regex scrape status bar

**Problem:** Setting/getting the model of a **running** agent is Controller (it modifies agent state). The Model has `claudeCode.model <modelName>` which launches a *new* session with a model — that's Model (CLI flag).

**Target layer:** `hiveMind` (Controller).

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| Model | `claudeCode.model <modelName> [prompt]` | Already pure (line 477). Keeps. Launches new session. |
| Model | `claudeCode.model.list` | Already pure (line 494). Static list. Keeps. |
| Model | `claudeCode.model.parse.statusBar <captureText>` | **NEW** — given captured pane text, extract current model name. Pure parser. |
| Controller | `hiveMind.agent.model.set <agentName> <modelName>` | Resolves name→pane, sends `/model X` to pane. |
| Controller | `hiveMind.agent.model.get <agentName>` | Resolves name→pane, `otmux pane.capture`, calls `claudeCode.model.parse.statusBar` with text. |

**Clean Model interface** (new):
```bash
claudeCode.model.parse.statusBar() # <captureText> # extract 'opus'|'sonnet'|'haiku' from pane capture
{
  local content="$1"
  echo "$content" | grep -oiE '(opus|sonnet|haiku)' | head -1 | tr '[:upper:]' '[:lower:]'
}
```

---

### Leak 4 — `context.alert <pane> <?threshold:20>`

**Current** (lines 1799-1829):
- Calls `claudeCode.context.read "$pane"` (carries through view coupling)
- Line 1820: `otmux send.enter "$pane" "CONTEXT: ${pct}% — save state now"` (View leak — sends warning TO pane)

**Problem:** "Alert" is by definition a push into a display. Cannot be Model.

**Target layer:** `hiveMind` (Controller).

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| Model | `claudeCode.context.read.byUuid <uuid>` | **NEW** — read % remaining from JSONL for given UUID. Pure. |
| Controller | `hiveMind.agent.context.alert <agentName> <?threshold>` | Resolves name→pane→uuid, calls Model `byUuid` to get %, if below threshold sends warning via otmux. |

**Clean Model interface:**
```bash
claudeCode.context.read.byUuid() # <sessionId> # read context % remaining from JSONL for UUID (no pane, no tmux)
{
  local sid="$1"
  [ -z "$sid" ] && return 1
  local jsonlFile
  for projectDir in "$HOME/.claude/projects"/*/; do
    [ -f "${projectDir}${sid}.jsonl" ] && jsonlFile="${projectDir}${sid}.jsonl" && break
  done
  [ -z "$jsonlFile" ] && return 1
  private.claudeCode.context.from.jsonl "$jsonlFile"
}
```

Then `claudeCode.context.read <pane>` becomes a thin Controller wrapper in `hiveMind`, not in claudeCode.

---

### Leak 5 — `context.check <pane>` + `context.read <pane>`

**Current** (lines 1405-1507, 1738-1797):
- `context.read` line 1477, 1481: `otmux pane.capture` for TUI fallback
- `context.check` line 1784: calls `context.read` + `context.velocity.byPane` + `context.alert`

**Target layer:** Split.

| Layer | Method | Responsibility |
|-------|--------|---------------|
| Model | `claudeCode.context.read.byUuid <uuid>` | (See Leak 4.) Pure JSONL read. |
| Model | `claudeCode.context.read.fromCapture <captureText>` | **NEW** — regex-scrape captured TUI text for `N%` patterns. Pure parser. |
| Controller | `hiveMind.agent.context.read <agentName>` | Resolves name→pane→uuid, calls Model. If no uuid, captures pane and calls `fromCapture`. |
| Controller | `hiveMind.agent.context.check <agentName> <?threshold>` | Full check+alert cycle. |

The Model never asks "which pane is this agent in" — the Controller tells it.

---

### Leak 6 — `context.velocity.byPane <pane>`

**Current** (lines 1558-1586):
- Calls `claudeCode.session.id "$pane"` (Controller-coupled — reads `hivemind.sessions.env`)

**Target layer:** Controller.

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| Model | `claudeCode.context.velocity.byJsonl <file>` | Already pure (line 1587). Keep. |
| Model | `claudeCode.context.velocity.byUuid <uuid>` | **NEW** — lookup UUID→JSONL, delegate to byJsonl. |
| Controller | `hiveMind.agent.velocity <agentName>` | Resolves name→pane→uuid, calls Model `byUuid`. |

Delete `claudeCode.context.velocity.byPane` from Model — it belongs to Controller.

---

### Leak 7 — `agent.start <?workdir> <?model>`

**Current** (lines 1142-1166):
- Line 1158: `if [ -n "$TMUX" ]` — tmux assumption
- Line 1161: `otmux send "$currentPane" "cd '$workdir' && $cmd" Enter` — View leak

**Problem:** "Start an agent" is Controller — needs to know which pane, in which session, with which team.

**Target layer:** `hiveMind.agent.start` (already exists at hiveMind:1191+).

**Proposed action:** **Delete `claudeCode.agent.start` entirely**. The Model already provides `claudeCode.new`, `claudeCode.model`, `claudeCode.opus`. The Controller composes them.

---

### Leak 8 — `status` (mixed — partial leak)

**Current** (lines 1239-1283):
- Lines 1256-1268: `if [ -n "$TMUX" ]` branch — gets pane target + session.id

**Problem:** `claudeCode status` should report version, binary, role. The tmux branch belongs in Controller.

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| Model | `claudeCode.status` (cleaned) | Version, binary path, `$HIVEMIND_ROLE` env. No tmux branch. |
| Controller | `hiveMind.agent.status` | Composes Model status + pane info + session UUID + registry lookup. |

---

### Leak 9 — `context.self`

**Current** (lines 1394-1404):
- Line 1397: `otmux pane.get.target` — View leak
- Line 1399: `error.log "Not in a tmux pane"` — tmux assumption

**Problem:** "My own context" only makes sense from inside a pane. That's a Controller concern.

**Target layer:** Delete from claudeCode. Move to Controller.

**Proposed:**
```bash
hiveMind.agent.context.self()  # no args
# Gets self-pane via otmux, resolves to UUID, calls claudeCode.context.read.byUuid
```

---

### Leak 10 — `join` / `join.byName` / `join.byPane` / `fork.byName` / `fork.byPane`

**Current** (lines 280-445):
- `join` line 302: `otmux pane.get.target` — to key sessions.env writes by pane
- `join` lines 304-309: writes `hivemind.sessions.env` (Controller state)
- `join.byName` / `fork.byName`: read `hivemind.roles.env` + `hivemind.sessions.env`
- `join.byPane` / `fork.byPane`: take `<pane>` (View argument)

**Target layer:** Controller resolves, Model executes.

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| **Model** | `claudeCode.join <sessionId>` | Plain `claude --resume <uuid>`. Currently `join.byID` (line 323). Rename this. No sessions.env writes. |
| **Model** | `claudeCode.fork <sessionId>` | Plain `claude --resume --fork-session <uuid>`. Already exists (line 400). Keep. |
| Controller | `hiveMind.agent.join <agentName\|pane\|uuid>` | Resolves to UUID, writes sessions.env keyed by pane, calls Model `join`. |
| Controller | `hiveMind.agent.fork <agentName\|pane\|uuid>` | Same, forking. |

**Delete from Model:**
- `claudeCode.join.byName` → moves to Controller
- `claudeCode.join.byPane` → moves to Controller
- `claudeCode.fork.byName` → moves to Controller
- `claudeCode.fork.byPane` → moves to Controller
- `private.claudeCode.resolve.byName` → moves to hiveMind (private.hiveMind.resolve.byName)
- `private.claudeCode.resolve.byPane` → moves to hiveMind

The pane-keyed `hivemind.sessions.env` write (`join` lines 304-309) becomes `hiveMind.session.track <pane> <uuid>`.

---

### Leak 11 — Raw tmux in `private.claudeCode.complete.panes` (line 24)

**Current:**
```bash
private.claudeCode.complete.panes() {
  tmux list-panes -a -F "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null
}
```

**Problem:** Bypasses otmux wrapper. Should use the View layer's method.

**Target layer:** Stay in claudeCode as private helper (completions need *something*), but call otmux.

**Proposed fix (1-liner):**
```bash
private.claudeCode.complete.panes() {
  otmux panes -a -F "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null
}
```

Or, **better**, delete this helper from Model entirely and move completion providers to Controller:
- Any `claudeCode.*.completion.pane()` becomes `hiveMind.*.completion.pane()` in methods that belong to Controller post-refactor
- Model completion functions (e.g. `session.name.completion.sessionId`) already use `private.claudeCode.complete.sessionIds` which is Model-pure (reads JSONL dirs + `hivemind.sessions.env` as cache)

---

### Leak 12 — `process.find <pane>` + `process.running <pane>` (bridge)

**Current** (lines 846-868):
- Line 852: `otmux pane.get "$target" "#{pane_tty}"` — gets tty for ps lookup

**Problem:** Process find is fundamentally Model (ps-based UUID discovery), but needs tty which is View.

**Target layer:** **Split into two Model methods + Controller composer**.

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| **Model** | `claudeCode.process.find.byTty <tty>` | Pure ps-based lookup. Takes tty (short form like `ttys001`). |
| **Model** | `claudeCode.process.running.byPid <pid>` | `kill -0 <pid>` or `ps -p <pid>`. Pure. |
| Controller | `hiveMind.agent.process.find <agentName\|pane>` | Resolve to pane → `otmux pane.get tty` → call Model `byTty`. |

**Clean Model interface:**
```bash
claudeCode.process.find.byTty() # <tty> # find Claude PID on a given tty (pure ps — no otmux)
{
  local tty="$1"
  [ -z "$tty" ] && return 1
  ps -eo pid,tty,args 2>/dev/null | awk -v t="$tty" '$2 == t' \
    | grep -i 'claude' | awk '{print $1}' | head -1
}
```

This makes ps-based UUID discovery callable from **any** context — test fixtures, CI, remote scripts.

---

### Leak 13 — `session.state <pane>` / `session.current <pane>` (via `private.session.discover`)

**Current** (lines 966-982):
- Both delegate to `private.claudeCode.session.discover "$1"` (not shown yet — likely also pane-coupled)

Let me verify the discover function is also a leak.
```bash
# Expected: grep private.claudeCode.session.discover claudeCode → uses otmux
```

**Target layer:** Split discover into Model (byUuid/byTty) + Controller composer.

**Proposed:**

| Layer | Method | Responsibility |
|-------|--------|---------------|
| Model | `claudeCode.session.current.byTty <tty>` | ps-based UUID lookup. Pure. |
| Model | `claudeCode.session.state.byUuid <uuid>` | live/stable/stale/broken classification from ps + JSONL mtime. Pure. |
| Controller | `hiveMind.agent.session.current <agentName>` | Resolve → tty → Model call. |
| Controller | `hiveMind.agent.session.state <agentName>` | Resolve → uuid → Model call. |

---

## Summary Table — Full Leak Classification

| # | Leak | Method(s) | Current leak | Fix | Model replacement |
|---|------|-----------|--------------|-----|-------------------|
| 1 | session.probe | `session.probe` | `otmux send /status`, pane.capture, send Escape | Controller owns TUI flow | `claudeCode.session.probe.fromCapture <text>` |
| 2 | agent.recover | `agent.recover` | `hiveMind resolve.reverse`, `otmux send`, `pane.capture` | **Delete** (duplicate of hiveMind.agent.unblock) | — |
| 3 | model.set/get | `model.set`, `model.get` | `otmux send.enter /model X`, `pane.capture` | Controller | `claudeCode.model.parse.statusBar <text>` |
| 4 | context.alert | `context.alert` | `otmux send.enter` warning | Controller | (uses `context.read.byUuid`) |
| 5 | context.read/check | `context.read`, `context.check` | `otmux pane.capture` TUI fallback | Split Model/Controller | `context.read.byUuid`, `context.read.fromCapture` |
| 6 | context.velocity.byPane | `context.velocity.byPane` | `session.id "$pane"` (Controller coupling) | Delete from Model | `context.velocity.byUuid` |
| 7 | agent.start | `agent.start` | `$TMUX` check, `otmux send` | **Delete** (hiveMind.agent.start exists) | — |
| 8 | status mixed | `status` | `$TMUX` branch with `session.id` | Clean — remove `$TMUX` branch | Model reports only version/role |
| 9 | context.self | `context.self` | `otmux pane.get.target` + tmux error | **Delete** (Controller owns "self") | — |
| 10 | join/fork pane-aware | `join`, `join.byName/byPane`, `fork.byName/byPane` | sessions.env writes, role→UUID lookup | Controller resolves, Model executes UUID | `claudeCode.join <uuid>`, `claudeCode.fork <uuid>` |
| 11 | raw tmux | `private.claudeCode.complete.panes` | `tmux list-panes` direct | 1-liner → `otmux panes` | Same (keeps in Model) |
| 12 | process.find | `process.find`, `process.running` | `otmux pane.get tty` | Split Model/Controller | `claudeCode.process.find.byTty <tty>` |
| 13 | session.current/state | `session.current`, `session.state` | via `private.session.discover` (pane-coupled) | Split by tty/uuid | `session.current.byTty`, `session.state.byUuid` |

---

## Final Model Surface (target state)

After A1.2 refactor fully applied, `claudeCode` exposes only these categories:

### CLI Wrappers (27)
`sessions`, `list`, `list.json`, `continue`, `new`, `print`, `dangerously`, `verbose`, `chat`, `model`, `model.list`, `opus`, `sonnet`, `haiku`, `help`, `version`, `config`, `doctor`, `mcp`, `tools.allowed`, `tools.disallowed`, `turns.max`, `system.prompt`, `system.prompt.append`, `output`, `json`, `pipe`

### Lifecycle (6)
`init`, `update`, `login`, `logout`, `install`, `uninstall`

### UUID-based session ops (2)
`join <uuid>`, `fork <uuid>`  *(replaces join/join.byID/fork/fork.byID)*

### Data readers (ps / JSONL / file — no tmux)
- `process.find.byTty <tty>`
- `process.running.byPid <pid>`
- `session.current.byTty <tty>`
- `session.state.byUuid <uuid>`
- `session.name <uuid>` (already pure)
- `context.jsonl <?uuid>` (already mostly pure)
- `context.all` (already pure)
- `context.read.byUuid <uuid>` **NEW**
- `context.velocity.byJsonl <file>` (already pure)
- `context.velocity.byUuid <uuid>` **NEW**
- `context.dashboard` (already pure)

### Pure parsers (take text, return data)
- `session.probe.fromCapture <text>` **NEW**
- `context.read.fromCapture <text>` **NEW**
- `model.parse.statusBar <text>` **NEW**

### File readers (sessions)
- `session.save`, `session.recover` (already pure — read/write markdown)

### Status (cleaned)
- `status` — version + role only, no tmux branch

### DELETED from Model
- `agent.recover`  *(duplicate)*
- `agent.start`    *(Controller)*
- `context.self`   *(Controller)*
- `context.read`   *(split into byUuid + fromCapture)*
- `context.alert`  *(Controller)*
- `context.check`  *(Controller)*
- `context.velocity.byPane`  *(Controller)*
- `context.velocity` dispatcher  *(Controller orchestrates)*
- `session.probe` original impl  *(Controller does I/O; Model does parse)*
- `session.id`    *(Controller — reads cache, does probe fallback)*
- `model.set`, `model.get`  *(Controller)*
- `join.byName`, `join.byPane`  *(Controller)*
- `fork.byName`, `fork.byPane`  *(Controller)*
- `join` (pane-aware wrapper)    *(Controller composes)*

### Count: 68 public methods → ~40 (40% reduction, 100% pure)

---

## Test Handoff (for A1.3 tester)

After full refactor, tester must verify:

1. **Zero otmux matches in Model:**
   ```bash
   grep -nE 'otmux' $OOSH_DIR/claudeCode | grep -v '^[0-9]*:#' | grep -v 'usage\|help'
   # Expected: zero lines
   ```

2. **Zero raw tmux:**
   ```bash
   grep -nE '^\s*tmux\s' $OOSH_DIR/claudeCode
   # Expected: zero lines
   ```

3. **Zero hiveMind refs (except sessions.env read-as-cache):**
   ```bash
   grep -n '"$OOSH_DIR/hiveMind"' $OOSH_DIR/claudeCode
   # Expected: zero lines
   ```

4. **All Model methods callable without tmux:**
   ```bash
   # In fresh bash, NO tmux:
   TMUX= claudeCode fork $someUuid           # must succeed
   TMUX= claudeCode session.name $someUuid   # must succeed
   TMUX= claudeCode context.read.byUuid $uuid  # must succeed
   ```

5. **Pure parsers take fixture strings:**
   ```bash
   echo "Session name: oosh-expert@opus" | claudeCode session.probe.fromCapture
   # Returns UUID of newest matching JSONL
   ```

6. **Model methods testable without Controller:**
   ```bash
   # Model test suite runs without starting hiveMind
   test.suite run claudeCode
   # Expected: all pass, no hiveMind setup required
   ```

---

## Migration Safety

**Backward-compatibility shims** (accept during transition period):
- `claudeCode.join.byName` → thin wrapper that calls `hiveMind.agent.join` (1-line delegation)
- `claudeCode.fork.byName` → same
- `claudeCode.session.id` → thin wrapper that calls `hiveMind.agent.session.current`

These shims can be deleted after sprint-1 callers are migrated. Documented in wrapper as `# DEPRECATED — use hiveMind.agent.*`.

---

## Next Tasks

- **A1.3 (tester):** Write boundary violation tests asserting criteria 1-6 above
- **A2 (parallel task):** Session portability without tmux (naturally falls out of this refactor)
- **After A1.3 passes:** Implement fixes in order from Task A1.1 priority list
