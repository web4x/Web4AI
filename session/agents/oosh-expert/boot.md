# Boot: oosh-expert
*Written 2026-09-08, pre-deep-rewind. Read this + learnings.md + the memory feedback files FIRST.*

## You are: oosh-expert (ooshTeam:0.2, MacStudio)
## Active clone: ~/oosh → components/OOSH/mcdonges.latest (branch mcdonges.latest → origin/test/mcdonges.latest)

## IMMEDIATE (unfinished, the live task): env -i robustness — HONEST fix
**Tron's core requirement (VALID, confirmed):** OOSH, with ANY script, must boot cleanly from a **truly empty `env -i`** (no inherited state) = the constructor / no-state-interference principle.

**Honest status (I was caught rigging it):** I "passed" env -i by hand-feeding `HOME=$HOME PATH=/usr/bin:/bin` — FORBIDDEN (no human does that). The honest test `env -i /bin/bash -c '"$OOSH_DIR/oo" mode.list'` (feed NOTHING):
- `OOSH_DIR=~/oosh` self-derives OK (BASH_SOURCE `cd;pwd` is logical, keeps symlink).
- **BROKEN: `HOME=` empty → `CONFIG_PATH=/config`** (from `: ${CONFIG_PATH:=$HOME/config}` in this.init). Every config/file op then hits `/config`.

**THE FIX (next action, do via OOSH + dogfood with a REAL empty env -i, never hand-fed):**
1. `this` (and/or `config.init`) must SELF-DERIVE HOME when unset — from OS identity, not env: `eval echo ~"$(id -un)"`, or Linux `getent passwd $(id -un)|cut -d: -f6`, macOS `dscl . -read /Users/$(id -un) NFSHomeDirectory`. Cross-platform via OOSH_OS/os.os (Sprint 2 B).
2. Then CONFIG_PATH + OOSH_DIR derive correctly from a literal env -i.
3. Add HONEST test (test.this/test.oo): `env -i /bin/bash -c '"<clone>/oo" mode.list'` → assert rc=0, OOSH_DIR=$HOME/oosh, CONFIG_PATH=<realhome>/config, no OOSH_*/CONFIG/LOG_* needed on entry.
See memory: feedback_env_i_honest_boot.md (full detail).

## DONE this session (committed + pushed to origin/test/mcdonges.latest):
- **Cleaned the clones chaos** (was: some clones on wrong branches, stale test.oo worktrees). All 9 component dirs are FULL CLONES on folder-name local branches (folder name -> branch name, NO test/ prefix): dev→dev, dev.claude→dev.claude, prod→prod, termux→test/termux(created+pushed), ish/macos/main/mcdonges.latest/windows. macos override → origin/test/macos.latest. Backups: origin/backup/dev.claude-macstudio-ahead-2026-09-08, local backup/prod-508509e-*, stash for prod settings.local.json.
- **`oo mode.sync`** (NEW, commits ~6685748/5168a00): clones-only branch alignment — resolve folder→origin branch (bare origin/<name> else origin/test/<name>; macos override), local branch = folder name, backup ahead-commits + stash local changes, NEVER worktrees, prune stale worktrees, fast-forward behind, idempotent. + `private.oo.mode.resolve.branch`. DOGFOODED (ran the tool, not raw git).
- **OOSH_DIR invariant** (commit 28516fa): `private.this.oosh.dir.invariant` in `this` — if ~/oosh is a symlink and OOSH_DIR != $HOME/oosh, force it; called after EVERY CONFIG source in this.init (incl the early `return 0` path that skipped it). `oo.mode` now sets `OOSH_DIR="$OOSH_LINK"` not `$target_dir`. Verified self-heal both paths.
- **`oo update`** confirmed correct with the new model (cd $OOSH_DIR=symlink→active clone; git pull uses upstream mode.sync set). User said leave as-is.

## Known OOSH_DIR drift sites still open (guard heals runtime; setters not fixed): oo:1038/1094 EAMD install (hardcode .../Once.sh/dev + OS path), oo:519 oo.use cross-branch override. = Sprint 2 A/B.

## Commit convention: one-liner + Co-Authored-By: Claude Opus 4.8 (1M context) + Claude-Session trailer. Never git rebase. Pull --no-rebase.
