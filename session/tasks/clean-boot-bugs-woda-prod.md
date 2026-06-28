# BUG: clean boot (env -i sh → bash) exposes two bugs on WODA.prod

**From**: oosh-po (Tron live finding, 2026-06-24)
**Owners**: oosh-expert (fix both) → oosh-tester (verify)
**Priority**: HIGH
**Status**: OPEN
**Found on**: WODA.prod (v60211), ooshTeam:0.5 shell, reproduced live with Tron watching

## Reproduction
```
env -i sh       # strip all env vars
bash             # start fresh bash → .bashrc runs OOSH bootstrap
```

## BUG 1: `bash: /.local/bin/env: No such file or directory`

**Location**: `/root/.bashrc:226` and `/root/.profile:11`:
```bash
. "$HOME/.local/bin/env"
```
After `env -i`, `$HOME` is empty → `"$HOME/.local/bin/env"` expands to `"/.local/bin/env"` → file not found.

This is Claude Code's env file (written by the `claude` installer). Not an OOSH file, but `.bashrc` sources it unconditionally.

**Fix (Tron directive): `this` must discover `$HOME`.** The `this` bootstrap is responsible for establishing ALL fundamental env vars — HOME included. If `$HOME` is empty (after `env -i`, in a cron, in a minimal container), `this` must resolve it BEFORE anything else runs:
```bash
# In this.init, FIRST thing — before any path that uses $HOME:
: ${HOME:=$(eval echo ~$(id -un 2>/dev/null || echo root))}
export HOME
```
Then `.bashrc:226` (`". $HOME/.local/bin/env"`) works — it doesn't need its own guard because `this` has already resolved HOME. This is the self-care principle: `this` initialises ALL required state, downstream never worries about missing fundamentals.

**Do NOT put a guard in `.bashrc`** — that's a bandaid. The fix belongs in `this` where all env discovery lives (same layer as CONFIG_PATH, OOSH_DIR resolution).

## BUG 2: user.env still contains `source` lines — config.validate code is on dev but data file not regenerated

