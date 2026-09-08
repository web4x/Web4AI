# TRON ORDER (2026-08-12, verbatim-anchored) — S37 "consistency by design", PRIORITIZED, work OVERNIGHT

**PO captured at ~89% context. Source = Tron's message + 2 screenshots (/model tree drag → detail empty; in-room Heartspaces file detail).**
**His closing instruction: "add all these changes to consistency by design and prioritiye them" and "do that in sprint 37 as new task and fix them overnight".**

## A — DnD BUFFER MUST CARRY THE ACTUAL SCENARIO UNIT, NEVER A URL/WEBITEM
Observed when dragging the /model tree files:
- `#collection.show?uuid=dir:public`
- `#collection.show?uuid=dir:public/ts`
- `#collection.show?uuid=file:src/public/ts/DeviceEnrollDialog.ts`
**Tron: "this is what happens if i drag and drop the files from the screenshot. but this is generally wrong."**

### A1 — a FILE must drag as a FILE, not a collection
> "`#collection.show?uuid=file:src/public/ts/DeviceEnrollDialog.ts` SHOULD be a file. not a collection. like `#file.show?uuid=63462717-…`"

### A2 — NEVER a webitem/URL in the DnD buffer — ALWAYS the unit
> "in all cases NEVER `#webitem.show?uuid=799a0e7b-…` or anything like this shall be in the DnD buffer but the actual scenario unit"
> "INSTEAD OF `#file.show?uuid=b9fa43a2-…` THIS { "ior": "ior:class:File", "ownerIor": null, "model": { "uuid": "5fbed155-922c-4120-a5b3-e8c523e41ea0", "name": "b9fa43a2-…", "location": "b9fa43a2-…", "kind": "file", "sourceFile": "ior:file:b9fa43a2-…" } } **ALWAYS**."
⇒ The buffer payload is the **scenario UNIT JSON**, not a link, not a `*.show?uuid=` URL. (This is why cross-instance drops produced plain-URL WebItems.)

### A3 — File details must render for all files
> "and with it the File details are shown for all files."
> "also the details view dont show anything. on all of them." (screenshot 1: every /model tree selection → empty detail)

## B — ROOM COLLECTIONS MUST BE REAL FOLDER UNITS (with sunburst detail)
Observed in-room: `#collection.show?uuid=members-6c04f959-…` → **"no scenario"**; `#collection.show?uuid=files-6c04f959-…` → **"no scenario"**.
> "the Files from the second screenshot should be a real FOLDER … a real scenario-unit for folder with sunburst diagram details… **find the corresponding task**."
⇒ Members/Files pseudo-collections become REAL Folder scenario-units; folder detail renders a **sunburst diagram**. ★ There is an EXISTING task for the sunburst/folder detail — FIND IT and wire to it rather than minting a duplicate (verify-owner-first).

## C — IOR MUST CARRY A CLEAR ORIGIN (cross-instance DnD: WODA.prod ↔ WODA.test)
> "To drag and drop between the WODA.prod and the WODA.test instance IORs have to be enhanced."
FROM: `"ior": "ior:class:WebItem"`
TO e.g.:
```json
"ior": { "ior:class:WebItem://prod.wo-da.de:4444/scenario/index/d/f/a/9/2/dfa9263a-7460-447a-9bad-8bbb0d37ef0d.scenario.json" }
```
> "it should have a clear origin."
⇒ IOR = class + ORIGIN HOST + unit path. Relates to the existing federated-IOR work (`ior:instance:<uuid>@<originHost>`) — reconcile, do NOT fork a second origin scheme (single-source law).

## D — SERVER MANAGER ROOT MUST BE DISCOVERED, NOT HARDCODED
> "in the server manager on WODA.test the root is still the hardcoded WODA.prod, but it must be discovered from the files like ssh config like the otmux tree items… not been hardcoded."
⇒ Discover the root host from real config on disk (ssh config etc.), the same way otmux tree items are discovered. A hardcoded host is the fragile-heuristic class we keep killing.

## EXECUTION
- **Sprint 37** (consistency-by-construction). NEW task(s). **PRIORITIZED.** Work **overnight**.
- **Scenario-first (#126)**: req mints requirement(s)+UC(s)+task(s) BEFORE any build.
- Likely 4 requirement clusters: A (DnD carries units + file-not-collection + details render), B (room collections → real Folder units + sunburst), C (IOR origin), D (discovered server-manager root).
- **Device ACs @390 stay Tron's** (tag AC-N-DEVICE per convention so the approve-queue device-scan catches them).
- Full uuids everywhere. Guards stay. Gates must be able to fail (stub-must-fail).

## ★ SCOPE AMENDMENT (Tron, immediately after): **"this affects the onDrop to diagramms and everywhere else"**
The unit-carrying DnD contract is **NOT drawer-local**. It applies to **EVERY drop target**, explicitly including **onDrop to DIAGRAMS**, and "everywhere else":
- drop onto a **diagram** surface (place a unit on a diagram)
- drop into a **room** (files/webitems)
- drop into the **/model tree** / collections / folders
- drop into the **editor / detail drawer**, and any future target.
⇒ **DESIGN CONSEQUENCE (single-source, mandatory):** ONE shared drop contract — the payload is the scenario UNIT, produced ONCE by a shared serializer and consumed ONCE by a shared deserializer/resolver. Every target reuses it; **no per-target payload format, no per-target parsing, no `*.show?uuid=` URL fallback anywhere**. A per-target implementation is the same duplication disease as the per-view action if-chains R40.37 just removed ([[generic-behavior-in-shared-component]]).
⇒ **GATE CONSEQUENCE:** the BITE must assert the contract PER TARGET (diagram · room · tree/collection · editor/drawer), plus **stub-must-fail** (make the serializer emit a URL again -> assert RED), so a target that regresses to a link is caught by construction.
