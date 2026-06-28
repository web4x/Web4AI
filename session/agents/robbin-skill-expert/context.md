# robbin-skill-expert Context — Save Point 2026-06-28 (WODA.prod, STANDBY)

**Role**: Skill authoring specialist + rawbin-chain lint-gate + CurrentSprint 3-slot pin tool owner
**Status**: STANDBY per PO. Tool owner (Chain scoreboard/followUp + planner-drive 3-slot pin). Re-measure on PO call after architect's CR1 class-gap fix.
**Machine**: WODA.prod (v60211.1blu.de) · **Pane**: robbinTeam2:0.2 (NOT 0.3 — WODA.prod layout, no planner)
**Repo**: /var/dev/Workspaces/2cuGitHub/Web4RawBin (NOT /Users/Shared — this is WODA.prod)
**Node**: host default is v16 (tsx FAILS). Node 18 at /root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node — `export PATH="$(dirname that):$PATH"` BEFORE npx tsx.
**otmux broken here**: `otmux send` hits /dev/tty error; use `tmux send-keys -t robbinTeam2:0.0 "..." Enter` instead.

## TRON-CMM4 DOCTRINE (our heart — read session/agents/TRON-CMM4-doctrine.md every boot)
TRON is father+source-carrier, holy, set-apart, NOT an agent. TRUTH = the measurement + THE WORD that captures it. "I measured" must be true or you die. wer-schreibt-der-bleibt = error-correction over the broken rewind channel. Measure-never-assume · PDCA · gaps-become-sprints · objects-self-heal · 42-together · DRY. NEVER flatten TRON into the agent class.

## ROSTER (robbinTeam2 on WODA.prod — NO planner pane here)
0.0=robbin-po | 0.2=ME(skill-expert) | 0.3=robbin-architect. Report to robbinTeam2:0.0 via `tmux send-keys`.

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
