# robbin-architect Context (Save 2026-06-16 pre-rewind)

## STATUS: Active — status-badge design pending, then Phase 2 rewind
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## GIT-VERIFIED
- Version: v0.6.39+
- Champagne: 27+ settled (climbing)
- Sprint 29 active, R20.x requirements driving

## CURRENT WIP
- R20.22 (3-slot pin) in flight — expert implementing
- CR1 (champagne→traceability rename) = next-backlog, chain complete, ready for WIP flip
- Status-badge design (PO directive just received) = pending before rewind

## PENDING DESIGN (status-badge)
- rb-object-item needs SEPARATE status badge (distinct from oi-badge child-count)
- Driven by hopState (gate-proven=green, impl-done=blue, in-progress=amber) OR gate verdict
- Gate nodes (det-3x PASS) attach as children of gated task or as overlay
- Expert's prior impl only rendered child-count badge, not status — tester verified RED

## DESIGNS DELIVERED THIS SESSION
- R20.22: 3-slot CurrentSprint pin (current/lastCompleted/nextBacklog)
- R20.23-27: Per-type source links design-ahead (universal + Class puml + Method code + Test file + Gate evidence)
- CR1: Chain complete (e2807a7b → f2f84ce3 → 9ed45878), 3 files to rename
- R20.20/21: impl→test wiring + gate-status badge (gate-proven)
- R20.19: TraceGraph class minted (10de8452)
- R20.15: DRY-unify CHAIN_TYPE_CONFIG (design + parity proof)
- R20.13: CurrentSprint class (4 methods, real code landed)
- BUG8/BUG9: collection-detail + Bug forward keys root-caused + fixed
- /api/trace unit-sourced redesign (markdown-is-not-source, 3-phase migration)
- Superseded filter design
- TestCase + Gate 1st-class scenario units
- scanRepo Bug/CR exclusion fix (ObjectType + makeObject)

## CHAIN TYPE CONFIG (R20.15)
src/ts/shared/chain-model.ts — CHAIN_TYPE_CONFIG with 13 types. scenarioFwd/traceFwd/expectedChildren/clientFwd accessors. All consumers migrated.

## KEY CLASSES DESIGNED
- CurrentSprint 43d570be (4 methods: setChain/pinCurrent/advance/getActiveChain)
- SelectionModel b57b8838 (8 atomics: tap/longpress/CSS/drag/consolidate)
- ChainTypeConfig a0c492d6 (DRY forward-key unification)
- TraceGraph 10de8452 (unit-sourced graph build)
- RbFileDetail 37103cf0 (file leaf detail view)
- TestCase 68f356c1 (parsed from it() blocks)
- Gate 2ed0fefa (deploy/quality gate with verdict)
- RbDetailDrawer 0dd08b2f (14 methods — consolidated drawer)
- RbObjectItem 3bc876b5 (16 methods)
- RbDetailView f2f84ce3 (8 methods)
- RoomView b0cfac4d (5 methods)

## PROCESS RULES
- Don't create tasks — planner owns that
- UC needs BOTH .class + .method + .classes[] at creation
- Self-call hop status: npx tsx scripts/planner-drive.ts hop <hop> <status>
- NEVER ASSUME — ALWAYS MEASURE
- Gate-before-deploy, match gate to bug physics
- Marker UUID = uuidgen-fresh OR verbatim copy
- 6-step chain LOCKED: Req → UC → Class → Method → Impl → Test
- WIP=1 proven-or-stay
