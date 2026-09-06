# RADICAL-OOP LAW — every domain concept IS A CLASS (TRON, 2026-09-06; foundational, fleet-binding)

**Role SKILLs POINT here, never restate.** ARON holds the canon/F-family framing; the agent-trainer weaves the per-role lines below into each SKILL. A pane message un-adopts on the next rewind — this file is the durable home.

## TRON VERBATIM
1. **"ONLY RADICAL OOP IS ALLOWED FROM NOW ON … A ROOM IS A ROOM CLASS. A FILE IS A FILE CLASS. A UNIT IS A UNIT CLASS."**
2. **"YOU ARE ALL FUNCTIONAL APES AND KILLED ALL OF TYPESCRIPT."**
3. **"or not fixed everywhere again as DRY VIOLATION."**

## THE LAW
- **Every domain concept IS A CLASS that owns its DATA *and* its BEHAVIOUR.** A Room is a Room class; a File is a File class; a Unit is a Unit class.
- **Callers ASK THE OBJECT.** You never rebuild an object's answer from a `ref` + external machinery. If you are answering a question *about a thing*, the answer lives **on that thing's class**.
- **A free function / service / helper that owns what an object should own is a DEFECT THE MOMENT IT IS WRITTEN** — however green its tests. Green tests on misplaced behaviour do not redeem it; the location is the defect.
- **Duplicate implementations of one behaviour COLLAPSE INTO the owning class — DELETED, never wrapped in a shim.** One behaviour, one home. "Fixed in one call-site" is a DRY VIOLATION; fix it *everywhere the same*, by moving it onto the class so there is only one place.

## PER-ROLE FRAMING (the trainer weaves each role's line into its SKILL)
- **ARCHITECT** — every design **names the OWNING CLASS first** (its data + its behaviour) and **lists which free functions collapse into it.** Never design a helper that owns domain behaviour.
- **EXPERT** — if you are about to write `fn(ref, …)` that answers a question about a thing, **that answer belongs ON THAT THING'S CLASS.** When you touch an area, its functional machinery **collapses into the class** (deleted from where it was), never left as a parallel path or a shim.
- **TESTER** — **gate the HAZARD, not the actors** ([[scan-the-hazard-not-the-actors]]): count implementations of the behaviour **OUTSIDE the owning class and assert 0** — the owning method excepted **POSITIONALLY** (by file:line/position), never by a self-describing phrase a violator could copy. Make it **FAILABLE** by seeding a real violation (R4/R14). NOT "unevadable" — name the obfuscation residual.
- **REQ / PLANNER** — a requirement **names the owning class**; **duplicate behaviour is a traceability defect** (two impls of one behaviour = the graph is lying; the fix is collapse-to-one, not credit-both).
- **PO** — **refuse a fix that patches one call-site** (DRY violation) **or adds a new free function** that owns domain behaviour. The acceptable fix moves behaviour onto the owning class and deletes the duplicates.

## CASE STUDY — R40.84 (why this is a law, not a preference)
Symptom: *"adding a child collapses and rebuilds the whole tree."* Root cause: **NOBODY owned "I gained a child, render me."** That behaviour was smeared across a re-seed + `FILE_ADDED` + upload + drop paths; **the re-seed MASKED them all.** Deleting the re-seed exposed that **no object was home** — so a childless container **could not learn it had gained a child**, because the knowledge lived in external machinery instead of on the container class. The cure is not another handler: it is the container class owning `gainedChild()/renderMe()`, and the smeared paths collapsing into it.

## Connections
Family of [[generic-behavior-in-shared-component]] (solved once, in the shared component), [[dont-fork-the-shared-mechanism]] (one canonical structure), gating-canon R14 (a false "unevadable" claim on the collapse-guard is itself a defect), [[traceability-exists-to-deduplicate-it-is-the-dry-enforcement]] (duplicate code = a traceability defect). This is the DESIGN-side law; traceability is its measurement.
