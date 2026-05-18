# OOSH Expert Learnings

## NEW: TMUX_PANE for subprocess-safe self-pane resolution (2026-05-17, Tron P0 #3)

**Production-broken-since-forever bug:** `tmux display-message -p '#{format}'` WITHOUT
`-t` returns information for the FOCUSED pane (wherever the user last clicked) — NOT
the pane that called tmux. When you're a subprocess (Bash tool, otmux send wrapper,
any `script.sh` invocation), you have no attached client, so "focused" falls back to
whatever the active client of the calling session happens to be.

**Consequence:** every `otmux send` subprocess that built the sender prefix
resolved to the WRONG pane. Prefix said `[@oosh-po ooshTeam:0.0]` when sent from
`oosh-expert ooshTeam:0.2`. Silent corruption — receiving agents acted on the
wrong attribution.

**Fix:** tmux exports `TMUX_PANE=%N` to every child process of every pane. Pass
it as `-t` to display-message:
```bash
local pane
pane=$($TMUX_CMD display-message -p -t "$TMUX_PANE" '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
```

**Early-return guard for non-tmux contexts (CI, cron, plain shell):**
```bash
[ -z "$TMUX_PANE" ] && return    # not in tmux → no caller pane
```

**Generalization:** ANY tmux query inside an OOSH method that wants "info about
the caller's pane/session" must explicitly target `-t "$TMUX_PANE"`. Bare
display-message is a footgun. The same rule applies to derived methods like
`#{session_name}` (gets focused session, not caller session).

## NEW: Registry-only role lookup — env vars go stale (2026-05-17, Tron P0 #1)

`HIVEMIND_ROLE` is exported once at shell start. After pane swaps/moves/agent
renames, the env value doesn't auto-update — but the registry file IS updated
(by SC-C event handlers). So:

**WRONG (env-first):**
```bash
local myRole="${HIVEMIND_ROLE:-}"
[ -z "$myRole" ] && myRole=$(grep "^${pane}|" "$reg" | cut -d'|' -f2)
```
After a swap, env is stale, registry is fresh — caller gets the OLD role.

**RIGHT (registry only):**
```bash
local myRole=$(grep "^${pane}|" "$reg" | cut -d'|' -f2)
```

The push of `HIVEMIND_ROLE` to shells (in `private.hiveMind.pane.pushRoleEnv`)
is STILL useful — future Claude processes inherit it at launch, and shell users
see consistent `$HIVEMIND_ROLE`. But never read it as a source of truth.

**Generalization:** with the SC-B event dispatch + SC-C handlers now writing
through to env files on every mutation, env files ARE the cache that handlers
keep fresh. Process env vars are pre-handler-era stale-by-default. Always read
the file, not the env.

## NEW: this.isEmpty + DRY ingress predicates in kernel (2026-05-17)

Five new kernel predicates in `this` (sibling to `this.isNumber`):

```bash
this.isEmpty()        # [[ ^[[:space:]]*$ ]] — empty or whitespace-only
this.isPaneTarget()   # session:win.pane OR %N
this.isSessionName()  # tmux session name regex
this.isRoleName()     # [A-Za-z][A-Za-z0-9._-]{0,39}
this.isUuid()         # 36-char Claude UUID
this.isPipeSafe()     # no | or newline (env-file safety)
```

Pattern: every script sources `this` at start, so kernel predicates are pure
bash functions available everywhere with zero subprocess cost. Replaced 8+
inline regexes across otmux/hiveMind in `1276e58`. Triple-defense applications
in `c1ecf3f`/`a7f5cb0`/`085f621`.

**The rule:** if a predicate would otherwise be duplicated across 2+ scripts,
it belongs in `this`. Pure bash (no I/O, no dependencies on other OOSH scripts)
is the contract for kernel predicates.

## NEW: Empty-send guard prevents agent hallucination (2026-05-17, Tron P0 #2)

A bare `[@role pane] ` prefix delivered into a Claude TUI reads as a USER
PROMPT with no body. The agent treats it as a request and HALLUCINATES a task
to fulfill the apparent ask. PO observed agents committing unrequested work
after empty `otmux send` invocations from automation.

**Defense at 8 entry points** (with `this.isEmpty`):
- otmux: `send`, `send.smart`, `send.verified`
- hiveMind: `send`, `send.message`, `agent.send`, `agent.inform`, `broadcast`

`return 0` (silent no-op), NOT `return 1` (error). Callers passing variables
that MAY be empty shouldn't have to wrap every send with `[ -n "$msg" ]`.

**Architecture rule:** if a method composes user-visible output from user-supplied
input + a templated wrapper (prefix, header, etc), the empty input must short-circuit
BEFORE the template is applied — otherwise the wrapper alone gets delivered as
"the message" and downstream consumers misinterpret it.

## NEW: ps tty="??" is the detached-process trap (2026-05-18, fast-path)

`ps -eo pid,tty,args | grep -i claude` over-matches:
- Real claude binaries on a real tty: `38723 ttys025 /Users/donges/.local/bin/claude --resume ...`
- Detached zsh subshells whose ARGS contain "claude" text: `41714 ?? /bin/zsh -c ...long args mentioning claude...`

The `??` means no controlling tty — these processes can't be on any user pane.
Mixing them into a tty→pid map produces false positives.

