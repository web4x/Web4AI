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

**report-back (oosh-expert `90f6768`, dev)** — `bash -n` clean; tester fence already GREEN (`d126aa3`, 0 signature-flag violations / 8 scripts, confirms `--fork` gone).

- **`--fork` — already flagless (provenance)**: MEASURED `git log -S'--fork'` → removed in **`c6033dd`** "teams.restore: positional 'fork|join' arg instead of --fork flag" (task-c1-hivemind-cold-start-restore.md). Current state: `hiveMind.teams.restore() # <?snapshotFile> <?mode:join|fork> <?sessionFilter>` (positional), and `teams.migrate` drives it via `hiveMind teams.restore fork` (hiveMind:4067) — no `--`. 0 literal `--fork` in the OOSH scripts. Acceptance #1 satisfied by prior work; co-confirmed here.

- **Flag audit (8 scripts: hiveMind otmux claudeCode ossh odocker oo config this)** — 116 raw `--` hits triaged into:
  - **FIXED in-scope (hiveMind, this commit `90f6768`)** — stale `--apply` in DOCS advertising a non-existent flag (a user typing `--apply` gets it silently mis-parsed as `$1` session). The real form is flagless positional `apply` / the object.verb `consistency.reconcile.apply`:
    - `hiveMind:5301` help echo `consistency.reconcile --apply` → `consistency.reconcile.apply`
    - `hiveMind:4998` comment `via --apply` → `via positional 'apply'`
    - (`consistency.reconcile()` signature itself was already flagless: `<?mode:dry-run|apply>`.)
  - **FILED-FOR-TRIAGE (out of hiveMind scope — PO opening as follow-up)**:
    - `otmux:685` `otmux.layout.restore() # <session> <?force> …(force value: --force …)` — the `<?force>` param accepts the soft-VALUE `--force`. Not a dispatch flag but a `--`-shaped value; PO confirmed filed, non-blocking for #5.
  - **NOT violations (external-binary flags — legitimately excluded)**: `claude --resume/--fork-session/--model` (claudeCode:452/474/493), plus `git`, `ssh`/`scp`/`rsync`, `docker`, `apt`/`brew`, `tmux` flags throughout. These are flags of the wrapped external tools, not OOSH method signatures/dispatch — OOSH wrappers are *allowed* to pass them through.
  - **Net OOSH-method-signature violations remaining**: **0** (only the otmux soft-value filed above), matching the tester's fence.

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
## #33 REPORT-BACK — otmux `--force` soft-value → clean sentinel (oosh-expert `553b19a`, dev)
`bash -n` clean (otmux + hiveMind); **0 `--force` anywhere** across all 8 scripts after the change. Behavior preserved (pass `force` to overwrite an existing session; anything else → refuse).
- **`otmux.layout.restore`** — every `--force` touchpoint cleaned to the positional `force` sentinel: signature doc (685), usage string (690), the guard check `[ "$force" != "force" ]` (702), the error + warn messages (703/706), and the completion `completion.force() { echo "force"; }` (771).
- **Caller** — the ONE call site that passed the value: `hiveMind:3543` `otmux layout.restore "$sess" --force` → `… force`. (The other two call sites, hiveMind:3546/4695, pass no force arg — unchanged.)
- **Clean break** (not dual-accept): kept NO `--force` literal, so the tester's soft-flag budget drops **1 → 0** = true zero flags. `otmux layout.restore.completion.force` now offers `force`.
- **Tester (E-FLAGS.2)**: re-run `test/test.no.flags` with triage-budget **0** (was ≤1); the `otmux --force` VALUE line is gone. Expect the fence still 0 signature violations AND soft-value budget 0.

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

---
## ✅ PO QA-GATE SIGN-OFF — oosh-po@MacStudio, 2026-07-02 — #5 CLOSED (PASS)
I inspected the diffs myself (F44), not just the report-backs:
- `90f6768` (E-FLAGS.1): clean 2-line doc fix `consistency.reconcile --apply` → `.apply` (object.verb). ✓
- `c6033dd` (provenance, Apr): `teams.restore` flagless positional `# <?snapshotFile> <?mode:join|fork> <?sessionFilter>`; body `fork)`/`join)` case arms; `teams.migrate`/remote drives `hiveMind teams.restore fork`. ✓
- dev `hiveMind` BODY grep: ZERO residual `--fork`/`--apply` (bodies, not just signatures). ✓
- `d126aa3` (E-FLAGS.2): `test/test.no.flags` — real 6-case fence (signature params-block grep/9 scripts + no-`--fork` + flagless-fork-path + positional fork/join + migrate-drives-it + triage-budget). 6/6 GREEN MacStudio + live WODA.test. ✓

Acceptance: ALL met. Audit = 116 raw hits triaged → 0 OOSH-signature violations; net-new this task = the stale-`--apply` doc fix + the regression fence (--fork was already flagless since c6033dd). 1 soft flag-value (`otmux --force`) filed → **follow-up #33**, not a blocker. dev only (dev=master), no promote.

---
## E-FLAGS.2 UPDATE — triage budget 0 after #33 (oosh-tester, 2026-07-02) — ✅ GREEN, dev `75250dc`
Re-ran `test/test.no.flags` after expert's `553b19a` (otmux `--force` value → clean `force` sentinel). Tightened the triage fence **budget 1 → 0**.
- **signature-flag violations = 0** (unchanged) — no method declares a `--flag` param across all 8 scripts.
- **soft flag-value comparisons = 0** (was 1) — the last filed item (`otmux:702 [ "$force" != "--force" ]`) is gone; confirmed `grep --force` = clean.
- **6/6 GREEN** on MacStudio AND live WODA.test (dev checkout).
The fence now fails on ANY reappearance of either a signature `--flag` param OR a `--value` param comparison → Death-to-Flags is fully fenced with zero budget. Acceptance (tester side): T-NO-FLAGS GREEN, regression fence at budget 0, zero behavior regression.

---
## ✅ PO QA-GATE SIGN-OFF #33 — oosh-po@MacStudio, 2026-07-02 — CLOSED (PASS)
Inspected diffs myself (F44), not the expert's self-report:
- `553b19a`: `otmux.layout.restore <?force>` value `--force`→`force` sentinel across check + usage + error/warn + completion + the one hiveMind caller; behavior identical. Grep: ZERO `--force` in otmux AND hiveMind. ✓
- `75250dc` (tester, co-confirm): `test.no.flags` triage budget tightened 1→0 (`softCount -eq 0`) — the fence is now a TRUE zero-flags guard (any signature `--flag` OR soft `--value` fails it), green both envs. ✓

**Death-to-Flags (#5 + #33) FULLY DONE:** true zero flags across all 9 oosh scripts; permanent regression fence at budget 0. dev only (dev=master), no promote. (Unrelated: `?? macos/` untracked in the once.sh dev tree — noted, not part of this thread.)
