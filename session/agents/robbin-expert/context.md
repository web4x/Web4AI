# robbin-expert Context — Save Point 2026-06-16 (Tier-3 fork anchor)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.55 deployed. Forked from ud-expert UUID session, re-oriented. Anchoring.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.6.55. Tests: 995/1004 pass (9 pre-existing failures).

## GIT GROUND TRUTH (verified 2026-06-16)
- HEAD: 8f7f07efa v0.6.55 R20.29: populate Method→Impl→Test forward refs + Test→Gate pipeline
- HEAD~1: b326a3879 R20.30: implementing[x] — v0.6.54 breadth-vs-depth
- HEAD~2: 1ccbd90c3 robbin-architect: R20.29 + R20.30 designs
- package.json: 0.6.55
- Recovery baseline: a370d4d (pre-rewind anchor from prior session)

## NEXT TASK: T119 — test:uuid parser (Pass 6) + marker rollout
- PO directive: extend trace-cli with Pass 6 to parse [test:uuid:<v4>] markers
- File: scrum.pmo/sprints/sprint-11-traceability/task-119-test-traceability.md
- Approach: parser first, then vitest marker rollout, e2e after

## COMPLETED PRIOR SESSIONS (context carry-forward)
- S16 T110-T117: detail drawer + typed views + icons + collapse/expand + trace-cli Pass 4/5
- T118: E2E cleanup (cleanupTestUsers, 8-spec afterAll, backfill purge 263→148)
- T120+T122: dark drawer bg + viewport-fixed
- v0.5.23-v0.5.25: version bumps for PWA delivery + STATIC_SHELL fix
- v0.6.0-v0.6.54: marathon session — TestCase, Gate, CurrentSprint, R20.20-R20.30
- v0.6.55: R20.29 Method→Impl→Test forward refs + Test→Gate pipeline

## KEY ARCHITECTURE (current)
- 6-step chain LOCKED: Req → UC → Class → Method → Impl → Test
- Task = NAVIGATION (Sprint→Task→coveredRequirements), NOT chain
- Universal BADGE_MAP, CHAIN_TYPE_CONFIG
- TestCase uuid = crypto hash of file+describe+it path (idempotent)
- Gate = real verification event (gateType/verdict/evidence)
- renderChainPathSection: depth-first single path (first child per hop, max 6)
- renderAllChildrenSection: breadth (all children flat)
- Forward-only at TWO layers (server strips backward keys, client forwardOnly filter)
- build.mjs auto-injects STATIC_SHELL hashed bundles

## STANDING RULES
- Version bump #66; STATIC_SHELL #67; git tag on deploy
- implementing [x] before commit
- Report to robbinTeam2:0.0
- SOURCE-VERIFY before claiming (git show HEAD grep, curl live, /api/health)
- Scenario-link communication: otmux = one-line pointers only
- Forward-only chain (T159) — no back-refs
- REAL UNITS ONLY — no stubs, no fabrication

## DEPLOY RITUAL
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
4. SOURCE-VERIFY: git show HEAD:<file> | grep <feature>

## BUILD/TEST
npm run build · npm test · npm run ci:gates · npm run trace:audit
