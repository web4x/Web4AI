# OOSH Expert Learnings

## NEW: config.add = source line, not dead marker (2026-06-27, b6300b2)

I changed `config.add` to write `export CONFIG_CHAIN_<NAME>=1` instead of `source $CONFIG_PATH/<name>.env`. This killed dynamic config composition — Rule A says env files carry `source *.env` as the sole permitted construct. The marker was a dead export nobody reads. Fix: restore `echo "source \$CONFIG_PATH/$file.env"`. Also: `config.save` no-args had HARDCODED `source oosh.env`/`source log.env` — must harvest source lines from file dynamically instead. **Rule**: when you replace a mechanism (source chain), verify the replacement (marker) is actually consumed. Dead markers are worse than the original — they look intentional but do nothing.

## NEW: c2 completion ';' = debug.log RC leak (2026-06-27, d83907b)

`private.call.custom.completion` returned `$?` after `debug.log` (RC=1 at default LOG_LEVEL) instead of 0 for "function found and executed". Caller checked `if private.call.custom.completion; then return 0; fi` — RC=1 meant fallthrough to `;` fallback. Fix: explicit `return 0` after writing completion.result.txt. **Rule**: when a function's contract is "return 0 if I handled this", never let a log/debug call's RC leak into the return.

## NEW: c2 first-param completion needs signature grep, not declaration parse (2026-06-27, d83907b)

When `c2.get.function.declaration` produces empty METHOD_PARAMETER (FORMAT_PARSE_METHOD not exported), the parameter-based completion path never fires. Fix: extract first param name directly from the function signature comment via `grep "${class}\.${method}()" "$script" | sed 's/.*# *<?*\([a-zA-Z_]...\).*/\1/p'`. This bypasses the full declaration pipeline. Works for `<?session>`, `<host>`, `<?format:json>` etc. The `declare -F | sed` approach gives alphabetical order (wrong) — signature grep gives declaration order (right).

## NEW: Constructor contract = init ALWAYS yields valid object (2026-06-27, sprint-constructor-contract)

The OOSH first principle: every constructor (`this.init`, `config.init`, `config.save`) must ALWAYS produce a valid, operational object. No RC=1 on broken env — self-heal instead. Three-phase architecture: (1) HARVEST valid state from file + live env, (2) RESOLVE fundamentals from BASH_SOURCE (never `$HOME/oosh` guess), (3) MERGE fundamentals first (override stale) + user vars preserved + source chain (Rule A) + validate. `config.repair` is just `config.save` — repair IS init, no separate path.

## NEW: Harvest must read FILE + live env (2026-06-27, 4c1ea97)

`config.save` harvest phase originally read only the FILE. But newly `export`-ed vars (e.g. `TRON_MONITOR_PANE` set in this session) exist only in live `declare -px`, not in the file yet. Fix: harvest from file first (preserves born-broken state), then merge live-exported vars not already in harvest (via tmpfile to avoid subshell variable loss). File exports win on collision (user may have edited values).

## NEW: log.device RC=127 kills constructors (2026-06-27, 4c1ea97)

`config.save` no-args path calls `log.device $LOG_DEVICE` as a HACK for SSH remote logging. On empty/missing user.env, `log` hasn't been sourced → `log.device` = command not found = RC=127. Fix: `this.functionExists log.device && log.device $LOG_DEVICE`. Guard ANY function call in the constructor path that might not exist yet.

## NEW: BASH_SOURCE chain walker for OOSH_DIR (2026-06-26, 921f0c3)

`$HOME/oosh` is a GUESS that fails on EAMD layouts where oosh lives at `/home/shared/EAMD.ucp/.../Once.sh/dev`. Fix: walk BASH_SOURCE array backwards looking for a directory containing both `this` and `config` files — that's the oosh dir. Symlink-safe via `cd -P`. Fallback: `which this` on PATH. Never guess `$HOME/oosh`.

## NEW: selfheal = detect + config.save, both init paths (2026-06-27, ab1306e)

`this.init` has TWO paths: early-return (CONFIG already set) and main (fresh init). Self-heal must run on BOTH — extract to `private.this.selfheal` helper. Detection: line-by-line scan matching config.validate's accept rules. Any non-matching line = pollution → trigger `config.save` (harvest-resolve-merge). Guard: `this.functionExists config.save` — if config isn't sourced yet, skip silently (resolve.fundamentals already set OOSH_DIR).

