# Task: Run test suites on Termux — cross-platform validation

**Priority**: HIGH
**Date**: 2026-06-01
**Assigned**: oosh-tester
**Platform**: samsungTablet (Termux/Android) via ooshTeam:0.5

## Steps

1. `oo update` on Termux to pull latest dev branch
2. Run `test.suite run oo 1` — report pass/fail
3. Run `test.suite run ossh 1` — report pass/fail
4. Run `test.suite run config 1` — report pass/fail
5. Run `test.suite run log 1` — report pass/fail

## For each failure

Categorize:
- **Platform-specific** (Termux only) — fix with `os.check` routing or `${TMPDIR:-/tmp}` pattern
- **Platform-independent** (bug on all platforms) — fix the code directly
- **Pre-existing** (also fails on macOS) — note but don't fix

## Fix patterns

- `/tmp/` → `${TMPDIR:-/tmp}/`
- `/dev/tty` → check availability, fallback to `/dev/stderr`
- `stat -f %m` (macOS) → `stat -c %Y` (Linux/Termux) — use `os.check` dispatch
- `sed -i ''` (macOS) → `sed -i` (Linux) — use OOSH `oo.sed.i` helper
- Missing commands → `command -v` guard + fallback

## Results

(tester fills in per suite)

| Suite | macOS result | Termux result | New platform failures |
|-------|-------------|---------------|----------------------|
| oo | 63/65 | | |
| ossh | 103/108 | | |
| config | | | |
| log | | | |
