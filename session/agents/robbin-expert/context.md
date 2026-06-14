# robbin-expert Context — Save Point 2026-06-14 (post-Phase-1 rewind)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.30+ deployed. Phase 1 deep rewind COMPLETE — room freed. TestCase+Gate UNSTARTED.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.6.35 live (HEAD advanced by other agents during rewind).

## POST-REWIND STATE (2026-06-14)
- Phase 1 rewind complete — context freed
- TestCase+Gate: UNSTARTED — design unit d20855e74
- IDEMPOTENT uuid = crypto hash of file+describe+it path, NOT randomUUID
- Prior anchor: 9f50415 captured this exact resume-state
- Pick up from QUEUED TASK below — no other work in flight

## QUEUED TASK (UNSTARTED — next agent picks up)
- **TestCase+Gate** from design unit d20855e74
- parse-test-cases.ts: one TestCase unit per it() block
- Gate class + CHAIN_TYPE_CONFIG entries (both leaf)
- Test forward-key 'testCases'
- CRITICAL: IDEMPOTENT generation — TestCase uuid DETERMINISTIC from file+describe+it-path
  (re-parse → SAME uuid, NO new dups; use crypto hash of path, not randomUUID)
- VERIFY: /api/trace TestCase count ≈ it()-count, Test→TestCase hop resolves, re-run = 0 new

## COMPLETED THIS SESSION
- Phase 1 migration: 214 markdown tasks → scenario units (5569cf504)
- Phase 2: /api/trace from ScenarioIndex only, no scanRepo (e676dcdbb)
- Bug/CR fix: baseType map + CHAIN_TYPE_CONFIG accessors (f2b0e609a)
- Parity test: old⊆new (0 removals) + Bug>=14 + CR>=1 goal assertions
- R19.84-90: dragResize, dismiss threshold, pinch-zoom, diffRenderItems, file-items, CE upgrade race
- R19.82-89: addMemberTakeover, persistent-dedup, removeLocalIdentity moved

## KEY ARCHITECTURE
- /api/trace builds from ScenarioIndex ONLY (no scanRepo in path)
- scenarioFwd()/traceFwd() from chain-model.ts CHAIN_TYPE_CONFIG (single source)
- bug/changerequest → baseType 'requirement' for makeObject, then obj.type restored
- Parity test at test/vitest/trace-parity.test.ts (wired, not just AC)
- Pre-switch baseline at /tmp/pre-switch-uuids.json (2119 UUIDs)
- Backup at /tmp/pre-phase1-backup-20260614T193737Z.tar.gz

## STANDING RULES
- CMM4: MEASURE-before-act, PDCA, SOURCE-VERIFY, DET-3x, NO FABRICATION
- Version bump #66; STATIC_SHELL #67
- implementing [x] before commit
- Report to robbinTeam2:0.0
- SAVE BEFORE 80% context (this save is at ~95%)

## DEPLOY RITUAL
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd ... && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
