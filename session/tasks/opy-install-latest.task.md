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

## Report-back
- Expert (impl + latest-resolver + activate choice):
- Tester (T-OPY-INSTALL-LATEST):
