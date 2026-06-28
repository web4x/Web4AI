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

## Report-back (edit here; report to oosh-po)
- Expert (HOME guard + user.env regen + commit):
- Tester (clean-boot verification on WODA.prod + u20):
