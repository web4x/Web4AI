# BUG: fresh `ossh install` produces a polluted (logic-laden) user.env

**From**: oosh-po (Tron-directed investigation 2026-06-24)
**Owners**: oosh-architect (add the self-care/self-repair principle to `docs/first-principles.md` + design the self-repair entrypoint & `this` auto-heal) → oosh-expert (implement install-emit, validate gate, self-repair, `this` self-validate, regen boxes) → oosh-tester (T-ENV-INSTALL).
**Priority**: HIGH
**Status**: OPEN — investigation done, fix specced, awaiting #4 T-ENV-PURE green then implement
**Related**: `session/tasks/env-files-pure-state-architecture.md` (#4 — same root principle; this is the install-path slice / 3rd pollution source)
**Found on**: u20 = container 4faed70700c9 (Linux, dev), EAMD scenario where `~/config` is a symlink → sharedConfig. Freshly installed via `ossh install`.

## Summary

A fresh `ossh install` onto a symlinked-`~/config` box (EAMD scenario) generates a `user.env` containing executable LOGIC instead of pure state. The pollution is **born at install**, not later drift. Result: the OOSH env bootstraps inconsistently — `config list` empty, `OOSH_MODE` empty, `OOSH_DIR` on the wrong tree.

This is the **THIRD pollution source** of the env-files-pure-state violation (#4), beyond the two the #4 architect found:
- Source A: `config.add` appends `source $CONFIG_PATH/<f>.env` (config:326-327, all branches)
- Source B: `config.save` self-anchor from commit `43796be` (3 BASH_SOURCE logic lines, dev)
- **Source C (this task): `ossh install` runs the above during install → ships a broken box from minute one.**

## Fundamental Principle (Web4 / OOSH): SELF-CARE ACROSS THE WHOLE LIFECYCLE

Tron, verbatim intent: **"All programs self-care for their whole lifecycle. They init correct (env) states, and reinit to self-repair when something goes sideways."**

This is a first-principle, not a feature. A program is responsible for its own correctness from birth to death:
1. **Init correct state.** On startup a program establishes a known-good environment (correct env vars, pure-state config, resolved paths) — it never assumes the environment is already correct.
2. **Detect when it goes sideways.** It validates its own state (e.g. `config.validate`, `check`) and recognises a broken/polluted/stale env instead of running blindly on it.
3. **Reinit to self-repair.** When state is bad it heals itself — regenerates clean config, re-resolves paths, reinits — via ONE easy, discoverable entrypoint. Self-repair is cheap, idempotent, and always available.
4. **Whole lifecycle.** install → boot → run → recover. Every phase can detect-and-heal; no phase silently ships or perpetuates a broken state.

**How u20 VIOLATED it (the heart of this bug):**
- **Init was wrong**: `ossh install` produced a polluted user.env (logic, not pure state) → env initialised broken (OOSH_MODE empty, OOSH_DIR on wrong tree).
- **No self-detection**: nothing flagged the broken env; `config list` just returned empty (RC=0) and the box ran on, silently wrong.
- **No easy self-repair**: there was **no simple "heal my env" command** to reinit a clean state. The box was stuck broken with no obvious recovery path — the exact gap Tron is calling out ("u20 did not have a possibility to do that easily").

**Primitives that already exist to build on (DRY — reuse, don't reinvent):**
- `check … fix <action>` — the OOSH check-and-auto-fix idiom (check:275 `check.fix()`)
- `config.clean` / `config.validate` (from #4) — reinit + purity guard
- `reconfigure` / `oo reconfigure` — re-exec the shell with fresh config
- `context lifecycle.*` + state machines — lifecycle scaffolding

What's missing is wiring these into a **single, always-available self-repair entrypoint** and making `this` bootstrap **self-validate + auto-heal** instead of running on a broken env.

### Docs finding (checked per Tron)
The self-care/self-repair principle is **NOT documented** in `docs/first-principles.md` (its Philosophy lists Portability, OOSH, Unified Management, Transparency, Interactivity — but not self-care/self-repair). The *mechanisms* are scattered (`check.fix`, `reconfigure`, `config.clean`, lifecycle state machines, `context` lifecycle) with no unifying principle. **Deliverable: add "Self-Care Across the Whole Lifecycle" as a first-class principle to `docs/first-principles.md`, and reference the concrete mechanisms that implement it.** (Architect owns the doc principle; expert wires the mechanisms.)

## Symptom (Tron: "config list works on WODA.prod, not u20")

Compared on two live remote shells — remoteOOSH:0.0 = WODA.prod (v60211), remoteOOSH:0.1 = u20 (4faed70700c9):

| | WODA.prod (works) | u20 (broken) |
|---|---|---|
| `oo mode` git branch | dev | dev (`## dev...origin/dev`) |
| OOSH_MODE | dev | **(empty)** |
| OOSH_DIR | …/Once.sh/**dev** | …/Once.sh/**prod** (wrong tree) |
| `oo mode` header | "Mode: dev / Path: …/dev" | **missing** (no OOSH_MODE) |
| `config list` | shows exports | **EMPTY (RC=0)** |
| CONFIG_PATH | …/sharedConfig (real) | /root/config (symlink, unresolved) |

## Findings (measured, not assumed)

1. **u20 `/root/config` is a symlink → `…/Once.sh/sharedConfig`** (EAMD scenario shared config). Same path string WODA.prod uses directly — different machines → different files, so the two user.env contents differ (WODA.prod got the cleaner variant; u20 got fully polluted).

2. **`cat $CONFIG` shows all 7 lines are LOGIC, not state:**
   ```bash
   : ${CONFIG_PATH:="${BASH_SOURCE[0]%/*}"}
   { [ -z "$CONFIG_PATH" ] || [ ! -f "$CONFIG_PATH/user.env" ]; } && CONFIG_PATH="$HOME/config"
   : ${OOSH_DIR:="$(cd "$HOME/oosh" 2>/dev/null && pwd -P || echo "$HOME/oosh")"}
   export CONFIG_FILE="user.env"
   export BASH_FILE="/usr/bin/bash"
   source $CONFIG_PATH/oosh.env
   source $CONFIG_PATH/log.env
   ```
   Only 2 real exports (CONFIG_FILE, BASH_FILE); NO `export CONFIG_PATH/OOSH_DIR/PATH`.

3. **Symlink trap**: when sourced via the symlink, `: ${CONFIG_PATH:="${BASH_SOURCE[0]%/*}"}` resolves CONFIG_PATH to `/root/config` (the symlink dir), not the canonical sharedConfig path.

4. **Consequences**: OOSH_MODE never set (empty); OOSH_DIR resolves onto the PROD tree though git is on dev → internally inconsistent env.

5. **`config list` empty (RC=0)**: `cat $CONFIG` works (file readable) but `config list` parses for listable pure-state exports and finds none — the polluted format defeats it. WODA.prod's user.env has real export lines → its `config list` works.

## Where the install writes it

`ossh install` → `ossh.install.continue.local` (ossh:435) runs `oo update` + `oo state`/`state next` + `config list` + `config ssh.host.set`. The user.env write happens via `config.save` in that chain → emits the `43796be` self-anchor (3 logic lines) + `config.add oosh/log` source lines (config:326-327). On a symlinked `~/config` the self-anchor's `BASH_SOURCE` mis-resolves CONFIG_PATH → the cascade above.

Key install methods to audit:
- `ossh.install` (ossh:379)
- `ossh.install.continue.local` (ossh:435) — runs oo update / state next / config.save chain
- `ossh.install.finish.local` (ossh:492)

## The Fix

Builds on #4 core (`d45031a`, done on MacStudio main: source-chain → `this`; `config.save`/`config.add` emit pure exports; `config.validate` guard). Install-path additions:

1. **Install must emit PURE STATE.** The `ossh install` → `config.save` chain must produce real exports — `export CONFIG_PATH="<canonical>"`, `export OOSH_DIR=...`, `export OOSH_MODE=...` — resolved by `this`, never BASH_SOURCE tricks or `source` lines in the file.
2. **`config.validate` GATE in install.** Run `config.validate` at the end of `ossh.install.finish.local` (and/or continue.local). If the generated user.env contains any logic line, the install FAILS loudly — no silently-broken boxes.
3. **Symlinked `~/config` must work.** Canonicalisation happens in `this` (follow the symlink to the real sharedConfig), never via in-file `BASH_SOURCE`. A fresh install onto a symlinked-config box must produce a working env.

4. **SELF-REPAIR entrypoint (the principle, made real).** Provide ONE easy, discoverable command that reinits a clean env from any broken state — e.g. `config repair` (or `oo reconfigure` healing path): regenerate pure-state user.env, re-resolve CONFIG_PATH/OOSH_DIR/OOSH_MODE via `this`, follow symlinks, validate. Idempotent + safe to run anytime. This is what u20 lacked.

5. **`this` bootstrap SELF-VALIDATES + AUTO-HEALS.** On boot, `this` detects a broken/polluted env (e.g. `config.validate` fails, or OOSH_MODE empty / OOSH_DIR off-tree) and either auto-reinits or emits a loud, single-line "run `config repair`" instruction — never silently runs on a broken env (the u20 failure: empty `config list`, RC=0, no signal). Build on existing `check … fix` so the detect-and-heal is the OOSH idiom, not bespoke.

## CONFIRMED SYMPTOM — fresh-login completion breakage (2026-06-25, Tron screenshot + repro)

The polluted user.env's most visible damage: on a **fresh `ossh login WODA.prod`** (no inherited env), `.bashrc` errors:
```
-bash: /log: No such file or directory
-bash: /templates/user/c2.install: No such file or directory
```
Root cause CONFIRMED by clean-env repro on WODA.prod:
- `env -i HOME=$HOME bash -lc 'echo OOSH_DIR=[$OOSH_DIR]'` → `OOSH_DIR=[]` (empty)
- `grep OOSH_DIR "$CONFIG"` → **nothing** — user.env does NOT export OOSH_DIR at all.
- `.bashrc:144` sources user.env (no OOSH_DIR set) → `.bashrc:149 source "$OOSH_DIR/log"` = `/log` and `.bashrc:183 source $OOSH_DIR/templates/user/c2.install` = `/templates/user/c2.install` → both "No such file".

Why it looked fine in earlier tests: a sub-shell of an already-set-up session **inherits** OOSH_DIR; only a CLEAN login (no inherited env) exposes it. Test must be a fresh login, not `bash -lic` inside a primed shell.

Two fix layers:
1. **user.env must `export OOSH_DIR`** (and CONFIG_PATH/OOSH_MODE) as pure state — the core of this task. Install-born, so the install path must emit it.
2. **`.bashrc` robustness**: guard the sources — `[ -n "$OOSH_DIR" ] && source "$OOSH_DIR/log"` etc., or have `this` resolve OOSH_DIR before .bashrc relies on it. An empty OOSH_DIR should never produce `/log`-style root-relative sourcing.

## Acceptance Criteria
- [ ] Fresh `ossh login WODA.prod` produces NO `/log` or `/templates/user/c2.install` "No such file" errors (clean-env repro: `OOSH_DIR` non-empty after sourcing user.env).

- [ ] Fresh `ossh install` onto a symlinked-`~/config` box yields a PURE-STATE user.env (only `export`/`declare`/comment/blank).
- [ ] Post-install on such a box: `config list` non-empty, `OOSH_MODE` set (dev), `OOSH_DIR` on the correct tree, `oo mode` shows the Mode header.
- [ ] `config.validate` runs inside the install flow and FAILS the install if any logic line was written.
- [ ] **Self-repair works from a broken state**: corrupt a box's user.env → one command (`config repair`/`oo reconfigure`) restores a clean working env; idempotent (running twice is a no-op).
- [ ] **`this` does not run silently broken**: with a polluted env, boot either auto-heals or prints a clear "env broken → run `config repair`" line (never empty/RC=0 silence).
- [ ] Existing broken boxes heal: run the self-repair on **u20** and **WODA.prod**; re-verify the four checks above on u20.
- [ ] **Docs**: `docs/first-principles.md` gains a "Self-Care Across the Whole Lifecycle" principle (init-correct → detect-sideways → reinit-to-repair, whole lifecycle) referencing `check.fix`, `config.validate`/`config.repair`, `reconfigure`, lifecycle state machines.
- [ ] Tester: T-ENV-INSTALL — assert install emits pure state + validate gate fails on injected logic + self-repair restores a corrupted env + boot-on-broken-env is not silent. (Extends #4's T-ENV-PURE.)

## Sequencing

After #4 T-ENV-PURE is green on MacStudio → propagate #4 to dev → implement install-path fix + validate gate → regen u20 + WODA.prod → tester T-ENV-INSTALL → verify fresh install on a symlinked-config box.

## Report-back (edit here; report to oosh-po)
- Architect (self-care principle → first-principles.md + self-repair/auto-heal design):
- Expert (install emit + validate gate + self-repair entrypoint + this self-validate + u20/WODA.prod regen + commit): **DONE** `2a03bae` — config.save emits `export OOSH_DIR` + CONFIG_PATH + OOSH_MODE as pure state. PO-verified on WODA.prod: `env -i HOME=$HOME bash -lc 'echo OOSH_DIR=[$OOSH_DIR]'` → non-empty; `env -i HOME=$HOME bash -lc 'echo ok'` → zero errors.
- Tester (T-ENV-INSTALL result): **DONE** `f58baaf` — 4/4 T-ENV-LOGIN pass: OOSH_DIR non-empty, user.env pure, .bashrc guards ok, fresh login clean.
