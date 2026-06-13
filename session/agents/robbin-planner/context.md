# robbin-planner Context — Save Point 2026-06-14 (STRICT-TEST TOOL-FIX + TRUE FLOOR = 23/205, anchor-validated)

**Pane:** robbinTeam2:0.1. Repo HEAD moved past anchor 8a34e87 (gone); current ~7e0186d1, v0.6.9. Canonical tool says 181/205 excl 46 but that is **INFLATED** — proven.
## THE RULE-6 WIN (PO+SM confirmed, 2026-06-14): canonical scorer over-credits BY CONSTRUCTION
- skill-classes.ts:86-90 hasRealImpl() only STRING-matches [impl:uuid:X] anywhere in src — NO enclosing-named-member check. Predates SM strict ruling. Source-verified.
- SM locked strict-test: PASS = marker HEADS a named member decl (function/method/field-arrow/const-fn) OR is IN-BODY of a named member whose name MATCHES the label-method. FAIL = (split for)cluster / heads-const(data) / anon-closure / in-body name-mismatch / no-named-member(file-header block) / css / fake-suffix(-a1b2-4c3d-8e4f) / non-unique.
- **ENCODED + COMMITTED: scripts/strict-marker-audit.ts (TS-AST). Re-run: npx tsx scripts/strict-marker-audit.ts. det output → /tmp/strict_ast_results.json. Needs /tmp/credited.json (complete-chain impl 8-prefixes; regen from objectVerb.ts Chain followUp --all rows).**
- **8-ANCHOR VALIDATION 5/5 named GREEN:** R19.14 PASS(heads createFileUnit), R19.36 PASS, R19.50 FAIL(split-for), R19.72 FAIL(mislabeled: anon click-handler in open()≠removeLocalIdentity), R19.84 FAIL(fake-suffix). 6c cc1dcd0e/6d 4256aef7/6f onDragStart NOT in credited-181 set (coverage caveat → SM confirm genuine-OPEN).
- **★★ RECONCILED CHAMPAGNE FLOOR = 21/205 excl 46 (FULL-CHAIN, live objectVerb.ts det-3x post-AST-fold, 2026-06-14). FINAL.** The earlier 23 was IMPL-MARKER-ONLY (standalone strict-marker-audit.ts) on a STALE pre-fold /tmp/credited.json. Two tools measure different things: live=full-chain champagne=21; standalone=strict-passing impl-markers=23. 21-vs-23 RECONCILED at source (commit 9b521427, doc planner-21-vs-23-reconcile-2026-06-14.md): the 2 diff chains R19.2/R19.8 have their IMPL node OPEN in the live chain — wired Method→impl 2ab8a3dd(Room.init)/4c21d2ee(retainOrPrune) NAME-MISMATCHES the chain method (editOpen/memberAdd) → live AST strict-fails. [RETRACTED 2026-06-14 cc0f1c7: the "+2 via re-wire" was WRONG. Verify-first found f9b579c1(editOpen)→method 6fc898ab and 4246c0a8(memberAdd)→method ea02fa6d are ALREADY correctly wired+tested = complete legs. 2ab8a3dd is R19.1's Room.init (marker in constructor, strict-fail), NOT R19.2's. R19.2/R19.8 are MULTI-METHOD reqs: their editOpen/memberAdd legs are done but each has ANOTHER open method-leg → live full-chain not-champagne. Standalone-23 over-counted = scores one impl-marker per row, saw the passing leg, missed the 2nd. NO planner re-wire climbs these — needs expert impl on the open leg / architect Class.method chain-scope (T187/T202-class question). Floor=21 FINAL+correct. Did NOT edit sealed data.] skill-expert folded AST into live skill-classes.ts (canonical now 21, -156 string-only de-credits +4 new R19.86/90/93+1). 158 of 181 string-credited FAIL strict. Buckets: no-named-member 93 (70 top-of-file R19.63 header-blocks like FileApi.ts:1-5/rb-detail-view.ts:1-2 + 23 deeper) · split-for 35 · mislabeled 20 · heads-const 7 · css 1 · fake 2.
- Doc: scrum.pmo/sprints/sprint-20-traceability-first/planner-strict-true-floor-2026-06-14.md (full FAIL inventory + skill-classes.ts:86-90 fix spec). Earlier candidate (regex, over-flagged 134): planner-strict-overcredit-audit-2026-06-13.md (59b3f9a).
- **scripts/strict-marker-audit.ts is now the TRUSTWORTHY CANONICAL instrument (replaces string-match hasRealImpl).** NEXT: skill-expert folds the AST strict-test into skill-classes.ts hasRealImpl (their lane); planner+SM re-validate vs the 8 anchors. Then climb HONEST from 23 via genuine named-method refactors (real named method + marker-IN-body/heads-it + name-match + per-impl test + det). 158 over-credits are the fix-backlog: split-for clusters → split to real per-method markers; file-header blocks → move marker into the method body; mislabeled → relocate to the matching member.

---
# robbin-planner Context — Save Point 2026-06-13 (v0.6.0 milestone + Sprint 20 started; marathon CMM4 patterns captured)

**Pane:** robbinTeam2:0.1. **HONEST BOARD = 180/205 excl 46 (det-3x stable, 2026-06-14 climb). 180 champagne + 8 functionalDone (R16.5/R19.83/85/87/88/92/100/R20.3) / 205 excl 46. Honest arc: SM-sealed 178 → R19.93 named-method refactor +1=179 → R20.5 genuine +1=180. functionalDone = declarative/handler/inline (live, in-denom, not champagne). EXCLUDED: R19.88.A (superseded by R19.90), R19.97 (DocumentFragment). Climb via VALIDATED path: real named-method + marker-IN-body + per-impl test + det-3x each. Watch 3 hops: tester TEST batch, expert named-method (R20.1 impl etc), architect class+Test pipeline. R19.86 already-counted (caught PO double-count). PRE-CREDIT named-method scrutiny mandatory (closure/inline/template/handler/CSS = functionalDone NOT champagne).**. 179 champagne + 4 functionalDone (R19.85/87/88/92 declarative, IN denom, tagged not excluded). R19.93 CLOSED genuine (named-method createFilePreviewButton@rb-detail-view.ts:122, unique impl 1a5ad916, full chain). FIRST honest-up via inline→named-method refactor — validates climb-path. S19 champagne-debt RESOLVED; the 4 functionalDone = honest open-not-champagne tail..
## SM NAMED-METHOD RULING (STANDARD, 2026-06-13) — strict canonical chain
A champagne Impl REQUIRES a real NAMED METHOD. Inline/closure/CSS-attr/template-string behaviors carrying [impl:uuid] do NOT complete a chain (no Method node → fictitious Method→Impl hop = THE inflation pattern). REJECT: event-handler closures, CSS-attr impls, template-literal markers, file-header comment markers. Climb-up = refactor the behavior to a real named method + marker IN its body + per-impl test. This session's saga: claims pushed 177→182 via stub/closure/template markers; max-scrutiny (det-3x + marker-placement-grep + shared-impl/shared-test guards) caught every fake; expert's honest FINAL removed 8 → strict floor 178. R19.31/83/85/87/92/93 now OPEN (inline/closure/CSS/template, no named method).
## MARKER-PLACEMENT VERIFY (per-marker, on settled commit): grep each [impl:uuid:] → must sit INSIDE a named method body matching the behavior. Reject header(line<10)/template(above innerHTML=`)/handler-closure/CSS-attr.
## SHARED-TEST GUARD (formal, PO 2026-06-13): scan tests wired to >1 impl; cross-class=over-credit (un-share, credit the genuine one, other needs own test); same-class/known-sibling (802363cb/8edfcdd6/8682fa95/1b5c8ddc)=KEEP. Caught faf7bd6e.
 — climbed 158→181 via genuine S19 chain backfill, every step ground-truthed (0 over-credit). Arc: 158(superseded-excl)→168→walker-bridge-fix +5→173→R19.31/72 +2→175→R19.94+R19.84x2 +3→178→expert markers +4→182→un-share faf7bd6e cross-class over-credit −1→181.
## OVERNIGHT CHAIN-RECOVERY (Tron-assigned, in flight)
- 11 shared-impl regressions: SPLIT recovery (d43fce61) — expert split each to own impl+marker; ground-truthed genuine. shared-impl guard=0.
- SHARED-TEST GUARD now formal (PO 2026-06-13): scan tests wired to >1 impl; cross-class = over-credit, same-class/known-sibling (802363cb/8edfcdd6/8682fa95/1b5c8ddc) = KEEP. Caught faf7bd6e (SpeakingTree+FileBrowser) — un-shared, −1.
- R19.97 orphanByDesign (superseded-by-construction, DocumentFragment fix). R19.100 = stale-cache delivery (v0.6.9), not chain.
- **PENDING: marker-placement verify on a SETTLED commit.** Expert moving impl markers commit-by-commit (stub-blocks/headers/wrong-method caught by PO). Don't credit mid-flux (learning #47). When expert's marker-fix batch is final: verify EACH [impl:uuid:] sits INSIDE its named method's body (not file-header/handler/superseded-comment) + det-3x. Genuine so far: d64f6288@RoomView:227 awaitItemUpgrade, 852101d1@:232 openFilePreview.
## S20 (separate, traceability-first pipeline): tasks R20.2-6 + CR1/BUG1/BUG2 standing up + chain-first; each release = 1 patch+git tag (R20.2→v0.6.1...). Single-owner standard (I sole task creator). Recovery task d43fce61 + backfill-tracking 450cb98a.

