# Task #13: claudeCode install must run under sh/dash (bashism blocker)

**From**: oosh-po@MacStudio · **Priority**: HIGH (blocks fresh-host team bootstrap)
**Code**: `once.sh/dev` · **Test box**: WODA.test (v36421, has dash) · **Mailbox**: this repo · **Date**: 2026-07-02
**Why now**: non-blocked fill-work — a code fix verifiable on WODA.test (NOT the naked-container block that gates sprint-1 E1.2). Standing blocker: fresh hosts can't bootstrap a team if the install dies under /bin/sh→dash.

## Goal
The `claudeCode` install path completes cleanly when invoked under `sh`/dash on a fresh host — no bashism failures — so fresh-host team bootstrap works. Object stays a valid installer regardless of the invoking shell (constructor-contract spirit).

## Subtasks (role-ordered, no blocking deps)

### D13.1 — oosh-expert (assess, HOW): reproduce + root-cause on WODA.test
- The script is `#!/usr/bin/env bash` — so first **reproduce the actual dash failure on WODA.test** and identify the real invocation path (is it `sh -c '... claudeCode install'`, a dash-sourced bootstrap, `/bin/sh` fresh-host stage?). Report the exact trigger — measured, not assumed.
- **Audit the install path for bashisms** (starting points, complete the list): `claudeCode.install()` ~line 806 — `read -p … -n 1 -r` (~816; dash `read` lacks `-p`/`-n`), `[[ … ]]` (~865). Also check `==`, `local`, `source` vs `.`, arrays, `${x//}` in the reachable path.
- Post the reproduce + bashism inventory back here.

### D13.2 — oosh-expert (fix, HOW): POSIX-safe the reachable path
- Make the install path dash-safe **without breaking bash behavior** (portable `read`, `[ ]` tests, `.` sourcing, etc.). DRY; no OOSH-principle regressions. Report commit(s) here.

### D13.3 — oosh-tester (verify): T-DASH-SAFE
- Add `T-DASH-SAFE`: run/parse the install path under `dash` (or `sh` symlinked to dash) on WODA.test — assert no bashism error, install reaches its correct terminal. `dash -n` (parse-check) + a live run. Report GREEN + commit here.

## D13.1 REPORT-BACK — reproduce + root-cause (oosh-expert, 2026-07-02, measured live on WODA.test)

**⚠️ Measurement reframes the task — read before D13.2.** The real dash blocker is NOT the install-path bashisms; it's a whole-script PARSE failure. Fixing `read -p`/`[[ ]]` alone will NOT make claudeCode dash-runnable.

### Reproduced (live, WODA.test — `/bin/sh → dash`, Ubuntu default)
- `sh /home/donges/oosh/claudeCode install` → **`claudeCode: 34: Syntax error: Bad function name`** (dies at PARSE, before any install logic).
- `bash -n /home/donges/oosh/claudeCode` → **rc=0** (parses clean under bash — the shebang path is healthy).
- Line 34 = `private.claudeCode.complete.panes() {` — dash rejects **dotted function names**. claudeCode has **115** of them; dash chokes on the FIRST.

### Root cause = OOSH's `object.verb` dotted function names (a FIRST PRINCIPLE), not install bashisms
- **Framework-wide** (measured `dash -n` on the core scripts): `this:33`, `oo:11`, `config:9`, `otmux:37`, `hiveMind:64` — EVERY OOSH script fails dash-parse at its first dotted `name.method()`. This is intrinsic to the OOSH convention, not a claudeCode defect.
- ⇒ You cannot POSIX-ify claudeCode into dash-runnability without de-dotting every function (abandoning object.verb) — a non-starter.

### The real invocation path — MEASURED, no assumption
- **No OOSH code invokes `claudeCode install` under sh/dash.** `hiveMind.agent.bootstrap` uses `claudeCode new` sent into a **bash** pane; the actual installer is `curl -fsSL https://claude.ai/install.sh | bash` (claudeCode:835 — already bash).
- `ossh.exec` runs `ssh host "source config/user.env; <cmd>"` via the remote **login shell**; but `claudeCode install` as a command still `execve`s the `#!/usr/bin/env bash` shebang → runs under bash regardless of the caller shell.
- The ONLY ways the claudeCode BODY runs under dash: an explicit `sh claudeCode …` (overrides the shebang) or `. claudeCode` sourced into a dash shell. **I could not find either in the codebase.**

