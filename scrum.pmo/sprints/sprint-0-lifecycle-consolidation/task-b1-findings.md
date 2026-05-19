# Task B1 — otmux MVC Boundary Audit Findings

**Date:** 2026-04-24
**Role:** oosh-expert
**Target:** `/Users/donges/oosh/otmux` (2306 lines)
**Covers:** B1.1 (Controller/Model Leak Identification) + B1.2 (Sender Prefix Layer Decision)

---

## TL;DR

otmux is **mostly pure View** (95%+ of 2306 lines are raw tmux wrappers). Five discrete leaks
found, all concentrated in 3 specific methods:

| Severity | Leak | Layer |
|----------|------|-------|
| **HIGH** | `private.otmux.send.prefix` reads `HIVEMIND_ROLE` / `HIVEMIND_REGISTRY` to decorate messages | Controller → View |
| **HIGH** | `otmux.tronMonitor.setup` calls `private.hiveMind.ensure.pane` (cross-layer private call) | Controller → View |
| **MEDIUM** | `otmux.tree` / `otmux.tree.detailed` call `claudeCode process.running` + `version` for display | Model → View |
| **MEDIUM** | `otmux.tree.detailed` calls `hiveMind protected.agents.discover` for enrichment | Controller → View |
| **ACCEPTED** | `otmux.session.rename` notifies `hiveMind protected.session.renamed` (observer pattern) | View → Controller (event) |

**B1.2 Recommendation:** Move prefix to Controller (`hiveMind.send.message`). otmux.send becomes prefix-agnostic.

---

## B1.1 Full Leak Catalog

### Leak 1 (HIGH) — `private.otmux.send.prefix` (lines 1083-1094)

**Current code:**
```bash
private.otmux.send.prefix() # # return sender prefix [@role pane] or empty string
{
  local reg="${HIVEMIND_REGISTRY:-${CONFIG_PATH:-$HOME/config}/hivemind.roles.env}"
  local myPane
  myPane=$($TMUX_CMD display-message -p "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null)
  [ -z "$myPane" ] && return
  local myRole="${HIVEMIND_ROLE:-}"
  if [ -z "$myRole" ] && [ -f "$reg" ]; then
    myRole=$(grep "^${myPane}|" "$reg" 2>/dev/null | head -1 | cut -d'|' -f2)
  fi
  [ -n "$myRole" ] && echo "[@${myRole} ${myPane}] "
}
```

**Called by** `private.otmux.send.smart` (line ~1153):
```bash
# Step 2: Add sender prefix (Claude Code targets only, skip /commands)
if private.otmux.pane.isClaudeCode "$target" && [[ "$text" != /* ]]; then
  local prefix
  prefix=$(private.otmux.send.prefix)
  [ -n "$prefix" ] && text="${prefix}${text}"
fi
```

**What it does:** When agent A sends text to agent B via `otmux send`, the View reads
hiveMind's role registry to look up A's role name, then prepends `[@A_role A_pane]` to the
message. This is how agents know who sent them a message.

