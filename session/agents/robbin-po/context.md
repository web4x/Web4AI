# robbin-po Context — save #7 (2026-06-10)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.125 LIVE** (v0.5.126 SVG-cleanup + clickpath-fix in flight).
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0 | oosh-po ooshTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req | 2.0 skill-expert.
**BASE = SCENARIOS:** read state from scenario units (scenario/index/), not stale snapshots. Standard: scrum.pmo/standards/project-state-is-scenarios.md. Plan scenario-first.

## SVG R18.34.B — DEVICE-VERIFIED ✅ ("You made it!!!" Tron 2026-06-10)
- REAL root cause (found via SVGDBG device instrumentation = learning #83): the DOUBLE-TAP DETECTOR (server.ts:909) called reset() on pinch-release — pinch fires touchend TWICE (per finger) <300ms apart, changedTouches.length===1 each → false double-tap → reset→fit-to-stage → snap-back. v0.5.121 apply() fix was the WRONG thing.
- FIX shipped v0.5.125 (809cb92a): proper tap-detector (single-finger touchstart + <10px slop + <250ms + touches.length===0 + tapStart CLEARED on multi-touch). Tron device-confirmed holds.
- CLOSE-OUT IN FLIGHT: expert stripping SVGDBG instrumentation → v0.5.126 clean; tester fixing the FALSE-GREEN champagne test to model TWO sequential touchends (passed headless while device failed — #27); planner reconciling R18.34.B → Tron-QA gate.

## ACTIVE: broken clickpath #82 (Tron live bug)
- generated scenario/sprints.md/requirement/SLUG.md "Tasks: T190" link → "File not found".
- ROOT CAUSE (architect): MD-relative chain-link helper emits DOUBLED segment ../sprints.md/TYPE/SLUG.md → resolves scenario/sprints.md/sprints.md/... → 404. Fix: src/ts/scenario/templates.ts:65 + trace-tree.ts:92 → drop "sprints.md/" → ../TYPE/SLUG.md (HTML absolute variant templates.ts:72 is correct). Expert fixing + REGEN sprints.md views + bump → tester verifies clickpath.

## OTHER S18 OPEN
- T202 / R18.35 (per-UC Class.method: shared Class shows wrong method) — req canonicalized R18.35 (bottom-up sibling, Rule 5); architect designing /api/trace/children UC-chainMethod-context fix → expert → tester.
- #77 systemic task-traceability backfill (req, in flight).
- Tron-QA gate queue: SVG · T187 · T188 · T189 · T190 · S2-S9 backfill.

## 2 TRON STANDING ITEMS
1. HTTPS cert run (Mac Studio) → clears device lockout (expert pre-staged auto-detect+fallback).
2. QA-sign scrum.pmo/tron-qa-batch-2026-06-05.md.

## TEAM-HEALTH / TOOLING
- 4 agents rewound this round (expert/architect/req/tester) — all back LOW context; planner ok; skill-expert standby (done). On every recovery: re-task from preserved scenario/context (rewind drops queue — re-point at the live priority, e.g. I re-pointed architect at #82 not backfill).
- otmux send-submit BUG: `send..Enter` intermittently does NOT submit (agent stalls with staged text); bare Enter won't flush. WORKAROUND: `otmux send <pane> C-u` then fresh `send "text" Enter`. oosh-po OWNS the fix (filed CRITICAL session/tasks/otmux-send-enter-reliability.md), must report delivery → THEN retire workaround (Tron). Until then use C-u workaround on every send.

## HARD RULES (learnings #1-83, role files robbin-po/)
- #65 NEVER /compact; rewind via trainer. #66 ship=pkg+sw.js bump (a+b); #67 new route→STATIC_SHELL (c). #17 real v4 uuids.
- #79 chat=POINTER; spec in scenario/task docs. #80 no anthropomorphic excuses. #81 PO does NOT debug — delegate diagnosis. #82 ZERO background wait/monitor loops; pane.capture ONCE; web-UI count is ground truth.
- #83 DEVICE-INSTRUMENTATION: device-only bug + headless false-green → architect specs log points → expert ships server-log sink → Tron reproduces → architect reads REAL logs → real fix. (Just proved it on SVG.)
- Route EVERY Tron literal to req FIRST (verbatim). #27 STRICT VERIFY = Tron's device is acceptance, not headless. CMM4 4-role precedence: req(atomic+literal)→planner(v4 stand-up)→architect(design)→expert(impl)→tester(verify). Commit context FREQUENTLY (this gap caused a stale-rewind).

## ON RESUME
SVG done (device-verified) — finishing clean v0.5.126 + false-green-test fix. Drive #82 clickpath fix (architect root-caused, expert fixing) → tester verify. Then T202 + #77. 2 Tron items standing. Re-task rewound agents at the live priority. Read scenarios for true state. Use C-u workaround on otmux sends until oosh-po delivers.
