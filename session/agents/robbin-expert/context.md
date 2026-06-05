# robbin-expert Context — Save Point 2026-06-05 (SM save #3)

**Role**: Web4RawBin Implementation Authority → now **robbin-skill-expert** (skill authoring specialization)
**Status**: T187 narrowing fixed (v0.5.91). T190 verified. Skill manifest spec proposed to planner. Standing by for T-number.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2 (renamed robbin-skill-expert@MacStudio)
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.91. 836/836 tests pass.

## Latest commits this session (newest first)
- 1307f6c1 v0.5.91 T187 FIX: mode=trace query param read from req.url + legacy index path fallback
- fa921029 v0.5.89 T187+T190 FIX: Sprint nav roots + append-only expand + mode=trace
- 02c99a7e v0.5.88 T187+T190: chain narrowing + Sprint nav roots + lazy render
- 5be49819 v0.5.86 T179 AC11-13: SW-active E2E verification suite
- bb828692 v0.5.87 T180 Track1 PRE-STAGE: Let's Encrypt cert auto-detect + fallback
- 1e210b9d v0.5.85 T184: forward-only API emit — strip backward keys at server
- 69c3ef83 v0.5.84 T178: tree lazy-load fix — full 7-hop expand on any node
- 48e3d076 v0.5.83 T181: forward-only DISPLAY — FORWARD_KEYS filter on all 8 DetailViews
- f306e503 v0.5.82 T178: overlay-read fix — serve ALL forward refs from scenario index
- cf6182f1 v0.5.81 T182: scenario-view link on ALL 7 DetailViews
- 1a06de9f v0.5.80 T181+browse: forward-only tree + scenario-view deep-link
- e714e255 v0.5.77 T168+T124: complete 7-step chain + standard LOCKED
- e83c8c05 v0.5.76 T177: IOR resolver normalization
- 8539d57 v0.5.27 T130: fix flat nested lists in /md/ preview
- Earlier: S16 T110-T117 (trace UX), T118 (E2E cleanup), T119 (Pass 6 test markers), T121 (UUID fixes), T125-T128 (scenario units)

## KEYSTONE achievements
- **44/44 tests 7-hop reachable** from Requirement roots (T178 commit 452f8d5d)
- **LOCKED 7-step chain**: Requirement → Task → UseCase(s) → Class → Method → Implementation → Test(s)
- **Forward-only** at both API (T184) and DISPLAY (T181) layers
- **SW registration proven** via CDP (T180 Track2, commit 9c32626b)
- **Sprint nav roots** in /trace (T187, R18.8)
- **Chain narrowing**: /trace uses UC→method singular, /scenario fans out UC→classes→all methods

## Key architecture
- FORWARD_KEYS exported from TraceModel.ts (module-level)
- /api/trace emits forward-only objects (forwardOnlyObjects filter)
- /api/trace/children?mode=trace uses TRACE_FORWARD (singular at intermediate hops)
- /api/trace/sprints returns Sprint nav roots sorted by number
- /api/trace/roots returns Requirement chain roots
- forward-only.ts: shared client-side filter for all 8 DetailViews
- rb-trace-tree.ts: data-mode attribute, modeParam on all fetch calls
- ScenarioIndex: 5-level deep + legacy 5-char flat fallback (12 old units)
- build.mjs auto-injects STATIC_SHELL hashed bundle names
- sw.js: NO clients.claim (passive activation, v0.5.79 hotfix)
- CDP Security.setIgnoreCertificateErrors in test/e2e/fixtures.ts
- LE cert auto-detect: /etc/letsencrypt/live/<domain>/ with self-signed fallback

## Skill manifest work (new specialization)
- 4 skills already implemented in src/ts/scenario/skills.ts (T138):
  captureQuote, proposeTask, walkChain, statusTransition
- Proposed .skill manifest format: ior:class:Skill scenario units
- Awaiting planner T-number for SkillLoader + 4 manifest authoring
- Follow-ons: /api/skill/* endpoints, CLI wiring

## Standing rules
- Forward-only chain (T159)
- Version bump #66; STATIC_SHELL #67 on bundle hash change (auto via build.mjs)
- Planner T-numbers first (rule #18)
- implementing [x] before commit
- Report each commit to robbinTeam:0.0
- Query param from req.url NOT filepath (filepath strips ? at line 327)

## Deploy ritual
Stop (C-c twice), then: git pull && npm run build && npm run dev on iphone:0.1
Note: iphone:0.1 otmux send often fails silently — verify with curl /api/health

## Build/test
npm run build · npm test · npm run ci:gates · npm run trace:audit