**Why it's a leak:**
- View knows about agent roles (`HIVEMIND_ROLE`)
- View reads Controller's config file (`hivemind.roles.env`)
- View knows which panes are Claude Code (`pane.isClaudeCode` → calls `claudeCode process.running`)
- View knows to skip `/commands` (domain knowledge of Claude Code's command syntax)

**Fix:** See B1.2 recommendation below. Remove both `private.otmux.send.prefix` and its caller.

### Leak 2 (HIGH) — `otmux.tronMonitor.setup` (line 2208)

**Current code:**
```bash
otmux.tronMonitor.setup() # <?session:TRONinterface> <?pane:0.3> # create TRON-Monitor pane...
{
  # ... session and pane setup ...
  private.hiveMind.ensure.pane "$target" 2>/dev/null || {
    # Fallback: split until we have enough panes
    ...
  }
  # Run tronMonitor setup on the target pane
  "$OOSH_DIR/tronMonitor" setup "$target"
}
```

**Why it's a leak:** View calls a `private.hiveMind.*` function directly — crossing both
layer boundaries AND visibility (private methods are by convention internal to their script).

**Fix options:**
1. Move entire method to `hiveMind.tronMonitor.setup` (Controller)
2. Inline the pane-creation fallback (the only thing it needs is `otmux split-window`)
3. Create a public `otmux.pane.ensure <target>` helper that doesn't need hiveMind

**Recommended:** Option 2 — inline with pure otmux calls. The `private.hiveMind.ensure.pane`
logic is ~10 lines of `split-window` + `select-layout tiled` which otmux already does.

### Leak 3 (MEDIUM) — `otmux.tree` claudeCode version decoration (lines 1425-1427, 963)

**Current code** (in `otmux.tree`, display loop):
```bash
# When pane_cmd is bash/zsh, check for Claude child process and show version
local display_cmd="$pane_cmd"
if [[ "$pane_cmd" == "bash" || "$pane_cmd" == "zsh" ]]; then
  local pane_target="${sess_name}:${win_idx}.${pane_idx}"
  if "$OOSH_DIR/claudeCode" process.running "$pane_target" 2>/dev/null; then
    local ver
    ver=$("$OOSH_DIR/claudeCode" version "$pane_target" 2>/dev/null)
    ver="${ver%% (*}"  # trim " (Claude Code)" suffix
    [ -n "$ver" ] && display_cmd="$ver"
  fi
fi
```

Also in `private.otmux.pane.isClaudeCode` (line 963):
```bash
"$OOSH_DIR/claudeCode" process.running "$target" 2>/dev/null && return 0
```

**What it does:** The tree display shows pane command; for bash/zsh panes it checks if
Claude is running inside and shows Claude's version instead.

**Why it's a leak:** View calls Model to enrich display. Technically OK as a **read-only
enrichment**, but:
- Couples View to Model's CLI (`claudeCode process.running`, `claudeCode version`)
- If claudeCode moves/renames, otmux.tree breaks

**Fix:** Move the version-lookup decoration to Controller. Two options:
- **A.** `otmux.tree` returns raw pane_cmd; `hiveMind.tree` is a thin wrapper that enriches
- **B.** Inject decorator via callback/env: `OTMUX_TREE_DECORATOR=claudeCode otmux tree`

**Recommended A** for clarity — Controller composes View output.

### Leak 4 (MEDIUM) — `otmux.tree.detailed` hiveMind enrichment (lines 1510-1511)

**Current code:**
```bash
# DRY: fetch shared discovery once per session (from hiveMind protected method).
local discover_data=""
if command -v hiveMind >/dev/null 2>&1; then
  discover_data=$(hiveMind protected.agents.discover "$sess_name" 2>/dev/null)
fi
```

**What it does:** `tree.detailed` optionally shows agent roles + UUIDs per pane, fetched
from hiveMind's discovery.

**Why it's a leak:** Same as Leak 3 — View reaching into Controller for display enrichment.
The method name `tree.detailed` is agent-agnostic but behavior is agent-aware.

**Fix:** Move to Controller as `hiveMind.team.tree` (or similar). View has only plain
`otmux.tree` and `otmux.tree.detailed` (which shows pane info without agent semantics).

### Leak 5 (ACCEPTED) — `otmux.session.rename` observer notification (line 168-169)

**Current code:**
```bash
otmux.session.rename() # <session> <?newName> ...
{
  # ... rename logic ...
  # Notify hiveMind to update env files (observer pattern)
  command -v hiveMind >/dev/null 2>&1 && hiveMind protected.session.renamed "$oldName" "$newName" 2>/dev/null
}
```

**Why this is ACCEPTED despite crossing layers:**
- It's a **one-way push event** — View announces, Controller reacts
- View doesn't depend on Controller's response (uses `2>/dev/null`)
- `command -v hiveMind` check means View works without Controller
- This is the standard observer pattern: View fires "change" events that Controller can
  optionally subscribe to

**Alternative if strict purity required:** Remove the notification; require callers to notify
Controller separately. But this breaks the pattern where renaming a session updates registries
atomically. The current implementation is **correct architecture** — a View pushing events
to a loose listener.

**Recommendation:** **Keep as-is.** Document as intentional pattern.

---

## B1.2 Sender Prefix Layer Decision

### Current behavior

`otmux send <target> <text>` → internally calls `private.otmux.send.smart` which:
1. Checks if target pane runs Claude Code (calls `claudeCode process.running`)
2. If yes + not a `/command`: calls `private.otmux.send.prefix` which reads `HIVEMIND_ROLE` +
   `hivemind.roles.env` to produce `[@role pane]` prefix
3. Prepends prefix to text
4. Sends via `otmux send.verified`

### Options evaluated

#### Option A — `otmux.send --prefix <prefix>` optional parameter

```bash
otmux.send() { # <target> <?prefix> <text...> # send; optional prefix prepended
```

**Pros:** View stays dumb. Callers (hiveMind) provide prefix.

**Cons:**
- OOSH convention: no flags, positional args only. Adding optional `<?prefix>` is ambiguous
  with `<text...>` — how do we disambiguate?
- Every non-hiveMind caller of `otmux send` would need to know whether to pass prefix or not
- Doesn't cleanly handle the "skip /commands" rule (that's Controller semantics)

