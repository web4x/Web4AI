# robbin-skill-expert Learnings

## Skill Manifest Design
- ior:class:Skill scenario units with typed parameters[], returns, impl IOR, requirement trace, roles, examples
- SkillLoader follows same pattern as TaskLoader/RequirementLoader (loader() factory in classes.ts)
- Adding a loader changes ClassRegistry count — update test assertions (toBe(N))

## UC Source Fill
- PUML-declared UCs: match by uc:uuid in PUML block or by name (case-insensitive)
- Bridge/generated UCs without PUML: source = scenario unit file path itself
- git log --format=%h -1 -- <file> for commit SHA anchoring
- line number from regex match position in PUML text

## Team Protocol Rules as Skills
- 11 precedence rules from refinement-precedence-analysis.md (Rules 1-11)
- Ship rules: #66 version bump, #67 STATIC_SHELL
- Verify rules: #27 7-hop gate, SW-active live repro
- Each rule = ior:class:Skill with impl pointing to the standard/script file

## Process
- Chat = one-line pointer; substance goes in task file (SM directive)
- Check for UUID collisions when creating units — uuid4() can land on existing file paths
- scrum.pmo/skills/index.md groups by object category

## Chain Correction (2026-06-08)
- Chain changed from 7-step to 6-step: Task removed from chain (Task = navigation layer)
- Chain: Requirement → UseCase(s) → Class → Method → Implementation → Test(s)
- Navigation: Sprint → Task → coveredRequirements → [chain starts]
- forward-only.ts FORWARD_KEYS updated accordingly
- traceability-standard.md rewritten to reflect 6-step

## CMM4 Skill-Tooling (2026-06-11)

### Validate-before-trust (8 tool bugs caught — DISCIPLINE)
Every measurement tool: 3 IDENTICAL runs + match ground truth BEFORE calling it authoritative.
Bugs caught this session (all in po-chain-follow-up/team-velocity):
1. Denominator drift (208/482/610) → canonical: one row per Req, deterministic
2. orphanByDesign bool stored, code did String(true).includes('orphanByDesign')=false → check ===true
3. cwd-fragile git (path.join not resolve + pipe|grep exit-1) → path.resolve + in-process regex
4. UC→Method walker used Class.methods[0] not UC.method → use UC.method pointer
5. marker scan globbed *.ts only, missed sw.js → scan .js/.mjs too
6. Impl check passed on marker alone → require idx.has(uuid) AND marker
7. velocity numerator recomputed (45) vs canonical (10) → execSync po-chain-follow-up, parse Summary
8. default window today-midnight (false 0 early-day) → default last-24h + print window label

### Canonical measure rule (CMM4 prevention)
- ONE canonical completion measure: Chain.followUp() via po-chain-follow-up.ts.
- NO parallel counts. Non-canonical scripts (trace-audit) HARD-REFUSE on --completion (exit 1) + redirect.
- Prevention over detection — agents physically cannot produce a competing number.

### Chain-walk gotchas
- UC.method field = the SPECIFIC method (use it, NOT Class.methods[0] — wrong when Class has many methods).
- Impl/Test 'check' requires BOTH source [impl:uuid:]/[test:uuid:] marker AND scenario unit on disk.
- Method→Test direct (Method.tests[] populated, implementations[]=empty) = INCOMPLETE. Impl node MANDATORY.
- 117/189 Method.implementations[] refs have markers but NO .scenario.json unit — data gap (expert fix).

## Object.verb Pattern (Tron FOUNDATIONAL directive)
- skill-classes.ts: Chain + Velocity classes. Logic in typed methods (followUp, wireImplNode,
  generateMatrix, updateMatrixRow, compute). Constructor DI (ScenarioIndex, paths).
- Scripts = thin dispatch. Composable (Velocity sources Chain.followUp).
- OOSH external script: scrum.pmo/skills/taskChain. Pattern = aiderOOSH (source this + this.start
  dispatcher + parameter.completion.* helpers + Object.method() functions).
