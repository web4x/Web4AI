# BUG: fresh `ossh install` produces a polluted (logic-laden) user.env

**From**: oosh-po (Tron-directed investigation 2026-06-24)
**Owners**: oosh-expert (fix) → oosh-tester (verify). Architect consult if install-flow redesign needed.
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

## Acceptance Criteria

- [ ] Fresh `ossh install` onto a symlinked-`~/config` box yields a PURE-STATE user.env (only `export`/`declare`/comment/blank).
- [ ] Post-install on such a box: `config list` non-empty, `OOSH_MODE` set (dev), `OOSH_DIR` on the correct tree, `oo mode` shows the Mode header.
- [ ] `config.validate` runs inside the install flow and FAILS the install if any logic line was written.
- [ ] Existing broken boxes heal: regenerate clean `user.env` on **u20** and **WODA.prod**; re-verify the four checks above on u20.
- [ ] Tester: T-ENV-INSTALL — assert install-path emits pure state + the validate gate fails on injected logic. (Extends #4's T-ENV-PURE.)

## Sequencing

After #4 T-ENV-PURE is green on MacStudio → propagate #4 to dev → implement install-path fix + validate gate → regen u20 + WODA.prod → tester T-ENV-INSTALL → verify fresh install on a symlinked-config box.

## Report-back (edit here; report to oosh-po)
- Expert (install-path fix + validate gate + u20/WODA.prod regen + commit):
- Tester (T-ENV-INSTALL result):