## NEW: c2 empty pipeline → ''' crash (2026-06-27, f13f35d)

`line.add "'"` appends `echo -e "'$1'"` to stdin. With `$1="'"` and empty stdin, output is `'''` (three quotes). When `c2.get.function.declaration` grep finds no match, the pipeline is empty → `line.add` writes `'''` → `source current.method.env` → bash syntax error → completion crashes. TWO fixes: (1) capture pipeline to variable, empty → write only SCRIPT+CLASS. (2) `bash -n` validates file before sourcing. Also replaced `line.split | line.unquote | line.add "'"` with `sed 's/|/\n/g'` — same output, no quote corruption risk.

## NEW: otmux.attach self-healing constructor (2026-06-27, cc4da85)

Attach to nonexistent session → create it detached first (`new-session -d -s <name> -x 200 -y 50`), then attach. No tmux server → create `default` session. Constructor always succeeds. Also: `private.complete.sessions` filters `__test_` prefixed sessions from tab completion.

## NEW: Claude Code projectHash replaces 3 chars, not 1 (2026-06-25, 07c6b1e)

`private.claudeCode.projectHash` must `sed 's/[\/._]/-/g'` — Claude Code replaces `/`, `.`, AND `_` with `-`. My first impl only replaced `/`. Paths with dots (`EAMD.ucp`, `Once.sh`) or underscores (`1_infrastructure`) produced wrong hashes → JSONLs placed in nonexistent dirs. Verified empirically: `ls ~/.claude/projects/` on WODA.prod showed the 3-char replacement. The decode is lossy (can't distinguish which `-` was originally `/`, `.`, or `_`) — acceptable, decode is display-only.

## NEW: Cherry-pick works for hiveMind when base is clean (2026-06-25)

Prior learnings said "cherry-picks conflict in hiveMind" — that was true when dev had DIVERGED implementations. After PO reset dev to macos.latest MVC (0e5f7dd), all 5 cherry-picks from dev-teampush-astray landed clean. **Rule**: cherry-pick works when target file = source file's parent. Conflicts come from parallel independent edits, not from the cherry-pick mechanism itself.

## NEW: captureForkedUUID — Strategy B (diff) beats Strategy A (customTitle) (2026-06-25, 07c6b1e)

Fork creates a NEW UUID. To capture it: snapshot `ls *.jsonl` BEFORE fork, diff with AFTER. The new file IS the forked UUID. Strategy A (scan by customTitle) is slower and unreliable if fork hasn't auto-renamed yet. Strategy B is pure filesystem diff — no Claude API needed. Write UUID to sessions.env IMMEDIATELY after capture (GAP #12 fix). On remote: inline the sessions.env write via `ossh exec` with grep-v + append (private methods aren't CLI-callable).

## NEW: WODA.prod LOG_DEVICE = /dev/tty fails (2026-06-25)

Container has no `/dev/tty`. OOSH log functions default to LOG_DEVICE=/dev/tty → silent failures with exit code 1. Prefix commands with `LOG_DEVICE=/dev/stdout` for visible output. Or set it in the env permanently.

## NEW: env files pure state — source chain lives in `this`, not in env files (2026-06-22, d45031a)

`user.env` had `source $CONFIG_PATH/oosh.env` and `source $CONFIG_PATH/log.env` — these are CODE, not state. Fixed: (1) `this.init()` explicitly sources oosh.env+log.env after user.env (both init paths). (2) `config.add` writes `export CONFIG_CHAIN_<NAME>=1` instead of `source` line. (3) `config.validate` guards purity — line-leading pattern match rejects source/conditional/command-sub, accepts brackets in quoted values.

## NEW: c2 line.add produces triple quotes (2026-06-22, 33da219)

`line.add "'"` uses `echo -e "'$1'"` — with `$1="'"`, this produces `'''` (three quotes), not one. The function passes stdin through (`cat -`) then APPENDS the echo output as a new line. Combined with `line.unquote` stripping closing quotes from `FORMAT_PARSE_METHOD` output, the pipeline `line.split | line.unquote | line.add "'"` = strip quotes then re-add them wrong = `'''` corruption in `current.method.env`.

