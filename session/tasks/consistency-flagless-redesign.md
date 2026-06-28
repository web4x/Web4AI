# Task: flagless consistency.reconcile + non-interactive fix (Death-to-Flags)

**From**: oosh-po@MacStudio (first-principles guardian)  **Team**: WODA.prod ooshTeam  **Branch**: dev
**Priority**: HIGH (cardinal OOSH violation)  **Date**: 2026-06-28

## Why (the sin)
`hiveMind consistency.audit` advertises its own recovery as:
- `hiveMind consistency.reconcile --apply`  ← **FLAG**. OOSH "Death to Flags" violation.
- `hiveMind consistency.fix` — **interactive (y/N)**, aborts with no input → cannot run in SM-cycle/automation.

Guardian missed this (same class as the `--fork` miss, task #5). Both paths are broken: one illegal-flag, one un-automatable.

## What (architect finalizes object.verb shape — NO flags)
Replace the `--apply` flag + interactive y/N with a flagless, automatable design. Options for the architect:
- **A. object.verb split**: `consistency.reconcile` = preview/dry-run (read-only, default); `consistency.apply` = perform the fixes (silent, non-interactive). No flags, two clear verbs.
- **B. positional mode**: `consistency.reconcile <mode:preview|apply>` (default preview). One method, positional param, completion lists `preview`/`apply`.
Architect picks A or B (A preferred — cleaner object.verb). Either way: **zero `--flags`, zero interactive prompts** (automation/SM-cycle must run it unattended).

Also retire/redirect the interactive `consistency.fix` to the new flagless path (keep a deprecation alias if needed, but the canonical path is flagless + non-interactive).

## Guard (so this never recurs)
Add **T-NO-FLAGS**: a test that greps ALL hiveMind (and ideally all oosh) public method signatures + usage strings for `--` flag patterns and FAILS if any are found. This is the durable CMM4 guard (gaps become sprints). Folds in task #5 (`--fork` on teams.restore/migrate) — audit + remove every `--flag` across oosh methods.

## Constraints (OOSH first principles)
- NO flags anywhere. object.verb, camelCase params, self-documenting doc comments, `.completion.<param>()` for completable params.
- Non-interactive by default (no y/N that blocks automation); if confirmation is wanted, a positional `confirm` token — never a prompt that hangs headless.
- Human-readable errors. DRY (one reconcile engine; preview vs apply differ only in write-or-not).

## Owners (WODA.prod ooshTeam, dev)
| Role | Owns |
|------|------|
| oosh-architect | Design: choose A/B, the flagless verb(s), preview-vs-apply contract, deprecation of interactive fix. Write design here. |
| oosh-expert | Implement in hiveMind on dev: flagless reconcile/apply, retire `--apply` + interactive y/N; sweep+remove ALL `--flags` (incl. `--fork`, task #5). |
| oosh-tester | T-NO-FLAGS grep guard (fails on any `--flag` in method sigs/usage) + T-RECONCILE (preview makes no change; apply reconciles; non-interactive). |
| oosh-po (0.0) | Drive + QA: verify `consistency.audit` recovery advice shows NO flag; reconcile runs unattended; T-NO-FLAGS green. |

## Acceptance
- [ ] `consistency.audit` recovery advice contains NO `--` flag
- [ ] Reconcile runs **unattended** (no y/N, no flag) — usable in SM-cycle
- [ ] `--fork` removed from teams.restore/migrate (task #5) + every other oosh method flag gone
- [ ] T-NO-FLAGS green (guards all oosh method sigs/usage)
- [ ] T-RECONCILE green (preview=read-only, apply=writes, both non-interactive)
- [ ] Committed + pushed on dev

## Report-back (owner edits + commits + pushes)
- oosh-architect:
- oosh-expert:
- oosh-tester:
- oosh-po (QA):