- ooshTeam (ooshTeam:0.2 oosh-expert) links scripts to ~/oosh/external/ + verifies dispatch/completion.
- how-to-write-skills.md = the team guide. ASK oosh-expert for OOSH patterns — don't guess.

## Matrix
- scrum.pmo/traceability-matrix.md is STALE (planner T86, 2026-05-26, old req/uc/puml/method/uuid 5-col).
- Chain.generateMatrix(path, sprint?) regenerates from canonical followUp data.
- Chain.updateMatrixRow(reqUuid, path) updates ONE row.
- CLI: taskChain generateMatrix [sprint] / taskChain updateMatrixRow <reqUuid>.

## OOSH Principles (from ~/oosh/docs — read before writing OOSH scripts)

### Philosophy
- OOSH = Object-Oriented Shell. Brings OOP (modularity, reusability) to bash.
- Portability across Mac/Ubuntu/Termux/iSH/Pi. Transparency (logging/debug/state). DRY.
- Class = a script file. Method = `scriptname.methodname()` function. Constructor = `scriptname.start()`.
- Invocation: `./scriptname method arg1 arg2` → resolves to `scriptname.method(arg1, arg2)`.

### DRY is the core principle
- Command/parameter/default info defined ONCE — in the code. Completion engine reads it directly.
- NO duplication between docs, code, completion logic. The method signature comment IS the doc.

### The `this` bootloader
- `source this` (or `$OOSH_DIR/this`) initializes env, logging, config, PATH.
- `this.start "$@"` is the central dispatch — resolves method name → calls scriptname.method().
- Provides function-existence checks, dynamic loading, cross-script method calls.

### Method signature format (drives completion + docs — DRY)
```bash
scriptname.methodName() # <arg1> <arg2> # description of what it does
```
- The `# <args> # description` comment is parsed by c2 completion AND serves as usage doc.
- Parameter completion: `scriptname.parameter.completion.<paramName>()` returns candidate values (one per line).

### c2 dynamic completion
- `ng/c2` scans script function signatures + parses params/defaults automatically.
- New scripts/methods auto-included — no manual completion registration.
- Test completion interactively via otmux (real bash Tab in a tmux pane), not unit tests.

### Command creation (canonical way)
- `oo.new <name>` generates a script from `templates/code/` (sets up completion + usage).
- `oo.new.method <script.method>` adds a method with consistent structure.
- External/experimental scripts live in `~/oosh/external/` (e.g. aiderOOSH) — symlinked there.

### External script pattern (aiderOOSH reference)
```bash
#!/usr/bin/env bash
: ${VAR:=default}                                    # config defaults
scriptname.parameter.completion.X() { ... }          # completion helpers
scriptname.methodName() # <args> # desc              # methods (Object.verb)
{ npx tsx "$REPO/scripts/foo.ts" "$@"; }             # thin dispatch to Class.method
scriptname.start_dispatcher() {                      # dispatcher
  source this 2>/dev/null || source "${OOSH_DIR:-$HOME/oosh}/this"
  log.init.colors 2>/dev/null
  [ -z "$1" ] && { scriptname.help; return 0; }
  this.start "$@"
}
scriptname.start_dispatcher "$@"
```

### My taskChain applies this
- scrum.pmo/skills/taskChain = OOSH external script. Methods dispatch to Chain/Velocity TS classes via npx tsx.
- ooshTeam links it to ~/oosh/external/ + runs c2/otmux completion verification.
- KEY LESSON: ASK oosh-expert / read ~/oosh/docs before writing OOSH — don't guess the pattern.
  Docs: first-principles.md, command-creation.md, completion-system.md, advanced-usage.md.

### OOSH ↔ scenario-chain isomorphism (why Object.verb fits)
- OOSH method = `Object.verb` = same model as our UseCase naming (noun.verb) + the scenario chain
  (Class → Method). Skills written as Class.method become traceable units themselves.