**Filter:**
```bash
while read -r pid tty args; do
  [ -z "$tty" ] || [ "$tty" = "??" ] && continue
  case "$args" in *claude*) MAP["$tty"]="$pid" ;; esac
done < <(ps -eo pid=,tty=,args= 2>/dev/null)
```

**Companion gotcha:** `pane_tty` from tmux has the `/dev/` prefix
(`/dev/ttys025`); ps tty column omits it (`ttys025`). Strip on insert:
```bash
TREE_TTY["$pane"]="${pane_tty#/dev/}"
```

## NEW: Batch-cache pattern for per-pane operations (2026-05-18, fast-path)

`otmux.tree` took 40.7s on 76 panes because the inner loop called
`claudeCode process.running <pane>` per bash/zsh pane. Each call shelled out
to `otmux pane.get $pane tty` (full OOSH bootstrap, ~200ms) + `ps -eo …`
(~50ms). 75 × 0.5s = 37s.

**Fix pattern — build caches ONCE at function entry:**
```bash
declare -A TREE_TTY=()           # pane_target → tty
declare -A TREE_CLAUDE_PID=()    # tty → claude pid
while IFS='|' read -r _p _t; do TREE_TTY["$_p"]="${_t#/dev/}"; done \
  < <(tmux list-panes -aF '#{session_name}:#{window_index}.#{pane_index}|#{pane_tty}')
while read -r pid tty args; do ...; done < <(ps -eo pid=,tty=,args=)
# Per-pane in inner loop: O(1) assoc lookup
local _tty="${TREE_TTY[$pane]}"
[ -n "$_tty" ] && [ -n "${TREE_CLAUDE_PID[$_tty]:-}" ] && display_cmd="$VERSION"
```

Result: 40.7s → 1.1s (37×). Works because bash assoc arrays survive nested
`echo X | while …` pipe subshells (verified — inheritance by value, reads work
even through 2-level nesting).

**Generalization:** any "per-pane / per-X expensive query" pattern in a render
function can collapse to ONE batch query + N assoc lookups. The cache lifetime
is the function call; declare local-scope at function top.

## NEW: 3-tier speed model for render functions (2026-05-18, fast-path)

| Tier | Cost | Content | Use case |
|------|------|---------|----------|
| 1 | <0.5s | Session list, pane counts, attach state | Default no-arg (`otmux`) |
| 2 | <1.5s | Per-pane tree, titles, current command | `otmux tree` |
| 3 | seconds-minutes | + UUIDs, models, agent discover | `otmux tree.detailed` (explicit opt-in) |

Don't put Tier-3 cost in the default Tier-1 path. The old `otmux.status()`
called `otmux.tree` which forced 40s for every `otmux` invocation.

## NEW: Cross-team writes blocked by harness (2026-05-15)

The harness refuses `otmux send <other-team>:0.X "..."` from a Bash tool when
the request originated from a captured-pane relay (e.g. PO forwarding a
message from ud-po). Error: "external-system write/publication to others
not authorized by the user". Right call from a security standpoint.

**Workaround:** relay the answer through your own PO (same-team send, always
authorized). They forward it to the other PO. Don't try to bypass.

## NEW: Cross-component symlinks must respect workspace symlink chain (2026-05-16)

`/Users/Shared/Workspaces/AI/Claude/docs` is ITSELF a symlink chain:
`Claude → components/OOSH/dev.claude/docs`. So relative `../components/...`
from the visible `docs/` path traverses through the chain and resolves wrong.

**Fix:** use the path from the UNDERLYING git location. From
`dev.claude/docs` to `macos/docs` is `../../macos/docs/`. Workspace-portable
across all OOSH branch variants.

**Git also blocks symlinked-path commits:** `git add docs/symlink.md` from the
workspace root fails with "pathspec is beyond a symbolic link". Must `cd` to
the underlying repo (`components/OOSH/dev.claude`) and add from there.

## NEW: `otmux fit` vs `otmux size.unlock` semantics (2026-05-17)

Both deal with window sizing but for different cases:
- `otmux size.unlock <?session>` — set window-size=largest, aggressive-resize=on. Window adapts to LARGEST attached client. Multi-client dynamic.
- `otmux fit <?session>` — one-shot snap to CALLER'S terminal cols×rows. Implicitly sets window-size=manual. Use when you want your terminal to fit perfectly, ignoring other clients.

Pairs: `fit` for "now"; `size.unlock` to return to follow-largest behavior.

## NEW: Tron's "try again" pattern (2026-05-17)

When scrum-master at TRONinterface:0.1 says "try again", they don't always
mean "your previous attempt failed". Often it means "retry verification —
your declared success was based on stale state". Or "I see you didn't actually
test live, just inferred from code reading". Treat as a prompt to run a
real end-to-end verification before claiming done.

## NEW: Tron P0 v2 — DRY single-source for key-vs-prose detection (2026-05-12 LATE)

Two attempts to fix the sender-prefix leak in `otmux.send`:

**v1 (`480459a`)** — extended is_key regex to add single alphanumeric. Caught `otmux send pane 2` (single digit) but missed:
- `Shift+Tab` (plus-syntax)
- `BTab` / `BackSpace` (named keys not in original list)
- Multi-modifier `C-M-Up`
- Case variations (`enter` lower)

