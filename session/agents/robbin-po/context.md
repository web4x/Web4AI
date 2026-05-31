# robbin-po Context — URGENT save 2026-06-01 (rewind imminent)

**Role:** Product Owner | **Pane:** robbinTeam:0.0 (MacStudio)
**Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.38 LIVE** (iphone:0.1)
**Tron:** iphone:0.0 | **Fleet:** SM TRONinterface:0.1 (at 2% — being rewound) | agent-trainer baseTeam:0.0 | hiveMind hiveMindTeam02_03_26:0.0 (offline)
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## DELIVERED + VERIFIED (this session — ~30 fixes/features across S9-S17 on Tron-QA gate, v0.5.x)
All bug fixes + 4-extension S17 scenario-unit architecture: T118 (e2e cleanup), T119 (test traceability), T120-T123 (S16 UX), T125-T128 (S17 foundation/views/nav/migration), T129 (verify gate), T130 (md hierarchical lists), T131 (symlink browser), T132-T134 (HTML status / Task FSM / TraceLink units), T136 (req+UC migration), T138 (4 skills), T139 BLOCKED (skill-expert fork — hiveMind offline), T140 (source-location + git anchor), T141 (chain-link 🔗), T142 (vCard onboarding, v0.5.35), T144 (file-browser 3 fixes + AC2 patch /edit href, v0.5.38).

S17 = 29 formal requirements (R17.1-R17.29). 4 Tron extensions captured (1-3 re-archived in compound-source per ac8c8e7 + ac4f508). T124.4/.5/T135/T137 closed.

## IN FLIGHT
- **T143** chain→TREE rework (v0.5.37 84f3915) — AC1+AC4-7 PASS, AC2 PARTIAL (UUID filenames in hrefs not speaking names → 404). Architect on AC2 fix design now.
- **T144** AC2 re-verify (0101980 v0.5.38 /edit href) — tester active.
- **T146** reserved (B7 req-format reform) — planner prep packet; req drafting 16 short-names.
- **T145** reserved (B6 User-as-scenario + ViewBus, fixes lobby/room name stale) — planner prep packet.
- **T139** still blocked (hiveMind pane offline; need restart or redirect).

## OPEN BUGS NOT YET FIXED
- T143 AC2 UUID-vs-speaking-name href bug — architect designing fix.
- B6 (queued in T145): lobby/room user name doesn't refresh after profile edit; fix = User joins scenario-unit + ViewBus mvc.
- B7 (queued in T146): requirement entries duplicate Tron quote; need 3-5 word summary name first line.

## HARD-WON RULES (last session)
- Learning #66: shipping = version bump + sw.js CACHE_NAME bump or doesn't reach Tron's PWA.
- Learning #67: new SPA routes MUST go into sw.js STATIC_SHELL in same commit-set.
- Learning #68 / feedback_qa_never_the_issue: QA is Tron's cadence, NEVER gate dev on QA; drive deps to QA-state.
- Memory: feedback_route_every_requirement_to_req — multi-part Tron directive = MULTIPLE requirements, route ALL to req.
- Memory: feedback_never_compact_agents (#65) — never /compact agents; use agent-trainer (or hiveMind-expert) rewind.
- Memory: feedback_dont_override_tron_with_assumptions — never override explicit Tron statements with my code-reading.
- CMM4 4-role discipline (#18 planner): every new task = req → architect → expert → tester. Planner-first stand-up before impl.
- T128.4 impl:uuid markers must be inside /** */ or // — bare " * " outside JSDoc = esbuild parse error (server.ts:3 emergency fix d283de4).
- CMM4 communicate via task files; chat is pointer only.
- Whole-team engagement (Tron 2026-05-31): leverage all 4 roles, not single-route.

## NEXT ACTIONS (post-rewind)
1. T143 AC2 fix: architect designing → expert impl → tester re-verify.
2. T144 AC2 re-verify (tester active).
3. Once T143+T144 both green: stand up T145 (B6) + T146 (B7) per planner prep.
4. T139 fork: ask Tron to restart hiveMind-expert pane OR redirect fork target.
5. Drive next Tron requirements through req → planner → 4-role.
6. Coordinate with SM (also at 2% being rewound) once SM recovers.

## TEAM HEALTH SNAPSHOT
- 0.1 architect: active on T143 AC2 fix design.
- 0.2 expert: standby for T143 AC2 patch.
- 0.3 tester: T144 AC2 re-verify active.
- 1.0 planner: prep packets for T145/T146; 15-min cadence.
- 1.1 req: drafting T146 short-names.
- SM: rewinding (2% alert).

## RECOVERY ANCHOR
Commits to know: 84f3915 (T143 v0.5.37), 0101980 (T144 v0.5.38), 933be66 (planner sync), 6e2a532 (tester T143 partial), bd3b75d (architect T144 AC2 decision), b438b9b/3231f6a (T145/T146 backlog), 4b3dafb (T136), 2e5e9dc (T128.4), d283de4 (server.ts emergency fix), ea532bd (req S17 reqs.md 25 formalized), ac8c8e7 + ac4f508 (compound source re-archive + R17.26-29 + B7).
