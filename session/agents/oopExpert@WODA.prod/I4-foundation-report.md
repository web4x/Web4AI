# I4 foundation gate — render(load(D)) == D: MEASURED, STOP for a conform ruling

*oopExpert@WODA.prod, 2026-10-05, branch `oopExpert-I2-dep` @ `eba88d4` (tree clean; probes kept outside it in `/root/oopExpert-patches/i4/`).*

## The measurement (the real path: each Definition IMPORTED, `new XDefinition().model` rendered)

**43 / 103 literals reproduce byte-identically** with a renderer that writes:
- the keys in **model declaration order**
- strings always
- booleans only when `true`
- arrays and records only when non-empty
- `typeArguments` and `typeParameters` inline
- `body` one line per element

**60 / 103 do not.** Every difference is in how the text is written, or is information the JSON state does not hold; none is a different model value:

| # | Difference | Files | Nature |
|---|-----------|-------|--------|
| 1 | Strings double-quoted where single quotes suffice (`type: "string"`, `returnType: "Promise<this>"`) | most of the 60 | style of an older emitter |
| 2 | Key order inside MethodModel/AttributeModel differs from the model's declared order (`visibility` written last, `isGetter`/`isAsync` moved) | many | older emitter's order |
| 3 | An empty array written out: `parameters: [\n ],` (48×) | several | hand/older-emitter artifact |
| 4 | **`//` comments INSIDE the literal**: 15× `// instanceOf: RECORDED in git history bb0656d^ …`, 1× `// instanceOf: an M2 language class is an instance of M3Class` | 16 | **information outside the JSON state** |
| 5 | **A class-specific second doc-comment line** (e.g. "CORBA type_id: …. Spec 14 I1.") | 21 | **information outside the JSON state** |
| 6 | Import block not derivable: type imported but unused, or `AttributeModel` before `ClassModel` | 15 | hand-written header |

Rows 1–3 and 6 carry no information, so canonicalising them loses nothing. Rows 4 and 5 are information, and **no pure renderer can reproduce them**, because they are not in the model.

## Proposed conform (needs your ruling: it rewrites 60 model sources)

**C1 — move rows 4 and 5 INTO the model, so nothing is lost.**
- Every model already inherits `description` (ItemModel, default `'a Web4MDA unit'`), and no literal writes it today.
- The class doc line becomes `ClassModel.description`.
- Each `// instanceOf: …` note becomes the `description` of the RelationshipModel it annotates.
- The renderer writes `description` only when it differs from the default, and renders the doc line from it.
- Effect: the JSON state carries ALL the information, which is the step toward Tron's model/scenario JSON tree.

**C2 — one-time canonicalisation.** Write `render(load(D))` over every non-identical D, with a **semantic-equality PROOF**: `JSON.stringify(load(conformed)) == JSON.stringify(load(original))` for all 103 (after C1 makes rows 4 and 5 data). Model values are unchanged, and only the text form converges.

**Then the foundation gate holds by construction:** `render(load(D)) == D` byte-identical, 103/103, failable by a seeded drift. It also guards against regression: a future hand edit in a non-canonical form turns it RED.

**Alternative C1′:** drop rows 4 and 5 to git history; they are provenance notes, and the commit `bb0656d^` is already cited. This is simpler, but it loses the text from the source tree. I recommend C1.

## What I need
A ruling: **C1 + C2** (recommended), or C1′ + C2. After that I build `DefinitionSource` (a catalogued M1 class), the conform, the proof gate and the foundation gate. I report that, and only then start `move()`. Local, no push.
