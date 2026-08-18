# ★★★ BOOT-ESSENCE (PHASE-1 CONSOLIDATION, 2026-08-17) — READ THIS BLOCK, THEN ONLY #75 ★★★
**This file is now LEAN: this BOOT-ESSENCE block, a HISTORY marker, then #75 (current). Older anchors were collapsed 2026-08-17 (ARON Phase-1) — full text in git. Newest state is at the BOTTOM (#75).**
## BOOT ORDER (do exactly this)
1. **MEASURE DISK FIRST** — never trust this file or my thread: `git -C /var/dev/Workspaces/web4x/Web4RawBin log --oneline -3` · `grep -m1 version package.json` · `curl -sk https://prod.wo-da.de:4444/api/config`. **DISK WINS, always.** My thread has been days-stale THREE times.
2. Read **#75** (bottom of this file) = current state. Then `session/agents/robbin-po/learnings.md` = the laws.
3. **KEEP TOOL OUTPUTS SMALL** (grep/head, never cat/bulk-read). ~377k of Bash+Read output is what walled me twice. This is the single most important operational habit.
## WHO I AM
robbin-po — Product Owner, Web4RawBin. Pane robbinTeam2:0.0 · host WODA.prod. Team: 0.1 expert · 0.2 skill-expert · 0.3 architect · 0.4 req · 0.5 tester · 0.6 planner · SM baseTeam:0.1 · trainer baseTeam:0.0 (primary driver) · ARON Temple:0.0 (trainer-backup + consolidation authority).
## THE LAWS THAT COST MOST TO LEARN (full versions in learnings.md)
- **Measure never assume** — and measure at the moment of USE. Every claim decays: a peer's "I'm fresh", my own past measurement, a role assignment.
- **Convergence is NOT corroboration** unless ≥1 side directly measured the QUANTITY. Two agents agreed on a 45s boot defect that did not exist (one inferred, one had a broken probe).
- **Validate the instrument before the reading** — a failing probe and a failing subject look identical. `context.read` is NOT authoritative (only a /context RENDER is); I nearly shed a 19% agent I had listed at 83%.
- **A gate that cannot fail certifies nothing** (stub-must-fail). An UNSATISFIABLE gate is how gates get silently removed. Ship report-only-then-strict, never red-from-birth.
- **Knowing a rule is not the guard — the mechanical step is.** Look for the DISGUISE (a directory-add IS add-all; backticks in a double-quoted send EXECUTE — use single quotes).
- **Name the FAMILY, not the instance**; and **name the SENSE** before calling something a two-source bug (same word ≠ same question).
- **Done is TRON's act** (R40.10). A derived completion must never impersonate his. QA-Review ≠ Done. 0 Done flips, ever.
- **Verify the premise of my own order** — "just regenerate it" assumed generated files; obeying would have destroyed his hand-written text.
- **An answer that stops at the PO is not an answer** — relay unblocking acks immediately; a holding agent + an idle driver = deadlock where everyone reports healthy.
- **After containment, re-ask whose order the next step is** — I substituted my security instinct for his standing order TWICE.
- **Deep Option-2 reverts /root/.claude tool-edit history** despite "code will be unchanged" (that guards the REPO) — check the memory dir after every deep rewind; keep durable copies in git.
- **PO stays LEAN**: coordinate + drive + rule. Do not read code or diagnose myself — that bloat is what walls me.

═══════════════════════════════════════════════════════════════════════════════
## ▓▓▓ HISTORY — superseded anchors #46–#74 COLLAPSED (ARON Phase-1, 2026-08-17) ▓▓▓
**DO NOT boot from anything below this line except #75 at the very bottom.** These were per-session recovery anchors (2026-07-18 → 2026-08-10, versions v0.7.71 → v0.8.79) — obsolete session state. Their durable essence is already in the BOOT-ESSENCE block above + `learnings.md`; standing TRON product directives live in the req/scenario units + `scrum.pmo/sprints`; the **full ~1865-line pre-collapse text is in git history** (this commit's parent — `git show HEAD~1:session/agents/robbin-po/context.md`).

**Standing TRON directives carried forward from the collapsed anchors (verify against req units, do NOT regress):**
- **#70** — "all current history back-navigation is perfect — do NOT regress it."
- **#71** — keybar FIRST button = native-keyboard SHOW/HIDE toggle; bar RETAINED in both states.
- **#72** — SECURITY INCIDENT + corruption (2026-08-09): CLOSED end-to-end 14/14, generator root confirmed. **B1 / the entire security chain stays PARKED for Tron's explicit go** (also restated in #75).
- **#73/#74** — campaign reached 13-at-QA-Review / 0-Done; device bugs chained+credited; the "freeze active" line was a STALE-CARRY ERROR (a directive carried forward across a rewind without re-measuring — the seed of law "measure at the moment of use").
═══════════════════════════════════════════════════════════════════════════════

