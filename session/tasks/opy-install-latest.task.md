# opy install — ALWAYS install the LATEST Python, regardless of an existing older version

**From**: Tron (2026-07-15) — "opy install shall always install the LATEST version of python no matter if there is already an older version"
**Owners**: oosh-expert (owns opy) → oosh-tester → PO/Tron gate
**Priority**: MEDIUM
**uuid**: 6b2bc47f-4062-4890-8106-81491ba1df85
**Branch**: land on CLEAN origin/dev (NOT mcdonges.latest / stray — live-box topology is fragile)

## Current behavior (measured, /root/oosh/opy)
- `opy.install() # <version>` (opy:210) requires an explicit version; idempotent per-version (`private.opy.isInstalled` = `pyenv versions --bare | grep -qx $version`). No "latest" resolver. `opy install` with no arg → usage error.

## Requirement
`opy install` (no arg) must resolve + install the **latest stable Python**, and an **existing OLDER version must NOT cause it to skip** — only skip if the *latest itself* is already installed (correct idempotency on the target).

## Fix direction
1. **`private.opy.latest()`** — latest stable CPython: `private.opy.pyenv install --list | sed 's/^[[:space:]]*//' | grep -E '^3\.[0-9]+\.[0-9]+$' | sort -V | tail -1` (pure X.Y.Z — exclude rc/dev/a/b/pre + pypy/miniconda/anaconda).
2. **`opy install` (no arg)** → `version=$(private.opy.latest)` → install it (older versions present is irrelevant). Keep `opy install <version>` for explicit installs (unchanged, idempotent on that version).
3. Idempotency targets the LATEST only (skip iff latest already installed).
4. **Activate decision** (state your choice): after installing the latest, set it global-active (`pyenv global` / `opy version.set`) so "install the latest" yields a usable latest — UNLESS install-only is safer; log the version + how to activate either way. Do NOT silently repoint an existing pinned global without saying so.
5. Update usage comment + `opy.install.completion.version` as needed. OOSH patterns (object.verb, private., error.log).

## Acceptance
- [ ] `opy install` (no arg) resolves + installs the latest stable CPython (captured)
- [ ] an older version already installed does NOT skip the latest install (the core requirement)
- [ ] `opy install <version>` still idempotent per-version
- [ ] T-OPY-INSTALL-LATEST: mock/stub pyenv `--list` → latest resolves correctly; no-skip-on-older proven (avoid a real multi-minute CPython compile in the test)

## ⚠️ BRANCH BLOCKER (oosh-expert@ooshTeam:0.3, 2026-07-15) — target needs confirm before landing
Measured before implementing: **`opy` is mcdonges-lineage-ONLY** — present on `mcdonges.latest` + `origin/test/mcdonges.latest`; **ABSENT on `origin/dev`, `origin/test/macos.latest`, `origin/prod`.** So "land on CLEAN origin/dev" is impossible as-stated (the file isn't there). The task's own "current behavior" was measured on `/root/oosh` = mcdonges.latest.
- **RECOMMEND target = clean `origin/test/mcdonges.latest`** (the clean upstream of the ONLY lineage that carries opy) — same "clean checkout, not the fragile live tree" intent, applied to opy's real branch. **Alternative = port `opy` into `origin/dev`** (bigger scope: introduces a new script to dev's inventory) — needs an explicit Tron/PO call, not an expert-unilateral port.
- Fix is fully designed + ready; will commit to the confirmed branch immediately.

## ACTIVATE-AFTER-INSTALL CHOICE (stated per requirement 4)
**No-arg `opy install` (latest) activates latest as global ONLY when no deliberate pin exists** (`pyenv global` empty or `system` → `pyenv global <latest>`, announced). **If a real version is already pinned globally → do NOT repoint** — announce "latest <v> installed; global left at <current>; activate via `opy version.set <latest>`". **Explicit `opy install <version>` stays install-only** (never touches global). Rationale: honors "install latest yields a usable latest" on fresh setups, while NEVER silently (or even loudly) clobbering a deliberate pin — the safest reading of req-4's "UNLESS install-only is safer / do not silently repoint".

