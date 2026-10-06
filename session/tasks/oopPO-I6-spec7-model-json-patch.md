# oopPO spec patch — Spec 7 (spec/model-json.md): TYPED REFERENCES (I6 D2), 2026-10-06

**Apply VERBATIM in the I6 plan commit** (on top of oopTester's I6 red gate ref). Spec is the PO's; the builder applies, never rewords. Ruled fork (ii): typed rehydration lives in the SHARED `init(json)`, so the JSON path and the OOSH `.env` path get it from ONE place (generic behaviour in the shared component).

## Edit 1 — AC3 is class-aware (line "AC3 — round-trip")
Replace:
```
- **AC3 — round-trip**: `init(m.toJSON())` deep-equals `m` on all attributes; seed a lossy `toJSON()` → RED.
```
with:
```
- **AC3 — round-trip** ~~deep-equals~~ **is CLASS-AWARE (tightened 2026-10-06, oopPO, from I6 D2):** `init(m.toJSON())` equals `m` on all attributes **including the class of every object-valued attribute** (a structural deep-equal is GREEN while a reference has decayed to a plain `Object` — measured by oopTester on `LinkModel.ior` / `.folder`); seed a lossy `toJSON()` → RED; seed a rehydration that returns a plain object → RED.
```

## Edit 2 — new section, inserted before `## Ownership`
```
## Typed references (oopPO, 2026-10-06 — from I6 D2)

A model attribute that refers to another component or unit is declared by a **relationship end** in the model's Definition (e.g. `LinkModel`: `ior → Ior 0..1`, `folder → DefaultFolder 0..1`). The shared `init(json)` is the ONE place that rehydrates it:
- **set, 0..1** → an INSTANCE of the declared target class, resolved by NAME through the catalog (never a hand table);
- **set, 0..n** → an array of such instances;
- **unset** → the key is OMITTED on write (`JSON.stringify` already omits `undefined`) and the attribute takes its default on read — never a throw.

The storage FORM is unchanged (a referenced component is stored as its JSON, BY VALUE). **Whether a reference should instead be stored BY REFERENCE (uuid / IOR) is OPEN — a Tron decision tied to the one-store law and the held store; nothing here decides it.**

- **AC12 — typed references, every path**: for every concrete model class with a reference end (list DERIVED from the catalog), a set reference round-trips as `instanceof` its declared class through BOTH `init(json)` and the OOSH `.env` reader (`OoshUnit`), and an unset reference round-trips without a throw; seed a reader that returns a plain object → RED; seed `JSON.stringify(undefined).replaceAll` → RED by name.
```