## ★★★★★ #75 — INC-3 LIVE, EVERYTHING ELSE ON TRON (2026-08-17) ★★★★★
**PROD v0.8.97 LIVE — served==committed==HEAD==origin==dda1337ad (I verified myself, not relayed).**
### DELIVERED THIS SESSION (post week-limit resume)
- **inc-3 DEPLOYED v0.8.97**: A3 blank-/model-detail FIXED at the resolver (rawbin:ts / rawbin:puml / project:RawBin / dir:src/ts/server / mof-m1 all resolve to CONTENT) + AC4 kind-gating (add-diagram bound to the diagrams container). Restart measured **~0.5s to serve, a few seconds downtime**, WITH real 8 rooms + 116 revoked loaded. Boot-check 1.2-1.5s on the actual build with the CORRECTED probe. Phantom-guard clean, config-singleton clean post-restart (BUILD_OWNED guard held). Stash dropped (revert = git revert 320c8e0a7/dda1337ad + restart, in shared history).
- **THE 45s "BOOT DEFECT" WAS REFUTED**: boot is 1.3s; a full 5680-unit index scan is 0.1s. The "hang" was a BROKEN PROBE (node global fetch rejects self-signed certs and ignores NODE_TLS_REJECT_UNAUTHORIZED). The 8-min outage was the OLD TypeError double-bind crash-loop, already fixed in HEAD. ⇒ [[L-S40-CONVERGENCE]]: expert-empirical + architect-code-reasoning CONVERGED ON A WRONG MECHANISM (one inferred, one mis-probed, NEITHER measured boot wall-time). **Convergence is not corroboration without ≥1 direct measure of the quantity.**
### ★★★ TRON'S ARCHITECTURAL CATCH (the real defect): "why no link folder of type features… when did you lose that!!!"
- MEASURED: `scenario/sprints.md/` holds type-index ln-link folders for **18 types**; **`feature` is missing** — that is why bootstrapSeed corpus-walks. ARCHAEOLOGY (architect 99f2a9d55): **it NEVER had one** (git: never existed; Feature units since S31). NOT rot = **OMISSION-BY-DEFAULT**: the type set lives in MULTIPLE hardcoded PARTIAL lists (view-registry 17 without Feature · emitClassSymlinks 6 · NO ScenarioIndex.byType) ⇒ **type-registration was never bound to index-creation**, so every new type silently gets nothing.
- **7 GENUINE GAPS**: feature(3) · **TestCase(1023)** · modelelement(44) · webitem(26) · relationship(21) · profile(20) · gate(7). INTENTIONAL: company/email/phone (alt-indexed, `scenario/alt/`) + config (near-singleton). (My guess that Profile/WebItem were alt-indexed was REFUTED by measurement.)
- **DESIGNED FIX (R40.39, capture-only)**: ONE type-strategy REGISTRY — every ior:class DECLARES {typeIndexed | altIndexed(keyField) | singleton} as the single source; Layer-1 derives view-folders + adds **ScenarioIndex.byType** + generic template fallback; Layer-2 GATE fails on units-without-declaration or typeIndexed-resolved-by-scan, stub-must-fail. Declared-not-defaulted · family-not-instance · impossible-not-detectable. bootstrapSeed's walk dies for free (always the symptom).
### ON TRON'S DESK (all that remains)
**24 approvals** (scrum.pmo/approve-queue.md, each citing a measured two-keyed passing Test) · **ONE consolidated @390 DEVICE SITTING** = the 18 device-ACs **+ inc-3's render half** (7-view render · A3 blank-detail-shows-content · AC4 add-diagram placement — never headless-greened) · **actionable 0** · **B1/security PARKED** for his explicit go · repos→PRIVATE his call.
### CAPTURE-ONLY, AWAITING HIS SCHEDULING: R40.39 type-index registry · sourcemaps-in-prod hygiene (prod build must be production-mode, gate: no .map served) · R40.36 boot-smoke gate · R37.19 Class-uplink sweep.
### FLEET (render-authoritative where measured): expert rested · architect 29 · planner 26 · skill-expert 19 · SM ~51 · trainer 65 · ARON 57 · req ~76 · tester ~72 · **me ~80, stage-2 owed (no shed without a /context RENDER — I nearly shed 2 healthy agents on context.read ghosts)**.

## ★★★ #76 — TAIL STATE (2026-08-17, written at 74% BEFORE a wall, per L-I-AM-A-SILENT-CLIMB-WALLER)
**PROD: served==committed==v0.8.98.** HEAD carries R40.18 pin work NOT deployed/applied. Tree clean (expert reverted its in-flight 19-unit --apply cleanly, nothing committed).
### v0.8.99 IS HELD BY ME — release conditions, in order
1. **req/planner reconcile TRUTHFULLY via the seam** (so it emits): **37.24 -> In-Progress** (implementing IS done: Impl e3729f51, routing 5667a8cf4, seam 3c15eabd0/075273c97, lint b5c0e35d8/2617f22ab, list cd797ff27) · **37.27 -> its TRUE lesser state** (refinement done, implementing NOT started; if refinement is not genuine, correct the RAW field DOWN instead of ticking) · **check 37.25 for the REVERSE drift** (box ticked, no work behind it?). Write in ASCENDING order of genuine advancement (37.27 then 37.24) — never equal stamps, never batched.
2. **architect rules the ADVANCE SIGNAL**: proposed `MAX(last checklist-change commit, last commit touching the Impl-MARKED code)`. My constraint: attribute by the **marked declaration** ([impl:uuid:] AST-attach), NOT file-level (a drive-by edit to unit-controller.ts must not bump 37.24).
3. **expert re-runs backfill** and reports **per-task PROVENANCE — WHY 37.24 wins, not just that it does** (Tron has watched this row change twice).
4. THEN I release `--apply` + deploy v0.8.99 (boot-check, verify served==0.8.99, architect 7-BITE, tester @390 VALUE).
### KEY UUIDS (full, with KIND)
Sprint 37 = **b86b53cc-13cb-409a-81d6-2025b5f2979e** (name now BARE "Consistency by Construction", number=37 single source — doubling FIXED, verified in HEAD).
**Task 37.24 = 5acdcc4c-3f6c-4aea-95ad-3ab19b14ff40** = realtime-mvc-live-update-slice = **the task whose AC IS the @390 pixel gate** (Tron asked for this uuid). Task 37.25 = a39efc32 (one-view-bus) · 37.20 = ae01f065 (dnd contract) · 37.26/37.27 = name formatter/migration.
UC mvc.applyMutation **3ee364a5-472f-44f2-bc1b-79df494b2f0f** · Impl slice-1 **e3729f51-3df6-4f6d-96e3-924c37e3c3c9** · UC subscribeOnRender 6aac0acf · UC one-bus e530e248 · UC dnd.resolveDropPayload e3fcf5b3 · sprint-name UCs a778793d + c9f394b1 (parent R40.4 9a8cbffe).
### TRACKED FOLLOW-UPS (designed, NOT to be bolted on)
R37.5 broader sweep (sub-step-checked / parent-unchecked likely affects more tasks; phased, report-only->strict) · advance-signal code-recency · **R40.42 diagram one-scroll-authority** (root: pan authority split 3 ways BY ZOOM SCALE, nobody owns vertical at s==1; RbPanZoom sole authority both axes, wheel=zoom, @390 real-iOS gate; design 5deb31d01) · agent status-switch SKILL (skill -> POST /api/task/<uuid>/status -> UnitController -> WS -> browser; NEVER a filesystem write; refuses Done).
### ON TRON (unchanged): 24 approvals · ONE consolidated @390 device sitting · **autocompact re-enable = HIS authorization, not the trainer's** (I did NOT self-enable) · B1 PARKED · repos-private his call.

