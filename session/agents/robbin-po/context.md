# robbin-po Context — save #5 (2026-06-09)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.113 LIVE** (iphone:0.1), 9 real rooms.
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req.

## BASE = SCENARIOS (new operating principle, Tron 2026-06-09)
The scenario units (sprint + task scenarios + their states + views) ARE the live project
state — they accumulate into it. Read current state FROM the scenarios (scenario/index/),
NOT from a context.md snapshot (which goes stale on rewind — that bit me: save #4 was a
whole sprint behind). Plan every requirement scenario-first: FIND owning scenario → ADD
req+task as scenario units → design→impl→test forward chain. Standard being written:
scrum.pmo/standards/project-state-is-scenarios.md. See memory feedback_scenarios_are_project_state.

## DELIVERED THROUGH S17 + most of S18 (verified)
S1-S17 + S18 (T190-T201): traceability browser, 7→6-step forward-only chain
(Req→UC→Class→Method→Impl→Test; Req→Task is dependency NOT chain — see
refinement-precedence-analysis.md, 3-way: architect R1-5, planner R6-8, req R9-11),
scenario-unit data model, lazy tree, breadcrumbs, detail↔tree sync, champagne intention-
verification, SW auto-activation. v0.5.113.

## IN FLIGHT
- **SVG view optimization** (#80, NEW Tron 2026-06-09, 3 screenshots): SVG opens as thin
  strip + pinch-zoom zooms WHOLE PAGE not the diagram. Want near-fullscreen iframe +
  pan/zoom scoped to SVG inside iframe. Flow: req decompose (BLOCKED on transient API
  rate-limit — let clear, don't thrash) → planner FIND owning scenario (file-browser/md SVG
  render) + add req/task units → architect design (iframe+svg-pan-zoom) → expert → tester.
- Planner writing project-state-is-scenarios.md standard.
- #77 systemic task-traceability backfill (coveredRequirements+useCases+unitLinks split).
- #61 S18 parent open.

## 2 TRON-ONLY ITEMS (standing)
1. HTTPS cert run on Mac Studio → clears device lockout (expert pre-staged auto-detect+fallback bb828692).
2. QA-sign scrum.pmo/tron-qa-batch-2026-06-05.md (29 strict-verified + 33 bonus) → closes S17 T129 gate.

## HARD RULES
- #65 NEVER /compact (kills); rewind via agent-trainer; "save"=commit context+learnings.
- #66 ship=package.json + sw.js CACHE_NAME bump (a+b). #67 new route→STATIC_SHELL (c). Report (a)✓(b)✓(c).
- Route EVERY Tron literal to req FIRST (capture verbatim); req decomposes ALL atoms + signals BEFORE planner creates tasks (precedence protocol). compound-requirement-source*.md = verbatim.
- #17 real v4 uuids only (uuidgen). #27 STRICT VERIFY: live UX repro, not API-only. Read whole tool output.
- CMM4: req→planner→architect→expert→tester. Chat = pointer + next-delegation. Commit context FREQUENTLY (stale anchor bit me).

## ON RESUME
Read scenarios for true state. SVG fix is the active Tron item (req rate-limited — let clear). 2 Tron items standing. SM monitors; rewind via trainer near limit.
