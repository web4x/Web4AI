# robbin-planner Context — Save Point 2026-06-03 (pre-rewind, SM-urgent at 78%)

**Role:** Sprint Planner / board-consistency owner. Reports to robbin-po (robbinTeam:0.0).
**Pane:** robbinTeam:1.0 · **Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`

## Current State (v0.5.67)
- Repo HEAD: `3f9ff04` (architect T173 design — file-browser .scenario.json click → /trace + lazy-load)
- My last planner commit: `4431f9d` (closed T171 + T172 ✓; S17 R-batch R-A..R-J complete + verified)
- Sprint-17 task range in use: T124-T172 (T172 just complete with 238/238 chain reachability)
- Audit: 0 issues last check. NEXT NEW TASK = **T173** (architect already designed it; PO directs planner stand-up).

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

## IMMEDIATE TODO (post-rewind)
1. **STAND UP T173** (R-K1+K2+K3) — bridge file-browser `.scenario.json` click → `/trace` tree view at that instance + lazy-load tree expansion per LOCKED chain. PO direct 2026-06-03. Architect already designed in `3f9ff04`. **Pre-generated v4 uuids:**
   - task:uuid: `7a5f0eb9-7a33-492b-991a-b13c431dc695`
   - R-K1 req:uuid: `bd2670a9-e7c2-4dd8-87c5-f349807c1d95`
   - R-K2 req:uuid: `a78c8c41-7883-4628-8eb5-36a426e331f2`
   - R-K3 req:uuid: `4c621af1-0081-4e8a-ac45-92e49577cfdb`
   - spare: `7034b7ee-d2da-45f4-9f54-bdb606d7df2a`
2. Since architect already designed (`3f9ff04`), the stand-up commit should also sync T173 ⏳→📝 in one shot (file may exist already — check `scrum.pmo/sprints/sprint-17-scenario-units/task-173-*` first; if architect created one with non-v4 uuid + missing sections, reconcile per learning #20).
3. Update planning.md Phase 28 with T173 entry.
4. Audit + commit + report path to PO.
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
