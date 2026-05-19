# Task A1.1 — claudeCode Model Boundary Audit Findings

**Date:** 2026-04-24
**Role:** oosh-expert
**Target:** `/Users/donges/oosh/claudeCode` (1881 lines, 68 public methods)
**Verdict:** ~30% of methods have View/Controller leaks. Clean up required.

## Executive Summary

| Class | Count | Examples |
|-------|------:|----------|
| **Pure Model** (CLI + JSONL + ps) | 47 | `fork`, `continue`, `version`, `install`, `session.name`, `context.velocity.byJsonl` |
| **View leak** (calls `otmux`) | 14 | `session.probe`, `model.set/get`, `context.read`, `agent.recover` |
| **Controller leak** (calls `hiveMind` / writes hivemind.*.env) | 4 | `agent.recover`, `join`, `list` (reads registry), `list.json` |
| **Raw tmux** (bypasses otmux) | 1 | `private.claudeCode.complete.panes` |
| **tmux assumption** (`$TMUX`, `TMUX_PANE`, "not in tmux" error) | 3 | `agent.start`, `context.self` |

## Full Method Classification

| Line | Method | Classification | Issue / Where It Should Move |
|-----:|--------|----------------|------------------------------|
| 95 | `sessions` | Model | — plain `claude --resume` |
| 100 | `list` | Model with Controller-reference | Reads `hivemind.sessions.env` + `roles.env` for display (line 168, 172). Cross-reference is acceptable for display; keep. |
| 235 | `list.json` | Model | — reads JSONL files only |
| 280 | `join` | **View leak + Controller leak** | Line 302 `otmux pane.get.target`; lines 304-309 write `hivemind.sessions.env`. **Move session-tracking writes to `hiveMind.session.track` called by Controller**. Keep the `claude --resume` wrapper. |
| 323 | `join.byID` | Model | — plain `claude --resume` |
| 372 | `join.byName` | Controller leak | Reads `hivemind.sessions.env` + `roles.env` (via `private.claudeCode.resolve.byName` line 338). **Move to `hiveMind.agent.join` that resolves UUID, then calls Model `claudeCode.join.byID`**. |
| 385 | `join.byPane` | View leak + Controller leak | Takes `<pane>`. Delegates to `session.id` (which is Controller-coupled). **Move to `hiveMind.agent.join.byPane`**. |
| 400 | `fork` | Model | — plain `claude --resume --fork-session` |
| 412 | `fork.byID` | Model | — alias for `fork` |
| 420 | `fork.byName` | Controller leak | Same as `join.byName`. **Move to `hiveMind.agent.fork`**. |
| 434 | `fork.byPane` | View + Controller leak | Same as `join.byPane`. **Move to `hiveMind.agent.fork.byPane`**. |
| 448 | `continue` | Model | — plain `claude --continue` |
| 453 | `new` | Model | — plain `claude [--print]` |
| 462-472 | `print`, `dangerously`, `verbose` | Model | — plain CLI flags |
| 477-497 | `model`, `model.list`, `opus`, `sonnet`, `haiku`, `chat` | Model | — plain `claude --model` |
| 502 | `model.set` | **View leak** | Line 516: `otmux send.enter "$pane" "/model $model"`. **Move to `hiveMind.agent.model.set` — sends to pane is Controller**. Model keeps only `model` (CLI flag). |
| 526 | `model.get` | **View leak** | Line 533: `otmux pane.capture "$pane" 10` to scrape status bar. **Move to `hiveMind.agent.model.get`** — TUI scraping is View/Controller. |
| 574-594 | `help`, `version`, `config`, `doctor`, `mcp` | Model | — plain CLI |
| 599-673 | `tools.*`, `turns.max`, `system.prompt*`, `output`, `json`, `pipe` | Model | — plain CLI flags |
| 686-839 | `init`, `update`, `login`, `logout`, `install`, `uninstall` | Model | — plain CLI lifecycle |
| 846 | `process.find` | **Bridge method** | Line 852: `otmux pane.get "$target" "#{pane_tty}"` to get tty for `ps` lookup. Needed internally for UUID discovery. **Either (a) accept as Model↔View bridge and document, or (b) split: `claudeCode.process.find.byTty <tty>` (Model) + Controller wrapper that resolves pane→tty**. |
| 865 | `process.running` | Bridge (delegates to process.find) | Inherits process.find's View coupling. |
| 966 | `session.current` | Model | Scans `ps` args for UUIDs. No tmux coupling. Keep. |
| 975 | `session.state` | **View leak** | Lines 890, 894, 900: `otmux pane.get` for pane_id/title/current_path. **Move pane-centric state checks to Controller**. Keep pure-UUID state classification in Model. |
| 984 | `session.probe` | **Gross View leak** | Lines 995-999: `otmux send.raw "$target" "/status" Enter` + `otmux pane.capture` + `otmux send.raw "$target" Escape`. This is a TUI interaction — fundamentally a Controller action (controls a running agent). **Move entire method to `hiveMind.agent.session.probe`**. |
| 1033 | `session.id` | Controller leak (cache-only part is Model) | Reads `hivemind.sessions.env` as cache (line 1040). OK for Model to consult cache **if** the cache is considered shared state (like a database). Borderline — flag for discussion. |
| 1055 | `session.name` | Model | — parses JSONL files |
| 1142 | `agent.start` | **View leak + tmux assumption** | Lines 1158-1161: checks `$TMUX`, calls `otmux pane.get` + `otmux send`. **Move to `hiveMind.agent.start`**. Model keeps `claudeCode.new` / `claudeCode.model`. |
| 1168 | `session.save` | Model | — writes markdown file. No tmux. |
| 1215 | `session.recover` | Model | — reads markdown file. No tmux. |
| 1239 | `status` | Mixed — Model default + View fallback | Lines 1256-1268: if in tmux (`$TMUX`), calls `otmux pane.get.target` + `session.id`. **Split: `claudeCode.status` (Model — version, binary, role) + `hiveMind.agent.status` (pane-aware)**. |
| 1315 | `context.jsonl` | Model (mostly) | Line 1320: calls `session.id "$pane"` — carries through Controller dep. Otherwise pure. |
| 1394 | `context.self` | **View leak + tmux assumption** | Line 1397: `otmux pane.get.target`. Line 1399: `error.log "Not in a tmux pane"`. **Move to `hiveMind.agent.context.self`**. |
| 1405 | `context.read` | View leak (fallback) | Line 1477, 1481: `otmux pane.capture` for TUI scraping fallback (`context.read.tui`). JSONL path is Model; TUI path is View. **Split: keep `claudeCode.context.read.byUuid <uuid>` (Model) + `hiveMind.agent.context.read <pane>` (does pane→uuid then Model call)**. |
| 1508 | `context.all` | Model | — scans JSONL files. Good. |
| 1539 | `context.velocity` | Model | — dispatcher (byPane → byJsonl). byPane carries session.id dependency. |
| 1558 | `context.velocity.byPane` | Controller leak | Calls `session.id "$pane"` (Controller-coupled). **Move to `hiveMind.agent.velocity`**. Keep `byJsonl` in Model. |
| 1587 | `context.velocity.byJsonl` | Model | — pure JSONL parser. |
| 1662 | `context.dashboard` | Model | — aggregates JSONL velocities. |
| 1738 | `context.check` | **View leak** | Calls `context.read` + `context.velocity.byPane` (both View-coupled) + line 1820 `otmux send.enter` to alert. **Move to `hiveMind.agent.context.check`**. |
| 1799 | `context.alert` | **View leak** | Line 1820: `otmux send.enter "$pane" "CONTEXT: ${pct}% — save state now"`. **Move to `hiveMind.agent.context.alert`**. Sending to a pane is Controller. |
| 1830 | `agent.recover` | **View leak + Controller leak (biggest violator)** | Line 1848: `hiveMind resolve.reverse "$pane"`. Lines 1873, 1877, 1891: `otmux send` + `otmux pane.capture`. **Delete from claudeCode; live entirely in `hiveMind.agent.recover`** (already exists at hiveMind:4893+ as agent.unblock family). |