**v2 (`2a39a60`)** — extracted `private.otmux.is.key` as DRY single source of truth, broke detection into 4 explicit cases:
1. **Single non-whitespace char** — `[^[:space:]]` regex (covers digits, letters, punctuation)
2. **Named tmux keys** — case-insensitive `case` lookup with aliases:
   - Navigation: up/down/left/right/home/end
   - Editing: space/tab/enter/escape/esc, bspace/backspace/bs, btab/backtab, dc/delete/del, ic/insert/ins, ppage/pageup/pgup, npage/pagedown/pgdn
   - Function: f1..f12, any
3. **Modifier prefix combos** — `^([CMS]-){1,3}[^[:space:]-]+$` (C-c, M-x, S-Tab, C-M-Up, C-M-S-BTab)
4. **Plus-syntax shortcuts** — `^(Shift|Ctrl|Alt|Meta|Cmd|Super)(\+(Shift|Ctrl|Alt|Meta|Cmd|Super)){0,2}\+[^[:space:]]+$` (Shift+Tab, Ctrl+Shift+X)

**Rule the PO articulated:** prefix is for INFORM-path prose ONLY. Every key send by any name or modifier syntax must be prefix-free.

**Generalization:** when classifying user input across MULTIPLE formats (canonical, alt-spellings, shortcuts), don't try to enumerate in one mega-regex. Split into ordered explicit cases. Each case is independently testable and extensible. The mega-regex pattern grew organically and missed half the spec; the cased helper covers 33/33 keys + 7/7 prose correctly.



## NEW: DRY single-source for key-vs-prose detection (2026-05-12 LATE, Tron P0 v2)

Two attempts to fix the sender-prefix leak in `otmux.send`:

**v1 (`480459a`)** — extended is_key regex to add single alphanumeric. Caught `otmux send pane 2` (single digit) but missed:
- `Shift+Tab` (plus-syntax)
- `BTab` / `BackSpace` (named keys not in original list)
- Multi-modifier `C-M-Up`
- Case variations (`enter` lower)

**v2 (`2a39a60`)** — extracted `private.otmux.is.key` as DRY single source of truth, broke detection into 4 explicit cases:
1. **Single non-whitespace char** — `[^[:space:]]` regex (covers digits, letters, punctuation)
2. **Named tmux keys** — case-insensitive `case` lookup with aliases:
   - Navigation: up/down/left/right/home/end
   - Editing: space/tab/enter/escape/esc, bspace/backspace/bs, btab/backtab, dc/delete/del, ic/insert/ins, ppage/pageup/pgup, npage/pagedown/pgdn
   - Function: f1..f12, any
3. **Modifier prefix combos** — `^([CMS]-){1,3}[^[:space:]-]+$` (C-c, M-x, S-Tab, C-M-Up, C-M-S-BTab)
4. **Plus-syntax shortcuts** — `^(Shift|Ctrl|Alt|Meta|Cmd|Super)(\+(Shift|Ctrl|Alt|Meta|Cmd|Super)){0,2}\+[^[:space:]]+$` (Shift+Tab, Ctrl+Shift+X)

**Rule the PO articulated:** prefix is for INFORM-path prose ONLY. Every key send by any name or modifier syntax must be prefix-free.

**Generalization:** when classifying user input across MULTIPLE formats (canonical, alt-spellings, shortcuts), don't try to enumerate in one mega-regex. Split into ordered explicit cases. Each case is independently testable and extensible. The mega-regex pattern grew organically and missed half the spec; the cased helper covers 33/33 keys + 7/7 prose correctly.

## NEW: Event handler split — registry mutator + role_env pusher (2026-05-12 LATE, SC-C.6/7)

When migrating B5.1 protected observers to event dispatch:

- **Split mutation logic into per-store handlers**, one handler function per (event, target store) pair
- **Registration order matters when handlers share state**: register the WRITER first (e.g. registry mutation), then the READER (e.g. role_env push reads post-swap registry state)
- **B5.1 caller path preserved**: protected.* methods become thin emitters; otmux's `command -v hiveMind && hiveMind protected.<event> ...` still works (subprocess → emit → in-process fanout)
- **Migration policy** for existing direct calls: KEEP them during transition. Handlers are idempotent siblings. Direct-call removal awaits SC-C.tests confirmation.

Naming convention: `private.hiveMind.handler.<event>.<target>`. Examples:
- `private.hiveMind.handler.agent.spawned.registry`
- `private.hiveMind.handler.panes.swapped.role_env` (underscore — dots collide with method-name hierarchy)

## NEW: ps-based per-window health for tronMonitor verify (2026-05-12 LATE, P0)

Original `tronMonitor verify` matched `${sess:0:10}` (10-char prefix) against captured pane content. tmux truncates session names in its status bar to 9 chars + window index → prefix match fails → reports "bare shell" false-positive even when 20 windows are correctly attached.

**Better approach: ps-based per-window check.** Each window runs `bash -c "TMUX= tmux attach -r -t <team>; exec bash"`. The tmux child is `tmux attach -r -t <team>`. A simple `ps -eo args | grep -qE "tmux attach -r -t ${sess}\$"` confirms the attach is alive per-window. Non-invasive (no screen switching), accurate, scales.

For "currently displayed" identification, progressive prefix matching handles truncation:
```bash
for len in ${#sess} 10 9 8; do
  [ "$len" -gt "${#sess}" ] && continue
  local prefix="${sess:0:$len}"
  [ "${#prefix}" -lt 4 ] && continue
  echo "$content" | grep -qF "$prefix" && found=yes && break
done
```

