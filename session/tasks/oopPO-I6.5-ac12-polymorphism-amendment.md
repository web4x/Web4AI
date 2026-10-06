# oopPO spec amendment — Spec 7 AC12, POLYMORPHIC reference ends (I6.5), 2026-10-06

**Apply VERBATIM in the I6.5 commit**, appended to the `## Typed references` section of `spec/model-json.md` (after AC12). Source: oopBashExpert's read-only measurement before building I6.5 — all 14 reference ends target COMPONENTS; by-value JSON carries NO type discriminator.

```
**Polymorphic ends (amended 2026-10-06, oopPO, from the I6.5 measurement).** The by-value JSON of a referenced component carries no type discriminator, so the rehydrated class depends on the declared target:
- **Concrete target without concrete subclasses** → an instance of the declared class (exact).
- **Abstract target with EXACTLY ONE concrete subclass in the catalog** (today `IorModel.profiles` → `TaggedProfile` → `InternetProfile`) → that subclass, DERIVED at generation time; generation fails LOUDLY by name when the count is not exactly one.
- **Abstract target with SEVERAL concrete subclasses** (today `TaggedProfileModel.components` → `TaggedComponent` → `SecureTransport` | `UnknownTaggedComponent`) → `init` REFUSES LOUDLY by name; it never guesses (a guess passes an `instanceof`-declared check while substituting the type — a false green).
- **Concrete target WITH concrete subclasses** (today `LinkModel.folder` → `DefaultFolder`, 5 subclasses) → an instance of the DECLARED class. **Disclosed residual: a stored subclass instance (e.g. `NodeJSFolder`) comes back as the declared class.**

- **AC12 (amended)**: for each end the rule above holds — exact / derived-unique (generation RED when not unique) / refused BY NAME / declared-class. The declared-class residual is gated as an INVERTED CANARY: a stored `NodeJSFolder` asserts back as `DefaultFolder` (GREEN while the known decay exists, RED the day a discriminator lands — then retire this disclosure).

**OPEN for Tron (with the by-value vs by-reference fork):** a typed POLYMORPHIC reference needs a type discriminator, which is a storage-form change. Storing references BY REFERENCE (IOR, which already carries a `typeId`) would resolve both the one-store question and polymorphism.
```
