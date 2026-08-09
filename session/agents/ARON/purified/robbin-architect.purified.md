# robbin-architect — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
**Traceability model**
- Chain = 6 steps Req→UC→Class→Method→Impl→Test; Task is NAVIGATION (Sprint→Task→coveredRequirements), never a chain hop. Chain root = Requirement, nav root = Sprint.
- Three concerns never conflated: Chain (WHY, forward-only) / Dependency (WHAT-first, DAG in `follows`) / Navigation (HOW-browse). Forward-only is absolute — answer "which req covers X" by walking every Requirement's forward arrays, never a stored reverse pointer.
- Champagne = structurally reachable AND a test declares it in `verifies[]`; report against the honest denominator (strip orphan-by-design/infra reqs).
- Schema asymmetry: `ownerIor` is UNIT-level (sibling of `ior`/`model`); everything else under `model`. Reading `model.ownerIor` false-flags a whole chain broken.
- A UC carries `class`(singular IOR) AND `classes[]`(plural — walker reads plural) AND `method` AND `ownerIor`=Requirement; empty `classes[]` fans out all methods.
- `[impl:uuid]` credits only AST-attached to a decl whose NAME equals the Impl's method; label grammar strict `[impl:uuid:<u>] R<n> Class.method`. A Class's stable identity is its sourceFILE, not its name — one Class per sourceFile.
- Ref-slot registry: uuid-shaped ≠ graph-edge — classify auth tokens OUT, non-`*ior*`-named edges IN; derive reachability + dangling from that one reviewed registry. Repoint STRUCTURAL slots only, never string-replace over evidence prose; gate on structural-ref-position→0.
- Dedup survivor = the protected/active-chain (marker-carrying, most-refs, live) unit — never the heuristic winner (most-methods); UNION all child arrays; gate on conservation. Two-key dedup: fuzzy key ranks; strong domain key authoritative; strong-key MISS-but-present PROVES distinctness → mint.

**Design / security**
- Credential: separate confidentiality (encrypt to device pubkeys) from authenticity (sign by identity); a challenge-signed possession-proof is NOT a bearer token; gate on REJECTION (stolen/forged/expired/revoked all fail); fail closed on unreachable issuer.
- SSRF: adversarial-battery gate on rejection; PIN the vetted IP at connect (re-resolving = DNS-rebind TOCTOU); normalize IPv4-mapped IPv6. Authorization strength = who can PRODUCE the signal (signature > unspoofable identity > typeable field); state the tier honestly.
- "At least X" is a FLOOR; modal words matter. Resolvable ≠ correct-referent (outbound ssh client vs inbound sshd — semantic-fabrication).

**UI / render**
- A render feature needs THREE layers: renderer reads the field + API exposes it at the child level + data populated. A new unit TYPE needs tagMap + per-type detail component + list icon + preview router, or the drawer silently degrades.
- Match the gate to the bug's physics. iOS/touch: `e.target` not `elementFromPoint`; double-tap requires `touchend touches.length===0`; touch listeners on the handle only; prefer in-flow bounded over `position:fixed`. Async/duplicate messages → one-shot callbacks (clear before invoke). Decrypt-exception must never fall through to destructive overwrite.

**Process / ops**
- Tron is NOT the tester (tester's reproducible measurement is the gate; Tron's device = FINAL acceptance). Architect mints UC+Class+Method ONLY — never Tasks (planner's) — wires into the planner's existing Task.
- otmux send/commit strings = plain text (no backticks/`$()`/`%`); OOSH wrappers only. "Ask X how" = consult the teammate for the method, apply it yourself. No artificial char limits (Tron).
- Over-deference is the mirror of standby: hand over already-correct work done-for-verification (ownership = who decides, not whose fingers). A peer's request (even a real bug) is not authorization to leave the pin; findings (measure→hand off) ≠ design (own→spec).

## 2. Repetitions → collapse
- Verify expert impl vs design; execute normalizer on adversarial inputs; full-uuid never 8-char (truncated reads INVENT phantoms); read full wiring before asserting a gap; already-implemented audit before designing; device telemetry beats guesses → **[measure-never-assume]**
- Markdown is generated views, units are source; DRY-unify/single config/one parser; dedup on the stable key; extraction-without-removal (old duplicate grepped GONE) → **[one-truth-one-source]**
- FAIL-LOUD `unresolved:<ior>` not a spinner; a referenced-but-absent UC breaks the pin SILENTLY (no-crash is the danger); a dropped uuid should crash the reader → **[fail-loud]**
- Never verify by reading the field you just wrote; a self-scoped self-reassert is structurally blind; the PDCA harness itself can lie — cross-check a NEGATIVE against code; the second eyes must measure by a DIFFERENT method → **[independent-verify]**
- Post-rewind read disk not the conversation summary; a moved repo is invisible until a path op fails; git-verified re-derivation over any saved copy → **[disk-wins]**
- Repair clear-scope must match the CI gate's detect-scope (shared predicate); a validated PLAN gate isn't enough — re-emit post-mutation conservation actual==predicted → **[rule/gate-that-never-runs]**
- Gate on REJECTION not acceptance; a number that changes with assumptions is DESCRIPTIVE — gate on conservation invariants; prove the harness on known-good AND known-bad → **[evidence-must-be-able-to-fail]**
- Banked-then-repeated the exact ownerIor/circular-verify miss on my OWN hot-path; slipped on backticks-in-send I'd banked → **[rule-exempts-author]**
- send+Enter to an idle/mid-rewind pane RESUMES it = wall risk (check state first); 2-phase rewind never a fork; "HOLD is the instruction" — don't spin burning context → **[walled=cannot-self-save]**
- Scenario-first NEVER backfill (a backfill IS proof-of-violation); correct code with no impl-marker is still chain-orphaned; your-hop-your-status → **[wer-schreibt/commit]**

## 3. Contradictions
- **7-step vs 6-step chain.** Authoritative: **6-step** (Task = navigation; the 7-step caused the task↔req alternation).
- **Canonical-selection heuristic** (most-methods → marker-carrying → final): Authoritative = **canonical = LIVE/most-refs; marker preserved by a MERGE-CONSTRAINT, not by making the marker-unit canonical.**
- **`requirements[]`-empty as a metric.** Authoritative: **forward-walk reachability from roots** — empty `requirements[]` is correct.
- **sprintName-lag** (vs planner): Authoritative = **planner** — every Task unit must carry `model.sprintName`.
- **ownerIor location** (vs req): Authoritative = **UNIT-level** (`j.ownerIor`).
- **f2f84ce3 dead vs alive** (vs req): Authoritative = **disk-wins for PRESENCE** (present: 8 methods, 11 resolving refs).
- **R-C7 sprint safety** (vs expert): Authoritative = **the mechanical prover** (only S23 apply-ready).
- **reuse-Class vs mint** (vs planner): Authoritative = **key on where the code is DEFINED** — minting the first Class for a genuinely-new file is correct.
- **name-merge guard** (vs Tron): Authoritative = **Tron/source** — "do not duplicate companies"; my no-domain guard was over-spec.
- **drawer "always peek"** (vs Tron): Authoritative = **Tron's "AT LEAST peek"** (a floor — preserve expand).
- **stale context vs disk.** Authoritative = **disk** (R31.5 was board-complete).
