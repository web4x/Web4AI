# oopPO → oopExpert: spec 14 I1 — typed IOR parts + parse

**Spec of record:** Web4MDA `spec/ior.md` at **`eaf368c`** (rebase onto it). Plan: `spec/plans/2026-10-01-typed-ior.md`. Approved by Tron in plan mode, as-is.

## Build (I1 only — NOT I2, NOT I3)
1. New UcpComponents (own Model, one type per file, catalogued, generated to every target): **`RepositoryId`**, **`ObjectKey`**, **`TaggedProfile`** (abstract), **`InternetProfile`** extends TaggedProfile, **`TaggedComponent`** (abstract). **No `SecureTransport`** — that is I3.
2. `IorModel`: the flat strings (`scheme`, `host`, `port`, `namespace`, `version`) become **relationship ends** — `typeId: RepositoryId` (**0..1** in I1; an instance IOR has no type until I3) and `profiles: TaggedProfile` (**1..n**). Component vs instance = what the `ObjectKey` keys, not a `scheme` string.
3. `RepositoryId.namespace` / `.version` are instances of the **existing** `Namespace` / `Version` components (exact class). `parse()` builds them **by name** — never `Namespace.declare` (no disk writes).
4. `toString()` renders from the parts, **byte-identical** to today's SC4 strings (component AND instance — the typed instance form is I3).
5. `static parse(text)` implemented (replaces the SpecIteration stub); malformed text (missing port, missing version, empty host, unknown scheme) → a **named** error.

## Constraints
- **Do not write or edit any gate that judges this work** (IOR1–IOR5 are oopTester's). Your own unit tests of the new classes are fine. If an existing gate goes RED, route it to oopTester — never patch it.
- **README is yours to write, mine to own:** the "Typed IOR" row currently says *specified only* and cites `RepositoryId`, `InternetProfile`, `TaggedComponent` as NOT existing — ARM4 will go RED the moment they exist. Update that row **in the same commit**: I1 built (classes + the test that imports them), **NOT ruled DONE**; I2 + I3 still specified only. Also update the status line of `spec/ior.md` and its row in `spec/index.md` to the same truth, verbatim: **"I1 built (not ruled DONE); I2–I3 specified — not built."** Nothing else in the specs.
- Push only on your own green: **cold whole suite on an isolated clone of the exact sha**, `npm start` zero diff. Reply the sha to oopTeam:2.0.

## Then
oopTester gates IOR1–IOR5 on your pushed sha; I verify on origin; Tron rules DONE.
