# robbin-planner Context — Save Point 2026-05-27 (pre-deep-rewind)

**Role:** Sprint Planner / board-consistency owner, co-driving with robbin-po
**Pane:** robbinTeam:1.0 · **Reports to:** robbin-po (robbinTeam:0.0)
**Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`

## Current State (v0.5.22)
- Repo raced ahead during prior timeline; trust `git log` + `sprint audit` over memory.
- Traceability browser shipped at **/trace** (v0.5.21, top-nav). Full suite ~787 tests.
- Audit: 0 issues last check. NEXT NEW TASK = **T110** (T84-T109 in use).

## STANDING RULES (most important — keep enforcing)
1. **QA Review + Done = TRON's gate ONLY.** Tron declares QA explicitly, relayed via PO. NEVER check QA Review/Done without his declaration. (PO reinforced hard.) "qa is after implementing" (+testing).
2. **CMM4 file-comms:** write findings/status INTO task files; otmux/hiveMind = SHORT pointers only. Read files before asking.
3. **Sync against COMMITTED reality only** (not uncommitted WIP). But tester often leaves the `testing` box unchecked after a PASS commit → check it (committed evidence). The restructure pattern keeps DROPPING `## QA Audit` from tasks on expert commits → re-verify QA Audit + Traceability sections after each expert commit.
4. **Discoverability:** any NEW sprint → add to README "Individual sprints" list + `scrum.pmo/sprints/sprints.overview.md` in the SAME commit. Traceability artifacts indexed in README `## Traceability` (matrix + standard + audits). Push when PO asks / repo ahead.
5. **req-eng + architect create tasks/dirs ahead of me** — reconcile (adopt their content, fix numbering/structure, wire to planning). Watch every cycle for misplaced/untracked files + T-collisions via `git status -s scrum.pmo/`.
6. Tron directive: NO artificial character limits in specs.
7. Standard: `scrum.pmo/standards/traceability-standard.md`; template `scrum.pmo/templates/task-template.md`; matrix `scrum.pmo/traceability-matrix.md`; backlog `scrum.pmo/backlog.md`.

## Sprint State (S1-16)
- **S1-8:** Done, Tron-approved (a172a1d batch S1-4; S5/6/7/8 individual commits).
- **S9 Room Identity:** T74-77,79,80 Tron-QA Done (bc99ed7); **T78 tested→awaiting Tron QA**.
- **S10 Contacts UI:** T81/82/83 tested→awaiting Tron QA.
- **S11 Traceability Standardization:** T85/T86 impl-done(tested-ish); **T87 (S8,9 backfill), T88 (S5-7), T89 (S1-4) planned**, T90 verify. Remediation of S1-9 to full chain. Not yet executed.
- **S12 Editor Fixes:** T84 tested→awaiting Tron QA.
- **S13 Stability:** T91,92,93,94,95,T100,**T109** all tested→awaiting Tron QA. R-A1 avatar-persist SATISFIED by T91+T109 (both tested). T109 = avatar recurrence (decrypt-exception no-overwrite + rekey re-encrypt `rekeyUser`).
- **S14 Legacy Migration:** T96/T97 migrated, T98 verify PASS, **T99 gate cleared (T98 PASS + Tron auth) + delete EXECUTED (ec0423d v0.5.19)**; dual-write regen regression fixed (9c1b0a0 v0.5.20). S14 complete ONLY when a new-room-create proves data/rooms stays gone (was being closed at rewind — VERIFY THIS). T99 gate held end-to-end, no violation.
- **S15 Traceability Browser & Object Model:** T101-108 ALL impl-complete + tested (8/8 In Progress = tested, QA/Done unchecked). Browser at /trace. Awaiting Tron QA.
- **S16 Traceability UX (STARTED, NOT PLANNED YET):** dir `sprint-16-traceability-ux/` has `compound-requirement-source.md`. **PENDING PLANNER WORK** (missed prompt): plan S16 = tree-view UI — word-wrap, OS drag, tap-collapse, traceability-chain review, UseCase-as-class PUML. Coordinate req (requirements) + architect (design). Tasks T110+. Full traceability per standard. Add to README + overview. Report S16 plan to PO.

## TRON-QA GATE QUEUE (tested, awaiting Tron's explicit QA declaration)
S9 T78 · S10 T81/82/83 · S12 T84 · S13 T91/92/93/94/95/100/109 · S15 T101-108.
Nothing marked Done. On Tron QA declaration (via PO): check QA Review+Done on named tasks, sync planning Done + counts + totals + sprints.overview.md.

## DONE 2026-05-27/28
- 9e5f578: S16 planned (T110-T117) + S14 board corrected (v0.5.20 dual-write removed; my pre-rewind walk-back was stale).
- **e132eec (2026-05-28)**: T110 status sync per PO drift alert — shipped by expert (rb-detail-drawer + drawer integration, build clean, 791 tests pass). Planned+In Progress+refinement+creating-test-cases+implementing [x]; testing [ ] (tester pending); QA gate [ ]. Sprint 16: 1 impl-shipped, 7 planned. Audit 0 issues across S1-S16.

## OPEN ITEMS
- T111-T117: architect design content UNCOMMITTED (visible via system reminders 2026-05-28). When architect commits + checks their refinement boxes, sync planning.md status lines + Sprint Totals.
- S16 architect has supplied T110/T111/T114/T115 full designs + T112/T113/T116/T117 design (diffs not shown). diagrams/ untracked.
- No commits between 9e5f578 and HEAD (e132eec is the only new one) — PO's "S14 closure verified / fail-closed isolation / vCard fix" not in git yet; if they land, sync next cycle.

## TRON-QA GATE QUEUE (unchanged)
S9 T78 · S10 T81-83 · S12 T84 · S13 T91-95/100/109 · S15 T101-108 · S14 T99 (pending tester then Tron) · NOW also S16 T110 (pending tester then Tron).
None checked Done. Only Tron's explicit "QA approved by Tron" commit releases the gate.

## NEXT
- Coordinate with req (formal R16.x requirement:uuid split) + architect (icon-lib choice for T113, UseCase-class PUML for T117) when content commits land.
- Resume 15-min monitoring.
