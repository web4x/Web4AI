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
task until gate signal (learning #125). WATCHERS: none active.

**R27.7 CLOSED 2026-07-02 (54/317 det-3x, a5b6cd99c)**: SSRF-hardened WebItem preview fully
traceable. Arc: MY truncated-uuid diagnosis (markers used 8-char not full 36-char; found by diffing
failing vs crediting-control R27.1) -> expert full-uuid fix 6b03dc1bc + truncation hard-gate -> tester
4 fetchSanitized adversarial tests -> 53->54/317. Pin on T27.7. dist-EXCLUSION (PO directive) verified
ALREADY-by-construction in all 3 tools (walkFiles:64, strict-marker-audit:13, trace-audit:25) — no
change needed. New lint variant recorded: truncated-uuid marker. Pin advanced through S27 as tasks
credit; #126 holding. S27 still has R27.3/R27.5/R27.6 uc=open-architect + R27.1/R27.2/R27.4 test-open.

**S27 ACTIVE + R27.2 COLLAPSE DONE 2026-07-01 (18a8703e2)**: Sprint 27 (Detail View Enhancements)
active. R27.3 (per-task MD, 404 fix) GREEN. R27.2 over-count correction APPLIED: Class 163->108
(-55 dup), Method 415->353 (-62 dup), Impl CONSERVED 431==431, numerator HELD 53 (dups=structural
fan-out NOT credit), lint flat 184, scoreboard 53/314. Independently verified + reported clean
before/after. Pin on Sprint 27 / T27.3 (advanced off stale S26 via c7c4171c8; disk+server both S27).
CORRECTED an earlier over-claim: /api/trace?ior= dumps WHOLE graph (not the current-slot) — flagged
to PO, recommend visual /trace check for the literal Current widget. R27.4 DONE (7dae77ca9):
orphan-Methods 51->0, dangling 12->0, lying-markers 53->0, Impl 434==434, Class=111 (108+3 guard
mints). Measured via CANONICAL repair-r27.4.ts report-mode (NOT ad-hoc — my generic node gave
32/6, wrong definitions; team tool is authoritative). lying-marker CI clear to go strict. R27.2+R27.4
= full over-count correction: graph honest, dangling-free, dedup'd. Watchers: none active.

**S26 CHAIN-CLOSED 2026-07-01 (52/309 det-3x, commit b572494f6)**: Sprint 26 (Federation —
Clipboard UX + Universal Traceability) CLOSED. R26.1-5 all 6/6: resolveFederated, buildFederatedRef,
fetchScenario, resolveChildrenLazily, reconcileConflict. Pin walked T26.1->T26.5, now Current=T26.5
Last=T26.4. #126 CLEAN this sprint — T26.1-5 minted scenario-first, expert shipped code WITH impl
markers (chains hit 5/6 not 4/6), tester wired test hops. I held pin per-task through functional-
GREEN until each CREDITED (scoreboard move), never advancing on green alone. Pipelined cleanly
47->49->50->52. Mid-mutation discipline held (clean-tree gating on every watcher). Denominator
304->309 (+5 R26 reqs scenario-first). Next: S27 or PO signal.

**CURRENT 2026-07-01 (47/304 det-3x, HEAD f79f51cd0)**: S25 extended — R25.1-7 ALL closed
(added R25.5 clipboard-preview, R25.6 universal-scenario-link, R25.7 Room-dedup/Heartspaces-1-
Marcel). Scoreboard 47/304 det-3x clean. Pin on T25.7 (CLOSED). RULE #126 HOLDING: S25.5-7 landed
scenario-first (req+task before I focused); I flagged the one drift (R25.5/6 reqs-without-tasks-
while-code-shipped) -> planner minted tasks. Architect restructure (cd5e5ea60) dedup'd 2 phantom
reqs (denom 305->303) + minted 2nd UCs. Mid-mutation discipline applied (waited for clean tree).
Sprint 26 = 'Clipboard UX + Universal Traceability' + FEDERATION DESIGN just landed — S26 scoreboard
next. Watchers: none critical active. Pattern proven 7x: functional-GREEN != credit, markers gate.

**S25 FULLY COMPLETE + RULE #126 (2026-07-01, 44/301 det-3x)**: S25 all 4 reqs credit
(R25.1 routeUnknown, R25.2 createAndLaunch, R25.3 recognizeIdentity, R25.4 grab-bar+minimize —
both methods). Scoreboard 44/301 det-3x (expert 11 impl markers 0cddc012c + tester test hops).
No over-credit: verified followUp walks ALL UCs + surfaces first-incomplete (R25.4 2-method chain
legit). Pin on T25.4. lint: orphans ~0, 132 shared-impl = pre-existing framework debt.
**TRON RULE #126 (LAW, enforce)**: SCENARIO FIRST — units EXIST before any impl. Sprint->Req->
Task->chains->MD-generated->THEN code. Backfill = rule violated = debt. This session backfilled
S21-25 (the debt); NEVER AGAIN. Task without a scenario unit -> REJECT + report PO. See learnings.

**SCENARIO AUDIT S21-25 BEFORE-BASELINE (2026-07-01)**: Tron claimed "no sprint scenarios since
S20"; MEASURED from disk across 4 artifact layers — ALL PRESENT, premise contradicted. Index
Sprint/Req/Task units exist+wired (S21:9/9/9/9, S22:4/4/4/4, S23:3/3/3/3, S24:5/5/5/5, S25:4/4/4
+ 3/4 req->uc); planning.md+requirements.md all exist; sprints.json/sprint-21..25 = REAL dirs
(not broken symlinks). TOTAL GAPS = 1: S25 R25.3 (d0acb05d vCard-onboarding) UC c461d975 MISSING.
Likely backfilled this week during pin/formalization work. BEFORE baseline for verifying any
backfill isn't a dupe-creating no-op. Doctrine: reported measured truth over Tron's premise.

**S25 CHAIN-CLOSED 2026-06-30 (34/299 det-3x, commit 92e794765)**: Sprint 25 (Apple DnD: logging
+ WebItem handling) closed. R25.1 (DnD logging/routeUnknown) + R25.2 (WebItem/createAndLaunch)
both 6/6 credit. Same recurring pattern proven AGAIN: tester-GREEN (functional) + architect
"fully-wired" (units exist) are NOT credit — the [impl:uuid:] marker on named method + [test:uuid:]
marker are the actual gates; scoreboard moved 32->34 only when the marker batch landed. I flagged a
SCOPE GAP mid-sprint (T25.1=logging only, v0.6.87 handling untracked) -> PO minted R25.2/T25.2.
Pin walked T25.1->T25.2 live. NEAR-MISS: almost dismissed a watcher fire as 'stale' — read it, it was
the real 34/299 scoreboard move. ALWAYS read the watcher output, never assume stale.

**S24 CLOSED 2026-06-29 (32/297 det-3x, commit 7353f7989)**: Sprint 24 (Traceability Skills —
formalizing MY tools: objectVerb engine, pin, Chain scoring, sprint-md, trace-audit) CLOSED GREEN
+ traceable. R24.1-5 all credit. Sprint closed via MARKER batch (expert [impl:uuid:] on named
methods + tester [test:uuid:], 0 new logic) — exactly as I measured/predicted. Pin walked
T24.1->T24.5, now Current=T24.5 Last=T24.4 Next=none. getThreeSlots fix (v0.6.85) verified —
sprint-scoped, no phantom. FINDINGS flagged for R24.2 pin formalization: (a) pin depth != scoreboard
credit (pin=unit+wire, scoreboard=+marker); (b) complete task pins show wip=req depth=0 (setChain
resets activeHop=0). My S24 AC review (R24.1/R24.3) landed in req's reqs (6cd9248cb incl AC-6
delegation finding). chain-skills-formalization.md = my design contribution (02a509520).

