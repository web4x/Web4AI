# Base Skill: STATUS BY CONSTRUCTION — the pin/status is updated BY THE ACTION, never remembered (MANDATORY, all agents)

> **TRON, 2026-09-13 (verbatim, via PO):** *"it was the skill agent responsibility to make the pins current and statuses a part of the routine and skills of every agent in every action... using the pin updating skills."* This skill is that routine. **Role SKILLs POINT here, never copy** ([[dont-fork-the-shared-mechanism]]). It is a durable weave, not a pane message — a lesson that lives only in a message un-adopts at the next rewind ([[durable-adoption-not-a-pane-message]]).

## The law
**A status kept current by REMEMBERING is CONVENTION; a status updated BY THE ACTION is CONSTRUCTION.** Convention drifts (someone forgets, a rewind wipes the intent); construction cannot (the update is inseparable from the act that caused it). We enforced construction-over-convention on protections all day and never applied it to our own board — that is the whole of this correction.

## Why (the evidence — all ONE root: a status BELIEVED, not updated-as-part-of-the-action)
1. **Stale pin as "live work":** the CURRENT pin showed a task parked since 2026-08-29 as live for WEEKS while the real in-flight task was invisible — asked what he was driving, the pin could not answer.
2. **Believed, not evidenced QA:** T37.20 sat on Tron's ACCEPT queue as accept-ready while its own AC-A1 visibly FAILED on his device.
3. **Stale bug status:** a bug unit still read REPRO-CONFIRMED-PRE-FIX after the fix shipped, was signed, gated, and prod-verified.
4. **No ranking field:** INC-7 had NO `lastAdvancedAt`, so genuine in-flight work ranked LAST behind stale work.

## The routine (every agent, in EVERY action — not bookkeeping afterwards)
- **(a) Advancing work STAMPS `lastAdvancedAt` at the SEAM** — the same act that advances the work writes the timestamp; ranking depends on it (case 4).
- **(b) A status transition is PART OF THE ACT that caused it** (`Planned → In Progress → QA Review`), never a later sync. You do the work → the transition is written in that same step (case 1, 3).
- **(c) An agent whose action makes the pin STALE re-points it or FLAGS it — never proceeds silently.** If what you just did moved the real work elsewhere, the pin is now lying; fix or flag before continuing (case 1).
- **(d) QA-Review means EVIDENCED, not believed.** A row reaches Tron's accept queue ONLY when its ACs are evidenced on the SURFACE HE WILL LOOK AT — never on belief, never worktree-green (case 2). A gate that cannot observe → FLAG, don't mark ([[report-is-observation-not-gate]], process-canon §2 no-hollow-greens).

## Use the EXISTING mechanism — check-before-create, NEVER a parallel updater
The MECHANISM already exists; this routine only makes every agent USE it in every action. POINT to it, never fork it:
- **`session/tools/seam-tick.ts`** — the SINGLE status writer: `statusNext → UnitController.apply → TaskPolicy` ticks the checklist, `deriveStatusEnum` DERIVES status (never a literal). HARD-REFUSES Done (Tron's QA act). Evidence-gated. Stamps `lastAdvancedAt` at the seam.
- **CurrentSprint pin / `planner-drive`** — the pin singleton; `focus`/advance re-points CURRENT/LAST/NEXT and stamps advancement.
- **`scrum.pmo/skills/task-transition.md`** — the canonical status phases (`refinement → creating test cases → implementing → testing`); bespoke phases are invisible to the machinery ([[dont-fork-the-shared-mechanism]]).
- **`scrum.pmo/skills/planner-current-sprint-driving.md`** — pin-driving skill.
- **`scrum.pmo/skills/realtime-traceability.md`** — chain appears on `/trace` on reload with ZERO manual steps after authoring.
Never invent a second updater or hand-stamp a literal status — a second source of truth is the DRY defect the canon forbids.

## ★ THE SHARPEST FORM — INVOKE THE PRODUCT'S OWN ACTION, NEVER HAND-EDIT THE UNIT (TRON 2026-09-13: "can the action be used as a skill?")
Perform a state change by **INVOKING THE PRODUCT'S OWN ACTION** (set-as-current, resolve-cr, approve, …) — **NEVER by hand-editing the unit/singleton.** This is the purest form of the law above: the status changes because the ACT happened.
Why it beats a hand-edit:
1. **ONE mechanism owns the invariants.** The action already OWNS the transition AND its side-effects (e.g. `set-as-current` demotes the previous current to NEXT per CR #86-3). A hand-edit re-implements that by convention → drifts. (`[[dont-fork-the-shared-mechanism]]`)
2. **Status-by-construction applied to US** — the status changes BECAUSE the act happened, which is exactly this routine.
3. **DOGFOODING** — we invoke the SAME action Tron uses, so a broken action is caught BY US first, not by him. (`resolveCr` silently not-resolving CRs survived since 2026-08-24 because we never used it.)
4. **NO HAND-STAMPING** — the banned anti-pattern becomes structurally impossible when the action does the write.
**Use the action where you CAN; where it is OWNER-GATED, PREPARE and TRON ACTS — never work around a gate (never weaken the guard).** ★ Inventory MEASURED (expert, server.ts, 2026-09-13 — never assumed):
- **OWNER-GATED (Tron-only, `requireOwnerHttp` → 403 for agents):** `set-as-current`/make-current (:2575), `approve`/`decline`/`resolve-cr` (:2510), `cr-approve` (:2542), `designate` (:2640). These are TRON judgment calls by construction — the agent **PREPARES**, Tron ACTS.
- **AGENT-INVOKABLE (player-token, any authenticated member):** room CONTENT ops — `add-folder` / `move-unit` / `upload`. Actions-as-skills works **NOW** for this set (agent holds a player token) — drive these via the action, never a hand-edit.
> ★ NOTE — the pin (`set-as-current`/`designate`) is OWNER-GATED, so agents CANNOT drive the pin via the action today; per this rule the pin designation is **PREPARE + Tron acts**. Enabling agents to steer/verdict would need an explicit **agent-delegation auth path** (scoped+revocable) — a **design + a TRON decision (`security-authorization-law.md`: never add an auth path unless Tron names it)**, NOT a guard-weakening. Route to architect ONLY if Tron asks.

## Connections
Process canon: `session/base-skills/process-canon.md` §8 (summary POINTs here). Kin: [[durable-adoption-not-a-pane-message]] · [[report-is-observation-not-gate]] · [[done-requires-tron-qa-and-real-deliverable]] · [[status-discriminator-is-a-unit-field]] · [[exists-correct-proven-gate-gradient]] (QA=evidenced). Doctrine: measure-never-assume, DRY-reuse-the-mechanism. **Done is TRON'S act — this routine never writes Done.**
