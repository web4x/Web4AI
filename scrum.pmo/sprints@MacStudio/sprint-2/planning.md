# Sprint 2 — Cross-Platform Consistency + OOSH_DIR Invariant

## Sprint Goal
Both machines (MacStudio + WODA.prod) run the **same codebase identically** — no platform-dependent completion failures, no OOSH_DIR drift after `oo mode` switches, and OS-specific paths derived from config (never hardcoded). The system self-heals after a restart.

## Sprint Overview
- **Host:** MacStudio (donges@MacStudio) · **Remote:** WODA.prod (root@v60211)
- **Branch:** `test/mcdonges.latest` (stable line) · **Repo:** `Cerulean-Circle-GmbH/once.sh`
- **Mailbox:** `web4x/Web4AI` (branch `main`)
- **Team:** oosh-architect (0.1, design), oosh-expert (0.2, impl), oosh-tester (0.4, verify) — MacStudio ooshTeam
- **Remote verification:** `remoteShells:0.0` (local) + `remoteShells:0.1` (WODA.prod)

## Foundation (already landed on mcdonges.latest — this sprint's base)
| Commit | What | Status |
|--------|------|--------|
| `def45a7` | c2 apostrophe `'''` port (33da219 → mcdonges.latest) | ✅ done |
| `c453bbe` | c2 source-safe `printf %q` (cross-platform declare quoting) | ✅ done |
| `6782c6a` | T-QUOTE-CORRUPTION regression test (gates both platforms) | ✅ done |
| `921da82` | Self-Healing Objects principle in `first-principles.md` | ✅ done |
| (env) | WODA.prod OOSH_DIR manually fixed to `$HOME/oosh` | ✅ done (manual) |
| (env) | WODA.prod FORMAT_PARSE_METHOD restored in `lineFormat.env` | ✅ done (manual) |

## Task List

### Epic A: OOSH_DIR Invariant — `oo mode` must never drift OOSH_DIR
Ref: [GitHub](https://github.com/web4x/Web4AI/blob/main/session/tasks/oosh-dir-inconsistency-analysis.md) | [Web4AI](session/tasks/oosh-dir-inconsistency-analysis.md)

- [ ] **A1** `oo.mode()` fix: set `OOSH_DIR="$HOME/oosh"` not `"$target_dir"` (oo:309)
  - [ ] A1.1 architect — design: define the OOSH_LINK invariant, review oo.mode control flow
  - [ ] A1.2 expert — impl: fix oo:309 + test on both platforms
  - [ ] A1.3 tester — verify: `oo mode <branch>` then `echo $OOSH_DIR` = `$HOME/oosh` on both
- [ ] **A2** EAMD install fix: create symlink FIRST, then set `OOSH_DIR="$HOME/oosh"` (oo:945/1001)
  - [ ] A2.1 expert — impl: reorder symlink creation + kill literal `'dev'` hardcode
  - [ ] A2.2 tester — verify: fresh EAMD install → OOSH_DIR=`$HOME/oosh` (WODA.prod)
- [ ] **A3** `this.init()` self-heal guard: if `$HOME/oosh` is a symlink and `OOSH_DIR` differs → override
  - [ ] A3.1 expert — impl: add the guard to `this.init()`
  - [ ] A3.2 tester — verify: corrupt OOSH_DIR in env → fresh shell self-heals to `$HOME/oosh`

### Epic B: OS-Independence — derive platform paths from config, never hardcode
- [ ] **B1** OS-derive `OOSH_SHARED_BASE` in `config.init` / `this.init`
  - [ ] B1.1 architect — design: `OOSH_OS` → `OOSH_SHARED_BASE` derivation (darwin=`/Users/Shared`, linux=`/home/shared`)
  - [ ] B1.2 expert — impl: add derivation to `config.init` or `this.init`, single source
  - [ ] B1.3 tester — verify: MacStudio=`/Users/Shared`, WODA.prod=`/home/shared`, both auto-derived
- [ ] **B2** Derive `OOSH_COMPONENTS_DIR` from `OOSH_SHARED_BASE`
  - [ ] B2.1 expert — impl: `OOSH_COMPONENTS_DIR` = `$OOSH_SHARED_BASE/EAMD.ucp/Components/.../Once.sh`
  - [ ] B2.2 tester — verify: set on both platforms after boot
- [ ] **B3** De-hardcode platform paths (~8 scripts)
  - [ ] B3.1 expert — impl: replace literal `/Users/Shared` and `/home/shared` in `oo` (218, 967), `hiveMind` (2285, 3142), `claudeCode`, `odocker` (14), `backup`, `init/deinstall.oosh`, `templates/user/oo-shim`, `restore/hiveMind` with `$OOSH_SHARED_BASE` / `$OOSH_COMPONENTS_DIR`
  - [ ] B3.2 tester — verify: `grep -rn '/Users/Shared\|/home/shared' <scripts>` = 0 hits (excluding comments/docs)

### Epic C: line.format Self-Heal — survive restart without manual FORMAT_ repair
- [ ] **C1** Port `line.format` self-heal from macos.latest (`674f38b`) to mcdonges.latest
  - [ ] C1.1 expert — impl: port `private.line.format.defaults` + the `[ -z "${!format}" ]` guard
  - [ ] C1.2 tester — verify: `rm lineFormat.env` → fresh shell → completion still works (both platforms)

### Epic D: config.save Root Bug — greedy varname extraction
Ref: [GitHub](https://github.com/web4x/Web4AI/blob/main/session/tasks/config-save-greedy-varname-bug.md) | [Web4AI](session/tasks/config-save-greedy-varname-bug.md)

- [ ] **D1** Fix `config.save` sed so it extracts the VARIABLE NAME, not substrings from VALUES
  - [ ] D1.1 architect — design: spec the correct sed/awk extraction (name before `=`, not inside value)
  - [ ] D1.2 expert — impl: fix the sed in `config.save`
  - [ ] D1.3 tester — verify: `config save` with a var whose value contains `NAME=...` → var persisted correctly

## Dependencies
```
A1 ──→ A2 (invariant defined before EAMD install uses it)
A1 ──→ A3 (invariant defined before self-heal references it)
B1 ──→ B2 ──→ B3 (derive base → derive components → de-hardcode)
C1 ── independent (can run in parallel)
D1 ── independent (can run in parallel)
```

## Definition of Done
- [ ] `oo mode <branch>` + `config save` → `OOSH_DIR` stays `$HOME/oosh` on both platforms
- [ ] `OOSH_SHARED_BASE` auto-derived on both platforms (no manual env patching after restart)
- [ ] Zero hardcoded `/Users/Shared` or `/home/shared` in production scripts
- [ ] `line.format` self-heals empty `FORMAT_` vars after restart (no manual lineFormat.env repair)
- [ ] `config.save` correctly persists vars with `NAME=` in their values
- [ ] All existing tests pass on both platforms (MacStudio + WODA.prod via remoteShells)
- [ ] T-QUOTE-1/2/3 GREEN on both platforms (regression fence holds)

## Risks
- EAMD install (A2) touches WODA.prod's install path — test on WODA.prod via remoteShells, rollback plan = manual `OOSH_DIR=$HOME/oosh` + `config save`
- De-hardcoding B3 across ~8 scripts — risk of missing a reference; tester's grep-zero fence is the gate

---
**Product Owner:** oosh-po@MacStudio (ooshTeam:0.0)
**Created:** 2026-07-07
**Sprint:** Sprint 2 @MacStudio — Cross-Platform Consistency + OOSH_DIR Invariant
