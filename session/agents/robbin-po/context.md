# robbin-po Context — clean snapshot 2026-06-09 (save #6, pre-rewind)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.113 LIVE** (iphone:0.1), 9 real rooms.
**Tron:** iphone:0.0 | SM TRONinterface:0.1 (enforcing CMM4 task-file comms + idle-catch + proactive rewind) | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req | 2.0 robbin-skill-expert (T189 done). NOTE: planner/expert/req cycling proactive rewinds (SM+trainer) — re-anchor their queues from committed context on reboot.

## DONE + STRICTLY VERIFIED
- **S17** Scenario Units / IOR / Traceability Browser — complete.
- **S18** chain method-scope + detail-view + dogfood — complete.
- **T201 6-STEP CHAIN CORRECTION (CLOSED v0.5.109):** canonical chain = Req→UC→Class→Method→Impl→Test. Task = NAVIGATION (Sprint→Task→coveredReq), NOT a chain hop. 5 layers verified (skill 741b0eb, standards d79c3013, code 81856abd, data f3171e57 Req.useCases[] 77/124, views 84908ea4). 3-concern model: Chain(WHY)/Dependency(WHAT-FIRST)/Navigation(HOW-BROWSE). Self-reflexively dogfooded.
- **CHAMPAGNE 44/44** canonical (every test 7-hop reachable from Req root, T183 gate). Chain-correction PRESERVED + improved it (68 reqs reachable). 7 orphan Impls don't block (tests reachable via alt paths).
- **R18.29-31 unitLinks[] atomic symlinks (CLOSED):** 267 units have unitLinks[] (backfill-unit-links.ts); put() auto-syncs JSON↔on-disk symlinks. S18 gap structurally impossible.
- **T200/R18.33 detail→tree sync — PRIMARY DONE (v0.5.113):** in-tree reveal (navigate in DetailView link → tree scroll+expand+highlight) = Tron's literal ask. VERIFIED.
- chain-correction skill/standards corrected; refinement-precedence-analysis.md (3-concern + R1-11 protocol rules).

## DEFERRED EDGE (Tron deciding)
- **Deep-link-on-fresh-load reveal** fails the ancestor-expand-on-fresh-render race (4 fix attempts: timing-guard, waitForNode, server reverse-scan-parent for empty-ownerIor). Outside the literal req ('navigation in details' = in-tree, works). Asked Tron: defer (default) or pursue as separate enhancement. Don't grind unprompted.

## 2 STANDING TRON ITEMS (the only substantive open work)
1. **HTTPS cert** — needs Tron DNS/ACME access → clears device lockout. Expert pre-staged auto-detect+self-signed-fallback = instant pickup.
2. **Tron QA batch** — scrum.pmo/tron-qa-batch-*.md (spot-check-3 + batch-approve). Closes S17/S18 gates.

## HARD RULES (durable)
- CMM4 COMMS (Tron repeated + SM now enforces): findings/reports/specs INTO the task file; otmux = ONE-LINE pointer only. I kept violating under driving pressure — STOP.
- #71 every report → route next; NEVER let agents idle (only standby if ALL impl+tested). I keep dropping the design→IMPLEMENT handoff — re-task the instant a layer/design lands.
- INSTRUMENT BEFORE HYPOTHESIS-FIX: T200 wasted 4 fix attempts guessing; instrument-first (breadcrumbs + log actual values) found the real root cause (empty ownerIor breaks ancestor walk). When a fix fails twice, STOP guessing — measure.
- #65 NEVER /compact (kills agents); rewind via agent-trainer (save+commit FIRST). #27 STRICT verify = per-Test 7-hop + LIVE UX repro (caught test-file-only champagne inflation, ref-format false leads, async races). #66 ship=pkg+sw.js bump; #67 new route→STATIC_SHELL. #17 real v4 uuids. Route EVERY Tron literal to req (compound-requirement-source FIRST).

## HARNESS TRACKER: #29-79 done except #37/#61 (S17/S18 parents close on Tron QA), #58 (cert+QA Tron-gated), #77 (systemic backfill ~done), #78 T200 primary done/deep-link deferred.

## ON RESUME
Verify TRUE state via git/health (snapshot lags live). Team genuinely near standby — only cert + QA (Tron) + the deferred deep-link edge (Tron's call) remain. Re-task instant Tron runs cert / signs QA / gives a literal (→req) / decides deep-link. Re-anchor rewound agents (planner/expert/req) from their committed context. SM enforces task-file comms + flags idle.