---
(prior) **HONEST BOARD = 158/207 excl 44 CERTIFIED det-3x (2026-06-13T18-01)** — T-TOOL-1/2 superseded-auto-exclude (R18.24+R19.58 supersededBy 7734f4e1). Arc: sealed 168/168 @f3ce4e56 → 160/201 (11 shared-impl regressions, recovery d43fce61) → 158/207 (superseded-exclusion correction, NOT regression). 11 regressions PERSIST; fixing→~169/207. Prior: 173/198 genuine chain-complete (41 excluded orphanByDesign), det-3x stable. v0.6.0 = FUNCTIONAL milestone (Tron "best version ever") but 24 chain-debt reqs (R19.83-102) behind it.
- **S20 RELEASE RULE (Tron 2026-06-13):** each released S20 task = ONE patch bump + git tag (R20.2→v0.6.1, next→v0.6.2...). ENFORCE in sync: not 'released' without BOTH patch bump (+sw.js) AND git tag present. Composes with rule-pair #15/#16.
- **Single-owner standard ADOPTED (2026-06-13):** I am SOLE Task-unit creator; architect only adds useCases[]/chain. Ended the dup-collision churn. (scrum.pmo/standards/task-unit-single-owner-standard.md)
- **Anti-false-green standard:** in-room UX → real Playwright+screenshot Test (not unit); R19.97 EXCEPTION = Tron real-Chrome+?debug=1 (paint not Playwright-able). (scrum.pmo/standards/in-room-ux-e2e-test-standard.md)
- **Over-credit reconcile (R19.83-102):** all 24 OPEN at UC hop, NOT in the 173. "149=173−24" double-subtracts. Doc: scrum.pmo/sprints/sprint-19-room-handling/planner-r19.83-102-overcredit-reconcile-2026-06-13.md. Categories: (a)173 genuine (b)21 chain-debt (c)3 open-bugs R19.99/100/102.
- **Architect 7f1e8b2e "7 chains canonicalized" = +0 to count** (added UCs, nothing past UC) — caught via det-3x + ground-truth.
- **SPRINT 20 STARTED (Tron radical-forward-planning):** Sprint unit 64af2638. Traceability-FIRST discipline (chain designed + Test-first, nothing ships chain-open). Carry-forward R19.99(eff42eff)/R19.100(51d53769)/R19.102(new task 42819b8b). Backfill-tracking task 450cb98a for tonight's **22:07 scheduled** radical S19 v0.5.x champagne backfill — MY DUTY post-job: re-score det-3x + ground-truth each flip + report honest count (baseline 173/198). README+overview indexed.
- **achievements.md** committed + indexed (v0.6.0 🏆).
- **Marathon CMM4 patterns** folded into boot.md (#7-10) + learnings #63: gate-faithfulness (gate must SEE the bug, match to physics), traceability-first/gate-before-deploy, measurement-integrity (det-3x, chain-debt≠champagne, honest count), source-verify-don't-relay, Tron-is-not-the-tester.

## 2026-06-14 CLIMB 21→27 VERIFIED GENUINE (d04556a6, det-3x)
- Expert 3558cb097 extracted Room.init()(Room.ts:116)/Room.retainOrPrune()(Room.ts:204) into real named methods, markers in-body name-matched (drove by my mis-placed-marker finding). SHARED methods → +6 NOT +2: R19.1+R19.2 (init/2ab8a3dd), R19.8+R19.8.A+R19.8.B+R19.18 (retainOnDisconnect→retainOrPrune/4c21d2ee — LEGIT refinement-cluster, SM-pre-confirmed test c6dfbaa6, shared-impl clean 4c21d2ee→1 method). Each per-req-traced via scripts/trace-req.ts (scorer's own walkReq) — ALL UC.method legs complete. Tester room.test.ts 30/30.
- PLANNER UNWIRE HYGIENE: removed stale 9fbb1f6e(file-header)+4c8a91a5(mis-wired, heads addMember, doesn't own R19.8.B's retainOrPrune UC.method→left unwired) from method init(4fed4fda).implementations[] → singular-genuine [2ab8a3dd]. Count-NEUTRAL (det-3x 27 before+after) = pure hygiene.
- ⚠ LESSON: nearly panic-reverted a 21→27 jump thinking MY wiring edit caused it — was actually the EXPERT's concurrent commit (3558cb097). Always check `git log` for concurrent commits before attributing a count change to your own edit. The revert instinct was right (suspicious jump→stop) but the cause-attribution was wrong.
- ⚠ CORRECTED 27→26 (PO req-text scrutiny, commit dfb4b66f): the retainOrPrune 4-req cluster is NOT uniform. R19.8.A('leave→offline,not prune')+R19.18('no contact lost')=GENUINE retain-on-disconnect refinements (legit shared retainOrPrune/4c21d2ee/c6dfbaa6); R19.8 parent genuine via own memberAdd+retainOrPrune legs. BUT **R19.8.B('REJOIN→online, never adds duplicate')=DISTINCT rejoin-DEDUP behavior (addMember), mis-wired to retainOrPrune → OVER-CREDIT.** R19.8.B's genuine impl=4c8a91a5 (heads addMember, strict-valid+test 9d6a901d) — the one I unwired from init. Its UC is mis-modeled (retainOnDisconnect for a rejoin behavior).
- **SCORER shows 27 but HONEST = 26** (5 genuine flips: R19.1/R19.2/R19.8/R19.8.A/R19.18). R19.8.B is a tool-over-credit (mis-wired chain). RECOVERABLE to 27 when re-modeled: architect adds rejoin-dedup UC→addMember, planner wires R19.8.B→4c8a91a5+9d6a901d. STANDARD is requirement-rooted (each req→own chain); recommend it add explicit refinement-cluster rule (same-behavior MAY share impl; distinct MUST NOT).
- LESSON: I'd waved the cluster through as 'SM-pre-confirmed c6dfbaa6' — but pre-confirmation covered 8.A/18, NOT 8.B (different behavior). PO's 'justify with REQ TEXT' caught it. Always re-derive shared-X legitimacy from REQ TEXT, not a prior cluster blessing. Every shared-impl/test is over-credit until the req texts prove same-behavior.
- HONEST FLOOR NOW = 26/205 excl 46 (scorer 27, R19.8.B pending re-model). Doc: planner-climb-21-to-27-2026-06-14.md.

## 2026-06-14 STRICT-FOLD AFTERMATH + R19.2/R19.8 DETERMINISTIC RESOLUTION
- AST strict-test FOLDED into live skill-classes.ts hasRealImpl (a0d0ea16f, skill-expert). Canonical = 21/205 excl 46, det-3x, SM+PO CO-SEALED → Tron. 158 string-only de-credits.
- My standalone scripts/strict-marker-audit.ts (impl-markers, TS-AST) = 23 on STALE credited.json; reconciled: live=full-chain=21, standalone=impl-markers=23 (different measures). 21 FINAL.
- **NEW TIEBREAKER TOOL: scripts/trace-req.ts** — calls Chain.walkReq/summarize reflectively ((c as any).walkReq) = scorer's OWN un-summarized per-req trace. Use for any "is req X complete and why" dispute. Re-run: npx tsx scripts/trace-req.ts (edit the tags array).
- R19.2/R19.8 3-way contradiction RESOLVED deterministically (aaeb25bf): BOTH genuinely incomplete, 21 NOT under-reported. R19.2: method init(4fed4fda) has 3 impl-rows, 2 strict-fail (2ab8a3dd marker-in-constructor, 9fbb1f6e file-header) drag it via summarize-needs-ALL-rows; editOpen complete. R19.8: retainOrPrune(f82d09a5) sole impl 4c21d2ee marker mis-placed in removeMember. Architect 'all legs done' was WRONG (saw 'a' impl, missed multi-impl drag + strict-fail).
- **KEY SCORER FACT:** summarize() (skill-classes.ts:327) requires ALL of a method's wired impl-ROWS complete; a multi-impl method with any markerless/strict-failing impl drags the whole req. Non-canonical per singular-chain #38 (method should have 1 impl). walkReq:256-264 narrows to UC.method when set (no fan-out if .method present).
- SCOPE-GUARD HELD TWICE: rejected (1) my own '+2 re-wire' (siblings already wired) and (2) architect's 'narrow-to-UC.method' (+2) — both UCs have .method set, 2nd legs genuine open work. PO rule: number follows rule, never rule follows number; a scope-narrow flip is valid ONLY if the dropped leg is a genuine over-walk, not genuine open work.
- CLIMB from 21 (genuine, det-3x each): R19.8 +1 = expert relocate 4c21d2ee into retainOrPrune body. R19.2 +1 = architect designates init's true singular impl (#38) → planner unwires stale 2ab8a3dd/9fbb1f6e → expert strict-marker in init body. Awaiting architect.
- Docs: planner-{21-vs-23-reconcile, r19.2-r19.8-scope-verdict, scorer-trace-r19.2-r19.8, strict-true-floor}-2026-06-{13,14}.md. Learning #64 (fix-the-instrument).

## NEXT
1. Await architect's ruling on init's canonical impl (#38) + the retainOrPrune marker relocate (expert); det-3x each climb flip; guard scope-narrows.
2. (prior) **22:07 backfill watch** (task 450cb98a): after the job, det-3x + ground-truth each newly-claimed chain, reject over-credit, report honest flip count both sides.
2. S20 forward reqs with req-eng; each → full chain designed + Test-first.
3. Carry R19.99/100/102 to genuine champagne (E2E-gated).

---
# robbin-planner Context — Save Point 2026-06-11k (SM SURVIVAL STANDBY @83% 7d-budget — IDLE until ~Jun14/Tron)

**Pane:** robbinTeam2:0.1. STANDBY HARD (SM survival, 7d budget 83%≥80%). ZERO new reqs (R19.91+ WAIT). Sealed lossless.
- **R19.86-90 fix-task batch stood up this session** (PO drip-fed; expert+tester resuming). ALL settled canonical — note the heavy DUP-COLLISION pattern: architect/concurrent-me beat me to 4 of 6, reconciled per #20 every time (adopt architect's = sharper+has-UC, drop my untracked/committed dup):
  - R19.86 → canonical **bec78a23** (UC 6bd2b297); my 356bf502 deleted.
  - R19.87 → MINE **8cc07506** (UC cd88d924 added by architect after); committed both-ways.
  - R19.88 → architect **67abd046** (UC bdd5cd03 whenDefined); my 1155d59b deleted.
  - R19.88.A → architect **c524c8a0** (UC c5419a86, renderRoomTree diff); my 507c9b21 git-rm'd; refinementOf R19.88.
  - R19.89 → MINE **9628370d** (move red Remove-ID btn ProfileEditor→DeviceEnrollDialog); committed both-ways.
  - R19.90 → architect **b8da64a1** (UC 2591b56a; reuse rb-trace-tree, DRY/OOP) — SUPERSEDES R19.83(task 322d0fcd)/R19.88(67abd046)/R19.88.A(c524c8a0), fulfills R19.21(req d1391ee3). Supersession documented in R19.90 REQ description (20fc59cc). My dup db55bbc6 deleted. (Reverse supersededBy annotations on the 3 tasks NOT applied — survival cutoff; req-level note suffices.)
- **FLAGGED to PO:** recurring dup-collision wastes churn — suggest PO route each "stand up Rxx" to exactly ONE of {planner, architect}.
- **ON RESUME:** apply reverse supersededBy annotations to 322d0fcd/67abd046/c524c8a0 if PO still wants them; re-score Chain (was 174/180 pre-batch; denom climbs w/ R19.86-90). Scoreboard cmd: `npx tsx scripts/objectVerb.ts Chain followUp --all`.

---
# robbin-planner Context — Save Point 2026-06-11j (🏁 ACTIVE 168/168 = 100% FULL-CHAIN CERTIFIED GENUINE @f3ce4e56 — SM re-seal→Tron)

**Pane:** robbinTeam2:0.1.

## TOOLING MIGRATED to Object.verb (Tron directive, planner-first, 2026-06-11) — skill: scrum.pmo/skills/migrate-to-object-verb.md
- Legacy scripts are byte-identical shims over the Chain class (commit 0b24dcdb) — old forms still work (rollback = keep typing them), but migrate my invocation habit.
- **Completion loop (det-3x):** `npx tsx scripts/objectVerb.ts Chain followUp --all` → JSON `{complete,total,excluded}` (replaces `po-chain-follow-up.ts --all | grep '^## Summary'`). Equivalence VERIFIED 2026-06-11: old 168/169-excl41 == new complete=168 total=169 excluded=41, det-3x identical.
- **Flip tracking:** `npx tsx scripts/objectVerb.ts Chain snapshotComplete` → dated TSV in scrum.pmo/chain-snapshots/ + named +/- flips vs prior (no hand-diffing).
- **Lane dispatch:** `npx tsx scripts/objectVerb.ts Chain scoreboard` → open-nodes table with owner column (tester/expert/architect), paste-ready for handoffs.
- OOSH Tab-complete form: `taskChain chain.followUp --all` etc. Help: `objectVerb.ts` (objects) / `objectVerb.ts Chain` (verbs).
- **My guards UNCHANGED** (read scenario.json directly): /tmp/guards.py (json-broken+shared-impl), name-based guard-3 (KEEP only 802363cb RbUseCaseDetail + 8edfcdd6 RbDetailDrawer), worktree-cert recipe (learning #54). Only the COUNT invocation migrated.
- TODO: teach tester+expert the same ritual at NEXT handoff-file refresh (their instructions still carry legacy form — replace forward, not retroactively).

## SCOREBOARD = **ACTIVE 174/175 @15ea2161** (det-3x Object.verb form + 4 guards green, over-credit=0; R19.76 deferred excluded 41). 100% genuine cert held at every milestone (165/165 @0bccc3d5, 167/167 @331c2719, 168/168 @f3ce4e56). SOLE open = R19.83 (chain being built).
- Post-168 denom climb (req keeps adding R19.x fix reqs): 168→169(R19.77)→173(R19.78-81)→174(R19.82)→175(R19.83). Every premature 'closure' commit-msg CAUGHT + held via det-3x Summary + ground-truth (NOT display rows): R19.78-81 'verify' (chains not closed), R19.80 .css-scan-gap, R19.77/82 empty-Impl.tests[], structural impl-edge (marker on method uuid + empty implementations[]).
- **R19.80 .css scan gap (NEW, skill-expert fixed):** [impl:uuid:] marker was real in src/public/app.css (CSS-only impl like resize95vh) but tool walkFiles (skill-classes.ts:66) scanned only .ts/.js/.mjs → unscanned → false-open. Skill-expert added .css to walkFiles → flipped. Same class as the earlier scripts/ gap (572ad650 implRoots + b5d1096e testRoots).
- **PLANNER STAND-UPS this session (real v4, ownerIor=S19, useCases:[] for architect, pre-flight per #26):** R19.82 T-room-join-stale-takeover task 3ca88df7 (covers 14a5a9ca; CLOSED+ground-truthed 84910216.tests[]=[3c153212]); R19.83 T-room-file-item-rerender task 322d0fcd (covers 8ba2d9ef; open, chain building). S19.tasks[]=61.
- **NOTE: concurrent commits sweep my files** — when standing up, my scenario writes sometimes get committed by a concurrent agent commit (architect/expert) before my own git commit (my commit then says 'no changes'). Verify via `git ls-files` + the wire (R19.x.tasks[]) is intact; the work landed regardless.

## (prior) SCOREBOARD = **🏁 ACTIVE 168/168 CERTIFIED GENUINE @f3ce4e56** (det-3x 3x Summary + ALL 4 guards green: json-broken=0, shared-impl=0, over-credit=0, 0 open non-dedup; R19.75 ground-truthed; excluded 41 orphanByDesign). Flagged SM re-seal→Tron.
- Post-167: req added R19.75 (ContentPreviewer.authToken) + R19.76 (nonce security-debt). PO ruling: **R19.76 DEFERRED** (set model.orphanByDesign=true + deferred note, my commit d58eb6fd → active denom 168). R19.75 closed via expert Impl 4c897dae + tester wired tests[]=[733dc384] (real marker server.test.ts).
- **orphanByDesign mechanism (skill-classes.ts:99-103):** model.orphanByDesign===true OR model.tags includes 'orphanByDesign' → excluded from canonical denominator (resolveReqSet line 122). Use this to defer per PO.
- **DEDUP-BUG DISCIPLINE (re-confirmed):** the display ROW can show 'all check' while the req is incomplete (listComplete dedupes shared-test leaves). ALWAYS trust the det-3x SUMMARY count + ground-truth (Impl.tests[] non-empty + real [test:uuid:] marker), NEVER the row. Caught R19.75 false-'all-check' this way.
- **Climb to 168 caught (held every premature close):** false '167 closure' (empty Impl.tests[]), false '168' display-row (dedup, Impl 4c897dae.tests[] empty). Plus earlier: 162(oc=3→159), 164(oc=1→161), 165 dedup-false, structural impl-edge (markers on method uuid, empty implementations[]).
- **Cert recipe (learning #54 worktree-cert + max-scrutiny):** git worktree add -q --detach /tmp/wt-cert <H> → det-3x Summary 3x + /tmp/guards.py + name-based guard-3 (KEEP only 802363cb RbUseCaseDetail + 8edfcdd6 RbDetailDrawer) + 0-open non-dedup grep + GROUND-TRUTH the specific new Impls (tests[] non-empty + real marker) → remove.
- NEXT: SM re-seal of active 168. R19.76 in backlog (re-include when scheduled). Denom grows as req adds; keep certifying each settled batch with the same max-scrutiny recipe.

---
# robbin-planner Context — Save Point 2026-06-11i (🏁 167/167 = 100% FULL-CHAIN CERTIFIED GENUINE @331c2719 — SM re-seal→Tron)

**Pane:** robbinTeam2:0.1. SCOREBOARD = **🏁 167/167 = 100% FULL CHAIN, CERTIFIED GENUINE @331c2719** (det-3x 3x + ALL 4 guards green: json-broken=0, shared-impl=0, over-credit=0, 0 open; R19.73/74 ground-truthed). Flagged PO→SM re-seal→Tron.
- Post-165: req added R19.73 (in-room file preview) + R19.74 (HTML sandboxed iframe) → denom 165→167. Climb to 167 caught THREE false-closures (max-scrutiny discipline held every time):
  - false "165 closure" via listComplete DEDUP display bug (hid open rows) — my det-3x Summary + non-dedup open-row grep don't rely on dedup display.
  - "164/164" earlier = over-credit=1 (d5478d32) → honest 161.
  - false "167 closure" (197d73f8 v0.5.196) = Impls 6471cfbd/cf44c51c had EMPTY tests[]; before that, R19.73/74 Methods 1608977f/aee04064 had empty implementations[] + [impl:uuid:] markers used the METHOD uuid (learning #46) — structural impl-edge gap I diagnosed.
  - GENUINE 167 @331c2719: tester rewired tests to the new Impls (6471cfbd.tests[]=[7f62966c], cf44c51c.tests[]=[178f14b2]); markers real in components.test.ts.
- **SM's 30 empty-tests[] reconcile (165 seal):** GENUINE, 0 over-credit. 16 off-chain orphans + 14 on-chain SECONDARY methods; 0 reqs complete SOLELY via empty-test path. Tool gates empty-tests row complete=FALSE. Quality follow-up logged: 14-method own-test-per-method champagne depth (PO-accepted, not blocking). Doc: scrum.pmo/planner-165-empty-tests-reconcile-2026-06-11.md.
- **Cert method (learning #54 worktree-cert):** `git worktree add -q --detach /tmp/wt-cert <H>` → det-3x + /tmp/guards.py + name-based guard-3 (KEEP only 802363cb RbUseCaseDetail + 8edfcdd6 RbDetailDrawer dup-name) + 0-open grep + ground-truth specific new Impls → remove. Immune to fast-dirty live tree (#53).
- NEXT: SM re-seal of 167. Denom grows as req adds units; keep certifying each settled batch. The 100% drive is COMPLETE at the current req set (167).

---
# robbin-planner Context — Save Point 2026-06-11h (🏁 165/165 = 100% FULL-CHAIN CERTIFIED HONEST @0bccc3d5 — flagged SM→Tron)

**Pane:** robbinTeam2:0.1. SCOREBOARD = **🏁 165/165 = 100% FULL CHAIN, CERTIFIED HONEST @0bccc3d5** (det-3x 3x identical + ALL 4 guards GREEN: json-broken=0, shared-impl=0, shared-test-over-credit=0 name-based, 0 open). Flagged PO→SM independent re-verify→Tron.
- **THE saga (inflation caught 3x before Tron, all held + resolved):**
  - 162/162 claim → guard-3=3 cross-class over-credits (71e9d3b6/061360a0→TraceConsistency.auditOrphans; 9b5111b2→ProfileGate.vcardUpload+ChainLink.iconInView). Worktree-proven honest 159. HELD.
  - "164/164" claim → really 162/164, guard-3=1 (d5478d32 ProfileGate+ChainLink). Worktree-proven honest 161. HELD.
  - Each time: tester's "rewire to current Impls" wired ONE test across ≥2 unrelated classes → false-completes. Fix = un-wire to home class + dedicated test per borrowing method. RECURRING tester pattern (flagged: one-test-per-method, never span 2 classes).
  - Final clean climb: 159/164 → 162/165 → 164/165 → **165/165 (R19.72 test b8fcc88f closed last chain)**.
- **Scorer scan-coverage bugs found+fixed (skill-expert):** impl-marker scan missed scripts/ (572ad650 added implRoots); test-marker scan missed scripts/ (b5d1096e testRoots twin). Markers in scripts/*.ts (tooling = real code) were real but unscanned. 9 chains uncredited until fixed.
- **TECHNIQUE that made fast-board cert possible (learning #54 worktree-cert):** team commits perpetually-dirty live tree; cert the EXACT committed state via `git worktree add -q --detach /tmp/wt-cert <H>` → det-3x + /tmp/guards.py there → remove. Immune to concurrent writes; proper #53.
- **Guard scripts:** /tmp/guards.py (json-broken+shared-impl+shared-test-span), inline name-based guard-3 (KEEP only 802363cb RbUseCaseDetail + 8edfcdd6 RbDetailDrawer dup-name artifacts), /tmp/resolve.py (8-prefix→full uuid). Handoffs: scrum.pmo/planner-tester-uuid-handoff + planner-162-overcredit-finding + planner-160-certification-criteria (2026-06-11).
- NEXT: SM independent re-verify of 165. If req adds more units, denom grows → keep certifying each settled batch det-3x + 4 guards. The chain-completion drive is COMPLETE at 100%.

---
# robbin-planner Context — Save Point 2026-06-11g (146/162 ≈90% HONEST CERTIFIED @106f3262 — SM re-verify)

**Pane:** robbinTeam2:0.1. SCOREBOARD = **146/162 ≈90% CERTIFIED @106f3262** (det-3x + 4 guards green).
- Arc since 128: 128@6ccea842 → [tester fc592d4e cleanup deleted 80 units incl. 18 with LIVE source markers = over-delete] → skill-expert e7dca03f RESTORED those 18 (RECONCILE #89b VERDICT: CORRECT restore — 18/18 were fc592d4e deletions/0 new, 18/18 live `[test/impl:uuid]` markers in .ts → wrongly-deleted, not re-inflation) → tester c8095fa2 +15 → 106f3262 → **CERTIFIED 146/162**. Denom 160→162 (req R19.67/68/69).
- 4 guards @106f3262: json-broken=0 · shared-impl=0 (restore NO re-dup) · shared-test-over-credit=0 (only 802363cb RbUseCaseDetail + 8edfcdd6 RbDetailDrawer same-class siblings, restore added 0 new) · complete-chains.
- **NEW TECHNIQUE (learning #54): worktree-cert.** Team commits so fast the live working tree is perpetually dirty (15-124 uncommitted on top of every settled commit) → #53 hold would never fire. Solution: `git worktree add -q --detach /tmp/wt-cert <commit>` → run det-3x + /tmp/guards.py in the CLEAN worktree (exact committed state, immune to live concurrent edits) → `git worktree remove /tmp/wt-cert --force`. This is the proper #53 application: measure at a settled COMMIT, not the dirty live tree.
- 16 open to 162. Handoffs: scrum.pmo/planner-tester-uuid-handoff-2026-06-11.md + planner-160-certification-criteria-2026-06-11.md (cert criteria + owner audit, 0 stuck). Guard scripts: /tmp/guards.py, /tmp/g3verify.py, /tmp/resolve.py.

---
# robbin-planner Context — Save Point 2026-06-11f (128/160 ≈80% HONEST CERTIFIED @6ccea842 — SM independent re-verify)

**Pane:** robbinTeam2:0.1. Roster: 0.0 po·0.1 me·0.2 expert·0.3 skill-expert·0.4 architect·0.5 req·0.6 tester. SM TRONinterface:0.1.

## SCOREBOARD = 128/160 ≈80% CERTIFIED HONEST @6ccea842 (det-3x stable, 4 guards green)
- Arc since rewind: anchored 113@d9125414 → mid-batch HELD (refused architect's transient 128 + 131) per #53 → re-scored on each SETTLED batch: 111@feb9813b (−2 split-18-shared-tests housekeeping) → 107@add87115 (orphan-marker cleanup) → **128@6ccea842 (tester 53-marker batch settled, +21)**.
- 4 guards @6ccea842: json-broken=0 · shared-impl=0 · shared-test-over-credit=0 · complete-chains. Det-3x identical.
- Guard-3 nuance: 2 cross-class-span tests (802363cb/8edfcdd6) = same-LOGICAL-class siblings (RbUseCaseDetail/RbDetailDrawer); span artifact from DUP same-named Class units → KEEP (SM-confirmed legit). **Housekeeping dedup candidate:** RbUseCaseDetail cd70a713/84a94745, RbDetailDrawer 0dd08b2f/7af8178b.
- Guard scripts THIS session: /tmp/guards.py (json+shared-impl+shared-test-span), /tmp/g3verify.py (authorship resolve).
- NEXT: watch full-chain 160 (~32 open). Re-score det-3x+4guards per settled batch. SM independent re-verify of 128 in flight.

## SCOREBOARD = 113/160 ≈71% (det 3x @ d9125414) — HONEST, 4 guards green, CLEARS 80=50% milestone
- **The +63 jump (50→113) is REAL** (64 dedicated 1:1 tests, 5a5d4b9e). over-credit-on-COMPLETE excess = 0 (1b5c8ddc R12.1 2-methods/1-req/0-excess; 1e763397 legit R19.36/37 pair). SM re-verifying before Tron.
- **SELF-CORRECTION (important):** I briefly read 131 — that was a TRANSIENT over-read during the tester's ACTIVE concurrent writes (the 5 shared over-credit markers were still crediting ~18 chains mid-revert). Settled honest after the tester reverted the 5 (d9125414) = 113. PO's HOLD was right. LESSON: do NOT credit a number measured mid-batch; wait for the settled commit + det 3x. The 4th guard implicitly = "measure at a settled HEAD, not during concurrent writes" (learning #47 extended — a big jump during active writes is suspect until the batch commits).
- Denom moved 159→160 (req +1).

## THE 4 PER-CYCLE GUARDS (run ALL before crediting any jump):
1. json-broken = 0 (json.load sweep; markers in .ts SOURCE only, never scenario.json — learning #52)
2. shared-impl = 0 (every impl → 1 method)
3. shared-test-over-credit = 0 — **DISTINCT-METHOD guard WITH AUTHORSHIP EXCEPTION:** a test wired to >1 DISTINCT method = candidate; SPLIT only if N-distinct-methods AND not-authored-together. KEEP authored pairs/one-behavior refinement-clusters (1e763397 R19.36/37, dd85c4d7 R19.38/40, da3d0186 R19.7/8/9=memberAdd, c6dfbaa6 R19.18/8.A/8.B=retainOrPrune, 8682fa95 R19.42/43/44=exitDragZone — all 1-method). SM principle, SM-confirmed.
4. measure on COMPLETE chains (over-credit only counts if it's actually crediting a complete chain).

## SHARED-TEST DE-INFLATION HISTORY (test-layer, mirrors impl 25→8):
- Cross-class catch-all un-wire (59b3bd22, SM-signed): b543e1ad(9-class)/9e1cb105/dd85c4d7/f2122854 → un-wire 16 cross-class Impl.tests[]. 42→35/36.
- Req-level over-credit caught at 50 (tester MARKERED instead of SPLIT): finding scrum.pmo/planner-50-inflation-finding-2026-06-11.md. SPLIT 5 (2c502c22/9aec7689/9b9c8ae6/bbd2439f/e11c89d0=distinct methods), KEEP 7. Honest ≈38 then.
- Then 64 dedicated tests + impl-splits → honest 131. The 5 over-credit still OPEN (housekeeping: dedicated tests + remove old shared markers).
- Classification file: scrum.pmo/planner-sharedtest-classification-2026-06-11.md. Scripts: /tmp/unwire-tests.py, /tmp/sharedtest-classify.py.

## HONEST ARC (every transition both-sides-verified): 9→14→25→22→8→11→19→23→38→39→43→42→41→35→36→50(held,inflated)→131
- THREE inflations caught before Tron: impl-side 25→8, test-cross-class 43→35, test-req-level 50→~38 (then legit 131). The 38=25% milestone was CORRECTED DOWN (was shared-test-inflated).

## REMAINING to 100%: the 5 over-credit reqs need dedicated tests (R15.5/R16.7/8/9, R17.3/17.17/19.61, R19.3/4/53/59, FLAG/R19.45, R19.47/48/49/51); 1b5c8ddc R12.1 SM authorship call; old shared markers removed (housekeeping). ~29 open chains.

## MY LANE: 4 guards + det-3x + dedup-aware snapshot-diff per batch; report flips both sides + milestone flags; stand up missing-task gaps; wire implementations[]/tests[] UNIQUELY; un-wire cross-class over-credits (SM-ack); resolve+hand EXACT full-uuids (learning #46); realness-audit borderline clusters (distinct-method-with-authorship). NOT source markers.

---
# robbin-planner Context — Save Point 2026-06-11d (HONEST FLOOR 36/159 ≈23%; 38=25% was CORRECTED DOWN — SUPERSEDED)

**Pane:** robbinTeam2:0.1. Roster: 0.0 po · 0.1 me · 0.2 expert · 0.3 skill-expert · 0.4 architect · 0.5 req · 0.6 tester. SM TRONinterface:0.1.

## ⚠️ MILESTONE CORRECTION: 38=25% WAS INFLATED → honest floor = 36/159 ≈23% (SM-verified, re-reported to Tron)
- The earlier 🏁 38=25% included SHARED-TEST over-credits. After eliminating them, TRUE floor = **36/159 ≈23%** (SM re-verified, det 3x, broken=0). SM CORRECTED Tron down from 25%→~23%. Do NOT regress to "38=25%".
- **TWO integrity invariants now BOTH guarded (per-cycle):** shared-IMPL=0 (structural, every impl→1 method) AND shared-TEST-over-credit=0 (every test→1 class, except SM-confirmed legit dual-cover).
- **shared-TEST guard (NEW, my per-cycle):** sweep tests wired to Impls of >1 class (split-aware: read the `(split for <Class>)` suffix as the true target). Over-credit = spans unrelated classes → un-wire cross-class / split per-req. Legit dual-cover = authored-together (KEEP): `1e763397` (R19.36/37 DropDispatcher), `dd85c4d7` chat-pair (R19.38/40), same-class siblings `1179288e` (IORResolver), `802363cb` (RbUseCaseDetail), `8edfcdd6` (RbDetailDrawer).
- **Cross-class catch-all-test un-wire DONE** (commit 59b3bd22, SM-signed-off): removed 16 cross-class Impl.tests[] from b543e1ad(→Logger, was 9-class fan-out)/9e1cb105/dd85c4d7/f2122854. Count 42→35→36; all-(a) de-inflation (8 false-completes dropped: R-A2/R-R1/R18.34/R18.34.B/R19.50/R19.54/R19.55/R19.57; 4 legit home survived R19.38/39/40/41; +R12.1). The 8 re-complete cleanly once their OWN dedicated tests land.
- **REMAINING for shared-test=0:** req-level over-credits 2c502c22 (R15-vs-R16), e11c89d0 (unrelated R19.x), f301f0b9 (R-V1 part) → TESTER per-req dedicated tests (not my un-wire — these need NEW test units, tester lane).
- **QA ≠ chain-complete:** R18.34/B are Tron-DEVICE-accepted but chain needs onPinchEnd's OWN dedicated test. Two separate gates.

## Honest arc (every transition both-sides-verified): 9→14→25→22→8→11→19→23→38→39→43→42→41→35→36
- Two major de-inflations caught BEFORE Tron saw inflated: impl-side (25→8) + test-side (43/42→35/36 + 38→36 milestone correction).

## TOOLING
- Canonical: `npx tsx scripts/po-chain-follow-up.ts --all | grep "^## Summary"` (denom 159, 40 orphanByDesign excluded). Det 3x every flip.
- **Per-cycle GUARDS (learning #52 + new):** (1) broken scenario JSON = 0 (json.load sweep — markers in .ts SOURCE only, never scenario.json); (2) shared-impl = 0; (3) shared-test-over-credit = 0 (split-aware). Run all 3 before crediting any jump.
- listComplete dedup display-bug → use scoreboard-row extraction `grep "^| (R|FLAG)" | grep -v "^| [0-9]" | grep -v "open"`.
- My de-inflation scripts: /tmp/unwire-tests.py (cross-class test un-wire), /tmp/shared-marker-sweep.py, /tmp/deinflate2.py. Classification: scrum.pmo/planner-sharedtest-classification-2026-06-11.md.

## MY LANE: score det-3x + snapshot-diff per batch, 3 guards each read, report flips both sides + milestone flags (flag at 80=50%), stand up missing-task gaps, wire implementations[]/tests[] UNIQUELY, un-wire cross-class over-credits (SM-ack), resolve+hand EXACT full-uuids to tester/expert (learning #46). NOT source markers.

---
# robbin-planner Context — Save Point 2026-06-11c (🏁 38/159 = 25% MILESTONE — SUPERSEDED, was inflated)

**Pane:** robbinTeam2:0.1. Roster: 0.0 po · 0.1 me · 0.2 expert · 0.3 skill-expert · 0.4 architect · 0.5 req · 0.6 tester. SM at TRONinterface:0.1.

## 🏁 SCOREBOARD = 38/159 (25% Tron milestone HIT + SM-verified clean, reported to Tron)
- **Honest arc this session:** 9→14→25→22→8→11→19→23→38, EVERY transition verified both sides (climb-rigor learning #45).
- **Structural milestone: shared-impl = 0** (was 15-17). Every impl uniquely wired to exactly 1 Method → miscrediting is STRUCTURALLY IMPOSSIBLE now (ungameable metric). SM verifies lighter at quartiles (det 3x + shared-impl=0 guard).
- **What drove 23→38 (+15, 0 lost):** expert `0fd86c57` = 75 real source [impl:uuid:] markers across 48 files; Tests pre-wired → instant flips. Flips: R-A2/R-R1/R16.3/R18.34/R18.34.B/R19.3/4/14/41/45/50/53/54/55/57 (all Bucket-A).
- **CANONICAL TOOL:** `npx tsx scripts/po-chain-follow-up.ts --all | grep "^## Summary"`. Denominator 159 (40 orphanByDesign excluded). Det 3x on every flip (learning #47).
- **listComplete has a DISPLAY BUG** — dedupes chains sharing a test leaf (hid R19.36). Use dedup-aware scoreboard-row extraction for snapshot-diffs: `grep "^| (R|FLAG)" | grep -v "^| [0-9]" | grep -v "open"`.

## NEXT: drive 38→50%≈80. Worklist = scrum.pmo/planner-chain-worklist-2026-06-11.md
- **Chain gate (LOCKED #27):** Req→UseCase→Class→Method→Impl→Test. COMPLETE only when BOTH the Impl has a real source `[impl:uuid:<FULL>]` marker AND the Test has a real `[test:uuid:<FULL>]` marker (tool gates on SOURCE markers, NOT just Method.implementations[]/Impl.tests[] wiring — "wired" ≠ "source-marked").
- **Remaining buckets (post-38):** B-residual (tester source [test:uuid:] markers — I gave exact full-uuids: R12.1 1b5c8ddc, R19.14 done, R19.23 ffab35a3-554b-4c80-ac3e-7a6216461e4a, R19.58 aa4b7cf3-cf99-…, R19.32 needs new test) + C ~107 (expert marker THEN tester test, 2-step) + D architect R19.55.A (UC anchored d5e4a498).
- **MARKER-UUID-MISMATCH is the #1 flip-killer (learning #46):** marker MUST = unit's FULL 36-char uuid, not 8-prefix. Tester's 3 markers (23bc3836/c2db6a2f) added 0 flips = wrong suffix or non-B. I resolve+hand exact full-uuids to avoid mismatch cycles.
- **PO HARD RULE #51:** never invent uuid suffix (telltale -a1b2-4c3d/-a2b3-/sequential hex). lintMarkers worklist (expert) drives invented-suffix→0.
- **My lane:** score det-3x + snapshot-diff per batch, report flips both sides + milestone flags, stand up missing-task gaps (e.g. R19.45 task 19f98828 d7f5ff45), wire Method.implementations[]/Impl.tests[] UNIQUELY, resolve+hand exact full-uuids. NOT source markers (expert/tester).

---
# robbin-planner Context — Save Point 2026-06-11b (HONEST NUMBER SETTLED = 8/159 after de-inflation)

**Pane:** robbinTeam2:0.1. Roster: 0.0 po · 0.1 me · 0.2 expert · 0.3 skill-expert · 0.4 architect · 0.5 req · 0.6 tester. SM at TRONinterface:0.1.

## ⚠️ HONEST SCOREBOARD = 8/159 (NOT 25). The 25 was INFLATED.
- **The 25/154 was a SHARED-MARKER FALSE-COMPLETE inflation.** Surfaced via SM's gold-standard 14→25 verification (learning #45). Finding doc committed: `scrum.pmo/planner-chain-inflation-finding-2026-06-11.md` (71d61048).
- **Root cause:** 2 "catch-all" Impl units wired into methods of UNRELATED classes:
  - `94bc8f6e` (marker "chat lazy-load", FAKE -a1b2- suffix) — legit owner Message.lazyLoadChain; was fanned to Room/Assets/Device/server (6 miscredits).
  - `7f1774c9` (marker "Logger.logAtLevel", REAL suffix) — legit owner Logger; fanned to SvgViewer/PageNav/FileUnit/User/server/Message (6 miscredits).
  - `7de1d230` minor (ClassRegistry+User). Total 12+ cross-class miscredit wirings.
- **De-inflation EXECUTED BY SKILL-EXPERT** (I HELD to avoid clobber — 9 units were uncommitted mid-fix, learning #47/#11) + lint commit `9c67945c` (64 marker violations worklist). I re-scored: **22→8/159, det 3x.** Drop = climb-rigor class (a) de-inflation (honest), NOT regression.
- **Honest 8 survivors:** R19.30, R19.33, R19.34, R19.35, R19.36, R19.37, R19.39, R19.52 — each method+impl+test CLASS-MATCHED + uniquely wired.
- **SM's plan:** SM independently re-verifies the 8 (each marker uniquely-wired, not fanned) → THEN reports Tron. Current honest = 8/159.
- **Denominator drifted 154→157→159** as req added units (R19.62-66). Legit tightening, reported.

## NEW LEARNINGS THIS SESSION (add to learnings.md #49-51)
- **#49 Shared-marker false-complete:** markers can PASS git -S (exist in source) yet be MISCREDITED — one impl/test marker wired into N unrelated methods via Method.implementations[]. The 10th+ precision catch, SUBTLEST. Detection: group impls by the SET of method-CLASSES wiring them. All-same-class = LEGIT (one file impl serves its class's methods). Spans ≥2 unrelated classes = CATCH-ALL miscredit; legit owner = the class matching the impl's source-marker name; remove the rest.
- **#50 Home-class heuristic pitfall:** deriving an impl's home-class from its UNIT NAME fails (names vary: "Class.method" vs "R15.x desc"). My first pass over-flagged 90 (b4c8bf40 all-RbObjectItem, 664314f1 all-IORResolver = legit, falsely flagged). Use the METHOD-CLASS SPAN of its wirings instead — only ≥2 distinct classes = true catch-all.
- **#51 PO HARD RULE (2026-06-11):** NEVER invent a uuid suffix. Marker uuid = uuidgen-fresh OR copied VERBATIM (full 36 chars) from the unit. Telltale invented: -a1b2-4c3d, -a2b3-, -b2c3-, sequential hex. One marker=one unit=one method, no sharing. grep FULL uuid before claiming a flip.

## TASKS STOOD UP THIS SESSION (S19, all real v4, useCases:[] for architect)
- Pre-rewind: T-room-editor 6e0240a9 (R19.2+R19.2.A), placeholder ada9339a→R19.21 swap, R19.22 split (R19.22.A e9618d93 T-room-symlink 755a2b09 + R19.22.B b748b4f1 T-room-link-affordance be3ea56d), T-remove-room-sizes e90c223d (R19.23), T-remove-spectator 787e88ab (R19.24), T-persistent-retention fa8fffc8 (R19.8), T-persistent-dedup ce98e242 (R19.8.B), T-room-ui-shared REOPEN 2195d98f, T-child-count-badge 2d945dbd (R19.25), T-icon-only-drag ce3c7870 (R19.26), T-icon-tap-collapse 62adcf98 (R19.27), T-one-layer-prefetch 07c44272 (R19.28), T-tree-owns-badges-prefetch 5df25620 (R19.29), T-share-link-offline 0608a036 (R19.32).
- Post-rewind: R19.62-65 (T-url-drop e22d3c92, T-file-preview 6bbac678, T-preview-by-type 50437a26, T-generic-previewer 70ec5980) d0aad785; T-room-scenario-detail 594b06ea (R19.66) 356189f7.
- **S19.tasks[] = 58.**

## R19.23 — did NOT auto-flip (PO expected it to)
Gated at Impl edge not Test: Method stripSizeLimits.implementations[] was empty + fake-suffix collision (f1dd0d77-a2b3 vs real c96d458c). Reconciled in c52957d0 (delete fake, wire Method→c96d458c→Test ffab35a3).

## STANDING DUTY: chain-completion drive (Tron-assigned)
- Loop: `npx tsx scripts/po-chain-follow-up.ts --all | grep "^## Summary"` (det 3x on flip). Report flips + milestone (flag at 38=25%) to PO + SM. NEVER stop while open work exists.
- Bottleneck = EXPERT (Impl units + REAL source markers). 64-violation lint worklist (9c67945c) is the expert grind list. Tester downstream.
- My data lane: wire Method.implementations[] (uniquely!), fix dangling refs, mark designStage. NOT source markers (expert).

---
# robbin-planner Context — Save Point 2026-06-11 (overnight chain-completion drive, SM save directive)

**Role:** Sprint Planner / board-consistency owner + **chain-completion drive owner** (Tron-assigned standing duty). Reports to robbin-po (robbinTeam2:0.0).
**Pane:** robbinTeam2:0.1 (MOVED from robbinTeam:1.0 — new session 2026-06-10 to overcome write-classifier limit). **Roster:** 0.0 po · 0.1 ME · 0.2 expert · 0.3 skill-expert · 0.4 architect · 0.5 req · 0.6 tester. SM at TRONinterface:0.1.
**Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Model:** Opus 4.7 (1M context). **Write tool operational** in robbinTeam2 session.

## STANDING DUTY: continuous chain-completion drive to 154/154 (Tron-assigned)
- **Loop:** every ~5min run `npx tsx scripts/po-chain-follow-up.ts --all | grep "^## Summary"` (deterministic 3x on a flip). Report each COMPLETE flip + which chains to PO (robbinTeam2:0.0). Flag PO+SM at milestones. NEVER stop while open work exists.
- **Canonical denominator = 154** (one row per non-orphan Requirement, deterministic; 40 orphanByDesign excluded). Tool: `scripts/po-chain-follow-up.ts --all` since `2c3ac41d` made it canonical.
- **CURRENT: 25/154 COMPLETE (16.2%)** as of commit 2fdae217. Climbing fast.
- **Chain def (LOCKED #27):** Requirement → UseCase → Class → Method → Implementation → Test. A chain is COMPLETE only when its Test leaf is real (test:uuid marker in source + Impl.tests[] wired). Tool gates on source-marker presence matching FULL uuid.
- **Bottleneck = EXPERT** (sole gate after architect closed all UCs/Classes). ~85 Impl nodes: each needs Impl scenario unit + [impl:uuid:<impl-uuid>] source marker (marker MUST = Impl uuid, NOT Method uuid) + Method.implementations[] wire. Tool: `chain-wire-impl-node --all-missing`. Highest-leverage Methods: classMethodScope(13 chains) > lazyAppend(9) > symlinkJson(5).
- **Tester ~49** Tests — mostly DOWNSTREAM of expert Impls (auto-register once Impl marker lands). NOT a separate front.
- **Climb-rigor (#89b):** when count DROPS, diff COMPLETE-set at both states via CURRENT tool against BOTH data states (`git checkout <old> ; git checkout HEAD -- scripts/po-chain-follow-up.ts`); classify each lost chain (a) false-complete de-inflation vs (b) real regression. Name the broken edge for (b). Example done: 12→9 was all (a) — chains counted via Impl.tests[] wiring without real source markers.
- **Dispatch file:** `scrum.pmo/expert-blocked-chains-2026-06-11.md` (115-row list, highest-leverage Methods).
- **RECURRING data-link dropout (planner-fixable):** test:uuid marker in source but Impl.tests[] empty → swept 16 in commit 838be41c, fixed R19.52 in 838be41c. Re-sweep each cycle.
- **MARKER-UUID-MISMATCH bug pattern:** tester writes test:uuid with WRONG full-uuid suffix (same 8-char prefix, e.g. dd85c4d7-a1b2 vs unit dd85c4d7-2fe6) → tool full-uuid regex fails. Fixed in fa169ab2 (flipped R19.38/39/40).

## My recent planner commit chain (overnight, most recent first)
- `2fdae217`-area: 25/154 reached. Expert batch 2 (21 Impls) + tester full-uuid fix flipped +11 (14→25).
- expert-blocked-chains-2026-06-11.md dispatch; climb-rigor 12→9 diag (all (a)).
- 838be41c sweep 16 Impl.tests[] dropouts + R19.52 flip.
- Stood up S19 tasks T-room-editor(6e0240a9) through R19.61(761c3665), R19.55.A(5d87e755), R19.59/60, plus R19.52 full-width + R19.33 sticky-X reopen, R19.57 back-button.
- 205 flat numeric User/Device units (e0bfa395) were INVALID per UUID-rule but DID NOT pollute canonical; architect ebfc1c25 cleaned (0 flat remain, 195 Device at canonical shards).

## DELEGATION RULE (reaffirmed this session)
Planner does NOT touch src/ source code. Tron's CSS directives (drawer full-width, sticky-X) → route to PO → req→architect→expert. I CAN edit scenario/index JSON data (Impl.tests[] wiring, status, dangling-ref cleanup) — that's data, not source.

---
## (prior save points below — historical)

# robbin-planner Context — Save Point 2026-06-10 (S19 stand-up complete + R18.34.B device-accepted + classifier-workaround)

**Role:** Sprint Planner / board-consistency owner. Reports to robbin-po (robbinTeam:0.0).
**Pane:** robbinTeam:1.0 · **Project:** Web4RawBin · **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Sprint tool:** `SPRINT_PMO_DIR=<repo>/scrum.pmo /Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint {status|audit}`
**Model:** Opus 4.7 (1M context) (default) — switched 2026-06-09 (prior unavailable).
**Auto mode:** OFF as of 2026-06-09 — ask clarifying questions before non-obvious moves.

## Current State (v0.5.128 committed — S19 4/7 tasks shipped, 3/7 chain-refined, audit 0)
- Latest version: v0.5.128 (22416694 expert T-file-unit data model — createFileUnit + FileLoader, 885/885).
- My recent planner chain (most recent first):
  - **`e56353ec`** S19 7-Task chain (T-room-unit/visibility/apply-flow/persistent/default-flip/room-ui/file-unit) + generator emit + R18.34.B device-accepted sync (Tron v0.5.125 acceptance, gate #27 cleared)
  - `098620cb` PO flush: architect's 7-section design + sprints.overview row + README link for S19 (after my Edit gate held)
  - `364202fe` PO flush: S19 ln tree (sprint.json + 14 requirement symlinks) — my gated lane
  - `b0b6b8e8` PO authored S19 Sprint unit `97f513a1` + 14 R19.x Requirement units (created at my reserved uuid; learning #20 saved my staged content from clobbering)
  - `13a8fc1f` robbin-req R19.x altId + refinementOf + R17.12 fold annotation
  - `ec769b2b` robbin-req S19 atomic split — R19.15-R19.20 sibling units + parent splitInto + sprint reqs + symlinks
- **S19 status after sync (this turn):**
  - 4/7 testing-hop done: T-visibility · T-persistent · T-default-flip (all 7d975b74 v0.5.127 882/882) · T-file-unit (22416694 v0.5.128 885/885)
  - 1/7 implementing-hop done: T-room-unit (Room class extended; UI testing deferred to T-room-ui)
  - 2/7 refinement-hop done: T-apply-flow · T-room-ui (architect 5305492f singular-chain consolidation)
- **R18.34.B device-accepted 2026-06-10** — Tron v0.5.125 accepted (snap-back gone, gate #27 cleared); expert stripping debug → v0.5.126; tester writing corrected device-representative champagne; R18.34.B joins Tron-QA gate alongside R18.34.
- **Architect 5305492f** consolidated S19 chain to singular-UC + singular-Method per task (locked chain rule #27/#38). 13 atom-UCs + 1 unused Class + 3 unused Methods + atom PUML deleted. End-to-end walks clean for all 14 R19.x.

## Previous State (v0.5.123 anchor — pre-S19 standup)
- Latest version pre-S19: v0.5.123 (6771a91d expert T188 --check + determinism + ci:gates wire).
- My recent planner chain THIS session (most-recent first):
  - **`c49966f5`** restore 13 NO-QA-REVIEW checkboxes (audit-drift cleanup from concurrent linter edits; S13/S14/S17 tasks; PO-authorized) — **audit 0**
  - `51899d07` T188 testing[x] sync — champagne 442237d6 GREEN, AC1/3/4/5 PASS, 7-step chain wired Test 9dbf5538 → Impl ee738f5f → … → Req R18.3
  - `3b1a0734` T188 --check 6-orphan reconcile — DELETE 6 stale generator artifacts (old slugs of existing scenarios); round-trip gate CLEAN
  - `f60784d0` T187 testing[x] (10/10 TS GREEN WebKit) + **675cc8e3 disposed** (covered by T187 via R18.26/27/28 shipped df4e4011/c3ba4fd9/08ae00f8) + **anomaly #4 resolved** (3 dup R18.13/14/15 deleted; 2 Done-task back-refs re-pointed to canonical R18.13; UC `725981f9 sourceLink.browse` re-owned to T187)
  - `b30f40a2` **T202 stand-up** — Class.method-per-UC narrowing for shared Class (sibling/follow-on T187); task `8a303a65`, placeholder req `4d525a4d` (learning #38)
  - `27866f2f` SVG fully Tron-blocked + R18.13-15 task triage (name-misleads)
  - `8f98face` T189 testing[x] sync — skill-expert 45/45 chain + R18.13 captured + 19 Skill orphan-by-design accepted
  - `f47e5eef` anomaly #1 resolved — dup Sprint 18 unit `8662d51e` deleted; 3 victims re-pointed (T187/T190 + previously-hidden `675cc8e3` source-link)
  - `aa4f11ac` R18.34.B chain sync + open-S18 actionable inventory
  - `6dd805ae` SVG R18.34 reconcile (Web4Articles compliance on architect's task .md; status Planned→In Progress)
  - `d1868fa`, `8ce3146` two intra-session context saves (post-rewind re-anchor; mid-session save)
- All anomalies surfaced this session = ALL RESOLVED (anomaly #1 dup-Sprint, anomaly #4 dup-reqs, 6-orphan .md drift, 13 audit warnings).
- Wakeup-prompt hash `4fe0702` does NOT exist (learning #35) — context.md is source of truth.

## OPEN-S18 ACTIONABLE LIST (full file in scrum.pmo/sprints/sprint-18-chain-method-scope/planner-open-s18-state.md)

**Sprint 18.tasks[] = 13 total (after 675cc8e3 dispose + T202 add); 7 Done, 6 OPEN.**

| # | uuid | status | what | blocked-on | actionable role |
|---|------|--------|------|------------|-----------------|
| 1 | bef36fd2 | In Progress | SVG viewer fullscreen iframe + native zoom (R18.34 + R18.34.B) | architect chain wired ✓; tester champagne ✓; only Tron device re-verify | **Tron** (final QA) |
| 2 | 292d8931 | In Progress | T187 trace-narrowing | testing[x] (10/10 TS GREEN WebKit per PO 2026-06-09); follow-on Class.method-per-UC bug split to T202 | **Tron** (final QA) |
| 3 | 8a31ba75 | In Progress | T188 dogfood view-gen | testing[x] (champagne 442237d6 GREEN per PO 2026-06-09); 7-step chain wired | **Tron** (final QA) |
| 4 | a7f7f216 | In Progress | T189 role skills SKILL.md | testing[x] (skill-expert 45/45 chain + R18.13 captured + Skill-orphan-by-design accepted) | **Tron** (final QA) |
| 5 | 08e46ce3 | In Progress | T190 tree expand append-only | tester executing 8 TS (per PO; was concurrent with T187 fixes) | **tester** (continuation) → Tron |
| 6 | 8a303a65 | Planned | T202 Class.method-per-UC narrowing (T187 follow-on) | placeholder Requirement `4d525a4d-…` per learning #38 | **req-eng** (canonicalize: verbatim Tron quote → R18.x altId → swap uuid in T202.coveredRequirements[]) → architect /api/trace/children UC-chainMethod-context design → expert → tester |

**Sub-track (hand-written .md, no scenario unit):**
| 7 | 03fb4511 | (decision-only) | task-planner-s2-s9-backfill — DEFERRED per PO 2026-06-07 | Tron QA on decision | **Tron** (acknowledge decision) — no role work |

**SUMMARY:** 4 of 6 OPEN are Tron-blocked (SVG/T187/T188/T189 all testing[x], awaiting Tron QA + device acceptance). 1 in active role work (T190 tester). 1 net-new (T202, req-eng queued). + S2-S9 decision-only.

**ANOMALIES — ALL RESOLVED THIS SESSION:**
- ✓ **Anomaly #1** dup Sprint 18 unit `8662d51e` deleted f47e5eef; T187+T190+`675cc8e3` victims re-pointed to canonical S18.
- ✓ **Anomaly #4** 3 dup R18.13/14/15 reqs deleted f60784d0; Done-task back-refs re-pointed to canonical R18.13; UC re-owned to T187.
- ✓ **6-orphan .md drift** (T188 --check finding) — all 6 stale generator artifacts deleted 3b1a0734; round-trip gate CLEAN.
- ✓ **13 NO-QA-REVIEW audit drift** restored c49966f5 (linter concurrent-edit damage); audit 0 issues.

## TRON-QA GATE QUEUE (S18 portion)
SVG (R18.34/R18.34.B) · T187 · T188 · T189 · S2-S9 backfill (+ T190 once tester finishes 8 TS)
All testing-hops verified; only Tron's final QA + device acceptance separates ✅ from 🏁.
- **Since prev save (8ce33c87):** req-eng `6cf7b901` (S14 quote placeholders + R18.29-31 unitLinks lifecycle) + `ccdffd64` (canonicalised ALL tronQuote — zero inferred markers). req's compound-source still has uncommitted M on disk (R-M / Follow-on H R18.32 capture WIP).
- **Sprint 17 closed** — cascade fired 2026-06-05 (T178 KEYSTONE `452f8d5d` 44/44 7-hop reach; T128.4 ✅; T178/T124/T168 🧪 Tron QA pending).
- **Sprint 18 ACTIVE** — `sprint-18-chain-method-scope`. Sprint uuid `5b950725-a6f6-4d45-b802-4784ee6ef962`. **DOGFOOD COMPLETE 2026-06-07/08.**

## DOGFOOD COMPLETION SUMMARY (PO direction 2026-06-07 split-wave strategy)
- **Wave 1 (R18.9-R18.28, 20 Requirement units)** committed across 4 batches:
  - `2e48fa9a` W1B1 R18.9-R18.13
  - `24bfe028` W1B2 R18.14-R18.18
  - `a5231818` W1B3 R18.19-R18.23 (R18.20-R18.23 inferred from Follow-on C cross-refs; req-eng to canonicalize headers later)
  - `792132ff` W1B4 R18.24-R18.28
- **Wave 2 (T191-T199 Task units, T196+T199 skipped as no commits exist)** committed:
  - `5d977918` W2B1 T191-T194 (4 tasks)
  - W2B2 T195/T197/T198 rode into architect's `391cb9e4` commit (race condition; data correct)
- **S18 Sprint.tasks[] wired** (11 tasks) + **Sprint.requirements[] wired** (20 reqs): `bc11d861` (planner: dogfood COMPLETE).
- **Generator T188 ran**: `scripts/generate-sprint-md.ts 5b950725-…` → planning.md + **11 task .md** files emitted (up from 3 before backfill).
- **sprints.json symlink tree built** `8ce33c87` (this commit, latest): `scenario/sprints.json/sprint-18-chain-method-scope/{sprint.json, task/* (11), requirement/* (20)}` all symlinks resolve. Deleted 17 fake-suffix-uuid duplicates the migrator auto-created (learning #17 violation; my real-v4 W1 units canonical). T187+T190 sprint pointer restored after architect's `724880b5` data fill removed it.
- **README Traceability nav** now indexes `scrum.pmo/standards/scenario-data-pipeline.md` per index-everything rule.

## S2-S9 BACKFILL — DEFERRED (PO decision (b) 2026-06-07)
- Recorded in `scrum.pmo/sprints/sprint-18-chain-method-scope/task-planner-s2-s9-backfill.md` (committed `e641224a`).
- Census: zero Task scenario units exist for T7-T80; the 8 empty S2-S9 Sprints' `tasks[]` is by-design (historical task-unit migration deferred). Re-openable as dedicated migration sprint on Tron request.
- Architect: please add allowlist hook in trace-audit-strict so S1-S9 empty `Sprint.tasks[]` is by-design (analogous to TraceLink orphans).

## R18.19 ZERO-PAD — DONE by architect (`2276be51`)
9 Sprint units renamed (S1→"Sprint 01" through S9→"Sprint 09"); S10-S18 already 2-digit. `model.number` int for sort.

## T184 R-X1 → R-Y1 RENAME (planner, learning #20 reconcile)
req-eng `15dd69c1` captured R-X1+R-X2 for PUML class diagrams concurrently with my T184 R-X1 use (.md-parser forward-only). I renamed mine to R-Y1, req:uuid `d9c419b3-…` retained (label change only). Committed earlier in `ffdc7dd0`.

## STANDING RULES (active — 15 with #15 NEW)
1. **QA Review + Done = TRON's gate ONLY.** Never check from sync.
2. **CMM4 file-comms:** write into task files; otmux/hiveMind = ONE-LINE pointer only (SM 2026-06-07 reaffirmed: "Report-back goes INTO the task file; chat = one-line pointer only. No detail walls in chat.").
3. **Sync against COMMITTED reality.**
4. **Discoverability:** new sprint/standard → README + sprints.overview.md in same commit (index-everything rule).
5. **req-eng + architect create files ahead of me** — reconcile per learning #20.
6. **No artificial character limits** in specs.
7. **Standard:** `scrum.pmo/standards/traceability-standard.md` · `…/scenario-data-pipeline.md` · template `…/templates/task-template.md` · matrix `…/traceability-matrix.md` · backlog `…/backlog.md`.
8. **Rule-pair (#15+#16):** every impl on user-facing surface = (a) package.json + (b) sw.js CACHE_NAME + (c) STATIC_SHELL if route-introducing. Data/infra-only commits exempt (expert self-notes).
9. **Real v4 UUIDs always (#17):** task:uuid AND requirement:uuid via `uuidgen`. Reject fake-suffix like `…-000000018009`.
10. **CMM4 4-role per task (#18):** req → architect → expert → tester.
11. **Planner uses scenarios (#19):** planning.md is generated VIEW from scenario JSON via `scripts/generate-sprint-md.ts <sprint-uuid>`.
12. **At-a-glance symbols (#14):** ⏳ planned · 📝 designed · 🔧 implementing · ✅ impl-shipped · 🧪 testing · 🏁 Tron-QA-done.
13. **R-H.2 atomic-req-split** before refinement closes.
14. **R-J per-Test reachability** — every test chains back to a requirement root via LOCKED chain.
15. **NEW (PO rule #65, 2026-06-07): NEVER /compact the expert.** SM+trainer rewinds instead. Pre-rewind context save is on each agent.

## PER-AGENT BOARD (last known)
- robbin-po (you): orchestrate; next pivot direction
- robbin-architect: idle ⇒ R18.19 zero-pad shipped 2276be51; allowlist hook for S1-S9 empty Sprint.tasks[] still open
- robbin-req: idle ⇒ canonicalise R18.20-R18.23/R18.26-R18.28 verbatim headers (inferred markers I noted in W1B3/W1B4)
- robbin-expert: HIT context limit prior session ⇒ SM+trainer REWIND (not /compact per rule #65)
- robbin-tester: idle ⇒ verify R18.9-R18.13 vs canonical wired Sprint; clear Class-missing-parent + Sprint-no-children flags (S10+ ones are real; S2-S9 deferred)
- robbin-skill-expert: in flight on T189 / SKILL.md scrum.pmo authoring
- robbin-planner (me): standing by

## TRON-QA GATE QUEUE (snapshot)
- Existing batch file: `scrum.pmo/tron-qa-batch-2026-06-05.md` (S16+S17, 29 strict-verified). **STALE — needs refresh** to include S18 T187-T198 + R18.x + champagne + zero-pad. PO requested prep for one-pass approvable batch (S5-S8 precedent — spot-check-3 + single approve commit).

## DONE THIS SESSION (2026-06-08/09)
- `3234be28` T199 stand-up — scenario-data-integrity R18.32 backfill (ownerIor + unitLinks[]). task f5b8c83e-…; R18.32 placeholder 76b16118-….
- `69a7a2f8` Web4Articles audit sweep — 16→0 issues on 3 hand-written planner task files.
- `780bb36` SKILL.md UPGRADED — added "Operating Discipline" (per-cycle triple-check) + "Planner↔Architect Sync Rule". Architect paired theirs. Honest admission: SKILL.md had been read-at-rewind, not applied per cycle — same root cause as architect's 100% empty coveredRequirements on ~120 tasks.
- `da69ebbd` + `6a49add7` **T200 stand-up** — tree↔detail sync, FIRST LIVE pre-gate application. task f84b551a-…; R placeholder c8064a94-…; UC placeholder dbc9ad5f-…. (lesson: emoji prefix belongs in planning.md legend ONLY, not task-file Status — fix 6a49add7.)
- `124186ae` **T201 6-step chain correction** — multi-layer foundational fix (skill → standards → code → data → views), each layer VERIFIED before next. task 53b926d6-…. SELF-REFLEXIVE: T201's own Traceability uses 6-step (fix dogfoods itself). Supersedes T168 chain definition.
- `bf7288e` planner SKILL.md +Canonical 6-step Chain Definition (T201 Layer 1 alignment).
- T201 closed via expert/architect work: `0925a420 d79c3013` Layer 2 standards; `81856abd v0.5.108` Layer 3 code; `f3171e57` Layer 4 data; `84908ea4 v0.5.109` Layer 5 views (PO-verified).
- `323712b6` **T200 RELEASE** — coveredRequirements canonicalized R18.33 (b64a9d54-… real v4 owned by Sprint 18). T200 ⏳→📝. R18.33 scenario unit tasks[] populated with T200 IOR (chain wiring loop closed both sides). useCases[] placeholder 88a1c3a0-… remains pending architect quick-design.
- `83ad5177` **NEW STANDARD: `project-state-is-scenarios.md`** (Tron 2026-06-09 via PO). Principle: scenario units ARE the live project state; canonical planning workflow (find owning sprint → add scenario units → no floating tasks). Paired back-ref in refinement-precedence-analysis.md; indexed in README Traceability.
- **SVG fix scope located** (no commit yet — Steps 2-3 wait for req's atomic decomposition): owning sprint = Sprint 18 (`ior:instance:5b950725-a6f6-4d45-b802-4784ee6ef962`). Two defects from screenshots IMG_3876/IMG_3877/IMG_3878: (1) /md SVG wrapper height ≈ 5% viewport (should be near-fullscreen iframe); (2) pinch-zoom zooms the page, not the SVG content. Screenshots relayed to architect at robbinTeam:0.1 for design.

## IMMEDIATE TODO (next session)
1. **SVG fix RECONCILE** — req-eng SHIPPED R18.34 + SVG Task unit in `c66ad3fd` + `39af520a` (resolves former TODO #1). Planner now: reconcile per learning #20 → verify the new Task scenario unit (a) lives under Sprint 18 `ownerIor:instance:5b950725-…`, (b) has real v4 uuids (no fake-suffix per #17/#33), (c) `coveredRequirements` carries R18.34 IOR and R18.34's `tasks[]` reciprocates, (d) Web4Articles compliance (Subtasks + QA Audit) intact. Verify rule-pair (a)+(b) on `87dfee3b` v0.5.114 (package.json + sw.js bumped together). On clean → sync Sprint 18 planning.md entry to ✅ impl-shipped.
2. **T200 follow-through** — architect quick-designs sync semantics + canonicalizes useCases[] placeholder 88a1c3a0-…; expert builds (rule-pair (a)+(b)); tester standing by for R18.33 ACs.
3. **T201 closure cleanup** — task file checkboxes may need sync to Done (PO-verified through Layer 5); T168 "superseded by T201" annotation per T201 DoD. Verify next cycle.
4. **T199 follow-through** — req-eng formal R18.32 unit emit; architect refinement; expert ownerIor/unitLinks backfill (in flight via 23907dd4 + 4147a6fd + d383970f); tester verification.
5. **T174 R-M1/M2/M3/M4** — STILL QUEUED, cut off mid-spec. Awaits PO re-fire.
6. Refresh `scrum.pmo/tron-qa-batch-2026-06-05.md` → new dated file with S18 (T187-T201 + SVG fix once stood up) + champagne + zero-pad.
7. Allowlist for empty S1-S9 `Sprint.tasks[]` (architect's lane).
8. **Per-cycle pre-gate triple-check on EVERY sync** (operating discipline 780bb36).
9. **New canonical workflow applies**: `project-state-is-scenarios.md` (83ad5177) — every new req → FIND owning sprint → ADD as scenario units → no floating tasks. Refer to it in every new stand-up going forward.

## REWIND-NOTE
- Wakeup prompt cited "Last save 5790a53" — that hash does NOT exist in the tree (per learning #35). Context.md is source of truth.

## MY RECENT COMMIT CHAIN (post-rewind anchor)
- `8ce33c87` S18 sprints.json symlink tree + README scenario-data-pipeline link
- `e641224a` S2-S9 backfill DEFERRED (PO decision (b)) recorded in task file
- `7a88d664` S2-S9 backfill BLOCKED status (historical Task units missing)
- `bc11d861` S18 dogfood COMPLETE — Sprint.tasks=11, requirements=20, generator 11 task md
- `5d977918` W2B1 T191-T194
- `792132ff` `a5231818` `24bfe028` `2e48fa9a` Wave 1 R18.x batches
- `ffdc7dd0` T184 R-X1→R-Y1 rename + S17 closure cascade book-keeping
