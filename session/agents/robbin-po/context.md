# robbin-po Context — SM-triggered save 2026-06-04

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.79 LIVE** (iphone:0.1). Hotfix 886f9815 removed clients.claim offline race (from T179).
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## SPRINT 17 — Scenario Units / IOR / Traceability Browser
Chain LOCKED 7-step: requirement→task→usecase(s)→class→method→implementation→test(s). 1:N at plural hops. Atomic one-sentence reqs are ROOTS. FORWARD-ONLY (no back-refs). scenario/index/<5-deep>/<uuid>.scenario.json; scenario/sprints.json/ (ln speaking-name tree); scenario/sprints.md/ (generated). {ior=class-loader, model={attrs+children IOR arrays}, ownerIor}.

## IN FLIGHT — PRIORITY ORDER
1. **T180 (R-T) TOP — Tron LOCKED OUT.** Chrome blocks SW on self-signed cert at home.donges.it. CRITICAL nuance: **Tron is on CHROME iOS = WebKit/WKWebView** (limited/no SW). Real iOS PWA path = **Safari → Add to Home Screen** (standalone WebKit). T180 = Let's Encrypt cert (secure context still needed for Safari iOS SW) + CDP Security.setIgnoreCertificateErrors (Playwright). Architect reporting Tron-action-needs (DNS/port :80/sudo) FIRST → I escalate. To clear his stale data: Chrome iOS Settings→Clear Browsing Data; but use Safari for the PWA.
2. **T178 (R-J/R-E keystone)** — deep-chain DATA fill: UC.classes[]/Class.methods[]/Method.implementations[]/Implementation.tests[] are EMPTY (only Sprint.requirements[56]/Requirement.tasks[109]/Task.useCases[57] populated). req+architect JOINT fill consistently from PUML uc→class + [impl:uuid]/[test:uuid] markers. Also folds LAZY-LOAD-deeper diagnosis (data-empty vs tree-mechanism). Target 44/44 tests 7-hop reachable.
3. **T181 (R-U)** — strict forward-only DISPLAY. DATA is clean (T172 audit=0); the Task DetailView still RENDERS a backward 'requirements' link. Fix 6 non-Req DetailViews (Task/UC/Class/Method/Impl/Test) — no backward collection emission. DISPLAY-side audit extends T170 strict gate.

## DONE+VERIFIED (S17 R-batch): T167(R-D mobile/width) T168(R-E chain) T169+T171(R-F zero-untraced, 238/238 100% reachable) T170(R-G CI gates) T172(R-H strict-direction, 146→238/238) + T173/174/175/176/177/179. R-I atomic 1-sentence split (de427a6, R17.30-47). R-J test reachability.
## TRON-QA-GATE BATCH: ~25 tester-verified tasks awaiting Tron QA (HIS cadence). 30 tasks total ~27 done.

## STRICT VERIFY BAR (planner #27): 'audit clean' ≠ Tron-satisfied. Verified REQUIRES per-Test 7-hop reachability + LIVE headless UX repro. Tron's live-device observation IS the acceptance test. DATA-audit clean but DISPLAY can still violate (→ T181).

## HARD RULES
- #65 NEVER /compact (killed tester once); rewind via agent-trainer (silent); NEVER tell agent its context%; save order = 'commit your current work'.
- #66 ship=package.json+sw.js CACHE_NAME (a+b). #67 new route/bundle→STATIC_SHELL (c). Report '(a)✓(b)✓(c)'.
- #71 every report → derive+route next; never stop. SM proactively flags idle/stuck → I re-task.
- CMM4 4-role planner-first: req(atomic 1-sentence)→planner(stand-up v4 uuid)→architect(design)→expert(impl)→tester(verify). Chat=pointer+next-delegation. compound-requirement-source*.md = Tron verbatim FIRST. Route EVERY literal to req.
- Chrome iOS = WebKit (Safari home-screen is real iOS PWA path). Data forward-only clean but DISPLAY layer can leak backward links.
- Read whole output (no |head/tail/grep when verifying — git --stat truncation bit me; also a 'massive orphans' miss when audit metric was a lenient proxy — Tron's eyes caught 81% orphans the node-count audit missed → strict 7-hop reachability).

## NEXT (post-save anchor)
1. Architect: T180 Tron-action-needs FIRST (escalate cert DNS/port to Tron) → T178 deep-fill (joint req) → T181 display. Expert tooling for T178 fill. Tester strict 7-hop verify.
2. Every Tron literal → req atomic → planner → architect → expert → tester under STRICT verify bar.
3. SM proactive monitor; rewind via trainer; fleet resilient (many rewinds zero loss).

## HARNESS: #29-57 + T173-179 done; #56 T178 / #58 T180 in flight; T181 new; #37 S17 parent open until T178/T180/T181 close.
