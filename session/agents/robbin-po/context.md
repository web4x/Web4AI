# robbin-po Context — SM-triggered save 2026-06-03

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.77 LIVE** (iphone:0.1) | listens *:4444 externally OK
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## SPRINT 17 — Scenario Units / IOR / Traceability Browser
Chain LOCKED 7-step: requirement→task→usecase(s)→class→method→implementation→test(s). 1:N at plural hops. Atomic one-sentence reqs are ROOTS. Forward-only (no back-refs). scenario/index/<5-deep-uuid>/<uuid>.scenario.json; scenario/sprints.json/ (ln speaking-name tree); scenario/sprints.md/ (generated views). {ior=class-loader, model={attrs+children IOR arrays}, ownerIor}.

## TRON-QA-GATE BATCH = 23 tasks (tester-verified, awaiting Tron QA — HIS cadence, not a blocker)
T125/126/127/128/129/131/132/133/134/136/138/143/144/167/168/169/170/171/172/173/174/175/177. T124 ✅ code-complete-gated. T176 RESOLVED-NOT-A-BUG.

## IN FLIGHT — TWO KEYSTONES
- **T178 (R-Q) CRITICAL PATH** — deep-chain DATA fill: UC.classes[]/Class.methods[]/Method.implementations[]/Implementation.tests[] are EMPTY (data only 3 deep Req→Task→Subtask). 44 tests 'chain gap' → R-J/R-E NOT satisfied in DATA despite 7-step CODE done. Architect designing linking (PUML uc→class, [impl:uuid], [test:uuid] markers). Gates T124+T168 closure + the CI-gate extension. Target: 44/44 tests 7-hop reachable.
- **T179 (R-S)** — SW auto-activation (skipWaiting+clients.claim+purge old CACHE_NAME) → ends RECURRING stale-SW-cache (Tron keeps seeing old bundles / 'routes broken' = his stale cache, confirmed clean headless). Architect designing SW lifecycle.

## STRICT VERIFY BAR (codified 3f1896ee, planner #27) — ROOT FIX
'audit clean' ≠ Tron-satisfied. 'Verified' now REQUIRES: (i) per-Test 7-hop reachability via LOCKED chain (node-count proxy REJECTED), (ii) LIVE headless UX reproduction. CI gate (trace:audit:strict) extends after T178: fail on any Test walkUp<7. Treat Tron's live-device observation as the real acceptance test; tester reproduces it headless (T176 proved headless module-exec works: ignoreHTTPSErrors + --ignore-certificate-errors).

## HARD RULES
- #65 NEVER /compact agents (killed tester once). Rewind via agent-trainer (silent). NEVER tell an agent its context %/level (auto-mode self-prescribes /compact). Save order = exactly 'commit your current work'. CAUGHT this run: cleared queued 'save+compact' from architect via C-u; corrected SM.
- Never relay another agent's claim as root cause w/o evidence (false-alarm incident).
- #66 ship = package.json + sw.js CACHE_NAME (a+b). #67 new route/bundle → sw.js STATIC_SHELL (c). Triple-check report '(a)✓(b)✓(c)'.
- #71 every report → derive+route next; never stop after report. Don't blindly wait — SM proactively reports idle/stuck; I re-task.
- CMM4 4-role planner-first: req(atomic 1-sentence)→planner(stand-up w/ v4 uuid)→architect(design)→expert(impl)→tester(verify). Chat=pointer+next-delegation. compound-requirement-source*.md = Tron verbatim FIRST.
- 'I am not your tester' — fix tester verifiability, don't punt browser-behavior to Tron device.
- Read whole output (no |head/tail/grep filtering when verifying — bit me on git --stat truncation).

## NEXT (post-rewind anchor)
1. Architect: T178 design (CRITICAL — deep-chain data fill) + T179 SW lifecycle → expert impl → tester proves 44/44 7-hop + SW auto-takeover → closes T124/T168 + R-J/R-E.
2. Every Tron literal → req atomic → planner → architect → expert → tester under STRICT verify bar.
3. SM proactive monitor (commit-your-work saves, no context mentions, rewind via trainer). Fleet resilient (many rewinds, zero loss).
4. S11 backlog deferred: 33 unformalised S10-16 reqs + S1-9 warnings (T87-89).

## HARNESS TASKS: #29-55 done; #56 T178 / #57 T179 in flight; #37 S17 parent open until T178+T179 close.