**LATEST 2026-06-29 (commit 3dd6bc314)**: (1) R22-R23-marker-checklist.md written+committed — 6
chains (R22.1-4+R23.1-2) block at Impl+Test (Group B), target 27->33/297, R21 hard-rules baked in.
(2) R23.3 UC fc7356af MINTED per PO (architect omitted it) -> R23.3 req+uc=check; pin T23.3 advanced
wip=class depth=2. R23.3 class/method (Room.resolveToken) flagged pending architect 0.3. (3) S24 AC
sanity-check to req: R24.1+R24.3 verified accurate; nits = emitClaudeSkills(plural), followUp dedup
key=methodUuid(uuid) not display-name. S24 = Traceability Skills sprint formalizing MY tools
(R24.1 objectVerb engine, R24.2 pin, R24.3 Chain scoring, R24.4 sprint-md, R24.5 trace-audit).

**CREDIT STATE 2026-06-29 (post-architect-UCs dbc58876a, det-3x)**: scoreboard 27/297 — NOT the
33 PO expected. The 6 UCs (R22.1-4+R23.1-2) advanced those chains 3 hops (uc+class+method=check)
but all 6 now BLOCK at IMPL (open expert) + TEST (open) — UC necessary, not sufficient. Named
methods awaiting Impl units+markers: renderChainPathSection/attachMouse/renderChainNodeSourceLink/
renderImageLink/fillPreviewPane/embedYouTube + tester Test markers. R23.3 still uc=open architect
(NOT in the 6). To hit 33: expert+tester finish Impl+Test (offered R21-style checklist, awaiting PO).

**FORMALIZATION (main goal)**: chain-skills-formalization.md committed 02a509520 — surface (5
objects/~25 verbs), gaps (★ Pin/CurrentSprint ad-hoc in planner-drive.ts OUTSIDE registry; stale
OOSH symlink; no emit-drift gate), structure (per-object scripts, introspect=single source). Sent
design Qs to architect 0.3; req-pane routing requested from PO.

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
**Repo**: /var/dev/Workspaces/web4x/Web4RawBin ← MIGRATED 2026-07-02 (was /var/dev/Workspaces/2cuGitHub/Web4RawBin; that OLD path is stale). All pin/scoreboard/lint work now in web4x path. Verified git+scorer run there (det-3x 55/317).
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
