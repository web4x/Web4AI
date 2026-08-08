# robbin-req — Context

## ★★★ ANCHOR (2026-08-07, S37 — READ FIRST) ★★★
**Identity:** robbin-req @ robbinTeam2:0.4, host WODA.prod, project RawBin. Verify `otmux pane.self` (pane id DRIFTS %9->%10 — TITLE `robbin-req@WODA.prod` authoritative, never $TMUX_PANE). Work repo `/var/dev/Workspaces/web4x/Web4RawBin` (main). Session repo `/var/dev/Workspaces/AI/Claude` (this file; NOT in RawBin git). **DISK-WINS: re-derive `git log`; a restore-point can be WEEKS stale (mis-oriented S31 once, real was S37). CURRENT = S37 consistency-by-construction, v0.8.65.**
**Push path:** my+expert pushes classifier-blocked -> **TESTER 0.5 pushes**; ping tester per commit, confirm origin==HEAD. Flag only-local milestones to PO (NOT Tron).

### ★ PO PRIORITY (2026-08-07 post-rewind): CLOSE VERIFIED WORK FIRST, then §2, §3. §4 = ARCHITECT's.
**(1) FLIP/ADOPT pending markers (cheapest real progress, verify-owner-first, adopt tester markers — NO parallel mint):**
- **(a) R-C1 REFINEMENT:** adopt **3519018d -> resolveSprintPin af97137f** — gate GREEN DET-3x full meta-BITE (frozen-exclusion proven NOT to mask current-era ambiguity + stub isCurrentEra turns suite RED + single-source lint holds). DISTINCT-INTENT alongside fc28b6f1 (verify owner untouched).
- **(b) Group-D markers (all 3 features VERIFIED WORKING on served 0.8.65):** f1 templates **6251a78f** (⚠ NO source-marker templates.ts:369 — mint canonical Impl + place marker first) / f3 real-WebKit@390 **2fe84858**->handleTapSelect cc1dcd0e (R20.6c) + **ff903752**->simulateLongPress 4256aef7 (R20.6d) / f2 singular-chain **e97850c3**->Impl 3542dcb3 (BLOCKED on §4 architect untangle — wait).
**(2) §2 R20.6d longPressToggles — BLOCKED on architect f3-untangle (§4-class malformed, found 2026-08-08, do NOT wire onto it):** f3 Tests are REAL (2fe84858 tap-switch->cc1dcd0e handleTapSelect + ff903752 longpress-toggle->4256aef7-7580 simulateLongPress, real-WebKit@390 DET-3x, able-to-fail). BUT structure malformed: gate Impls cc1dcd0e + 4256aef7-7580 ORPHANED (empty ownerIor); DUPLICATE Method SelectionModel.tapSwitchToggle (aee56fad.method=...bc4d8c vs 6b21088e/impl 6a626fa3); 4256aef7 PREFIX COLLISION (2 units, name-> -7580); 47528657 (R15.4, impl[]=[]) over-credited on 3 Impls. Routed untangle to architect 0.3. ON untangle: mint R20.6d NEW UC longPressToggles (map line 19, shared 6b21088e, NOT re-credit aee56fad) + adopt 2fe84858/ff903752 onto clean chain. gate=test/visual/rcd-selection-touch-webkit-gate.mjs. [OLD: §2 R20.6d longPressToggles — UNBLOCKED:** f3 gate already exercises longpress->toggle on real WebKit (simulateLongPress->toggle, marker ff903752). CHECK whether f3's assertion satisfies R20.6d distinct-intent BEFORE minting; if yes ADOPT don't duplicate. NEW UC longPressToggles = distinct-intent on SHARED tapSwitchToggle 6b21088e (do NOT re-credit aee56fad); verify touch-path touchstart->500ms->longPressToggle@rb-object-item:66 resolves to 4256aef7.
**(3) §3 R20.6e-h LAST (grep-code-first, unbounded):** NEW UC+Method on Class SelectionModel b57b8838 — 6e highlightSelected / 6f dragAllSelected / 6g consolidateDrawers=select->renderDetailForRef / 6h defaultDrawerNoHighlight.
**(4) §4 = ARCHITECT's untangle (NOT mine):** malformed chain — UC 8dc64273 detailView.chainExcludesSelf.method -> **3542dcb3** = ior:class:Implementation NOT Method (skips Method layer); Impl 3542dcb3-aae6 ownerIor SELF-REFS; suspected 8-char PREFIX COLLISION (3542dcb3-w/-7-impls vs 3542dcb3-aae6). Owning req BUG1 **2d5f151e** useCases=0. Architect designs the fix; I wire BUG1 + Test e97850c3 AFTER. §1 DONE (4c60e641b). Architect map: design-rc7-groupD-r20.6-mapping.md (9aa813723). ⚠ 1fac9d23 + b1c93799 = TASK units NOT Impls.
**Stop+report at ~75pct.**

### S37 R-C chains (durable through a70b45a31; grind 03f2705fd..a70b45a31)
- **R-C1 FULLY CLOSED:** SprintPinResolver (sprint-pin-resolver.ts, 4 methods) -> 4 BITE Tests two-key clean (03f2705fd). S20 phantom slug killed by-construction. (REFINEMENT marker 3519018d adopt = item 1a above.)
- **R-C3 chain-complete-to-Test:** ConsistencyGuard -> BITE Tests d5156988a (refuseIfVacuous + assertNonVacuous META-BITE gate-proves-the-prover). Tester two-keying.
- **R-C5 + R-C7-refuse CLOSED** (8d8122298): deriveStatusEnum / assertStatusConsistent / proveComplete-refuse.
- **R-C6 awaits expert build**; R-C2 refined HONEST scope (generator-owned-green, not fake 37/37).
- **R-C7 G2 backfill (Tron-bounded S21-S29 only, ~119 gaps; FREEZE S01-S18 legacy):** `migrate-board --prove <sprint>` (READ-ONLY) NAMES the authoritative gap list -> per-gap classify **(i) genuinely-missing->backfill / (ii) present-but-refined->UNIT WINS don't overwrite / (iii) conflicting-intent->FLAG PO**. HELD: expert re-sweeping w/ semantic matcher -> corrected (shorter) gap report; grind CORRECTED list post-rewind, commit-per-sprint. S24=(ii)unit-wins; S27-R27.5=deliberate-move-STAYS-S28 (check git history before "fixing").

### Tron QA batch (a70b45a31, scrum.pmo/tron-qa-batch.md)
A1=24 / A2=15 / B=3 / D=4 / S=2 / C=4. NOTHING flipped Done (I recommend, Tron decides). A1=24 handed to Tron. B=3->QA-Review delivered-pending.

### ⏳ Also queued (after markers/§2/§3)
- Corrected --prove gap report -> per-gap classify -> backfill genuine-missing only -> re-prove -> expert --apply.
- 93 in-scope needs-review sweep (S21=36/S25=14/S27=18/S29=19/S22=5/S24=1) classify ii-unit-wins vs iii-flag-PO, commit-per-sprint.

## Durable doctrine (full in learnings.md)
- **FULL uuids in every chain op + say which KIND** (L-S37-5: 8-char prefixes COLLIDE; prefix resolution FAIL-CLOSED on ambiguity -> architect by-construction guard). Refuse to wire a proven Test onto a malformed chain.
- **verify-owner-first** before any ride/crossRef — R30.11 shared-impl = distinct-intent Test ALONGSIDE owner's, NEVER touch owner marker/ownerIor (credit = the added Test).
- **Measure-don't-invent:** adopt tester marker uuids FROM the gate file, never invent; refuse to mis-point a gate marker onto wrong Impl (data=truth).
- **strict-AST [impl:uuid] binds to NEXT NAMED DECL** — intervening decls steal credit; marker adjacent-above target.
- **indent-detect BEFORE open('w')** (truncate trap); `git diff --stat` after edits; git-add-EXPLICIT + verify-staged (session repo too — swept peer files once).
- **NEVER** `2>&1` / `|tail` / `|head` on Bash (Tron ban); wait for assignment; stay in lane (capture+mint scenario-first #126, don't create tasks); report before idle; correct-by-construction (pin invariants in the unit).
- Mint pattern: Test unit `implementations[]`+`ownerIor`->Impl (indent=2) -> wire `Impl.tests[]` forward from `git show HEAD:` -> tester two-key verifies. Req/UC serialize indent=1; match the file's indent.

## Boot: `session/agents/robbin-req/boot.md` (⚠ stale @S31 — update when stable). Learnings: `session/agents/robbin-req/learnings.md`.