**Verdict:** Awkward for OOSH. Rejected.

#### Option B — Controller wraps View

```bash
# Controller layer (hiveMind)
hiveMind.send.message <agentName> <message> → builds prefix → otmux send <target> <prefix + message>

# View layer (otmux)
otmux send <target> <text> → sends text verbatim, no magic
```

**Pros:**
- Clear separation: Controller knows about agents, formats messages; View just sends bytes
- Controller already exists (`hiveMind.send.message`, `hiveMind.agent.send`) — minor wiring
- Rule "don't prefix /commands" lives where it belongs (Controller knows semantics)
- otmux immediately testable without hiveMind env
- Non-hiveMind callers of `otmux send` get raw behavior, no surprises

**Cons:**
- Breaking change for direct `otmux send` callers who currently rely on auto-prefix
- Migration: all call sites using raw `otmux send` for agent-to-agent messages must switch
  to `hiveMind send.message` (search across oosh shows ~40 direct `otmux send` calls)

**Mitigation:** Transition period — keep `private.otmux.send.prefix` as deprecated shim that
logs a warning but still works, until callers migrate.

**Verdict:** **RECOMMENDED.**

#### Option C — Per-pane prefix config set at setup

```bash
otmux.pane.prefix.set <pane> <prefix>  # stored in per-pane config
otmux.send <target> <text>             # looks up stored prefix, prepends if exists
```

**Pros:**
- No Controller coupling in the send path
- Prefix is a pane attribute, not a runtime concern

**Cons:**
- Introduces persistence burden (where is prefix stored? memory? file?)
- Pane identity is ephemeral (panes come and go); config would need cleanup
- "skip /commands" rule still needs to live somewhere — ends up back in View

**Verdict:** Rejected as too complex for the benefit.

### Recommendation: Option B with deprecation shim

**Step 1 (this sprint, implementable now):** Extract prefix logic to hiveMind.

```bash
# NEW in hiveMind (Controller)
private.hiveMind.send.prefix() # <fromPane> # return "[@role pane] " for sender
{
  local myPane="$1"
  local reg="${HIVEMIND_REGISTRY:-${CONFIG_PATH:-$HOME/config}/hivemind.roles.env}"
  local myRole="${HIVEMIND_ROLE:-}"
  if [ -z "$myRole" ] && [ -f "$reg" ]; then
    myRole=$(grep "^${myPane}|" "$reg" 2>/dev/null | head -1 | cut -d'|' -f2)
  fi
  [ -n "$myRole" ] && echo "[@${myRole} ${myPane}] "
}

# UPDATED in hiveMind.send.message (Controller)
hiveMind.send.message() # <agentName> <message>
{
  local name="$1" message="$2"
  local target
  target=$(hiveMind.resolve "$name") || return 1

  # Only prefix when target is a Claude Code pane and message isn't a /command
  if [[ "$message" != /* ]] && otmux pane.isClaudeCode "$target" 2>/dev/null; then
    local myPane prefix
    myPane=$(otmux pane.get.target 2>/dev/null)
    prefix=$(private.hiveMind.send.prefix "$myPane")
    [ -n "$prefix" ] && message="${prefix}${message}"
  fi

  otmux send "$target" "$message"
}
```

**Step 2 (this sprint):** In otmux, deprecate `private.otmux.send.prefix` — keep it but
short-circuit to empty if `HIVEMIND_SEND_PREFIX_OWNED_BY_CONTROLLER=1` env is set.
`hiveMind.send.message` sets this env when it invokes otmux, ensuring no double-prefixing.

**Step 3 (future sprint):** Once all callers use `hiveMind send.message`, delete the shim
from otmux entirely.

**Step 4:** `otmux pane.isClaudeCode` stays in otmux as a pane classifier — but is made
dumb: no claudeCode calls, just `pane_current_command` check against known claude commands.
Or move it to `claudeCode.pane.isClaudeCode` (Model method).

---

## Final Leak-Fix Priority