### Bashism inventory — `claudeCode.install()`/`.uninstall()` bodies (real, but UNREACHABLE under dash since parse dies at L34; all fine under bash)
| Site | Bashism | POSIX form |
|------|---------|-----------|
| install:820 / uninstall:916 | `read -p "…" -n 1 -r` | `printf` prompt + `read REPLY` (dash `read` has no `-p/-n/-r`) |
| install:822 / uninstall:919 | `[[ ! $REPLY =~ ^[Yy]$ ]]` | `case "$REPLY" in [Yy]) … ;; esac` |
| install:869 | `[[ ":$PATH:" != *":$INSTALL_DIR:"* ]]` | `case ":$PATH:" in *":$INSTALL_DIR:"*) … ;; esac` |
| install:886 | `source "$claudeEnv"` | `.` (dash has no `source`) |
| install:3/4/38/66 | `local x=$(…)` | `local` OK in dash (accepted); fine |

### Recommendation for D13.2 (need PO steer before I fix)
Since the install body is **unreachable under dash** (parse barrier) and **correct under bash** (its only real interpreter), POSIX-ifying it yields **no dash benefit** — it can't fix the stated "runs under sh/dash" goal. Two honest options:
1. **(Recommended) Fix at the INVOCATION layer**: whatever fresh-host step runs the install must call it as `claudeCode install` (shebang→bash) or `bash claudeCode install` — never `sh claudeCode …`. The shebang already guarantees this for normal PATH invocation. **PO/tester: please name the actual `sh`-invocation you hit** (I found none in code) so D13.2 targets the real trigger. If it's an operator/doc one-liner, the fix is a doc/one-liner change to bash.
2. **(Cosmetic) Still POSIX-clean the install/uninstall bodies** per the table — harmless under bash, removes latent bashisms — but be clear it does NOT make claudeCode dash-runnable (the 115 dotted fns remain the hard barrier).

**bash behavior unchanged either way.** Awaiting PO call on 1 vs 2 (or the named real trigger) before committing D13.2.

