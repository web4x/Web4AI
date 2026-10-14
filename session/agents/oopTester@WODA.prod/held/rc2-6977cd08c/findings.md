# ROOT CAUSE 2 (oopPO 10-14) — tests that hand-list catalog classes — PREPARED, NOT RUN

Subject: landing `preserve/oopBashExpert-r3r4-landing` @ **6977cd08c** (fetched ref only; shared tree untouched). Slot = oopBashExpert's (root cause 1); I run these files only after it releases.
Files: `orig/` = byte copies via `git show 6977cd08c:<path>`; `new/` = edited; `rc2.patch` = repo-path diff of the 3 files (5 hunks). `git apply --check` was DENIED by my sandbox twice — patch is diffed from the byte copies, so it applies to 6977cd08c by construction; NOT type-checked, NOT run.

## Rule used: derive from GROUND TRUTH, never from the subject itself
`catalog.abstractClasses()` IS `M2AbstractClass.createExisting` (src L35), and the S2 derivation IS `partEnds()` (M1Catalog.ts L1118: relationships kind=part on Model descendants). "Deriving" the expected value from those = the code tested with itself (green by construction). So each oracle is an INDEPENDENT source:

| test | was | now (oracle) | prediction @6977cd08c |
|---|---|---|---|
| M2AbstractClass "creates the existing abstract M1 classes" | 18 hand names | committed source DECLARES `export abstract class <Name>` (class `AbstractOnDisk`), floor 18 + anchors Interface/Model/UcpComponent | GREEN (19 = disk) |
| M2AbstractClass NEW seed | — | catalog flips Model to concrete → created set ≠ disk oracle | GREEN (seed is caught) |
| M1Catalog S2 "partEnds DERIVES exactly what rule C names" | 7 hand members | spec/model-json.md rule C's OWN enumeration ("— today `…`"), parsed + expanded; parser verified offline = exactly the old 7 | **RED — real FINDING** (below) |
| M1Catalog S2 seeds `toHaveLength(7)` | 7 | length of the UNSEEDED catalog's members | GREEN |
| MofIncorporating "stored types are exactly the 6" | 6 hand names | spec rule C's DEFINITION as property: every stored type is a ModelUnit and never a UcpUnit; floor 6; ClassModel present; unique; ImportModel absent | GREEN (7, incl StateModel) |
| MofIncorporating TOTAL+UNIQUE map | 6-entry hand map | keys = derived stored set; every answer a named component; Tron pin ClassModel → M2AbstractClass | GREEN iff StateModel has ONE incorporating component; else THROWS = T5's defect (M2AbstractState binding), not masked |

## FINDING (spec drift, for oopPO — spec owner)
Code @6977cd08c has **8** part ends: the 8th is **`ClassModel.states → StateModel`** (committed ClassModel.ts L48 `partEnds()`). spec/model-json.md rule C still says "today" 7 — `states` absent. The re-pointed S2 stays RED until EITHER the spec names `ClassModel.states` (then GREEN with no test edit, ever again) OR the code drops it. Not something a test edit should decide.

## TestPlacement — NOT edited (gates working, not stale lists)
gate (a) misplaced tests (4), gate (c) RATCHET (`UNTESTED_BASELINE`), H5m-3 central test strongly asserting PartsStorage: these are placement/ratchet gates on the landing's NEW tests/components. A ratchet DERIVED from the tree is green by omission — it must stay a pinned list that only shrinks or is raised by an oopPO ruling. Fix belongs to the landing authors (move/add tests); I name the exact offenders when I may run TestPlacement.
