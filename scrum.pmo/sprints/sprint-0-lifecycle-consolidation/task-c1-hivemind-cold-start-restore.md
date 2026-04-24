[Back to Planning Sprint 0](./planning.md)

# Task C1: hiveMind Cold-Start Restore
[task:uuid:9d8a4399-63e7-4544-979d-d93b7023ba4e]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (full audit + design complete)
  - [x] creating test cases (8 assertions for C1.4 tester)
  - [~] implementing (AUDIT + DESIGN done; CODE CHANGES queued for next implementation task)
  - [ ] testing (pending implementation + C1.4 tester)
- [x] QA Review (audit + design + test criteria ready)
- [ ] Done (pending implementation + C1.4 tester)

## Deliverable
**Findings:** [task-c1-findings.md](./task-c1-findings.md) — combined C1.1 + C1.2 + C1.3

**Status matrix (current vs target after implementation):**
- 13 capabilities analyzed
- 4 currently working (save role+UUID+title, explicit save, basic restore, session re-attach via UUID)
- 9 missing or ad-hoc (layout geometry, cwd, model flag, team metadata, bootstrap flag, kind classification, auto-save triggers, idempotency, polling vs sleeps)

**Recommended implementation order** (5 steps) queued for next task once C1.4 tester coverage is defined. Per sprint rule: "document leaks, fixes come after tester coverage."

**B2 integration ready** — the design leverages the layout.save/restore methods just shipped in commit ec7fe28.

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic C (Controller Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task C1.1: Expert - Restore Audit](./task-c1.1-expert-restore-audit.md)
    - [Task C1.2: Expert - Config-Only Restore](./task-c1.2-expert-config-only-restore.md)
    - [Task C1.3: Expert - Save Completeness](./task-c1.3-expert-save-completeness.md)
    - [Task C1.4: Tester - Full Cycle Test](./task-c1.4-tester-full-cycle-test.md)

## Task Description
Implement hiveMind's ability to fully restore a team from a cold start (tmux server death). Using saved state from config files (roles.env, sessions.env, teams.env, forks.env), hiveMind must: recreate the tmux layout via otmux, rediscover running Claude processes via claudeCode, and re-attach agents to panes. This is the sprint's primary deliverable.

## Context
When the tmux server dies (crash, reboot, kill-server), all panes are lost but Claude Code processes may still be running. hiveMind must:
1. Read saved team state from env files
2. Ask otmux to recreate the pane layout
3. Ask claudeCode to find running Claude processes by PID/session
4. Re-attach processes to panes or spawn new ones
5. Restore agent roles, session continuity, and monitoring

Depends on: A2 (claudeCode portability), B2 (otmux layout persistence)

Key file: `/Users/donges/oosh/hiveMind`

## Intention

### Why This Task Exists:
1. **Primary Sprint Deliverable:** Cold-restart capability is the sprint's main goal
2. **Resilience:** Teams must survive infrastructure failures
3. **Session Continuity:** In-progress agent sessions must resume, not restart

### Problems This Task Solves:
- **Total state loss on tmux death:** Teams disappear when server dies
- **Manual recreation:** Currently must manually rebuild entire team
- **Lost context:** Agent sessions and progress lost with panes

### How This Task Solves These Problems:
- **State persistence:** All team state saved to env files before/during operation
- **Automated restore:** Single command recreates entire team from saved state
- **Process discovery:** Find and re-attach surviving Claude processes

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
*Priority: 1 (CRITICAL - Primary Deliverable)*
