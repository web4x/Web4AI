# Gating / Evidence Canon — the 11 rules (single DRY source; role SKILLs POINT here, never restate)

The scoreboard is only as honest as its gates. These rules keep credit tied to reality. Owner + enforcer per rule; every role is BOUND by them. Banked from the 2026-08-08 scoreboard-fiction session (73 provably un-backable markers found). Companion: `session/base-skills/agent-rewind.md` (the rewind/measurement canon — incl. the context.read calibration rule).

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

## R5 — IDENTITY IS MINTED, NEVER HAND-TYPED (R3's mint-side companion)
**Owner: req** (sole minter) · **Enforcer: architect** (fabricated-uuid detector)
> A unit's uuid is **MINTED** (cryptographically-random v4, e.g. `uuid4()`) at creation, and thereafter **copied ONLY from the minted unit on disk** — never hand-typed, sequenced, guessed, truncated, or copied from a **message / report / 8-char prefix**. A **patterned** identity — ascending nibble-pairs (`…-a1b2-4c3d-8e4f-…`), zero-blocks, or incrementing families (`16a010xx`, `17a00xxx`) — is **FABRICATED**: it can collide, cannot be traced to a mint, and silently poisons every chain that cites it. A **deliberate sentinel** (e.g. `00000000-…-0001` system-root, `a1d2e3f4-…-0001` M-root) is allow-listed, not fabricated. Fix a fabricated identity by **RE-MINT** (new random uuid + rewrite every ref via a **GATED migration** — dry-run + count), **never repair-in-place**.
>
> R3 governs how you **REFERENCE** an identity (full uuid, kind-stated, fail-closed); R5 governs how you **CREATE and COPY** one (minted, read from the unit on disk). **Read AND write identities in FULL, or the graph lies to you in both directions:** an 8-char prefix doesn't just risk crediting a foreign chain (R3) — it also **manufactures phantom defects** when you measure. Head-vs-tail of ONE uuid reads as "two duplicate Methods"; a prefix shared by two units reads as an "orphaned owner" or a "self-ref ownerIor." **Full uuids belong in dispatches, reports, and DESIGN DOCS too — not just in markers.** A peer cannot tell a *shortened citation* from a *truncated value*: an 8-char uuid written into a design doc travelled two hops as the fact "the Test is truncated" when the Test was simply **never minted**. "Doesn't resolve on disk" has distinct causes — **absent/un-minted · truncated · prefix-collided · orphaned** — each a different fix; **pin the cause before prescribing** (MINT ≠ RE-MINT). The spread vector is citing identities from prose (8-char prefixes in messages/reports/design docs) instead of the unit — so R5 closes the door R3 guards.
>
> Grounding: 2026-08-08 — a fabricated Impl uuid `e4f5b693-c1d2-4e3f-8a5b-6c7d8e9f0a1b` (ascending-pair) found poisoning task 54519bc4's chain; sweep found a fabricated **family** (real-8char-prefix + ascending-byte-pair tail: `e4f5b693-c1d2`, `3542dcb3-a1b2`, `01771d5b-a1b2`) plus hand-mint families (`16a010xx`, `17a00xxx`). Same session, f3 Test uuids were minted TRUNCATED (R3-violation in fresh work) — identity must be copied from the minted unit, never re-typed.

## R6 — CERTIFICATION-SCOPE (the other half of R4)
**Owners: req** (credit) **+ tester** (verification) · **Enforcer: architect**
> A Test proving only PART of its requirement pins a machine-readable **`certificationScope`** field: (1) **what IS proven + on which SURFACE** (real / harness / non-owner / owner-page / device), and (2) **what is NOT proven + why** (owner-gated / device-only / deferred). A Test with **NO `certificationScope` = a claim of fully-proven-as-specified** — so its absence is itself a claim that must be TRUE. R4 says evidence must be able to fail; **R6 says the evidence's SCOPE must be declared** — a Test can be able-to-fail yet quoted for a surface it never touched, and scope-of-evidence closes that hole.
>
> Grounding: S40 2026-08-08 — R40.1 security-proven-by-construction but its UI is owner-page-pending; the Test pins that split rather than reading as fully-proven. (req learning `a78c98d2`)

