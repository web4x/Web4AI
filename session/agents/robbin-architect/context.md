# robbin-architect Context (Save 2026-06-16 post-rewind-3)

## STATUS: Active — R20.30 breadth-vs-depth DEPLOYED, orient complete
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## GIT-VERIFIED
- HEAD: dbfe9cedf (R20.30 task+UC minted: breadth-vs-depth task 5baef26a + UC detailView.distinctSections d63bf19b)
- Version: v0.6.56
- Working tree: 19 modified scenario units + 3 untracked (expert work in progress)

## SINCE MY LAST SAVE (03d617855 → dbfe9cedf)
1. 1ccbd90c3: robbin-architect R20.29 + R20.30 designs into requirement units (MY WORK)
2. 87c955ba0: v0.6.54 R20.30 breadth-vs-depth — Chain≠Children in detail views
3. 4917f848a: v0.6.53 R20.28-DRY 4-fix (mime, double-render, sync, buttons)
4. 8f7f07efa: v0.6.55 R20.29 populate Method→Impl→Test forward refs + Test→Gate pipeline
5. 1f9324607: CR1 rename Champagne Chain → Traceability Chain + v0.6.56 bump
6. e133d0f86: PO R20.30 evidence — Tron IMG_4064 All Children == Traceability Chain for RbFileDetail
7. f2c81d67c: R20.30 generalized ALL types + Tron prioritize directive
8. b10bb0bff: R20.30 refined chain renders FULL DEPTH (method→impl→test→gate)
9. dbfe9cedf: R20.30 task+UC minted breadth-vs-depth task 5baef26a + UC d63bf19b

## R20.29 STATUS: IMPLEMENTED (v0.6.55)
- My root-cause analysis was IN PROGRESS when last saved
- Expert shipped 8f7f07efa: populate Method→Impl→Test forward refs + Test→Gate pipeline
- The tree-surface 0-children bug is FIXED — forward refs now populated

## R20.30 STATUS: DEPLOYED (v0.6.54+v0.6.56)
- breadth-vs-depth (Chain≠Children in detail views) shipped
- Task + UC minted (dbfe9cedf)
- Tron evidence shows All Children == Traceability Chain for Class RbFileDetail (IMG_4064)
- PO prioritized generalizing to ALL types

## CHAIN TYPE CONFIG (current)
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
- Your-hop-your-status (#102)

## WHAT'S NEXT
Await PO directive. R20.29 and R20.30 both deployed. Expert has working tree changes (19 scenario units). Check with PO for next assignment.
