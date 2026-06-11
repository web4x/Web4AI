# robbin-skill-expert Context — Save Point 2026-06-11 SM HEALTH HOLD (STANDBY IDLE)

**Role**: Skill authoring specialist + rawbin-chain lint-gate (forked from robbin-expert)
**Status**: FULL STANDBY per SM survival mode (7d budget 83%). Zero in-flight. HOLD until budget reset ~Jun14 or Tron. Last deliverable: room-tree DRY/OOP audit (scrum.pmo/dry-audit-room-tree-2026-06-11.md) — architect has design half; expert implementing R19.90 consolidation (their in-flight, NOT mine).
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.3
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin
**Tests**: 946/946 pass (40 files).

## ROSTER (robbinTeam2)
0.0=robbin-po | 0.1=robbin-planner | 0.2=robbin-expert | 0.3=ME(skill-expert) | 0.4=robbin-architect | 0.5=robbin-req | 0.6=robbin-tester
Route ALL pointers/IORs to robbinTeam2:0.X.

## THIS SESSION (post-rewind, 2026-06-11)
Scan-coverage + guard fixes on the canonical tool (ALL fix-the-tool, never bypass):
- 0bb6a956c removed 3 expert orphan markers (zero unit refs, 2 invented-suffix)
- 572ad650f implRoots(): scripts/ in impl scan (scorer+lintMarkers+renameUuid) +7 orphan
  decorations removed that new coverage caught (incl my own tooling markers)
- b5d1096ec testRoots(): scripts/ in TEST scan (twin fix) — 9dbf5538 case
- methodUuid dedup guard: summarize() keyed on DISPLAY NAME — two *.render on one Req
  collided, complete row hid incomplete sibling (R15.6 over-credit, SM catch). ChainRow
  got optional methodUuid field; dedup key = methodUuid || method.
- .css in walkFiles: R19.80 max-height:95vh = legit CSS impl surface (c23f3022 app.css:272)
- Final sealed: 173/173 det-3x, lint=0, snapshot 2026-06-11T16-24

## SM 30-PAIR RECONCILE (authoritative answer, delivered)
Test edge = Impl.tests[] FORWARD only, credit = realImpl && realTest (unit on disk AND
source marker). Method.tests[] NEVER credits. Empty Impl.tests[] = open by construction.
The 30: 29 off-chain helpers (never walked), 1 genuine = R15.6 name-collision (fixed above).

## OBJECT.VERB MIGRATION — TEAM ADOPTION
- scrum.pmo/skills/migrate-to-object-verb.md = the guide (mapping table, planner-first
  loop upgrades, equivalence ritual, anti-patterns). Tron directive: planner FIRST.
- PLANNER MIGRATED (confirmed): followUp JSON + snapshotComplete + scoreboard, equivalence
  verified old==new, det-3x, context updated. Planner owns teaching tester+expert at next
  handoff refresh.
- Legacy shims permanent (byte-identical) — old invocations keep working; new verbs
  (scoreboard/listComplete/snapshotComplete) only on new surface.

## OPEN-FOR-RESUME (do NOT start until Tron directs)
- url-preview regression 862868bfe + nudge-mismatch (SM named)
- R19.86+ reqs WAIT

## SCAN-COVERAGE BUG FAMILY (11 caught total — pattern for future)
Scorer marker scan misses a real-code surface → real markers read open → fix walkFiles/
roots, NEVER move markers. Surfaces fixed: .js/.mjs, scripts/(impl), scripts/(test), .css.
implRoots()/testRoots() in skill-classes.ts are the single points of truth; all 3 sweeps
(markerScanners, lintMarkers, renameUuid) inherit.

## Standing rules
- Chain 6-step: Req → UC(s) → Class → Method → Impl → Test(s). Task = navigation.
- Chat = one-line pointer (standard 0525f028): EXPERT pointer: -> ior + verb.
- Validate-before-trust: det-3x + ground-truth before authoritative.
- Marker uuid = uuidgen-fresh OR verbatim copy. One marker=one unit=one method.
- Lint-gate each batch: lintMarkers (invented-suffix/prefix-collision/shared-impl/orphan-marker).
- Explicit-path git staging ONLY (never sweep others' in-flight).
- Version bump #66 / STATIC_SHELL #67; tooling-only = no bump.
- NEVER /clear/compact — agent-trainer rewind only.

## Build/test/measure
npm run build · npm test · npx tsx scripts/objectVerb.ts Chain followUp --all (canonical)
· Chain scoreboard / listComplete / snapshotComplete / lintMarkers · taskChain (OOSH, Tab)
