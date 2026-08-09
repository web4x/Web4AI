# robbin-req — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
**Requirements craft**
- ASCII/text mockup stacking ≠ UI orientation — phrase layout ACs by relative position, never "line/row/column." Never specify character limits (Tron standing rule).
- Client+server feature = 2 methods = 2 UCs (walker reads `UC.method` singular; a 2nd method under one UC orphans).
- UC naming: Object.verb, domain-prefixed (UC-RM/API/ED), `<<include>>` for sub-flows.
- `model.name` = short ≤7-word plain name; `model.description` = verbatim quote; the two MUST differ (90 long names grandfathered). Identity is the uuid; `model.altId` is the runtime alias; rename the name-field only, refs survive.
- Chain FORWARD-ONLY 6-step Req→UC→Class→Method→Impl→Test; Task is NAVIGATION (`coveredRequirements[]`), not a link. Atomic one-sentence requirements, each a chain root.
- Verb×Noun cross-product gate: one AC per cell; signal "decomposition COMPLETE" before task-build.
- Scenario-first #126: unit on disk BEFORE code; reject a task lacking a scenario unit; a backfill = the rule already violated.
- Covered-vs-gap triage 3 buckets (covered+AC-explicit=impl gap / covered-AC-implicit=refine AC / genuine gap=new req) — resist minting new for every bug.
- Honest partial: unified req with `implStatus`+`deferredAcceptanceCriteria[]`; the tester's per-AC gate result — not a guess — drives any split.
- Provenance fields ARE the honesty: `tronQuote`/`poClarification`/`poDirective`/`discoverySource` — never fabricate a Tron quote.

**Mechanics**
- Every Tron-origin report leads `TRON DIRECTIVE: "<literal>"`. Stay in lane: capture requirement+uuid, report to PO; planner/PO decide placement.
- `[impl:uuid:X]` carries the IMPL uuid (=`Method.implementations[0]`), never the Method uuid; label `[MARKER=<impl-uuid>]`. `ownerIor` is UNIT-top-level (`j.ownerIor`), everything else under `j.model`.
- Delete the REFERRER (marker/ref) BEFORE the REFERENT unit; dry-run citer-count; refuse to delete a unit with live refs. A mint-go is retractable by a later HOLD; back out surgically, never `git checkout` a shared file.
- Tron ban: no `2>&1`, no `|tail`/`|head` on ANY command incl git + otmux. WODA.prod: `otmux send` hits `/dev/tty`; "sent" ≠ "delivered" — verify above a fresh prompt.

**Correct-by-construction**
- Build the VALIDATOR first for any format/naming class; scope it to the unambiguous marker to avoid false-flags. Pin the INVARIANT, not a proxy (name≠desc checks `desc ≠ the-copied-thing`, not byte-length).
- Sanctioned exceptions self-explaining: add legit patterned identities (M2 sentinel) to the detector's exclusion + inline `sentinelNote`. `certificationScope` absence = the claim "fully proven" that must be true.

## 2. Repetitions → collapse
- Full-uuids read+write; 8-char prefixes collide/mint phantom defects; measure code/disk/actual-pool before minting ("capture X" usually exists); CODE IS LAW → **[measure-never-assume]**
- Measure a unit by its uuid-NAMED file not grep; restore-point can be stale; two measures contradict → read raw bytes both sides; chain-complete = walk on disk → **[disk-wins]**
- One behaviour lives in ONE requirement; compound-source is verbatim INPUT only; dedup before uuid; downstream marker exists → unit ADOPTS that uuid; borrowed proof MOVES not COPIES → **[one-truth-one-source]**
- Two-key verify tester-minted Tests both directions; route complex ACs to code-owners for measured review → **[independent-verify]**
- A cited Test must ASSERT + be ABLE TO FAIL (9/24 fictional); probe/mock ≠ real-effect; absence-feature vacuously green where the thing never exists (split AUTOMATABLE vs DEVICE-ONLY) → **[evidence-must-be-able-to-fail]**
- The `[test]` marker had NO AST-attach rule → credited a FILE/comment-stack not an assertion → **[rule/gate-that-never-runs]**
- My own verifiers keep having the class-of-bug they exist to catch (`model.ownerIor`, length-proxy) — the check is wrong before the data → **[measure-never-assume]** (instrument turned on the author)
- `git add -A`/`<dir>` sweeps peers' work (162 files, 22×); explicit-paths + verify-staged; never rewrite PUSHED history → **[wer-schreibt/commit]**
- Rewind window: route ALL traffic for a rewinding pane through the driver; re-busying it can WALL it → **[walled=cannot-self-save]**

## 3. Contradictions
- **`requirements.md`: GENERATED vs HAND-MAINTAINED.** Authoritative: **HAND-MAINTAINED** (Tron-caught: `generate-sprint-md.ts` emits only planning.md+task-*.md; grep `requirements`=0). Context.md's "generated view" claim is stale.
- **Chain ownership: req-owns-full-chain vs req+UC-placeholder.** Authoritative: **single-minter** — a "PASS" that only wrote Req units is a phantom chain (architect measured disk).
- **Test-unit ownership.** Authoritative: **tester owns the Test unit** (bounded PO-accepted exception; req two-key verifies both directions).
- **Alt-symlink location: architecture.md vs shipped code.** Authoritative: **the code** (CODE IS LAW); flag drift.
- **Reuse-uuid: grep-hit vs architect's direct read.** Authoritative: **architect** — grep is discovery, never identity.
- **Dangling `f2f84ce3`: "stale baseline" vs "real dangling."** Authoritative: **split** — two units shared the prefix; the dangling target was REAL, the truncated label was wrong; full uuids both sides resolve it.
