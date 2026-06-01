# Cross-Platform Hardcoded Paths Audit

**Date**: 2026-06-01
**Role**: oosh-expert
**Scope**: All OOSH scripts (42 files)
**Action**: Report only — NO fixes

---

## (1) `/tmp/` without `${TMPDIR:-/tmp}` fallback

Termux has no `/tmp/` — uses `$TMPDIR` (`/data/data/com.termux/files/usr/tmp`).

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| hiveMind | 794 | `local old_registry="/tmp/hivemind.roles"` | LOW (migration code, rarely hit) |
| hiveMind | 808 | `local old_sessions="/tmp/hivemind.sessions"` | LOW (migration code) |
| hiveMind | 3810 | `local pullDir="/tmp/hivemind.${host}"` | HIGH (team.pull stores here) |
| hiveMind | 8070 | `local pid_file="/tmp/resume-${addr}.pid"` | HIGH (deferred probe pidfile) |
| otmux | 2950 | `local pidFile="/tmp/otmux.pane.lock.…"` | HIGH (pane.lock won't work) |
| otmux | 2979 | `local pidFile="/tmp/otmux.pane.lock.…"` | HIGH (pane.unlock) |
| scrumMaster | 1841 | `echo "/tmp/scrumMaster.sub.$$.body"` | MEDIUM (fallback if mktemp fails) |
| tronMonitor | 141 | `captureFile="/tmp/tronMon.capture.$$"` | MEDIUM (verify temp file) |
| user | 9 | `OSSH_CONTROL_PATH:="/tmp/ossh-%r@%h:%p"` | HIGH (stale template — ossh itself already fixed to `${TMPDIR:-/tmp}/ossh-%C`) |

**Total: 9 hits across 5 scripts. 5 HIGH.**

---

## (2) `/dev/tty` hardcoded

iSH and some CI environments may not have `/dev/tty`. Termux does have it.

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| log | 14 | `device=/dev/tty` (log.device default) | HIGH (affects all logging) |
| log | 32 | `device=/dev/tty` (log.init default) | HIGH (duplicate default) |
| log | 337 | `export LOG_DEVICE=/dev/tty` (reset default) | MEDIUM |
| log | 443 | `warn.log "no color yet" >>/dev/tty` | LOW |
| debug | 174-180 | `>/dev/tty` (stackTrace output, 4 lines) | MEDIUM (debug-only) |
| debug | 239 | `>/dev/tty` (reconfig message) | LOW |

**Total: 8 hits across 2 scripts. 2 HIGH (log defaults).**

**Note:** The log system already falls back to `/dev/stderr` when `/dev/tty` write fails (lines 22, 40, 61). The issue is the DEFAULT — on a system without `/dev/tty`, the first write fails before the fallback kicks in.

---

## (3) `~/.ssh/id_rsa` assumed to be a file

On Termux, `~/.ssh/id_rsa` can be a **directory** (ossh creates it as a key storage dir).

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| oo | 825 | `ssh-keygen -t rsa -q -f "/root/.ssh/id_rsa"` | LOW (root-only install path) |
| oo | 833,839,845 | `IdentityFile ~/.ssh/id_rsa` (heredoc templates) | MEDIUM (config templates) |
| oo | 1054,1061 | `"$dir/developking/.ssh/id_rsa"` | LOW (cerulean-specific) |
| ossh | 170,175 | `local keyType="${RESULT:-id_rsa}"` (fallback key type) | MEDIUM (defaults to id_rsa when detection fails) |
| ossh | 1690 | `<privateKey:"$HOME/.ssh/id_rsa">` (usage text) | LOW (display only) |
| user | 193 | `rsync ... "/root/.ssh/id_rsa.pub"` | LOW (root-specific) |

**Total: 9 hits across 3 scripts. 2 MEDIUM.**

**Note:** BUG 1.1 fix (commit `1fd748a`) added `[ -d "$id" ]` guard to `ossh config.create`, but the `oo` templates and `user` script still assume file.

---

## (4) `/Users/` or `/root/` platform-specific prefixes

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| oo | 218 | `base="/Users/Shared/Workspaces/AI/Claude/components/OOSH"` | HIGH (macOS-only mode path) |
| oo | 825 | `"/root/.ssh/id_rsa"` | LOW (root install path) |
| oo | 922 | `"/root/config"` | LOW (root install path) |
| odocker | 14 | `ODOCKER_WORKSPACES:="/Users/Shared/…/DockerWorkspaces"` | HIGH (macOS default, env-overridable) |

**Total: 4 hits across 2 scripts. 2 HIGH.**

**Note:** `odocker` uses `: ${VAR:=default}` pattern — overridable via env. `oo:218` is not overridable.

---

## (5) `/opt/homebrew/` without PATH check

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| hiveMind | 3757 | `test -x /opt/homebrew/bin/tmux` | OK (guarded by `test -x`) |
| hiveMind | 3778,3783 | `export PATH=/opt/homebrew/bin:$PATH` (remote exec) | MEDIUM (assumes remote is macOS) |
| osx | 189 | `echo /usr/local/bin/bash >> /etc/shells` | LOW (osx-specific script, expected) |

**Total: 4 hits across 2 scripts. 1 MEDIUM.**

**Note:** hiveMind:3757 is properly guarded. The remote exec at 3778/3783 blindly prepends homebrew to PATH on remote — harmless on Linux (dir doesn't exist), but sloppy.

---

## (6) `/dev/stdout` and `/dev/stderr` without alternative

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| this | 14 | `export LOG_DEVICE=/dev/stdout` | HIGH (kernel default — iSH may not have /dev/stdout) |
| log | 22,40,61 | `export LOG_DEVICE=/dev/stderr` (fallback) | MEDIUM (fallback target also might not exist on iSH) |
| debug | 38-40,70,78,89,148,152,156 | `>/dev/stderr` (9 lines) | MEDIUM (debug-mode only) |

**Total: 13 hits across 3 scripts. 1 HIGH.**

**Note:** `/dev/stderr` and `/dev/stdout` are usually available even on minimal systems (they're fd links). iSH is the main risk platform.

---

## BONUS: `user` script has stale ControlPath

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| user | 9 | `: ${OSSH_CONTROL_PATH:="/tmp/ossh-%r@%h:%p"}` | HIGH |

This is the OLD template — `ossh` itself was fixed to `${TMPDIR:-/tmp}/ossh-%C` in BUG 4. The `user` script has its own copy that wasn't updated.

---

## Summary

| Category | Hits | HIGH | Scripts affected |
|----------|------|------|------------------|
| (1) /tmp/ hardcoded | 9 | 5 | hiveMind, otmux, scrumMaster, tronMonitor, user |
| (2) /dev/tty | 8 | 2 | log, debug |
| (3) id_rsa as file | 9 | 0 | oo, ossh, user |
| (4) /Users/ or /root/ | 4 | 2 | oo, odocker |
| (5) /opt/homebrew/ | 4 | 0 | hiveMind, osx |
| (6) /dev/stdout | 13 | 1 | this, log, debug |
| BONUS: stale ControlPath | 1 | 1 | user |
| **Total** | **48** | **11** | **10 scripts** |

## Recommended Fix Priority

1. **user:9** — 1-line fix, same as ossh BUG 4 (stale copy)
2. **hiveMind /tmp/** (3810, 8070) — `${TMPDIR:-/tmp}` wrapper, 2 lines
3. **otmux /tmp/** (2950, 2979) — same pattern, 2 lines
4. **this:14 + log:14,32** — LOG_DEVICE default should be `/dev/stderr` not `/dev/stdout` or `/dev/tty` (stderr always exists)
5. **oo:218** — hardcoded macOS base path needs `$OOSH_DIR`-relative or env-overridable
6. **tronMonitor, scrumMaster /tmp/** — `${TMPDIR:-/tmp}`, low-risk
