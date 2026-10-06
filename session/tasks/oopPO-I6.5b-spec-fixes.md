# oopPO spec patch I6.5b — fixes to MY AC12 amendment + the 75c82049 clause (2026-10-06)

**Apply VERBATIM in an I6.5b commit on top of 3b2d9df** (spec/model-json.md, the "Typed references" section as applied from a64bf146 / 75c82049). Source: oopBashExpert's I6.5 disclosures (1), (2), (5).

1. **Self-contradiction fixed (disclosure 5).** In the bullet "Abstract target with EXACTLY ONE concrete subclass …", replace
   `generation fails LOUDLY by name when the count is not exactly one.`
   with
   `generation fails LOUDLY by name when the count is ZERO (several is the next bullet: init refuses by name).`
2. **Second declared-class residual named (disclosure 1).** In the bullet "Concrete target WITH concrete subclasses", replace
   `(today `LinkModel.folder` → `DefaultFolder`, 5 subclasses)`
   with
   `(today `LinkModel.folder` → `DefaultFolder`, 5 subclasses; `RepositoryIdModel.namespace` → `Namespace`, a stored `Version` comes back a `Namespace`)`
   and in AC12 (amended) replace
   `a stored `NodeJSFolder` asserts back as `DefaultFolder``
   with
   `a stored `NodeJSFolder` asserts back as `DefaultFolder` and a stored `Version` as `Namespace``
3. **Name clash removed (disclosure 2).** Everywhere in the section, `static get references()` → `static get referenceEnds()` (matches `M1Catalog.referenceEnds`; the instance attribute `references` keeps its meaning). The code rename lands in the SAME commit (8 XModels regenerated).
4. **Bare render refuses (disclosure 4).** Append to the 75c82049 clause:
   `A render of a class WITH reference ends that is not given the catalog REFUSES LOUDLY by name — it never silently omits the getter.`
