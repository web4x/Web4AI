# robbin-planner Context — Save Point 2026-06-08 (S18 dogfood COMPLETE; sprints.json symlink tree shipped)

**Role:** Sprint Planner / board-consistency owner. Reports to robbin-po (robbinTeam:0.0).
**Pane:** robbinTeam:1.0 · **Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`

## Current State (v0.5.105)
- Repo HEAD: `8ce33c87` (planner: S18 sprints.json symlink tree + README nav link to scenario-data-pipeline standard).
- **Sprint 17 closed** — cascade fired 2026-06-05 (T178 KEYSTONE `452f8d5d` 44/44 7-hop reach; T128.4 ✅; T178/T124/T168 🧪 Tron QA pending).
- **Sprint 18 ACTIVE** — `sprint-18-chain-method-scope`. Sprint uuid `5b950725-a6f6-4d45-b802-4784ee6ef962`. **DOGFOOD COMPLETE 2026-06-07/08.**

## DOGFOOD COMPLETION SUMMARY (PO direction 2026-06-07 split-wave strategy)
- **Wave 1 (R18.9-R18.28, 20 Requirement units)** committed across 4 batches:
  - `2e48fa9a` W1B1 R18.9-R18.13
  - `24bfe028` W1B2 R18.14-R18.18
  - `a5231818` W1B3 R18.19-R18.23 (R18.20-R18.23 inferred from Follow-on C cross-refs; req-eng to canonicalize headers later)
  - `792132ff` W1B4 R18.24-R18.28
- **Wave 2 (T191-T199 Task units, T196+T199 skipped as no commits exist)** committed:
  - `5d977918` W2B1 T191-T194 (4 tasks)
  - W2B2 T195/T197/T198 rode into architect's `391cb9e4` commit (race condition; data correct)
- **S18 Sprint.tasks[] wired** (11 tasks) + **Sprint.requirements[] wired** (20 reqs): `bc11d861` (planner: dogfood COMPLETE).
- **Generator T188 ran**: `scripts/generate-sprint-md.ts 5b950725-…` → planning.md + **11 task .md** files emitted (up from 3 before backfill).
- **sprints.json symlink tree built** `8ce33c87` (this commit, latest): `scenario/sprints.json/sprint-18-chain-method-scope/{sprint.json, task/* (11), requirement/* (20)}` all symlinks resolve. Deleted 17 fake-suffix-uuid duplicates the migrator auto-created (learning #17 violation; my real-v4 W1 units canonical). T187+T190 sprint pointer restored after architect's `724880b5` data fill removed it.
- **README Traceability nav** now indexes `scrum.pmo/standards/scenario-data-pipeline.md` per index-everything rule.

## S2-S9 BACKFILL — DEFERRED (PO decision (b) 2026-06-07)
- Recorded in `scrum.pmo/sprints/sprint-18-chain-method-scope/task-planner-s2-s9-backfill.md` (committed `e641224a`).
- Census: zero Task scenario units exist for T7-T80; the 8 empty S2-S9 Sprints' `tasks[]` is by-design (historical task-unit migration deferred). Re-openable as dedicated migration sprint on Tron request.
- Architect: please add allowlist hook in trace-audit-strict so S1-S9 empty `Sprint.tasks[]` is by-design (analogous to TraceLink orphans).

## R18.19 ZERO-PAD — DONE by architect (`2276be51`)
9 Sprint units renamed (S1→"Sprint 01" through S9→"Sprint 09"); S10-S18 already 2-digit. `model.number` int for sort.

## T184 R-X1 → R-Y1 RENAME (planner, learning #20 reconcile)
req-eng `15dd69c1` captured R-X1+R-X2 for PUML class diagrams concurrently with my T184 R-X1 use (.md-parser forward-only). I renamed mine to R-Y1, req:uuid `d9c419b3-…` retained (label change only). Committed earlier in `ffdc7dd0`.

## STANDING RULES (active — 15 with #15 NEW)
1. **QA Review + Done = TRON's gate ONLY.** Never check from sync.
2. **CMM4 file-comms:** write into task files; otmux/hiveMind = ONE-LINE pointer only (SM 2026-06-07 reaffirmed: "Report-back goes INTO the task file; chat = one-line pointer only. No detail walls in chat.").
3. **Sync against COMMITTED reality.**
4. **Discoverability:** new sprint/standard → README + sprints.overview.md in same commit (index-everything rule).
5. **req-eng + architect create files ahead of me** — reconcile per learning #20.
6. **No artificial character limits** in specs.
7. **Standard:** `scrum.pmo/standards/traceability-standard.md` · `…/scenario-data-pipeline.md` · template `…/templates/task-template.md` · matrix `…/traceability-matrix.md` · backlog `…/backlog.md`.
8. **Rule-pair (#15+#16):** every impl on user-facing surface = (a) package.json + (b) sw.js CACHE_NAME + (c) STATIC_SHELL if route-introducing. Data/infra-only commits exempt (expert self-notes).
9. **Real v4 UUIDs always (#17):** task:uuid AND requirement:uuid via `uuidgen`. Reject fake-suffix like `…-000000018009`.
10. **CMM4 4-role per task (#18):** req → architect → expert → tester.
11. **Planner uses scenarios (#19):** planning.md is generated VIEW from scenario JSON via `scripts/generate-sprint-md.ts <sprint-uuid>`.
12. **At-a-glance symbols (#14):** ⏳ planned · 📝 designed · 🔧 implementing · ✅ impl-shipped · 🧪 testing · 🏁 Tron-QA-done.
13. **R-H.2 atomic-req-split** before refinement closes.
14. **R-J per-Test reachability** — every test chains back to a requirement root via LOCKED chain.
15. **NEW (PO rule #65, 2026-06-07): NEVER /compact the expert.** SM+trainer rewinds instead. Pre-rewind context save is on each agent.

## PER-AGENT BOARD (last known)
- robbin-po (you): orchestrate; next pivot direction
- robbin-architect: idle ⇒ R18.19 zero-pad shipped 2276be51; allowlist hook for S1-S9 empty Sprint.tasks[] still open
- robbin-req: idle ⇒ canonicalise R18.20-R18.23/R18.26-R18.28 verbatim headers (inferred markers I noted in W1B3/W1B4)
- robbin-expert: HIT context limit prior session ⇒ SM+trainer REWIND (not /compact per rule #65)
- robbin-tester: idle ⇒ verify R18.9-R18.13 vs canonical wired Sprint; clear Class-missing-parent + Sprint-no-children flags (S10+ ones are real; S2-S9 deferred)
- robbin-skill-expert: in flight on T189 / SKILL.md scrum.pmo authoring
- robbin-planner (me): standing by

## TRON-QA GATE QUEUE (snapshot)
- Existing batch file: `scrum.pmo/tron-qa-batch-2026-06-05.md` (S16+S17, 29 strict-verified). **STALE — needs refresh** to include S18 T187-T198 + R18.x + champagne + zero-pad. PO requested prep for one-pass approvable batch (S5-S8 precedent — spot-check-3 + single approve commit).

## IMMEDIATE TODO (next session)
1. Re-verify current champagne metric (live `npm run trace:audit:strict` — earlier 23/44 7-hop but architect/expert work has landed since; recheck).
2. Refresh `scrum.pmo/tron-qa-batch-2026-06-05.md` → new dated file with S18 work folded in.
3. T191-T194 + T195/T197/T198 confirm tester-verified state if needed; many task units use status="Done" mechanically but Tron QA + tester strict-verify still pending.
4. R18.20-R18.23 + R18.26-R18.28 canonicalization follow-up with req-eng.
5. Allowlist for empty S1-S9 `Sprint.tasks[]` (architect's lane; tracked in task-planner-s2-s9-backfill.md).

## MY RECENT COMMIT CHAIN (post-rewind anchor)
- `8ce33c87` S18 sprints.json symlink tree + README scenario-data-pipeline link
- `e641224a` S2-S9 backfill DEFERRED (PO decision (b)) recorded in task file
- `7a88d664` S2-S9 backfill BLOCKED status (historical Task units missing)
- `bc11d861` S18 dogfood COMPLETE — Sprint.tasks=11, requirements=20, generator 11 task md
- `5d977918` W2B1 T191-T194
- `792132ff` `a5231818` `24bfe028` `2e48fa9a` Wave 1 R18.x batches
- `ffdc7dd0` T184 R-X1→R-Y1 rename + S17 closure cascade book-keeping
