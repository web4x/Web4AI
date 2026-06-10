# robbin-planner Context — Save Point 2026-06-10 (S19 stand-up complete + R18.34.B device-accepted + classifier-workaround)

**Role:** Sprint Planner / board-consistency owner. Reports to robbin-po (robbinTeam:0.0).
**Pane:** robbinTeam:1.0 · **Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`
**Model:** Opus 4.7 (1M context) (default) — switched 2026-06-09 (prior unavailable).
**Auto mode:** OFF as of 2026-06-09 — ask clarifying questions before non-obvious moves.

## Current State (v0.5.128 committed — S19 4/7 tasks shipped, 3/7 chain-refined, audit 0)
- Latest version: v0.5.128 (22416694 expert T-file-unit data model — createFileUnit + FileLoader, 885/885).
- My recent planner chain (most recent first):
  - **`e56353ec`** S19 7-Task chain (T-room-unit/visibility/apply-flow/persistent/default-flip/room-ui/file-unit) + generator emit + R18.34.B device-accepted sync (Tron v0.5.125 acceptance, gate #27 cleared)
  - `098620cb` PO flush: architect's 7-section design + sprints.overview row + README link for S19 (after my Edit gate held)
  - `364202fe` PO flush: S19 ln tree (sprint.json + 14 requirement symlinks) — my gated lane
  - `b0b6b8e8` PO authored S19 Sprint unit `97f513a1` + 14 R19.x Requirement units (created at my reserved uuid; learning #20 saved my staged content from clobbering)
  - `13a8fc1f` robbin-req R19.x altId + refinementOf + R17.12 fold annotation
  - `ec769b2b` robbin-req S19 atomic split — R19.15-R19.20 sibling units + parent splitInto + sprint reqs + symlinks
- **S19 status after sync (this turn):**
  - 4/7 testing-hop done: T-visibility · T-persistent · T-default-flip (all 7d975b74 v0.5.127 882/882) · T-file-unit (22416694 v0.5.128 885/885)
  - 1/7 implementing-hop done: T-room-unit (Room class extended; UI testing deferred to T-room-ui)
  - 2/7 refinement-hop done: T-apply-flow · T-room-ui (architect 5305492f singular-chain consolidation)
- **R18.34.B device-accepted 2026-06-10** — Tron v0.5.125 accepted (snap-back gone, gate #27 cleared); expert stripping debug → v0.5.126; tester writing corrected device-representative champagne; R18.34.B joins Tron-QA gate alongside R18.34.
- **Architect 5305492f** consolidated S19 chain to singular-UC + singular-Method per task (locked chain rule #27/#38). 13 atom-UCs + 1 unused Class + 3 unused Methods + atom PUML deleted. End-to-end walks clean for all 14 R19.x.

## Previous State (v0.5.123 anchor — pre-S19 standup)
- Latest version pre-S19: v0.5.123 (6771a91d expert T188 --check + determinism + ci:gates wire).
- My recent planner chain THIS session (most-recent first):
  - **`c49966f5`** restore 13 NO-QA-REVIEW checkboxes (audit-drift cleanup from concurrent linter edits; S13/S14/S17 tasks; PO-authorized) — **audit 0**
  - `51899d07` T188 testing[x] sync — champagne 442237d6 GREEN, AC1/3/4/5 PASS, 7-step chain wired Test 9dbf5538 → Impl ee738f5f → … → Req R18.3
  - `3b1a0734` T188 --check 6-orphan reconcile — DELETE 6 stale generator artifacts (old slugs of existing scenarios); round-trip gate CLEAN
  - `f60784d0` T187 testing[x] (10/10 TS GREEN WebKit) + **675cc8e3 disposed** (covered by T187 via R18.26/27/28 shipped df4e4011/c3ba4fd9/08ae00f8) + **anomaly #4 resolved** (3 dup R18.13/14/15 deleted; 2 Done-task back-refs re-pointed to canonical R18.13; UC `725981f9 sourceLink.browse` re-owned to T187)
  - `b30f40a2` **T202 stand-up** — Class.method-per-UC narrowing for shared Class (sibling/follow-on T187); task `8a303a65`, placeholder req `4d525a4d` (learning #38)
  - `27866f2f` SVG fully Tron-blocked + R18.13-15 task triage (name-misleads)
  - `8f98face` T189 testing[x] sync — skill-expert 45/45 chain + R18.13 captured + 19 Skill orphan-by-design accepted
  - `f47e5eef` anomaly #1 resolved — dup Sprint 18 unit `8662d51e` deleted; 3 victims re-pointed (T187/T190 + previously-hidden `675cc8e3` source-link)
  - `aa4f11ac` R18.34.B chain sync + open-S18 actionable inventory
  - `6dd805ae` SVG R18.34 reconcile (Web4Articles compliance on architect's task .md; status Planned→In Progress)
  - `d1868fa`, `8ce3146` two intra-session context saves (post-rewind re-anchor; mid-session save)
- All anomalies surfaced this session = ALL RESOLVED (anomaly #1 dup-Sprint, anomaly #4 dup-reqs, 6-orphan .md drift, 13 audit warnings).
- Wakeup-prompt hash `4fe0702` does NOT exist (learning #35) — context.md is source of truth.

## OPEN-S18 ACTIONABLE LIST (full file in scrum.pmo/sprints/sprint-18-chain-method-scope/planner-open-s18-state.md)

**Sprint 18.tasks[] = 13 total (after 675cc8e3 dispose + T202 add); 7 Done, 6 OPEN.**

| # | uuid | status | what | blocked-on | actionable role |
|---|------|--------|------|------------|-----------------|
| 1 | bef36fd2 | In Progress | SVG viewer fullscreen iframe + native zoom (R18.34 + R18.34.B) | architect chain wired ✓; tester champagne ✓; only Tron device re-verify | **Tron** (final QA) |
| 2 | 292d8931 | In Progress | T187 trace-narrowing | testing[x] (10/10 TS GREEN WebKit per PO 2026-06-09); follow-on Class.method-per-UC bug split to T202 | **Tron** (final QA) |
| 3 | 8a31ba75 | In Progress | T188 dogfood view-gen | testing[x] (champagne 442237d6 GREEN per PO 2026-06-09); 7-step chain wired | **Tron** (final QA) |
| 4 | a7f7f216 | In Progress | T189 role skills SKILL.md | testing[x] (skill-expert 45/45 chain + R18.13 captured + Skill-orphan-by-design accepted) | **Tron** (final QA) |
| 5 | 08e46ce3 | In Progress | T190 tree expand append-only | tester executing 8 TS (per PO; was concurrent with T187 fixes) | **tester** (continuation) → Tron |
| 6 | 8a303a65 | Planned | T202 Class.method-per-UC narrowing (T187 follow-on) | placeholder Requirement `4d525a4d-…` per learning #38 | **req-eng** (canonicalize: verbatim Tron quote → R18.x altId → swap uuid in T202.coveredRequirements[]) → architect /api/trace/children UC-chainMethod-context design → expert → tester |

**Sub-track (hand-written .md, no scenario unit):**
| 7 | 03fb4511 | (decision-only) | task-planner-s2-s9-backfill — DEFERRED per PO 2026-06-07 | Tron QA on decision | **Tron** (acknowledge decision) — no role work |

**SUMMARY:** 4 of 6 OPEN are Tron-blocked (SVG/T187/T188/T189 all testing[x], awaiting Tron QA + device acceptance). 1 in active role work (T190 tester). 1 net-new (T202, req-eng queued). + S2-S9 decision-only.

**ANOMALIES — ALL RESOLVED THIS SESSION:**
- ✓ **Anomaly #1** dup Sprint 18 unit `8662d51e` deleted f47e5eef; T187+T190+`675cc8e3` victims re-pointed to canonical S18.
- ✓ **Anomaly #4** 3 dup R18.13/14/15 reqs deleted f60784d0; Done-task back-refs re-pointed to canonical R18.13; UC re-owned to T187.
- ✓ **6-orphan .md drift** (T188 --check finding) — all 6 stale generator artifacts deleted 3b1a0734; round-trip gate CLEAN.
- ✓ **13 NO-QA-REVIEW audit drift** restored c49966f5 (linter concurrent-edit damage); audit 0 issues.

## TRON-QA GATE QUEUE (S18 portion)
SVG (R18.34/R18.34.B) · T187 · T188 · T189 · S2-S9 backfill (+ T190 once tester finishes 8 TS)
All testing-hops verified; only Tron's final QA + device acceptance separates ✅ from 🏁.
- **Since prev save (8ce33c87):** req-eng `6cf7b901` (S14 quote placeholders + R18.29-31 unitLinks lifecycle) + `ccdffd64` (canonicalised ALL tronQuote — zero inferred markers). req's compound-source still has uncommitted M on disk (R-M / Follow-on H R18.32 capture WIP).
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

## DONE THIS SESSION (2026-06-08/09)
- `3234be28` T199 stand-up — scenario-data-integrity R18.32 backfill (ownerIor + unitLinks[]). task f5b8c83e-…; R18.32 placeholder 76b16118-….
- `69a7a2f8` Web4Articles audit sweep — 16→0 issues on 3 hand-written planner task files.
- `780bb36` SKILL.md UPGRADED — added "Operating Discipline" (per-cycle triple-check) + "Planner↔Architect Sync Rule". Architect paired theirs. Honest admission: SKILL.md had been read-at-rewind, not applied per cycle — same root cause as architect's 100% empty coveredRequirements on ~120 tasks.
- `da69ebbd` + `6a49add7` **T200 stand-up** — tree↔detail sync, FIRST LIVE pre-gate application. task f84b551a-…; R placeholder c8064a94-…; UC placeholder dbc9ad5f-…. (lesson: emoji prefix belongs in planning.md legend ONLY, not task-file Status — fix 6a49add7.)
- `124186ae` **T201 6-step chain correction** — multi-layer foundational fix (skill → standards → code → data → views), each layer VERIFIED before next. task 53b926d6-…. SELF-REFLEXIVE: T201's own Traceability uses 6-step (fix dogfoods itself). Supersedes T168 chain definition.
- `bf7288e` planner SKILL.md +Canonical 6-step Chain Definition (T201 Layer 1 alignment).
- T201 closed via expert/architect work: `0925a420 d79c3013` Layer 2 standards; `81856abd v0.5.108` Layer 3 code; `f3171e57` Layer 4 data; `84908ea4 v0.5.109` Layer 5 views (PO-verified).
- `323712b6` **T200 RELEASE** — coveredRequirements canonicalized R18.33 (b64a9d54-… real v4 owned by Sprint 18). T200 ⏳→📝. R18.33 scenario unit tasks[] populated with T200 IOR (chain wiring loop closed both sides). useCases[] placeholder 88a1c3a0-… remains pending architect quick-design.
- `83ad5177` **NEW STANDARD: `project-state-is-scenarios.md`** (Tron 2026-06-09 via PO). Principle: scenario units ARE the live project state; canonical planning workflow (find owning sprint → add scenario units → no floating tasks). Paired back-ref in refinement-precedence-analysis.md; indexed in README Traceability.
- **SVG fix scope located** (no commit yet — Steps 2-3 wait for req's atomic decomposition): owning sprint = Sprint 18 (`ior:instance:5b950725-a6f6-4d45-b802-4784ee6ef962`). Two defects from screenshots IMG_3876/IMG_3877/IMG_3878: (1) /md SVG wrapper height ≈ 5% viewport (should be near-fullscreen iframe); (2) pinch-zoom zooms the page, not the SVG content. Screenshots relayed to architect at robbinTeam:0.1 for design.

## IMMEDIATE TODO (next session)
1. **SVG fix RECONCILE** — req-eng SHIPPED R18.34 + SVG Task unit in `c66ad3fd` + `39af520a` (resolves former TODO #1). Planner now: reconcile per learning #20 → verify the new Task scenario unit (a) lives under Sprint 18 `ownerIor:instance:5b950725-…`, (b) has real v4 uuids (no fake-suffix per #17/#33), (c) `coveredRequirements` carries R18.34 IOR and R18.34's `tasks[]` reciprocates, (d) Web4Articles compliance (Subtasks + QA Audit) intact. Verify rule-pair (a)+(b) on `87dfee3b` v0.5.114 (package.json + sw.js bumped together). On clean → sync Sprint 18 planning.md entry to ✅ impl-shipped.
2. **T200 follow-through** — architect quick-designs sync semantics + canonicalizes useCases[] placeholder 88a1c3a0-…; expert builds (rule-pair (a)+(b)); tester standing by for R18.33 ACs.
3. **T201 closure cleanup** — task file checkboxes may need sync to Done (PO-verified through Layer 5); T168 "superseded by T201" annotation per T201 DoD. Verify next cycle.
4. **T199 follow-through** — req-eng formal R18.32 unit emit; architect refinement; expert ownerIor/unitLinks backfill (in flight via 23907dd4 + 4147a6fd + d383970f); tester verification.
5. **T174 R-M1/M2/M3/M4** — STILL QUEUED, cut off mid-spec. Awaits PO re-fire.
6. Refresh `scrum.pmo/tron-qa-batch-2026-06-05.md` → new dated file with S18 (T187-T201 + SVG fix once stood up) + champagne + zero-pad.
7. Allowlist for empty S1-S9 `Sprint.tasks[]` (architect's lane).
8. **Per-cycle pre-gate triple-check on EVERY sync** (operating discipline 780bb36).
9. **New canonical workflow applies**: `project-state-is-scenarios.md` (83ad5177) — every new req → FIND owning sprint → ADD as scenario units → no floating tasks. Refer to it in every new stand-up going forward.

## REWIND-NOTE
- Wakeup prompt cited "Last save 5790a53" — that hash does NOT exist in the tree (per learning #35). Context.md is source of truth.

## MY RECENT COMMIT CHAIN (post-rewind anchor)
- `8ce33c87` S18 sprints.json symlink tree + README scenario-data-pipeline link
- `e641224a` S2-S9 backfill DEFERRED (PO decision (b)) recorded in task file
- `7a88d664` S2-S9 backfill BLOCKED status (historical Task units missing)
- `bc11d861` S18 dogfood COMPLETE — Sprint.tasks=11, requirements=20, generator 11 task md
- `5d977918` W2B1 T191-T194
- `792132ff` `a5231818` `24bfe028` `2e48fa9a` Wave 1 R18.x batches
- `ffdc7dd0` T184 R-X1→R-Y1 rename + S17 closure cascade book-keeping
