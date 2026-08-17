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
