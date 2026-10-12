# P2 ambiguity — D1 package rule vs P2a "no data change" (oopBashExpert → oopPO, 2026-10-12)

**Measured** (clone on `1195d5ea`, `M1Catalog.ts:227-231`): today the package rule is `namespace === name`; the package `Web4MDA` has namespace `Web4MDA`.

**Conflict:** plan P2a applies D1 to rows 2–4 and must stay green with no data change. Under D1 the package is the one class whose qualified name `namespace.name` prefixes every namespace. Today that name is `Web4MDA.Web4MDA`, which prefixes nothing → D1 finds **0** packages → refuses → RED. D1 only matches **after** the P2b migration (package namespace `com.ceruleanCircle` → qualified name `com.ceruleanCircle.Web4MDA`).

**Options**

- **R1 (recommended).** In P2a every reader consumes ONE derived `packageQualifiedName()`. Package identity keeps the old rule in P2a; the qualified name = the package's own namespace (today `Web4MDA`). P2b flips `packageModel()` to D1 **in the same commit as the data migration**, gated RED-first. No two-branch transitional rule ever lives in code.
- **R2.** P2a applies D1 now and changes ONE value: the package Definition's namespace `Web4MDA` → `''`, so its qualified name is `Web4MDA`. D1 is green before and after, but this breaks P2a's no-data-change premise and touches the package's generated `namespace` and its stored IOR.

Reader code is identical under both; only the `packageModel()` / qualified-name derivation differs. I keep building the readers meanwhile.

**→ RULED R1 by oopPO.**

---

## Q2 — five hand-typed registry keys the plan's inventory missed (AC9 scan, RED-first, measured on `a91033ce`)

The AC9 derived scan (`literal-namespace` guard) found `Mof.loadedClass('Web4MDA.Ior')` — a hand literal of Ior's registry key `<namespace>.<Name>` — in 5 runtime body lines: `UcpUnit.ownIor` ×2, `UcpUnit.toReference`, `UcpUnit.fromReference`, `ScenarioIndex.ior` (Definitions `UcpUnitDefinition.ts:240,242,252,278`, `ScenarioIndexDefinition.ts:347`). The plan's row 11 says these classes need "no logic change", but P2b moves Ior's key to `com.ceruleanCircle.Web4MDA.Ior`, so all 5 break — and P2b's G2 forbids writing the new literal. They must be derived. They run at runtime with no catalog, so `packageQualifiedName()` can't reach them.

- **L2 (recommended):** `Mof.loadedClassNamed('Ior')` — Mof (the registry owner) answers the ONE loaded class with that name; 0 or more than 1 (twins) → refused by name. The 5 sites ask by NAME; no namespace is spelled anywhere.
- **L1:** build the key from a known neighbour's namespace (e.g. the caller's own) — couples Ior's location to an unrelated class; a `move()` of Ior breaks it silently. Not recommended.
- **L3:** NAME and COUNT them as an AC9 exception until P4 (Ior typing) — but P2b breaks them first, so this only defers a RED.

