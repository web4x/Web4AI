# BUG: config.repair can't heal a BORN-BROKEN box (regenerates from the broken env)

**From**: oosh-po (Tron-directed test on u20, 2026-06-26)
**Owner**: oosh-expert (extends #4 config.repair, 4fe7faa)
**Priority**: HIGH — blocks team.push dogfood to u20
**Status**: OPEN

## The test (Tron: "try the autorepair on u20, the fresh install did not do well")
Ran `config repair` on u20 (the born-broken, fresh-`ossh install`, symlinked-`~/config` box). Exit 0, but **user.env UNCHANGED** — still the 7 polluted logic lines; fresh login still `OOSH_DIR=[]`, `config list` empty. The repair NO-OP'd.

## Root cause
`config.repair()` (config:420) "regenerate a clean pure-state user.env **from current environment**":
- line 422 `: ${CONFIG_PATH:=$HOME/config}` — defaults to the symlink dir.
- It reads CURRENT env vars (OOSH_DIR/CONFIG_PATH/OOSH_MODE) to write them as exports.
- **On a born-broken box those are already empty/wrong** → it has nothing good to write → effectively no-op (or writes empty values).
- A self-repair that SOURCES the broken state cannot fix a state that was never correct.

## The fix
config.repair must RESOLVE correct values from FIRST PRINCIPLES, not from the (broken) env:
1. **OOSH_DIR**: resolve from the actual oosh install (e.g. `/root/oosh` git toplevel, or `cd $HOME/oosh && pwd -P`), NOT `$OOSH_DIR`.
2. **OOSH_MODE**: from the oosh git branch (`git -C <ooshdir> rev-parse --abbrev-ref HEAD`), NOT `$OOSH_MODE`.
3. **CONFIG_PATH**: canonicalize through the symlink (`cd -P`), write to the REAL target.
4. **Actually overwrite** the polluted user.env with pure exports (it currently doesn't — verify the write lands on the symlink target).
5. Run `config.validate` after; fail loudly if still polluted.

## Acceptance
- [ ] `config repair` on u20 (symlinked-config, born-broken) → user.env becomes PURE STATE with correct OOSH_DIR (dev tree) + OOSH_MODE=dev + CONFIG_PATH canonical.
- [ ] Fresh `ossh login u20` (or `env -i bash -lc`): OOSH_DIR non-empty, `config list` works, no /log + /c2.install errors.
- [ ] Idempotent (2nd run no-op-clean).
- [ ] Test extends T-SELFREPAIR to the born-broken + symlinked-config case (not just a locally-corrupted-then-repair case).

## Report-back
- Expert (fix + commit):
- Tester (T-SELFREPAIR symlink/born-broken case):
