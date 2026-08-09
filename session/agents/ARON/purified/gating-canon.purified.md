# Gating Canon (R1-R7) — Purified Essence (ARON proposal, non-destructive)

## 1. The seven rules (one canonical line each)
- **R1 — no-silent-gate-removal** — a failing consistency gate is the gate *working*; fix the data or make it report-only-LOUD, never delete; any removal needs a *committed* justification naming what supersedes it (uncommitted deletion = CI-level false-green). Owner PO; watchers planner+tester.
- **R2 — stub-must-fail (meta-bite)** — every gate must prove it can fail: a silent-stub of the guard must break the suite; drift-injection cases (empty/drifted/clean); name the *vacuous family*, not one instance. Owner tester; architect backstop.
- **R3 — full-uuid-never-8-char (reference-side)** — cite units by full uuid + stated kind; prefix resolution is fail-closed on ambiguity, never silently picked. Owner req; enforcer architect.
- **R4 — evidence-must-be-able-to-fail** — name-verified ≠ scope-verified; credit only if the Test is AST-attached to an assertion that exercises the claimed scope; classify fail-closed (PROVEN-COMPLETE / UNPROVEN / PROVEN-FICTIONAL). Owners req+tester; enforcer architect.
- **R5 — identity-minted-never-hand-typed (creation-side, R3's companion)** — uuids are minted (random v4) then copied *only from the unit on disk*; patterned/ascending identities are fabricated; fix by gated re-mint, never repair-in-place; distinguish absent/truncated/collided/orphaned before prescribing. Owner req; enforcer architect.
- **R6 — certification-scope (R4's other half)** — a partially-proving Test must pin machine-readable `certificationScope` (what+surface proven, what+why not); absent scope = a claim of fully-proven that must itself be true. Owners req+tester; enforcer architect.
- **R7 — contradict-with-evidence (binds every role)** — never comply over proof; when your evidence contradicts PO/peer, produce it immediately and halt, hardest on destructive/corrective orders; raise as a question first ("show me the authorisation"). Absence-in-my-memory ≠ proof-it-never-happened.

## 2. Repetitions → collapse into canonical families
- **evidence-must-be-able-to-fail** = family head. R2 (a gate that can't fail certifies nothing), R4 (a marker that can't fail credits a file not a behaviour), R6 (undeclared scope is an unfailable claim) = the same invariant at three altitudes (gate / marker / scope). Canonical: *any credit-bearing artifact must be capable of failing and must name what would make it fail.*
- **one-truth-one-source + measure-never-assume**: R3 (never truncate on read) and R5 (never fabricate on write) are the two failure directions of one canon — *identity lives on disk, minted; read and write it in full, both directions.*
- **fail-loud / rule-that-never-runs**: R1 is the gate-specific instance — a silently removed gate is a rule that never runs; loud-not-silent (report-only-LOUD, committed justification).
- **independent-verify / rule-exempts-author**: R7 is the cross-role instance — no role (incl. PO) is exempt from producing evidence; the author of an order cannot substitute memory for proof.
- **disk-wins**: explicit in R5 ("copied only from the minted unit on disk") and implicit in R7's incident (a readable file beats rewound memory).

## 3. Contradictions / gaps
- **No hard contradiction R1-R7** — they interlock (R3↔R5 and R4↔R6 are complementary pairs, R7 the meta-binder).
- **★ Gate-defined-not-wired (the canonical `rule/gate-that-never-runs` risk, against this very file):** R2/R4/R5/R6 name enforcers, but the canon is flagged "NOT delivery-blocking (documentation)" — prose woven into SKILLs, not asserted running CI checks. The doctrine demanding *stubs-must-fail* is itself not wired to a suite that fails if a role ignores it. **ACTION: verify each named enforcer exists as a CI check, not just a pointer.**
- **DRY boundary thin** with `agent-rewind.md` (context.read calibration `50a0dd7a`, trainer-commit `d289c417`): R5/R7 lean on "absence-in-memory ≠ evidence" (a rewind concept). Add ONE cross-pointer, not parallel restatement.
- Task-file drift: `gating-rules-weave-R1-R4.md` covers only R1-R4 (its scope, DONE); canon grew R5-R7 — expected evolution, canon is the live source.
