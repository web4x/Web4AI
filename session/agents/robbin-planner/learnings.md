# robbin-planner Learnings — 2026-05-24

## 1. Sprint Tool Path
The sprint tool is at `/Users/Shared/Workspaces/AI/Claude/components/OOSH/dev.claude/sprint` (not on PATH for this session). Must use full path with `SPRINT_PMO_DIR` env var pointing to the project's scrum.pmo directory.

## 2. Sprint Tool Parser Bug (Sprints 1-4)
Tasks in Sprints 1-4 use hierarchical checkbox format (`- [x] Done`), but the parser's `private.sprint.get.status()` only looks for `**Status:** DONE`. Results in 35 tasks falsely showing IN PROGRESS. Logged in `scrum.pmo/known-issues.md`.

## 3. Task Files Drift from Git Reality
Team works fast — commits land but task file checkboxes aren't updated. The planner role exists specifically to catch this drift. Always cross-reference `git log` with task file status checkboxes.

## 4. Only Commit scrum.pmo Files
Other files (src/, test/, data/, package.json) may be modified by the team. Only stage and commit scrum.pmo/ files and known-issues. Never touch source code.

## 5. Hotfixes Between Tasks
Version bumps happen between tracked tasks (e.g., v0.2.23 "remove file size limits" isn't a task but is a significant change). Document these as a "Hotfixes" subsection in planning.md under the relevant phase.

## 6. Web4Articles Compliance
Task files must have: Status checkboxes, Traceability section (up/down links), Acceptance Criteria (all checked when DONE), QA Audit section. The sprint audit tool checks all of these.

## 7. PO Corrections Take Priority
When PO sends corrections (e.g., "T57 is DONE, not QA REVIEW"), update immediately. PO has ground truth from Tron QA.

## 8. Report Concisely to PO
PO wants structured reports: what changed, what's clean, what remains. Use bullet lists, not paragraphs. Include version, test count, and task completion ratios.

## 9. QA Review + Done = Tron's Gate ONLY (CRITICAL)
NEVER check QA Review or Done checkboxes during sync. These are Tron's QA gate. A git commit proves IMPLEMENTATION is done (justifies In Progress impl steps: refinement/test cases/implementing/testing), but NOT QA approval. Tron QA approval is a SEPARATE explicit commit ("Sprint N QA approved by Tron"). I made this error in b85dfa8 — checked QA Review+Done on T74-T77 from impl commits alone. PO corrected: "the board must be HONEST." When syncing implemented-but-unapproved tasks: check impl steps, leave QA Review + Done UNCHECKED. Verify Tron approval via a dedicated approval commit before marking Done.

## 10. Verify Tron QA Approval via Commit
To confirm a sprint/task is Tron-QA-approved, grep git log for "Sprint N QA approved by Tron" or "QA approv". No such commit = not approved, regardless of impl commits.

## 11. CMM4 File-Based Communication (SM directive 2026-05-26)
Communicate through task files / scrum.pmo artifacts, NOT ad-hoc messages. Write findings, status, handoffs INTO the task file (it's the single source of truth). Read task files before asking questions. otmux/hiveMind messages = SHORT pointers only ("done, read <file>"), never long status dumps. Other agents follow this too — expert/architect write Measured Evidence + Root-Cause Findings sections directly into task files (e.g. S13 T91-T93). Respect their in-flight task-file edits; don't commit another role's uncommitted work.

## 13. Discoverability — sprints AND traceability artifacts must be navigable (PO directives 2026-05-26)
Whenever standing up a new sprint, add it to BOTH (a) the README.md "Individual sprints" list and (b) `scrum.pmo/sprints/sprints.overview.md` IN THE SAME COMMIT. Tron navigates via README/`/md/`; the list had stopped at S3 so S4-S14 were invisible. The durable index `sprints.overview.md` is the canonical sprint catalog. EXTENDED: traceability artifacts must ALSO be indexed under docs — README has a "## Traceability" section linking the matrix (`scrum.pmo/traceability-matrix.md`, the browsable req→uc→puml→method→test index), the standard, and the S1/S2-9 audits; keep these current. When the PO says "push" (or repo is ahead), `git push` so origin/GitHub is current — don't leave commits local-only.

## 12. Recurring: req-eng creates task files / structure ahead of planner
req-eng repeatedly creates task files (sometimes whole sprint dirs) in their own structure/numbering — caused T81/T83 collision, T90-misplacement, and a duplicate Sprint 13 (sprint-13-stability vs my sprint-13-core-workflow-fixes). Resolution pattern: req owns requirement CONTENT (real Tron quotes) so their files are authoritative; planner owns STRUCTURE — adopt req's content, remove my scaffold, add the missing planning.md + diagrams pointer + compliance sections, reconcile T-numbers. Always check `git status -s scrum.pmo/` for untracked sibling dirs/files each cycle.

## 19. Planner uses scenarios as the planning unit (STANDING — Tron via PO 2026-05-31)
Planner's working unit transitions from hand-edited `planning.md` markdown to **scenario.json units** (the S17 scenario-unit model). Concrete deltas:

- **Read state** from `scenario/index/<5char>/<uuid>.scenario.json`, not by grepping markdown
- **Write Task units** when standing up new tasks: create `task:<uuid>.scenario.json` (with proper v4 uuid per #17) with model.status set by T133 Task FSM verbs (`task.plan()`, `task.startRefinement()`, …); regenerate planning.md as a view (T126 ViewGenerator)
- **Trust planning.md as a generated view** — don't hand-edit; edit the underlying Task units, then regenerate
- **Symbol legend (⏳📝🔧✅🧪🏁) derives from `model.status`** via T133 FSM state (no longer manually mirrored)
- **Walk chains** via `IOR.resolve()` + TraceLink (T134), not via grep
- **Standing up tasks**: create Requirement units (via T138 `captureQuote`) + Task units (via T138 `proposeTask`); TraceLink units (T134) carry the cross-references — no hand-authored chain blocks

Transition policy: existing hand-edited markdown stays valid (T128.3 active-batch migration will convert them); new work goes through scenarios. T137 is the sprint task that formally adopts this in this SKILL.md + req SKILL.md.

Anchor: T128.1 exemplar is the gold reference; T138 verbs are the toolkit; T133 FSM is the state model.

## 19. Planner USES scenarios (STANDING — Tron via PO 2026-05-31)
From now on the planner itself works inside the scenario-unit model — same as every other role. Planning.md becomes a **generated view** from Sprint/Task scenario JSON units (per T126 ViewGenerator); the planner reads/writes scenario.json as the planning unit, not the markdown directly. Hand-edited planning prose is anti-pattern going forward.

**How to apply:**
- When syncing a task status, prefer mutating `model.status` (per T133 FSM verbs) over hand-editing planning.md
- Symbol legend (⏳📝🔧✅🧪🏁) derives from `model.status` not from manual ✅→🧪 edits
- "Stand up a new task" = create `<uuid>.scenario.json` in `scenario/index/<5char>/` with `class=Task`, populate `model`, emit symlinks in `scenarios/sprints.json/`, regenerate the view
- planning.md per sprint = generated by T126 ViewGenerator from the Sprint instance's task IOR array

**Transition period:** while T128.2/T128.3 migration batches are still gated, BOTH the markdown side and the scenario unit side need maintaining. After Tron signs off T128.x, the markdown is the generated view and the units are the source of truth.

**Skills planner needs (T138 incoming):** capture-quote (verbatim Tron → requirement unit), propose-task (scenario JSON skeleton with 4-role owners), walk-chain (verify req→task→useCase→class→method→test traversal).

## 18. CMM4 = engage ALL 4 roles on every task (STANDING — Tron via PO 2026-05-31)
Every new task MUST engage all four roles in sequence:
1. **req-eng** captures the formal requirement (verbatim Tron quote, `[requirement:uuid:v4]`)
2. **architect** diagnoses root cause + designs the approach (refinement step in the task file)
3. **expert** implements per architect's design
4. **tester** verifies against AC and reports PASS/FAIL

Don't default to expert+tester only — even small UI fixes (T120/T122/T123/T130 pattern I've been doing) need architect-refinement and req-capture. Planner duty when standing up new tasks:
- Owner block reads: "robbin-architect (refinement), robbin-req (requirement), robbin-expert (impl), robbin-tester (verify)"
- Status sub-steps: refinement (architect) → creating test cases (architect/req) → implementing (expert) → testing (tester)
- Drive Plan section ordered: req → architect → expert → tester
- For genuinely-small fixes, the architect step can be short ("root cause: X, approach: Y") but it MUST exist — that's the CMM4 invariant.

S17 + T121 are the gold-standard pattern (all 4 roles formally engaged). T118/T123/T130 were faster but skipped architect-refinement formal step — those skipped CMM4.

**Apply this on every new task stand-up going forward.** Also: audit my own standing tasks for gaps and flag where architect/req engagement was bypassed.

## 17. Generate REAL v4 UUIDs for task:uuid AND requirement:uuid placeholders (STANDING — caught by T121 Phase 1, 2026-05-29)
When standing up a new task, the placeholder `[task:uuid:...]` and `[requirement:uuid:...]` MUST be proper RFC4122 v4 UUIDs. Readable-but-invalid identifiers (like `r120-detailsview-black-bg-f30a-2d4b-c1d4f7a0fae3` — non-hex chars `r`, wrong structure) get silently dropped by trace-cli and surface as C2b BLOCKERs in chain audits. My S16 T120/T121/T122 stand-ups created 3 such offenders, flagged in T121's diagnosis (7777ad6).

**Rule:** generate with `uuidgen` (macOS) or `python -c 'import uuid; print(uuid.uuid4())'` for EVERY uuid slot before writing the file. Real example shape: `bbca5514-a5c0-4a32-8be4-bf1133290c7a`. The variant nibble (4th group, first char) must be in `[89ab]`. The version nibble (3rd group, first char) must be `4`. Only `[0-9a-f]` chars.

For requirement:uuids: same v4 format. The optional "human-readable" prefix some tasks use (e.g. `r118-` style) is an anti-pattern — use a real UUID and let req-eng / matrix maintain the human label separately.

## 16. New SPA route ≠ shipped without sw.js STATIC_SHELL entry (STANDING — Tron 2026-05-29, paired with #15)
Every NEW SPA route or dynamically-loaded page MUST have its **bundle path + route path** added to `src/public/sw.js` `STATIC_SHELL` in the **same commit-set** as the version + `CACHE_NAME` bump (#15). Without that entry, the PWA can serve the route's existing HTTP-cached bundle (stale) even after `sw.js` activates the new `CACHE_NAME` — the new code never runs on that route. **Hard pre-gate** for any route-introducing task: before flipping its symbol toward "testing-done" / QA-gate, grep the impl commit-set for:
- `src/public/sw.js` modification that adds the bundle path (e.g. `/dist/trace-page-*.js`) AND the route path (e.g. `/trace`) to `STATIC_SHELL`
- AND the bump pair from #15 (`package.json` + `CACHE_NAME`)

If a route-introducing task's commits don't show STATIC_SHELL entry, **flag and block testing-done** in the report (just like #15). What counts as "route-introducing":
- new server route handler that returns a unique HTML shell (e.g. `/trace`, `/edit/<path>`, `/profile`)
- new dedicated client bundle entry (e.g. `trace-page.ts`, `edit.ts`) emitted by `build.mjs`

The check is per task; it does NOT trigger for pure server-API additions (no bundle), library/component additions (no route), or test-infra changes (#15 exception covers).

**Incident (paired with #15 incident):** S16 T108/T110-T117 (Traceability Browser + Detail Views) shipped 51812eb→61d0253 without STATIC_SHELL entry for `/trace` + the trace-page bundle. PWA served the stale bundle on /trace even after the v0.5.23 bump. Expert remediated in **bdb74ec (v0.5.24)** — added trace-page bundle to STATIC_SHELL. Pair the rules in reports: "(a) version bumped? (b) sw.js CACHE_NAME bumped? (c) STATIC_SHELL entry for any new route?"

## 15. impl-done ≠ shipped without version+sw.js bump (STANDING — Tron 2026-05-29)
A task that's been "implemented" is NOT actually shipped to Tron's device until BOTH:
- **(a)** `package.json` `"version"` is bumped, AND
- **(b)** `src/public/sw.js` CACHE_NAME is bumped (auto-stamped from package.json by `build.mjs`, but verify the built sw.js shows the new version)
…in the SAME commit-set as the impl. Without both, the PWA update banner does not fire and Tron's iPhone stays on the old code — the fix never reaches the device. Hard check before symbol ✅→🧪 (and certainly before the QA gate): grep the impl commit-set for a package.json version bump; if absent, flag and report. **S16 incident (2026-05-29):** T110-T117 shipped 51812eb→61d0253 without a bump; PO/expert caught it after Tron's flag. Add an explicit "version bumped + sw.js cache" line to every task's AC + DoD (template already has it). When syncing 📝→✅, the planner's check is: (i) impl commit present? (ii) version bump present in the same commit-set? Both must be true.

## 14. Emoji-prefix readability pattern in planning.md (STANDING — Tron 2026-05-28)
Tron flagged: planning.md looked unprogressed because the single `[ ]` per task line only reflects Tron's Done gate (empty by design). FIX: add an at-a-glance emoji prefix to every task line in the task list. Standing pattern for every new sprint AND back-propagation:

**Legend block** — insert once at the top of the `## Task List` section of each planning.md:
> **Progress legend** (at-a-glance per task; `[ ]` stays = Tron's Done gate):
> ⏳ planned · 📝 designed (refinement-done) · 🔧 implementing · ✅ impl-shipped · 🧪 testing · 🏁 Tron-QA-done

**Per-task prefix** — `- [ ] <emoji> [Txx: Title](./task-xx-...)` where <emoji> reflects current state:
- ⏳ planned (no work started)
- 📝 designed (architect refinement done, awaiting impl)
- 🔧 implementing (impl in progress, not yet shipped)
- ✅ impl-shipped (impl committed, tester verification pending)
- 🧪 testing (tester verified PASS, awaiting Tron QA — OR verify task whose verify PASSED)
- 🏁 Tron-QA-done (Tron explicitly QA-approved via commit)

**Rules:**
- KEEP `[ ]` Done-gate semantic untouched — only flips to `[x]` on Tron's explicit "QA approved by Tron" commit.
- Apply to every NEW sprint at planning.md creation time.
- Maintain symbols on every monitoring cycle: when a task transitions state, update its prefix. Treat symbol drift as a sync target (📝→✅ on impl commit, ✅→🧪 on tester PASS, 🧪→🏁 on Tron QA).
- Sprint Totals lines should match the symbol counts.
- First applied: ecce49e (S10-S16 sweep). Initial application to S16 in a0df3f8.

## 20. Architect concurrent file creation — duplicate reconcile pattern (PO learning #12 applied)
When planner stands up a task, architect/req-eng MAY create a same-scope file concurrently with a DIFFERENT filename + own (often non-v4) uuid. Examples: T164 (architect's task-164-dirty-model-name-remigration.md vs my close-out scaffold), T172 (architect's task-172-strict-direction-audit-massive-orphans.md vs my chain-direction scaffold). Pattern:
1. Adopt architect's content as authoritative (their diagnosis + inventory is sharper than my speculative scaffold)
2. Replace fake uuids (`a8b9c0d1-…-164000000001`, `a7b8c9d0-…-172000000001`) with planner's real v4 from uuidgen (learning #17)
3. Add Web4Articles-required Subtasks + QA Audit sections (audit failures otherwise)
4. Delete my scaffold; update planning.md to architect's filename
5. Fold any PO amendments I introduced (R-H.2 atomic-split, AC10 matrix refresh, etc.) into the architect's file
Don't fight over who created it first — architect's content is more accurate; my structure is required for audit compliance.

## 21. Wrong metric pattern — T171's "50 untraced" was actually counting back-refs (PO 2026-06-03)
T169 audit reported "50/296 untraced" but the metric was wrong: it counted units with empty `requirements[]` (back-ref field, which is CORRECT per T159/B18 forward-only — should be empty). The right metric is **forward-walk reachability from Requirement roots**. T172's architect ran that audit: 239/296 orphans (81%), not 50. Lesson: when an audit reports a clean-sounding number, verify it measures what the directive actually demands. Tron R-F = "ZERO untraced" via the canonical forward chain — T171's 50 wasn't the right denominator. T172 (3fefc68) achieved 238/238 (100%) chain reachability via 5-step forward-ref population.

## 22. Chain-direction is clean separately from chain-reachability (architect T172)
Audit-too-lenient was one hypothesis for live /trace orphans. Architect ran strict-direction audit FIRST: every edge follows T168 canonical order; zero reverse edges. Direction was already clean. The real gap was forward-ref population — arrays were empty at most hops, not pointing the wrong way. When diagnosing audit-vs-display divergence, separate "direction wrong" from "data missing" — they're orthogonal problems with different fixes.

## 23. T172 5-step forward-ref population recipe (architect, expert 3fefc68)
The forward-ref population must run at every chain hop, not just one:
- Step 0: `Sprint.requirements[]` (sprint owns reqs)
- Step 1: `Requirement.tasks[]` (sprint-membership matching when requirements.md lacks explicit bullets)
- Step 2: `Task.useCases[]` (UC ownerIor → task/sprint)
- Step 3: `UseCase.classes[]` (matrix Impl column or UC's chain section)
- Step 4: `Class.methods[]` (sourcePath matching)
- Step 5: `Method.implementations[]` + `Implementation.tests[]` (impl:uuid:/test:uuid: annotations in source/test files)
T160 only did Step 1 partially (2/100 Tasks linked). T172 completed all 5 → 238/238 reachability. Sprints (orphan-by-design containers) + TraceLinks (edge metadata) properly excluded via allowlist.

## 24. Rule-pair exemption categories (expert self-noted, confirmed by PO acceptance)
Three expert commits this cycle were correctly rule-pair exempt — they self-noted "no version bump (X only)":
- T170 (afe969e): infra-only — CI gate scripts + npm script; same-cycle T167 already bumped
- T171 (7c84fe0): scenario data only, no user surface
- T172 (3fefc68): data-only (forward-ref population, no user surface)
Rule-pair (a)+(b) applies to **user-facing surface** changes only. Data migrations, infra scripts, audit tooling without UI impact = exempt. Expert noting the exemption + reason in the commit message is sufficient; planner accepts.

## 25. SM context warning protocol (SM directive 2026-06-03)
At 78% context, SM (TRONinterface:0.1) issued urgent save-before-rewind directive. Pattern: write context.md + learnings.md immediately, commit, then resume work. Agent-trainer rewinds at 80%. Save NOW means before any further task work — even active PO directives wait (PO understands the loop will rewind and re-fire). For planner: context.md must include current commit chain, sprint state, IMMEDIATE TODO with task numbers + uuids generated for in-flight stand-ups, so post-rewind work can resume from the saved state.

## 26. ALWAYS pre-check for existing task files before scaffolding (planner-discipline; 2026-06-03 incident)
PO directed "STAND UP T174 covering R-M1-M4 (or split per planner's call)". I scaffolded a SPLIT (T174+T175) without first checking that architect `483d1587` had already shipped a CONSOLIDATED T174 covering all 4 atoms — landed 1 commit BEFORE my scaffold ea88de12. Resulting duplicate forced a reconcile (490daed1: delete my 2 scaffolds, adopt architect's bundle, fix fake uuid + add Subtasks/QA Audit).

**Pre-flight checklist before EVERY new task stand-up (planner-first or otherwise):**
1. `git status -s scrum.pmo/` — uncommitted concurrent work?
2. `ls scrum.pmo/sprints/<sprint>/task-<N>*` — does the slot exist?
3. `git log --oneline -10 scrum.pmo/sprints/<sprint>/` — recent commits in this sprint?
4. `git log --grep="T<N>\|R-<x>"` — has another role already shipped under this banner?

Only AFTER these checks: scaffold + commit. Learning #12 ("req-eng creates files ahead") + #20 (architect concurrent) already pointed at this — but I still rushed. The pre-flight is a HARD planner discipline.

**Also:** when invoking otmux send from Bash, single-quote the message OR escape backticks — backtick-wrapped commit hashes get shell-expanded, garbling the report (incident: same 2026-06-03 PO send dropped 3 hashes, required a follow-up correction).

**Race-window addendum (T175 incident 2026-06-03):** Pre-flight CAN be clean at scan time but architect/req commits a same-scope file BETWEEN my pre-flight and my own commit (T175 incident: architect `fe6d2289` landed during my scaffold write). Mitigations:
- Keep stand-up scaffold writes SHORT (minimize race window)
- Re-run `ls task-<N>*` IMMEDIATELY before `git add` — last-chance check
- Use architect's filename if they shipped first (architect's name typically reflects their richer design content; planner's pre-seed name was a placeholder)
- Reconcile per learning #20 the same way regardless (adopt content, replace fake uuid, add structural compliance)
- Surface any PO corrections the architect captured that I missed (T175: "Traceability EXTENDS Tree" — opposite of PO's initial seed hint)

## 27. STRICT VERIFY BAR — "metrics-pass-but-gapped" prevention (PO directive 2026-06-03)

Codified after the T172 incident: 238/238 unit reachability looked clean, but 44 Tests still had "chain gap" because UC/Class/Method/Impl/Test forward arrays were empty. The metric counted units, not chain depth. PO direction: a task or sprint is **not "verified"** until BOTH of the following are asserted:

1. **FULL semantic chain — per-Test 7-hop reachability.** Every Test instance MUST be reachable from a Requirement root via the LOCKED chain `requirement → task → usecase(s) → class → method → implementation → test`. Audit must iterate every Test and assert `walkUp(test).length === 7` with the walk ending at `chainPosition.above === null`. Node-count proxies (e.g. "238/238 units") do NOT satisfy.
2. **LIVE user experience reproduction (headless).** Tester reproduces the actual user-visible behaviour on the running app (headless Playwright on T100), not just unit-test counts. "All unit tests green" is necessary but not sufficient.

**CI gate:** T170's `trace:audit:strict` must be extended (T178 lands data first; T170-follow-on adds the depth assertion) to FAIL on any Test with depth < 7-hop reachable, reporting per-Test depth + offending UUIDs.

**Standards anchor:** [scrum.pmo/standards/traceability-standard.md](../../../../../Workspaces/2cuGitHub/Web4RawBin/scrum.pmo/standards/traceability-standard.md) "Strict Verify Bar" section.

**Apply to:** every task closure that involves traceability-chain claims. When PO says "tester verified" and the task touches the chain, BEFORE flipping 🧪/🏁 check: did tester prove per-Test 7-hop walk, or did they only check node counts / unit-test totals? If only counts → push back, ask for the 7-hop walk. (The b85dfa8 incident pattern but for verification metrics rather than gate boxes.)
