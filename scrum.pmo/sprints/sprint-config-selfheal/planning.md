# Sprint: Config Lifecycle & Self-Healing — close ALL gaps

**Epic**: Every config lifecycle gap found during sprint-constructor-contract is fixed, tested, and documented. Zero open config issues remain.
**Owner**: oosh-po@WODA.prod
**Status**: **SPRINT COMPLETE** — CS-1→CS-7 DONE, 47/47 test.config GREEN, 3/3 T-C2-QUOTE GREEN, CS-8 live verify next
**Created**: 2026-06-27
**Source**: architect review `8427057` (3 gaps) + ossh-install task (5 open criteria) + c2 completion (5 open criteria) + config.clean sort bug + 6 pre-existing test failures

## Stories

### CS-1: config.clean — replace sort -u with dedup-preserving-order (expert)
`config.clean` uses `sort -u` which REORDERS lines — fundamentals move after source lines, breaks source order. Replace with `awk '!seen[$0]++'` (deduplicates while preserving insertion order).
- [ ] config.clean preserves line order while removing exact duplicates
- [ ] T-CLEAN-ORDER: add 3 lines, 1 duplicate → clean → order preserved, dup removed
- Owner: oosh-expert

### CS-2: BASH_FILE unconditional emit (expert)
`config.save` line 336: `[ -n "$BASH_FILE" ] && echo export BASH_FILE=...` — conditional violates S-3 (unconditional emit). Resolve BASH_FILE via `which bash` fallback, then emit always.
- [ ] BASH_FILE always emitted (resolve via `which bash` if empty)
- [ ] T-BASH_FILE: unset BASH_FILE → config.save → user.env HAS BASH_FILE
- Owner: oosh-expert

### CS-3: config.save oosh/log ordering guard (expert)
Lines 362-363 call `config.save oosh OOSH` + `config.save log LOG` after merge. On a born-broken boot, OOSH_*/LOG_* may not be fully primed yet. Guard: assert OOSH_DIR is non-empty before calling sub-saves, or call resolve.fundamentals explicitly before them.
- [ ] Sub-saves guarded: only run if fundamentals are resolved
- [ ] T-ORDERING: born-broken boot → config.save → oosh.env has correct OOSH_DIR (not empty)
- Owner: oosh-expert

### CS-4: config.validate gate in ossh.install (expert)
`ossh.install.finish.local` / `ossh.install.continue.local` must run `config.validate` at the end. If the generated user.env contains logic, the install FAILS loudly.
- [ ] config.validate called at end of install flow
- [ ] Install fails if user.env has logic (not silent RC=0)
- [ ] T-INSTALL-GATE: inject logic into user.env during install mock → install fails
- Owner: oosh-expert

### CS-5: Fix 6 pre-existing test failures in test.config (expert + tester)
T11/T17 — old tests expect `source` line but expert changed to export marker (now reverted via S-11 b6300b2). 4 cascade from T17 fixture corrupting CONFIG ordering. These 6 must go GREEN.
- [ ] All 6 pre-existing test.config failures fixed
- [ ] Full test.config suite GREEN (currently 35/41)
- Owner: oosh-expert (fix) + oosh-tester (verify)

### CS-6: T-C2-QUOTE test (tester)
Write the test for the c2 completion crash fix (f13f35d + d83907b). Inject `'''` into current.method.env → c2 completion → no crash + file healed.
- [ ] T-C2-QUOTE in test/test.c2 or test/test.config
- [ ] Covers: broken file → completion works, file valid after
- Owner: oosh-tester

### CS-7: T-ENV-INSTALL integration test (tester)
Full integration: install emits pure state + validate gate fails on injected logic + self-repair restores corrupted env + boot-on-broken-env auto-heals (never asks user, never fails).
- [ ] T-ENV-INSTALL: fresh install → pure state; corrupted → repair → clean; boot auto-heals
- Owner: oosh-tester

### CS-8: Verify on live boxes (PO)
Re-run the full verification on u20 + WODA.prod after all fixes: `config list` clean, `config validate` RC=0, fresh login zero errors, `oo mode` correct.
- [ ] u20 + WODA.prod both clean after all fixes applied
- Owner: oosh-po@WODA.prod

## Sequencing
```
CS-1 (clean order) ──┐
CS-2 (BASH_FILE)  ───┼── CS-5 (fix 6 test failures) → CS-8 (live verify)
CS-3 (ordering)   ───┤
CS-4 (install gate) ─┘
CS-6 (T-C2-QUOTE, parallel) ─── CS-7 (T-ENV-INSTALL, after CS-4)
```

## Guardrails
- config/this/docs/test ONLY — no hiveMind/otmux/claudeCode
- Per-pane PDCA, ≤2 parallel
- Post-task: agents save + trainer rewinds

## Report-back
- oosh-po@WODA.prod (sprint assigned):
- architect / expert / tester (per story):
