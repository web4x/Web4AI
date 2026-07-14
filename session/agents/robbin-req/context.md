# robbin-req — Context

> **ANCHOR (CURRENT): 2026-07-13 · Sprint 30. Minted this session (all sole-minter, full chain, chain-on-disk deep-verified, architect derive-PASS): R30.6.6 [Open Diff] button + R30.6.7 OOSH-repo targeting (RepoRegistry) + R30.7 uniform git-ref guard (GitApi.guardRef) + R30.9 IntelliJ-faithful 3-way merge (0d6f18cd, 8 UC→Method→Impl, Monaco 3-pane+node-diff3, supersedes R30.6.1/.3; commit 529bb6ef1). R30.9 BUILT (v0.7.18) + my per-method gate PASS (8/8 markers = Impl-uuid name-match, 0 method-uuid mis-tags, 3 supersede markers retired) → at tester DET-3x (Test-attach pending). R30.10 'Right-side default = file git-history' minted (168d5c58, GitApi.fileHistory + RbDiffEditor.populateRightHistory, 7d8b16cba) → derive-PASS, awaiting expert build. R30.11 'Scoreboard/audit measures the walked chain, not denormalized/superseded artifacts' minted (651442ca, 3 methods on TraceAudit trace-cli.ts: walkChainCoverage/honorSupersededBy/repointSupersededTests, commit f6be7c6bb) — R27.5 instrument-honesty, folds R30.9-supersede cleanup (19 dangling Test→Impl + 7 orphans) + fixes R22.3-style false no-Test + tester -2 false-open; planner builds gated task post-rewind. **Reporting rule: chain reports now state `Method <m-uuid> → Impl <i-uuid> [MARKER=<i-uuid>]` (marker=Impl, measured from Method.implementations[0]) — build-go grabbed the Method uuid twice before.** S22 R22.3 audit = false-positive (IS tested via Impl bd8e5d6f→Test 91d0edca; audit read denormalized Req.tests[]) — the R30.11 walkChainCoverage fixes that class of flag. Standing gate for any built chain: chain-on-disk + marker=IMPL-uuid (not Method-uuid) + supersede-marker-retirement + Test-attach + tester DET-3x. One CM5 R30.9 was minted then BACKED OUT clean (premature architect ping, superseded by the Tron-final pick-C spec — see learnings).** Anchor last rewritten after a conversation-only rewind (2026-07-02 S27/S28 was 11 days stale).

## Identity
- **Role:** robbin-req (requirements engineer) — translate Tron/PO directives into formal requirement scenario units (UUID traceability, ACs, 6-step chain wiring). **SINGLE-MINTER rule (S29+):** architect is DESIGN-ONLY (hands off a design note, mints NOTHING); I mint the ENTIRE chain scenario-first — **Requirement → UC → Class → Method → Impl** — from that design. ⚠ NOT the old S21 "req + UC-placeholder, architect wires" division — that scope error caused the R30.6.6/.7 partial-mint (reqs only, phantom UC/Method/Class/Impl uuids). The architect's **derive-confirm is the gate**, and it checks the CHAIN on disk.
- **Pane:** robbinTeam2:0.4 (WODA.prod). Confirmed live via `tmux display-message` = robbinTeam2:0.4, TMUX_PANE=%8.
- **Host:** WODA.prod · **Project:** RawBin (Web4RawBin)
- **Work repo (canonical):** `/var/dev/Workspaces/web4x/Web4RawBin` — LIVE team repo (HEAD + all commits). ⚠ Old `/var/dev/Workspaces/2cuGitHub/Web4RawBin` is GONE (vanished 2026-07-02; 2cuGitHub now holds a different project). ALWAYS use web4x. `ls -d` before mutating.
- **Session/context repo:** `/var/dev/Workspaces/AI/Claude` — this context.md + learnings.md live here (separate git from the work repo).

