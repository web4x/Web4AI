# RADICAL-OOP DOCTRINE — the consolidated standing-law family (TRON, 2026-09-06; foundational, fleet-binding)

**Role SKILLs POINT here, never copy.** ARON holds the canon/F-family framing (doctrine principle #8); the agent-trainer weaves the per-role lines below into each SKILL. A pane message (or a boot-context line) un-adopts on the next rewind — this file + the doctrine + the SKILLs are the durable home. Tron extended this THREE times in one day; it is **ONE doctrine**, not five notes.

## TRON VERBATIM
- **"ONLY RADICAL OOP IS ALLOWED FROM NOW ON … A ROOM IS A ROOM CLASS. A FILE IS A FILE CLASS. A UNIT IS A UNIT CLASS."**
- **"YOU ARE ALL FUNCTIONAL APES AND KILLED ALL OF TYPESCRIPT."**
- **"scenario unit json IS THE MODEL AND THE ONLY THING TRANSFERED IN REST AND ANY OTHER TRANSPORT"** — with the exemption: **"sure native files come as multipart binaries in but then become scenario units within the system."**
- **"we screwed it functional; reevaluate it oop, then it cannot not self heal."**
- prior: **"or not fixed everywhere again as DRY VIOLATION."**

## THE DOCTRINE (5 connected parts — one law)
1. **ONLY RADICAL OOP.** Every domain concept IS A CLASS owning its DATA *and* its BEHAVIOUR (a Room is a Room class, a File is a File class, a Unit is a Unit class). Callers **ASK THE OBJECT** — never rebuild its answer from a `ref` + external machinery. A free function/service/helper owning what an object should own is a **DEFECT THE MOMENT IT IS WRITTEN** (however green its tests); duplicate implementations of one behaviour **COLLAPSE INTO the owning class — DELETED, never shimmed** ("not fixed everywhere" = a DRY violation).
2. **MIMETYPE-CLASS-FIRST.** A mimetype IS A CLASS; it owns `isBinary` / `parser` / `load` / `saveAsScenarioUnit`. All DnD (and content) dispatch goes **through the MimeType class**, never a content-type parsed as a string at a call site. The **natural classes** are `WebItem` / `Image` / `Email` / `Contact` / `CalendarEntry`.
3. **TRANSPORT IS THE SCENARIO.** The scenario-unit JSON **IS the model and the only thing transferred** — in REST and any other transport. REST = *REpresentational State Transfer*: the unit **IS the representation**. There is **NO transport layer / no invented wire format.** ★ EXEMPTION: native files legitimately enter as **multipart binaries ONLY at the ingress edge**, and are **converted to scenario units at once** — the binary never propagates inward.
4. **EVERY CLASS HAS TRACEABILITY + CHECK-BEFORE-CREATE.** A class without a traceability unit does not exist for the graph; before minting, check it isn't already there (duplicate = a traceability defect).
5. **SELF-HEALING EMERGES BY CONSTRUCTION.** Self-healing is not a handshake you bolt on — it FALLS OUT of the OOP model. Tron killed the functional 419-handshake: "reevaluate it oop, then it cannot not self heal." If you find yourself writing a recovery protocol, the model is wrong.

## PER-ROLE FRAMING (the trainer weaves each role's cue into its SKILL; full text lives HERE)
- **ARCHITECT** — every design **NAMES THE OWNING CLASS first** (data + behaviour), lists which free functions collapse into it, and routes content/DnD through the **MimeType class**; the transport is the scenario unit (no wire format); self-healing must emerge from the model, never a bolted-on handshake.
- **EXPERT** — if about to write `fn(ref, …)` answering a question about a thing, that answer belongs **ON THAT THING'S CLASS**; a content-type is a **MimeType object**, never a string parsed at a call site; you transfer **scenario units**, converting a multipart binary to a unit **at the ingress edge only**; functional machinery collapses into the class on-touch (deleted, not shimmed).
- **TESTER** — **gate the HAZARD, not the actors** ([[scan-the-hazard-not-the-actors]]): count implementations of the behaviour **OUTSIDE the owning class and assert 0** (owning method excepted **POSITIONALLY**, never by a self-describing phrase); assert **no content-type-as-string** and **no non-unit payload past the ingress edge**; make each **FAILABLE** by seeding a real violation (R4/R14; NOT "unevadable" — name the residual).
- **REQ / PLANNER** — a requirement **NAMES THE OWNING CLASS** (and its mimetype/natural class where relevant); duplicate behaviour is a **traceability defect** (collapse-to-one, never credit-both); check-before-create.
- **PO** — **refuse** a fix that patches one call-site (DRY violation), adds a new free function owning domain behaviour, invents a transport layer, or parses a content-type as a string. The acceptable fix moves behaviour onto the owning class and deletes the duplicates.

## TEACHING CASE — the week-long iOS upload outage (connects all 5)
The upload broke for a week because a **content-type was parsed as a STRING at a call site** (violates #2 — it should be a MimeType object owning its own parse), **inside a transport we invented that was not the model** (violates #3 — the unit is the representation; there is no wire format), and the recovery was a **functional 419 handshake** we bolted on (violates #5 — self-healing must emerge from the model). Root of R40.84 is the same disease (violates #1): nobody owned "I gained a child, render me" — it was smeared across free functions + a re-seed that masked them all. **One doctrine, one cure: put the behaviour on the class it belongs to; the duplicates and the invented machinery collapse and disappear.**

## Connections
[[functional-constructs-are-defects-by-definition-the-general-law]], [[object-owns-its-answer-dont-pull-it-into-external-machinery]], [[traceability-exists-to-deduplicate-it-is-the-dry-enforcement]], [[scenario-unit-is-the-mvc-model-of-every-class]], [[generic-behavior-in-shared-component]], [[dont-fork-the-shared-mechanism]], [[scan-the-hazard-not-the-actors]], gating-canon R14 (never over-claim the collapse-guard). ARON: doctrine principle #8 carries the SAME consolidated text.
