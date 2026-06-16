# robbin-expert Context — Save Point 2026-06-16 (Phase-2 rewind anchor)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.53 deployed. R20.28 DRY rework SHIPPED. Standing by for next directive.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.6.53. Tests: 1000/1004 pass (4 pre-existing failures).

## LAST COMMITS (git log HEAD)
- 4917f848a v0.6.53 R20.28-DRY 4-fix: mime fallback + double-render guard + sync newtab + universal buttons
- 47837e0e6 robbin-architect: R20.28-DRY 4-fix design into requirement unit
- add897c13 robbin-tester: getThreeSlots consistency GATE — DET-3x PASS v0.6.52
- 0dcad8df0 v0.6.52: current slot derives from canonical WIP chain, not just focus-Task
- b8b1f685a skill-expert: align skills with 3-slot pin model

## KEY ARCHITECTURE (carried forward)
- Universal BADGE_MAP: pass/done/gate-proven→green, fail→red, in-progress→amber, impl-done→blue, planned→gray
- CHAIN_TYPE_CONFIG: single source for all forward keys
- TestCase uuid = crypto hash of file+describe+it path (idempotent)
- Gate = real verification event (gateType/verdict/evidence/gatedItems[]/gatedBy)
- CurrentSprint singleton: getThreeSlots() derives from canonical WIP chain
- /api/trace/children for CurrentSprint returns 3 task children from slots
- File detail at trace/rb-file-detail.ts; content-preview.ts has renderContentPreview + loadTextPreview + wireUrlActions
- 5-level deep scenario index, forward-only chain (T159), 6-step chain LOCKED
- /scenario?ior= (single-instance tree) vs /trace (full requirement-rooted tree)

## STANDING RULES
- Version bump #66; STATIC_SHELL #67; git tag on deploy
- implementing [x] before commit; self-mark hop per Tron #102
- Report to robbinTeam2:0.0
- SOURCE-VERIFY before claiming (git show HEAD grep, curl live bundle, /api/health)
- NO false claims — ALWAYS verify before reporting
- Forward-only chain (T159) — no back-refs
- REAL UNITS ONLY — no stubs, no fabrication
- Scenario-link communication: otmux = one-line pointers only

## DEPLOY RITUAL
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
4. SOURCE-VERIFY: git show HEAD:<file> | grep <feature>, curl live dist bundle

## BUILD/TEST
npm run build · npm test · npm run ci:gates · npm run trace:audit
