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