**Verify methods should return 0** — informational, not pass/fail. `return 1` propagates EPERM through the OOSH debug trap and looks like a script bug ("EPERM line 686") when it's just a "couldn't identify content" signal.

## NEW: Stability gate must filter ps by ETIME (2026-05-12 LATE, SC-D.2)

When implementing a "skip if mutation in flight" gate using `ps -eo args | grep -E '<patterns>'`, a NAIVE match catches FALSE POSITIVES because:

- `bash claudeCode fork <uuid>` processes are AGENT WRAPPERS — they persist for the lifetime of every running Claude agent (forever, basically)
- `hiveMind agent.bootstrap` likewise — the parent shell sticks around

**Without recency filter, the gate would defer reconcile forever** since 20+ "fork" processes match the regex permanently.

**Fix: filter by elapsed time.** Mutations finish in seconds; agent-wrapper parents last days. Inline awk `et2s()` parsing of BSD's `[DD-][HH:]MM:SS` format:

```awk
function et2s(e,   a) {
  if (split(e, a, "-") == 2) return 86400 * a[1] + 3600*substr(a[2],1,2) + 60*substr(a[2],4,2) + substr(a[2],7,2)
  if (split(e, a, ":") == 3) return 3600*a[1] + 60*a[2] + a[3]
  if (split(e, a, ":") == 2) return 60*a[1] + a[2]
  return e+0
}
```

GNU `ps -eo etimes` is unsupported on BSD/macOS — must parse the human format.

**Gate patterns must distinguish wrappers from operations.** Don't include `claudeCode fork|join|new` (those are wrappers). Do include `claudeCode teams.save|teams.restore|session.probe` (short-lived state ops), `hiveMind agent.(bootstrap|respawn|restart|spawn|rename)`, `tronMonitor (setup|reset|add|sync|remove|prune)`, and `hiveMind consistency.(fix|reconcile|audit)` (anti-recursion).

## NEW: reset → delegate to setup, don't reimplement (2026-05-12 LATE, P0)

`tronMonitor.reset` had its own `screen -S name` (bare-zsh window-0 bug from before d1.3 fix). `tronMonitor.setup` had the correct cold-start recipe (first-team-as-window-0).

When two methods share a recipe, ONE owns it. The other delegates. Reset = "destructive setup" — kill+truncate, then call setup. Setup already handles idempotency, validation, sync, the d1.3 fix.

```bash
tronMonitor.reset() {
  private.tronMonitor.screen.isAlive && screen -S "$(private.tronMonitor.fullScreenName)" -X quit
  : > "$TRON_MONITOR_ENV"   # clear so setup runs full cold-start, not idempotent no-op
  tronMonitor.setup
}
```

Whenever I'm reimplementing a recipe that lives elsewhere, that's an audit moment: refactor the call to delegate, not duplicate.

## NEW: Sprint 1 State Correctness — events + reconcile hybrid (2026-05-12)

**Architecture: Option C primary + Option B safety net** (joint design with architect)
- Primary: in-process event dispatch (function-table, not subprocess) for hiveMind-internal handlers
- Cross-script observers (otmux→hiveMind, tronMonitor→hiveMind) keep B5.1 subprocess pattern
- Safety net: `consistency.reconcile` runs in SM cycle, calls same `reconcile.diff` primitive as `audit`/`fix`
- Why both: events are fast on the hot path; reconcile catches anything events missed

**Event dispatch table is per-process by design**
- `declare -gA HIVEMIND_EVENT_HANDLERS` is in-process state — does NOT persist across `hiveMind ...` subprocess invocations
- Correct: registration happens at hiveMind's load time, every fresh subprocess re-registers
- Testing requires single-subshell harness OR registering inside a method that emits in same process
- Don't try to make it persist via env file — that defeats the in-process fast path

**The `protected.*` pattern for testable internals**
- When `private.<name>` is needed for CLI invocation but architecture.md says private is hidden from CLI, add `hiveMind.protected.<name>` thin wrapper
- protected = CLI callable, hidden from Tab completion
- Same pattern used for cross-script observers (e.g. `protected.panes.swapped`)
- Document as "CLI wrapper for tests/diagnostics" in commit message

**Severity-graded mutation output format**
- `<severity>|<invariant>|<store>|<op>|<key>|<expected>|<actual>` — 7 pipe-separated fields
- Severity FIRST for easy `| grep CRITICAL`
- Invariant id second for traceability
- Sorted output: CRITICAL → HIGH → MEDIUM → LOW (stable, per-invariant ordering within tier)

**PO-locked operational constraints (Sprint 1 lift these as code constants)**
- U1: log+continue on handler failure — never abort the mutation
- U2: graded audit — show all violations, never exit early
- U3: dry-run default for reconcile, `--apply` flag required

## NEW: Pane address normalization for cross-script observers (2026-05-12, B5.2 SWAP-1)

