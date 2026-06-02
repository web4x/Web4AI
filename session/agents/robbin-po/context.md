# robbin-po Context — SM-triggered save 2026-06-02 (888k)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.64 LIVE** (iphone:0.1)
**Tron:** iphone:0.0 | SM TRONinterface:0.1 | agent-trainer baseTeam:0.0 (BACK ONLINE — rewound req 141fb94)
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req

## DELIVERED THIS SESSION (post 47e76d2 anchor + 2686703 mid-save)
Forward-chain refactor + browser fixes shipped:
- T158 4 typed DetailViews (a41d16a v0.5.59)
- T159 forward-only chain refactor (58b17e3 v0.5.56) — strips back-refs, no-back-ref invariant
- T160 forward-ref repopulation (5b354fd v0.5.58 + AC3 edc477c v0.5.60)
- T161 speaky-name rendering (737c841 v0.5.57) — kills > Tron: quote prefix
- T163 /api/trace title source switch (f138aa0 v0.5.61) — overlay scenario-index model.name
- T164 firstLine() harden + cleanModelName (7016003 v0.5.63) — 41/41 clean titles
- T165 tree renders 5/7 typed classes (ece09bc v0.5.62) — req/task/uc/test/impl as items, click→DetailView
- T128.2 S10-S16 scenario migration (f4d21b3 v0.5.64) — 243 units, 491 views, all clean+forward

## TESTER-VERIFIED
T158 ✓ · T159 ✓ · T160 ✓ · T161 ✓ · T163 partial-then-T164-close ✓ · T164 ✓ 41/41 · T165 ✓ 5/7 (class+method=0 data-gap → T166) · T128.2 ✓ 243 units

## IN FLIGHT
- **T166** — /api/trace populate Class + Method from scenario index (sister to T163 pattern)
  - 340765a planner stand-up. task:uuid:086a35db. v0.5.65 expected.
  - Architect WIP design uncommitted (planner flagged) — pinged to commit.
  - Closes T165 to 7/7 once landed.

## SUPERSEDED / CLOSED
- T162 SUPERSEDED by T163 (wrong fix layer: firstLine() strip → consumer switch)

## RECOVERY ANCHOR — KEY COMMITS
47e76d2 (post-prior-rewind) — 2686703 (mid-session save) — 58b17e3 (T159) — 737c841 (T161) — 5b354fd/edc477c (T160) — a41d16a (T158) — f138aa0 (T163) — ece09bc (T165) — 7016003 (T164) — f4d21b3 (T128.2)

## HARD-WON RULES
- #65 NEVER /compact agents; rewind via agent-trainer
- #66 ship = version bump + sw.js CACHE_NAME bump (rule-pair a+b)
- #67 new SPA routes → sw.js STATIC_SHELL same commit set (rule-pair c)
- #68 QA = Tron's cadence, not a dev blocker
- #69 Watch planner sync staleness — trust tester PASS commits
- #70 Rewind infra must stay online for agent recoverability
- #71 Every report → IMMEDIATE next delegation (NEVER stop after report)
- CMM4 4-role (#18 planner): req→architect→expert→tester. Planner stands up tasks FIRST.
- Chat = pointer + next-delegation. NOT pointer alone.
- compound-requirement-source.md captures Tron verbatim BEFORE anything touches it.
- feedback_route_every_requirement_to_req: every literal → req
- feedback_dont_override_tron_with_assumptions: never override explicit Tron

## NEXT ACTIONS (post-save)
1. Architect commits T166 design (just pinged) → expert implements → tester verifies → closes T165 to 7/7.
2. Continue Tron-driven sprint; route every literal through req per planner-first 4-role.
3. SM cadence monitor; agent-trainer ready for rewinds.

## OPEN
- T166 implementation pending (architect → expert → tester)
- Tron-QA gate cadence — many delivered tasks await Tron QA signature batch
- Real-device QA (T157 vCard onboarding, iOS/Android drag-drop) — Tron manual