- Logic in typed TS Class method; OOSH script + CLI = thin dispatch (route to instance + method anchor).

## OOSH External-Script Must-Knows (taught by oosh-po, ooshTeam:0.0, 2026-06-11)

### (1) Dispatch — canonical pattern
- Bottom line MUST be `scriptname.start "$@"` (function named `scriptname.start()`, NOT `.bootstrap`).
- `scriptname.start()` = `source this` → `log.init.colors` → empty-arg help guard → `this.start "$@"`.
- Method names use DOTS for hierarchy: `taskChain.task.add()` not `taskChain_task_add()`.
- Doc format (TWO hashes): `script.method() # <required> <?optional> <?optDef:default> # description`.
  1st `#` marks params, 2nd `#` marks description. c2 parses BOTH for help AND completion.
  Missing 2nd `#` = c2 silently broken.

### (2) Completion — per-method, param-name-matched
- Helper = `script.method.completion.paramName()` — name must EXACTLY match the param in the signature.
- Canonical (otmux): `otmux.attach.completion.session()` for `otmux.attach() # <session>`.
- Emit ONE candidate per line to stdout. Param-less: `script.method.completion() { :; }`.
- No completion fn = no Tab help even if the method exists.
- NOTE: `parameter.completion.X` (aiderOOSH global style) is the OLD pattern — canonical is per-method.

### (3) Symlink + verify flow
- External scripts symlink into `~/oosh/external/`; .bashrc adds those to PATH.
- Verify: `which scriptname` → symlink path; `scriptname<TAB>` → shows methods.
- TAB shows nothing = c2 didn't index it. Check: shebang `#!/usr/bin/env bash`, executable bit, dispatch line.

### (4) Anti-patterns (skill-authors get these wrong)
- flags (-h/-v) FORBIDDEN — use methods. Dashes in names = bash syntax error. Underscores = style violation (camelCase + dots).
- raw `echo` for return values → use `create.result 0 "msg"; return $(result)`.
- business logic in `.start()` — ONLY dispatch lives there.
- hardcoded `/tmp/` → `${TMPDIR:-/tmp}`.
- `while read` loops with ssh/scp inside → stdin consumed; use `done 3< file` + `read <&3`.
- `sed -i` without portability — macOS BSD ≠ GNU (BSD needs `sed -i ''`).
- missing `private.` prefix for helpers — pollutes namespace + completion.
- Ground-truth canonical files: ~/oosh/{this,oo,otmux,hiveMind}. otmux = clean completion style; hiveMind = command.subcommand hierarchy.

## taskChain AUDIT vs canonical (findings, fix during ooshTeam verify)
- DEVIATION 1: bottom uses `taskChain.bootstrap()` + `taskChain.bootstrap "$@"`. Canonical = `taskChain.start()` + `taskChain.start "$@"`. Rename.
- DEVIATION 2: completion uses global `taskChain.parameter.completion.reqUuid()`. Canonical = per-method `taskChain.<method>.completion.<paramName>()`. Re-bind to each method's actual param name.
- OK: method doc format (two `#`), dots-for-hierarchy, thin dispatch to TS classes, RAWBIN_HOME default.
- Coordinate fix with oosh-expert (ooshTeam:0.2) during ~/oosh/external link+verify.

## Reboot Notes
- Skill TOOLING active (NOT complete). taskChain awaiting ooshTeam link+verify (sent to ooshTeam:0.2) — apply the 2 deviation fixes above first.
- 19 Skill units + skill .md files in scrum.pmo/skills/. 3 metric skills + Object.verb classes + taskChain.
- Follow-on: oosh-expert verifies taskChain in ~/oosh/external; wire generateMatrix to overwrite matrix.

## Object.verb Migration Learnings (2026-06-11)
- Lazy-JSDoc regex `/\*\*([\s\S]*?)\*\//` SPANS across private methods to a later */ —
  line-based scanners beat multiline regex for signature introspection (c2-class bug).
