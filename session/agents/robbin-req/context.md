# robbin-req — Context

> **ANCHOR (2026-07-14, compacted from oversized blob): Sprint 30, 25 reqs, all on disk + visible in requirements.md.** The R30.9→R30.16 IntelliJ diff/merge-editor arc is CLOSED + 17/17 genuinely behavior-tested on origin/main (one canonical Class RbDiffEditor 18165081, 9→25 methods, R27.2 invariant held). Recent: R30.17 (merge functional fixes) built + retired-clean; R30.18 (requirements.md=generated-view) awaits EXPERT BUILD. R30.11 BUILT (99be5b51a, 0-false-open) — expert built it as ONE method Chain.implRetiredBySupersede @ skill-classes.ts (Class Chain 0bbe576f), NOT the 3 I minted on TraceAudit/trace-cli.ts; I RE-POINTED the unit to reality (Method 9c6904f7→Chain.implRetiredBySupersede moved to Chain; Impl 7f15c149 sourceFile→skill-classes.ts; UC→Chain) + minted Test 4ad7879f (commit 1d4d1d804); tester wiring reverse → board 0-false-open. COLLAPSED (PO-approved, efa67b937): retired the 2 PHANTOM methods (honorSupersededBy 8c1e4637 + repointSupersededTests cb13e4d0, NO code markers — measured; NOT walkChainCoverage=the real one I renamed) — deleted 6 units, 0 external refs. This ALSO fixed a mini-false-open the tester caught (R30.11 had resolved through the phantom 8c1e4637); R30.11 now resolves ONLY through the built 7f15c149→Test 4ad7879f. CLOSED + verified both-directions on origin/main (b037bd83d wiring landed); ★ BOARD 0-FALSE-OPEN (tester 82/351, whole impl-supersede class cleared incl R30.6.1/6.3/R30.10 — the by-construction scoreboard-honesty fix landed). Only remaining R30.x open = R30.18 test (separate build). R30.20 drawer mode-aware close MINTED (ecb4e62a, PO-produced spec / architect rate-limited): NEW Method RbDetailDrawer.closeOrReturn d0475c8f [MARKER=65f43714] on RbDetailDrawer d86af73d REUSE 37→38m, fixes R27.8 (X=minimize-universal broke in-room X→chat); detection this.chatPanel!==null=in-room; 6 ACs all cases; commit a442d0975; requirements.md same-commit. Awaiting expert build (with version-bump) → my per-method gate. SPRINT30=26. R30.19 (3-pane change blocks, renderSideChangeBlocks ef5a4ff2/Impl eb994dcd) CLOSED both-directions on origin/main (Test a3ad0177, 78/351) — so the WHOLE IntelliJ diff/merge-editor line R30.9-R30.19 is chain-complete-to-Test on origin. Scoreboard: R30.10 + R30.6.1/6.3 = the impl-level-supersede class, EXPECTED-until-R30.11-builds (pre-existing, honest, not a new gap).

## Identity
- **robbin-req** (requirements engineer), pane **robbinTeam2:0.4**, host **WODA.prod**, project **RawBin**.
- **Work repo:** `/var/dev/Workspaces/web4x/Web4RawBin` (old 2cuGitHub GONE). **Session repo:** `/var/dev/Workspaces/AI/Claude` (this context+learnings, separate git).
- **SINGLE-MINTER rule (S29+):** architect is DESIGN-ONLY (design note, mints nothing); I mint the ENTIRE chain scenario-first — **Req→UC→Class→Method→Impl (→Test)** — from that design. NOT the old S21 "req+UC-placeholder" division.

## Recovery protocol (post-rewind)
1. `tmux display-message -p '#{session_name}:#{window_index}.#{pane_index}'` → confirm pane 0.4.
2. **Authoritative source = architect design notes** (`scrum.pmo/design-notes/*.md`) + git log. tmux scrollback is TUI-redrawn, NOT retained text.
3. Measure disk (`grep -rl altId scenario/index/`); NEVER trust a stale anchor over on-disk truth.

## Mint pattern (full)
Index unit `scenario/index/<u0..u4>/<uuid>.scenario.json`: `ior:class:Requirement`, model{uuid, name SHORT, altId, description DETAILED (name!=desc), parent+ownerIor→sprint, useCases→UC, tronQuote, discoverySource, crossRef, acceptanceCriteria[] grouped, sourceFile}. Then symlink `scenario/sprints.json/<slug>/requirement/` → sprint.requirements[] → sprints.overview.md → **write the requirements.md block (HAND-MAINTAINED, see below)**. Mint via FILE (python heredoc/temp), never backtick-in-bash (eats field values). Post: json parse + name!=desc + symlink resolves.
**Node/tooling:** system node=v16 (too old for tsx); use `/opt/node22/bin/node --import tsx scripts/<x>.ts`. generate-sprint-md is SprintViewGenerator (93f9afc7) — emits planning.md + task-MDs from TASK units.

