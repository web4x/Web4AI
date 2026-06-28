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

**Fix**: guard the source:
```bash
[ -n "$HOME" ] && [ -f "$HOME/.local/bin/env" ] && . "$HOME/.local/bin/env"
```
Or resolve HOME first: `HOME="${HOME:-$(eval echo ~$(id -un))}"` before the source line.

**Self-care principle violation**: the bootstrap doesn't validate that `$HOME` is set before using it in a path. A self-healing boot would detect the missing `$HOME` and either resolve it or skip gracefully — never try to source a path rooted at `/`.

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

## Acceptance Criteria
- [ ] `env -i sh && bash` on WODA.prod: zero errors, clean OOSH prompt, `$HOME/.local/bin/env` either sourced (if HOME resolved) or skipped gracefully (no error)
- [ ] `config list` on WODA.prod shows NO source lines — only pure exports
- [ ] `config validate` passes on WODA.prod user.env
- [ ] Same verified on u20
- [ ] `.bashrc` HOME guard committed

## Report-back (edit here; report to oosh-po)
- Expert (HOME guard + user.env regen + commit):
- Tester (clean-boot verification on WODA.prod + u20):
