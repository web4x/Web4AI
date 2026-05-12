# ud-po Context — Save Point 2026-05-04

**Role:** UpDown Product Owner
**Pane:** upDownTeam:0.0 on MacStudio
**Branch:** qndNow

## Team
```
upDownTeam:0.0  ud-po (me)
upDownTeam:0.1  ud-architect
upDownTeam:0.2  ud-expert
upDownTeam:0.3  ud-expert-shell (Web4 init)
upDownTeam:0.4  ud-tester
upDownTeam:0.5  ud-tester-shell (server runs here)
```
SM peer: TRONinterface:0.1

## Sprint 3 — QnD Multiplayer Game (Deadline: Sunday)

### Status: 34 tasks done, game fully functional, all idle

### Completed
- Tasks 1-26: Game features (WebSocket rooms, lobby, game loop, special cards, scoring, PWA, bots, chat, spectate, profiles)
- Task 27: DRY MessageTypes.ts ✅ (regression 34/37 PASS)
- Task 28: DRY ShareUtil.ts ✅
- Task 32: Full UUID traceability — 75 UCs across all files ✅
- Task 33: Room auto-naming ✅ ("{playerName}'s Room")
- Task 34: Room UC coverage R7/R8/R9 + share link verification 4/4 PASS ✅
- 11 bugs fixed
- Coverage: 16 COVERED + 5 PARTIAL + 54 MISSING (21%)

### Deferred
- Tasks 29-31: DRY CardUtils, ScoreCalc, SpecialCards import

### Pending Tron Verification
- PWA installable on iPhone
- Mobile layout fits iPhone 15
- Chat pane UX on mobile
- Full game playthrough on mobile

### Key Files
- Planning: scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/planning.md
- Traceability: qnd/spec/traceability-matrix.md (75 UCs with UUIDs)
- Use cases: qnd/spec/qnd-usecase-diagram.puml
- Traceability diagram: qnd/spec/traceability-diagram.puml
- Tests: qnd/test/protocol-test-suite.js + qnd/test/vitest/ (9 UC files)

## Sprint 1 — De-monolithization (COMPLETE)
14 components at 0.3.23.1, all compile clean. Server start parity verified.
ADR-001 (npm exports), ADR-002 (version mapping) approved.
@web4x/cli component created. 57 sprint task files.

## CMM4 Learnings
- Always create task files BEFORE sending directives (CMM3)
- Architect specs, expert implements, tester verifies (role separation)
- Permission prompts are #1 velocity killer — use "2" (allow all) consistently
- Commit and push after each task completion
- Don't file bugs without checking code first (false room bug incident)
- oosh team handles their own infra (hivemind registry, UUID tracking)
- SM reminder: measure before acting, PDCA every cycle
- WRITE TASK FILE FIRST, then delegate — never shout ad-hoc directives (CMM1)
- VERIFY the actual diff before committing — don't rubber-stamp expert's "done"
- Rebuild esbuild after client changes — source changes don't appear without bundle rebuild
- Keep planning.md updated IN REAL TIME as tasks complete — not after Tron asks
- Don't reinvent — READ existing /ts code and COPY patterns, not rewrite from scratch
- Task files must match gold standard (task-32.2): [uc:uuid:], numbered AC, test structure, architect review
- PO's job is unblocking agents AND quality-checking deliverables — not just approving permissions
