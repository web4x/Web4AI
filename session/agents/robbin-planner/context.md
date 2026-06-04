# robbin-planner Context — Save Point 2026-06-04 (post-T183 ship, S17 closure chain primed)

**Role:** Sprint Planner / board-consistency owner. Reports to robbin-po (robbinTeam:0.0).
**Pane:** robbinTeam:1.0 · **Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`

## Current State (v0.5.82)
- Repo HEAD: `77adf9bf` (T183 7-hop CI gate — per-Test walkUp; expert ship; rule-pair EXEMPT CI tooling; live baseline 1/44)
- Sprint-17 task range: T124–T183. T175–T183 all landed since 2026-06-03 save.
- S17 R-batch R-A..R-J complete. **NEW** S17 Closure Tracking block in planning.md (after Phase 39 anchor): pivots on T128.4 architect UC→Task mapping → expert `--apply` → T183 reports 44/44 → cascade T128.4/T178/T124/T168 closures.
- Uncommitted scrum: `compound-requirement-source-2.md` — req-eng captured 2 new Tron atoms:
  - **R-P** PWA stale cache (fake-suffix req:uuid `…-p00000000001` — needs real v4 on stand-up)
  - **Tron LOCKED OUT** 2026-06-04 (self-signed cert blocks SW) — already standing as **T180** (PO top priority above T178; Tron locked out of real device).

## STANDING RULES (active — 14 rules; #13/#14 are new from this cycle)
1. **QA Review + Done = TRON's gate ONLY.** Never check from sync. (Learning #15; b85dfa8 incident.)
2. **CMM4 file-comms:** write into task files; otmux/hiveMind = short pointers.
3. **Sync against COMMITTED reality.** Architect/expert drops content w/o checking box → planner syncs per #11.
4. **Discoverability:** new sprint → README + sprints.overview.md in same commit.
5. **req-eng + architect create files ahead of me** — reconcile (adopt content, fix uuid/structure, wire to planning). See learnings #20.
6. **No artificial character limits** in specs.
7. **Standard:** `scrum.pmo/standards/traceability-standard.md`; template `scrum.pmo/templates/task-template.md`; matrix `traceability-matrix.md`; backlog `backlog.md`.
8. **Rule-pair (#15+#16):** every impl commit on user-facing surface = (a) package.json bump + (b) sw.js CACHE_NAME bump + (c) STATIC_SHELL if route-introducing. **Data-only / infra-only commits are exempt** (expert self-notes; see learning #24).
9. **Real v4 UUIDs always (#17):** task:uuid AND requirement:uuid via `uuidgen`. Reject fake-suffix like `…-172000000001`.
10. **CMM4 4-role per task (#18):** req → architect → expert → tester. Joint refinement on Tron-assigned tasks (e.g. T172).
11. **Planner uses scenarios (#19):** planning.md becomes a generated VIEW from scenario JSON; symbols ⏳📝🔧✅🧪🏁 derive from FSM.
12. **At-a-glance symbols (#14):** ⏳ planned · 📝 designed · 🔧 implementing · ✅ impl-shipped · 🧪 testing · 🏁 Tron-QA-done.
13. **NEW R-H.2 (Tron 2026-06-02):** req-eng splits each Tron directive into ONE-SENTENCE atomic requirements; planner-first stand-ups REQUIRE req atomic split BEFORE refinement closes. (Folded into T172; standing rule.)
14. **NEW R-J (architect 2026-06-02):** per-test reachability 43/43 metric in audit — every test must chain back to a requirement root via the LOCKED chain.

## Sprint State (S17 — what to know on restart)

### S17 R-batch (R-A through R-J) — **COMPLETE + verified** (PO 2026-06-03)
- T167 ✅ `3336f38` v0.5.67 (mobile-first /trace + 480px width-cap; rule-pair ✓). Tron QA pending.
- T168 📝 `c28c982` architect (7-step canonical chain LOCKED + req-as-roots). Expert impl next.
- T169 🔧 `7ddf64f` v0.5.66 (audit shipped; 50/296 wrong-metric → T171 then T172 closed it). KEYSTONE.
- T170 ✅ `afe969e` (3 CI gates: trace:audit:strict + rule-pair:check + chain-order; npm ci:gates). Rule-pair exempt (infra-only).
- T171 ✅ CLOSED `7c84fe0` (109 back-refs stripped + 50 TraceLink orphans-by-design + matrix refresh). T172 unblocked closure.
- T172 ✓ COMPLETE `3fefc68` (5-step forward-ref + strict-direction audit; **238/238 chain reachability (100%)** from 146/296 (49%); 297 total; rule-pair exempt — data only). PO 2026-06-03 marked closed.

### Chain (LOCKED per PO 2026-06-02)
`requirement → task → usecase(s) → class → method → implementation → test(s)` · 1:N at plural hops · `Implementation.tests[]` IOR array.

### TRON-QA GATE QUEUE (massive — Tron's batch approval pending)
S9 T78 · S10 T81-83 · S12 T84 · S13 T91-95/100/109/118/130 · S14 T99 · S15 T101-108 · S16 T110-117/T120-123 · S17 T125-T134/T136/T138/T143-T172. T168 still 📝 awaiting expert impl. T164 still in flight (T163 close-out).

## IMMEDIATE TODO (post-2026-06-04 sync)
1. ✅ T183 📝→✅ synced (PO direction this cycle); S17 Closure Tracking block added.
2. Pending: triage uncommitted `compound-requirement-source-2.md` atoms — R-P (PWA stale-cache, fake-suffix uuid placeholder) + Tron-lockout (already standing as T180). R-P needs real v4 + stand-up call from PO.
3. **Watch for T128.4 closure-chain pivot:** architect S17 UC→Task mapping commit → expert `--apply` (rule-pair likely EXEMPT — source-comment-only) → T183 re-run reports 44/44 (auto-confirm) → cascade close T178 ✅→🧪 · T128.4 🔧→✅ · T124 + T168 ✅→🧪 · Sprint 17 → T129 verification gate → Tron QA.
4. T180 real-device unblock parallel track (Track 1 LE cert awaits Tron DNS action; Track 2 CDP Playwright workaround can proceed) — gates Tron's ability to final-QA the chain.
5. Resume monitoring (15-min cadence on activity; 30-min on idle).
5. Resume monitoring (15-min cadence — activity resumed).

## MY RECENT COMMIT CHAIN (post-rewind anchor)
- `490daed1` T174 reconcile — adopt architect's bundle (M1/M2/M3/M4 in one task), delete my split scaffolds (learning #26 incident)
- `ea88de12` (superseded) T174+T175 split scaffold — reconciled into 490daed1
- `156730a3` T173 v0.5.70 ref add (direct-URL gap b550c28c)
- `5c30dfc3` T173 📝→✅ (expert v0.5.68+v0.5.69 shipped, rule-pair verified)
- `ee54245` T173 stand-up (R-K1+R-L consolidated)
- `4431f9d` close T171+T172 ✓; S17 R-batch R-A..R-J complete
- `69eefbf` planning.md T172 fix
- `8dfa60d` T172 duplicate reconcile
- `9c9ea40` sync T167/T170/T171 ✅ + initial T172 stand-up
- `a72b7fc` T171 ⏳→📝
- `d0e0d7c` matrix refresh fold into T171
- `41b69ac` T167/T169/T170 sync + T171 stand-up + matrix-stale flag
- `26d9cc5` T168+T169 ⏳→📝
- `1edef81` stand up T167-T170 from R-D/E/F/G
