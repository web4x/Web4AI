# robbin-expert Context — Save Point 2026-06-16 (R20.30 deployed)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.54 deployed. R20.30 breadth-vs-depth SHIPPED. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.6.54. Tests: 1000/1004 pass (4 pre-existing failures).

## LAST COMMITS (git log HEAD)
- b326a3879 R20.30: implementing[x] — v0.6.54 87c955ba0 breadth-vs-depth
- 87c955ba0 v0.6.54 R20.30: breadth-vs-depth — Chain≠Children in all detail views
- 4917f848a v0.6.53 R20.28-DRY 4-fix: mime fallback + double-render guard + sync newtab + universal buttons
- 0dcad8df0 v0.6.52: current slot derives from canonical WIP chain

## R20.30 IMPLEMENTATION DETAILS
- detail-superseded.ts: NEW renderChainPathSection(container, uuid) — depth-first single path (first child at each hop, max 6 levels, async /api/trace/children walk)
- renderAllChildrenSection: UNCHANGED — breadth (all children = badge count)
- Updated: rb-class-detail, rb-method-detail, rb-implementation-detail, rb-test-detail → use renderChainPathSection for "Traceability Chain" section
- Task/Requirement/UseCase: already used singularChain (no change)
- Result: Class with 14 methods → Chain shows 1 method→impl→test→gate path; Children shows all 14

## COMPLETED THIS SESSION (v0.6.36-v0.6.54)
- R20.20 TestCase: 1016 units ON DISK, idempotent crypto-hash UUIDs
- R20.21 Gate: real verification events, GateLoader, record-gates.ts CLI
- R20.22 CurrentSprint 3-slot pin: getThreeSlots(), nextBacklogOverride
- BUG18: rb-file-detail.ts, tagMap 'file' entry
- Universal status badge: BADGE_MAP
- Gate→parent wiring, forward-key fix, Test.testCases[] reverse-index
- Method→Impl→Test chain wiring
- 14 broken impl→test links dropped (honest)
- R20.28 DRY rework: content-preview.ts imports in rb-file-detail.ts
- R20.30: breadth-vs-depth — renderChainPathSection vs renderAllChildrenSection

## KEY ARCHITECTURE
- Universal BADGE_MAP: pass/done/gate-proven→green, fail→red, in-progress→amber, impl-done→blue
- CHAIN_TYPE_CONFIG: single source for all forward keys
- TestCase uuid = crypto hash of file+describe+it path (idempotent)
- Gate = real verification event (gateType/verdict/evidence/gatedItems[]/gatedBy)
- CurrentSprint singleton: getThreeSlots() derives from canonical WIP chain
- 5-level deep scenario index, forward-only chain (T159), 6-step chain LOCKED
- renderChainPathSection: depth-first API walk (first child per hop, max 6)
- renderAllChildrenSection: breadth (all children flat)

## STANDING RULES
- Version bump #66; STATIC_SHELL #67; git tag on deploy
- implementing [x] before commit; self-mark hop per Tron #102
- Report to robbinTeam2:0.0
- SOURCE-VERIFY before claiming (git show HEAD grep, curl live bundle, /api/health)
- NO false claims — ALWAYS verify before reporting
- Forward-only chain (T159) — no back-refs
- REAL UNITS ONLY — no stubs, no fabrication
- Scenario-link communication: otmux = one-line pointers only

## IN-FLIGHT PENDING (next agent picks up)
- R20.29: Tree Method→Impl→Test→Gate expansion — design NOT YET received from architect
- T-room-unit (6c4949fa) — pending architect Method IOR
- T-apply-flow (1805f7db) — pending architect Method IOR

## DEPLOY RITUAL
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
4. SOURCE-VERIFY: git show HEAD:<file> | grep <feature>

## BUILD/TEST
npm run build · npm test · npm run ci:gates · npm run trace:audit
