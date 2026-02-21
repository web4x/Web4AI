# Product Owner Context

**Updated**: 2026-02-21T19:45Z
**Role**: product-owner
**Pane**: projectTeam:0.4
**State**: ACTIVE — manual mode, CMM quality improvement sprint

## CURRENT GOAL: CMM4 Team Quality (Tron directive)

Tron: "you are the po responsible for the team and its quality and cmm progression. you together with me have to care we built a cmm4 team as described in the woda story."

Approach: Train the trainer → retrain PO → then role by role.

## SESSION DELIVERIES (verified via git log)

| Commit | Feature | Status |
|--------|---------|--------|
| 205bd40 → fa6abd6 | oo mode + oo use + shim + guards | 9/9 PASS |
| 885cc6a | session/ cleanup from oosh repo (154 files) | Done |
| ea02bcb | log live + oo use bootstrap fix | 6/6 PASS |
| 58048e1 | Completion parser: strip [args...] | Done, expert |
| a926138 | Regression test for [args...] fix | 4/4 PASS, tester |
| f32b0ee | Agent trainer bulk fix (PROBLEMATIC — 90 files, needs review) | Task #35 |
| 90e3488 | PO + trainer SKILL.md: team quality, role-model identity | Done |

## IN PROGRESS

### Expert (projectTeam:0.1)
- Was /cleared at 0% context (legitimate — context limit reached)
- Rebooted with FULL retraining: SKILL.md + learnings + context + task
- Working on `oo use dev <TAB>` command completion fix (v2 approach — edit source files)
- Researching c2 completion discover for positional param completion
- Last seen: permission prompt for c2 test (approved)
- Task #34

### Tester (projectTeam:0.2)
- Was /cleared at 5% (PO mistake F29 — should have re-compacted)
- Currently stopped, waiting for expert to commit
- Needs proper retraining when expert delivers

### Role-by-role SKILL.md improvement (Task #33)
- DONE: Trainer SKILL.md — role-model identity, scope limits, git history, woda reading
- DONE: PO SKILL.md — team quality ownership, agent lifecycle, manual mode, CMM patterns
- NEXT: Tron to decide order. Options: expert/tester (daily workers) or SM/orchestrator (Goal 0)

## TRACKED TASKS

| # | Task | Status |
|---|------|--------|
| 33 | Role-by-role SKILL.md improvement | in_progress — PO+trainer done, rest pending |
| 34 | Fix oo use command completion | in_progress — expert working |
| 35 | Review/revert f32b0ee bulk trainer commit | pending — 90 files need assessment |

## PENDING TASKS (not tracked yet)

| Task | File | Status |
|------|------|--------|
| Subscription redesign | session/tasks/spec-subscription-redesign.md | Spec ready, held for velocity |
| hiveMind send Enter bug | session/tasks/bug-hivemind-send-enter-literal.md | Not assigned — confirmed real (Enter as literal text) |
| claudeCode 256 color + UTF-8 | session/tasks/20260220T1023Z.task.md | Deferred |
| Goal 0: autonomous operation | session/tasks/tron-directive-autonomous-operation.md | WS1 spec written |

## PO FAILURES THIS SESSION (F29 — learnings)

1. **/cleared tester at 5%** — should have re-compacted. Tron: "are you mad...it kills your team mate"
2. **Agent trainer bulk replace** — 90 files without role understanding. Tron: "looks like he just added random shit"
3. **Not using TaskCreate** — PO stopped tracking work with internal tools (now fixed)
4. **Boot.md wrong rules** — "Passive mode = death" propagated to all agents. Only SM/orchestrator should loop.
5. **Tester self-tasking** — SKILL.md contradiction ("NEVER just sit idle" vs task queue rule). Root cause found and fixed.
6. **Expert wrong approach** — defining functions via otmux send (garbles). PO should redirect earlier.

## KEY INSIGHTS (Tron directives this session)

1. "you are the po responsible for the team and its quality and cmm progression"
2. "train the trainer to retrain yourself and then lets do it role by role"
3. "self care is team care" — save context proactively
4. "the agents shall use the internal task tool for task queueing. you also stopped doing it"
5. "did the agent trainer have git histories about the skill evolution? looks like he just added random shit to good skill files of the past"
6. "the agent trainer must be aware of the role goals"
7. hiveMind send Enter bug is REAL — "Enter" treated as literal text, not keypress. Use otmux send directly.

## TEAM STATE

- Expert on 0.1 — active, working on completion fix (fresh after /clear + full retraining)
- Tester on 0.2 — stopped, waiting for expert. Needs retraining after /clear at 5%.
- SM, orchestrator, others — STOPPED per Tron order
- Manual mode: PO manages expert + tester directly

## WHAT THE TRAINER DELIVERED (verify quality)

Trainer improved PO SKILL.md with targeted edits (129 insertions, 16 deletions):
- Team Quality Ownership section: CMM levels, woda patterns, trainer as tool
- Agent Lifecycle Management: compact rules by %, /clear only at 0%, lifecycle steps
- Manual Mode: responsibility table, activation triggers, operating rules
- Communication: three modes (full team, manual, team quality)
- Role Boundaries: team quality, manual mode caveat
- Reading List: woda-overview at boot position 4

PO also improved trainer SKILL.md directly:
- Core principle: "Role model, not search-replace monkey"
- 5 mandatory gates before any edit
- Role goals table for all 10 team roles
- Scope limits: only listed roles, not generic templates
- F29 documented with Tron's exact words

## RULES

- GATE: measure → assess → act → verify
- Self-care IS team care — save context before compact
- PO checks RESULTS (git log), not process
- Use TaskCreate/TaskUpdate for ALL work
- hiveMind send Enter bug — use otmux send directly as workaround
- /clear ONLY at 0%. At any % above 0, try /compact again.
- Agent trainer: role model, not bulk replace. Git history + role goals first.
- Agents wait for assignment. Only SM/orchestrator have background loops.

## RECOVERY STEPS

1. Read this context file
2. Read boot-post-compact.md for additional state
3. Check expert pane (30+ lines) — is completion fix done?
4. Check tester pane — retrain when expert delivers
5. TaskList — check tracked tasks
6. Continue: role-by-role SKILL.md improvement (Task #33)
7. Monitor subscription velocity
