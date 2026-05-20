[Back to Task SC-D](./task-sc-d-reconcile-cycle.md)

# Task SC-D.1: Expert — consistency.fix + consistency.reconcile
[task:uuid:8798a104-3da7-4da0-86f8-3c7819a86736]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (built on top of SC-A.1 diff + SC-A.2 audit)
  - [x] creating test cases (handed off to SC-D.3 tester)
  - [x] implementing — commit `1df1973`
  - [x] testing (live: reconcile + audit + fix all return CLEAN; dry-run/apply paths exercised)
- [x] QA Review
- [ ] Done (pending SC-D.3 tester roundtrip coverage)

## Deliverable

**Commit:** `1df1973` (pushed to test/macos.latest)

**Three methods landed** (architect drafted, expert reviewed + smoke-tested + committed):

1. `hiveMind consistency.fix <?session>` — interactive y/N applier.
   Calls `private.hiveMind.reconcile.diff` for the diff, shows audit-style human
   report, prompts before mutating. Aborts on anything other than y/Y/yes/YES.
   Returns 1 on abort, 0 on apply success.

2. `hiveMind consistency.reconcile <?session> <?mode:dry-run|apply>` — silent
   batch reconciliation. **Dry-run default per U3 PO-lock**. Outputs single
   `reconcile: N violations (C=x H=y M=z L=l)` line. Exit code = total violation
   count (so SM-cycle can detect change-over-time).

3. `private.hiveMind.reconcile.apply` — apply primitive. Reads diff lines on
   stdin in canonical 7-field format. Dispatches per `(store, op)`:
   - S1:REMOVE — grep -v pane from registry
   - S2:REMOVE — grep -v pane from sessions
   - S2:UPDATE — grep -v + append `${pane}|${liveUuid}` (cache refresh)
   - S3:REMOVE — grep -v from teams.env
   - S6:REMOVE — `rm <queue file>` (actual = path)
   - S8:REMOVE — prefer `tronMonitor remove` (View-cleanup aware); raw-file fallback
   - I5/I7 — SKIP (snapshot stale + display-truth need human attention)

**OOSH compliance:**
- No `--flag` args (T-ARCH-5) — `mode` is positional `dry-run|apply`
- No raw tmux (T-BOUNDARY-4) — none used
- S8 path goes through View layer (`tronMonitor remove`) not direct file edit
  when possible — keeps screen window cleanup atomic with file mutation

**Smoke verified live:**
- `consistency.audit` → `✓ CLEAN — all 7 invariants pass` exit=0
- `consistency.reconcile` → `reconcile: clean (0 violations)` exit=0
- `consistency.reconcile "" apply` → `clean (0 violations)` exit=0 (idempotent)
- `echo n | consistency.fix` → `✓ CLEAN — nothing to fix` exit=0

Mutation paths exercised only by no-op (state clean) — SC-D.3 tester needs to
inject violations and verify each (store, op) actually mutates correctly.

**Legacy preservation:** Sprint 0's hand-rolled `consistency.fix` renamed to
`consistency.fix.table` and tagged LEGACY in its header. Kept for diagnostics.

## Description
**Role: oosh-expert**

Implement two public methods on top of SC-A diff:
- `hiveMind consistency.fix` — apply diff after y/N prompt (interactive)
- `hiveMind consistency.reconcile <?--apply>` — apply silently when `--apply`,
  dry-run otherwise (default per U3)

Both share SC-A.1 primitive. Difference is just human prompting vs flag-gated.

*Sprint 1 · Epic SC-D*
