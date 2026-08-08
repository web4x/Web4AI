# Gating / Evidence Canon — the 4 rules (single DRY source; role SKILLs POINT here, never restate)

The scoreboard is only as honest as its gates. These four rules keep credit tied to reality. Owner + enforcer per rule; every role is BOUND by them. Banked from the 2026-08-08 scoreboard-fiction session (73 provably un-backable markers found). Companion: `session/base-skills/agent-rewind.md` (the rewind/measurement canon — incl. the context.read calibration rule).

## R1 — NO-SILENT-GATE-REMOVAL
**Owner: PO** (governance) · **Bound: all roles** · **Watchers: planner + tester**
> A failing consistency gate is the gate **WORKING**. Never remove or weaken a gate to green CI — **fix the DATA**, or make the gate **report-only-LOUD**. Any removal requires a **COMMITTED justification naming exactly what supersedes it**; an uncommitted gate deletion is a CI-level false-green.

## R2 — META-BITE / STUB-MUST-FAIL
**Owner: tester** · **Consumer: architect** (backstop)
> Every gate must **PROVE IT CAN FAIL**: assert that a **silent-stub version** of the guard it checks FAILS the suite, add **drift-injection cases** (empty / drifted / clean), and name the **vacuous FAMILY**, not one instance. A check that still passes when the feature is broken or absent **certifies nothing**.

## R3 — FULL-UUID, NEVER AN 8-CHAR PREFIX
**Owner: req** (sole minter) · **Enforcer: architect** (fail-closed resolver)
> Identify units by **FULL uuid** and state **WHICH KIND** (task / req / UC / Method / Impl / Test). An 8-char prefix is not an identity — prefix resolution must be **FAIL-CLOSED on ambiguity** and never silently pick, or a real Test gets credited onto a foreign chain.

## R4 — EVIDENCE MUST BE ABLE TO FAIL
**Owners: req** (credit) **+ tester** (verification) · **Enforcer: architect** (AST-attach gate)
> **NAME-verified is not SCOPE-verified.** A cited Test confers credit only if it is **AST-ATTACHED to a specific assertion** AND that assertion **exercises the claimed scope**. A marker in a bulk file-top comment credits a **FILE, not a behaviour**. Classify **fail-closed toward lower credit**: **PROVEN-COMPLETE** / **UNPROVEN** (suspend, re-attach) / **PROVEN-FICTIONAL** (deny + a real test must be WRITTEN).
>
> Grounding: 387–652 markers measured, **73 provably un-backable** (pigeonhole: markers > `it()`-blocks), 7 of 11 audited A1 rows vacuous or mis-scoped.
