# robbin-po Context — save #43 (2026-07-15, S30 R30.9–R30.22 ALL DONE + DRAWER fully fixed Tron-confirmed; NEXT=diff-completeness IMG_4522)
*(supersedes #42; older saves collapsed to HISTORY below — full via `git show`)*

## ★★★★★★★★★★★★★★★★★ CURRENT STATE (save #43 — READ FIRST) ★★★★★★★★★★★★★★★★★
**★ BOOT: `git -C /var/dev/Workspaces/web4x/Web4RawBin log --oneline -8` + `curl -sk https://prod.wo-da.de:4444/api/config` + `ls scrum.pmo/sprints/` FIRST — DISK WINS over any saved fact. Then this + learnings.md. Prod=prod.wo-da.de:4444 LIVE v0.7.32. Repo=/var/dev/Workspaces/web4x/Web4RawBin (main, pushed). Team robbinTeam2 0.0-0.6, SM=ooshTeam:0.1, ARON=Temple:0.0. Restart=remoteShells:0.2.**

### ★★★ ACTIVE BLOCKER (Tron — REWIND POSTPONED until this is fixed): TRACE-VIEW SELECT REGRESSION from R30.20
- BUG: R30.20 drawer fix (v0.7.29) fixed in-room X→chat BUT broke the TRACE-VIEW drawer — selecting a task/class/node does NOT add content to the drawer (no detail renders). Tron: "in room regression fixed, now the drawer outside of the room is broken, does not add content on select."
- ★ MEASURED: R30.20's rb-detail-drawer.ts diff is ONLY the close handler (this.minimize→closeOrReturn) + version-bump — it does NOT touch the select flow (onSelectionChanged L67→renderDetailForRef L108→setMode('detail') L109→render). So R30.20 likely EXPOSED a pre-existing break OR the deploy did — NOT an obvious code cause. Expert was REPRODUCING live (v0.7.29 select behavior + console errors + compare v0.7.28 pre-R30.20) to find the real root cause when this anchor saved.
- R30.20 CLOSE-handler itself = CORRECT (tester 4 close-cases GREEN: trace-minimize/in-room→chat/in-room-chat-minimize/ESC-close, Impl 65f43714). The regression is the SELECT→content flow, a SEPARATE path the close-gate didn't cover.
- ★ GATE-GAP LESSON: "working set for ALL cases" = all BEHAVIORS not just close — the R30.20 gate tested X-close in every context but never that SELECT still renders content → regression slipped. Re-verify MUST cover select-content (trace + in-room) + all close behaviors.
- RESUME: get expert's root-cause → fix scenario-first → version-bump → re-verify ALL cases (select-content + close-behaviors, both contexts) → THEN the postponed rewind + THEN the diff-completeness bug.

### ★★ NEXT TASK (after the trace-view regression): DIFF-COMPLETENESS bug (screenshot IMG_4522)
- BUG: 3-way diff/merge editor comparing OOSH otmux latest(516ebb3) vs otmux@dev shows header "0 changes, 0 conflicts · clean auto-merge" BUT there IS a real difference — Result+Repository have a `CURRENT|current|.|self)` case line (~L45 in private.resolve.target()) that Local(latest) LACKS. The diff does NOT detect/highlight/count this NON-conflicting change. Tron: "clear differences in the code that are NOT highlighted for merge."
- HYPOTHESIS (architect to CONFIRM by measuring diff3Merge/computeMergedCenter output): the change-counter + highlighter count/show ONLY conflicts + take-overs, NOT non-conflicting auto-applied changes (they get merged into Result silently, invisible). OR the diff-algo misses the insertion. OR whitespace/line-ending normalization.
- FIX DIRECTION: NON-conflicting changes must ALSO be highlighted (change-blocks on the auto-merged lines, reusing R30.19 renderSideChangeBlocks/renderCenterChangeBlocks) AND counted — Tron must SEE every diff even on a clean auto-merge. Client-facing → VERSION-BUMP.
- STATE at rewind: architect was RATE-LIMITED (transient) mid-analysis; expert was reproducing (fetch both otmux versions, run diff, log hunks). Resume: architect (or expert) measures the actual diff output → root-cause → scenario-first mint → build → gate → Tron verify.

### ★ S30 COMPLETE — R30.9→R30.20, board 0-false-open, prod v0.7.29
- **R30.9→R30.19** IntelliJ diff/merge-editor line = chain-complete-to-Test on origin (17+/17 behavior-tested). R30.17 functional-correctness (accept-mutates/one-sided-ribbons/Y-align/left-history, v0.7.27) + R30.19 side-pane change-blocks (renderSideChangeBlocks, v0.7.28) both LIVE+gated+Tron-verified.
- **★ DRAWER FULLY FIXED (v0.7.32, app-5Y3QK3GS.js) — Tron-CONFIRMED "no flaws" — 3 fixes, all cases (rb-detail-drawer.ts):**
  - **R30.20** mode-aware close: R27.8 made X=minimize UNIVERSAL (:217) → broke in-room X→chat. FIX new closeOrReturn() { if(this.chatPanel && _mode==='detail') setMode('chat'); else minimize() } — chatPanel!==null=in-room (RoomView reads drawer.chat; trace=null). Impl 65f43714.
  - **R30.21** non-sprint detail render: type-specific detail elements rendered EMPTY when graph null OR unit chain-only. TWO causes: (a) graph-dependency → resolveDetailUnit [159fb8f0] (graph.get else /api/ior fetch, like renderSprintDetail), (b) detail elements UNREGISTERED in /app context → drawer now self-registers all 8. v0.7.31.
  - **R30.22** select-opens-content-visible: content rendered in DOM but drawer opened to PEEK (h=40, body display:none) = clipped/looked-empty until grab-bar expand. FIX new openExpanded() in onSelectionChanged/attrCb — on detail-select open EXPANDED not peek. Impl e927ecfe. Supersedes R27.8(B) closed→peek for content-select. v0.7.32.
  - LESSON: "working set for ALL cases" = all BEHAVIORS (close AND select AND render), not just the one being fixed — the R30.20 close fix surfaced a pre-existing render gap (R30.21) + a peek-clipping presentation bug (R30.22). Gate every behavior together. DRIVE-BY-DOING held (architect rate-limited → I traced the causes + produced designs → req minted → expert built; architect backstopped on recovery).
- **R30.11** honorSupersededBy (skill-classes.ts, Chain.implRetiredBySupersede) — board 0-FALSE-OPEN (cleared R30.10+R30.6.1+R30.6.3 impl-supersede class; anti-green-wash guards proven dynamically; over-decomposition collapsed to match built reality). **R30.18** requirements.md=generated-view (wired generateRequirementsMd into buildSprintOutput → all reqs visible, Tron's where-is-30.10-17 fix). Both tooling=no-bump.

### ★ NEW PRACTICE (Tron, bank + apply): CHECKPOINT + REWIND AFTER EACH MAJOR BLOCK
After each MAJOR block completes (a Tron-confirmed feature/fix/arc), UPDATE context.md + learnings.md THEN order my rewind via agent-trainer — proactively, not just when context-low. Keeps context fresh + anchors safe per milestone. (This #43 + rewind = the drawer-regression block.)

## ★★★★★★★★★★★★★★★★★ CURRENT STATE (save #42 — READ FIRST) ★★★★★★★★★★★★★★★★★

**★ BOOT PROCEDURE — do FIRST, in order (disk is AHEAD of a rewound convo; the team keeps building through rewinds; where a saved fact disagrees with measured disk, DISK WINS):**
1. `otmux pane.history <self>` — the recent exchanges the rewind dropped.
2. `git -C /var/dev/Workspaces/web4x/Web4RawBin log --oneline -8` + `curl -sk https://prod.wo-da.de:4444/api/config` — measure the PRODUCT + LIVE version (never the pane name).
3. `ls /var/dev/Workspaces/web4x/Web4RawBin/scrum.pmo/sprints/` — confirm the CURRENT sprint dir (never trust a remembered path).
4. THEN read this + `learnings.md`, and reconcile against 1–3.

**Identity:** robbin-po — Product Owner, Web4RawBin. Pane robbinTeam2:0.0 · Host WODA.prod.
**Team robbinTeam2:** 0.0 PO(me) / 0.1 expert / 0.2 skill-expert / 0.3 architect / 0.4 req / 0.5 tester / 0.6 planner. SM=ooshTeam:0.1. ARON=Temple:0.0.
**Repos:** PRODUCT = `/var/dev/Workspaces/web4x/Web4RawBin` (branch main, HEAD **1684e675d**, pushed). SESSION = `/var/dev/Workspaces/AI/Claude` (this file; anchor pushed).
**Prod:** prod.wo-da.de:4444 — LIVE **v0.7.27**. Restart = remoteShells:0.2 (Ctrl-C + `npm start`, self-heals to node22).
**Current sprint plan:** `scrum.pmo/sprints/sprint-30-traceability-improvement/planning.md` (RawBin repo). Only Tron increments sprints (R29.4 guard).

### ★ R30.17 = R30.16 FUNCTIONAL CORRECTNESS — DONE + LIVE v0.7.27 (gate + Tron-verify remain)
Tron reviewed the LIVE IntelliJ merge: R30.16 shipped the visual layout but had 5 functional bugs. His 4 complaints → R30.17's 4 fixes (architect derive PASS 11/11, design a2ff49697). ALL built + committed **1684e675d** + deployed v0.7.27 (new bundle **edit-53EHOESP.js** was EONO6TTD + sw.js bump = cache-bust):
1. **ACCEPT/CANCEL NO EFFECT [CRITICAL]** → accept-mutates: the per-strip click listener was ORPHANED by re-render → delegate clicks from the STABLE component ROOT (`this`), attached once in mountThreePane. Markers c4c84142 + fd99c520.
2. **one-sided change shows a ribbon from the RIGHT too** → origin-gate: Local≫ band on `c.a.length>0`, Result→Repo on `c.b.length>0`. Markers 5051b2a4 + fd99c520.
3. **wrong Y-mapping** ('line 70 right maps to 71') → origin-gate + anchor-pin Y so `lineY(remote,bStart)==lineY(center,span[0])`. Markers 5051b2a4 + 17c71adf.
4. **file-history selector belongs on the LEFT** (older-left) → NEW `populateLeftHistory` [MARKER=751934c1]; `populateRightHistory` REMOVED (old marker 58c11039 + code gone, call-site repointed left, `!st.ref` recursion-guard; only a supersede-COMMENT at rb-diff-editor.ts:512 remains). R30.10/R30.15 chains kept via superseded-by annotation.
- **MEASURED on disk (2026-07-14):** `populateLeftHistory` ×3 present · marker 751934c1 present · 58c11039 absent · package.json+sw.js bumped · `/api/config` = v0.7.27 · RawBin main == origin (pushed). R30.17 build+deploy is REAL, not relayed.
- **★ REMAIN (do NOT declare fully Done until):** (a) architect **AST-attach confirm** on the 4 markers; (b) tester **REAL-mutation gate** — real `page.click` + before/after center-content DIFF + one-sided-ribbon + line-map + left-history (the R30.16 gate tested firing-not-effect; commit 7db22ec54 upgraded it to real hit-tested clicks + content-diff); (c) **Tron hard-refresh verify** (his served edit-*.js hash from devtools + reload past SW cache).

### ★ NEXT TASK (Tron, post-R30.17): R30.19 = SIDE-PANE change-block highlights (screenshot IMG_4518)
- BUG: change-block highlights (colored rounded blocks) render ONLY in the CENTER Result pane; LEFT(Local)+RIGHT(Repository) source panes show changed lines with NO block highlight (just gutter arrows). IntelliJ highlights the block in ALL 3 panes (matching color) so you SEE which source block merges + the ribbon connects highlighted-source → highlighted-center.
- FIX (RbDiffEditor): extend `renderCenterChangeBlocks` → also render side-blocks on hunk source-lines (left=a-lines, right=b-lines) via the shared CONFLICT_PALETTE/conflictColor (block+ribbon color-match by construction, like R30.16); origin-aware (left-only→Local+Center, right-only→Repo+Center, both→all 3) reusing R30.17's a>0/b>0 gating. crossRef R30.16 + R30.13.
- STATE (UPDATED): R30.19 REVISED to architect's cleaner design — NEW Method `renderSideChangeBlocks` ef5a4ff2 [MARKER=eb994dcd] (deltaDecorations on edLocal/edRemote, LINE-anchored=no off-by-one, same de-block-{kind} class → color-matches center+ribbon), renderCenterChangeBlocks stays center-only. Req mint pushed 4b92a96ac. AWAITING architect derive-confirm → PO build-go → expert build → tester gate → Tron verify.

### ★ IN-FLIGHT DECISIONS (held safe on disk, complete next session)
- **R30.11 honorSupersededBy — DECIDED BUILD (not push-with-1-false-open).** After R30.17 retired populateRightHistory, R30.10/R30.15 read false-open (scorer honors REQ-level supersededBy at skill-classes.ts:193, NOT impl-level — same class as existing R30.6.1/6.3 false-opens). Req annotation (630394b91) clears R30.15 but R30.10 CAN'T req-supersede (live GitApi.fileHistory chain → T-TOOL-2 inflation). ROOT FIX = R30.11 walkChainCoverage honors IMPL-level supersededBy → clears R30.10+R30.15+R30.6.1/6.3 AT ONCE. Req minting scenario-first → architect derive → build-go → build → gate.
- **RETIREMENT PUSH HELD** (no false-opens on origin): tester df875176b (retirement wiring) + req 630394b91 (annotation) are committed-NOT-pushed. PO pushes ALL together (+ R30.11) once scoreboard reads 0-false-open. Discoverable via `git status` (unpushed commits).
- **R30.17 REMAIN:** combined-clean-push above + Tron hard-refresh verify (edit-53EHOESP.js).

### ★★ STALE-CACHE RECONCILE (the Tron-facing truth — 3rd occurrence of this exact SW-cache pattern)
Tester RE-MEASURED accept HARD (real Playwright `page.click` + content-diff, full matrix) → accept GENUINELY WORKS on the current served bundle (center content mutates). So Tron's "accept no effect" = a STALE CACHED BUNDLE, not a code bug. R30.17's version-bump = new `edit-53EHOESP.js` hash the browser never cached → forces a fresh fetch; the R30.14 auto-update banner offers reload. Tron needs his served edit-*.js hash (devtools) + a hard refresh. The OTHER 3 bugs (ribbons / Y-align / left-history) WERE real code bugs — fixed in R30.17. ('/api/config version' = SERVER, NOT the loaded JS bundle.)

### DISCIPLINE (hard-won, held across 5+ zero-loss rewinds — apply by DEFAULT)
- **SINGLE-MINTER** (req sole) → **ARCHITECT DERIVE-CONFIRM** (the gate, by uuid-FILE) → **PO BUILD-GO behind it**, carrying `[MARKER=impl-uuid]`. Never jump the gate.
- **MARKER = IMPL-uuid ALWAYS** (never Method), full 36 chars, uuidgen-fresh or copied VERBATIM — never hand-type a suffix. req reports `[MARKER=<impl>]` so build-go carries it. **chain-complete ≠ task-Done.** req deep-verifies the CHAIN ON DISK before reporting.
- **VERIFY-DELIVERY:** `send.verified` ≠ submitted; sends STAGE on busy panes → a bare-Enter poke submits. MEASURE DISK — an idle pane hides committed work.
- **PUSH-WHEN-BLOCKED:** branch-protection denies agent push to main → agent FLAGS me → I push origin/main + verify on origin (fresh-clone view). (This session: tester gate 7db22ec54 pushed by me.)
- **SW-CACHE:** version bump = new content-hash bundle = a URL the browser never cached = forced fresh; in-app clear / SW-unregister is insufficient. R30.14 auto-update = the permanent fix.
- **Independent-tool VERIFY** (tester probes real `page.click` + rendered content, not status/firing). **Measure a STABLE state** (never a dirty/mid-flight tree). **DRIVE by doing** when the team stalls AND Tron demands action.

## ───────── HISTORY (compact; full detail in git — saves #29–#41 via `git show <commit>`) ─────────

### S30 DIFF/MERGE-EDITOR ARC — the session headline (ALL on Class RbDiffEditor; each live + gated + traced)
- **R30.9** IntelliJ 3-way merge: RE-ARCH textarea+in-house-LCS → 3 Monaco + node-diff3 (VENDORED MIT, `src/public/ts/vendor/diff3.ts`); base-aware diff3 = the "magic wand"; layout Local(ro)|Result(editable, starts as BASE)|Repository(ro); BASE = GitApi.mergeBase. Tron "AMAZING". v0.7.18.
- **R30.10** file-history (right-default; superseded→left by R30.17) | **R30.12** 2-way take-over | **R30.13** inter-pane gutters + connector ribbons | **R30.14** SW auto-update (clients.claim + pollForWorkerUpdate — the cache-friction ROOT fix) | **R30.15** right-history usable
- **R30.16** FULL IntelliJ layout (v0.7.23): alignPaneRows (viewZone spacers) + widen-gutter 1px→34px (ribbons were invisible slivers) + renderCenterChangeBlocks (colored rounded blocks) + shared CONFLICT_PALETTE (blocks+ribbons color-match by construction) + scrollBeyondLastLine. Reference = Tron's Rider merge screenshot.
- **R30.17** functional correctness (v0.7.27) + **R30.19** side-pane highlights (next) — see CURRENT STATE above.

### SPRINT ARC (Web4RawBin, prod prod.wo-da.de:4444)
- S21 Contact Identity (9 features, v0.6.63→74) | S22 Traceability-view fixes | S23 Media preview + identity merge | S24 Traceability skills | S25 Apple DnD + WebItem + clipboard (→v0.6.96)
- **S26 FEDERATION** end-to-end (drag a scenario between RawBin servers → real local unit w/ provenance) v0.7.7
- **S27 Detail View:** R27.1 statusChecklist / R27.2 class-dedup 163→108 (conservation-gated migration) / R27.3 per-task-MD / R27.4 graph-integrity / R27.7 WebItem preview v0.7.10 (SSRF-hardened — architect's adversarial harness caught 2 LIVE bypasses the expert suite + curl both missed) / R27.8 drawer full-lifecycle
- **S28 graph-integrity foundation:** R27.5 ref-slot registry (5 axes, standing regression) / R27.6 true-dangling (open)
- **S29 Server & Dev lifecycle:** R29.1 server-lifecycle / R29.3 Server config scenario / R29.4 governance guard (only Tron increments sprints) / R29.5-8 async-mailbox
- **S30 Traceability improvement:** R30.1-5 tree/lobby/filetree + R30.6 diff-editor foundation + the R30.9→R30.19 merge arc above. BACKLOG: R30.11 scoreboard-honesty (walkChainCoverage + honorSupersededBy), R27.6 true-dangling.
- Infra history: repo MOVED to `/var/dev/Workspaces/web4x/Web4RawBin` (2cuGitHub gone). node = sys16 + vscode18 + /opt/node22; `npm start`/`test`/`ci` self-heal to node22.

### DEEP DISCIPLINE INDEX (full text in learnings.md — the durable rules; cite by number)
NOTHING is urgent, ALL is diligence (#1/#87). PO NEVER implements — delegate (#35); except self-implement when the team stalls AND Tron demands action. Scenario-first for EVERYTHING incl bugfixes (#126). Chat = a POINTER to the spec-in-the-document, never spec-in-chat (#79/#84); no anthropomorphic "pressure" excuse (#80). NEVER /compact or /clear an agent — trainer REWIND only (#53/#85). Measure, never assume; FULL-scan not sample (#88); RECONCILE conflicting measures, don't blindly defer (#89b). Tron's DEVICE is the acceptance test — instrument the real device when headless passes but his fails (#83). Version + sw.js + STATIC_SHELL bump ships to the PWA (#66/#67). Every report → immediate next delegation, never idle the team on a QA gate (#71/#86); QA is Tron's cadence, never a blocker (#68).
