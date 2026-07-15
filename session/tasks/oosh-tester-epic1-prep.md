# oosh-tester — Epic 1 (opy) test PREP — READY

**Agent**: oosh-tester (ooshTeam:0.3, host 13mi-MDonges)
**For**: opy1 / architect · Sprint-1 Epic-1
**Status**: READY — prepped, standing by. NOT started (holding for opy handoff from oosh-expert @ ooshTeam:0.2).

## Prep done
- Read spec `web4x/osemvec/scrum.pmo/sprints/sprint-1/task-1.opy.md` + `planning.md`.
- Studied test.suite API (`test.case`/`expect`/`expect.pass`/`create.result`) from `test/test.config` + `templates/code/new_script_test`; confirmed `*` wildcard + `TEST_CASE_SKIPPED` skip semantics from `test.suite` source.
- Drafted skeleton: **`scratchpad/test.opy.draft`** — one test.case+expect per method
  (start, deps, install, version, version.set, version.list, venv.create, venv.list,
  venv.remove, remove, update, usage) + checklist (missing-required→usage,
  optional-defaults-silently, completion stubs, human-readable errors, no --flag).
  Skip-guard on env-dependent cases.

## Environment measured (skip-guard calibration on THIS box)
- pyenv 2.8.0 @ `~/.pyenv`; **PYENV_ROOT unset** → `private.opy.pyenv` MUST export it.
- Installed pyenv version: **3.14.6** (one) → version/version.list/deps/venv.* run REAL, not skipped.
- `python3` on PATH = system 3.8.10 (confirms "never trust python3").
- Guarded (not run in CI): install of a NEW version, remove (destructive), update (rebuild).

## On handoff (my Do plan)
1. Drop draft → `/home/mdonges/oosh/test/test.opy`, align method/param names to the real script signatures.
2. `test.suite run opy 1` (NO output filtering).
3. Report pass/fail counts + any DoD gaps to opy1.

Reply channel: opy1 @ opy:0.0.

## MEASURED: opy1 already authored + committed opy AND test.opy (commit ab2dfad, branch test/mcdonges.latest)
- `opy` = 294 lines; `test/test.opy` = 179 lines. opy1 is running the gate itself on opy:0.4 (clean tty).
- So handoff = I REVIEW opy1's test.opy + RUN it, NOT clobber. My draft = source for the missing cases below.

## Review of opy1's test.opy vs mandatory checklist (gaps to PROPOSE, not fix myself)
opy1 covers well: venvHome/pyenvRoot purity, missing-required→usage (venv.create/version.set/install/remove),
venv.remove non-venv SAFETY (T5, nice), venv.remove missing→err, venv.list empty, and skip-guarded
version.list/version/install-completion/venv-lifecycle. Skip-guard keys on `private.opy.ensurePyenv` — on THIS
box pyenv resolves (3.14.6) so T8–T11 RUN for real (incl. a real `python -m venv` build).

GAPS (public methods / DoD items with NO coverage):
1. **opy.deps** — untested (public `opy.deps <?version>`; module-probe fan-out). Add: default-arg no-crash.
2. **opy.update** — untested (public `opy.update <version>`). Add: missing-required→usage (real rebuild skip-guarded).
3. **opy.start** — untested self-healing constructor. Spec: "start==repair, idempotent, never RC=0 on broken". Add T1/T1b.
4. **opy.usage / this.help visibility** — DoD item, untested. Add: all methods appear in this.help w/ doc-comment.
5. **no --flag signature scan** — design-defect check, untested. Add grep scan of `opy`.
6. **completion-stub existence** — only install.completion.version output tested; existence of version.set/remove/
   update/venv.create/venv.remove.name completion stubs unverified. Add grep-for-stub check.
7. **human-readable error CONTENT** — T6 asserts RC only (create.result 0 "no such" = own label, not opy's text).
   Tighten to grep opy's actual error string for a human sentence.

My draft (`scratchpad/test.opy.draft`) already encodes cases for gaps 1–7 → ready to graft on approval.
STATUS: still HOLD (not running the suite). READY msgs queued behind opy1's active turn — will land when it yields.
