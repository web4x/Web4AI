# robbin-po Context — SM-triggered save 2026-06-03 (pre-rewind)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.75 LIVE** (iphone:0.1)
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect (web4-architect fork, self-IDs web4team:0.1) | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## CURRENT SPRINT — S17 Scenario Units / IOR / Traceability Browser
Chain LOCKED: requirement → task → usecase(s) → class → method → implementation → test(s). 1:N at plural hops. Atomic reqs are ROOTS.

## DELIVERED + VERIFIED (this run)
T167 mobile-first /trace + width-cap (v0.5.67) · T168 chain-order spec · T169 KEYSTONE 100% chain reachability (146→238/238) · T170 3 CI gates · T171 untraced closure + matrix refresh · T172 strict-direction + 5-step forward-ref (296 units, 0 orphans/back-refs/cardinality) · T173 .scenario.json → /scenario?ior= 302 (click+direct) · T174 drawer cleanups + NEW /scenario route (R-M1-4+M3d/M3e) v0.5.74 CODE-COMPLETE · T175 Tree base (TraceObject getters) + R-N1 ellipsis + R-N2 localStorage v0.5.75

## IN FLIGHT
- **T176** (R-O KEYSTONE): headless Playwright can't exec /scenario ES-module JS (self-signed SSL blocks type=module). Architect picking approach (trusted cert/http/Chromium flag). UNBLOCKS T174 R-M3d/M3e + T175 R-N2 behavior verify + ALL future browser-behavior + Tron QA on T174/T175.
- **T175 R-N3 hierarchy check**: shipped as single 'TraceObject'; Tron spec = Tree(base) ← Traceability extends Tree ← typed. Architect confirming match-or-reconcile.

## CRITICAL INCIDENT 2026-06-03 (false alarm, resolved, NO data loss)
SM misread queued-unsubmitted /compact in architect buffer as 'self-compacted'; I relayed as root cause → Tron 'bullshit'. FACTS: autocompact OFF; /compact never ran (cleared via C-u); architect's 'continued from previous' = its earlier web4-architect fork (2026-05-18 UUID 5b56e996), not new compact.

## HARD RULES
- #65 NEVER /compact agents; rewind via trainer (silent). NEW: never tell an agent its context %/level (auto-mode self-prescribes /compact). Save order = 'commit your current work' (no context mention).
- Queued /compact ≠ executed — verify execution vs buffer; SM C-u clears stale /compact each tick.
- Never relay another agent's claim as root cause w/o evidence.
- #66 ship = package.json + sw.js CACHE_NAME (a+b). #67 new route → STATIC_SHELL (c).
- #71 every report → derive+route next; never stop after report.
- CMM4 4-role planner-first: req→planner→architect→expert→tester. Chat=pointer+next. Atomic one-sentence reqs.
- compound-requirement-source*.md = Tron verbatim FIRST.
- 'I am not your tester' — fix TESTER verifiability (T176), don't punt browser-behavior to Tron device.

## NEXT (post-rewind anchor)
1. Architect: T176 approach pick + R-N3 hierarchy confirm → expert impl → tester proves headless JS exec → T174/T175 tails verify → Tron QA.
2. Every Tron literal → req (atomic) → planner → architect → expert → tester. SM monitors (no context-mentions to agents).
3. Harness tasks #52 T174 / #53 T175 / #54 T176 track current; #29-51 done.