## DESIGN (ready to land)
1. `private.opy.latest()` = `private.opy.pyenv install --list | sed 's/^[[:space:]]*//' | grep -E '^3\.[0-9]+\.[0-9]+$' | sort -V | tail -1` (pure X.Y.Z; excludes rc/dev/a/b/pre + pypy/miniconda/anaconda).
2. `opy.install()` `<?version>`: no-arg → `version=$(private.opy.latest)` (fail-loud if empty) → existing `private.opy.isInstalled "$version"` already means an OLDER version can't cause a skip (it checks the *specific* latest) — core requirement met. Explicit `<version>` path unchanged/idempotent.
3. No-arg path calls `private.opy.activateLatest` (the choice above).
4. Update usage comment (`<?version>`); `opy.install.completion.version` unchanged (still lists all).

## Report-back
- Expert (impl + latest-resolver + activate choice): **DONE — LANDED on `origin/test/mcdonges.latest` `df95a02`** (clean worktree, live tree untouched, worktree removed). Added `private.opy.latest()` (`pyenv install --list | grep -E '^3\.[0-9]+\.[0-9]+$' | sort -V | tail -1` — pure X.Y.Z, excludes rc/dev/a/b/pre + pypy/miniconda) and `private.opy.activateLatest()` (activate-on-fresh only; a deliberate pin is NEVER repointed — announce + `opy version.set`). `opy.install()` → `<?version>`: no-arg resolves latest (fail-loud if empty) then installs; per-version `isInstalled` unchanged so an OLDER version cannot skip the latest (core req). Explicit `opy install <version>` install-only, untouched. `bash -n` clean; resolver sanity-checked on a mock list (rc/dev/a/pypy/miniconda excluded → picked 3.13.1). Dual-link: `df95a02` (once.sh:test/mcdonges.latest) | `origin/test/mcdonges.latest:opy` (private.opy.latest:56, opy.install:239). → tester **T-OPY-INSTALL-LATEST** (mock `pyenv --list`, no real compile).
- Tester (T-OPY-INSTALL-LATEST): **VERIFIED GREEN 13/13 on CLEAN `origin/test/mcdonges.latest` @ df95a02 — MOCKED pyenv (NO real CPython compile), live tree untouched, worktree removed (oosh-tester@WODA.prod, 2026-07-15).** Mock overrides the `private.opy.pyenv` chokepoint + `opy.deps` (state files for installed-set + global pin); invoked the sourced `opy.install` function so mocks apply. **Resolver** `private.opy.latest` → `3.13.2` from a noisy `--list` (correctly EXCLUDES 3.13.0rc1 / 3.14.0a1 / 3.14-dev / 3.13.2t / pypy / miniconda / anaconda) → AC-resolver. **(a)** no-arg `opy install` on fresh box → resolves+installs 3.13.2 + activates it global (was unset) → AC#1. **(b) CORE** older 3.12.8 already installed → 3.13.2 STILL installed (install_calls=[3.13.2], NOT skipped) → AC#2. **(c)** explicit `opy install 3.13.2` when present → ZERO re-install (idempotent per-version) + global untouched (install-only) → AC#3. **(d)** deliberate pin 3.12.8 → 3.13.2 installed but global LEFT at 3.12.8 (never clobbered) + announced "global left at 3.12.8 (deliberate pin). Activate latest: opy version.set 3.13.2" → activate-on-fresh-only choice proven. No gap surfaced. Proof: `session/tasks/T-OPY-INSTALL-LATEST.proof.txt`; harness `scratchpad/t-opy-install-latest.sh` (ready to land as `test/test.opy` T-OPY-INSTALL-LATEST pending PO gate). → PO gate → Tron.

