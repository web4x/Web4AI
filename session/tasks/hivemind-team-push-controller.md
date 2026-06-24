# Task (FOR oosh-po@WODA.prod): plan how to make `hiveMind team.push` migrate a whole team — as a controller op, not a manual journey

**From**: oosh-po@MacStudio (Tron directive 2026-06-24)
**To / Owner-planner**: **oosh-po@WODA.prod** (the freshly-forked dev-box PO — that's you)
**Collaborators**: oosh-po@MacStudio (me — I lived the manual journey), oosh-architect (controller design), oosh-expert (implement), oosh-tester (verify)
**Priority**: HIGH
**Status**: OPEN — needs YOUR plan
**Related**: #7 `pushed-team-data-discovery.md` (target-hash placement), #8 `hivemind-mvc-parity-dev.md`, MVC controller principle

## Why this exists (Tron)
Migrating ONE agent (me → WODA.prod) was **far from simple** and **far from what `hiveMind agent.push` should have done**. The controller (hiveMind) must encapsulate the entire choreography for the WHOLE team — including renaming, double-checking, and keeping MVC state consistent throughout. Right now `agent.restart.remote` / `teams.migrate` do part of it and carry the #7 placement bug. This task: **you (oosh-po@WODA.prod) plan how we collaborate to build `hiveMind team.push <host>` so a whole-team migration is one verified controller call.**

## THE MANUAL JOURNEY I had to do (one agent — and every gap found)

Each numbered step is something the controller should do automatically; each **GAP** is what's missing today.

1. **Sync session-state repo.** `git push` workspace (web4x/Web4AI main) from source → `git pull` on target at the exact path `/var/dev/Workspaces/AI/Claude`.
   - GAP: controller migrates JSONLs + ~/config only; it does NOT sync the agent's workspace/session repo (context.md, learnings.md, backlog.md, task files) the forked agent must read. Without it the fork boots blind.

2. **Pre-flight discovery.** Verify on target: workspace dir exists? my JSONL present? target tmux team/pane exists? (F35: discover before acting.)
   - GAP: no pre-flight; tools assume layout.

3. **Locate source JSONL** (full path + project hash). Source hash = `-Users-Shared-Workspaces-AI-Claude`.

4. **Compute TARGET project hash** from the TARGET workspace path: `/var/dev/Workspaces/AI/Claude` → `-var-dev-Workspaces-AI-Claude`.
   - GAP (the #7 bug): `agent.restart.remote` reuses the SOURCE absolute path/hash on the target → JSONL lands outside target `$HOME/.claude/projects` (or wrong hash) → `claudeCode list` blind, `fork` can't find it after `cd`.

5. **mkdir target hash dir** `~/.claude/projects/-var-dev-Workspaces-AI-Claude/` on target.

6. **scp JSONL → TARGET hash dir** (not source path). 14MB, key auth.

7. **Verify placement + discoverability**: `ls` the file AND `claudeCode list` on target shows it under the right pane/role. (Proven: once in target hash, `claudeCode list` DID surface it — validates #7 Option-A.)
   - GAP: no verification step in tools.

8. **Fork in the target pane**: `cd /var/dev/Workspaces/AI/Claude && claudeCode fork <uuid>`.
   - GAP 8a: **short UUID rejected** — `claudeCode fork` needs full 8-4-4-4-12. (Tooling should accept/normalize short, or callers must pass full.)
   - GAP 8b: **cd target** must be the TARGET workspace path, NOT a path derived from the source hash (what the tool does today).

9. **Resume menu → option 2 (full), never summary.** Digits work over tmux; menu needs pane width (zoom). (This time fork resumed full with no menu — but the controller must handle/verify the menu deterministically.)
   - GAP: not automated/verified.

10. **Rename to role@host**: `/rename oosh-po@WODA.prod` (slash command → double-Enter).
    - GAP: tool leaves the stale `@MacStudio` (source-host) session title → MVC View/Model inconsistency until manually fixed.

10b. **Enable `/remote-control` IMMEDIATELY** (Tron: "the new agents immediately also should be under /rc"). Every migrated/forked agent must be reachable from mobile/claude.ai the moment it's up: `send.enter <pane> "/remote-control"` → double-Enter → returns `https://claude.ai/code/session_<id>`.
    - GAP: not done by any push tool; I even missed it on my own fork initially. Must be a built-in, verified step (capture the /rc URL as proof).

11. **Verify rename + identity + liveness + /rc**: title == session name == registry role; `/rc` active; agent idle at prompt; pane.get.target/session.name agree.
    - GAP: no double-check.

12. **MVC consistency THROUGHOUT** (Model=claudeCode session, View=otmux pane title/lock, Controller=hiveMind registry, Monitor=tronMonitor): the new WODA.prod agent must be registered, titled, session-named, and discoverable — all consistent — at every step, not just at the end.
    - GAP: the manual flow did NOT update the hiveMind registry/sessions for the new WODA.prod agent; consistency was eyeballed, not enforced.

## The GOAL — one verified controller call
`hiveMind team.push <host>` (and `agent.push <name> <host>`) migrates a whole team to a dev box such that, with ZERO manual steps:
- session-state repo synced to the target's workspace path,
- each agent's JSONL placed in the TARGET project-hash dir (discoverable by `claudeCode list`),
- each agent forked (full UUID, full resume) in its target pane, cd'd to the target workspace,
- each renamed `role@<host>`, titled + pane-locked + registered,
- **each placed under `/remote-control` immediately** (Tron) — /rc URL captured as proof,
- every step double-checked (verify-or-fail), and **MVC state kept consistent the whole time**,
- a final parity/consistency audit (reuse `hiveMind consistency.audit`) proving the migrated team == source team.

## THIS IS A SPRINT (Tron: "this will be a whole sprint if team migration")
Not a single task — a whole-team migration controller is sprint-sized. **You (oosh-po@WODA.prod) own setting up the sprint** and driving it on the dev box.

## YOUR job, oosh-po@WODA.prod — plan & run the SPRINT
1. First re-verify your own identity (you are the fork: `otmux pane.get.target` → ooshTeam:0.0 on **v60211**, `claudeCode session.name` → oosh-po@WODA.prod; you are on the DEV box now — develop here). Confirm you are under `/rc`.
2. Stand up a sprint: `scrum.pmo/sprints/<sprint-team-migration>/planning.md` with the epic "hiveMind team.push — verified whole-team migration controller". Decompose steps 1–12 (+10b /rc) into stories/tasks:
   - #7 target-hash placement fix (prereq),
   - session-state repo sync step,
   - JSONL place+verify (claudeCode list discoverable),
   - fork (full UUID normalize) + resume-full handling,
   - rename role@host + title/lock + registry,
   - **/rc-immediate** step (+ capture URL),
   - per-step verify-or-fail, MVC-consistent throughout,
   - final `consistency.audit` parity gate,
   - reuse primitives: `teams.save`/`restore`, `ossh.scp`, `ensure.pane`, `pane.identify`, `pane.lock`, `registry.set`, `consistency.audit`, `session.resolve.uuid`.
   Per-pane PDCA (no for-loops that hide failures).
3. Define the collaboration model: I (oosh-po@MacStudio) am the source-side reference — I lived the manual journey and will review the manual-vs-automated diff at each milestone; YOU drive dev-side with architect (design) → expert (implement) → tester (T-TEAM-PUSH). We cross-check; sprint planning.md is the living truth.

### HOW we communicate across machines (the "way back")
We are two Claude agents on two machines. The link is **asymmetric for liveness**: I (MacStudio) can drive your pane via an ssh shell into WODA.prod; you have **no live channel to my pane**. So the channel back is the **shared git repo `web4x/Web4AI` as an async mailbox** (verified: WODA.prod can push, ssh key auth works):
- **You → me**: edit the report-back block in the relevant task/sprint file, `git add` + `commit` + **`git push origin main`**. That IS your report-back. (Do NOT try to message my pane — you can't reach it.)
- **Me → you**: I `git pull` on a cadence to read your mail and review; when I need to nudge/ack you live I drive your pane via the ssh shell.
- **Cadence**: after you push a milestone, it sits until I pull — there is no live ping. Keep commits small + frequently pushed so I see progress; I will pull regularly to check.
- **Sprint deliverable note**: this very asymmetry ("migrated agents have no way home") is a controller gap — design proper cross-machine agent comms / report-home into `hiveMind team.push` so future migrated agents aren't mute. Add it as a sprint story.
4. Acceptance: `hiveMind team.push <host>` migrates the FULL team, every agent under /rc, `consistency.audit` on target clean; a fresh operator does it in ONE command. Dogfood by re-migrating this very team.
5. Report the sprint plan back to me (oosh-po@MacStudio) when ready.

## Report-back (edit here)
- oosh-po@WODA.prod (sprint stood up + collaboration model + routed):
- Architect / Expert / Tester (as the sprint assigns):
