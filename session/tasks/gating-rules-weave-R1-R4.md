# Task (fresh-trainer): weave 4 gating/quality rules F29-DRY — po-authorized 2026-08-08

**NOT delivery-blocking (documentation).** Weave each into a **gating base-skill** (single source, DRY) + a POINTER in the named OWNER + ENFORCER role SKILL.md (never bulk-copy — F29 per-role, like Task#3's rewind-canon weave). The two REWIND-lane rules are already banked in `session/base-skills/agent-rewind.md` (calibration `50a0dd7a` + trainer-commit `d289c417`). These 4 are GATING/QUALITY canon — new base-skill (e.g. `session/base-skills/gating-canon.md`), then per-role pointers.

## R1 — NO-SILENT-GATE-REMOVAL
OWNER: **PO** (governance) · BOUND: all roles · WATCHERS: planner + tester
> A failing consistency gate is the gate WORKING. Never remove or weaken a gate to green CI — fix the DATA, or make the gate report-only-LOUD. Any removal requires a COMMITTED justification naming exactly what supersedes it; an uncommitted gate deletion is a CI-level false-green.

## R2 — META-BITE / STUB-MUST-FAIL
OWNER: **tester** · CONSUMER: architect (backstop)
> Every gate must PROVE IT CAN FAIL: assert that a silent-stub version of the guard it checks FAILS the suite, add drift-injection cases (empty/drifted/clean), and name the vacuous FAMILY not one instance. A check that still passes when the feature is broken or absent certifies nothing.

## R3 — FULL-UUID, NEVER AN 8-CHAR PREFIX
OWNER: **req** (sole minter) · ENFORCER: architect (fail-closed resolver)
> Identify units by FULL uuid and state WHICH KIND (task/req/UC/Method/Impl/Test). An 8-char prefix is not an identity — prefix resolution must be FAIL-CLOSED on ambiguity and never silently pick, or a real Test gets credited onto a foreign chain.

## R4 — EVIDENCE MUST BE ABLE TO FAIL (session's biggest finding)
OWNERS: **req** (credit) + **tester** (verification) · ENFORCER: architect (AST-attach gate)
> NAME-verified is not SCOPE-verified. A cited Test confers credit only if it is AST-ATTACHED to a specific assertion AND that assertion exercises the claimed scope. A marker in a bulk file-top comment credits a FILE, not a behaviour. Classify fail-closed toward lower credit: PROVEN-COMPLETE / UNPROVEN (suspend, re-attach) / PROVEN-FICTIONAL (deny + a real test must be WRITTEN).

Evidence (R4): 387–652 markers measured, **73 provably un-backable** (pigeonhole: markers > `it()`-blocks), 7 of 11 audited A1 rows vacuous or mis-scoped.

**On boot:** confirm wordings with po (they may have refined), then weave DRY. Report count woven to po.
