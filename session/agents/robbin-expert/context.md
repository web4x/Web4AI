# robbin-expert Context — Save Point 2026-06-16 (pre-Phase-2 rewind)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.50 deployed. R20.28 rework QUEUED (architect spec received, not yet applied).
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.6.50. Tests: ~1004 (4 pre-existing failures).

## QUEUED TASK (architect spec received, UNSTARTED)
- **R20.28 DRY REWORK**: rb-file-detail.ts — DELETE inline preview buttons (lines 54-57, 59, 77-95), REPLACE with content-preview.ts imports (renderContentPreview + loadTextPreview + wireUrlActions). Method UUID 63d58e0f.
- PRESERVE: header (43-53), source link (62-65), parent link (66-75).

## COMPLETED THIS SESSION (v0.6.36-v0.6.50)
- R20.20 TestCase: 1016 units ON DISK, idempotent crypto-hash UUIDs, parse-test-cases.ts
- R20.21 Gate: real verification events (not 1-per-testcase), GateLoader, record-gates.ts CLI
- R20.22 CurrentSprint 3-slot pin: getThreeSlots(), nextBacklogOverride, trace-page single tree
- BUG18: rb-file-detail.ts (file detail view), tagMap 'file' entry, drawer file guard removed
- Universal status badge: BADGE_MAP (pass→green, fail→red, etc), .oi-status CSS
- Gate→parent wiring: gates[] on Req/Task, forward keys in CHAIN_TYPE_CONFIG
- Forward-key fix: filter uses scenarioFwd (same as build keys)
- Test.testCases[] reverse-index wiring (file-path match)
- Method→Impl→Test chain wiring (parseFromSource e4f5b693→329081ca)
- Impl→Test method-derived wiring pass in populate-forward-refs.ts
- 14 broken impl→test links dropped (honest — old scanRepo refs)
- v0.6.23/v0.6.27 tag fixes (mis-pointed → correct commits)
- v0.6.25-v0.6.50 tags backfilled

## KEY ARCHITECTURE
- Universal BADGE_MAP: pass/done/gate-proven→green, fail→red, in-progress→amber, impl-done→blue, planned→gray, qa-review→purple
- CHAIN_TYPE_CONFIG: single source for all forward keys (scenarioFwd/traceFwd/expectedChildren/clientFwd)
- TestCase uuid = crypto hash of file+describe+it path (idempotent)
- Gate = real verification event (gateType/verdict/evidence/gatedItems[]/gatedBy)
- CurrentSprint singleton: getThreeSlots() derives FRESH from disk (no cache)
- /api/trace/children for CurrentSprint returns 3 task children from slots
- File is at trace/rb-file-detail.ts NOT components/rb-file-detail.ts
- content-preview.ts has renderContentPreview + loadTextPreview + wireUrlActions

## STANDING RULES
- Version bump #66; STATIC_SHELL #67; git tag on deploy
- implementing [x] before commit; self-mark hop per Tron #102
- Report to robbinTeam2:0.0
- SOURCE-VERIFY before claiming (git show HEAD grep, curl live bundle, /api/health)
- NO false claims: 3+ mis-claims this session — ALWAYS verify before reporting
- Forward-only chain (T159) — no back-refs
- REAL UNITS ONLY — no stubs, no fabrication
- Scenario-link communication: otmux = one-line pointers only

## DEPLOY RITUAL
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
4. SOURCE-VERIFY: git show HEAD:<file> | grep <feature>, curl live dist bundle