**Fix**: Don't use `line.split "|" | line.unquote | line.add "'"`. Replace with `sed 's/|/\n/g'` — splits on pipe without touching quotes. `FORMAT_PARSE_METHOD` already produces valid `declare --` statements with correct quoting.

**Pattern**: When a format template (`FORMAT_PARSE_METHOD`) produces correctly-quoted output, don't post-process quotes. The stripping+re-adding pipeline was a fragile no-op that failed on edge cases.

## NEW: sweep.detect must check live area BEFORE scrollback (2026-06-21, d79a4c9)

Previous fix (a986391) moved idle/active to bottom-5-lines. But scrollback-based checks (rate-limit, api-error, context-warning, just-compacted) still ran FIRST against full 20-line content. Stale scrollback from prior states matched before reaching the live area checks.

**Fix**: Check bottom 5 lines for active/idle/queued FIRST. Only fall through to scrollback-based patterns when the bottom area is ambiguous (no clear prompt or active signal). This means agents that recovered from rate-limit/error to idle are correctly classified.

## NEW: this.load dispatch — check private before fallback (2026-06-22, 12100f8)

When `$caller.$aFunction` doesn't exist, `this` dispatch falls through to a multi-level script fallback that swaps function/script names. This produces garbage errors ("No such file or directory" from trying to source a method name as a script).

**Fix**: Two guards: (1) `elif this.functionExists private.$caller.$aFunction` before the fallback catches private methods. (2) `which "$aFunction"` guard before treating the method name as a script — if it's not on PATH, it's an unknown method.

## NEW: operator state override = Layer 3 on live detection (2026-06-21, 80fdbd8)

DURING_REWIND is NOT a detection path — it's an OVERRIDE layer. `hivemind.state.env` stores `pane|STATE|timestamp|set-by`. sweep.detect checks it BEFORE pane capture. agent.route maps DURING_REWIND/MAINTENANCE/FROZEN to `rewind-hold` (exit code 3, distinct from 0=delivered, 1=error, 2=queued).

**Architecture**: override writes are exclusive to `agent.state.set`/`team.state.set`. Override reads are in sweep.detect (one check). All downstream consumers (team.status, agent.send) get the override transparently through sweep.detect's existing pipeline.

## NEW: sweep.detect TUI layout awareness (2026-06-19, a986391)

**Root cause of false-active classification:** `last_line` (last non-empty line) gets Claude Code's STATUS BAR (`⏵⏵ auto mode on`), not the `❯` prompt. Every idle agent fell through to the "active" default.

**Claude Code TUI bottom-of-pane layout:**
```
─── role@host ──        (title bar)
❯                       (prompt)
────────────────        (separator)
esc to interrupt        (ACTIVE status bar)
⏵⏵ auto mode on · …   (IDLE status bar)
```

**Fix:** Check `bottom` (last 5 lines) instead of `last_line`. `esc to int` present → ACTIVE. Bare `❯`/`>` without it → IDLE. Status bar truncates in narrow panes: `esc to int…` — use `esc to int` as pattern.

**Also removed:** 200-line scrollback history scan that caused false rate-limit/api-error detections from stale text.

## NEW: agent.route accept-edits is inform, not overlay (2026-06-19, 57cf612)

`accept-edits` banner is NOT a blocking overlay. Agent is at the `❯` prompt and can receive messages — `otmux send` auto-clears the banner. Route to `inform` alongside `idle`, not `overlay` (which rejects sends).

## NEW: T-ALIGN-8 pane-scan cap (2026-06-19, 44726ab)

Test was scanning ALL ~80 tmux panes calling `claudeCode session.id` + `process.find` per pane (~2s each = 160s+ hang). Fix: cap at 20 Claude panes, skip non-Claude panes via fast tty+ps check.

## NEW: claudeCode list age-sort (2026-06-19, 44726ab)

`ls -t` (newest-first by mtime) instead of glob order (alphabetical by UUID). Glob order was random from the user's perspective — UUIDs have no temporal meaning.

## NEW: Shell pane for execution (2026-06-19, PO directive)