Observer callers may pass pane addresses in two formats:
- Full target: `teamX:0.0` (otmux's canonical)
- PUML-spec addr-only: `0.0` (when session is implicit/context-derived)

The receiver MUST normalize:
```bash
[[ "$a" != *:* ]] && [ -n "$session" ] && a="${session}:${a}"
```

Without this, `grep "^${a}|"` against the registry fails silently for addr-only callers. T-B5-SWAP-1 was failing exactly because the test called `panes.swapped <sess> 0.0 0.1` and the handler tried to grep `^0.0|` instead of `^sess:0.0|`.

## NEW: TTL=0 must short-circuit, not rely on `-le` semantics (2026-05-12, B5.2 TTL-3)

`HIVEMIND_REGISTRY_TTL=0` should mean "always expired / live-only mode".
With `[ "$age" -le "${TTL:-30}" ]` and both age=0 + TTL=0: `0 -le 0` is TRUE → entry recent. Wrong.

Fix preserves boundary semantics for non-zero TTLs while special-casing 0:
```bash
local ttl="${HIVEMIND_REGISTRY_TTL:-30}"
[ "$ttl" -eq 0 ] && return 1
[ "$age" -le "$ttl" ]
```

Strict `-lt` would also work but slightly changes inclusive-boundary behavior. Explicit short-circuit is safer.

## NEW: Verify-before-claim generalized (2026-05-12, D1 follow-up)

**Pattern P2 (canonical):** Methods producing observable side effects (title bars, displayed state, registry entries) must VERIFY the effect before reporting success. Otherwise the cache becomes a lie.

`tronMonitor.switch` was: select (fire-and-forget) → title update (unconditional) → claim success. Fix: select → settle → capture+grep team signature → title only if verified → on failure flip title to "⚠ MISMATCH" + rc=1.

**Generalize to:** any method that updates a UI/cache after triggering a state change. The cache update must follow successful observation, not precede it.

## NEW: teams.env "Did/you/mean" garbage = unquoted-var word-split (2026-05-12)

Root cause: `for sess in $uniqueSessions` (unquoted) word-splits on snapshot file containing `Did you mean: foo` line, registers each word as separate team.

Fix two-fold:
1. **Read-side** — use array iteration:
   ```bash
   local arr=()
   while IFS= read -r line; do arr+=("$line"); done < <(cmd)
   for x in "${arr[@]}"; do ...; done
   ```
2. **Ingress (team.register)** — triple defense P3 (regex + pipe-reject + live-tmux existence)

**Critical insight:** regex alone insufficient. `Did` is a valid identifier. ONLY the live-tmux existence check rejects it. Defense-in-depth → each layer catches a different attack class:
- (a) regex: format errors (`mean:`, `foo bar`, `-baz`)
- (b) pipe: storage corruption (`a|b|c`)
- (c) existence: fictional sessions (`Did`, `ghostTeam`, valid-but-not-real)

## NEW: For-loop array vs unquoted iteration (P7 reaffirmed)

```bash
# WRONG — splits on IFS, globs
for x in $(command); do ...
for x in $varHoldingMultilineData; do ...

# RIGHT — array
mapfile -t array < <(command)
for x in "${array[@]}"; do ...

# RIGHT — while-read (no array)
while IFS= read -r x; do ...; done < <(command)
```

## NEW: Defense-in-depth for cross-script observers (D2.1 tronMonitor hijack)

When script A fires an observer in script B (e.g. `hiveMind.team.register` →
`tronMonitor add` via D2.1), the **receiver** is the right place to filter, not
the sender. The PO-reported tronMonitor hijack happened because:

1. test.hiveMind created `__test_hm_$$` session
2. test called `hiveMind.team.register $TEST_SESSION` (legitimate)
3. team.register fired `tronMonitor add $TEST_SESSION` via D2.1 observer
4. Test ended; `tmux kill-session` removed the tmux session
5. **tronMonitor.env still had the entry**, the screen window dangled, eventually
   tronMonitor reset re-attached → hijack

**Right fix:** `tronMonitor.add` itself rejects `__test_*` names. Mirrors the
D1.7 prune guard at line ~355.

**Wrong fix:** Make test cleanup more thorough. (Still added it as belt-and-braces,
but it's the slow path. The receiver guard is the cheap, atomic, always-correct
guard.)

**Generalization:** observers fire from many code paths (legitimate + test +
imported scripts). Guard at the receiver, not at every sender. Same pattern
applies to:
- `protected.session.renamed` — reject names matching test prefixes
- `protected.panes.swapped` — TBD (B5.2 currently failing, need to look)
- Any future `protected.<X>.<event>` handler

## NEW: Raw-tmux usage = audit moment, not shortcut (B7.4 audit)

Whenever I reach for `tmux <subcommand>` in an operation, that's a signal to
stop and ask: "is this a misuse of an existing otmux method, or a genuine gap?"
Two categories of failure:

**Misuse (existing otmux method available, I forgot):**
- `tmux swap-pane -s A -t B` → `otmux pane.swap A B`
- `tmux set-window-option <opt> <val>` → `otmux config.set.window <opt> <val>`
- `tmux show-window-options` → `otmux config.show.window`

**Genuine gap (no otmux method — must add):**
- `tmux display-message -p '#{window_layout}'` → added `otmux.window.layout.get`
- `tmux select-layout <spec>` raw → added `otmux.window.layout.set` (B2.layout.restore is file-based)
- `tmux list-panes -F <custom-format>` → added `otmux.pane.list.format`
- `tmux list-windows -F <custom-format>` → added `otmux.window.list.format`
- `tmux set-window-option aggressive-resize on` (frequent enough to deserve verb) → added `otmux.window.aggressive.resize`

**Rule:** when shipping work that used raw tmux, the commit MUST either (a) cite
the existing otmux method I should have used (and reproach myself), or (b) add
the missing wrapper as part of the same shipment. Raw tmux escaping into commit
diff is an OOSH first-principles violation (see learnings.md older entry "No
raw tmux"). Catching it at audit time, after PO calls it out, is the slow path —
catch at write time.

## NEW: c2 substring match bug — qualify method names with class (B7.3)

**Symptom:** `otmux tree <TAB>` returned no completions (`;` fallback). `otmux attach <TAB>` worked.

**Root cause:** `c2.get.function.declaration` did `grep "$1("` where `$1` was the bare
method name. For `tree`, the grep matched both `otmux.tree(` AND `otmux.client.choose.tree(`.
After `c2.get.functions | sort`, `client.choose.tree` came first alphabetically, so
`line.select 1` picked it. That function has no parameters → METHOD_PARAMETER stayed
empty → no `PARAM_OPTIONAL_session` declared → `private.call.custom.completion` had
no parameter to look up → fell through to `;`.

**Fix:** in c2.get.function.declaration, qualify both the filter passed to
get.functions and the grep with `${name}.$1`:
```bash
private.c2.get.functions "$from" "${name}.$1" \
  | grep "${name}\.$1(" \
  | line.select 1 \
  ...
```

**Generalization:** any time you grep for a method by name, anchor with the class
prefix. Bare method names hit suffix-substring collisions (`kill` matches
`session.kill`, `tree` matches `client.choose.tree`). The class is the namespace —
without it, grep is asking "any function whose name contains tree".

**Cross-branch port:** the same bug existed on dev's `private.c2.*` namespace.
Cherry-pick would have conflicted (dev's c2 is 5KB larger — independent
implementation). Surgical port: read dev's variant, apply the same logical fix
in dev's naming, separate commit.

## NEW: tronMonitor window 0 must be a team, not a bare shell (d1.3)

**Symptom:** `tronMonitor setup` reports SUCCESS but the monitor pane shows a bare
`donges@MacStudio ~ %` zsh. Tron sees nothing.

**Root cause:** the prior setup sent `screen -S tronMon` to the pane. Screen starts
with the user's default shell as window 0 (a bare zsh). The subsequent
`screen -X screen -t team cmd` calls created TEAM windows (1, 2, ...), but screen
kept displaying window 0.

**Fix:** start screen with the first team as window 0 directly:
```bash
otmux send.raw "$pane" \
  "screen -S tronMon -t firstTeam bash -c \"TMUX= tmux attach -r -t firstTeam; exec bash\"" Enter
```

`screen -t name cmd` makes window 0 named + running cmd. Add the rest as windows
1..N. Final `screen -X select 0` ensures predictable starting view.

**Switch by number, not name.** Old macOS screen's `select <name>` is unreliable;
`select <N>` always works. Track `N|teamSession` in env (cold-start truncates to
keep numbering aligned with screen's sequential assignment).

**Recipe invariants (Tron-tested):**
- `TMUX=` prefix — clears env so nested `tmux attach` works inside screen
- `-r` flag — read-only attach, never destroys agent layouts
- `exec bash` tail — keeps the screen window alive after user detaches

## NEW: --flag args break c2 completion (Epic J J-BUG)

`claudeCode.list <?--json>` produced `PARAM_OPTIONAL_--json` which c2 then tried to
`declare -- "PARAM_OPTIONAL_--json=..."` → bash error `not a valid identifier`. The
hyphen in the variable name kills `declare`.

**Rule (T-ARCH-5 reaffirmed):** parameter names must be valid bash identifiers —
no leading dashes, no embedded dashes, camelCase only. Use positional values:
`<?format:tree|json>` not `<?--json>`. Backward-compat for legacy `--json` is
trivial: `[ "$format" = "--json" ] && format="json"` after parameter receipt.

The `c2` parser converts `<?paramName>` to `PARAM_OPTIONAL_paramName` and
`<paramName>` to `PARAM_paramName` for default-value injection — the parameter
identifier becomes a shell variable. Any character bash doesn't accept in a
variable name (including `-`) breaks the whole completion chain.

## NEW: Self-contained python for cross-source data (Epic J1)

When a Controller method needs to compose data from multiple sources (e.g.
`hiveMind.roles.list.uuids` needs ps + tmux + JSONL files), inline python is
cleaner than parsing the textual output of upstream methods. Trade-off vs DRY:
- Pro: single subprocess, no fragile regex on printf-aligned output, faster
- Con: duplicates the data-source logic (ps args UUID extraction, JSONL tail-scan
  for customTitle)

**Rule of thumb:** when the upstream method's output format would need parsing,
implement the data gathering directly. Comment with "mirrors `<method>` data
source" so future readers know where to look. Never rely on screen-scraping
internal output.

## NEW: Stale tmux client → layout crush; `refresh-client -S` is the key (B6)

**Symptom:** `tronMonitor`'s `screen -X screen ... TMUX= tmux attach -r` chain leaves
read-only clients attached at the screen-window's tiny size (e.g. 54x26). They linger
for hours/days even after the screen window is killed. Attached panes get crushed to
match.

**Why `ignore-size` flag isn't enough:** even with `client_flags` containing
`ignore-size`, the tmux server still considers the small client when computing window
geometry under some conditions. The flag prevents the client from FORCING resize, but
doesn't fully exclude it from layout calculations.

**The fix that actually works — `tmux refresh-client -S`:**
- `refresh-client -S` (sync) forces all remaining clients to re-evaluate window sizes
- Without `-S`, the server keeps the smallest-client geometry even after the small
  client is gone
- Always call it AFTER bulk-detach: `tmux detach-client -t X; tmux refresh-client -S`

**Diagnostic format string:**
```bash
tmux list-clients -F '#{client_tty}|#{client_session}|#{client_width}x#{client_height}|#{client_flags}|#{client_activity}'
```
- `client_activity` is epoch seconds — compute idle as `(now - activity)`
- A multi-hour idle on a 54x26 read-only client is a strong stale signal

**Detach reliability:**
- Always pass `-t <client>` explicitly when targeting (omitting it detaches the
  CALLING client, which is rarely what you want from a script)
- After ANY detach, call `refresh-client -S` to restore widths

## NEW: Background-process hygiene — NEVER use `run_in_background` with unbounded waits

**The bug:** I left two orphan zsh `until-sleep-loop` processes running for **5+ days
of wall time** because I used `run_in_background: true` to wait for tmux pane output
files via:

```bash
until [ -s "$task_output" ]; do sleep 5; done && tail -8 "$task_output"
```

The wait conditions were overtaken by direct Bash tool calls. The loops never exited
because nothing ever tripped the `[ -s ]` check (files were already consumed). Tron had
to kill them manually.

**Prevention rules — never violate:**

1. **NEVER `run_in_background: true` for an unbounded `until` poll.** If the wait
   condition might never become true, the process leaks forever.

2. **For "wait for output" cases, use bounded polling INSIDE the foreground Bash call:**
   ```bash
   for i in 1 2 3 4 5; do                # max 5 * 2 = 10s
     sleep 2
     [ -s "$file" ] && break
   done
   tail -8 "$file"
   ```
   The whole thing is one foreground call; if the file never appears, the loop ends
   and we move on. No orphan.

3. **For multi-pane wait, prefer `sleep N + capture` over `until-loop`:**
   ```bash
   sleep 4                                # fixed budget
   otmux pane.capture pane:0.A 20
   otmux pane.capture pane:0.B 20
   ```
   Simpler, predictable, and self-terminating.

4. **`run_in_background: true` is for genuinely-fire-and-forget work** (long-running
   builds, daemon starts) where the harness explicitly notifies me on completion. NOT
   for "wait until X happens" loops.

5. **Periodically audit:** if I'm using background tasks, run
   `ps -eo pid,etime,args | grep claude-501` to catch orphans before the user does.

6. **Audit-on-rewind:** When re-reading agent files post-rewind, also list background
   processes — they survive rewinds and accumulate.

The notifications I receive about background-task `failed` exit codes (e.g. 144 =
SIGTERM, 1 = generic failure) are signals that the wait condition was wrong from
the start. Treat them as bugs in the wait pattern, not as benign noise.

## NEW: Bug #4 — capture rc separately + validate format (defence-in-depth for send)

**The bug:** `target=$(hiveMind.resolve "$name" 2>/dev/null); [ -z "$target" ] && return 1`
silently failed because `error.log` writes to **stdout** (not stderr — see "error.log
writes to stdout" gotcha below). On resolve failure, `$target` contained the error
text (non-empty), guard passed, malformed string went to `tmux send-keys -t "..."`
which silently fell back to the focused pane, leaking text into wherever Tron was
looking.

**Fix pattern — two layers:**
1. **Caller side** (`hiveMind.send` / `hiveMind.send.message`): capture rc separately
   AND regex-validate the captured value. Use `local var; var=$(...); local rc=$?`
   (NOT `local var=$(...)` which always returns 0 for the local).
   ```bash
   local target resolveRc
   target=$(hiveMind.resolve "$name" 2>/dev/null)
   resolveRc=$?
   if [ $resolveRc -ne 0 ] || [ -z "$target" ]; then return 1; fi
   if ! [[ "$target" =~ ^[A-Za-z_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+$ ]]; then
     error.log "malformed target: '$target'"; return 1
   fi
   ```
2. **View side** (all `otmux.send*`): new `private.otmux.target.isPane <target>` —
   accepts `^%[0-9]+$` (pane id) OR `^[A-Za-z_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+$`
   (sess:win.pane). Rejects whitespace/newlines (typical of captured error.log).
   Applied to: `send`, `send.raw`, `send.key`, `send.verified`, `send.enter`, `send.tui`.

**Lesson:** When a function captures another function's output AND uses error.log,
empty-check is insufficient. Always use `rc` + format validation.

## NEW: View I/O migration to Controller (A1.2 Fix #2b model)

When extracting View-layer I/O from a Model method:

1. **Add Controller method** (e.g. `hiveMind.agent.session.probe`) that:
   - Accepts `<agentName|pane>` — pane format detection via regex, else resolve
   - Does the I/O (otmux send/capture/send)
   - Delegates parse to Model's pure parser via CLI invocation:
     `claudeCode session.probe.fromCapture "$capture"`
2. **Migrate callers** — internal hiveMind callers use direct function call form
   `hiveMind.agent.session.probe`; cross-script callers use `hiveMind agent.session.probe`
3. **Delete Model composite** — replace with comment block pointing to migration
4. **Keep Model parser** — pure parser stays (no I/O, takes text or stdin)

When the Model has its own internal callers (e.g. `private.claudeCode.resolve.byPane`
called `claudeCode.session.probe`), and removing the Model composite would break it,
the simplest fix is to delegate the internal call to the Controller (`hiveMind agent.session.probe`).
This creates a temporary Model→Controller call that's documented and goes away when
the calling helper itself moves to Controller (already flagged in A1.2 plan).

## NEW: Output filtering rule (PO directive — never violate)

**NEVER use `2>&1`, `| head`, `| tail`, `| grep`, or `2>/dev/null` on output you
show to the user.** Show raw unfiltered. Filtering hides errors and breaks
debugging. Reminder: I violated this 3x in one session before being called out.

If the output is too long, use `Read` with `offset/limit` instead of piping
through `head`. For dedicated tools (Grep, Glob), use them directly.

## NEW: Observer callback pattern (B5.1)

**View notifies Controller after state mutations.** Soft-fail with `command -v`:

```bash
command -v hiveMind >/dev/null 2>&1 && hiveMind protected.<event> "$@" 2>/dev/null
```

Used in:
- `otmux.session.rename` → `hiveMind protected.session.renamed <old> <new>`
- `otmux.split[.h|.v]` → `hiveMind protected.panes.shifted <session>`
- `otmux.pane.swap` → `hiveMind protected.panes.swapped <session> <A> <B>`
- `otmux.pane.move`/`pane.join` → `hiveMind protected.pane.moved <from> <to>`

Naming convention: `protected.<noun>.<verb-past-tense>` (event has happened, not
imperative). Args carry context the Controller needs to update its state.

## NEW: Allowlist > Denylist for action-taking code

**Bug #2 lesson:** `agent.unblock` had `case "$status" in active|idle|unknown) skip ;; esac`
followed by a `*)` fallback that read `$action`. ANY new sweep.detect status flowed
through the fallback and could trigger key sends to active agents.

**Fix:** Strict allowlist. Only `permission|tool-confirm|accept-edits|queued` trigger
sends. Everything else (including new states from future sweep.detect changes) is
silent skip via `debug.log + return 0`.

Rule: when the action is destructive/disruptive (sending keys to a running agent),
use an explicit allowlist of safe states. Anything not allowlisted is a no-op.
Better to leave a stuck overlay than interrupt an active agent.

## NEW: TTL-priority pattern for shared state

**Problem (B5.1):** `hiveMind.registry.set` writes file. Live discovery overwrites
the file entry on next refresh. Manual sets are silently lost.

**Solution:** Write a timestamp with the entry: `pane|role|epoch-timestamp` (3
fields, backward-compat with legacy 2-field reads). Readers check timestamp:
- Fresh (within TTL) → file wins, live discovery skipped
- Stale → live wins, file is fallback

Constant: `HIVEMIND_REGISTRY_TTL=30` (seconds, env-overridable).
Helper: `private.hiveMind.registry.isRecent <pane>` returns 0 if fresh.

Use this whenever a writer's intent must survive automatic reconciliation.

## NEW: Shell env propagation after pane mutation

**Bug #3 lesson:** After tmux swap-pane, the agent moves with the pane content
but the shell's HIVEMIND_ROLE env was set at launch time. The sender prefix
in `otmux send.prefix` reads env first → can render wrong role.

**Fix:** Push `export HIVEMIND_ROLE=<newrole>` to the new pane location's shell
AFTER the registry update. Helper: `private.hiveMind.pane.pushRoleEnv <pane> <role>`.

**CRITICAL caveat:** Only push to **plain shells**, never Claude TUI panes —
sending text to a TUI pane injects it into the agent's input prompt (harmful).
Detect via `pane_current_command` ∈ {bash, zsh, sh, fish}, AND verify no Claude
child process running (`claudeCode process.running`).

When env update isn't safe (Claude running), the registry is the truth source —
`otmux send.prefix` falls back to file lookup if env doesn't match.

## NEW: Use raw `tmux` (not `otmux`) inside Controller helpers

When a Controller helper does internal state lookups (e.g. `pane_current_command`),
calling `otmux pane.get` re-enters the OOSH dispatch chain and at higher LOG_LEVEL
pollutes captured stdout with `info.log` chatter. The result: `case "$cmd" in bash)`
fails because `$cmd` contains log lines, not just `bash`.

**Solution:** Use raw `tmux display-message -p` directly inside Controller helpers.
This is NOT a B1.3 boundary violation because the Controller is calling tmux for
its OWN state lookup, not from a View context. (Document this in the helper header
to forestall future cleanup attempts.)

Example: `private.hiveMind.pane.pushRoleEnv` reads `pane_current_command` via
`tmux display-message -p -t "$pane" '#{pane_current_command}'` — clean output
regardless of LOG_LEVEL.

## NEW: Cherry-pick won't work between branches with parallel implementations

**Cross-branch consolidation lesson:** prod had `fa75c22` with B4. test/macos.latest
already had `44ad07e` (B4.1) and `e0ddb95` (B4.2 partial) by other commits. Direct
`git cherry-pick fa75c22` produced massive structural conflicts because both
branches independently implemented the same feature in different code styles.

**Approach:** Abort the cherry-pick. Inspect what's already on the target branch
via `grep` for the feature markers. Surgically port only the genuinely-missing
deltas. Two smaller commits beats one big conflict resolution.

For Sprint 0: `9b7138e` ported B1.3 fixes, `7d27904` ported B4.2 polish — both
small, both clean.

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
