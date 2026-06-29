# robbin-skill-expert Context — Save Point 2026-06-28 POST-FORK (WODA.prod, STANDBY)

**FORK NOTE (2026-06-28)**: Context-recovery fork by scrum-master (prior session saturating ~772k).
Knowledge restored from boot→context→learnings→doctrine. This save = next-cycle anchor (F-T17
gate: confirms write→commit works post-fork). Re-measure underway per robbin-po directive.

**Role**: Skill authoring specialist + rawbin-chain lint-gate + CurrentSprint 3-slot pin tool owner
**Status**: STANDING DUTY (PO, continuous) — keep CurrentSprint pin CURRENT at all times.
On task gate-GREEN advance pin to next active task via `planner-drive.ts focus <taskUuid>`;
on new task start, pin must reflect it. /trace top must ALWAYS show ACTUAL work, never a stale
completed task. Re-measure scoreboard/lint after each impl.

**PIN LIVE-TRACKING (2026-06-29, latest)**: Pin now follows current work via hardened autoFollow.
Sequence: walked T22.1->T23.2 (da9040dc6) -> held T23.2 -> advanced to **T23.3** (5f282c18,
'Identity merge cleans up room membership', req 75853976) on PO signal. Current /trace pin =
Sprint 23/T23.3, req done, uc+ pending (T23.3 In Progress, tester gating). My pin commit 78495aad4
<- planner task 52ebca28c (linear, no conflict). Version at v0.6.84 (expert). PO holds pin per
task until gate signal (learning #125). Scoreboard 27/291 — architect's 6 S22/S23 UCs + R23.x UCs
still pending for credit. WATCHERS: none active.

**RESOLVED 2026-06-29 (da9040dc6)**: Pin un-stuck via pin-tool self-heal. Hardened
CurrentSprint.autoFollow: missing UC unit -> req-anchored PARTIAL pin (uc+ pending) instead of
stale fallback; also fixed sprint label (m.sprintName||m.sprint). Walked pin T22.1->T23.2 (all
ok=true), now sprint=Sprint 23 current=T23.2. Built v0.6.82. Pin-honesty != credit: scoreboard
STILL 27/291 — S22/S23 don't credit until architect mints the 6 UC units (4d0e454a ada54a0e
1371923a 3ab76d13 b9792582 d0d09ff8). Asked PO: land on newer current-work task? + SW bump?
Open watcher: none active (UC watcher timed out). Re-arm UC watch if resuming.

**CRISIS 2026-06-29 — PIN STUCK 2 SPRINTS, ONE ROOT CAUSE**: Tron sees /trace Current = T21.9
(Sprint 21) while S22(4 tasks)+S23(2 tasks) shipped GREEN. MEASURED: all 6 S22/S23 tasks have
their UC UNIT MISSING on disk (4d0e454a ada54a0e 1371923a 3ab76d13 b9792582 d0d09ff8) →
autoFollow `if(!ucUnit)continue` fails for EVERY task → focus --force can't move pin → falls back
stale. SCOREBOARD 27/291 confirms SAME gap: R22.1-4+R23.1-2 all req=check uc=OPEN-architect
rest open (tasks 246-251 'Create UC -> architect'). SINGLE FIX unblocks pin AND credit: architect
mints 6 UCs + wires (req->uc->class->method). Nudged architect 0.3. Asked PO: (A) architect UCs
[proper] vs (B) greenlight me to harden autoFollow → req-anchored partial pin when UC missing
(honest: shows current task, uc+ PENDING, never stale). Recommended BOTH. Refused to fabricate UC
refs (would lie to Tron). On UC land: focus pin + re-score (~33/291 expected).

**PIN STANDING-DUTY STATE (2026-06-29, updated)**: pin=T21.9 (Sprint 21, STALE). PO directed
focus -> T22.4 (dd0c576d, covers req c13ee707). Planner committed all 4 S22 tasks (af1ba1627),
focus:true correctly set on dd0c576d. BUT pin WON'T switch — measured root cause in CurrentSprint:
pinCurrent reads a persisted singleton (uuid ...000000000001) that only updates if setFocus->
autoFollow can derive the task chain. autoFollow needs req+uc; UC-VF.4 (3ab76d13
'mdBrowser.pngOpensPreview') is MISSING on disk (req c13ee707 exists, UC does not) -> autoFollow
returns false -> singleton keeps old R21.9 chain. My --force bypassed the gate-guard correctly;
this is a MISSING-UNIT block. NEEDS: architect (0.3) create UC 3ab76d13 + wire to c13ee707. The
instant it lands, `focus dd0c576d` auto-derives (partial chain OK, returns true) -> pin switches.
NOTE: autoFollow returns false if uc missing even though it sets focus flag — possible tool
hardening: allow req-only partial pin so /trace shows the task even before UC wired.
**Last measure (2026-06-28, det-3x)**: Chain scoreboard = 20/285 COMPLETE (excl 49 orphan). 3-slot collapse FIXED by expert a0106ea86 (BUG-C: slots now always distinct uuids — verified: current 01d9fb64 / last 708ec0a5 / next 03917f53).
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
