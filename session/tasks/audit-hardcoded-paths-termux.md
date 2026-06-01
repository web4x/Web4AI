# Audit: Hardcoded paths that break on Termux

**Date**: 2026-06-01
**Reporter**: oosh-tester (PO directive)
**Type**: Cross-platform audit, not fix

Termux has no `/tmp/` (uses `$TMPDIR`), no `/dev/tty` (uses `/dev/pts/N`).

## `/tmp/` hardcoded — 27 occurrences across 7 scripts

| Script | Lines | Usage | Risk |
|--------|-------|-------|------|
| **hiveMind** | 794, 808 | migration from old `/tmp/hivemind.*` registry | LOW — one-time compat, fails silently |
| **hiveMind** | 1072 | defer-probe pidfile `/tmp/hivemind.deferred.*.pid` | HIGH — deferred probe won't work |
| **hiveMind** | 1378, 1425, 1440, 3910, 4016 | `ls /tmp/hivemind.*/` for team.pull dirs | MEDIUM — completion returns nothing |
| **hiveMind** | 3810 | `pullDir="/tmp/hivemind.${host}"` | HIGH — team.pull creates dir in nonexistent /tmp |
| **hiveMind** | 8070 | resume pidfile `/tmp/resume-*.pid` | MEDIUM |
| **hiveMind** | 8859-8861 | watchdog pid/log/heartbeat `/tmp/hivemind.watchdog.*` | HIGH — watchdog won't start |
| **otmux** | 2950, 2979 | pane.lock pidfile `/tmp/otmux.pane.lock.*.pid` | HIGH — pane.lock enforcer won't work |
| **scrumMaster** | 1841 | tmpBody fallback `/tmp/scrumMaster.sub.$$.body` | LOW — mktemp tried first |
| **tronMonitor** | 141 | captureFile `/tmp/tronMon.capture.$$` | HIGH — capture fails |
| **user** | 9 | `OSSH_CONTROL_PATH="/tmp/ossh-..."` | HIGH — already fixed by BUG 4 (uses $TMPDIR) |
| **restore/user** | 9 | same as user (backup copy) | HIGH |
| **restore/ossh** | 9 | same pattern | HIGH |
| **restore/hiveMind** | 96, 2087-2089 | old copies of hiveMind patterns | — |
| **replace** | 33 | comment only (example) | NONE |

**Fix pattern**: Replace `/tmp/` with `${TMPDIR:-/tmp}` in all 27 occurrences. The `TMPDIR` env var is set on Termux (`$PREFIX/tmp`) and on macOS/Linux (usually `/tmp`).

## `/dev/tty` hardcoded — 8 occurrences across 3 scripts

| Script | Lines | Usage | Risk |
|--------|-------|-------|------|
| **log** | 14, 32, 337, 443 | `LOG_DEVICE=/dev/tty` | HIGH — logging breaks if no /dev/tty |
| **debug** | 174, 177-178, 180, 239 | stack trace output `>/dev/tty` | MEDIUM — debugger won't show traces |
| **this** | 15 | commented out `#export LOG_DEVICE=/dev/tty` | NONE |

**Note**: `/dev/tty` usually works on Termux (it's a pseudo-terminal), but may fail in non-interactive contexts (cron, background subshells). `/dev/stderr` is safer.

## `/dev/stdout` — 1 occurrence

| Script | Line | Usage | Risk |
|--------|------|-------|------|
| **this** | 14 | `LOG_DEVICE=/dev/stdout` | LOW — works on Termux |

## `/dev/stderr` — 7 occurrences

All in `debug` and `log` — these are correct and work on Termux.

## Summary

| Path | Occurrences | HIGH risk | Fix |
|------|------------|-----------|-----|
| `/tmp/` | 27 | 10 | `${TMPDIR:-/tmp}` |
| `/dev/tty` | 8 | 4 | Consider `/dev/stderr` fallback |
| `/dev/stdout` | 1 | 0 | OK |
| `/dev/stderr` | 7 | 0 | OK (correct) |

**Recommendation**: Bulk `${TMPDIR:-/tmp}` replacement is safe and mechanical. The `/dev/tty` cases need case-by-case review (some intentionally target the terminal, not just any output).