## R7 — CONTRADICT WITH EVIDENCE (binds EVERY role, not a specialist)
**Owner: all roles** · earned 2026-08-09, the highest-value failure of the S40 session
> **Never comply over proof.** When your evidence — a Tron quote, a commit, a measurement, a file you can read — contradicts the PO or a peer, **PRODUCE IT IMMEDIATELY and do not proceed. The evidence wins.** Push back **HARDEST on a destructive or corrective order** — that is exactly when compliance is most expensive. And raise a correction as a **QUESTION first** ("did Tron authorise this? show me"), because a question invites the evidence and an accusation suppresses it.
>
> **The incident (the why):** the PO declared Tron's WODA.test user migration "UNAUTHORISED" because the authorisation was not in the PO's *own thread* (rewound 3+ times that day — **absence-in-memory is NOT evidence-it-never-happened**), corrected the expert for a violation it never committed, and **ordered a REVERT of work Tron wanted.** The expert HELD Tron's actual authorisation in its own thread AND DID NOT PRODUCE IT — it accepted the correction and moved toward the revert; only Tron's *"WTF, I authorized that!!!"* stopped it (and only because the revert script hadn't shipped). Two failure halves, both bound by this rule: **(a)** treating absence-in-my-memory as proof-of-absence; **(b)** compliance-over-evidence, which turns ONE wrong inference into DESTROYED work.
>
> **The standard to normalise:** the same day, the tester refuted a truncation theory with a source read and REFUSED a phantom stale-version gate — both saved real work. **That** is the behaviour we want from every role.

## R8 — AGREEMENT IS NOT VALIDATION
**Owner: all roles** (esp. tester + anyone authoring a gate/criterion) · earned 2026-08-20
> A new criterion **agreeing** with a fresh reader, predictor, or its own author proves **nothing** — **correlated error hits readers, predictors, AND rule-authors alike.** Validate a new gate/criterion against results you have **ALREADY SEALED** (committed + independently verified earlier), never against a fresh agreement produced inside the same frame. Two agents converging is not truth; a match against pre-sealed evidence is. (R2 says the gate must be able to fail; R8 says the *test of the gate* must be against sealed reality, not consensus.)

## R9 — A NOTE IS NOT A REQUIREMENT (count UNITS, not files/notes)
**Owner: req + planner + po** · **Bound: all roles that count progress** · earned 2026-08-20
> A line in a `context.md`, a message, or a design note is **NOT a requirement** — **only a MINTED unit on disk is.** Count **UNITS** (minted req / task / UC / Method / Impl / Test), never files or notes. A note states an intention; a unit is the traceable, gate-able, fail-able artifact. A note cannot fail (R4), so it certifies no progress — reporting notes as done-work inflates the board with things no gate can touch.

## R10 — STORE THE INPUT, NEVER THE DERIVED VALUE
**Owner: all roles** · earned 2026-08-20
> Persist the **COMMAND / INPUT** that produces a value, never a cached **derived** value. Derived values **go stale the instant their inputs change**; the input regenerates the current value on demand. A stored derived number becomes a lie that fires wrong actions — **a stale relayed context-% ordered a rewind of an already-cut agent** (and `idle/active` was read as evidence of *level*, which it never is: motion ≠ context-%). If a cache is unavoidable, store it **WITH its input + a re-derive path**, and re-derive at decision time.

## R11 — SERVED==COMMITTED PROVES BUILD-MATCHES-COMMIT, NOT PROCESS-CURRENT
**Owner: tester + po** (deploy gate) · earned 2026-08-20
> A `served == committed` check proves the served bundle matches the commit — it does **NOT** prove the running PROCESS is current. A fix committed **without a version BUMP** is INVISIBLE to the guard: identical reading before AND after the fix, so GREEN proves nothing changed. Evidence: prod served `0.8.116` == committed = GREEN, yet the server process (uptime ~36h) PREDATED the fix = **stale code behind a green guard.** A deploy must **BUMP the version** (not just restart) so the fix is provable, and you **VERIFY the running process is current** (pid-uptime + version bump) — never trust `served==committed` alone. A gate that reads identical whether or not the work happened is **vacuous** (R2 family). Companions: [[version-bump-mandatory-on-client-fix]] · [[server-change-needs-boot-check]] · [[measure-a-stable-state-not-a-moving-target]].