- Ground-truth gate for canonical-tool rewrites: capture old output, rewrite, diff SAME-INSTANT
  (live agents mutate data between runs — a stale baseline shows false drift: 9 vs 25 was real progress).
- Determinism proof needs a FROZEN index snapshot (cp -R to /tmp) — shared-repo runs flap.
- Generated wrappers make style deviations structurally impossible (emitOosh fixed .bootstrap +
  global-completion deviations BY construction, not by review).
- Dispatcher main() must be entry-guarded (process.argv[1] endsWith) so vitest can import its exports.
- Answer "add a --list-complete flag" asks with a VERB (Chain.listComplete) — fix-the-tool means
  promote flag to verb, not add flag debt.

## Shared-Marker Inflation (2026-06-11, PO+planner 71d61048)
- DIAGNOSIS METHOD: "which Method units CARRY impl X in implementations[]" settles TOOL-vs-DATA
  in one query. 7 carriers = DATA. Tool was faithful to wrong data.
- TOOL-FIX-NOT-BYPASS: don't credit ambiguity — followUp un-credits any Impl referenced by >1
  Method (shared-impl xN + dispatch action). Measurement now immune to the bug class while
  data repair proceeds. Corrected 25/154 -> 7/158 (17 named false-completes).
- HARD RULE (PO): marker uuid = uuidgen-fresh OR verbatim 36-char copy. Telltales: -a1b2-,
  -b2c3-, -c3d4-, sequential hex. One marker=one unit=one method. grep FULL uuid before
  claiming a flip. chain.lintMarkers automates the catch (invented-suffix, prefix-collision,
  shared-impl, orphan-marker).
- Prefix-collision (same first-8 hex, >1 unit) = strongest invented-uuid signal (1/2^32 chance).
- snapshotComplete pattern: dated TSV + named added/removed vs prior = planner deltas with
  zero manual diffing. New-call-site gotcha: adding a param to a private helper — grep ALL
  call sites (listComplete missed implRefs, caught by CLI run not tsc since tsx skips checks).

## Git hygiene in shared live repos (2026-06-11, self-inflicted)
- NEVER broad `git add scenario/index/` in a repo where other agents commit live —
  swept 139 of req/expert's in-flight units into my commit 8c16192d. Stage EXPLICIT paths only.
  Content preserved (wer schreibt der bleibt) but attribution muddied; disclosed to PO.
- Fabrication detector: generalized +0x11 byte-progression (>=3 steps) beats fixed telltale list
  (63-68 hits vs 25). KEY DISTINCTION for reporting: fabricated-PATTERN uuid (style debt,
  marker=unit verbatim-consistent, chain valid) != ACTIVE defect (shared-impl, orphan-marker,
  prefix-collision). Report both numbers or cause false panic / false comfort.

## renameUuid pattern (2026-06-11)
- Atomic verbatim rename = 3 sweeps with full-uuid string replace: (1) the unit file itself
  (put new + remove old; JSON.stringify split/join catches self-refs), (2) every referencing
  unit, (3) every src/test marker file. Count-neutral by construction — verify pre/post
  scoreboard anyway. In each prefix-collision pair, re-mint the minted SIBLING (Impl), never
  the owner (Method/Task). Explicit-path staging: build the path list programmatically from
  the old+new uuids (prefixPath from hex chars) + grep for new uuids.

## Marker-paste-into-JSON bug class (2026-06-11, caught live)
- Agents satisfying hasRealImpl may paste // [impl:uuid:] INTO .scenario.json (line 2) —
  corrupts JSON, downs ALL canonical tools, and cannot even credit (scanner reads src/+test/ only).
  Signature: SyntaxError position 2 line 2 from ScenarioIndex.get. Sweep: python json.load over
  scenario/index/*/*/*/*/*/*.json. Repair: sed 2d if line2 is a //-marker (uncommitted -> restores HEAD).
