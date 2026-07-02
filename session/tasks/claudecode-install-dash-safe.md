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

## Acceptance (PO QA gate — I inspect the diff)
- [ ] Dash failure reproduced + root-caused (real invocation named)
- [ ] Bashism inventory complete for the reachable install path
- [ ] Install path runs clean under sh/dash on WODA.test; bash behavior unchanged
- [ ] T-DASH-SAFE GREEN (parse + live), committed
- [ ] Zero OOSH-principle regression

## Rules
OOSH wrappers only; no output filtering; measure live on WODA.test; task file = channel, chat = one-line nudge; report-back = commit + push here.