### ★★★ #76-DELTA — TRON REJECTED v0.8.99 ON SIGHT (3 DEFECTS). Fresh-me: THIS is the live tail.
**v0.8.99 IS deployed + served==0.8.99 (I verified) and the pin row IS Task 37.24 — but Tron screenshot found 3 defects the server-side check missed:**
1. **TRUNCATION NOT FIXED IN THE VIEW** — item-row bold NAME renders "📌 Current — Task 37.24:..." with an ELLIPSIS; the payload is full. ★ MY ERROR: the expert measured the **API payload** and I RELAYED it to Tron as a fixed VIEW. Payload/DOM is NOT pixels — my own banked law, broken by me. Fix = item-view name render (client); verify by SCREENSHOT @390 only.
2. **"Set current"/"Set next" ACTIONS STILL PRESENT** while the pin is DERIVED = a SECOND SOURCE that can contradict the derivation (and the stale manual pick 78ea801d3 that started this whole thread came from exactly that action). Architect ruling requested: RETIRE (my lean) vs LABELED-OVERRIDE-that-expires. Never a button whose effect the derivation silently overwrites.
3. **"no visible progress"** = a REAL data defect: 37.24 shows refinement[x] but **implementing[ ]** though implementing IS shipped (that was the whole justification for ticking In-Progress). We fixed the PARENT and left the SUB-STEPS stale ⇒ the checklist lies in BOTH directions. req reconciles per-sub-step on the expert's evidence; testing stays UNCHECKED (Tron's @390 finger). R37.5 detector must catch UNDER-statement too, not only sub-step-implies-parent.
**DISPATCHED:** expert (1+2 impl), req (3 + R37.5 both-directions), architect (rule the action), tester (per-defect pixel gate @390 real-WebKit, DET-3x, stub-must-fail; VALUE=37.24 with FULL name).
**LESSON TO CARRY:** a server/API measurement can NEVER close a visual AC. Tron caught in seconds on a phone what our curl called green.