## Helper violations (private.* and complete.*)

| Line | Function | Issue |
|-----:|----------|-------|
| 24 | `private.claudeCode.complete.panes` | Calls `tmux list-panes` directly instead of `otmux pane.list`. **Fix: `otmux panes -a -F "#{session_name}:#{window_index}.#{pane_index}"`** |
| 287-309 | `join` (sessions.env write) | Writes Controller state from Model. **Extract to `hiveMind.session.store`**. |
| 338-367 | `private.claudeCode.resolve.byName/byPane` | Read `hivemind.sessions.env` + `hivemind.roles.env`. **Move to hiveMind**. |
| 1040 | `session.id` | Reads `hivemind.sessions.env` as cache. Borderline — accepts Controller cache. |

## Tmux assumptions to eliminate

| Line | Method | Assumption | Fix |
|-----:|--------|------------|-----|
| 1158 | `agent.start` | `if [ -n "$TMUX" ]` | Move tmux branch to Controller |
| 1258 | `status` | `if [ -n "$TMUX" ]` | Move tmux branch to Controller |
| 1394-1399 | `context.self` | `TMUX_PANE` + "Not in a tmux pane" error | Entire method belongs in Controller |

## Proposed Model Surface (Pure — no otmux/tmux/hiveMind)

After cleanup, `claudeCode` should expose only:

**CLI wrappers** (27 methods):
`sessions`, `list`, `list.json`, `continue`, `new`, `print`, `dangerously`, `verbose`, `chat`, `model`, `model.list`, `opus`, `sonnet`, `haiku`, `help`, `version`, `config`, `doctor`, `mcp`, `tools.allowed`, `tools.disallowed`, `turns.max`, `system.prompt`, `system.prompt.append`, `output`, `json`, `pipe`

**Lifecycle** (6):
`init`, `update`, `login`, `logout`, `install`, `uninstall`

**UUID + fork by UUID** (2):
`fork`, `fork.byID` (identical — collapse)

**Session UUID from process** (1):
`session.current` — ps-based, no tmux

**Session metadata by UUID** (3):
`session.name <uuid>`, `session.save`, `session.recover` — file-based

**JSONL-only context** (4):
`context.jsonl`, `context.all`, `context.velocity.byJsonl`, `context.dashboard`

**Status (non-pane)** (1):
`status` (pure — version/binary/role, no pane)

**Total Model surface: ~44 methods (from 68)**

## Proposed Moves to Controller (`hiveMind`)

| From `claudeCode` | To `hiveMind` | Reason |
|-------------------|----------------|--------|
| `join` (pane-keyed sessions.env writes) | `hiveMind.agent.join.byPane <pane>` | Controller tracks which pane runs which UUID |
| `join.byName`, `join.byPane` | `hiveMind.agent.join.byName/byPane` | Resolution is Controller concern |
| `fork.byName`, `fork.byPane` | `hiveMind.agent.fork.byName/byPane` | Same |
| `model.set`, `model.get` | `hiveMind.agent.model.set/get` | Pane interaction |
| `session.probe` | `hiveMind.agent.session.probe` | /status + pane capture = TUI control |
| `session.state` (pane-coupled parts) | `hiveMind.agent.state` | Uses pane_id/title/cwd |
| `agent.start` | `hiveMind.agent.start` | Already orchestrator concern |
| `agent.recover` | Delete — already in hiveMind as `agent.unblock` family | Duplicate |
| `context.self`, `context.read` (TUI fallback), `context.check`, `context.alert` | `hiveMind.agent.context.*` | All pane-aware |
| `context.velocity.byPane` | `hiveMind.agent.velocity` | Resolves pane first |

## Fix Priority (for A1.2 and A2)

1. **Critical** — remove `private.claudeCode.complete.panes` raw `tmux list-panes` → use `otmux panes` (1-line fix)
2. **High** — split `session.probe` into `hiveMind.agent.session.probe` (calls `claudeCode.session.id` after probe)
3. **High** — move `agent.recover` out of claudeCode (it's a duplicate of hiveMind's agent.unblock family)
4. **High** — split `context.read` / `context.read.tui` — Model (byUuid) stays, Controller wrapper (byPane) moves
5. **Medium** — move `join`/`fork` pane-aware variants to Controller; keep `byID` in Model
6. **Medium** — `agent.start`, `status`, `context.self` — remove `$TMUX` branches, delegate to Controller
7. **Low** — `session.id` reading sessions.env: acceptable as cache read; flag for PO decision

## Test Handoff (A1.3 for oosh-tester)

Test requirements for "pure Model" claim:
- After cleanup, `grep -E 'otmux|\btmux ' $OOSH_DIR/claudeCode` → returns **zero matches** (excluding comments + usage text)
- After cleanup, `grep 'OOSH_DIR/hiveMind' $OOSH_DIR/claudeCode` → returns **zero matches**
- All CLI wrapper methods work without tmux: `TMUX= claudeCode fork $uuid` succeeds
- Model methods callable from any shell context (plain bash, no tmux, no OOSH team session)

## Related

- Task A1.2: View Leak Identification (complements this audit from the other side)
- Task A1.3: Tester - Boundary Violation Tests (validates zero-match after cleanup)
- Task A2: Session Portability (depends on this audit's model-surface definition)