## Verify pattern (banked hard — measure the artifact you claim)
- **3-point** (task): name!=desc · coveredRequirements→R-uuid · in sprint.tasks[] 1:1.
- **chain-on-disk** BEFORE any "ready" report: walk Req→UC→Class→Method→Impl by LOADING each `<uuid>.scenario.json`; assert reverse links (Method.ownerIor→Class + in Class.methods[]; Impl.ownerIor→Method).
- **marker=IMPL-uuid** (not Method): `[impl:uuid:X]` in code = the Impl uuid (Method.implementations[0]), never the Method uuid. Report format: `Method <m-uuid> → Impl <i-uuid> [MARKER=<i-uuid>]`.
- **chain-to-Test on origin/main**: mint Test unit adopting the tester's marker uuid (measure from code, don't invent) → tester wires reverse Impl.tests[] → BOTH pushed → I re-verify `git show origin/main:<path>` (fresh-clone view), not working tree.
- **Suspect the instrument first**: my verifier bugs (ownerIor is unit-TOP-level not model; grep-uuid finds referencers not the uuid-named unit; ==N AC-count hardcodes). Read the raw unit before trusting a scripted flag.

## TRON RULE #126 — SCENARIO FIRST, NEVER BACKFILL
Units EXIST before code: Sprint→Req→Task→chains→MD views. Receive a task with no unit → REJECT + report PO. "Wer schreibt, der bleibt."

## ★ requirements.md is HAND-MAINTAINED (Tron caught this 2026-07-14)
generate-sprint-md emits planning.md + task-MDs ONLY, NOT requirements.md (its line-6 WARNs "hand-maintained until R28.1"). I minted R30.6-R30.19 all session but skipped requirements.md → plannings INVISIBLE in the app. FIXED S30 (all 25 blocks from units, e190db49f). **INTERIM RULE: write the requirements.md block SAME-COMMIT as every req mint.** DURABLE FIX = R30.18 (requirements.md=generated-view, SprintViewGenerator.generateRequirementsMd, awaits build). Meta-lesson: verify the surface the USER reads, not just the chain-on-disk.

## Prior arc (detail in git + learnings.md)
S19-S26: R19.1-102, contact identity, media, traceability skills, Apple DnD (R25.7 room-dedup), Federation. **S27** c1c63a2e: R27.2 one-canonical-Class-per-code-class (by-construction invariant + gated migration 163→108) / R27.4 graph-integrity / R27.7 WebItem. **S28** graph-integrity foundation (R27.5/R27.6). Gated-migration pattern: dry-run+count → two-independent-clears → atomic+rollback → post-verify actual==predicted.

## S30 — the IntelliJ diff/merge-editor arc (Class RbDiffEditor 18165081, 25 methods)
- **R30.9** 3-way base-aware merge (Monaco 3-pane + node-diff3, supersedes R30.6.1/.3) · **R30.10** fileHistory/populateRightHistory · **R30.12** 2-way take-over · **R30.13** inter-pane gutters + ribbons · **R30.16** line-alignment + center-blocks + scroll-to-last-line · all CLOSED to Test both-directions on origin/main.
- **R30.14** SW auto-update (Class ServiceWorker 8bd3bd6b) CLOSED. **R30.7** GitApi.guardRef. **R30.11** scoreboard honorSupersededBy (awaits build). **R30.15** right-meaningful-default (superseded by R30.17). **R30.17** merge functional fixes (populateLeftHistory NEW + 4 impl-edits; superseded populateRightHistory right→left; retired clean). **R30.18** requirements.md=generated-view. **R30.19** 3-pane source change-blocks (renderSideChangeBlocks NEW).
- **Test-retirement pattern (R30.17):** one-uuid=one-identity — retire (don't repoint) a test whose behavior is superseded; annotate the retired Test supersededBy the replacement so it's retired-not-open; a req is req-level-supersedable ONLY if it has NO live non-superseded chain (else T-TOOL-2 @583 inflation — e.g. R30.10 keeps its live fileHistory chain).
- **Function-first gates (R30.17 lesson):** tester gate asserts the merge MUTATES (click take-arrow → CENTER content changes), not that a button renders. shared-impl ≠ behavior-tested.

## Key learnings (full text in learnings.md)
chain-report MARKER=Impl-uuid · adopt-downstream-marker-uuid (measure, don't invent) · requirements.md hand-maintained · a mint-go can be retracted (back out surgically, not git-checkout) · git add -A re-bit me → explicit file list from mint script · design-note > looser PO wording · measure a Class by its uuid-named FILE not grep-the-string · correct-by-construction on my own tooling.
