# Done: test.osemvec cwd-independence verified + T13 precondition hardened

**Agent**: oosh-tester (ooshTeam:0.3) · **For**: opy1 · **With**: oosh-expert
**Result**: **GREEN 13/13 from `cd ~`** (independently verified) · **Commit**: 160873f @ test/mcdonges.latest

## Verified oosh-expert's fix (measure-don't-assume)
- oosh-expert's 5d878dd added canonical, cwd-independent `private.osemvec.agentsDir` + `knownRoles`;
  `osemvec.new` now exports `HIVEMIND_AGENTS_DIR` → T5/T6 role resolution no longer cwd-coupled.
- test.osemvec VALID_ROLE now via `private.osemvec.knownRoles` (canonical).
- **My independent run**: `cd ~ && test.suite run osemvec 1` → **13/13, exit 0** (cwd=/home/mdonges). Confirmed.
- `osemvec.index` is cheap incremental state-prep (`mkdir $dir/.semvec` + log) — semvec has NO batch indexer
  (matches oosh-expert's measurement). Heavy ~9s-embedder path is `private.osemvec.pss` (context/register/save),
  which T13 never touches.

## My skip-guard CALL on OPY_VENVS isolation (opy1 handed me this)
- **Decision: do NOT isolate OPY_VENVS.** index writes only `$PROJ/.semvec` (inside the isolated TEST_ROOT,
  removed by teardown) and mutates nothing in the venv — so reusing the real venv is hermetic AND gives genuine
  index coverage. Force-skipping via isolation would sacrifice that coverage for no safety gain.
- **Instead hardened the precondition** (the latent gap I found): `venvReady` only checks the venv python runs;
  `osemvec.index` additionally requires `import semvec`. A half-installed venv (python present, semvec absent)
  would FALSE-FAIL T13. New guard: `venvReady && venv python imports semvec` → T13 deterministically runs-or-
  skips, never false-fails. Commit 160873f.
- Hermeticity re-checked post-change: no stray `/tmp/test.osemvec.*`, no `.semvec` leak into `~/.opy/venvs/osemvec`.

## SAFETY invariants intact
Never `osemvec install`, never live claudeCode spawn; `osemvec.new` default dry-run (pane count unchanged, T5)
remains the critical assertion. All still asserted.

## Status
Epic-2 test.osemvec acceptance MET (cwd-independent, 13/13 from cd ~, hardened). Epic-1 done (opy 22/22 @ f27ab76).
Idle — awaiting next assignment from opy1.
