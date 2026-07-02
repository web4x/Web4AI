# Task: Death-to-Flags audit — remove --fork + guard against flags (#5)

**From**: oosh-po@MacStudio · **Priority**: normal (non-blocked fill-work while sprint-1 tail is Tron-blocked)
**Code**: `once.sh/dev` · **Mailbox**: this repo · **Date**: 2026-07-02
**Why now**: sprint-1 E1.2/D1.3 blocked on naked container; this is clean dev-only OOSH hygiene that uses idle capacity. Standing Tron directive (Death to Flags).

## The principle
OOSH abandons flags — the method name carries the verb, positional params carry roles, `.completion()` carries the docs. Any `--flag` in an OOSH method is a violation.

## Subtasks (role-ordered, no blocking deps)

### E-FLAGS.1 — oosh-expert (HOW): remove `--fork` + audit
- `hiveMind teams.restore` takes a `--fork` arg; `teams.migrate` passes `teams.restore --fork`. **Redesign flagless** — object.verb (e.g. a distinct `teams.restore.fork` method, or a positional `<?mode:join|fork>` param) — your call on the cleaner OOSH shape; keep `teams.migrate` calling the new form.
- **Audit ALL oosh method signatures for `--`-style flags** (`grep -nE '\-\-[a-z]' hiveMind otmux claudeCode ossh odocker oo config` and inspect). List every violation found; fix the hiveMind ones in-scope, file the rest back here for triage.
- Preserve behavior exactly (DRY, no MVC churn beyond the flag redesign). Report-back the commit(s) + the audit list in this file.

### E-FLAGS.2 — oosh-tester (verify): T-NO-FLAGS
- Add `T-NO-FLAGS` to the relevant `test/test.<script>`: assert the redesigned restore/migrate work via the flagless form, AND a guard that greps the method surface for `--`-flags and fails if any reappear (regression fence).
- Verify live on WODA.test where relevant. Report-back GREEN + commit here.

## Acceptance (PO QA gate)
- [ ] `--fork` gone from teams.restore/migrate; flagless form works, `teams.migrate` still drives it
- [ ] Full flag-audit list produced (fixed vs. filed-for-triage)
- [ ] T-NO-FLAGS GREEN + regression fence in place
- [ ] Zero behavior regression; OOSH-compliant (object.verb, completions intact)
- I inspect the DIFF (not just "done") before sign-off.

## Rules
OOSH wrappers only; no output filtering; measure live; task file = channel, chat = one-line nudge; report-back = commit + push here.

---
## E-FLAGS.2 REPORT-BACK — T-NO-FLAGS (oosh-tester, 2026-07-02) — ✅ GREEN, dev `d126aa3`
Added `test/test.no.flags` — **6/6 GREEN** on MacStudio AND live WODA.test (dev checkout).

**(A) Regression FENCE** — greps the method-signature *params block* (text between the 1st and 2nd `#` of every `name() # <params> # desc`) across `hiveMind otmux claudeCode ossh odocker oo config state test.suite`; **violations=0** → no method declares a `--flag` param. Ignores trailing descriptions + `--` in bodies calling external tools (docker/git/tmux/xsel…), so it fences the real surface without false positives. Fails loudly if any `--flag` param reappears.

**(B) BEHAVIOR** (flagless teams.restore/migrate — E-FLAGS.1 form already in dev):
- hiveMind carries **no `--fork`** anywhere.
- `teams.restore` exposes a **flagless fork path** — currently the positional `# <?snapshotFile> <?mode:join|fork> <?sessionFilter>`; body parses `fork)`/`join)` case arms. Assert is **shape-tolerant** (also passes a distinct `teams.restore.fork` method) so it survives whichever OOSH shape you finalize.
- `teams.migrate`/remote drives `hiveMind teams.restore fork` (positional) — no `--fork` in the call.

**(C) TRIAGE inventory** — soft flag-*value* comparisons (a positional param whose magic VALUE is `--`-prefixed; softer than a signature flag). **Budget ≤1, currently 1** → the one filed-for-triage item:
- `otmux:702  if [ "$force" != "--force" ]` — `otmux.layout.restore()`'s `<?force>` positional accepts the literal value `--force`. Signature is clean (`<?force>` positional); only the accepted VALUE is flag-like. Fence fails if this set GROWS (new soft-flags get noticed). **Filed for triage** (per E-FLAGS.1 "file the rest"): consider a non-`--` sentinel (e.g. `force`) if you want it fully flag-free.

**Full audit result**: across all 8 scripts, **zero true signature-flag violations**; the only `--` in a param surface is the otmux `--force` VALUE (filed). Everything else is external-tool options (docker `--name`, xsel `--clipboard`, etc.) — legitimate, not OOSH method flags.

Acceptance status (tester side): T-NO-FLAGS GREEN + regression fence in place ✅. Awaiting expert's E-FLAGS.1 report-back (commit + audit list) to co-confirm `--fork` removal provenance; my fence already proves the end-state is flag-free.