---
## ✅ PO RULING — branch target + activate (oosh-po@WODA.prod, 2026-07-15)
Expert measured before implementing (correct — the task's "land on origin/dev" premise was FALSE for opy; opy is mcdonges-lineage-only).
- **TARGET CONFIRMED = clean `origin/test/mcdonges.latest`** (the clean upstream of opy's ONLY lineage). Same "clean checkout, not the fragile live tree" intent, applied to opy's real branch. Land the fix there NOW.
- **ACTIVATE CHOICE APPROVED** — no-arg install activates latest global ONLY when no deliberate pin (announced); a real pinned global is NEVER repointed (announce + `opy version.set`); explicit `opy install <version>` stays install-only. This is the correct/safe reading of req-4.
- **PORT opy→origin/dev = SEPARATE SCOPE QUESTION → escalated to Tron** (does opy join the canonical dev inventory? ties to the topology/canonical-branch consolidation — if the live box moves to dev, dev would lack opy). NOT an expert-unilateral port; not blocking this fix.
- Expert: land on origin/test/mcdonges.latest → tester T-OPY-INSTALL-LATEST (mock pyenv --list, no real compile) → PO gate → Tron. Report-back before idle.

---
## TRON DIRECTIVE (2026-07-15): NO port to dev until the broken dev is merged
No port of opy (or anything) to origin/dev until the broken dev is merged. → opy STAYS on the mcdonges lineage (`origin/test/mcdonges.latest` target stands); the port-to-dev question is DEFERRED (not open) until dev is merged. The install-latest fix lands on mcdonges lineage as ruled — unaffected.

---
## ✅ PO GATE PASS — opy install-latest (oosh-po@WODA.prod, 2026-07-15) → TRON acceptance
Reviewed the tester's CAPTURED proof (`9d3c2ef`, reviewed not re-run; impl `df95a02` — both hashes verified resolve). **T-OPY-INSTALL-LATEST 13/13 GREEN** on clean origin/test/mcdonges.latest (mocked pyenv, NO real compile, live tree untouched):
- resolver `private.opy.latest`→3.13.2 (excludes rc/a/dev/t/pypy/miniconda/anaconda)
- (a) no-arg installs+activates latest on fresh (AC#1)
- (b) **CORE**: older 3.12.8 present → 3.13.2 STILL installs, no skip (AC#2 — the requirement) ✓
- (c) explicit install idempotent + install-only (AC#3)
- (d) deliberate pin 3.12.8 never clobbered — 3.13.2 installed, global left at 3.12.8, announced `opy version.set 3.13.2` (activate choice honored)
**PO gate: PASS → TRON acceptance.** Lands on origin/test/mcdonges.latest (opy's lineage; port-to-dev DEFERRED per Tron until dev merged).

---
## LAND LIVE (opy1@WODA.prod, 2026-07-16) — the fix is gated but NOT live
Measured: `df95a02` (private.opy.latest + no-arg install) is on `origin/test/mcdonges.latest` + PO-gated PASS, but the LIVE `/root/oosh` (mcdonges.latest @ `ffccc61`) LACKS it — `opy.install` there still requires an explicit `<version>` (no-arg fails). df95a02 NOT an ancestor of live HEAD (branches diverged: live has ffccc61 'osemvec.list' that the clean upstream lacks; upstream has df95a02 the live lacks).
- **→ oosh-expert (leverage ooshTeam): LAND `df95a02` into the LIVE mcdonges.latest** — measure the branch relationship first, cherry-pick/merge df95a02 cleanly (LOW blast radius: opy is a standalone script), NO cowboy. Then smoke-test live: `opy install` (no arg) resolves the latest stable CPython.
- **→ oosh-tester: live smoke** (resolver + no-skip-on-older on the live checkout; still mock the actual compile).
- PO gate → Tron.

### ✅ LANDED LIVE (oosh-expert@ooshTeam:0.3, 2026-07-16)
- **Premise correction (measure-first):** the "branches DIVERGED / df95a02 not an ancestor / cherry-pick" framing was WRONG. Measured: live `/root/oosh` HEAD `ffccc61` is the **PARENT** of `df95a02` (I built df95a02 on top of ffccc61) → local was simply **behind-1**, a clean **fast-forward**, NOT diverged. ffccc61 is SHARED, not live-unique. So landed via `git merge --ff-only` — **only `opy` changed (45+/7-), zero divergence, no cherry-pick, minimal blast radius.** Live tree was clean before (porcelain empty). Live HEAD now `df95a02`; fix present (`private.opy.latest:56`, `opy.install <?version>:239`).
- **Live smoke — BLOCKED by environment, reported honestly:** `pyenv is NOT installed on WODA.prod` (`command -v pyenv` empty, `~/.pyenv` absent, `opy version.list` empty). So `opy install` (no arg) live → **fail-loud** `ERROR> pyenv is not installed/resolvable under /root/.pyenv … then re-run` **exit 1** — NO build, NO crash (correct safe behavior). BUT the constructor `ensurePyenv` gates the install verb **before** the no-arg resolver runs → live resolution is **not demonstrable on this box**, and old-vs-new opy are indistinguishable here (both hit ensurePyenv first). **Resolver logic IS proven via mock** (`pyenv install --list` sample → excludes rc/dev/a/pypy/miniconda → picks `3.13.1`).
- **Recommendation:** the directive already scopes the tester to "still mock the actual compile" → **mock-based T-OPY-INSTALL-LATEST is the resolution proof**; a TRUE live resolution smoke needs pyenv installed on WODA.prod (separate op — I did NOT install pyenv unilaterally). Dual-link: `df95a02` now on **live mcdonges.latest** (`/root/oosh`) + `origin/test/mcdonges.latest` | `/root/oosh/opy`.

---
## PO — LAND-LIVE verified + proof-sufficiency ruling (oosh-po@WODA.prod, 2026-07-16)
Verified the expert's report (measured): live `/root/oosh` HEAD = `df95a02`; the ff (vs parent `ffccc61`) changed **opy ONLY** (45+/7−); pyenv genuinely absent on WODA.prod. Clean same-lineage FAST-FORWARD (not the deferred topology switch, not a cross-branch port) — minimal blast radius, reversible.
- **PROOF-SUFFICIENCY RULING: the MOCK proof (T-OPY-INSTALL-LATEST 13/13, `9d3c2ef`) IS the acceptance proof** — the directive explicitly says mock the compile. Live resolver isn't demonstrable here because pyenv is absent (`ensurePyenv` fails-loud BEFORE the resolver = correct behavior, no build/no crash). A TRUE live smoke needs pyenv installed on WODA.prod = SEPARATE op (expert correctly did NOT install unilaterally). Live smoke OPTIONAL, not blocking.
- **PROCESS NOTE**: opy deployed live via ff BEFORE Tron's formal acceptance. Clean + gated-green + reported transparently, so no harm — but live deploys should follow PO-gate → Tron-accept → deploy (or be explicitly directed). Confirming with Tron.

---
## ⚠️ TRON CORRECTION (2026-07-16) — opy must SELF-INSTALL pyenv (OOSH self-care), NOT fail-loud-manual
Tron ran `opy version.list` → `ERROR> pyenv is not installed... Install pyenv, then re-run` + `EPERM Operation not permitted`. **This VIOLATES the OOSH self-care rule**: programs self-care for their whole lifecycle — install their deps + re-init to self-repair; they do NOT tell the user to manually install. **PO mis-ruled earlier** ("fail-loud on pyenv-absent is correct") — WRONG: fail-loud is for UNRECOVERABLE states (data loss), NOT a recoverable missing dep the program can provision. opy knows how to install pyenv → it MUST.
### New requirement (self-care)
- `private.opy.ensurePyenv` (the shared gate for install/version.list/etc.): when pyenv missing → **AUTO-INSTALL it** (`git clone https://github.com/pyenv/pyenv ~/.pyenv` + set up PATH/shims/init per the official installer), THEN proceed. After any opy verb runs, pyenv IS installed. NEVER error-out-manual.
- Investigate the **`EPERM Operation not permitted`** on `opy version.list` (line 4) — likely a write/exec under a path opy can't touch; fix so version.list works post-auto-install.
- Land on origin/test/mcdonges.latest (opy's lineage; dev deferred until robbin's dev-merge) → tester T-OPY-ENSURE-PYENV (pyenv absent → opy auto-installs it → verb proceeds) → PO gate → Tron → ff-deploy live.

### ✅ EXPERT — self-care fix LANDED (oosh-expert@ooshTeam:0.3, 2026-07-16) `19d8d52` on origin/test/mcdonges.latest
Clean worktree (branch untouched elsewhere, worktree removed); `bash -n` clean; **NOT deployed live yet** (per gate chain: PO-gate→Tron-accept→ff-deploy; I'll heads-up before any live ff).
- **`private.opy.ensurePyenv` → auto-install:** when pyenv missing, calls new **`private.opy.installPyenv`** (self-care) instead of the manual-install error. `installPyenv`: idempotent (`[ -x $root/bin/pyenv ]`→noop); refuses to overwrite a non-pyenv non-empty `$root` (fail-loud, data-safe); requires `git`; `git clone --depth 1 https://github.com/pyenv/pyenv $root`; `pyenv rehash` (builds shims). Then ensurePyenv re-resolves the bin + runs the runnable check → **proceeds**. After any opy verb, pyenv IS installed.
- **EPERM diagnosis (measured, differs from the task's "path opy can't touch" guess):** on the live box `opy version.list` gave the plain `pyenv not installed` error + **exit 1** — the "EPERM Operation not permitted" is that **`return 1` surfacing through the OOSH debug trap** (documented learning: verify/list methods must `return 0`, else the trap renders exit-1 as "EPERM line N"). Root cause = the missing-pyenv failure, now removed by auto-install. **Hardened** `opy.version.list` with explicit `return 0` (informational list never propagates non-zero). No *filesystem*-permission EPERM was reproducible (pyenv absent); if one exists post-install, T-OPY-ENSURE-PYENV (mocked) will surface it.
- **"PATH/shims/init per the official installer" — faithful:** the official pyenv-installer *clones + instructs* the user to add rc-init lines (it does NOT auto-edit the shell profile). Mapped exactly: clone + `rehash` (shims; pyenv immediately usable by opy via its `PYENV_ROOT`+resolved-binary chokepoint), and interactive-shell PATH/init stays the **consented `opy shell.install`** path (opy's design: no shell-profile edits without consent). Flag for PO/Tron: if you want ensurePyenv to ALSO auto-edit `~/.bashrc` (beyond the official-installer behavior), that's a one-line follow-up — say so.
- Dual-link: `19d8d52` (once.sh:test/mcdonges.latest) | `origin/test/mcdonges.latest:opy` (installPyenv:102, version.list return0:310). → tester **T-OPY-ENSURE-PYENV** (mock `git clone`, no real network/compile).

---
## PO — self-care fix accepted + ~/.bashrc ruling (oosh-po@WODA.prod, 2026-07-16)
Fix `19d8d52` accepted (branch-only, not live — gate-chain adopted, good). `ensurePyenv`→`installPyenv` (git clone --depth1 + rehash, idempotent, refuses non-pyenv overwrite, requires git) = self-care ✓. EPERM MEASURED as return-1 via the debug trap (not fs-perm — task's guess was wrong; expert measured), removed by auto-install + `version.list` hardened to return 0.
- **~/.bashrc RULING: NO auto-edit in ensurePyenv.** Self-care scope = make pyenv usable BY OPY (opy's own operation works — Tron's directive met). Interactive-shell pyenv (typing `pyenv` directly) = the CONSENTED `opy shell.install` (opy's deliberate no-auto-profile-edit design — never silently clobber the user's rc). This is the principled OOSH split: a tool self-installs what IT needs to run; touching the user's shell profile stays consented.
- → tester T-OPY-ENSURE-PYENV (mock git clone: pyenv absent → opy auto-installs → verb proceeds; idempotent; non-pyenv-dir refused; version.list rc0) → PO gate → Tron → ff-deploy live (with heads-up).

---
## ✅ TESTER — T-OPY-ENSURE-PYENV VERIFIED GREEN 14/14 (oosh-tester@WODA.prod, 2026-07-16)
Clean `origin/test/mcdonges.latest` @ **19d8d52** worktree; **MOCKED `git clone`** (in-shell `git()` fabricates a working `$PYENV_ROOT/bin/pyenv` + records calls — NO network/compile); sandboxed HOME + PYENV_ROOT + PATH-without-pyenv (true "absent"); live tree untouched, worktree removed. Invoked the sourced self-care functions directly.
- **(1) pyenv ABSENT → AUTO-INSTALL → proceeds:** `pyenvBin` empty → `private.opy.ensurePyenv` rc0, exactly ONE `git clone` issued, `$PYENV_ROOT/bin/pyenv` now present, announced "pyenv not found — auto-installing", **NO manual-install error** (self-care, not fail-loud), and `opy.version.list` rc0 after (verb proceeds). Kills the Tron-reported "Install pyenv, then re-run".
- **(2) idempotent:** pyenv present → `installPyenv` rc0 with **ZERO reclone** (`[ -x $root/bin/pyenv ]` short-circuit).
- **(3) refuses non-pyenv dir:** `$root` non-empty, no `bin/pyenv` → rc1 + `ERROR> …refusing to overwrite`, **no clone**, pre-existing `precious.txt` **preserved** (data-safe).
- **(4) version.list rc0:** rc0 with pyenv present (lists 3.12.8/3.13.2) AND rc0 with pyenv ABSENT (explicit `return 0` — kills the EPERM-via-debug-trap). 
No gap surfaced; no filesystem-perm EPERM reproducible (as expert predicted). Proof: `session/tasks/T-OPY-ENSURE-PYENV.proof.txt`; harness `scratchpad/t-opy-ensure-pyenv.sh` (ready to land as `test/test.opy` T-OPY-ENSURE-PYENV pending PO gate). → PO gate → Tron → ff-deploy.

---
## ✅ PO GATE PASS — opy ensure-pyenv self-care (oosh-po@WODA.prod, 2026-07-16) → Tron → ff-deploy
Reviewed the tester's CAPTURED proof (`857eb86`, reviewed not re-run; impl `19d8d52` — both hashes resolve). **T-OPY-ENSURE-PYENV 14/14 GREEN** on clean origin/test/mcdonges.latest (mocked git clone, sandboxed, live tree untouched):
- pyenv absent → auto-installs (1 clone) → verb proceeds, **NO manual-install error** (kills Tron's "Install pyenv then re-run") ✓
- idempotent (present → 0 reclone) ✓
- refuses to overwrite a non-pyenv dir (rc1 + no clone + precious.txt preserved — data-safe) ✓
- `version.list` rc0 present AND absent (EPERM-via-debug-trap gone) ✓
**PO gate: PASS → TRON acceptance → ff-deploy** to /root/oosh (clean opy-only ff, reversible). Ready to ff-deploy on Tron's go (per the gate chain: PO-gate → accept → deploy).

---
## 🔴 LIVE BUG — opy install (no-arg) fails at deps as ROOT (opy1@WODA.prod, 2026-07-17)
Tron tested `opy install` (no-arg) LIVE → FAILED at `/root/oosh/opy:131`: `DEBIAN_FRONTEND=noninteractive: command not found`. (ensure-pyenv self-care WORKED — `opy version.list` auto-cloned pyenv. The no-arg→latest path fired — it reached deps. So resolver OK; the DEPS step is the blocker.)
ROOT CAUSE — `private.opy.pkgInstall` line 131:
`$sudo DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"`. As ROOT `$sudo` is EMPTY → `$sudo` occupies the command-word slot at parse time, so `DEBIAN_FRONTEND=noninteractive` is NOT an assignment-prefix; when `$sudo` expands empty it becomes the COMMAND → "command not found". Only manifests as root (sudo="").
FIX: `$sudo env DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"` — `env` is the command word (whether `$sudo` is empty on root or `sudo` on non-root; `env` also survives sudo's env-strip). One-word fix.
→ **oosh-expert: apply `env` at opy:131 on the LIVE mcdonges.latest.** → **oosh-tester: `opy install` no-arg passes the deps step live** (root path). PO gate → Tron.

### ✅ EXPERT — FIXED + LIVE (oosh-expert@ooshTeam:0.3, 2026-07-17) `aa2c4f5`
One-word fix on a clean worktree → pushed origin/test/mcdonges.latest (`93de8ac..aa2c4f5`, opy-only) → **oosh-po heads-up (gate chain) → live ff-deploy `/root/oosh` (clean ff, 1 line)**. Live verified: `opy:131` = `$sudo env DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"`; `bash -n` clean; live HEAD `aa2c4f5`. Root cause exactly as diagnosed — as root `$sudo` expands empty, and a word produced by expansion is NOT re-examined for assignment syntax, so `DEBIAN_FRONTEND=noninteractive` became the command word → "command not found". `env` is a literal command word that works with `$sudo` empty (root) OR `sudo` (non-root), and survives sudo's env-strip. Did NOT run the real `opy install` (would apt-install build deps + compile CPython) — that's the tester's live deps-step gate. Dual-link: `aa2c4f5` (once.sh:test/mcdonges.latest + live /root/oosh) | `/root/oosh/opy:131`. → tester **live deps-step as root** → PO gate → Tron.

---
## 🔴 THE GAP — opy.deps omits the C COMPILER; one-command install fails at BUILD (opy1@WODA.prod, 2026-07-18)
Progress: the env fix (opy:131) landed → `opy install` (no-arg) now RESOLVES latest (3.14.6), runs deps (installed liblzma-dev), downloads + starts BUILDING. But **BUILD FAILED: `configure: error: no acceptable C compiler found in $PATH`** (gcc/cc/clang ALL absent). The one-command promise breaks at COMPILE.
ROOT: `opy.deps` (opy:212) probes only Python MODULES (`_sqlite3 bz2 readline ctypes lzma _ssl zlib`) → maps to `-dev` LIBRARY headers (libsqlite3-dev…). It **NEVER installs the base C TOOLCHAIN** (`build-essential`: gcc/g++/make) — it silently assumes a compiler already exists. Even the fresh-host "full set" path (missing=$modules) still only installs lib-headers, no compiler. pyenv's suggested build env lists `build-essential` FIRST; opy omits it entirely.
FIX (close the gap): `opy.deps` must ALWAYS ensure the base toolchain — probe `command -v cc` / `command -v make`; if missing, install `build-essential` — INDEPENDENT of the module-probe (which presumes a compiler). Keep the module→header mapping. Result: `opy install` on a bare box one-commands a WORKING python end-to-end (self-care all the way through compile).
→ **oosh-expert**: add base-toolchain ensure (build-essential) to `opy.deps`, live mcdonges.latest. → **oosh-tester**: `opy install` no-arg BUILDS python on a box WITHOUT gcc (the true one-command proof, not just deps-pass). PO gate → Tron.
