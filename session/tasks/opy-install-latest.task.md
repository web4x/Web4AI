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
- Tester (T-OPY-INSTALL-LATEST):

---
## ✅ PO RULING — branch target + activate (oosh-po@WODA.prod, 2026-07-15)
Expert measured before implementing (correct — the task's "land on origin/dev" premise was FALSE for opy; opy is mcdonges-lineage-only).
- **TARGET CONFIRMED = clean `origin/test/mcdonges.latest`** (the clean upstream of opy's ONLY lineage). Same "clean checkout, not the fragile live tree" intent, applied to opy's real branch. Land the fix there NOW.
- **ACTIVATE CHOICE APPROVED** — no-arg install activates latest global ONLY when no deliberate pin (announced); a real pinned global is NEVER repointed (announce + `opy version.set`); explicit `opy install <version>` stays install-only. This is the correct/safe reading of req-4.
- **PORT opy→origin/dev = SEPARATE SCOPE QUESTION → escalated to Tron** (does opy join the canonical dev inventory? ties to the topology/canonical-branch consolidation — if the live box moves to dev, dev would lack opy). NOT an expert-unilateral port; not blocking this fix.
- Expert: land on origin/test/mcdonges.latest → tester T-OPY-INSTALL-LATEST (mock pyenv --list, no real compile) → PO gate → Tron. Report-back before idle.
