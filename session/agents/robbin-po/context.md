# robbin-po Context — save #6 (2026-06-09)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.118 LIVE** (iphone:0.1).
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req.

## BASE = SCENARIOS (operating principle, Tron 2026-06-09)
Project state = the scenario units (sprint/task scenarios + states + views), live in scenario/index/. Read state FROM scenarios, not stale snapshots. Standard: scrum.pmo/standards/project-state-is-scenarios.md. Plan scenario-first: find owning scenario → add req+task units → design→impl→test.

## ACTIVE: SVG viewer (R18.34, S18) — NOT quality-solved
- D1 thin-strip FIXED (iframe+fill). D2 page-zoom FIXED (in-/svg-viewer gesture handler). D3 blur: inline <svg> (was img+transform raster) — Tron says ACCEPTABLE worst-case (deprioritized).
- **D4 iPhone snap-back: STILL OCCURS, intermittent** (holds after pinch sometimes, then re-snaps). First fix (v0.5.118, replace window.resize→reset w/ preserve-zoom) was INCOMPLETE → there's a SECOND trigger. Architect doing THOROUGH audit: EVERY listener (resize/touchend/orientationchange/visualViewport/gesture*/visibility/scroll/load) + EVERY reset()/scale-recompute caller, via a METHOD SCENARIO trace of reset() usages. → expert fixes ALL paths → Tron iPhone re-verify. Architect HEALTHY (do not rewind it — critical path).
- NOTE my own debug got D4 wrong once (CSS hypothesis) — architect found real cause (JS resize). #81: don't debug, delegate diagnosis.

## TEAM-HEALTH (in progress, trainer executing)
- 112 background "wait for X"/monitoring tasks (my #52/#82 anti-pattern recurrence) — Tron CLEARED them via web UI (I couldn't get IDs from inside). ZERO wait-loops ever again (#82).
- Trainer recovery: expert 0.2 (866k) rewinding; req 1.1 (840k)+tester 0.3 (830k) TIER-3 distillation (rewinds not clearing base); architect 0.1 healthy (D4 audit, preserve); planner 1.0 (482k) OK. Verify resets actually drop (verify-the-reset gap; use 10-15 line scrollback not 3).

## 2 TRON STANDING ITEMS
1. HTTPS cert run (Mac Studio) → clears device lockout (expert pre-staged auto-detect+fallback).
2. QA-sign scrum.pmo/tron-qa-batch-2026-06-05.md.

## HARD RULES (see learnings.md #1-82, role-owned in robbin-po/; memory copy in robbin-po/memory/)
- #79 chat = POINTER ONLY; spec lives in scenario/task documents; team works FROM docs.
- #80 NO anthropomorphic excuses ("pressure"/"haste") — a machine applies rules deterministically; state real cause, apply rule.
- #81 PO does NOT debug — my code-tracing gives confident-WRONG root causes; delegate diagnosis to architect.
- #82 ZERO background wait/monitor loops; after delegating, STOP (agent self-reports + harness notifies); pane.capture ONCE to check; trust the web-UI count.
- #65 NEVER /compact; rewind/Tier-3 via trainer. #66 ship=pkg+sw.js bump. #67 new route→STATIC_SHELL. #17 real v4 uuids.
- Route EVERY Tron literal to req FIRST (verbatim capture). #27 STRICT VERIFY = live device repro (Tron's device is acceptance), not headless-only. Verify otmux submission via pane.capture. Commit context FREQUENTLY (role files = robbin-po/, NOT generic product-owner/).

## ON RESUME
SVG D4 is the active Tron quality item — architect auditing all listeners/reset-callers (method-scenario trace) → expert fixes all paths → Tron device-verify. Team-health recovery in progress (trainer). 2 Tron items standing. Read scenarios for true state.
