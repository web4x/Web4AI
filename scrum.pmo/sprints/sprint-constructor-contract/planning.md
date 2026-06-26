# Sprint: Constructor Contract — init() ALWAYS yields a valid object

**Epic**: Every OOSH constructor (`this.init`, `config.init`, every `scriptname.start`) honors the contract: after it runs, the object is **fully operational, consistent, and safe** — idempotent, self-healing, canonical-source-resolved, no config loss, pure-state persistence, fail-loud. This is THE first principle of the object-oriented shell.
**Owner**: oosh-po@WODA.prod (drive on dev box) · oosh-po@MacStudio (first-principles guardian, QA gates)
**Status**: PLANNED → driving
**Created**: 2026-06-26
**Authoritative principle text**: commit `386aca3` (session/tasks/ossh-install-polluted-userenv.md, "FIRST PRINCIPLE — authoritative text")
**Absorbs**: #10 (repair can't heal born-broken), #11 (OOSH_DIR lost on install), repair-cant-heal answer, Rule A (env=state+source*.env), Rule B (any script reinit clean, no loss). All derive from the constructor contract.

## Collaboration model
- **oosh-po@MacStudio** (me): first-principles guardian — own the principle text, review at QA gates (S-1, S-5, S-8, S-9), source-side reference. Drive via git mailbox + remoteOOSH:0.0.
- **oosh-po@WODA.prod**: sprint PO — assign stories, drive architect→expert→tester per-pane PDCA, dogfood on u20.
- **architect** (design), **expert** (implement on dev), **tester** (T-CONSTRUCTOR). u20 = born-broken repro box.

## Stories

### S-1: Land the first principle (architect)
Replace the bolt-on "Self-Care obligation-3 (repair as separate entrypoint)" in `docs/first-principles.md` with the authoritative constructor-contract text (386aca3) as the FIRST Philosophy bullet. init = constructor = always-valid-object.
- [ ] first-principles.md: constructor-contract principle verbatim, bolt-on wording removed
- [ ] QA gate: guardian (me) sign-off on wording
- Owner: oosh-architect

### S-2: Canonical fundamental resolution (expert) — fixes #11 root
`this.init` / `config.init` resolve OOSH_DIR/CONFIG_PATH/OOSH_MODE from **BASH_SOURCE** (the running script's own dir), never `$HOME/oosh` guess, never conditional. Single shared resolver.
- [ ] `private.this.resolve.fundamentals` (or equiv) — BASH_SOURCE-based, symlink-safe (`cd -P`)
- [ ] this.init + config.init both call it; no `$HOME/oosh` guess remains
- [ ] T-FUND: OOSH_DIR correct on EAMD/symlinked layout (u20), not just $HOME/oosh
- Owner: oosh-expert · Ref #11

### S-3: Unconditional pure-state emit (expert) — fixes #11 emit
`config.save` emits OOSH_DIR/CONFIG_PATH/OOSH_MODE ALWAYS (resolve-then-emit), never `[ -n "$OOSH_DIR" ] && echo`. A fundamental var is never silently skipped.
- [ ] config.save: drop `[ -n ]` guards on fundamentals; resolve via S-2 then emit
- [ ] T-EMIT: fresh-install subshell (OOSH_DIR initially empty) → user.env HAS OOSH_DIR
- Owner: oosh-expert · Ref #11

### S-4: config.validate reconcile to Rule A (expert) — env = state + source*.env ONLY
validate ACCEPTS `^source .*\.env` (legit chaining) and `export`/`declare`/comment/blank; REJECTS all other logic (`: ${`, `$(`, `[ ]`, `{ }`, bare conditionals). Reconciles Rule A vs #4's source-stripping — Rule A is authority.
- [ ] validate accepts `source *.env`; rejects every other non-state construct
- [ ] decide w/ architect: source-chain in env file (Rule A) vs this (#4) — env file carrying `source *.env` MUST be valid
- [ ] T-VALIDATE: accepts source-lines + quoted-value brackets; rejects logic
- Owner: oosh-expert + architect · Ref Rule A, #4

### S-5: init is self-healing + no-loss; fold repair INTO init (expert+architect) — fixes #10
`config.init`/`this.init` idempotent + self-healing: on a broken/born-broken env, restore fundamentals (S-2) + preserve ALL existing user state + rewrite pure-state + validate → valid object. `config repair` becomes an alias for "init again" (or removed). NO config loss.
- [ ] init reads existing valid state, merges canonically-resolved fundamentals, rewrites pure-state, validates
- [ ] born-broken box (empty OOSH_DIR, polluted env) → init → valid, zero user-state loss
- [ ] repair = init re-invoked (no separate regenerate-from-broken-env path)
- [ ] T-NOLOSS: set a user var → corrupt env → init → user var survives + env clean
- Owner: oosh-architect (design no-loss merge) + oosh-expert (impl) · Ref #10, Rule B

### S-6: Every constructor fails LOUD, never half-built (expert)
this.init / every `.start`: if it cannot reach a valid object, error loud + non-zero — never RC=0 on broken env, never half-constructed.
- [ ] this.init signals clearly on unrecoverable env (no silent RC=0)
- [ ] T-LOUD: unrecoverable env → loud error + non-zero, not silent
- Owner: oosh-expert

### S-7: Heal the live broken boxes (expert + PO)
Regenerate clean env on **u20** + **WODA.prod** via the new init; fresh `ossh install` on a symlinked-config box yields a valid object.
- [ ] u20 + WODA.prod: init → config list non-empty, OOSH_DIR correct tree, oo mode header, login clean
- [ ] fresh `ossh install` on symlinked-config box → valid object (the original #6/#11 repro)
- Owner: oosh-expert + oosh-po@WODA.prod · Ref #11, ossh-install task

### S-8: T-CONSTRUCTOR suite (tester)
One suite proving the contract: born-broken→init→valid+zero-loss; idempotent (twice = no-op); validate accepts source/rejects logic; fresh install valid; fail-loud on unrecoverable.
- [ ] All of S-2..S-6 covered, GREEN on dev
- Owner: oosh-tester

### S-9: QA + dogfood (PO)
Guardian QA all gates; dogfood the full born-broken→init cycle on u20. Sprint done when the contract holds everywhere + all green.
- [ ] guardian sign-off; u20 dogfood clean; backlog #10/#11 closed
- Owner: oosh-po@MacStudio (QA) + oosh-po@WODA.prod (dogfood)

## Sequencing
```
S-1 (principle) ─┐
S-2 (canonical resolve) → S-3 (emit) → S-5 (init self-heal/no-loss) → S-6 (fail-loud)
S-4 (validate, parallel) ─┘                    ↓
                                        S-7 (heal u20/WODA.prod) → S-8 (tests) → S-9 (QA/dogfood)
```

## Guardrails
- Per-pane PDCA, no for-loops. Verify-or-fail each step.
- MVC/hiveMind changes are NOT in this sprint (constructor/config/this/docs only) — safe to run during the team.push merge era.
- Check `scrumMaster subscription` before delegation waves; ≤2 agents parallel.

## Report-back
- oosh-po@WODA.prod (sprint accepted + assigned):
- architect / expert / tester (per story):
