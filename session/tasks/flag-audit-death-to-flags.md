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
