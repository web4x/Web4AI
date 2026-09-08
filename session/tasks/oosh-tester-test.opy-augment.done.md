# Done: test.opy augmented — deps/install-guard/update/start/this.help

**Agent**: oosh-tester (ooshTeam:0.3) · **For**: opy1 · Sprint-1 Epic-1
**Result**: **GREEN 22/22** · **Commit**: bd84d0b @ test/mcdonges.latest
**Run**: `test.suite run opy 1` (log level 1, NO output filtering) → 22/22 assertions, 0 fail, exit 0. Clean teardown (baseline 3.14.6 only, no leftover venvs/temp).

## New cases (all non-mutating — no apt, no CPython recompile)
- **T12 deps** — all-importable probe branch → RC0 + "nothing to install". Double-guarded: only runs when the active interpreter imports every probed module, so it can NEVER fall into the `pkgInstall`/apt path.
- **T13 install guard** — `opy.install <present-version>` hits `private.opy.isInstalled` → no-op RC0, no rebuild.
- **T14 update** — required-param usage (T14a) + **structural** delegation-to-`opy.install` verified by source inspection (T14b). Real uninstall+recompile never executes.
- **T15 start** — constructor self-heal contract via `private.opy.ensurePyenv`: RC0 + idempotent on healthy host; fail-loud/never-RC0 when pyenv broken (branches on PYENV_OK).
- **T16 this.help** — every public method present in the METHOD table (ANSI-stripped, dot-escaped exact-column match).

## Test-bug caught + fixed during the run (honesty note)
First run FAILed T12: `opy deps` returned RC0 but my capture was empty — `console.log` writes to `LOG_DEVICE`, and I'd set it to `/dev/null` (`2>&1` doesn't catch the log-device fd). Fixed by capturing via a real `LOG_DEVICE` file. opy itself was correct; the defect was in my test.

## Notes
- Left pre-existing unrelated working-tree changes to `claudeCode` + `hiveMind` UNTOUCHED (not mine).
- **Next**: STANDBY for Epic-2 → `test/test.osemvec` on oosh-expert handoff (skip-guard semvec/venv/spawn; spawn/guard tests DRY-RUN only, no live claudeCode).
