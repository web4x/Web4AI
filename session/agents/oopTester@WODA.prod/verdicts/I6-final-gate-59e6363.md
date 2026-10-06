# oopTester verdict — FINAL I6 GATE on 22bf912 → local ref `oopTester-I6-final-gate` = 59e6363 (2026-10-06)

**VERDICT: GREEN — 680 = 678 / 0 / 2** (isolated clone /root/.claude/jobs/914c8cad/tmp/i6, full suite, JSON reporter).
Base measured first: 22bf912 = 676 = 671 / 3 / 2 (oopPO's number confirmed; the 3 RED = my 3 known arms).
Lineage: 22bf912 ⊃ 3b2d9df and ⊃ b9a003f (my I6 gate ref). Test files only (4), src 0. Shared Web4MDA main untouched (d729ecd, 0 dirty). Pushed NO remote.

## (1) Pinned arms re-seeded by INJECTION + seed AUDIT
- OoshExecute (A): a COPY of the generated script equals the real run (output + rc); the copy with its entry call REMOVED does not; precondition: the entry call is present EXACTLY once (else the seed is vacuous).
- TypedReferences AC12 seed: a STUB model whose `toJSON` throws is reported BY NAME (`SeededThrowingModel [json]: TypeError: …`); unseeded FileModel base clean.
- **AUDIT: 136 seed arms checked** (every `it` titled failable/seed in the 57 test files carrying `oopTester`).
  - **2 relied on a product defect** → the 2 above, fixed.
  - **0 others**: measured — only these 3 arms were RED on 22bf912 (a seed on an already-fixed defect would be RED); plus a defect-vocabulary pass over all 136 bodies: 4 hits, all injected.
  - Fixed beyond the order: `M3Class` import-gate seed depended on M1Catalog HAPPENING to import M2 → injected scratch source (GREEN control + seeded `/M2/` seen). `Spec` ARM2: gate and proof now share ONE predicate `linksIndex` (the proof had tested a literal, not the gate's code).
  - **DISCLOSED, not changed (oopPO call):** `Spec` ARM4 failable (2) + (5) seed on `OoshUnit` existing in src — an incidental product fact; `StatusTable` reads the real fs with no injectable root (decoupling = a gate-machinery change). ARM4 (5) now names its violations in its message.
  - Heuristic limit disclosed: an injection marker does NOT clear a seed (the old AC12 arm had `class … extends` and still relied on the bug) — hence the two measured passes above.

## (2) SET arm per AC12 amendment a64bf146 + fixes 5c63ce0f
Ends CLASSIFIED from the catalog (never a hand list; brief-named ends asserted present): exact / derived-unique (must come back as THE unique subclass) / several subclasses → `init` REFUSES BY NAME (message names `Model.end`, the target and EVERY subclass) / declared-class residual.
INVERTED CANARIES, json + oosh: `LinkModel.folder` ← `NodeJSFolder` comes back `DefaultFolder`, `RepositoryIdModel.namespace` ← `Version` comes back `Namespace` (GREEN while the decay exists; RED the day a discriminator lands → retire canary + disclosure). Every buildable subclass of each derived residual is exercised. Refusal + canary predicates failable by INJECTION (fabricated wrong messages / instances rejected).

## (3) NOT A WEAKENING — two builder edits, measured independently
- M3Class AC5 `.resolving(catalog)`: (a) every catalogued class WITHOUT reference ends renders byte-identical bare vs resolving (>40, none changed) — resolving adds nothing that could mask drift; (b) for EVERY model the catalog resolves (derived; ⊇ LinkModel, TaggedProfileModel, IorModel) the resolving render carries `get referenceEnds()`, reproduces its committed src, and a hand-edit OR a removed getter seeded into a COPY is RED (each seed asserted applied). Closes a gap: AC5's own failability arm only proves the BARE path (FileServer).
- M2AbstractRelationship scratch-Node `.resolving(catalog)`: expected literals byte-identical b9a003f..22bf912 (diff), green there bare and here resolving → same rendered bytes; no assertion loosened.

## (4) Bare render refuses loudly
Every concrete class WITH `contains` ends (derived; ⊇ the 3 named), rendered WITHOUT the catalog in TS + ES2020, throws naming the class, every end and "never silently omitted". Failable by INJECTION (a plain model copy renders; the same copy + one injected end refuses by name).

## Product seeds (clone only, each measured RED then reverted)
1. refusal message missing `UnknownTaggedComponent` → SET arm RED. 2. generated odocker entry call stripped → (A) RED by its exactly-once guard. 3. bare-render refusal disabled → (4) RED "RENDERED (silent omission)" per holder.
Instrument incidents caught, not reported as results: a vitest run from the component dir collected 0 tests; a title apostrophe made Spec.test.ts unparseable while the run still printed "15 pass" (M3Class only) — both re-run from root with per-file counts.
