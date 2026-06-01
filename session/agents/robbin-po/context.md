# robbin-po Context — URGENT save 2026-06-01 (rewind imminent #2)

**Role:** Product Owner | **Pane:** robbinTeam:0.0 (MacStudio)
**Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.42 LIVE** (iphone:0.1)
**Tron:** iphone:0.0 | **Fleet:** SM TRONinterface:0.1 (at 910k, urgent save ordered, may need rewind) | agent-trainer baseTeam:0.0 (stood down for raw-tmux violation) | hiveMind hiveMindTeam02_03_26:0.0 (OFFLINE — shell prompt, not Claude)
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## DELIVERED THIS SESSION (post-prior-rewind 81c2934)
- T143 chain→TREE rework: 84f3915 v0.5.37 → fe69562 arch slug → 4e79afa v0.5.39 expert → 8b54788 tester AC2 STILL FAIL → 6f5cf89 v0.5.40 expert SlugResolver via ViewGenerator → aab6d20 tester ALL AC PASS ✅
- T144 AC2: 0101980 v0.5.38 /edit href → tester re-confirmed ALL AC PASS ✅
- T146 req NAME-first format: ccca722 req → 83099ea arch → 7fbfd8e expert (template + validator + retro 16 entries) → tester PASS ✅
- T145 User-as-scenario + ViewBus: f549114 v0.5.41 (User 9th class + ViewBus singleton + ProfileEditor publish + UserTemplate) → tester PASS infra ✓ + flagged subscribers not wired → 48eb52a v0.5.42 expert wires rb-member-badge / ProfileSheet / RoomBrowser → tester PASS, B6 stale-name bug CLOSED ✅
- Planner syncs: cbb33e1, 814cdcf, 62c2237 (catching up on T143/T144/T146 close — was stale, flagged for next pass)

## S17 STATE — DEV PIPELINE ESSENTIALLY COMPLETE
- 29 formal requirements R17.1-R17.29 captured + traced
- T118-T146 all closed at QA-state EXCEPT:
- **T139** skill-expert fork — BLOCKED on hiveMind-expert pane offline (showed plain shell). Needs hiveMind restart OR agent-trainer rewind (currently stood down). PO open question to Tron.

## IN-FLIGHT
- Tester closed everything; standing by.
- Architect closed T145/T146 design; standing by.
- Expert closed T145 follow-up; standing by.
- Planner: stale view on T143/T144/T146 closures, will catch up next 15-min sync.
- Req: queue empty; standing by.
- SM: 910k context, urgent save ordered 4x (Tron + me) — not yet confirmed saved; if loop wedged, rewind via OOSH/hiveMind (when restored) or Tron direct intervention.

## OPEN BUGS / TODO
- T139 unblock: hiveMind-expert pane needs Claude bootstrap, OR move fork target. Pending Tron call.
- T143/T144/T146 testing checkboxes — planner to tick on next sync (sync is stale).
- Tron QA gate: ~30 tasks across S9-S17 at QA-state (per #68 = Tron's cadence, not a dev blocker).

## HARD-WON RULES (recent additions)
- #66 ship = version bump + sw.js CACHE_NAME bump
- #67 new SPA routes → sw.js STATIC_SHELL in same commit set
- #68 / feedback_qa_never_the_issue: QA is Tron's cadence, drive deps to QA-state regardless
- #65 never /compact agents; rewind via OOSH (agent-trainer or hiveMind-expert)
- feedback_route_every_requirement_to_req — multi-part Tron = MULTIPLE reqs, route ALL
- feedback_dont_override_tron_with_assumptions — never override explicit Tron with my code-reading
- CMM4 4-role discipline (#18 planner): every new task = req → architect → expert → tester. Planner-first stand-up before impl.
- Chat = pointer only; detail lives in task files (compound-requirement-source.md captures verbatim Tron BEFORE anything else touches)
- CMM4 whole-team engagement: leverage all 4 roles, not single-route

## RECOVERY ANCHOR — KEY COMMITS
81c2934 (prior save baseline) — 6f5cf89 (T143 v0.5.40) — aab6d20 (tester T143 ALL AC) — 7fbfd8e (T146) — f549114 (T145 v0.5.41) — 48eb52a (T145 follow-up v0.5.42 B6 closed) — 62c2237 (latest planner sync, stale)

## NEXT ACTIONS (post-rewind)
1. Verify SM state (saved? alive? need rewind?).
2. Planner: sync T143/T144/T146 stale checkboxes; tick everything that's at QA-state.
3. T139 unblock decision: ask Tron — restart hiveMind pane, or accept blocked.
4. Drive any new Tron requirements through req → planner → 4-role.
5. Continue Tron-QA-is-his-cadence: keep building, don't gate on QA backlog.
