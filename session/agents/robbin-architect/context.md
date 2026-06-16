# robbin-architect Context (Save 2026-06-16 pre-rewind-2)

## STATUS: Active — R20.29 tree-surface root-cause IN PROGRESS
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert(idle, waiting on this design) | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## GIT-VERIFIED
- HEAD: 03d617855 (robbin-architect: R20.22 review + CR1 + R20.23-27 design-ahead)
- Version: v0.6.52+
- Working tree: clean (scenario units committed)

## #1 PRIORITY: R20.29 tree-surface fix design (UNFINISHED)

PO directive: /trace tree renders 0 method/impl/test though data IS backfilled (362/369 Methods have implementations[], 270/347 Impls have tests[]). Expert at 0.2 is IDLE waiting on this design.

### Root-cause analysis (MEASURED, in progress):

**Data layer: CORRECT.** populate-forward-refs backfilled:
- Method.implementations[]: 362/369 populated
- Implementation.tests[]: 270/347 populated
- Test.gates[]/testCases[]: 74/357 populated

**Server endpoint: CORRECT.** /api/trace/children reads CHAIN_TYPE_CONFIG fwdKeys (Method→implementations, Impl→tests). Resolves child UUIDs from model arrays. Computes hasChildren from forward arrays. No type filtering blocks Implementation/Test (expectedChildren is correct).

**Client tree: WHERE THE BUG LIKELY IS.** rb-trace-tree.ts:
- Line 346-350: when `chainMethod` is set (Class→Method shortcut from UC context), tree renders Method with `children=[]` and `hasChildren=true` but does NOT pre-fetch.
- Line 344: on expand, if `!loaded` → calls `fetchAndRenderChildren` which fetches `/api/trace/children/<uuid>`.
- Line 490: `buildSeedNode(child.uuid, child.type, child.name, [], child.hasChildren, ...)` — children ALWAYS passed as `[]` on lazy-load, relying on `hasChildren` for the expander.

**HYPOTHESIS (not yet verified):** The `hasChildren` value from the server may be `false` for Method children because the hasChildren computation at server.ts:788-789 checks:
```
['tasks','useCases','classes','methods','implementations','tests','children']
```
For an Implementation unit, `implementations` is checked (wrong — Implementation doesn't HAVE implementations, it has `tests`). BUT `tests` IS in the list. So `hasChildren` should be true if tests[] is non-empty.

**NEXT STEP:** Need to test the actual API response — fetch `/api/trace/children/<method-uuid>` and inspect the response JSON for a Method that has populated implementations[]. Check if children come back, and if their `hasChildren` is correct. Was about to do this when PO said STOP.

### Design direction (if hypothesis confirms):
If server returns correct data but tree doesn't render → client rendering bug in buildSeedNode or CSS.
If server returns empty/wrong → trace the specific fwdKeys resolution path for the failing type.

## DELIVERED THIS CYCLE (03d617855)
1. R20.28-DRY: 4-fix design into requirement unit (47837e0e6)
2. R20.29 + R20.30 designs into units (1ccbd90c3)
3. R20.22 3-slot consistency review — 5 findings (F1-HIGH: planner SKILL.md stale)
4. CR1 design-ahead (3-file rename)
5. R20.23-27 source-links design-ahead (per-type)

## CHAIN TYPE CONFIG (current, chain-model.ts)
- Method: scenarioFwd=["implementations"], traceFwd=["implementations"], expectedChildren=["Implementation"]
- Implementation: scenarioFwd=["tests"], traceFwd=["tests"], expectedChildren=["Test"]
- Test: scenarioFwd=["testCases","gates"], traceFwd=["testCases","gates"], expectedChildren=["TestCase","Gate"]

## KEY CLASSES
- CurrentSprint 43d570be (4 methods + getThreeSlots + hopUpdate)
- RbTraceTree: rb-trace-tree.ts (buildSeedNode, fetchAndRenderChildren, prefetchLayer)
- RbFileDetail 37103cf0 (content-preview embed)
- RbDetailView: rb-detail-view.ts (renderAllChildrenSection, renderSupersededSection)

## PROCESS RULES
- NEVER ASSUME — ALWAYS MEASURE
- grep -rl for lookups (auto-allowed), NOT find -exec (prompts)
- Gate-before-deploy; match gate to bug physics
- 6-step chain LOCKED: Req → UC → Class → Method → Impl → Test
- Don't create tasks — planner owns that
- Marker UUID = uuidgen-fresh OR verbatim copy
