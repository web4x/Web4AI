# robbin-planner Context — Save Point 2026-05-31 (pre-deep-rewind #2)

**Role:** Sprint Planner / board-consistency owner. Reports to robbin-po (robbinTeam:0.0).
**Pane:** robbinTeam:1.0 · **Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`

## Current State (v0.5.31)
- HEAD: my last planner commit (3729534 closes T132/T133/T134 bump-gap)
- 830/830 tests pass. Repo clean.
- Audit: 0 issues across all 17 sprints.
- NEXT NEW TASK = **T135** (T84-T134 in use).

## STANDING RULES (active — keep enforcing)
1. **QA Review + Done = TRON's gate ONLY.** Tron declares QA explicitly via PO. Never check Done from sync. (Learnings #15)
2. **CMM4 file-comms:** write into task files; otmux/hiveMind = short pointers only.
3. **Sync against COMMITTED reality.** Tester often leaves testing-box unchecked after PASS commit → check it. Architect drops content without checking refinement box → flag/coordinate.
4. **Discoverability:** new sprint → README + sprints.overview.md in same commit.
5. **req-eng + architect create files ahead of me** — reconcile (adopt content, fix numbering, wire to planning). Check `git status -s scrum.pmo/` every cycle for collisions.
6. **No artificial character limits** in specs.
7. **Standard:** `scrum.pmo/standards/traceability-standard.md`; template `scrum.pmo/templates/task-template.md`; matrix `traceability-matrix.md`; backlog `backlog.md`.
8. **Rule-pair (learnings #15+#16):** every impl commit on user-facing surface = (a) package.json bump + (b) sw.js CACHE_NAME bump + (c) STATIC_SHELL entry if route-introducing.
9. **Real v4 UUIDs always (learnings #17):** task:uuid AND requirement:uuid. Use `uuidgen`.
10. **CMM4 4-role engagement per task (learnings #18):** req → architect → expert → tester. No expert+tester-only stand-ups.
11. **Planner uses scenarios (learnings #19, NEW Tron 2026-05-31):** planning.md becomes a generated VIEW from scenario JSON units. Planner reads/writes scenario.json as the planning unit — same model as everyone else.
12. **At-a-glance symbols (learnings #14):** ⏳📝🔧✅🧪🏁 prefix per task line in planning.md.

## Sprint State (active — what to know on restart)

### S1-S15 — closed/QA'd or 🧪 awaiting Tron QA (see sprints.overview.md)

### S16 Traceability UX — 12 tasks; all impl-shipped or done (T120-T123 ✅), Phase 4 T121 🔧 (Phase 2 C2a/C2b done, C1/C3/C5/C6/C7 remaining)

### S17 Scenario Units (ACTIVE, near close)
- **T124** 🔧 — architect 4/6 sub-tasks done (T124.1, T124.2, T124.3, T124.6 testing[x] via self-review); **T124.4 req-eng requirements.md + T124.5 standard update STILL PENDING** (only S17 work left)
- **T125** 🧪 — Unit+IOR+7 ClassLoaders+ClassRegistry+ScenarioIndex+ViewTemplateRegistry (9b79be3, tester ticked 4c630dd)
- **T126** 🧪 — ViewGenerator + 7 templates + regenerate CLI (5a7e162)
- **T127** 🧪 — cross-nav /md/↔/trace + IOR resolver (b30b3de v0.5.28)
- **T128** 🧪 — T128.1 exemplar through 60d6e36 v0.5.29 iteration burst; T128.2/T128.3/T128.4 still gated on Tron exemplar sign-off
- **T129** 🧪 — verification GATE PASS (f487c2f — 222 graph objs, 6 chain walks PASS, 13/13 compliant)
- **T131** 🧪 — file-browser symlinks (aad0816 v0.5.30, retroactive — CMM4 gap; tester verified 37 markers)
- **T132** 🧪 — renderStatusHtml (4a362d0 + 2f6dde2 v0.5.31 bump)
- **T133** 🧪 — Task FSM 7 states/8 verbs/Tron gate (e062849, bumped via 2f6dde2)
- **T134** 🧪 — TraceLink class + symlink emission (f173cad, bumped via 2f6dde2)

## INCOMING WORK (PO 2026-05-31, post-rewind to stand up)
PO directed plan T135-T139 with CMM4 4-role:
- **T135** req-audit (formalize backlog Tron quotes that req missed)
- **T136** migration extension for Requirement+UseCase units (T128 follow-on)
- **T137** req+planner LEARN scenarios for planning + update SKILL.md
- **T138** skill set on scenarios (capture-quote, propose-task, walk-chain)
- **T139** fork skill-expert from expert (PO decision; agent-trainer executes)

Stand up T135-T139 in S17 (or new sprint at PO's call) with: real v4 uuids; 4-role owner block; Drive Plan ordering req→architect→expert→tester; rule-pair (a)+(b) scoped per task.

## TRON-QA GATE QUEUE (huge — pending Tron's batch approval)
- S9 T78 · S10 T81/82/83 · S12 T84 · S13 T91-95/100/109/118/130 · S14 T99 · S15 T101-108 · S16 T110-117/T120-123 · S17 T125/T126/T127/T128/T129/T131/T132/T133/T134
- T124 still 🔧 (waits on T124.4+T124.5 req-eng)
- T121 S11 still 🔧 (C1/C3/C5/C6/C7 + 12 remaining task:uuids)
- None marked Done. Only Tron's explicit "QA approved by Tron" commit releases the gate per #15.

## MY RECENT COMMIT CHAIN (post-rewind verification anchor)
- 3729534 (HEAD) — T132/T133/T134 rule-pair CLOSED (2f6dde2 v0.5.31)
- d1cafcf — massive S17 sync (7-commit burst caught)
- 99f190a — T131 ✅→🧪
- b7b1fc9 — S17 status reconciliation per PO 2026-05-31 (T124.1/.2/.3 testing self-review; T131 verified)
- a490028 — T132+T133+T134 plan in S17 (4-role first time proactively)
- 8315164 — T131 retroactive stand-up (CMM4 gap on aad0816)
- ff3fb59 — CMM4 4-role rule (learnings #18)
- ecce49e — at-a-glance symbols sweep (learnings #14)
- b0db445 — version-bump rule (learnings #15)
- c5be323 — STATIC_SHELL rule (learnings #16)
- 3181127 — real v4 uuids rule (learnings #17)
- 7214735 — S17 plan stood up (6 parents T124-T129)
- 0183b32 — emoji-prefix standing pattern (learnings #14)

## NEXT (on rewind recovery)
1. Verify HEAD == 3729534 (or beyond — git log)
2. Re-read context.md + learnings.md (you're doing this now)
3. Stand up T135-T139 per PO direction with 4-role + #17 uuids
4. Resume 15-min monitoring; watch for: Tron QA batch-approval (closes huge queue); T124.4+T124.5 req-eng; T128.2/T128.3/T128.4 if Tron unlocks
