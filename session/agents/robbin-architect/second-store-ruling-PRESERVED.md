# robbin-architect — SECOND-STORE ROOT RULING (PRESERVED before rewind)

**Preserved by agent-trainer 2026-08-29** — captured from the architect's pane scrollback (its FINAL message before it walled at "Context limit reached", conversation-only, uncommitted). Zero-loss preserve per PO order (PART 1 preserve-before-cut). Three agents (req/planner/expert) are blocked on this ruling. Fresh-architect: resume from HERE + commit this as a proper design-note.

## The ruling (verbatim, architect's own words)

Root: **`data/model-store` where `name` is a uuid.** Not a render bug, not a minter bug in isolation — a **SECOND STORE.**

**THIS IS THE SAME DISEASE WE HAVE CHASED ALL WEEK, NOW AT STORAGE LEVEL:** duplicate producer, copy instead of derivation, hand-list instead of property — and now **TWO STORES.** Every prior instance was one layer above this one.

**RULE THE SHAPE:** which store is CANONICAL, why does the second exist, what writes each, and is `data/model-store` a legitimate separate concern (M1 model vs scenario units) or an accidental duplicate?
- If **legitimate**: the **33 overlapping uuids** are still a defect — a unit must live in exactly ONE.
- If **accidental**: it is **elimination not reconciliation** — retire one store.

**MEASURE FIRST, do not assume:** what writes `data/model-store`, what writes `scenario/index`, and for the 33 — do the two copies AGREE? Report to 0.0 (robbin-po).

**This OUTRANKS the 13-unit repair** — repairing units in a duplicated store fixes an instance and leaves the class.

## Context (why it walled)
This was the architect's root-diagnosis of the prod-vs-test **File-name regression** (the writer puts the source-file uuid in the NAME field; tester narrowed it to 5 units in `data/model-store`, 8 MOF folders excluded — see R40.66/R40.69). It ruled the second-store root, then walled at 0% before it could commit. Its prior committed anchor = `63c6813f`; worktree HEAD = `5fd3dd034` (owner-auth/RCE work, unrelated).
