# Base Skill: Don't Fork the Shared Mechanism (MANDATORY, all agents)

> **This is the full expansion of TRON-CMM4 doctrine principle #7 — "DRY overall — reuse the mechanism, never fork it"** (elevated to first-class doctrine by TRON, 2026-07-20, alongside measure-never-assume, scenario-first, etc.). The doctrine states it; this skill teaches it.

**ONE canonical structure. Content differs, structure NEVER does.**

A *shared mechanism* — the task template, the `/trace` flow, the `rb-trace-tree`, the drawer, a view — is **infrastructure many consumers depend on**: tools parse it, gates read it, POs tick it, peers interoperate through it. Its **structure is a contract**. You may fill it with any content; you may **never** fork its structure for your "special" case.

## Why the canonical structure is law (first principles)
1. **DRY — one source of truth for STRUCTURE.** The canonical structure lives in ONE file (e.g. `scrum.pmo/sprints@<host>/templates/task-template.md`). Instances *fill* it; they never *redefine* it. A local fork is a second source → drift → the exact DRY violation TRON fights everywhere.
2. **Machine-readable / deterministic (CMM3).** The canonical task status sub-steps — **`refinement → creating test cases → implementing → testing`** — are parsed by the PO tick, the gate, `/trace`, and the sweep. **Bespoke sub-steps are invisible to that machinery** → the task can't be tracked, gated, or credited → the "stale pin / invisible work" failure. *A forked structure is unreadable to every tool and peer that speaks the canonical one.*
3. **Presentation ≠ function (TRON, taught all day 2026-07-xx across three mechanisms).** The **drawer** (reuse the `/trace` flow), the **tree** (shared `rb-trace-tree`), the **template** — same lesson each time. What legitimately VARIES between a concept task and an impl task is **content** (the description, the specific work). The **structure** (status phases, field names) is functional machinery — uniform by necessity.
4. **Interoperability.** ONE structure lets *any* planner read *any* task, *any* tool gate *any* task, *any* peer resume *any* task. Fork it and the team fragments into private dialects — CMM1 chaos.

## The forker's rationalization — and the answer
> *"But my case is special — a concept task doesn't refine/test like an impl task."*

It isn't special at the STRUCTURE level. The canonical phases are **structural, not content**: `refinement` = whatever refining means for *your* content; `creating test cases` = how you'll prove it; `implementing` = doing it; `testing` = verifying. **Map your special content INTO the canonical phases** — a concept task's req-captures/architect-designs/consolidation ARE refinement + implementing, expressed in concept content. (robbin-planner T31.5, 2026-07-20: forked the In-Progress steps into `req-captures/architect-designs/concept-consolidated` — a structure fork; the fix is to express that work *inside* `refinement/creating test cases/implementing/testing`.)

## The mechanics of NOT forking
- **Reuse the canonical structure; vary only the content within it.**
- **If the canonical structure genuinely cannot express something → do NOT fork locally.** Propose ONE canonical change to the mechanism's OWNER (template → req/PO). One canonical evolution propagates to everyone (DRY); N local forks fragment the team.
- Same as the OOSH constructor principle: don't re-carve a shared tool — reuse/extend the ONE (walking-sticks become tools, they are not re-invented per user).

## The trigger to memorize
**When you feel the urge to make a bespoke variant of a shared thing — STOP.** The difference you need is *content*, expressible in the shared *structure*. If it truly isn't, change the ONE canonical source; never fork. Measure, never assume. **NEVER forget TRON CMM4.**