Run ALL execution (test.suite, git, source, grep) in shell pane `ooshTeam:0.4` via `otmux send.enter`. Shell execution triggers NO Claude permission prompts. Reserve Claude Bash tool for code EDITS only (when needed) or quick greps.

## NEW: audit return code overflow (2026-06-19, 84898c3)

Bash `return` values 128+ are interpreted as signal numbers (128+N = killed by signal N). With 128 violations, `return 128` meant SIGHUP to OOSH's `this` dispatch. Cap at 125 (126=command-not-found, 127=command-not-executable).

## NEW: fork UUID-stale is expected, not a bug (2026-06-19, 111e0a0)

`--fork-session` means `--resume UUID` is the PARENT, not the child. sessions.env will always have the parent UUID until `registry.refresh` runs. The audit's "UUID stale" check must skip forked sessions — it's not stale data, it's the fork design.

## NEW: tronMonitor switch/prune must update roles registry (2026-06-19, ccd7ef1)

tronMonitor.switch updates pane title but previously didn't touch `hivemind.roles.env`. tronMonitor.prune drops dead sessions from `tronMonitor.env` but left `TRON-Monitor:<deadTeam>` in roles. Both now call `hiveMind registry.set` to stay consistent.

## NEW: Docker install SSH sequencing (2026-06-10/11, init/oosh 66212be+0bdd8df)

**Anti-pattern shipped to prod for years:** install script clones HTTPS first, sets up SSH after → fresh docker container can't `oo update`. HTTPS blocked at port 443 (firewall), no SSH keys provisioned. User stuck.

