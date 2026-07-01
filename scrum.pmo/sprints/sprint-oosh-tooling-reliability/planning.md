# Sprint: OOSH Tooling Reliability — make oosh tools the mandatory default again

**Epic / North Star** (Tron directive 2026-07-01): the OOSH team tools (`hiveMind` / `otmux` / `claudeCode`) must be reliable enough to be the **MANDATORY DEFAULT** for every team operation — so no agent ever needs to fall back to raw `tmux` / raw `claude`. This session, tooling gaps (BUG10 unsent dispatches, recurring route corruption) repeatedly FORCED raw-tool fallback and stalled cross-team work. Fix every gap that breaks the default; then re-assert the doctrine.
**Owner**: oosh-po@WODA.prod
**Status**: OPEN — all stories captured as task files; prioritized by "does it force raw fallback"
**Created**: 2026-07-01
**Source**: full session's identified gaps (clean-boot sprint fallout + RC/backfill throttles + cross-team F-MVC-BYPASS)

## TIER 0 — CRITICAL: the two full-velocity throttles (force raw fallback NOW)
### OTR-1: dispatch-submission-verified (BUG10) — send must SUBMIT, not just stage
Shared send core (`otmux send` + `hiveMind send.message`/`agent.queue.drain`) delivers text but doesn't submit → sits unsubmitted, agent idle. Blocked Sprint22 + every dispatch this session; forces raw send-keys. Fix: Enter-after-deliver + verify submission + retry; `send.submit`/`poke`; prefer short-pointer payloads (long msgs wrap-stall).
- Task: `session/tasks/dispatch-submission-verified.md` · Owner: architect→expert→tester · **CRITICAL**

### OTR-2: hiveMind route auto-heal — recurring route=unknown-state (fd-leak root cause)
robbin-po route corrupts recurringly (~10min) under RC-drive → unreachable → forces raw-tmux. **NEW root-cause lead: hiveMind fd-LEAK (EMFILE despite ulimit 1048576)** → route-resolve file-opens fail → unknown-state, recovers when fds reclaim. Fix: the fd leak at source + self-care auto-heal (send re-resolves via tty-match instead of stale-drop) + interim watchdog (periodic reconcile).
- Task: `session/tasks/hivemind-route-autoheal.task.md` · Owner: architect (root-cause)→expert→tester · **CRITICAL**

## TIER 1 — HIGH: MVC integrity (orphans invisible to controller → force raw)
### OTR-3: hiveMind reconcile-after-fork + team.audit — adopt orphans, detect F-MVC-BYPASS
Raw `claude --name` forks (outside `agent.bootstrap`) = no tracked uuid → invisible to sweep/monitor/unblock. 2 live cases in robbinTeam2 (planner 0.6 + po 0.0). Add `reconcile-after-fork <pane>` (tty-match adopt) + `team.audit` (flag ALL orphans: live-claude+empty-uuid/unknown-route in one sweep). Doctrine: `agent.bootstrap` = only sanctioned fork path.
- Task: `session/tasks/hivemind-reconcile-after-fork.task.md` · Owner: architect→expert→tester · **HIGH**

### OTR-4: agent-runtime provisioning (tmux + claude-cli on a node) — NP-4 cross-link
A fresh node boots OOSH but can't host agents (no tmux/claude) → `team.push` places 0 agents. Belongs to node-provisioning but is a tooling-default gap (can't use hiveMind team ops on a fresh node).
- Task: `session/tasks/np4-provision-agent-runtime.task.md` · Owner: architect→expert→tester · **HIGH** *(also in sprint-node-provisioning, parked)*

## TIER 2 — MEDIUM: hygiene / quality (don't force raw, but erode trust)
- **OTR-5** structured-output log-guard — LOG_DEVICE leaks corrupt structured stdout · `structured-output-log-guard.task.md`
- **OTR-6** panelock-skip-human-shells — pane.lock must refuse human shells (flicker war) · `panelock-skip-human-shells.md`
- **OTR-7** rewind-readiness-preflight — `agent.rewind.ready` gate before any rewind · `rewind-readiness-preflight.md`
- **OTR-8** test.suite regression.check — objective regression-vs-preexisting triage · `test-suite-regression-check.task.md`

## TIER 3 — LOW: process / cleanup
- **OTR-9** `oo new.task` scaffolder — consistent task files from `_TEMPLATE.task.md` · `oo-new-task-scaffolder.md`
- **OTR-10** claudeCode sessions.prune — archive DEAD sessions + test-artifact cleanup · `claudecode-sessions-prune.task.md`

## DOCTRINE (the "again" in the north star)
### OTR-D: re-assert "OOSH tools = default; raw tmux/claude = forbidden exception"
Once TIER 0 lands (tools reliable), agent-trainer re-propagates to all SKILL.md: oosh wrappers are the DEFAULT+MANDATORY path; raw tmux/claude only with explicit Tron authorization for a named recovery. Clarify: `otmux send.raw`/`pane.capture` ARE wrappers (allowed) — over-restriction blocks the workaround (SM's Sprint22 lesson).
- Owner: ARON + agent-trainer · gated on OTR-1/OTR-2 (tools must actually work before mandating them)

## Sequencing
OTR-1 + OTR-2 FIRST (they're the active throttle; nothing else matters if dispatch/route are unreliable). Then OTR-3/4 (MVC integrity). TIER 2/3 as capacity allows. OTR-D last (mandate the default only once it's reliable).

## Cross-references (other sprints — for "ALL gaps" completeness)
- **sprint-node-provisioning** (PARKED by Tron): NP-1 odocker autoconfig, NP-2 u24 gate (Step4 GREEN/Step5=NP-4/OTR-4), NP-3 DONE (state 99). Unpark pending Tron S3 a/b.
- **plantuml script** (ACTIVE, Tron directive): `plantuml-oosh-script-design.md` — PO-signed-off, in expert impl (2 odocker primitives + plantuml).

## Definition of done (sprint)
An agent can run the entire team lifecycle — dispatch, monitor, unblock, fork, reconcile — through oosh wrappers ALONE, with zero raw-tmux/raw-claude fallback, across sustained RC-driving and cross-team ops. Then the doctrine is re-mandated.

## TIER 1 (added) — OTR-11: boot/identity resolution is failing (live symptom)
`session/agents/unknown/boot.md` was auto-overwritten 2026-07-01 10:11: identity detection FAILED to resolve a role → wrote an "unknown (identity detection failed)" boot (clobbering a scrum-master boot). This is the boot-resolution gap flagged in `agent-dirs-per-host-split.md` (agent-trainer follow-up), now CONFIRMED live. With per-host dirs (`role@host/`), the boot/recovery hook must resolve `role@host` from ground truth (tty-match pane→uuid→registry) — and NEVER silently produce an "unknown" that clobbers a real agent's boot. Same root family as OTR-2/OTR-3 (registry/route/uuid integrity). Owner: agent-trainer (boot hook) + hiveMind-expert (resolution). **HIGH.**
