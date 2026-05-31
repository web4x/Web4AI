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