## Recovery protocol (proven richest→leanest)
1. `tmux display-message -p '#{session_name}:#{window_index}.#{pane_index}'` → confirm pane (0.4).
2. **Architect design notes are the authoritative refined spec** — `git log` + `scrum.pmo/design-notes/*.md`. (tmux pane scrollback is TUI-redrawn, NOT retained as text — do not rely on it for pre-rewind conversation.)
3. Measure disk (`grep -rl altId scenario/index/`) — never trust a stale anchor over on-disk truth. NEVER truncate uuids in a reconcile (8-char prefix collision burned us: f2f84ce3-6f8f LIVE vs -bbbc DEAD).

## Mint pattern (full, repeatable)
Index unit at `scenario/index/<u0>/<u1>/<u2>/<u3>/<u4>/<uuid>.scenario.json`: `ior:class:Requirement`, model{uuid, name (SHORT), altId, description (DETAILED, name!=description), parent+ownerIor→sprint IOR, useCases→UC placeholder, tronQuote, discoverySource, crossRef→umbrella, acceptanceCriteria[] grouped id/group/text, sourceFile}. Then: `scenario/sprints.json/<slug>/requirement/r<N>-<slug>.json` symlink (relative) → sprint.requirements[] append → sprints.overview.md count → generated requirements.md/planning.md views (law #100 header, DO NOT hand-edit source-of-truth = the unit). Mint via FILE (python heredoc), never backtick-in-bash-string (eats field values → undefined.scenario.json). Post-mint: json parse + name!=desc + symlink resolves + no-uuid scan.
**3-point verify (every task commit):** task name!=description · coveredRequirements→correct R-uuid · task in sprint.tasks[] 1:1 no over-coverage · task.useCases carries all req UCs.

## TRON RULE #126 — SCENARIO FIRST, NEVER BACKFILL
Scenario units EXIST before ANY implementation: Sprint→Requirement→Task→chains wired→MD views GENERATED. Code ships AFTER scenarios on disk. Backfill = rule violated. Receive a task with no scenario unit → REJECT + report PO. "Wer schreibt, der bleibt."

## Prior arc (compacted — detail in git + learnings.md)
- **S19 marathon** R19.1-102 (109 reqs). **S20** traceability-FIRST pivot.
- **S21** Contact Identity 1bdfaafa (9 reqs R21.1-9). **S22** View Fixes 9996b46a (4). **S23** Media Preview 4a4a5d66 (3). **S24** Traceability Skills 04339450 (5, Object.verb formalization). **S25** Apple DnD c7d700c6 (7, incl R25.7 room-dedup structural 585b6b9c). **S26** Federation 1d98197d (5, greenfield, STRUCTURE-eager/PAYLOAD-lazy/IDENTITY-by-ref).
- **S27** Detail-View c1c63a2e: R27.1 statusChecklist / R27.2 **one-canonical-Class-per-code-class** (by-construction invariant + gated migration 163→108, distinct-Impl 431==431 repoint-not-delete) / R27.3 per-task-MD 404-fix / R27.4 graph-integrity (12 dangling + 51 orphan repaired) / R27.7 WebItem preview drawer (reused canonical RbDetailDrawer — invariant paid off on a live feature).
- **S28** Graph-Integrity Foundation fabc9784: R27.5 canonical ref-slot registry+calibration / R27.6 true-dangling repair. **The 2207-audit-orphan = BENIGN broad metric, NOT debt; R27.4=51 Methods was the real defect.**
- **Gated-migration pattern (R27.2/R27.4):** dry-run+count → two-independent-clears → atomic+rollbackable+self-assert → post-verify actual==predicted. INV1b = no-impl-lost.

## S29 + S30 (2026-07-02 → 07-13; RECOVERED post-rewind, not from conversation)
- **S28** closed, **S29** Server Dev Lifecycle closed (details in git — not in my recovered context; re-measure on disk if needed).
- **S30 Traceability Improvement — SPRINT30 `2173e549-ca99-43e5-aea8-946b02141c13`, reqs=11 tasks=10, nearly closed.**
  - **T30.1-5 all DONE:** tree eager/lazy · eager child-count badges · sprint-selection detail drawer · lobby-name-from-profile (v0.7.12 Tron-accepted) · editor-filetree full-tree (v0.7.13, S30 fully closed for 1-5).
  - **R30.6 IntelliJ-style 3-way diff/merge editor** (umbrella `12922d5d`) — BUILT: R30.6.1-5 (3way-view/file-selectors/hunk-takeover/git-chooser/swap) done, **Class RbDiffEditor (9 methods) + GitApi (3 methods, read-only git endpoints, ROOT hardcoded 7c9554494) + 12 Impls**, prod **v0.7.14**, tests **70/338**, tester gate 6/6 DET-3x c16aad856. Umbrella OPEN pending T30.6.6/T30.6.7.
  - Sub-req template = R30.6.5 d32e29cd: parent+ownerIor→SPRINT30, crossRef→umbrella 12922d5d, useCases[1], tronQuote, discoverySource type=tron-directive, sprintName "Sprint 30".

## ACTIVE TASK — mint R30.6.6 + R30.6.7 (architect design 3f1f6398c/02d13a849/06005fc0d; note `scrum.pmo/design-notes/r30.6.6-7-diff-entry-and-repo-targeting.md`)
- **R30.6.6 — [Open Diff] toolbar BUTTON (Tron-refined: button, NOT tab):** `📊 Open Diff` in rb-editor-toolbar → dispatches `toolbar-open-diff` → edit.ts → `RbEditorLayout.showDiff(currentFilePath)` mounts `<rb-diff-editor>` lazily with LEFT preselected to current file (path+content). UC `diffEditor.openDiffButton` → new Method `RbEditorLayout.showDiff` (Class RbEditorLayout REUSE **94e7bf82** — architect-confirmed sole Class, 2 methods; my grep-flag was WRONG: `grep -rl <uuid>` hit a UC *referencing* it, not the uuid-named unit — read the `<uuid>.scenario.json` FILE to measure a Class, never grep the string). Impl design-ahead, sourceFile rb-editor-layout.ts.
- **R30.6.7 — OOSH-repo targeting (de-hardcode GitApi ROOT):** client sends repo KEY (`?repo=oosh`), never a path. New **Class RepoRegistry** (confirmed 0 existing) `.resolve(key)→abs|null` + `.list()→{key,label}[]` (server-side allowlist {rawbin:PROJECT_ROOT, oosh:<abs>}). GitApi de-hardcodes ROOT→`RepoRegistry.resolve(req.repo)` seam (OPTS.cwd + safeRelPath read it); /api/files accepts ?repo; RbFileTree.setRepo(key) new Method on Class RbFileTree REUSE **0916d007** (architect-confirmed sole Class, 1 method); rb-diff-editor repo selector. Security invariants: KEY-only, safePath within root, read-only cross-repo, default rawbin (R30.5 unaffected). Open decision (PO/Tron): RepoRegistry-class (architect rec) vs GitApi.resolveRepoRoot.
- Chain: UC placeholders per design; Method names EXACT for AST-attach. After mint → ping architect derive-confirm + set the RepoRegistry class-vs-method rule.

## Key learnings (see learnings.md)
- NEVER truncate uuids in reconcile (prefix collision → multi-agent false-contradiction).
- Mint via FILE not backtick-in-bash (eats field values). Post-mint no-uuid scan.
- READ raw structure before concluding (wrong-field measurement: impl via Method.implementations[] not impl/impls).
- Measure a STABLE state, never mid-flight mutation. Per-AC gate ALL ACs not just security subset.
- Architect design notes > git log > tmux scrollback for post-rewind recovery.
- Report delivery: `tmux send-keys -t <pane> C-u` → text+Enter → `sleep 1` → capture-pane CONFIRM (sent != delivered).