| # | Leak | Method | Fix | Priority |
|---|------|--------|-----|----------|
| 1 | Prefix injection | `private.otmux.send.prefix` | Move logic to `hiveMind.send.message` (Option B) | **HIGH** — unblocks View purity |
| 2 | `tronMonitor.setup` private.hiveMind call | `otmux.tronMonitor.setup` | Inline pane-creation fallback with pure otmux calls | **HIGH** — trivial fix |
| 3 | `pane.isClaudeCode` Model query | `private.otmux.pane.isClaudeCode` | Move to claudeCode or make dumb (grep pane_current_command) | MEDIUM |
| 4 | Tree version decoration | `otmux.tree`, `otmux.tree.detailed` | Move enrichment to `hiveMind.team.tree` | MEDIUM |
| 5 | tree.detailed hiveMind discovery | `otmux.tree.detailed` | Same as above — Controller owns agent-aware tree | MEDIUM |
| 6 | session.rename observer notify | `otmux.session.rename` | **KEEP** — documented as intentional observer pattern | ACCEPTED |

---

## Final View Surface (Target State)

After B1 refactor fully applied, otmux exposes:

**Pure tmux wrappers (~95% unchanged):**
- Session: `new`, `attach`, `detach`, `sessions`, `has`, `kill`, `rename`, `switch`, `last`, `next`, `prev`, `lock`
- Window: `new`, `list`, `select`, `next`, `prev`, `last`, `kill`, `rename`, `move`, `swap`, `link`, `unlink`, `find`, `rotate`, `respawn`
- Pane: `list`, `get`, `split*`, `select`, `up/down/left/right`, `kill`, `break`, `join`, `swap`, `move`, `resize`, `zoom`, `respawn`, `capture*`, `history*`, `title`, `send*`, `lock`, `unlock`
- Layout: `layout`, `tiled`, `evenH`, `evenV`, `mainH`, `mainV`, next/prev
- Buffers, Clients, Server, Config, Keys, Env: (all pure tmux)
- `send.raw`, `send.key`, `send.tui`, `send.enter`, `send.verified`

**Deleted / moved:**
- `private.otmux.send.prefix` → `private.hiveMind.send.prefix`
- `private.otmux.send.smart` becomes pure (no prefix injection, no pane.isClaudeCode check)
- `otmux.tronMonitor.setup` → `hiveMind.tronMonitor.setup` (or inline fallback)
- `otmux.tree` / `otmux.tree.detailed` version/role decoration → `hiveMind.team.tree`

**Kept as View (cross-layer event, intentional):**
- `otmux.session.rename` notifies `hiveMind protected.session.renamed`

---

## Test Handoff (for B1.3 tester)

1. **Zero claudeCode refs in View send path:**
   ```bash
   # After fix, send.smart should not call claudeCode
   grep -nE '"\$OOSH_DIR/claudeCode"' $OOSH_DIR/otmux | grep -v 'tree\|#'
   # Expected: zero lines (or only tree decoration if we keep option A)
   ```

2. **Zero HIVEMIND_ env reads in send path:**
   ```bash
   grep -nE 'HIVEMIND_' $OOSH_DIR/otmux
   # Expected: zero lines after refactor (session.rename notification uses command -v check)
   ```

3. **Prefix now comes from Controller:**
   ```bash
   # otmux send delivers raw text
   TMUX=... otmux send someTarget "hello"
   # Capture: "hello" (no [@role] prefix)

   # hiveMind send.message delivers prefixed text
   hiveMind send.message peerAgent "hello"
   # Capture: "[@myRole myPane] hello"
   ```

4. **No double-prefix possible:**
   ```bash
   # Calling otmux send with already-prefixed text doesn't add another prefix
   otmux send peer "[@already-prefixed] msg"
   # Capture: exactly that text, no modification
   ```

5. **tronMonitor.setup no longer calls private.hiveMind:**
   ```bash
   grep 'private.hiveMind' $OOSH_DIR/otmux
   # Expected: zero lines
   ```

6. **session.rename observer still fires:**
   ```bash
   # After rename, hiveMind sessions.env should update
   otmux session.rename oldSess newSess
   grep newSess ~/config/hivemind.sessions.env  # should find updated entries
   ```

---

## Summary Metrics

| Metric | Before | Target (after B1 implementation) |
|--------|--------|-----------------------------------|
| `claudeCode` refs in otmux | 5 | 0 (all moved to Controller) |
| `hiveMind` refs in otmux | 5 | 1 (session.rename observer — accepted) |
| `HIVEMIND_*` env reads | 2 | 0 |
| `private.hiveMind.*` calls | 1 | 0 |
| `hivemind.*.env` file reads | 1 | 0 |
| Lines of agent-aware logic in View | ~50 | 0 |

---

*Sprint 0 - Lifecycle Consolidation — Epic B: otmux View Layer*