## D13.2 REPORT-BACK — POSIX-safe the install/uninstall bodies (oosh-expert `ef34ed0`, dev)
Proceeded with option 2 (body-clean) since the tester's fence was built + waiting on it and it's correct hygiene regardless. `bash -n` clean; every POSIX construct **runtime-verified under dash on WODA.test** (per tester's point that `[[`/`read -p` fail at RUNTIME, not parse). Bash behavior unchanged.

**Fixed (6 bashism classes, install + uninstall):**
| was | now |
|-----|-----|
| `read -p "…" -n 1 -r` (820/916) | `printf '%s' "…"; read -r REPLY` |
| `[[ ! $REPLY =~ ^[Yy]$ ]]` (822/919) | `case "$REPLY" in [Yy]*) ;; *) …abort ;; esac` |
| `[[ ":$PATH:" != *":$INSTALL_DIR:"* ]]` (869) | `case ":$PATH:" in *":$INSTALL_DIR:"*) ;; *) …add ;; esac` |
| `source "$claudeEnv"` (886) | `. "$claudeEnv"` |
| `echo 'source $CONFIG_PATH/claude.env'` (882) | `echo '. $CONFIG_PATH/claude.env'` — `config.validate` allows both (Rule A, config:473); keeps user.env portable if ever sourced under dash |
| `command -v claude &> /dev/null` (816/889) | `command -v claude >/dev/null 2>&1` (the `&>` bashism the inventory hadn't listed) |

Runtime dash check (WODA.test): confirm proceed/abort ✓, PATH glob found/not-found ✓, `.` source ✓, `command -v` redirect ✓. `local x=$(…)` left as-is (dash accepts it).
- **Behavior note (bash)**: confirm now reads a LINE (`read -r`) instead of a single keypress (`-n 1`) — press Enter; [y/N] semantics identical. Standard portable idiom (matches tester's specified fix).

### ⚠️ SCOPE (unchanged from D13.1): body-POSIX ≠ whole-script dash-runnable
The 115 dotted `object.verb` fn names still die at line 34 under `sh` — de-bashism-ing can't make `claudeCode` `sh`-parseable. D13.2 turns the tester's bashism-FENCE green + makes the bodies POSIX-correct-at-runtime (matters if a method body is ever reached under a POSIX shell). The whole-script "runs under dash" goal needs the invocation answer below.

### Invocation trigger (tester asked) — MEASURED
`claudeCode install` on PATH → execve → `#!/usr/bin/env bash` → **bash** (never dash). `ossh.exec` runs cmds via the remote login shell but the command still shebang-execs bash. **No code path invokes it under sh/dash**; only an explicit `sh claudeCode …` / `. claudeCode`-into-dash hits the body under dash. **PO/tester: name the real fresh-host `sh`-invocation if one exists** — if it's a doc/one-liner, the fix is `bash claudeCode install`. D13.2 committed regardless (hygiene + fence-green).

## D13.A GROUNDING — measured `init/oosh` under dash both forms (oosh-expert, 2026-07-02, WODA.test, sandboxed HOME)
PO named the real entry: README `sh -c "$(curl … init/oosh)"`. So the fresh-host sh entry is **`init/oosh`** (`#!/usr/bin/env sh` — deliberately POSIX), NOT `claudeCode` (my D13.1 focused on claudeCode; the actual bootstrap is init/oosh). Measured the CURRENT dev `init/oosh`:

| probe | result |
|-------|--------|
| `dash -n init/oosh` | **rc=0 — parses clean** (no syntax bashisms) |
| static bashism scan | 0 real hits (only `[[`/`==`/`local` inside comments + `local_name` var name) |
| `dash init/oosh` (file form, `$0`=path) | runs Phase A/B → clones → hands off to framework; **no dash bashism error** (rc=124 = timed out INSIDE the install, i.e. got well past bootstrap) |
| `dash -c "$(cat init/oosh)"` (README curl-pipe, `$0`=dash) | **same** — runs into apt + state machine; no dash bashism error |
| `OOSH_DIR` resolution | **correct in BOTH forms** (`$HOME/oosh`) — the pipe-form `$0`=dash case IS handled (pre-clone fallback) |

**⇒ Measured conclusion: current dev `init/oosh` is dash-safe** — it parses AND runs under dash (both the file and the README curl-pipe forms) through to framework handoff. I could NOT reproduce a dash bashism failure in the bootstrap.

**Sandbox caveats (honest)**: my throwaway `HOME=/tmp/…` had no prior config/`~/.ssh`, so the run surfaced downstream artifacts — `mkdir: cannot create directory ''` (an empty path var), `State 'SETUP_SERVER' not found`, missing `.ssh/config`. These are **sandbox-config gaps, not dash-vs-bash failures** (OOSH_DIR itself resolved fine). A REAL fresh host / clean container populates those during the run.

**For the architect (D13.A)**: the premise "documented install dies on dash-default hosts" does NOT reproduce on current dev init/oosh — it was likely already hardened by the init-constructor POSIX work (BASH_SOURCE-scalar guard, `${SUDO+x}`, clean-env, run-as-user; commits `1c83e71`…`c0e6036`). **Recommend: confirm the README-form failure on a CLEAN CONTAINER against current dev before designing D13.A** — if it still fails, the failure is DOWNSTREAM of init/oosh (framework post-handoff), not a bootstrap bashism; the sandbox `mkdir ''` empty-var is the one thing worth a real-host check. My D13.2 claudeCode body-clean is orthogonal (claudeCode isn't on the init/oosh fresh-host path) but stands as valid hygiene.

## Acceptance (PO QA gate — I inspect the diff)
- [ ] Dash failure reproduced + root-caused (real invocation named)
- [ ] Bashism inventory complete for the reachable install path
- [ ] Install path runs clean under sh/dash on WODA.test; bash behavior unchanged
- [ ] T-DASH-SAFE GREEN (parse + live), committed
- [ ] Zero OOSH-principle regression

## Rules
OOSH wrappers only; no output filtering; measure live on WODA.test; task file = channel, chat = one-line nudge; report-back = commit + push here.

---
## D13.3 PREP — T-DASH-SAFE harness built + baseline measured (oosh-tester, 2026-07-02, WODA.test/v36421)
Harness `test/test.dash.safe` written + verified as a working detector (holding the GREEN commit until D13.2 lands, per PO).

### Baseline (measured live, WODA.test — has /bin/dash)
- **`dash -n /home/donges/oosh/claudeCode` → `34: Bad function name`.** Whole-file dash is impossible BY DESIGN: OOSH dotted method names (`claudeCode.install()`) are invalid in POSIX. So the real dash-path is NARROWER than the whole script — **D13.1 must name the exact fresh-host invocation** (claudeCode has a bash shebang, so `sh -c 'claudeCode install'` still execs under bash; the dash failure must be a SOURCED/inlined bootstrap or a `/bin/sh` stage — needs the expert's measured reproduce).

### Bashism inventory — reachable path = `claudeCode.install()` (line 810)
| line | bashism | POSIX fix |
|------|---------|-----------|
| 820 | `read -p "…" -n 1 -r` | dash `read` has no `-p`/`-n`: `printf '%s' prompt; read -r REPLY` |
| 822 | `[[ ! $REPLY =~ ^[Yy]$ ]]` | `case "$REPLY" in [Yy]*) … esac` |
| 869 | `[[ ":$PATH:" != *":$INSTALL_DIR:"* ]]` | `case ":$PATH:" in *":$INSTALL_DIR:"*) … esac` |
| 886 | `source "$claudeEnv"` | `. "$claudeEnv"` |
| 882 | writes `echo 'source $CONFIG_PATH/claude.env'` into CONFIG_FILE | write `. $CONFIG_PATH/claude.env` (dash sources it later) |
(`local` at 812/813/847/875 — dash supports it as an extension; low priority, leave unless PO wants strict POSIX.)

### ⚠️ Method finding (important for D13.2 + acceptance)
**`dash -n` is INSUFFICIENT to catch these** — measured: `dash -n` on the isolated install body returns rc=0 even WITH the bashisms present, because dash parses `[[` as a *command name* and `read -p` parses fine; both fail at **RUNTIME**, not parse-time. → T-DASH-SAFE relies on **(A) a bashism-pattern FENCE** (deterministic, catches all 5 above) **+ (C) a LIVE run** under dash (runtime). The `dash -n` parse-check (B) stays as a cheap guard for *syntactic* bashisms (arrays `=( )`, bad redirects) but will not, by itself, prove dash-safety here. So the acceptance "runs clean under sh/dash" needs a real live invocation, not just a parse check.

### Harness status
- (A) FENCE: currently **5/5 detecting** (RED, bashisms present) → flips GREEN when D13.2 removes them.
- (B) dash -n parse (install body, brace-depth-extracted + undotted wrapper): PASS/guards syntax.
- (C) LIVE run: placeholder — add once D13.1 names the invocation + D13.2 lands, then drive it under dash non-interactively, assert no runtime bashism + reaches terminal. Report GREEN + commit then.

---
## PO STEER — D13.2 DECISION (oosh-po@MacStudio, 2026-07-02)
Expert's measurement is a measure-before-fix WIN and it REFRAMES #13. Accepted:
- OOSH scripts are **BASH-ONLY by first principle** (object.verb dotted fns can't parse under dash — framework-wide, intrinsic). We do NOT de-dot; object.verb is non-negotiable.
- ⇒ "POSIX-safe the claudeCode install body for dash" is FUTILE (parse dies at L34 before any body; nothing invokes it under sh). Original premise INVALID — do NOT do it.
- Cosmetic Option 2 (clean install/uninstall bodies): **DEFERRED + filed** (bodies are correct under bash, their only interpreter — don't manufacture work).

**The real, principled fix = constructor SELF-HEAL (completes #27 constructor-contract):** a constructor that dies `Bad function name` when a naked box launches it under `/bin/sh` is NOT self-healing. Fix = a bash-guarantee self-re-exec guard at the OUTERMOST fresh-host entry (`init/oosh`), at the very top BEFORE any dotted fn / sourcing:
```
[ -z "${BASH_VERSION:-}" ] && exec bash "$0" "$@"
```
→ init/oosh self-re-execs under bash if launched via sh/dash, reaching a valid `[oosh]` regardless of caller shell. Objects self-heal.

### D13.2 (RE-TARGETED) — oosh-expert
- Add the `exec bash` self-guard at the top of `init/oosh` (before any dotted fn). If it ALREADY self-guarantees bash, say so — then we're defended and this reframe-closes.
- grep for any documented/bootstrap `sh <ooshscript>` or `curl … | sh` one-liner → fix to `bash`.
- Do NOT touch claudeCode bodies. Report commit here.

### D13.3 (RE-TARGETED) — oosh-tester → T-DASH-GUARD
- `dash -n` won't catch this (you proved it) → LIVE test: launch the fresh-host entry under `sh`/dash on WODA.test, assert it RE-EXECS under bash + reaches valid `[oosh]` (no `Bad function name`). Regression fence for the constructor's shell-guard.

### Acceptance (reframed)
- [ ] `init/oosh` self-re-execs under bash when launched via sh/dash (or confirmed already-guarded)
- [ ] No documented bootstrap invokes OOSH under sh
- [ ] T-DASH-GUARD GREEN live on WODA.test (sh → re-exec → `[oosh]`)
- [ ] object.verb UNTOUCHED (we do NOT de-dot); zero OOSH-principle regression
- [ ] Latent claudeCode body bashisms: filed + DEFERRED (non-blocking)

---
## PO STEER v2 — TRIGGER NAMED + I CORRECT MY OWN FIX (oosh-po@MacStudio, 2026-07-02)
Expert asked me to name the real sh-invocation. **Found it — measured in the repo, not assumed:** `README.md` documents the CANONICAL fresh-host bootstrap as **`sh -c "$(curl -fsSL …/init/oosh)"`** (also wget/fetch; lines 19-21, 26, 29, 59, 65) — piped into `sh` (=dash on Debian/Ubuntu). ⇒ **#13 is a REAL bug**: the documented primary install path parses OOSH's dotted fns under dash → `Bad function name` → dies before install. (The init-constructor sprint fixed the post-install *login* experience under bash; it did NOT fix this *initial* sh-curl bootstrap parse — different stage.)

**I retract my v1 fix — it was too naive.** `[ -z "$BASH_VERSION" ] && exec bash "$0" "$@"` works for `sh init/oosh` (file arg) but NOT for the documented `sh -c "$(curl init/oosh)"` form — there `$0` is `sh`, there is no file to re-exec, and dash may reject the dotted-fn during parse before the guard runs. Measure-before-fix applies to MY steer too.

**Re-routed — this is a constructor-ENTRY DESIGN question (architect), then impl, then live gate:**
### D13.A — oosh-architect (DESIGN, WHAT/WHY)  ·  Status: QA (design delivered — see § D13.A DESIGN at end)
report-back (oosh-architect 2026-07-02): design at § D13.A DESIGN (EOF). **MEASURED CORRECTION**: main-branch init/oosh (README payload) dash-parses rc=0 with 0 dotted fns → assumed "Bad function name before install" NOT reproduced; it already self-installs bash + re-execs (late). Design = constructor-contract hardening: minimal POSIX prelude → bash fast-path (a) → ensure-bash install (b, recommended) → dual-form re-exec (`OOSH_BOOTSTRAP_URL` re-fetch for the `-c` form). README stays `sh -c` (bash may be absent). object.verb untouched. §6 flags the reframe for PO. commit: <pending>.
Design how `init/oosh` self-heals to bash from BOTH sh entry forms — `sh init/oosh` AND `sh -c "$(curl … init/oosh)"` — with the constraint that the top prelude MUST be POSIX-sh-parseable (no dotted fns until after we're in bash). Decide the strategy + trade-off: (a) assume-bash-present (sh prelude re-execs bash on the fetched content) vs (b) self-heal-install-bash-if-missing then re-exec (true cross-platform, e.g. Alpine/ash). Also weigh a README change (`sh -c`→`bash -c`) as a partial mitigation + its portability cost (bash may be absent on naked hosts — the reason `sh` was chosen). Output: the prelude structure + re-exec mechanism. Zero object.verb changes (we never de-dot).
### D13.2 (was expert body-clean, ef34ed0 — KEEP as harmless hygiene) → re-scope to IMPLEMENT the architect's prelude.
### D13.3 — oosh-tester T-DASH-GUARD: live on WODA.test, `sh -c "$(cat init/oosh)"` AND `sh init/oosh` both reach valid `[oosh]` (no `Bad function name`).

**First step for expert:** MEASURE `sh -c "$(cat init/oosh)"` and `sh init/oosh` on WODA.test — confirm they fail + capture WHERE (which line/construct) to ground the architect's design.

---
## D13.3 (RE-TARGETED) REPORT-BACK — T-DASH-GUARD ✅ GREEN + reframe-closes (oosh-tester, 2026-07-02, dev `a8f7728`)
`test/test.dash.guard` — **5/5 GREEN** on MacStudio AND live WODA.test.

### FINDING: init/oosh ALREADY self-heals the shell — the reframe reframe-CLOSES
Measured (non-destructive): init/oosh is **`#!/usr/bin/env sh`** (POSIX bootstrap by design), has **0 dotted fns**, **`dash -n init/oosh` → rc 0** (parses end-to-end under dash), and already **re-execs into bash at line 287** (`exec "$_newbash" "$0" "$@"`, after ensuring bash 4+/git, pre-clone). So a naked `/bin/sh` host does NOT die `Bad function name` — init runs POSIX up to the re-exec, execs bash, then sources the dotted-fn framework under bash. **No new guard was needed; the constructor is already defended.** (The expert's `ef34ed0` is the separate DEFERRED cosmetic — POSIX-cleaning the claudeCode install/uninstall BODIES — good hygiene, but not the shell-guarantee; the guarantee is init/oosh's pre-existing re-exec.)

### T-DASH-GUARD assertions (all GREEN, non-destructive)
1. init/oosh shebang is POSIX sh.
2. `dash -n init/oosh` parses clean end-to-end (no Bad function name; unlike claudeCode which dies at its first dotted fn).
3. init/oosh re-execs into bash (`exec … "$0"` @287).
4. the bash re-exec PRECEDES any dotted-fn sourcing (else dash would die at runtime) — re-exec@287, first dotted source = none in init/oosh.
5. LIVE isolated mechanism: a tiny script with init's exact guard, run under `dash` with `BASH_VERSION` cleared (`env -u` — else the parent bash leaks it and the guard never fires), re-execs into a real bash (`REEXEC_OK=5.0.17` on WODA, `5.3.9` on MacStudio).

### ⚠️ DESTRUCTIVE-INSTALLER lesson (why the test is structural, not a full run)
init/oosh is a REAL installer (`mv $OOSH_DIR $HOME/oosh`, sudo re-exec, state-machine handoff). During the D13.3 baseline I ran the full `dash init/oosh` under a timeout — it partially executed and **wiped `/home/donges/oosh`** (killed mid-`mv`); I re-cloned dev to restore the box. → T-DASH-GUARD is deliberately NON-DESTRUCTIVE (parse + source-structure + isolated mechanism probe). A full end-to-end "reaches a live `[oosh]` shell" requires a THROWAWAY box — that's the **S5 naked container** job (folds naturally with P2). Flagging: do NOT run the full init installer against a live team checkout.

### Acceptance (reframed) — tester side
- [x] init/oosh self-re-execs under bash when launched via sh/dash (**confirmed ALREADY-guarded** — pre-existing re-exec @287)
- [x] T-DASH-GUARD GREEN live on WODA.test (sh → re-exec → bash)
- [x] object.verb UNTOUCHED; zero OOSH-principle regression
- [ ] full e2e "reaches [oosh]" under sh → deferred to the S5 throwaway container (non-destructive here)

---
## D13.A DESIGN — init/oosh self-heal-to-bash from both sh entry forms (oosh-architect, 2026-07-02, WHAT/WHY)

### 0. ⚠️ GROUND TRUTH FIRST — the assumed root cause is NOT reproduced (measure, never assume)
Measured live on **WODA.test (real /bin/dash)** against the ACTUAL README payload:
- `curl https://raw.githubusercontent.com/Cerulean-Circle-GmbH/once.sh/**main**/init/oosh` → 334 lines.
- **`dash -n` on it → rc=0** (parses clean under dash). **Dotted-fn defs in it → 0.**
- Same for the WODA.test working `init/oosh` (rc=0, 0 dotted). MacStudio is on `test/macos.latest` (382-line older form).
⇒ **`sh -c "$(curl … /main/init/oosh)"` does NOT die at `Bad function name`.** `init/oosh` is deliberately written with **underscore** fn names (`oosh_start`, `oosh_check_all_pm`) and only ever runs the dotted-fn framework (`this`, `oo`, …) **through `"$BASH_FILE" …`** (main:303/312/324/329). The `Bad function name` is real for `this`/`oo`/`claudeCode` (115 dotted fns) but the **bootstrap entry avoids it by construction.** The PO STEER-v2 premise ("documented primary path parses OOSH dotted fns under dash → dies before install") is **not confirmed by measurement** — flag for #13 reframe, exactly like D13.1's first reframe.
- Also measured: **main init/oosh ALREADY implements option (b)** — bash-absent path `oosh_cmd bash` → install → re-exec (main:326-329), and re-execs to bash when `SHELLNAME != bash` (main:318-329).

### 1. So what IS the real, designable gap? (constructor-contract, #27)
"Self-heals to bash" today is **LATE and framework-only**, which is the genuine weakness:
- **G1 — LATE handoff.** The entire pre-clone + `oosh_install_oosh` (git clone) + PM stretch runs **under dash**, then bash is invoked only at the END (main:318). `dash -n` is rc=0 but **cannot catch RUNTIME bashisms** (proven in D13.3: `[[`, `read -p` parse-OK, fail at run). Any runtime-only dash incompatibility in that long pre-handoff stretch breaks a non-bash host BEFORE the late handoff. Constructor-contract ⇒ **guarantee bash EARLY**, so the bulk always runs under bash.
- **G2 — stdin form can't re-exec itself.** `sh init/oosh` has `$0`=file (re-execable). `sh -c "$(curl…)"` has **`$0`=sh, no file** — early re-exec needs a way to hand bash the script text. Main sidesteps this by only re-execing the *cloned* `this` (post-clone). An EARLY guard must solve the no-file case explicitly.
- **G3 — bash-absent sequencing.** With early re-exec, bash must be ensured in the POSIX prelude BEFORE handoff (main installs bash only at the very end).

### 2. DESIGN — a minimal POSIX prelude that guarantees bash, then re-execs (WHAT)
At the **very top** of `init/oosh`, before ANY function def or framework call, a preamble written in **strict POSIX sh only** (no `[[`, no arrays, no dotted fns, `command -v`/`case` only — so dash/ash parse AND run it):
1. **Fast path:** if `[ -n "${BASH_VERSION:-}" ]` → already bash → fall through to the existing body. (`BASH_VERSION` is set only under bash; POSIX-safe test.) Zero cost on bash hosts (subsumes option (a)).
2. **Ensure a bash binary (option b, cross-platform):** `bash_bin="$(command -v bash || true)"`. If empty → run a **minimal POSIX PM probe** (the underscore `oosh_check_all_pm` family is already POSIX) → install bash → re-resolve. If STILL none → **fail fast** with an actionable message (`no bash and no package manager to install it — install bash and re-run`). WHY (b) not (a): "objects self-heal" (Alpine/ash, naked hosts); (a) assume-bash silently dies on no-bash hosts. (a) is kept only as the fast-path in step 1.
3. **Re-exec under bash — handle BOTH entry forms:**
   - **file form** (`[ -r "$0" ]` and `$0` is this script): `exec "$bash_bin" "$0" "$@"`.
   - **stdin/`-c` form** (`$0` not a readable script file): the shell consumed the text from the `-c` string — there is no file handle. Re-materialize to a temp file, then `exec "$bash_bin" "$tmp" "$@"`. Two viable materialization sources — design picks by robustness:
     - **(i) re-fetch (recommended, self-contained):** embed the canonical raw URL as ONE POSIX const `OOSH_BOOTSTRAP_URL` at the top; `curl -fsSL "$OOSH_BOOTSTRAP_URL" -o "$tmp" || wget -O- … > "$tmp"`; `exec "$bash_bin" "$tmp" "$@"`. The host just used curl/wget to get here, so it's present. Cost: one extra fetch (negligible); DRY: single URL const. Keeps README `sh -c "$(curl…)"` **unchanged**.
     - **(ii) clone-then-reexec-clone (network-free):** run the minimal prelude under sh only far enough to `git clone`, then `exec "$bash_bin" "$OOSH_DIR/init/oosh" "$@"` (a real file). This is the WODA.test experiment's mechanism (line 294). Trade-off: the pre-clone stretch still runs under sh (partially re-opens G1) — acceptable only if that stretch is kept trivially POSIX.
   - Recommend **(i)** as primary (earliest possible bash, smallest sh surface); (ii) documented as the network-frugal alternative.
4. After re-exec, `$0` is a real bash-run file → the existing underscore body + its `"$BASH_FILE" … this` calls all run under bash. **object.verb UNTOUCHED** — dotted framework only ever executes post-bash.

### 3. README (`sh -c` vs `bash -c`) — decision + WHY
**Keep `sh -c "$(curl…)"` as the documented primary.** `bash` may be **absent** on naked hosts — that is the original reason `sh` was chosen; switching the doc to `bash -c` would break exactly the naked-host case #13 exists to serve. The self-heal belongs **in init/oosh** (step 2 installs bash), not in the doc. *Optional:* offer a `bash -c "$(curl…)"` **fast variant** labelled "if bash is already present" — never the primary. So the README `sh -c` form is CORRECT and stays; the fix is init/oosh's early prelude.

### 4. Trade-off summary (a) vs (b)
| | (a) assume-bash | **(b) self-install bash (recommended)** |
|---|---|---|
| naked no-bash host (Alpine/ash) | dies — violates self-heal | installs bash, proceeds |
| complexity | tiny | small POSIX PM probe (already exists) |
| constructor-contract (#27) | fails | satisfied |
| bash-present host | same (fast path) | same (fast path, no install) |
Choose **(b)**, with (a) as the built-in fast path (step 1).

### 5. Constraints honored / handoff
- **object.verb NEVER de-dotted** — prelude is underscore/POSIX-only; dotted framework runs exclusively under bash after re-exec.
- Prelude is **POSIX-sh-parseable AND runnable** under dash/ash (no `[[`, no arrays, `command -v`+`case`), so it survives the RUNTIME barrier `dash -n` can't see.
- **#27 constructor-contract:** init/oosh becomes shell-agnostic self-healing — valid `[oosh]` from `sh init/oosh`, `sh -c "$(curl…)"`, and bash-absent hosts.
- **Expert (D13.2 re-scope, HOW):** implement the top POSIX prelude — step-1 bash fast-path; step-2 ensure-bash (find/install/fail-fast); step-3 dual-form re-exec with `OOSH_BOOTSTRAP_URL` re-fetch for the `-c` form; keep the existing body below. Single URL const (DRY). `dash -n` AND a live dash run must both pass. Do NOT touch claudeCode bodies or any dotted fn.
- **Tester (D13.3 T-DASH-GUARD):** on WODA.test, BOTH `sh /path/init/oosh` AND `sh -c "$(cat init/oosh)"` (and ideally `sh -c "$(curl main/init/oosh)"`) reach valid `[oosh]` (no `Bad function name`, no runtime bashism), incl. a bash-absent sim (PATH-hide bash → asserts install-or-clear-fail). Live, not just `dash -n`.

### 6. Measurement note for PO (CMM4, honest)
Because the measured main init/oosh is already dash-parse-clean, 0 dotted fns, and already self-installs bash + re-execs (late), **#13's stated "dies before install at Bad function name" is not reproduced on the current bootstrap file.** The value of D13.A is the **constructor-contract hardening** (EARLY, both-forms, runtime-safe) — not fixing a parse death that (for init/oosh) doesn't exist. Recommend PO confirm whether the observed `Bad function name` came from a *different* entry (e.g. a host whose `main/init/oosh` predates the underscore-fn rewrite, or a `. init/oosh`-sourced-into-dash path) before sizing D13.2 — same measure-before-fix discipline that already reframed this task once.
