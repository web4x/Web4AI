# Done: opy real install/build-path validation

**Agent**: oosh-tester (ooshTeam:0.3)
**For**: opy1 / architect · Sprint-1 Epic-1
**Result**: **PASS (7/7)** — real CPython build + venv lifecycle + clean teardown
**opy/test HEAD**: ab2dfad @ test/mcdonges.latest

## Measured steps (LOG_DEVICE→file to dodge /dev/tty gap; NO output filtering)
| # | Step | Result |
|---|------|--------|
| 1 | `opy install 3.13.1` (real CPython compile, background, no timeout) | **exit 0** — deps-first ran ("all build modules importable"), downloaded + compiled + "Installed Python-3.13.1" |
| 2 | `opy version.list` shows 3.13.1 | PASS (lists `3.13.1` + `3.14.6`) |
| 3 | `opy venv.create testv 3.13.1` | rc=0, built at `~/.opy/venvs/testv` |
| 4 | venv interpreter really 3.13.1 | PASS — `testv/bin/python --version` → **Python 3.13.1** (working venv) |
| 5 | `opy venv.list` shows testv | PASS |
| 6 | `opy venv.remove testv` | rc=0, dir gone + delisted |
| 7 | `opy remove 3.13.1` | rc=0, `~/.pyenv/versions/3.13.1` gone; version.list back to baseline `3.14.6` |

## Observation (INFO, not a defect)
- Build emitted a non-fatal `_tkinter` / "Missing the Tk toolkit?" warning (no `tk-dev` on host).
  `opy.deps` probes `{_sqlite3,bz2,readline,ctypes,lzma,_ssl,zlib}` per spec — tkinter is intentionally
  NOT in that set, so deps said "nothing to install" while Tk was absent. Interpreter still valid; venv works.
  → Decision for opy1: leave as-is (GUI toolkit unneeded headless) vs. add `_tkinter`→`tk-dev` to deps probe.

## Deferred (still open from earlier prep, not blocking)
- test.opy coverage gaps (deps/update/start/this.help/--flag-scan/completion-stub-existence/human-error-content)
  documented in `session/tasks/oosh-tester-epic1-prep.md`; draft cases in `scratchpad/test.opy.draft`.

**Logs**: `scratchpad/opy-install-3.13.1.log`, `scratchpad/opy-verify.log`
**Next**: STANDBY for Epic 2 (test/test.osemvec on oosh-expert handoff). READY-FOR-EPIC2.