**Observation**: `config list` on WODA.prod shows at the bottom:
```
source $CONFIG_PATH/oosh.env
source $CONFIG_PATH/log.env
```
These are the two `config.add` source lines (Source A in #4/#6 analysis). The `d45031a` fix (config.add writes pure export markers, source chain moved to `this`) IS on dev now (merged in `f74c20a`). But the EXISTING user.env hasn't been regenerated — the fix prevents WRITING new pollution but doesn't clean up the OLD file.

**Fix**: run `config save` (or `config clean` + `config init`) on WODA.prod to regenerate a pure-state user.env using the fixed config script. Then `config validate` to confirm zero violations.

**Self-care principle violation**: the fix doesn't self-heal existing installations. `this` bootstrap sources user.env, finds the source lines, and runs them (which works) — but the file remains polluted. The bootstrap should either auto-clean on detect (`config.validate` + `config clean` on boot when violations found) or print a loud warning.

**Related**: `session/tasks/env-files-pure-state-architecture.md` (#4), `session/tasks/ossh-install-polluted-userenv.md` (#6)

## BUG 3: `config save` mutates runtime state + produces side-effect output

**Observation** (Tron caught live): running `config save` on WODA.prod produces:
```
IMPORTANT> new LOG_DEVICE=/dev/tty
IMPORTANT> this.load: save config
```

Two violations:
1. **`new LOG_DEVICE=/dev/tty`** — `config save` resets LOG_DEVICE to `/dev/tty` during a SAVE operation. Save should WRITE state, not MUTATE it. LOG_DEVICE belongs in `log.env` (data) or `this` (bootstrap logic) — `config save` shouldn't decide what the log device is. On headless/cron/env-i, `/dev/tty` may not exist → log breaks.
2. **`this.load: save config`** — save triggers `this.load` which re-sources config → circular: save triggers load triggers side effects. A write-state operation should not re-bootstrap.

**Root cause**: `config save` calls `this.load` or `source $CONFIG` internally, which re-runs the bootstrap chain → side effects (LOG_DEVICE reset, IMPORTANT log lines). Save should be inert: serialize current vars to file, validate purity, done.

**Fix**: `config save` must NOT call `this.load` or `source $CONFIG`. It serializes, writes, validates — no re-bootstrap, no log device mutation, no IMPORTANT output (save is not an event worth announcing at IMPORTANT level — use `info.log` at most).

## Acceptance Criteria
- [ ] `env -i sh && bash` on WODA.prod: zero errors, clean OOSH prompt, `$HOME/.local/bin/env` either sourced (if HOME resolved) or skipped gracefully (no error)
- [ ] `config list` on WODA.prod shows NO source lines — only pure exports
- [ ] `config validate` passes on WODA.prod user.env
- [ ] Same verified on u20
- [ ] `this.init` HOME discovery committed (not a .bashrc guard — `this` owns it)
- [ ] `config save` produces NO IMPORTANT log lines, does NOT reset LOG_DEVICE, does NOT trigger `this.load`

## BUG 4: agents source scripts — FORBIDDEN (Tron directive, reinforced 2026-06-24)

**The rule**: ONLY env files (`.env`) may be sourced. Scripts (`this`, `config`, `otmux`, `hiveMind`, `claudeCode`, ANY oosh script) are INVOKED via CLI, NEVER sourced.

**Violations observed this session alone**:
- oosh-expert ran `source /root/oosh/otmux` in ooshTeam:0.5 to test pane.self → polluted the shell env (had to `env -i sh && bash` to recover)
- oosh-po relayed `source /root/oosh/otmux && ...` to robbin-architect → polluted that shell too
- `config save` internally does `source $CONFIG` which triggers `this.load` → circular source chain producing side effects (BUG 3)

**Why it's dangerous**: sourcing a script imports ALL its functions + variables + side effects into the current shell. The shell becomes an unpredictable hybrid of its own state + the sourced script's state. After sourcing otmux, the shell has 100+ otmux functions polluting the namespace. After sourcing `this`, the bootstrap chain fires and mutates env vars. There's no undo — the only recovery is a fresh shell.

**Action items**:
1. **ALL agent SKILL.md files**: add explicit rule — "NEVER source oosh scripts. Invoke via CLI: `otmux pane.self`, not `source otmux && private.otmux.pane.self`. Only `.env` files may be sourced." (Agent-trainer propagates this.)
2. **config save**: remove internal `source $CONFIG` / `this.load` calls (BUG 3 fix covers this)
3. **`.bashrc` bootstrap**: the `.bashrc` → `source this` chain is the ONE exception — it's how bash becomes an OOSH shell. But `this` must NOT re-source itself or other scripts during the boot chain; it sources ONLY env files.
4. **Tester**: add T-NO-SOURCE grep guard — `grep -rn "^source.*oosh/" test/` catches test files that source scripts instead of invoking. Same guard for SKILL.md files.

## BUG 5: `hiveMind` (no args) shows only FIRST team — stdin consumption AGAIN

**Observation** (Tron called it live): `hiveMind` on ooshTeam:0.5 shows only ooshTeam — robbinTeam2, Temple, baseTeam, ooshShells all missing. Had to Ctrl-C (hung after the first team). Most agents show `(unknown)` state.

**Root cause**: `hiveMind.status()` no-arg path (line ~1799):
```bash
while read -r sess; do
    hiveMind.team.status "$sess" 2>/dev/null
done <<< "$sessions"
```
`team.status` → `agents.discover` → process scanning internally consumes stdin → remaining sessions eaten → loop stops after first team. **Same fd 3 bug** as the JSONL download loop fixed in `2dcbfa9` — this loop was MISSED.

**Fix**: `done 3<<< "$sessions"` + `read -r sess <&3`. Or pipe-based: `echo "$sessions" | while read -r sess; do ... done` (subshell isolates stdin). Same pattern as all other snapshot/session loops.

**Also**: agents showing `(unknown)` state suggests `agents.discover` → `sweep.detect` is failing or timing out on WODA.prod. Investigate — is it a `/dev/tty` issue (LOG_DEVICE set to `/dev/tty` from BUG 3's config.save side effect)?

## BUG 6: `pane.unlock` doesn't kill ALL enforcers — multiple enforcers accumulate

**Observation** (Tron: "it's still doing it — unlock MUST kill them too"): after `otmux pane.unlock ooshTeam:0.5`, the title kept flickering. `ps aux | grep pane.lock` showed **8 enforcer processes** — two for ooshTeam:0.5 alone (one "ooshShell", one "ooshShell@WODA.prod"), plus stale ones on other panes. `pane.unlock` only kills via ONE pid file, but each `pane.lock` call spawns a NEW background process. Multiple locks on the same pane → multiple enforcers → pid file only tracks the last one → unlock leaves orphans.

**Fix**: `pane.unlock` must kill ALL enforcers for the target pane, not just the one in the pid file:
```bash
# Kill by process pattern — catches ALL enforcers regardless of pid file
pkill -f "pane.lock.*${target}" 2>/dev/null
```
And `pane.lock` must kill any existing enforcer for the same pane BEFORE spawning a new one (idempotent — relocking replaces, doesn't accumulate).

## BUG 7: ELIMINATE `$TMUX_PANE` TOTALLY — error-prone, stale after fork/swap (Tron directive)

**Directive**: `$TMUX_PANE` is set once at shell start and goes STALE after any pane swap/fork — it is the root cause of every self-identification failure (BUG that started this whole session: tools reported wrong pane). The reliable replacement `private.otmux.pane.self` (PID-walk, commit 950409e) already exists. **Purge ALL self-identification uses of `$TMUX_PANE` and drop the `|| ${TMUX_PANE}` fallbacks entirely.**

**Exact sites (grep'd on dev):**

`otmux` (14 refs):
- L1298, L1897, L2774, L2785: `selfPane=$(private.otmux.pane.self) || selfPane="${TMUX_PANE:-}"` → **drop the fallback**, just `selfPane=$(private.otmux.pane.self)` (it already walks PID reliably; the stale fallback is the danger)
- L1340-1343 `layout.dynamic`: uses `$TMUX_PANE` directly for session/window → replace with `pane.self`
- L1382-1391 `fit`: uses `$TMUX_PANE` directly for client width/height → replace with `pane.self`
- L1294, L1889-1892: comments — update to reflect TMUX_PANE is gone

`hiveMind` (4 refs):
- L2258, L2316: caller-role detection via `$TMUX_PANE` + raw `tmux display-message` → use `otmux pane.self` (also kills a raw-tmux call)
- L7461, L7726: `own_pane="$TMUX_PANE"` (self-skip in sweeps) → `own_pane=$(otmux pane.self)`

`claudeCode` (3 refs):
- L1595-1598 `context.self`: gate + read via `$TMUX_PANE` → use `otmux pane.self`

`restore/hiveMind` (3 refs): backup copy — apply same fixes for consistency (L1527, L1686-1687)

`test/test.c2` (10 refs): tests EXPLICITLY SET `TMUX_PANE="$TMUX_TEST_SESSION:0.0"` to target a controlled pane — this is legitimate (deliberate target, not inherited-stale self-ID). **Architect: review whether these should switch to passing an explicit target arg instead, but they are NOT the stale-inheritance bug.**

**Rule going forward**: no code reads `$TMUX_PANE` for self-identification. `otmux pane.self` is the ONE source of "which pane am I". Add a T-NO-TMUXPANE grep guard: `grep -rn 'TMUX_PANE' otmux hiveMind claudeCode` returns zero self-ID uses (only the pane.self internals + explicit-set test targets allowed).

**Architect**: review for dedup — `pane.self` should be the SINGLE self-ID primitive; ensure no parallel ad-hoc pane-discovery remains. Confirm essential: every place that needs "my pane" calls the one primitive.

## FEATURE 8: `CURRENT` as a first-class pane target (Tron directive, DRY)

**Directive**: add `CURRENT` as a valid, recognized, tab-completed pane target alongside U/D/L/R — e.g. `otmux pane.title CURRENT "new title"` retitles the caller's OWN pane. DRY — one resolver, works everywhere.

**Composes with BUG 7**: `CURRENT` resolves via `private.otmux.pane.self` (the one self-ID primitive). So CURRENT = "my pane" via PID-walk, immune to stale TMUX_PANE.

**The DRY chokepoint is already there**: `private.resolve.target()` resolves U/D/L/R — **19 methods route through it**. Add CURRENT in that ONE place and every pane method gets it free.

**Edit 1 — `private.resolve.target()`** add a case (before the `*)` default):
```bash
CURRENT|current|.|self)  private.otmux.pane.self ;;
```
(U/D/L/R already handled above; CURRENT joins them in the same case.)

**Edit 2 — `otmux.parameter.completion.target()` (L1799)** add CURRENT to the list:
```bash
echo "CURRENT"
echo "U"; echo "D"; echo "L"; echo "R"
private.complete.panes
```

**DRY note for architect**: the pane-target completions are scattered (`otmux.parameter.completion.target` inline U/D/L/R + `send.zoomed.completion.target` panes-only). Consider one shared `private.complete.paneTargets` helper (CURRENT + U/D/L/R + panes) that ALL pane-target completions call — so the valid-target list lives in ONE place, matching the single resolver. Architect: decide if that consolidation is in scope now or a follow-up.

**Acceptance**: `otmux pane.title CURRENT "x"` retitles caller's pane; `otmux pane.capture CURRENT` / `pane.lock CURRENT` etc. all work (free via the resolver); `CURRENT` appears in Tab completion; test T-CURRENT-TARGET. Verify it resolves correctly even with stale TMUX_PANE (uses pane.self).

## Architect Review (oosh-architect, 2026-06-28) — config-dedup + color-boot + BUG 7 + FEAT 8 DRY

### A. config.save var policy — ESSENTIAL vs CLUTTER (dedup)
Source: healthy backup `…/sharedConfig/user.env.healthy-tron-backup-20260628` (25 exports + 2 source lines).

**ESSENTIAL — config.save must ALWAYS resolve + emit:**
- Fundamentals (canonical, via `private.this.resolve.fundamentals`): `CONFIG_PATH, CONFIG_FILE, CONFIG, OOSH_DIR, OOSH_MODE, BASH_FILE, PATH`
- OOSH-owned state: `LOG_LEVEL, LOG_LEVEL_RESET, LOG_LIVE, USER` (+ `LOG_DEVICE`, caveat below)
- ⚠ `LOG_DEVICE` belongs in log.env and must NOT be hard-set to `/dev/tty` (BUG 3) — headless/cron has no `/dev/tty`.

**CLUTTER — config.save must NEVER persist:**
- Test artifacts (LEAKED from test.suite/test.config into the *shared* config): `EXPECTED_RETURN_VALUE, GET_TEST_VAR`
- VS Code injected: `BROWSER, GIT_ASKPASS, GIT_EDITOR`
- lesspipe/system: `LESSCLOSE, LESSOPEN`
- Terminal-specific (freezing breaks a different terminal): `TERM, COLORTERM, LC_TERMINAL, LC_TERMINAL_VERSION, LANG`

**DESIGN — ALLOW-LIST, not DENY-LIST.** Deny-list loses (new VSCode/terminal vars appear constantly). `config.save` (no-args/regen) emits ONLY: (1) 7 fundamentals always, (2) explicit OOSH allow-set (`OOSH_*, LOG_*, CONFIG_*, USER`), (3) `config set` user vars (tracked via `CONFIG_USER_VARS` marker or separate user-vars.env). **ROOT CAUSE of clutter:** S-5 harvest-resolve-merge harvests EVERY `^export` from file+live-env → terminal/VSCode/test leakage accumulates. Harvest must filter to the allow-set, not "all exports."

**Source lines MUST GO** (BUG 2/4) — chain belongs in `this`. ⚠ **DOCTRINE CONFLICT flagged:** `first-principles.md` Rule A says "`source xyz.env` is the sole permitted construct" in env files, but this directive moves them to `this`. Tron's newer directive wins: env files = pure exports ONLY; `this` owns the chain. first-principles.md needs reconciling (my `9e4915c` no-source-of-scripts rule is fine; narrow the env-file source allowance to "`this` sources the chain; env files don't self-re-source").

### B. Color boot — macos.latest vs dev
**MEASURED on dev:** `setup.color.env` EXISTS (sources color.env + color.names.env + bold.color.names.env w/ ESC/BOLD/NORMAL prelude); `color.env` EXISTS; **`.bashrc:150` DOES `source setup.color.env`**; `TERM=xterm-256color`, `COLORTERM=truecolor` present.

**FINDING — premise "setup.color.env not sourced on dev" is FALSE: dev sources it.** Divergence is downstream. Ranked:
1. **`.bashrc:151 source "$OOSH_DIR/log"`** runs AFTER colors — if dev's `log` (`log.start`→`log.init.colors`) clobbers `BOLD/NORMAL/COLOR_*`, colors die after set. *(Most likely — only script-level branch diff in chain, sources after colors.)*
2. **PS1/prompt template** doesn't reference color vars (or wrong names) on dev.
3. `line init` SKIPPED on both (color.env exists) → DATA identical → NOT cause.

**A/B REPRO:** `oo mode macos.latest; bash -lc 'declare -p BOLD NORMAL; declare -p|grep -c COLOR_; echo PS1=$PS1'` vs `oo mode dev; …` — BOLD/NORMAL differ → `log` clobbers; PS1 differs → prompt template.

### C. BUG 7 — pane.self single self-ID primitive (dedup)
**CONFIRMED single primitive:** `private.otmux.pane.self()` (otmux:2747, PID/ppid-walk). Public funnels (`pane.self`, `pane.get.target`, `current`) all route through it. otmux internals (1298/1341/1384/1899) already migrated — the `|| ${TMUX_PANE}` fallbacks are ALREADY removed. **otmux fully deduped.**

**PARALLEL self-ID STILL TO ELIMINATE (do NOT funnel through pane.self):**
1. `hiveMind:2258`+`2316` — `$TMUX_PANE` + raw `tmux display-message -t "$TMUX_PANE"` (callerRole) → DOUBLE violation. Fix: `otmux pane.get.target` → registry lookup.
2. `hiveMind:7461`+`7726` — `own_pane="$TMUX_PANE"` → `own_pane=$(otmux pane.get.target)`.
3. `hiveMind:1936` — `callerSession=$(tmux display-message -p '#{session_name}')` — bare display-message = FOCUSED pane's session, NOT self (the exact bug otmux:1890 warns of). Fix: derive from `otmux pane.get.target`.
4. `claudeCode:1595-1598` — `context.self` reads via `$TMUX_PANE` → use `otmux pane.get.target`; keep only `$TMUX` presence gate.

**VERDICT:** pane.self IS the single primitive, otmux fully deduped. **hiveMind (5) + claudeCode (1)** have parallel ad-hoc self-ID to funnel through `otmux pane.get.target`. Extend T-NO-TMUXPANE guard to ALSO catch bare `display-message -p '#{session_name}'` self-ID (hiveMind:1936 class). test.c2's 10 `TMUX_PANE=` SETS are legit target-injection — switch to explicit target arg for clarity (low priority).

### D. FEATURE 8 DRY question (pane-target completions consolidation)
**Decision: IN SCOPE now, same PR as CURRENT.** The single-resolver principle (`private.resolve.target` adds `CURRENT`) is undermined if the valid-target LIST is duplicated across completions (`otmux.parameter.completion.target` inline U/D/L/R vs `send.zoomed.completion.target` panes-only). Add ONE `private.complete.paneTargets` (CURRENT + U/D/L/R + `private.complete.panes`) that BOTH completions call. The list lives in ONE place, mirroring the ONE resolver — same dedup discipline as pane.self. Small, on-theme, do it with FEAT 8.

## BUG 9: `[@role pane] [@role pane]` sender-prefix DUPLICATION (Tron, recurring)

**Symptom**: messages arrive double-prefixed: `[@oosh-expert ooshTeam:0.3] [@oosh-expert ooshTeam:0.3] Self-check…`.

**Root cause**: prefix is applied at ONE chokepoint (`otmux.send` step 2, ~L2059) — but it is NOT idempotent. When `text` ALREADY starts with `[@…]` (a relayed message, a re-send, or text the caller composed including a prefix), `otmux.send` prefixes it AGAIN. hiveMind uses `otmux send.enter` (no prefix) so it's not a second layer — it's the same layer firing twice on already-prefixed text.

**Fix (DRY, one guard at the chokepoint)** — make prefix application idempotent. At otmux.send ~L2059:
```bash
if private.otmux.pane.isClaudeCode "$target" && [[ "$text" != /* ]] && [[ "$text" != \[@* ]]; then
```
i.e. skip prefixing when text already begins with `[@`. One condition, one place. Add test T-PREFIX-IDEMPOTENT: sending `"[@x y] msg"` through otmux.send yields exactly ONE prefix.

**Also audit**: find WHY already-prefixed text reaches send (is something capturing a received message and re-sending it verbatim?). The idempotency guard is the safety net regardless, but if a caller is echoing the inbound prefix, fix that too.

---

## Architect review FILED (f5253b9) — expert-action items A & B + C-extension

Full A/B/C/D in the "Architect Review" section above. Items still needing EXPERT action:

**A — config.save ALLOW-LIST (not deny-list)**: root cause = S-5 harvest grabs EVERY `^export` from file+live-env → VSCode/terminal/test leakage. Fix: harvest filters to allow-set only — 7 fundamentals always + OOSH allow-set (`OOSH_*/LOG_*/CONFIG_*/USER`) + tracked `config set` user vars. NEVER persist: TERM/COLORTERM/LC_*/LANG/BROWSER/GIT_*/LESS*/EXPECTED_RETURN_VALUE/GET_TEST_VAR. Source lines move to `this`. (Doctrine: architect flagged first-principles Rule A conflict — env files = pure exports only, `this` owns the source chain; architect to reconcile the wording.)

**B — color culprit (my premise was WRONG, dev DOES source setup.color.env)**: ranked #1 = `.bashrc:151 source "$OOSH_DIR/log"` runs AFTER colors and `log.init.colors` likely clobbers `BOLD/NORMAL/COLOR_*`. Repro: `oo mode macos.latest; bash -lc 'declare -p BOLD NORMAL'` vs `oo mode dev; …` — if BOLD/NORMAL differ, log clobbers. Expert: fix the ordering/clobber so colors survive on dev (this is why `claudeCode list` shows no color).

**C-extension — guard missed a class**: my TMUX_PANE grep returned zero, BUT architect found bare `display-message -p '#{session_name}'` self-ID at hiveMind:1936 (focused-pane bug, no TMUX_PANE string so grep missed it). Funnel through `otmux pane.get.target`. **Extend T-NO-TMUXPANE guard to also catch bare `display-message -p '#{session_name}'` self-ID.**

**D — FEATURE 8 completion consolidation IN SCOPE**: add one `private.complete.paneTargets` (CURRENT + U/D/L/R + panes), both pane-target completions call it. Same PR as CURRENT.

## BUG 10: agent.send / otmux send reports "delivered" but ENTER does not register (false-positive verify)

**Symptom** (SM caught, 2x: tester S1 + expert u24 dispatches): `hiveMind agent.send` returned "INFORM delivered" but the message sat COMPLETE-but-UNSUBMITTED in the target's input buffer — Enter never registered, agent stayed idle, task never ran. SM had to manually submit both.

**Impact**: PO dispatches silently fail to start work. `send.verified` is giving a FALSE POSITIVE — it confirms the text is present in the pane but NOT that it was submitted (no 'esc to interrupt' / processing state).

**Fix**:
1. `otmux.send.verified` must verify SUBMISSION, not just text presence — after sending Enter, capture and confirm the pane entered a processing/submitted state (e.g. 'esc to interrupt' appears, or the input line cleared), not merely that the text echoed.
2. If not submitted, retry Enter (send.raw Enter) up to N times, then report FAILURE (not success).
3. Investigate why Enter doesn't register on these panes (timing? the text-send and Enter race? accept-edits eating it?).

**Interim PO discipline (adopt now)**: after every dispatch, verify the pane shows 'esc to interrupt' (submitted) — if not, `otmux send.raw <pane> Enter` and re-check. Don't treat "delivered" as "running." (SM is currently the safety net catching these.)

## Report-back (edit here; report to oosh-po)
- Architect (config-dedup + color-boot + BUG 7 + FEAT 8 DRY): **DONE 2026-06-28** — see Architect Review above. (A) clutter = test/VSCode/terminal leakage harvested by S-5 merge → ALLOW-LIST; source lines → `this` (Rule A doctrine conflict flagged). (B) dev DOES source setup.color.env — premise corrected; culprit ranked: `source $OOSH_DIR/log` after colors (cand 1) or PS1 template (cand 2), A/B repro given. (C) pane.self confirmed single primitive; 5 hiveMind + 1 claudeCode parallel self-ID to funnel through pane.get.target. (D) consolidate pane-target completions into one helper w/ FEAT 8.
- Expert (HOME guard + user.env regen + commit): **DONE** — BUG1 4bdd948, BUG2 37e16f7+regen, BUG3 af3a3f7, BUG5 d40a005, BUG6 3fd419b.
- Expert BUG7 (eliminate TMUX_PANE): **DONE** — public `otmux pane.self` primitive added (`%`=pane_id default, `target`=session:win.pane). otmux 6480f78 (drop 4 stale `||TMUX_PANE` fallbacks + layout.dynamic + fit), hiveMind 350e3e7 (caller-role x2 + own_pane x2, killed 2 raw-tmux calls), claudeCode d74e354 (context.self gate), restore/hiveMind a20d0d7. Guard T-NO-TMUXPANE a5f709d → 3/3 pass, zero non-comment refs in otmux/hiveMind/claudeCode. Verified live: self-ID correct (ooshTeam:0.3) despite stale TMUX_PANE=%8. test/test.c2's 10 refs are deliberate test targets — left for architect review per directive.
- Expert BUG9 + A + B + C-ext + FEAT8/D: **DONE** — BUG9 idempotent prefix `4c52e24` (+T-PREFIX-IDEMPOTENT, audit: dup came from agents manually composing [@…] then auto-prefix on top — guard makes them coexist). C-ext `9ff5343` (killed bare display-message self-ID at hiveMind:1936 + 4 otmux sites via new `private.otmux.self.session`; extended T-NO-TMUXPANE to catch untargeted display-message — 6/6 pass). A `9937799` (config.save allow-list: strict OOSH-only live-env harvest + deny-set cleans file leakage; user.env 113→19 exports, 0 leakage, 0 source lines). B `c82fa31` (line init generates self-contained EXPORTED setup.color.env — colors survive into subprocesses incl. `claudeCode list`; pure-state, no source chain; regenerated on WODA.prod). FEAT8+D `615918c` (CURRENT target via one resolver `private.resolve.target`→pane.self, immune to stale TMUX_PANE; shared `private.complete.paneTargets`; T-CURRENT-TARGET 5/5 — verified `pane.title CURRENT` retitles caller's own pane).
- Tester (clean-boot verification on WODA.prod + u20):
