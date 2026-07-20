# ARON · REVIEW.md — provenance of doctrine & consolidation work

*All provenance lives here (never in a target agent's own files — they read native). Newest first.*

## 2026-07-20 — "DRY overall" elevated to TOP-LEVEL doctrine (TRON via robbin-po)
- **Directive:** "DRY overall." Elevate don't-fork-the-shared-mechanism from a per-incident base-skill to a first-class TRON-CMM4 doctrine principle governing ALL work — every mechanism (UI component, drawer, tree, task template, badge calc, viewer pan/zoom, …) is built ONCE, fed DATA, never forked; content differs, structure never does.
- **Whole-day throughline (TRON's examples):** drawer→reuse `/trace` flow · tree→shared `rb-trace-tree` · task-template→one canonical · badges→std parent/children refs · viewers→one shared pan/zoom base.
- **Done:** rewrote doctrine principle #7 to lead with **"DRY overall — reuse the mechanism, never fork it"** in BOTH core doctrine files (`session/agents/TRON-CMM4-doctrine.md` + `session/base-skills/tron-cmm4-doctrine.md`, kept in sync). Base-skill `dont-fork-the-shared-mechanism.md` marked as the expansion of principle #7. Doctrine divergence (source-vs-light) noted RESOLVED — agents/ now carries the light framing.
- **Propagation:** the doctrine already propagates to every SKILL via the heart-block (each SKILL reads the doctrine on boot); fed trainer to also surface "DRY overall" first-class in the fleet reading-list.
- **Reported to:** robbin-po (robbinTeam2:0.0).

## 2026-07-20 — robbin-planner retrain: don't-fork-the-shared-mechanism
- **Trigger (TRON directive via robbin-po):** "it needs to be retrained; leverage ARON and the trainer." robbin-planner FORKED the standard task template — T31.5 (concept task) got bespoke In-Progress sub-steps `req-captures / architect-designs / concept-consolidated` instead of the canonical `refinement / creating test cases / implementing / testing`.
- **Measured ground truth:** canonical structure = `scrum.pmo/sprints@Temple/templates/task-template.md` (Status → In Progress → refinement/creating test cases/implementing/testing). Confirmed by reading the template, not memory.
- **Root:** same violation TRON taught all day across THREE shared mechanisms — the drawer (reuse `/trace` flow), the tree (shared `rb-trace-tree`), the template. Generalizes: **presentation ≠ function → ONE canonical structure; content differs, structure never does** (DRY / CMM3 machine-readability).
- **Doctrine authored (single source):** `session/base-skills/dont-fork-the-shared-mechanism.md` — first-principles WHY + the not-forking mechanics + the memorized trigger.
- **Propagation:** fed to agent-trainer (baseTeam:0.0) → weave into robbin-planner's SKILL (learning `standard-task-template-no-fork`) AND add the base-skill to the fleet reading-list (F29 per-role, no bulk). ARON supplies+verifies canon; trainer owns the edits.
- **Fix for the planner's own T31.5:** re-express the concept work INSIDE the canonical phases (concept req-captures/designs/consolidation ARE refinement + implementing) — do not keep the forked structure.
- **Reported to:** robbin-po (robbinTeam2:0.0).