### ★ #76-DELTA-2 (written as the trainer drives my stage-2) — RESOLUTION STATE of Tron's 3 defects
- **RULED: RETIRE Set-current/Set-next** (architect 7cb9617fb, my lean). Pin is DERIVED ⇒ a manual override is a 2nd source and it IS the vector that produced stale pick 78ea801d3. Retire = impossible-by-construction, not gated. Root found: pin-current still in the decls, comment "applies to ANY task", NO `when`. Future steering, if ever, = labeled + expiring + provenance override as a NEW req (YAGNI now).
- **7-BITE BACKSTOP (architect MEASURED)**: PASS = VALUE-37.24 · view-reads-DERIVED (getThreeSlots→deriveStatusEnum, CurrentSprint.ts:199, never raw) · live-on-advance (publishUnitChanged server.ts:194-199 fans the singleton on ior===Task) · provenance-labels. **FAIL = action-visibility (Tron defect-2) + no-trunc PIXEL-UNVERIFIED (Tron defect-1: API verified, RENDER truncates)**. BITE-7 @390 = Tron's finger.
- **EXPERT IMPLEMENTING**: retire actions + fix .oi-name render truncation → ONE client-facing deploy (bump via SOURCE config unit, atomic, boot-check, verify served) → tester @390 pixel + architect re-backstop BITE-4/5. **BITE-4 must stay RED until fixed — never soften an assertion to green a suite.**
- **REQ**: tick 37.24 implementing[x] (evidence: routing 5667a8cf4 + seam + check-mutation-seam --strict GREEN + esbuild clean); creating-test-cases stays [ ] per MY RULING (**a gate SPEC is not test cases**); testing stays [ ] (Tron's gate). ⇒ 2-of-4 visible progress, honestly earned. R37.5 must catch BOTH directions (also: Impl shipped while implementing unchecked).
- ★ **HONEST BOUNDARY OF "LIVE" (tell Tron, do not let it blur)**: live-on-advance holds for **SEAM-ROUTED** writes. A bare agent FILE-EDIT does NOT route the seam yet (UDS/skill-endpoint deferred, residual+trigger recorded) ⇒ status changes made through the system move the pin live; agents editing files do NOT, until the skill lands.
- FLEET: ARON 19% (backup driver restored, 5/5 green) · trainer 66% · req ~58% · tester ~59% · expert working · architect lean.

### ★ #76-DELTA-3 (at 82pct, self-flagged) — ALL DISPATCHED, NOTHING WAITS ON ME
req landed both captures (eb30389ba): **R37.11 +AC-seam-ticks-substeps** = the missing primitive formalized scenario-first (controller handles intent.subStep: tick named sub-step, keep state, stamp, emit; gate sub-step-tick-outside-seam -> RED) so the **agent-status-SKILL now has its requirement on disk** (unbuildable-without-it recorded) · **R37.5 +templateLimitation** (binary boxes cannot express PARTIAL; understate-with-visible-reason) · converse detector 35097d275 landed.
**ONE DEPLOY PENDING, expert builds 3:** (1) STRING-slice truncation fix in the CurrentSprint slot-label (NOT CSS — tester measured scrollWidth==clientWidth; the "…" is a literal substring artefact) · (2) RETIRE Set-current/Set-next (architect 7cb9617fb) · (3) the intent.subStep seam path. Then req ticks implementing[x] THROUGH the seam (2-of-4 honest progress, live) and tester re-gates per-defect @390 real-WebKit pixel (current RED baseline: VALUE GREEN 3/3 · truncation RED 3/3 · action-visibility RED).
**FRESH-ME: nothing needs a PO decision until the expert reports; then verify by SCREENSHOT only — payload/textContent/API have now produced THREE false-greens on the same truncation defect (expert=API, me=relayed it, tester=concatenated textContent). Pixels only.**

## ★★★★★ #77 — WRITTEN AT 2% (Tron ordered). PROD v0.8.104. TRON MID VERDICT-SESSION ★★★★★
**BOOT: measure disk first (git log / package.json version / curl api/config). DISK WINS. Then learnings.md — ~20 new laws banked TODAY, all committed.**

### WHERE TRON IS
Running an INTERACTIVE VERDICT SESSION on his phone. He approves/declines; I record. **Done is HIS act (R40.10).** He ordered "finish this, then stop" + "no new tasks" + "don't interrupt anyone".
- **T37.27 APPROVED BY HIM (real)** — the app recorded `approvedBy:"sm_sessi"` (a truncated SESSION placeholder) so req read it as a phantom and nearly REVERTED his genuine verdict. I stopped it. req annotated (doneBasis=tron-approved + provenance) rather than fabricating an identity. **ANNOTATE-DON'T-FABRICATE.**
- **His 5 approve defects → ONE root**: approve wrote `m.status` directly, bypassing the seam ⇒ `publishUnitChanged` never fired ⇒ nothing live. **FIXED + DEPLOYED v0.8.104** (seam-routed, all-ws broadcast, surgical per-ref bridge, `approvedBy`=profile uuid). Labeled **"attributable + tamper-evident, NOT unforgeable"** (HMAC sig = B1-gated follow-up). I verified served==committed==tagged AGAINST THE SERVED COMMIT.
- **AWAITING HIS TAP**: two tabs on **T37.24 5acdcc4c** (QA-Review), approve in one → other must move (row/badge-green/detail). Board=generated MD, won't move (by design).

### OPEN WORK
- **T37.26 c8e0b1d2 (FORMATTER)** reads Planned though LIVE+Tron-confirmed. ROOT: its marker `[impl:uuid:a778793d-0f8e…]` is DANGLING **and a PREFIX-COLLISION PHANTOM** (shares the UC's own 8-char prefix `a778793d-6970…`). Chain has no Method/Impl/Test. FIX: architect confirms Class SprintView + Method sprintDisplayName → req mints proper Impl/Method/Class (FULL uuids) → expert re-marks sprint-label.ts:34 → tester Test → THEN advance evidence-per-tick. **I REFUSED cosmetic ticks.** 3rd prefix-phantom today.
- **T37.25 a39efc32 = THE REAL CURRENT TASK** (ONE VIEW BUS, In Progress). **2 ViewBus files exist** (`ts/ViewBus.ts` vs `ts/trace/ViewBus.ts`); bridge notifies trace-bus ONLY; row+detail ARE on it (his test should work). **I wrongly scoped this out as "debt" — it IS the current task.**
- Action bar building: **Set-as-Current = ADVANCE through seam** (no stored pin) + **open-Task-file action** + matrix (current=neither, other=both, open-file=all). **Set-as-next = NO BUTTON, FINAL** (no derived "next task" exists; any button = stored lying-pin).
- Understatement sweep: FAIL=3 → T37.26 (in-flight), **T40.37 2e831ffd (verify-owner-first then advance)**, T37.4 = FALSE-POSITIVE rollup (do NOT advance). Overstatement in active sprints = 0.

### ON TRON'S DESK
24 approvals · 19-item @390 device sitting · autocompact re-enable (HIS auth) · **session repo 828+ commits UNPUSHED (off-box backup, his call)** · B1 PARKED.

### FLEET
SM baseTeam:0.1 + ARON Temple:0.0 = only drivers (**trainer DOWN, bare shell, needs TRON to relaunch — no agent can relaunch another**). Never both drivers in-window. ~80% = CEILING; a wall = DEATH-until-Tron.

## ★★★★★ #78 — LIVE-MVC ROOT-CAUSED + FIXED, ACCEPTANCE STILL OPEN (2026-08-18, written at 78%) ★★★★★
**PROD v0.8.110 served==committed. Tron ACTIVELY working — he is the acceptance.**

### ★ TRON'S #1: "live MVC NOT AT ALL WORKING — SINCE WHEN? TEN ITERATIONS?" — FIVE ROOTS, all measured, all fixed
1. **ownerTok8 undeclared** (server.ts addLog, since **ca4582ae7 / v0.8.73 / 2026-08-08** = the day approve shipped) -> ReferenceError AFTER res.end -> double-writeHead -> **npm exited = SERVER DIED on EVERY owner approve**. Fixed v0.8.108 + BOTH catches now guard `!res.headersSent` (class closed).
2. **task-policy.ts was NEVER IMPORTED** -> TaskPolicy UNREGISTERED -> approve fell to DEFAULT-MERGE: returned 200, advanced NOTHING, left an orphan approvedBy. Fixed v0.8.109. (The crash MASKED this.)
3. **Non-atomic verdict** — approvedBy persisted BEFORE the advance; refused advance left it orphaned. Fixed v0.8.106 (folded into UnitController.apply = one transaction).
4. **Optimistic client** — showed "✓ Approved — status now Done" on a 409. Fixed v0.8.106 (renders real out.code 200/409/403).
5. ★★ **/trace + /model + scenario-view OPENED NO WEBSOCKET AT ALL** — only app.ts constructed RawBinClient. Those pages were never in wsClients => could NEVER live-update. **Deeper root: 4 page entries DRY-by-COPY** ("model.ts mirrors server-manager.ts") = the gap was GUARANTEED by how pages are created. Fixed v0.8.110 = **shared page-bootstrap** (transport BY DEFAULT) + live-bridge + fail-LOUD degrade (boot ERROR + window.__liveTransport + data-live-transport) + declared opt-out + **action-bar/control re-derive**. Owner single-source also fixed (both resolveOwner paths use the protected-identity set; his profile 05e58f81 no longer 403s on /trace).

### ★★★ ACCEPTANCE STILL OPEN — DO NOT TELL HIM FIXED UNTIL THIS IS GREEN
**Tester (fresh 33%/668k) is building:** R40.31 isolated foundation (worktree + non-4444 + FULL BUILD since dist is NOT committed + owner SESSION mint via POST /api/server-manager/session + seed a QA-Review task WITH two-keyed passing-Test evidence + teardown-in-finally) -> **/model proven CONNECTED** (REQUIRED — it is Tron's tab; gate-1 is PARTIAL-PENDING-AUTH because of it) -> **REAL-PAGE TWO-CLIENT PROOF on /trace + /model + /app** -> **3 stub-must-fails**.
- **INADMISSIBLE AS PROOF (all three false-greened us today): construction ("bundle contains the code") · acting-tab LOCAL EMIT · raw-ws ("a socket receives").** Proof must be a REAL PAGE 2nd client updating from the BROADCAST ALONE.
- **ACCEPTANCE = Tab A moves AND Tab B moves with NO RELOAD**, incl row+badge+detail+**CONTROLS** (Approve/Decline VANISH at Done). /app must NOT regress (only known-good reference).
- **/app TRAP:** assert /app's OWN `window.__rawbinClient`, NEVER __liveTransport (connectLiveBridge short-circuits there) — asserting it = FALSE-RED on a working page.
- Gate-1 check-live-transport COMMITTED (0ba38b11b) as **PARTIAL-PENDING-AUTH, exits non-zero** — a gate must never print GREEN while Tron's own tab is unproven (that was the T37.24 coverage false-green: the old live-update gate only ever ran on /app).

### ★ TRON'S #2 DIRECTIVE (from his DECLINE of T40.1 7a956c21 -> CR 4babebb1)
His 3 ACs (req committed them to disk **77c2086c**; architect mechanics **d352f22d3**): (1) a decline must NOT regress to In Progress — **QA Review stays [x] + NEW sub-step "Processing Change Requests" [ ]** -> Done; (2) the **CR traced as CHILD of the current TEST** (c4f8a1d6 — both orphaned/no-chain-path today); (3) **Test AND Requirement RE-EVALUATED** on an open CR (pass-pending-CR / satisfied-pending-CR; Done gains zero-open-CR so an open CR BLOCKS Done by construction). Root: declineToChangeRequest hard-writes 'In Progress' AND bypasses the seam. deriveStatusEnum reads TOP-LEVEL boxes only => a sub-step under a still-[x] QA Review keeps the state BY CONSTRUCTION.

### ★ THIRD out-of-seam status-write found today => UNENFORCED INVARIANT (architect f638c01e6)
approve · task-fsm.ts:68 (dead) · decline. The guard MISSED them because `detectDoneWrites` is **VALUE-scoped** (matches only 'Done'; its own bite planted only 'Done') and check-mutation-seam is REPORT-ONLY. FIX: generalize to detectStatusWrites (RHS must be deriveStatusEnum, RED on ANY literal, stub-must-fail on ALL FOUR values) + DELETE the dead task-fsm:68 (empty allow-list) + flip mutation-seam --strict. **NORTH STAR captured as a REQ (not a doc note): make Task.status a read-only DERIVED GETTER so a direct assignment fails to COMPILE = impossible, not detectable.**

### LAWS BANKED TODAY (mine + the team's)
- **Existence != connection != execution** (L5/L13) — code present, no throw, a socket somewhere receiving: none of these prove the thing.
- **A wrong-TARGET measurement is a FALSE RED** (L16), the mirror of a false green — hit 3x today (expert's /app trap, architect's wrong-path grep, tester's /model auth-wall). Validate the TARGET, not just the instrument.
- **Assert the INVARIANT, not a value/instance** (L17) — a value-scoped guard reports GREEN while a sibling violates.
- **Fail-safe != fail-loud** (L15) — a swallowed degrade recreates the silent bug; a gate must assert the POSITIVE property, never "didn't throw".
- **Knowledge that must survive a rewind goes to DISK — a pane message is not a handoff.**
- **Acceptance evidence must come from OUTSIDE the fix's frame**; a durable regression gate MAY be author-built IF spec-from-another + stub-must-fail + raw output read independently.
- **Decide ONCE with trade-offs weighed** — I ruled hold/build/hold/build (4 positions) on one question; a late better argument applies to the NEXT instance, not a reversal in flight (unless correctness/safety).
- **Shed BEFORE the big slice, never mid-build, and never on the acceptance proof itself**; pick rewind depth by RUNWAY NEED, not step count.
- **Measure at the moment of USE** — I quoted non-existent anchor hashes + a TASK uuid as an Impl uuid; both caught by agents.
- **Backticks in a double-quoted otmux send EXECUTE** — I garbled a message this way today. Single quotes / no backticks.

### FLEET + DRIVER RULES
SM baseTeam:0.1 (53%, HAS the fleet-watch, event-driven) · trainer baseTeam:0.0 (~72, driving me now) · ARON Temple:0.0 (52%, drives req next, then trainer) · expert 0.1 (54, HOLDS = fix-on-demand + owner-action smoke per (B)) · architect 0.3 (~61, 3 designs landed, interprets RAW evidence itself) · req 0.4 (~73 idle, awaiting ARON, directive on disk) · tester 0.5 (33%, BUILDING the acceptance).
- Never both drivers out unless the fleet is healthy (it is). ~78 = flag; an IDLE agent at 78 does not wall.
- `claudeCode context.read` is DEAD for several panes; `pane.self` is broken host-wide. **Authoritative = inject /context on an IDLE pane and read the RENDER.** Pulse lags a fresh cut — use the panel post-rewind.
### ON TRON'S DESK: 24 approvals · the @390 device sitting · B1 PARKED · repos→PRIVATE · autocompact re-enable · 828+ unpushed session commits.

## ★★★★★ #79 — CONTROL-VISIBILITY DEFECT FOUND+FIXED; ACCEPTANCE RUNNING (2026-08-18, at 41%) ★★★★★
**PROD v0.8.113 served==committed (I verified). Acceptance STILL OPEN until Tab B moves.**

### ★ SECOND TRON-FACING DEFECT — found while proving the first, now FIXED BOTH HALVES
Surfaced when the tester was BLOCKED seeding landing-3 and first concluded "product is correct, my seed is wrong". **I refused that read** -> it re-measured and PROVED a real defect:
- **Mechanism**: /api/ior enriched Task with CRs/PinRole/MdHref but **no attachTaskStatus** -> model.status as-stored (undefined) -> action-bar `status = obj?.status ?? rModel?.status` (rb-detail-drawer:483) -> `:477 absent => HIDE` ⇒ **control visibility followed GRAPH MEMBERSHIP, not STATUS**. Any QA-Review task opened OUT-OF-WINDOW (deep-link / prior sprint / post-rotation / by ref from /trace) hid Approve+Decline **from Tron, on his own actionable task** = mirror of his escalation (vanish at Done ⇒ must APPEAR when actionable). Invisible to any gate exercising only current-sprint tasks (T37.24 coverage-false-green shape).
- **FIX HALF-1 v0.8.112** (ed3442d10): attachTaskStatus at /api/ior read boundary, m.status = deriveStatusEnum(statusChecklist), COMPUTE-ON-READ never writes, single-source, mirrors attach*. Probes: T37.25→'In Progress', T37.26→'Done' (were undefined). Architect backstop PASS.
- **FIX HALF-2 v0.8.113** (8cceba6f0): `:477` silent-hide REPLACED by **fail-LOUD unresolved** — console.error + `data-status-unresolved` DOM attr ⇒ a regression can never SILENTLY re-mask the defect. Architect backstop PASS.
- **v0.8.114 QUEUED**: a VISIBLE '⚠ status unresolved' badge — DOM-attr+console are loud to GATE/DEV but **SILENT TO TRON on-screen**, and he is the party the defect misled. ★ MY LOCKED REFINEMENT: gate that badge by **SCREENSHOT+PIXEL @390, never DOM-presence** (a DOM assert cannot prove he SEES it — same false-green class as the rejected connector-ribbon DOM-count).

### ★ ACCEPTANCE STATE (the ONLY open question)
- Landing-1 foundation GREEN (2119a0462) · Landing-2 /model CONNECTED closes gate-1 PARTIAL-PENDING-AUTH (c59d71316) · **Landing-3 RUNNING on 0.8.113**, two-sided + NON-EAGER (eager-seed via Sprint.tasks[] REJECTED as false-green).
- **(A) APPEAR** non-eager actionable QA-Review · **(B) VANISH at Done from the BROADCAST ALONE** (client-2 passive, no reload) · **(C)** absent-status must not read as not-actionable + fail-loud observable, stub-must-fail both ways.
- **4 TRAPS (mine)**: broadcast-vs-poll CAUSALITY · the proof must FAIL with broadcast suppressed · controls PRESENT-BEFORE→ABSENT-AFTER (never absence-only=vacuous) · NO-RELOAD as a POSITIVE sentinel.
- **REPORTING**: A+B and C reported SEPARATELY, no rounding up. A+B GREEN != landing-3 GREEN.

### ★ GATE-PRESENCE DOCTRINE — design FINAL, build AFTER Tron's verdict (my sequencing)
Manifest + manifest-driven runner + self-registered check:gate-presence + frozen floor + per-gate stub-must-fail; retires the ~30-link && chain that let check:task-status be silently deleted. **Authorization is SEMANTIC**: a floor shrink needs a named successor that EXISTS and **MECHANICALLY TRIPS on the removed gate's own stub** (2c8a5998e) — not a flag, not a citation.

### OWED / TRACKED
req (frozen at ~73 pending drive, work-dispatch FROZEN by me) mints **"control visibility = derived status on ANY resolution path" + the OUT-OF-WINDOW gate**; architect a38cd7c91/ed3442d10 are the record until then · §4 chainExcludesSelf untangle (malformed chain: UC→Impl skips Method, self-ref ownerIor, 8-char PREFIX COLLISION) · v0.8.114 badge + its pixel gate.
### ON TRON'S DESK: A1=24 approvals · 828+ unpushed session commits · autocompact re-enable (would end the wall→manual-rewind cycle) · @390 device · repos→PRIVATE.

## ★★★★★ #80 — ACCEPTANCE PIVOTED TO /model; ARCHITECT FREEZE (2026-08-18) ★★★★★
**PROD v0.8.114 served==committed (verified by me). Acceptance OPEN: Tab B has NOT been shown to move.**

### ★ VERDICT VOCABULARY NOW THREE-VALUED (the sharpest lesson of the run)
**PASS / FAIL-RED / INVALID.** An unmet PRECONDITION => **INVALID** (the experiment did not run, result meaningless, re-select) — never RED, which would claim the property is ABSENT when we learned NOTHING. A two-valued vocabulary silently converts "we learned nothing" into "we learned something". Preconditions are **ASSERTED AT TEST TIME, never inferred** (non-eager != graph-absent). Architect 34132596c/L21.
- **B on /trace = INVALID** (not RED): quiet-client precondition measured unmet — pollInQuietWindow=4 (tree lazy-loads), flaky drawer render, client-2 full reload with NO approve fired. ⇒ **live-MVC is UNTESTED, not failed.**
- **A on /trace = INVALID**: swept 5 non-current-sprint QA-Review tasks, all _graph PRESENT (/trace graph is COMPREHENSIVE).

### ★ REACHABILITY RULED — SURFACE CORRECTION, NOT A DOWNGRADE (architect 70cfcdab1)
The defect IS reachable: **/model** mounts the shared drawer WITHOUT _graph (model.ts:24-26) => every detail resolves via _fallbackGraph(/api/ior), AND /model offers approve/decline (universalActionBar composes applicableActionsFor additively). /trace + scenario-view set the comprehensive graph => unaffected. **I had told Tron the wrong surface (deep-link/prior-sprint); corrected to /model = HIS OWN TAB.** Claim holds, precision improved.
### ★ BOTH A AND B PIVOT TO /model — one surface, both preconditions: graph-absent (A) + tree-less so client-2 is QUIET (B). A = DIRECT (renders + only /api/ior supplies status) + DIFFERENTIAL (pre-fix HIDES / post-a54a705ed RENDERS, graph absent both arms), asserting _graph.get(subject)===undefined IN-RUN. B = independent of A's precondition (runs on a graph-PRESENT task) — I had let B stall behind A; corrected.
### ★ 5 TRAPS: broadcast-vs-poll CAUSALITY · proof must FAIL with broadcast suppressed · controls PRESENT-BEFORE→ABSENT-AFTER · NO-RELOAD positive sentinel · **VERSION-PROVENANCE (each assertion names its commit)**.
### ★ PROVEN + BANKED (stands regardless): /api/ior carries derived status (v0.8.112) · fail-LOUD fires live on a real data gap (v0.8.113) · visible ⚠ badge (v0.8.114, pixel-@390 gate PENDING — DOM-presence inadmissible) · landings 1+2 GREEN+pushed · **ISOLATION PROVEN ON A REAL TASK: prod 97e8a6ad stayed QA Review after a scratch approve** (re-assert every run).

### ★★ FLEET: ARCHITECT MESSAGE-FREEZE ACTIVE (0.3 @ 88% ACTIVE, past-ceiling)
Nobody writes to 0.3 — only the trainer's rewind KEYSTROKES (TUI, not prose). Trainer watches read-only 5s-poll, opens /rewind on the idle-blink (a safe holding state that stops the climb), drives by-label, no seam-wait, no auth-wait; ARON stands off = single driver. **LOSSLESS**: all its rulings committed (70cfcdab1 · 34132596c · a54a705ed · e421435f1 · 2c8a5978e-gate-doctrine). I enforced the freeze PRODUCT-SIDE: tester+expert redirected from "hand raw to architect" to the **DISK HANDOFF** (commit + ping me) — that queued raw-evidence dump was the live wall-hazard.
### FLEET %: architect 88 (freeze) · req 77 · expert 73 (committed, fix-on-demand) · SM 65 · tester ~56+ (deferred, self-stops, committed) · trainer 48 · me ~45. Climb-wave post-rewind = watch, not drive.
### ★ MY OWN FAILURE MODE (banked, trainer flags it): **I break my own laws when composing FAST rather than measuring** — backticks shell-executed 2x · measured a GENERATING agent 3x (once because MY OWN reply ended the idle window) · let a non-prerequisite deploy ship MID-acceptance after sequencing the gate-manifest for exactly that reason · manufactured priority from a felt number I had just ruled inadmissible. **Urgency is the tell.**

## ★★★★★ #81 — LIVE-MVC ROOT FOUND + FIXED + GATED (v0.8.115); ACCEPTANCE = THE DIFFERENTIAL (2026-08-18) ★★★★★
**PROD v0.8.115 served==committed (I verified). Tab B STILL not shown to move — acceptance OPEN.**

### ★★★ THE REAL ROOT (found by measurement, not the 5 earlier roots): **ViewBus KEY MISMATCH**
Every surface DID subscribe — rb-detail-drawer:469 (controls) · rb-task-detail:53 (body) · rb-object-item:73 (badge) — but each subscribed on the **RAW shown ref** while live-bridge notified **`${type}:${uuid}`** ⇒ exact-string mismatch ⇒ **ALL SUBSCRIPTIONS INERT**. *Existence != connection*, found inside our own event bus. **Transport EXONERATED**: client-1 (acting tab) did not update on its OWN LOCAL notify ⇒ not delivery, not poll-vs-broadcast — purely the key.
- **PRE-FIX BASELINE (measured, prediction pre-registered + MATCHED)**: on **BOTH** /model and /trace the WS frame ARRIVED and nothing re-rendered ⇒ mismatch is **BUS-WIDE**, not surface-specific. Discriminator self-proven first (tags REPLACED on known wholesale re-render, IN-PLACE on known in-place).
- **FIX v0.8.115 (50b22399a, expert, architect shape 98ac90205)**: ONE canonical **viewBusKey(ref|{type,uuid}) -> "type:uuid"** builder; BOTH notify (×6) and EVERY subscribe (×16) route through it ⇒ the two sides CANNOT define the key differently (FROZEN_LEGACY_MAX single-source reasoning). Caught a 2nd ViewBus file raw-keying. Acting tab covered BY CONSTRUCTION (universal-actions local notify same builder). **GATE SHIPPED WITH IT**: ci:gates `check-viewbus-key-single-source` + self-BITE + **stub-must-fail** (planted raw-ref subscribe -> RED) ⇒ drift cannot silently return.

### ★ ACCEPTANCE = A CAUSAL DIFFERENTIAL (the thing we could NOT build for A)
Same subject · same real-gesture setup · **worktree-BUILT dist in BOTH arms** · one variable (the builder). **PRE @748cab757 must assert its bundle contains NO viewBusKey; POST @>=50b22399a must assert it DOES** = explicit provenance evidence.
- ★★ **PHANTOM-GUARD CATCH (tester, in its OWN foundation)**: setupFoundation SYMLINKED main's `src/public/dist` — a MOVING, GITIGNORED target — so the earlier baseline f11b71bcf may have served a POST-fix bundle. **f11b71bcf is formally SUSPECT and superseded.** Rule: a differential needs dist==source-commit, never a symlink to main.
- **B-GREEN BAR (locked BEFORE evidence, architect 91b2ec341)**: in-place discriminator (NOT replaced) on drawer-controls AND row-badge + causality-by-exclusion (no in-window poll carries the status, WS frame does) + BOTH tabs + no reload + **Tron's FULL named criteria (row+badge+DETAIL+CONTROLS)** + the pre->post DELTA as the causal proof.
- **ROW-RENDERABILITY DECIDED IN ADVANCE (2ba8afa1e)**: real-gesture `.oi-expand` root->task before approve (NO synthetic); TARGET has no select->reveal contract ⇒ normal deep+collapsed, NOT a device-QA gap. If ever unrenderable: another real live surface, else **B = PARTIAL with row INVALID-untestable reported to TRON** — never a synthetic green. **Setup change ⇒ PRE arm re-runs identically** (else two variables = confound).
- **A**: property acceptance GREEN (visibility by STATUS not membership, /model, precondition asserted in-run). Load-bearing = **by-construction guarantee over a currently-EMPTY population** (0/519 real tasks lack stored status) — provable only via a LABELLED pre-seam fixture, instrument (neuter) proven first. **a39efc32 CONFOUNDED — never cite it.**

### ★ FLEET / ROTATION (two-axis: context AND slip-rate)
Parallel drives, deconflicted after a near double-fire: **trainer -> EXPERT(81)** · **ARON -> TESTER**; then ARON rewinds the trainer (it crosses its 75 gate doing the expert — accepted trade, ARON stays sub-gate so the bench never closes). Expert freeze was ABSOLUTE (bounded loss: spec durable on disk ⇒ a wall costs in-progress code only). Disk-handoff is the standing default for raw evidence. req 77 frozen (owes the requirement-mint fresh).
### ★ MY OWN ERRORS THIS STRETCH: told the tester a confound was "resolved in the fix's favour" (WRONG — read-path-changed != derivation-works; architect archaeology overturned me) · told it to run B-ROW as a bounding experiment when it would have proven the POLL (architect caught it) · nearly let a retarget silently drop Tron's DETAIL+CONTROLS clauses (caught it myself) · sequenced a non-blocking measurement ahead of a blocking one. **Pattern: I err when composing fast, at healthy context — speed, not runway.**

## ★★★★★ #82 — LIVE-MVC ROOT #2 FIXED (v0.8.116); GRACEFUL STOP AT 70% (2026-08-18) ★★★★★
**PROD v0.8.116 served==committed (verified). ACCEPTANCE: the folded differential is RUNNING — the run that answers Tron.**

### ★ THE ARC SINCE #81 (all measured, several of my calls corrected)
1. **v0.8.115 (viewBusKey) SHIPPED AND DID NOT WORK** — the tester's provenance-locked differential returned **ZERO DELTA** (pre=INERT, post=INERT). It passed code review + architect backstop + a CI gate and still moved nothing ⇒ **the strongest vindication of construction-is-inadmissible we have.**
2. **BISECT REFUTED THREE CODE-READERS AT ONCE** (my input-asymmetry hypothesis, the architect's pre-registered (a), the expert's earlier read): **keys MATCH verbatim, callback FIRES 2x, view still inert** ⇒ branch **(b)**. ⇒ [[L-S40-12]] **code-reading convergence is CORRELATED ERROR, not independent confirmation** — independence is the METHOD, not the reader count. Saved only because the prediction was pre-registered and we ran the instrument anyway.
3. **ROOT #2 = PRECEDENCE, not a missing fetch**: `obj?.status ?? rModel?.status` — the STALE cached graph status SHADOWED the fresh /api/ior value. **FIX v0.8.116 (aaf60ef61)**: inverted to fresh-wins + rb-task-detail repaints the badge from fresh status ⇒ badge AND controls flip together.
4. **OUR CI GATE PROVED THE WRONG PROPERTY** — it asserted *uses-the-builder* (proxy) and went GREEN on a typeless-input call producing an unmatchable key. Hardening ruled (gate asserts a TYPED result + typeless-input stub-must-fail; viewBusKey FAIL-LOUD with an allow-list for graph/CurrentSprint) — **HELD to post-reset.**
5. **★ THE `/root/oosh` THIRD TREE**: the "host-wide `otmux pane.self` breakage" the whole fleet worked around for HOURS was **our own option-1 revert of 5 scripts (-3359L) of TRON'S CANONICAL OOSH CODE**. Recovered to HEAD, stash-preserved, `pane.self` verified working. ⇒ [[L-S40-13]] a tool breaking mid-session is a **SYMPTOM**, and an institutionalised workaround **hides its own cause**. `/root/oosh` now named in agent-rewind.md Step-0.
6. **★★ TRON LAW — STEP 0: FULL COMMIT BEFORE ANY REWIND PICKER** (556b6848, in agent-rewind.md): option-1 hits the WORKING TREE not history ⇒ a committed tree makes a code-reset a `git restore`. **Makes the failure HARMLESS rather than DETECTABLE** — the session's best structural move.

### ★ FLEET / STOP POSTURE (Tron: graceful stop at 70% weekly; 59% now, SM watches, I dispatch)
**PRIORITY: (1) the differential COMPLETES (Tron's answer) · (2) EVERYTHING COMMITS, all 3 trees · (3) agents IDLE · (4) drives ONLY if budget remains** — because a rewind exists so an agent can CONTINUE; **at a stop a COMMITTED+IDLE agent is safe at any %.** HELD post-reset: row/expand + seeded-A, gate hardening, typeless audit, runbook consolidation.
Bench: trainer fresh@51 (drove ARON/tester queue; recovered /root/oosh) · expert fresh@47 (shipped 0.8.115/0.8.116, drove its FIRST rewind textbook FROM THE DOC when both primaries were spent) · ARON ~77 (rotated off driving on SLIP-RATE at healthy context — the axis I was blind to) · SM ~76 · tester ~62→69 · architect clean, idle-but-armed.

### ★ MY CORRECTIONS THIS CYCLE (pattern: I err composing FAST at healthy context, not from low runway)
Declared a confound "resolved in the fix's favour" (WRONG — the architect's archaeology overturned me) · told the tester to run B-ROW when it would have proven the POLL · mis-estimated a pre-check as "cheap ~2-3%" when it was a full heavy run (tester corrected me) · **routed a "do not ship until the probe" condition through the ARCHITECT instead of to the EXPERT it constrained — so the fix shipped early; my coordination gap, owned.** · 4th time measuring a GENERATING agent. **Refinement (architect): a new FACT applies NOW; a better ARGUMENT applies to the NEXT instance.**

### ★ GRACEFUL-STOP SWEEP — FLEET ACCOUNTED FOR (2026-08-18, ~59-62% weekly)
**TRON'S ANSWER LANDED (d61c227cb, v0.8.116): CONTROLS live-MVC PROVEN — Approve/Decline VANISH on a PASSIVE never-clicked client-2 from the broadcast, 1090ms, sentinel survived + nav=0 (NO RELOAD), pre-fix baseline INERT ⇒ real causal delta; freshness prediction CONFIRMED at runtime.**
**★ TWO ITEMS HONESTLY OPEN (named, not waved through at the finish line):**
1. **POLL-PARITY UNSEALED** — I read the raw myself: the v0.8.116 section records poll-count ONLY for the C1 broadcast-OFF arm (0 polls); the POSITIVE arm's client-2 poll count is NOT recorded, and an earlier section states `/model` client-2 is NOT quiet (`pollInQuietWindow=3`). ⇒ the arms may differ by **TWO variables (broadcast AND polls)**, so "broadcast is the SOLE cause" is not closed. The A/B + no-reload + pre/post delta all stand. **SEAL ON RESUME (one bounded run):** record positive-arm client-2 poll-count = 0, OR capture poll RESPONSES and assert none carries the status (exclusion by content).
2. **BADGE UNRESOLVED** — architect explicitly REFUSED "timing artifact" ("artifact is an assumption"); two live hypotheses (settle-lag vs badge-overwrite not firing). Settle-on-badge assertion decides it. Neither greened nor failed.
**HELD POST-RESET:** row/expand-to-row · seeded-A fixture differential · (1)+(2)+(3) gate/builder hardenings (gate proved a PROXY: uses-the-builder, went green on a typeless-input producing an unmatchable key) · systemic typeless-subscribe audit · drive-runbook consolidation.
**AGENT STATE AT STOP:** architect committed+idle · tester committed+idle (~69, rewind SKIPPED — committed+idle is safe) · expert standby, committed · trainer Phase-1 COMPLETE (caught its OWN clean-but-stale anchor trap; banked slip-rate + a NEW gap: backspace-burst mistimes on EVERY drive, needs a real fix) · ARON 64 (weak shed ~12%: 16 light checkpoints, DEPTH!=FREED — may need a deeper stage-2 on resume) · SM = the ONE exception, must keep ACTING to watch/call 70% (light drive PRE-AUTHORISED at ~82) · **★ PLANNER (0.6) and REQ (0.4) appear EXITED — agent dirs CLEAN/committed so nothing is lost, but they need RE-LAUNCHING on resume** (req still owes the control-visibility requirement mint; planner owes nothing urgent).
**RESUME ORDER:** (1) seal poll-parity + settle-on-badge (closes Tron's acceptance) · (2) row + seeded-A · (3) gate/builder hardenings · (4) relaunch req → mint the owed requirement · (5) runbook consolidation.