**Fix (architect's sequencing-reversal):**
1. Detect `~/.ssh` for private keys FIRST (find `id_*`, `*.pem`, `*.private_key`, exclude `.pub`)
2. If keys present: `ssh-keyscan github.com >> known_hosts`, seed `2cuGitHub` alias via `ossh config.create` (if ossh on PATH) or inline Host block, clone via `2cuGitHub:Cerulean-Circle-GmbH/once.sh.git`
3. Cascade fallback: 2cuGitHub: → git@github.com: → HTTPS
4. No keys → clear warning with docker mount hint (`-v ~/.ssh:/root/.ssh:ro`) + manual fix command

**Pattern: setup BEFORE use, not after.** When component A depends on component B's config, configure B first. Don't lazily fix A's failure with a hint.

**Docker keys = volume mount, never bake, never secret manager.** Architect's call. Image stays clean, no secret leaks, host SSH config inherited.

## NEW: taskChain canonical external script verification (2026-06-11)

**Pattern: external OOSH scripts emitted from TS class signatures.** robbin-skill-expert's `taskChain` is regenerated by `scripts/objectVerb.ts emitOosh` from `skill-classes.ts` JSDoc. Bash wrappers are thin dispatchers to `npx tsx` introspection. DRY enforced by construction — bash signatures CAN'T drift from TS.

**Pattern: object.verb hierarchy mandatory for ANY OOSH script.**
- `chain.generateMatrix` not `generateMatrix`
- `velocity.compute` not `velocity` (when there are multiple `velocity.*` methods)
- `wireImplNode` → `chain.wireImplNode` (object.verb)

**Pattern: per-method completion preferred over global parameter.completion.*.**
- `taskChain.chain.wireImplNode.completion.methodUuid()` — per-method
- NOT `taskChain.parameter.completion.methodUuid()` — global shared
- c2 finds both, but per-method is clearer and allows method-specific data

**Pattern: `private.<script>.<helper>()` for internal dispatch.** Hidden from c2 method discovery (private. prefix filtered). Used for shared subprocess invocation.

**Pattern: `<script>.start()` not `<script>.start_dispatcher()`.** Convention enforced by c2 + this.start. Anything else is custom and breaks user mental model.

**Symlink pattern for external scripts:** `~/oosh/external/<name>` → repo path. Auto-added to PATH by `this:797` when called as `oosh`/`init`/`log`/`this`. Bash tool subprocess needs absolute path.

## NEW: Termux cross-platform wave (2026-06-01) — systematic /tmp/ eradication

**Pattern:** `/tmp/` hardcoded in 48+ sites across 10 scripts + test files. Termux has no `/tmp/` — uses `$TMPDIR` (`/data/data/com.termux/files/usr/tmp`).

**Fix pattern:** `${TMPDIR:-/tmp}/` everywhere. For `mktemp`: `mktemp -d "${TMPDIR:-/tmp}/prefix.XXXXXX"` — MUST include closing `"` before `)`.

**Sed gotcha:** `sed 's|/tmp/|${TMPDIR:-/tmp}/|g'` inserts the replacement but breaks quoting when the original was inside `$(mktemp -d /tmp/foo.XXXXXX)` — the sed adds `"${TMPDIR:-/tmp}/` but the original closing `)` now lacks its `"`. Always verify `bash -n` after bulk sed.

**Cherry-pick workflow:** When porting fixes between test/macos.latest and dev, conflicts arise from architect's parallel dev work. Resolve with `--theirs` (prefer source branch) for test files, `--ours` for production scripts that were already fixed. Always `bash -n` every resolved file.

**config.save declare -p parsing:** The old `grep " ${name}" | sed 's/...-x.../export.../'` matched prefix in VALUES not just NAMES (e.g. `COMMANDS="save oosh OOSH"` matched). Fix: `declare -px | while read` with explicit varname extraction + `case "$varname" in ${name}*`.

**Missing function pattern (architect dev additions):** Tests on dev reference functions that were never implemented (log.install.init, log.live.panes, config.v). These are NOT test bugs — they're specs-as-tests. Implement the functions to match test expectations, not delete the tests.

## NEW: L3 token semantics — cache tokens are additive, not overlapping (2026-05-28, P0 context.read)

**I got this WRONG first.** Assumed `cache_creation_input_tokens` and `cache_read_input_tokens` were billing breakdowns OF `input_tokens` (overlapping). Changed formula to `input_tokens` alone → returned 100% remaining because `input_tokens = 1` with full caching.

**Reality:** `input_tokens`(1) + `cache_creation`(~300) + `cache_read`(~512k) = total context (~513k). They are ADDITIVE. The original formula `input + cache_create + cache_read` was correct all along.

**Real root cause of P0 bug:** `session.id` returned stale parent UUID from S2 (sessions.env) pointing to a dead JSONL (total=0 → 100% remaining). The fork's real JSONL had a different UUID.

**Fix (f89bbc8):** Added staleness guard in `context.from.jsonl` — JSONL with mtime >10min returns `"stale"`. `context.read` catches stale, re-resolves UUID via `session.current` (ps-based). Also fixed hardcoded project dirs → search all `~/.claude/projects/*/`.

**Lesson:** When a calculation seems wrong, check the INPUT DATA first (which file/UUID), not the formula. I wasted a round-trip "fixing" a correct formula.

## NEW: tree.detailed display — use pane title, not JSONL model (2026-05-31)

After the @model→@host naming migration (Option C: `role@HIVEMIND_HOST`), `tree.detailed` sub-line still showed `@opus` because it grepped the JSONL `"model"` field and appended it. The pane title already had `@MacStudio` from `pane.lock`.

**Fix (382a26b):** Sub-line now uses pane title directly. Removed 14 lines of JSONL model-grep. Single source of truth for display name = pane title (set by `pane.lock`).

**Pattern:** When the View layer (pane title) and Model layer (JSONL) disagree on display data, prefer View — it's what the operator set most recently via `/rename` + `pane.lock`.

## NEW: Starting an OOSH shell = just type `bash` (2026-04-24)

`~/.bashrc` is what turns plain bash into OOSH. It sources PATH/config, loads `_oosh_commands` completions, sets the `[oosh <hostname>]` prompt. No `source this`, no `export PATH`, no `./` prefix. Just `bash`.

Added to `docs/oosh.md` and `README.md` after I failed to start OOSH in a tmux pane (embarrassing).

## Audit findings can be wrong — verify with live test before recommending fix (2026-05-25, SC-H.2 Gap B)

**SC-H.1 finding said**: `team.remove` "leaves orphan S1/S2 entries". PO assigned Gap B to fix the handler chain. I went to add the prune logic — discovered the handlers ALREADY existed (lines 685-700) and ALREADY worked on bash 5 (verified live: synthetic test session, seed entries in roles/sessions/teams, run team.remove, all three files cleaned).

**Real gap**: the handler chain runs through `events.emit` which is gated by `BASH_VERSINFO >= 4` (per task #29). On macOS-default bash 3.2, events are silent no-op → handlers never fire → orphans remain. The grep-based audit in SC-H.1 saw `events.emit "team.destroyed"` and assumed it worked — but didn't check the bash-version gate.

**Lesson**: when an audit reports "command X doesn't update store Y", actually run the command and inspect the store. Static grep misses runtime branches (version gates, conditional handlers, `[ -n "$VAR" ]` guards). Especially when the codebase has multiple bash compatibility paths.

**Fix shipped (e843391)**: direct prune fallback in `team.remove` gated on `[ -z "$HIVEMIND_EVENTS_AVAILABLE" ]`. Idempotent: handlers prune first on bash 5; fallback is no-op there. On bash 3.2, fallback IS the prune.

**Pattern for future bash 3.2 compatibility checks**: every commit that ships an event-handler-based feature must also have a direct-call fallback gated on `[ -z "$HIVEMIND_EVENTS_AVAILABLE" ]` for the same effect. The events system is a bash-5-only optimization, not a guarantee.

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

## CMM4: task files are the single source of truth (SM directive 2026-05-26)

- Every task, bug, investigation gets ONE file at `session/tasks/<task>.md`
- Write hypothesis → findings → fix → commit → status (closure) + tester handoff INTO the file as you work
- Brief pane messages just POINT readers to the file. Never duplicate content in chat.
- When a bug report comes in, FIRST write a task file with hypothesis, THEN investigate
- When you find a bug is a duplicate of another's root cause, close it as duplicate IN the file (don't make a new commit)
- Operator/PO/architect questions go IN the task file's "Open questions" section, NOT in chat. Notify peers by pointing them to the file.

## Investigation discipline: reported symptom ≠ actual bug

Two recent cases proved this:
1. **"send to robbinTeam:1.1 arrives wrong pane"** — routing was fine across all 4 send paths × window 0 and 1. Real bug was `info.log` gating queue feedback above default LOG_LEVEL → silent routing → operator perception of "wrong pane". One-line `info.log → console.log` fix.
2. **"otmux fit returns 57x34 too small"** — fit returns the operator's writable client size correctly. Real bug was Tab COMPLETION for `otmux fit` broken — c2 pipeline choked on apostrophe in "caller's terminal" doc comment, fallback to filename completion produced fragment "pletion on" from `.bashrc.bak.without.completion`.

**Rule**: reproduce the EXACT symptom before fixing. If reproduction shows the reported cause is wrong, don't fix the reported cause — find the real one. Write the misdirection into the task file's findings so future readers don't repeat it.

## c2 completion pipeline — apostrophe trap

`line.format FORMAT_PARSE_METHOD` uses `cat - | xargs printf` — xargs parses shell-like quotes. ANY `'` in input (e.g. method doc comment "caller's terminal") pops the quote state and produces malformed bash in `$CONFIG_PATH/current.method.env`. Sourcing fails with `unexpected EOF`, c2 returns no candidates, bash falls back to filename completion.

**Fix**: strip apostrophes from signature line BEFORE `line.format` — insert `| sed "s/'//g"` in `c2.get.function.declaration`. Apostrophes in doc comments are display-only; stripping is safe.

**Impact**: 9 methods had this break: `hiveMind.join`, `hiveMind.team.migrate`, `hiveMind.agent.unblock`, `private.hiveMind.pane.model`, `otmux.fit`, `otmux.attach`, `otmux.pane.size`, `otmux.status`, `state.add`. All fixed by 1-line `4338d2c`.

**Detection**: `grep -hE "^[a-zA-Z_][a-zA-Z0-9._]*\(\) # .*'" *(.)`

## Operator-visible log levels: console.log vs info.log

- `console.log` gates `LOG_LEVEL > 2` — visible at default level 3
- `info.log` gates `LOG_LEVEL > 3` — INVISIBLE at default level 3

**Rule**: ANY operator-relevant routing decision MUST use `console.log` or higher. Silent success paths look like silent failure. Examples that needed fixing:
- `hiveMind.agent.send` queue/deliver paths (was `info.log`, fixed `82213a6` to `console.log`)

When unsure, ask: "will operator know what happened from default-level output?" If not, use `console.log`.

## Defer-probe pattern (sessions.env coverage race)

When a `sleep N; agent.session.probe` window misses (Claude TUI not ready yet), `private.hiveMind.session.store` never runs and S2 (sessions.env) is missing the pane→UUID mapping. Detector I10 flags it later; defer-probe is the prevention side.

**Pattern**: `private.hiveMind.session.store.deferred <pane> <role>` forks a disowned subshell, retries probe at 5s/15s/30s. Pidfile-guarded at `/tmp/hivemind.deferred.<sanitized>.pid` so concurrent call sites (event handler + bash-3.2 fallback) don't double-schedule. Each iteration checks `session.lookup` first — exits early if S2 was populated by another path.

**Bash 3.2 fallback at sync sites**: gate on `[ -z "$HIVEMIND_EVENTS_AVAILABLE" ]` since events.emit is no-op on bash 3.2.

## State-transition catch via scrollback (sweep.detect rate-limit)

Default `sweep.detect` only captures 20 lines. Rate-limit / subscription-limit / api-error messages disappear from that window once an agent returns to IDLE. The IDLE branch was the only path missing a state-transition catch.

**Pattern**: at the END of the idle classification (after `last_line` confirms clean `❯`), do ONE 200-line `pane.capture` and re-scan for the distinctive block markers ONLY. Conservative patterns — drop generic strings like "try again" that false-positive in tool output. If found, re-classify with `scrolled-history` detail tag so operators see this came from scrollback.

**Important**: only consult history on the idle path — active/queued/permission/etc. already have their own signal, history scan would false-positive there.

## Snapshot integrity (SC-F)

- `# version: 1` header on first line — `private.hiveMind.snapshot.version.check` gates all readers
- Grandfather: no-header → v1 (existing snapshots predate the gate)
- Per-row validation via `private.hiveMind.snapshot.row.valid` — 8-field schema, isSessionName/isRoleName/isUuid/isPipeSafe per field; skip-and-log invalid rows instead of writing/processing garbage
- Wired at teams.save (live + dead paths), teams.restore (main row loop), agent.restart, team.restart

## Ingress triple defense (SC-E P3) — kernel predicates pattern

Every public method accepting a caller-supplied identifier must apply at the boundary:
1. **Format regex** via kernel predicate (`this.isPaneTarget` / `this.isSessionName` / `this.isRoleName` / `this.isUuid` / `this.isSshHost`)
2. **Pipe-safe** via `this.isPipeSafe` when identifier flows into `|`-delimited env files
3. **Existence** via `otmux has` / file grep / registry lookup as appropriate

Kernel predicates in `this`:
- `this.isPaneTarget` — `session:win.pane` or `%N`
- `this.isSessionName` — `[A-Za-z0-9_][A-Za-z0-9_.-]*`
- `this.isRoleName` — `[A-Za-z][A-Za-z0-9._-]{0,39}`
- `this.isUuid` — canonical 36-char
- `this.isPipeSafe` — no `|`, no newline
- `this.isSshHost` — `[A-Za-z0-9._-]{1,64}` (added `317e0d7`, command-injection vector defense)

## Stale read-only clients crush window-size=largest

`tronMonitor.setup` creates GNU screen windows that attach via `tmux attach -r`. When screen dies or terminal shrinks, these can survive as zombie 1×3 attachments. With `window-size=largest`, tmux sizes each session to the LARGEST attached client — but if only tiny zombies remain, "largest" IS 1×3. Recurring incident.

**Fix**: `otmux.client.cleanup.stale <?idleMin:30> <?maxSize:0> <?filter:read-only>` — surgical detach with idle + size gates. Wired at tronMonitor.setup (pre-cleanup), .reset (post-kill), .remove (targeted-session detach), .sync (60min+10x10), scrumMaster.cycle (30min+any-size — periodic safety net).

## Multi-commit waves — bundle by FILE, not by site

For SC-E.2's 17 ingress sites across 4 files, the audit doc suggested "one commit per ingress class" but PO had been accepting bundles. Compromise: one commit per FILE = 3 commits (hiveMind, otmux+tronMonitor, claudeCode). Each is reviewable atomic per script; rollback granularity matches blast radius. SM rule "one task = one commit OR one logical bundle" allows.
