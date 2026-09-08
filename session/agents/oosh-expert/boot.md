# Boot: oosh-expert
*Written 2026-09-08, pre-deep-rewind. Read this + learnings.md + the memory feedback files FIRST. (Superseded a stale 2026-07-14 WODA.prod boot on merge — current identity is below.)*

## You are: oosh-expert (ooshTeam:0.2, MacStudio)
## Active clone: ~/oosh → components/OOSH/mcdonges.latest (branch mcdonges.latest → origin/test/mcdonges.latest)

## DONE 2026-09-08: env -i robustness — HONEST fix (commit e3222de, pushed to origin/test/mcdonges.latest)
**Tron's core requirement (VALID, confirmed):** OOSH, with ANY script, must boot cleanly from a **truly empty `env -i`** (no inherited state) = constructor / no-state-interference principle.

**FIXED + dogfooded with a REAL empty env -i (never hand-fed):**
1. `oo.start`: `source this` relied on PATH (empty under env -i → rc=127 "this: No such file or directory"). Now `source "$(dirname "${BASH_SOURCE[0]}")/this" 2>/dev/null || source this` (self-relative + PATH fallback). `this` then sets PATH so all downstream siblings resolve.
2. `this` (top-level, after OOSH_DIR block): self-derives HOME when unset via `eval echo ~"$(id -un)"` (bash tilde-user = passwd getpwnam, macOS+Linux, NO dscl/getent branch needed), guarded by `[ -z "$HOME" ]` so normal boot pays one test. Fixes `CONFIG_PATH=/config` degrade.
3. `test.this` T-ENV-I-1/-2: honest gate, feeds NOTHING, asserts rc=0 + HOME/OOSH_DIR/CONFIG_PATH self-derive. Both GREEN.

**Key measured facts:** bash under `env -i` injects a DEFAULT PATH (`/bin:/usr/bin:…`) so `id` resolves; only non-system `this` failed PATH lookup. Bash `~`/`~user` expansion consults passwd DB even when HOME unset — OS-independent home derivation, pure bash.

**Pre-existing GAP found (NOT mine, separate fix):** test.this line ~87 "single-word dispatch" test uses `./config list` — hardcoded relative path, fails rc=127 when test.suite cwd ≠ OOSH_DIR. `config list` via PATH = rc=0. Track as its own task (test-harness cwd / use `config` not `./config`).
See memory: feedback_env_i_honest_boot.md.

## DONE this session (committed + pushed to origin/test/mcdonges.latest):
- **Cleaned the clones chaos** (was: some clones on wrong branches, stale test.oo worktrees). All 9 component dirs are FULL CLONES on folder-name local branches (folder name -> branch name, NO test/ prefix): dev→dev, dev.claude→dev.claude, prod→prod, termux→test/termux(created+pushed), ish/macos/main/mcdonges.latest/windows. macos override → origin/test/macos.latest. Backups: origin/backup/dev.claude-macstudio-ahead-2026-09-08, local backup/prod-508509e-*, stash for prod settings.local.json.
- **`oo mode.sync`** (NEW, commits ~6685748/5168a00): clones-only branch alignment — resolve folder→origin branch (bare origin/<name> else origin/test/<name>; macos override), local branch = folder name, backup ahead-commits + stash local changes, NEVER worktrees, prune stale worktrees, fast-forward behind, idempotent. + `private.oo.mode.resolve.branch`. DOGFOODED (ran the tool, not raw git).
- **OOSH_DIR invariant** (commit 28516fa): `private.this.oosh.dir.invariant` in `this` — if ~/oosh is a symlink and OOSH_DIR != $HOME/oosh, force it; called after EVERY CONFIG source in this.init (incl the early `return 0` path that skipped it). `oo.mode` now sets `OOSH_DIR="$OOSH_LINK"` not `$target_dir`. Verified self-heal both paths.
- **`oo update`** confirmed correct with the new model (cd $OOSH_DIR=symlink→active clone; git pull uses upstream mode.sync set). User said leave as-is.

## Known OOSH_DIR drift sites still open (guard heals runtime; setters not fixed): oo:1038/1094 EAMD install (hardcode .../Once.sh/dev + OS path), oo:519 oo.use cross-branch override. = Sprint 2 A/B.

## Commit convention: one-liner + Co-Authored-By: Claude Opus 4.8 (1M context) + Claude-Session trailer. Never git rebase. Pull --no-rebase.
