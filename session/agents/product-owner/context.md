# Product Owner Context

**Updated**: 2026-02-23T11:30Z (EMERGENCY SELF-CARE — 6% context)
**Role**: product-owner
**Pane**: projectTeam:0.4
**State**: CRITICAL — compact needed NOW

## CURRENT GOAL: Perfect the PDCA Plan (Tron directive)

We have a good plan at `/Users/donges/.claude/plans/streamed-gathering-hippo.md` but it needs optimization before execution. The previous attempt failed because:
1. **Kicked off orchestrator without training it on protocols** → orchestrator compacted trainer without context save (F36)
2. **Parallel kickoff = loss of control** → too many agents, nobody watching
3. **PO still reactive** → kept doing trainer's/SM's jobs

## THE PLAN (approved by Tron, needs optimization)

### Core: PDCA operating model for the team
- Every agent (except SM) uses plan mode before executing
- Plan approval = velocity control (7 criteria)
- SM is governance: permissions, OOSH enforcement, role boundaries, impediments
- Trainer trains everyone on common skills (web4, CMM, PDCA, WODA) before they get authority

### Correct SEQUENTIAL execution (learned from failure):
1. **PO + Trainer align on plan** — trainer reads full plan, enters plan mode, PO approves trainer's sub-plan
2. **Trainer trains SM** — SM is PO's most important companion, monitors for violations
3. **SM monitors while trainer trains orchestrator** — safety net BEFORE giving orchestrator authority
4. **Only then: orchestrator coordinates implementation** (DRY fix via hiveMindTeam)

### Key: NEVER give authority before training
The orchestrator compacted trainer because it didn't know compact protocol. Training MUST come before authority. Sequential, not parallel.

## WHAT WAS ALREADY DONE (commits exist — verified)

1. Issues 1-2 delivered by hiveMindTeam (2e91a82) — SELF message, hybrid roles.complete, registry.fix
2. DRY send analysis written (fee0e75) — 8 functions → 4, Option C recommended
3. KB #27-29 written and indexed (9684c3d) — PDCA model, DRY principle, role boundaries
4. INC-004 reopened with correct root cause (hiveMind send bypasses Enter fix)
5. MEMORY.md updated with PDCA operating model
6. Trainer completed: OOSH enforcement (76ceda0), SM training (3486631, 2c63837)
7. Plan file exists: `/Users/donges/.claude/plans/streamed-gathering-hippo.md`

## WHAT STILL NEEDS DOING

1. **Optimize the plan** — add sequential execution, add F36 failure, fix the parallel kickoff mistake
2. **PO + Trainer alignment** — trainer reads plan, enters plan mode, PO verifies trainer covers all protocols
3. **Trainer trains SM on governance role** (permissions, OOSH enforcement, role boundaries, impediments)
4. **Trainer trains orchestrator on ALL protocols** (compact protocol, 42 principle, plan approval)
5. **DRY send consolidation** — hiveMindTeam implements Option C (hiveMind.send → otmux.send.enter)
6. **Common skills in all SKILL.md** — trainer's sub-goal 2 (not started)
7. **KB #27-29 dissemination** — trainer's sub-goal 3 (not started)

## BUDGET

Weekly 82%, cap 90% (Tron updated from 92%). **8% budget left.** Be extremely efficient.
Block: ~40% used, ~55 min remaining.

## TRON DIRECTIVES (cumulative — all previous + new)

1-28: previous sessions
29. PO uses plan mode (PDCA), not reactive
30. Every agent (except SM) uses plan mode
31. SM: permissions (never option 1), OOSH enforcement, role boundaries, impediments
32. Plan approval = velocity control (7 criteria)
33. Common skills in every SKILL.md
34. Learn → KB → MEMORY.md → tell affected agents
35. Check recurring incidents against plan
36. DRY is highest architectural priority
37. **SEQUENTIAL, not parallel** — don't kick off all at once, lose control
38. **Train before authority** — orchestrator compacted trainer because untrained (F36)
39. **SM is most important companion** — only one who monitors and catches violations
40. **Trainer must be 100% sure of role before training others**
41. **Take time to perfect the plan** — quality over speed
42. **Budget: 8% to 90% cap** (updated from 92%)

## RULES (eternal — never delete)

All previous rules plus:
- Sequential execution: train → verify → next agent. Never parallel kickoff.
- F36: Never give coordination authority to untrained agent.
- SM must be functional before ANY other agent gets kicked off.
- Cap is now 90% (Tron update), was 92%.

## KEY FILES

- Master plan: `/Users/donges/.claude/plans/streamed-gathering-hippo.md`
- DRY task: `session/tasks/dry-send-consolidation.md`
- Trainer boot: `session/agents/agent-trainer/boot.md`
- Trainer learnings: `session/agents/agent-trainer/learnings.md`
- KB index: `session/knowledge-base/index.md`
- INC-004: `session/knowledge-base/recurring-incidents.md`

## NEXT ACTION AFTER COMPACT

1. Read this context + priority.md + boot.md
2. Read the plan file: `/Users/donges/.claude/plans/streamed-gathering-hippo.md`
3. Enter plan mode — optimize the plan with sequential execution
4. Get Tron's approval on optimized plan
5. THEN: align with trainer (trainer reads plan, enters plan mode)
6. Do NOT kick off anyone else until trainer is aligned and SM is trained