- Bridge Impls (sourceFile=*.scenario.json) have NO real source: leave unmarked + route to architect.
- renameUuid scope: Impl/Test batch-safe; Req/Task/UC/Class uuids ALSO live in scrum.pmo planning
  docs -> verb now sweeps scrum.pmo/**/*.md (exclude chain-snapshots = history) but renames of
  planning-visible types need planner sign-off. dist/*.map stale refs = build artifacts, rebuild clears.

## Session 2026-06-11 post-rewind (lint-gate + scan-coverage campaign)

### Scan-coverage bug family — the single-point-of-truth fix
walkFiles extension filter + scan roots are THE recurring bug source (11 caught).
Fixed surfaces: .js/.mjs, scripts/(impl), scripts/(test), .css. Pattern: implRoots()/
testRoots() helpers in skill-classes.ts; ALL 3 sweeps (markerScanners, lintMarkers,
renameUuid) consume them — one fix covers scorer + lint + rename simultaneously.
CSS is a legit impl surface (R19.80 = max-height:95vh rule, no TS handler).

### Dedup identity must be UUID, never display name
summarize() deduped rows by method DISPLAY name (name.split('.').pop()). Two *.render
methods on one Req collided: first-complete row silently dropped the incomplete sibling
→ req over-credited (R15.6, SM independent re-verify caught it). Fix: ChainRow.methodUuid
field; dedup key = methodUuid || method. LESSON: any dedup/join in a counting tool keys
on identity (uuid), never on a human label.

### Independent re-verify (SM) catches what the author's own lint can't
My lintMarkers couldn't see the dedup bug — it lives in summarize(), not in marker data.
SM's brute scan (30 Method→Impl pairs, both tests[] empty) forced the authoritative
walk-through that exposed it. Welcome external sweeps; classify them rigorously:
(i) covered / (ii) off-counted / (iii) genuine — report all three numbers.

### Orphan markers: remove, don't stub
Marker with zero unit refs = decoration. Resolution = remove; proper credit path is
chain.wireImplNode (fresh uuid + unit + marker atomic). Applies to MY OWN tooling
markers too — the gate caught its author 7 times; delete without sentiment.

### Teaching = file + pointer, adoption = cascade
Object.verb migration guide: detail in scrum.pmo/skills/migrate-to-object-verb.md,
planner got a one-line pointer + pre-verified equivalence (I ran both surfaces myself
BEFORE asking planner to trust the ritual). Planner migrates first, then OWNS teaching
tester+expert via handoff refresh — adoption flows through existing instruction
channels, not by me editing other agents' files.

### Shared live repo state moves mid-analysis
Denominator changed 162→164→167→169→173 across one afternoon while I measured.
Never compare counts across runs minutes apart without re-baselining; snapshot
(snapshotComplete) at each decision point — named flips beat raw totals.

## v0.6.0 Marathon CMM4 Delivery/Quality-Process Takeaways (skill-expert role)

### Gate-faithfulness: the gate must SEE the bug
Match verification to the bug's physics. Paint bugs need structural+device gates (real viewport,
real renderer). Interaction bugs need behavioral touch gates with real coords + probe-real-target.
A passing vitest with jsdom proves code logic, not that iOS Safari fires the click.

### GATE-BEFORE-DEPLOY
Never ship a fix without a gate that would have caught the original bug. If the gate can't run
locally (e.g. needs iPhone Safari), document the manual verification protocol in the task file
BEFORE marking done.

### Measurement integrity (my lane, foundational)
det-3x = necessary but NOT sufficient (all 12 of my scan-coverage bugs were det-3x stable).
Over-credit scan (SM-independent) catches what the author's lint can't see (dedup collision).
Chain-debt is NOT champagne — honest count means BOTH: no false-negatives (scan-coverage family)
AND no false-positives (shared-impl, name-collision dedup, marker-without-unit).

### Source-VERIFY claims, don't relay
When an agent reports a number or a fix, trace it from code before relaying to PO.
"The metric says 165" → read summarize(), find the dedup key, reproduce the collision. Relaying
without verifying is how the false 162/165 numbers propagated.

### NEVER functional-first-then-backfill
Traceability-FIRST: chain unit + [impl:uuid:] marker in the SAME commit as the code.
Test-defined-first: the test scenario exists BEFORE the fix lands, turns RED→GREEN.
Backfill batches (our overnight 146→49 honest triage) prove the cost of doing it backwards.

### Tron-is-NOT-the-tester
Tron's device repro is a SIGNAL, not a test plan. My role: ensure the canonical tool faithfully
counts what IS tested, and flag what ISN'T. If a chain shows "complete" but no real device gate
exists, the completion is aspirational — flag it, don't credit it.

## WODA.prod migration + 3-slot pin defect (2026-06-28)

### Host changed: WODA.prod, pane 0.2, Node18-only-path
Repo is /var/dev/Workspaces/2cuGitHub/Web4RawBin (not /Users/Shared). Host default Node v16
breaks tsx (ERR_UNKNOWN_FILE_EXTENSION .ts). Node18 at /root/.vscode-server/bin/<hash>/node —
export PATH before npx tsx. otmux send hits /dev/tty error; use raw `tmux send-keys`.

### activeHop vs hopStates: two unreconciled state systems (measured)
getActiveChain() derives hop status POSITIONALLY (i<activeHop=done, i===activeHop=active).
hopStates is the per-agent realtime truth. At the LAST hop (test, idx 5), advance() can't
increment past 5 → activeHop stays 5 → test shows 'active' forever even when
hopStates.test='gate-proven'. FIX: pinCurrent/getActiveChain must read hopStates at the
terminal hop, not just position. (Reported; awaiting go.)

### 3-slot collapse: stale pointers not cleared on focus-switch (measured from disk+code)
After `focus --force` moved current to task 56cc23b5, getThreeSlots returned ALL THREE slots =
56cc23b5. Root cause: lastCompletedUuid AND nextBacklogOverride both still pointed at 56cc23b5
(the task that just became current). getThreeSlots reads both literally. WIP=1 itself held
(one focus flag). FIX: setFocus must clear lastCompletedUuid + nextBacklogOverride when they
equal the new current, and set lastCompletedUuid to the PRIOR current. Objects self-heal —
focus-switch must leave 3 slots distinct by construction.

### Doctrine-faithful reporting under WODA.prod
Measured slots + scoreboard (20/276 excl 49) from disk, reported the DEFECT (slot collapse)
not a convenient green. TRUTH = what the measurement says. The gap becomes the fix.

## R21 lint sweep 2026-06-28 (PO-directed, post-fork)
Full Chain lintMarkers (Node18, det-2x identical): 194 findings. ISOLATION method =
grep the R-suffix tag (`0000002100xx`) to separate R21-new from baseline in ONE query.
- R21-NEW = 10 orphan-markers (the ONLY R21-tagged). Baseline 184 (35 invented-suffix
  S18-Req-batch `18xxxxxx` + `d4e5f6a7` family, 17 prefix-collision, 132 shared-impl
  framework debt) — pre-existing, NOT R21. Report BOTH numbers or cause false panic.
- R21 had TWO defect kinds in the same markers: (A) orphan = marker in source, NO
  scenario unit on disk → R21.1-6 cannot credit (scorer needs marker AND unit);
  (B) cross-file DUP = each impl marker pasted into BOTH its index file (AddressIndex/
  EmailIndex/PhoneIndex.ts) AND server.ts → one-marker=one-unit violated. 5 unique
  uuids, fabricated-pattern (shared `58d9-4417-8480` seg + seq suffix = NOT uuidgen-fresh).
- FIX route = expert wireImplNode (fresh uuidgen unit per marker, ONE canonical source
  file each). Functional-first-then-backfill smell: code shipped, traceability orphaned.
- Scoreboard unaffected at 20/285 — R21 correctly shows OPEN (gate faithful: no false credit).

### Post-wireImplNode re-measure (84161c91f) — units != credit
PO expected "R21.1-6 should credit" after 5 Impl units landed. MEASURED: scoreboard STILL
20/285 (det-3x). Adding Impl UNITS does NOT credit a Req — all 6 hops must check. Only R21.6
Impl flipped (4242f9be); rest still need [impl:uuid:] MARKER in source (unit exists, marker
missing/mismatched) AND every R21 Test hop is open (no [test:uuid:]). LESSON: when a fix
"should" flip the count, re-measure before relaying — units-on-disk and marker-in-source and
Method.implementations[] wiring are THREE separate gates; wireImplNode satisfied only one.
The fix also REGRESSED: introduced 1 new orphan (a62c6e37-210008 CompanyIndex.ts) + 4 new
Impl↔UseCase prefix-collisions (minted uuids reused the fabricated 58d9-4417-8480 pattern
instead of uuidgen-fresh). A repair that creates new lint findings isn't done — re-lint after
every "fix" lands, not just re-scoreboard.

### Impl-credit has a 4th gate: strict NAME-MATCH (buildStrictImplSet, skill-classes.ts)
Marker + unit + Method.implementations[] wiring are necessary but NOT sufficient. The strict
scan ALSO requires the `[impl:uuid:X label]` marker to physically sit ON or INSIDE a named
function whose name matches the label-method (dn===labelMethod || includes either way).
Consequences caught on R21: (a) marker in an anonymous `/api/*` express arrow → no name-match
→ not credited even though present; (b) Impl unit NAME `phone.indexAsSymlink` while Method is
`registerSymlink` → labelMethod mismatch → rejected. R21.6 credited only because its marker sits
on the real named `mintAndLink` method. LESSON: when "marker exists but won't credit", read
buildStrictImplSet — don't tell PO "add a marker" (wrong dispatch); the fix is PLACEMENT + label
naming the method, not re-adding. FAKE_SUFFIX regex is NARROW (`/-a1b2-4c3d|-a2b3-|-b2c3-|-4c3d-8e4f/`)
— `-58d9-4417-8480-` fabricated uuids do NOT match it, so they're scanned (verified the real regex
before blaming it — a near-miss wrong hypothesis). Checklist: scrum.pmo/R21-marker-checklist.md.

### Sprint 21 CLOSE measurement (v0.6.74 @39ef620be) — GREEN-on-tests, OPEN-on-chain
PO called sprint-close after tester reported "R21.9 GREEN". MEASURED (det-3x/det-2x):
scoreboard STILL 20/285 (target was 29) — R21.1-9 chain ALL OPEN. The functional fix+test
shipped & deployed, but the traceability marker/unit/wiring work (R21-marker-checklist.md) was
NOT done. Worse: R21.9's functional commit ADDED 2 NEW orphan markers (5826ca42-210009 pan-zoom.ts,
5826ca42-210099 rb-preview-pane.ts) — chain debt GREW. lint 193 total, 9 R21-tagged open (4
prefix-collisions un-re-minted + 5 orphans). Slots clean (collapse fix holds).
DOCTRINE: "tester GREEN" = functional gate only; it is NOT chain-complete. The canonical
completion count is the chain scoreboard, and it said 20/285. Reported TRUTH, not the convenient
green PO expected. This is the textbook functional-first-then-backfill cost — flag it at close,
don't let "deployed + tests pass" be mistaken for "traceably done." Gap → next sprint.

## Re-measure 2026-06-28 (SM save-checkpoint)
Chain scoreboard det-3x = 20/285 COMPLETE (excl 49 orphan). Denominator grew 276→285 (more reqs).
3-slot collapse I diagnosed (stale lastCompletedUuid + nextBacklogOverride) FIXED by expert
a0106ea86 (BUG-C enforce 3 slots always distinct) — verified on disk: current/last/next now
3 distinct uuids. The gap I measured became a sprint+fix (doctrine: gaps become sprints).
