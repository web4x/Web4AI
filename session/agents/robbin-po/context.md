# robbin-po Context — SM-triggered save 2026-06-05 (#2)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.87 LIVE** (iphone:0.1). LE cert auto-detect + self-signed fallback staged (bb828692).
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## SPRINT 17 — Scenario Units / IOR / Traceability Browser
Chain LOCKED 7-step: requirement→task→usecase(s)→class→method→implementation→test(s). 1:N at plural hops. Atomic one-sentence reqs are ROOTS. FORWARD-ONLY (no back-refs). scenario/index/<5-deep>/<uuid>.scenario.json; scenario/sprints.json/ (ln tree); scenario/sprints.md/ (generated). {ior=class-loader, model={attrs+children IOR arrays}, ownerIor}.

## DONE+VERIFIED THIS RUN
- **T178 KEYSTONE 44/44** (452f8d5d) — every test 7-hop reachable from Req root. R-J+R-E satisfied IN DATA. T183 regression gate locked. 13 UCs S1-S14 + 8 UC classes[] fills + 55 orphan-impl wires.
- **T186 tree lazy-load** (69c3ef83 v0.5.84) — seed-mode 3 bugs fixed (fetch grandchildren, hasChildren from API, toggle fetches). Tester live 7-level expand R10.2→98 tasks→...→Test leaf. (Distinct from T178 DATA; own task = clean traceability.)
- **T181 forward-only DISPLAY** (48e3d076 v0.5.83) — forwardOnly(obj) on 8 DetailViews; no backward links user-facing.
- **T185 PUML** (c11f723a) s17-architecture.puml — TraceObject base + 7-step chain + view comps + scenario infra, [class:uuid]/[method:uuid]. 14/14 class exact; **38 method:uuid placeholder-suffix → expert aligning to exact (in flight)**.
- **T180 Track 2** (9c32626b) — CDP Security.setIgnoreCertificateErrors → SW registers/activates/caches headless over self-signed. PROVES cert is SOLE blocker.

## IN FLIGHT / REMAINING S17
1. **T180 Track 1 — TOP, TRON-BLOCKED.** DNS-01 decided. AWAITING TRON: run `sudo certbot certonly --manual --preferred-challenges dns -d home.donges.it` on Mac Studio + add printed TXT to donges.it DNS → cert at /etc/letsencrypt/live/home.donges.it/. THEN expert wires into node HTTPS + deploy → SW registers on real device → lockout clears. (Chrome iOS=WebKit; real iOS PWA = Safari→Add-to-Home-Screen.)
2. **T185** — expert aligning 38 method:uuid to exact index UUIDs → tester re-verify 38/38.
3. **T184** (📝 design e05ddd6f, LOW) — FORWARD_KEYS-at-emit (server.ts:481 forwardOnlyGraph) + client filter stays (2-layer). Awaiting expert.
4. **T129** S17 verification gate — close-path once Tron QA.

## TRON-QA-GATE BATCH: ~28 tester-verified tasks awaiting Tron QA (HIS cadence). T124/T168/T178/T181/T185/T186 in 🧪.

## STRICT VERIFY BAR (#27): 'audit clean' ≠ Tron-satisfied. Verified REQUIRES per-Test 7-hop reachability + LIVE headless/tree UX repro (not API-only — caught: tree didn't lazy-load though API hasChildren=true; node-count proxy missed 81% orphans → strict 7-hop). Tron's live-device observation IS the acceptance test.

## HARD RULES
- #65 NEVER /compact; rewind via agent-trainer (silent); NEVER tell agent its ctx%; save = 'commit your current work'.
- #66 ship=package.json+sw.js CACHE_NAME (a+b). #67 new route/bundle→STATIC_SHELL (c). Report '(a)✓(b)✓(c)'.
- #71 every report → derive+route next; never stop. SM flags idle/stuck → I re-task.
- CMM4 4-role planner-first: req(atomic 1-sentence)→planner(v4 uuid stand-up)→architect(design)→expert(impl)→tester(verify). Chat=pointer+next-delegation. compound-requirement-source*.md = Tron verbatim FIRST. Route EVERY literal to req. Split tasks into atomic 1-sentence reqs (Tron rule).
- #17 NEVER fake-suffix uuids — real v4 (uuidgen). Caught repeatedly (PUML method uuids, req atoms).
- Read whole output (no |head/tail/grep when verifying).

## NEXT (post-save anchor #2 — 2026-06-05 v0.5.87)
ALL S17 DEV DONE+VERIFIED. T184 (forward-only 44/44, 0 back-keys), T185 (38/38+14/14 exact uuids), T179 (SW-active E2E 4/4) all tester-verified strict. T180 Track1 PRE-STAGED (bb828692 v0.5.87 — server auto-detects /etc/letsencrypt/live/home.donges.it/ cert, self-signed fallback).
ONLY 2 ITEMS LEFT, BOTH TRON:
1. **Tron runs certbot** (DNS-01 `--manual --preferred-challenges dns` if port80 closed, OR `--standalone` if port80 open) → `git pull && npm run build && npm run dev` → log 'SSL: Let's Encrypt cert' → real device SW registers → LOCKOUT CLEARS. Expert staged code = instant pickup.
2. **Tron QA-signs** the batch: scrum.pmo/tron-qa-batch-2026-06-05.md (29 strict 🧪 + 33 bonus ✅). Recommended: spot-check 3 + single batch-approve commit (S5-S8 precedent).
T129 S17 gate closes after Tron QA. Team fully caught up — no idle, no manufactured work.
Every report → derive+route next (#71). SM monitor; rewind via trainer.

## HARNESS: #29-57 + T173-186 done; #58 T180 in flight (Track1 Tron-blocked); #37 S17 parent open until T180/T184/T185 close + T129 gate.
