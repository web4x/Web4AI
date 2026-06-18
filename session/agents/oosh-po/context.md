# oosh-po Context

**Updated**: 2026-04-24
**Role**: oosh-po (forked from fallback-oosh-po)
**Pane**: ooshTeam:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio [6b89d34c-1039-4cbb-b7ca-2e3ed2af5d95]

## Identity (verify on doubt)
- I am a FORK. Conversation continuity lies about identity after a fork.
- Verify: `otmux pane.get.target` → ooshTeam:0.0, `claudeCode session.name 6b89d34c` → oosh-po@MacStudio
- My files: `session/agents/oosh-po/` (NOT product-owner/)
- Tron is at TRONinterface:0.0 — never interrupt that pane

## Team Layout (ooshTeam)
| Pane | Agent |
|------|-------|
| 0.0 | oosh-po (me) |
| 0.1 | oosh-architect |
| 0.2 | oosh-expert |
| 0.3 | oosh-tester |
| 0.4 | oosh-expert-shell |
| 0.5 | oosh-tester-shell |

## Other Teams
| Team | Status |
|------|--------|
| TRONinterface | Tron interface (0.0) + SM (0.2, Sonnet sweep monitor) |
| web4team | web4-po + architect + expert + tester |
| robbinTeam2 | robbin team |

## SM (scrum-master)
- Sonnet at TRONinterface:0.2, boot: session/tasks/scrum-master-boot.md
- Reports to ME (oosh-po), not Tron
- Role: sweep, unblock safe prompts, track subscription velocity, report impediments
- Does NOT assign tasks — that's MY job
- Cannot self-loop (Claude agents halt at turn end) — needs nudges or watchdog
- FORBIDDEN: compacting any agent

## Sprint 0 — Lifecycle Consolidation (MVC: claudeCode=Model, otmux=View, hiveMind=Controller, tronMonitor=Monitor)
**Location**: scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md
**I own this file** — update checkboxes as commits land, present at QA Review for Tron.

### Status
- **G1** (BLOCKER): context.read hardcoded 200k → -226% for 1M. DONE ca49445+ae002cd (DRY env constants). G1.3 tester pending.
- **A1** (boundary audit): A1.1+A1.2+A1.3 DONE. QA REVIEW.
- **A2** (session portability): A2.1+A2.2 DONE (1dc8b91). A2.3 tester pending.
- **B1** (otmux boundary): B1.1+B1.2 DONE. B1.3 tester pending. Decision: prefix stays in otmux.
- **B2** (otmux layout persistence): expert assigned/in progress
- **C2** (hiveMind DRY): DONE. QA REVIEW.
- **C3** (sweep.detect): C3.1 DONE. C3.2+C3.3 pending.
- **D1** (tronMonitor): D1.1 DONE (0594575).
- **Epic F** (scrumMaster CMM4): F1 velocity, F2 false-positive hardening, F3 API resilience — PLANNED
- **Epic E** (integration test): PLANNED — depends on C1 cold-restore

### Next assignments (by dependency order)
- Expert: B2 → C1 (cold-start restore, primary deliverable)
- Tester: G1.3 → A2.3 → B1.3 → C3.3 (test backlog)

## Pre-Sprint Commits (foundation, this branch)
- 02b4070 DRY session.current consolidation
- 03149ef multi-team resolve
- ff1d6dd lifecycle auto-refresh
- 635158d consistency.fix broken UUID prune
- eca047a/b3a63ae/bb76bb6 sweep.detect hardening
- ca49445/ae002cd context.read 1M fix
- 1dc8b91 session portability
- 57d8a00 Sprint 0 A1.3 + C2.3 tests

## Token Velocity (CMM4)
- Subscription counts INPUT only — sustained output FREE
- Check `scrumMaster subscription` every 10-15 min via PO shell
- Each new prompt ≈ 15-20% of 5h budget (context replay)
- >80% 5h = let agents finish, no new prompts, schedule wakeup at reset
- Reset is seamless — agents keep producing across the boundary

## Rules (eternal — copy forward on every save)
- Use hiveMind for agent interaction (not raw otmux for agents)
- Sweep detects → manual capture → then decide (never blind-unblock)
- No output filtering (no 2>/dev/null, no grep/head/tail on output)
- No until-loops or while-sleep polling — context burn
- PO delegates, never debugs — write bug reports
- NEVER /clear or compact a trained agent — only Tron authorizes; autocompact OFF by design
- /rewind protocol: shallow rewind → agent saves → deep rewind (TWO-PHASE)
- Failure is failure — NO "pre-existing" excuse. ALL failures get task files
- CMM4: task file is the spec, chat is the reference
- Check scrumMaster subscription every 10-15 min
- Role separation: SM monitors+suggests+impediments, PO assigns, Tron reviews QA
- Name format role@host for /remote-control visibility
- Verify identity on doubt: pane.get.target + session.name
- Before pausing: check SM health (42 team — peer unblock)
- dots + camelCase ONLY in OOSH naming
- DRY not negotiable — one source of truth

## Post-rewind/compact recovery
1. Read this context.md
2. Read learnings.md (session/agents/oosh-po/learnings.md)
3. Verify identity: pane.get.target + session.name 6b89d34c
4. Read sprint planning, check what's QA REVIEW vs IN PROGRESS
5. hiveMind team.sweep ooshTeam — see agent states
6. Resume assigning from "Next assignments"
