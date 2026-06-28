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

## Report-back (edit here; report to oosh-po)
- Expert (HOME guard + user.env regen + commit):
- Tester (clean-boot verification on WODA.prod + u20):
