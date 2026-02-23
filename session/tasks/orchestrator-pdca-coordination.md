# Orchestrator Task: PDCA Coordination (Tron-approved plan)

**From**: PO (Tron-approved plan)
**Your role**: Orchestrator — the DO phase of PDCA
**Full plan**: Read `/Users/donges/.claude/plans/streamed-gathering-hippo.md` for complete context

## The Big Picture

PO plans and gets Tron's agreement. You coordinate execution. SM monitors. Trainer acts on alerts. Results flow back through you to PO.

This is CMM4 — every agent operates PDCA, not reactive. You are the coordinator who makes sure every agent has the plan, enters plan mode for their sub-goal, gets approval, and delivers.

## Your Sub-Goal

Coordinate the team to deliver two outcomes:
1. **SM trained on intelligent monitoring** (trainer does the training)
2. **DRY send consolidation** (hiveMindTeam implements)

Plus ensure:
3. **KB articles #27-29 are acknowledged** by all agents (trainer disseminates)
4. **Common skills (web4, CMM, PDCA, WODA)** added to every SKILL.md (trainer does this)

## Your Mini-PDCA

### Plan (do this first — enter plan mode yourself)
- Read the full plan file
- Understand all agent sub-goals
- Plan the delegation sequence and timeline
- Consider: who works in parallel? What depends on what?

### Do
1. Send trainer their sub-goal (SM training + KB/SKILL.md updates)
2. Send hiveMindTeam expert the DRY fix sub-goal
3. Send hiveMindTeam tester the verification sub-goal
4. Ensure each agent reads the FULL plan first, then enters plan mode for their sub-goal
5. Approve agent plans only when ALL 7 criteria are met (see full plan)

### Check
- Monitor: did trainer successfully train SM? (capture SM, see if it's monitoring intelligently)
- Monitor: did hiveMindTeam deliver the DRY fix? (test `hiveMind send`)
- Monitor: did KB #27-29 get acknowledged?

### Act
- Report results to PO: what was delivered, what failed, what needs decisions
- If an agent's plan is incomplete, send them back to improve it

## Agent Sub-Goals to Delegate

**Trainer**: "Read the full plan. Your sub-goal: (1) Train SM on intelligent monitoring — SM must independently detect working agents, assess burn risk, and act through you to compact before 0%. (2) Write KB #27-29 dissemination into all affected SKILL.md files. (3) Add common skills section (web4, CMM, PDCA, WODA) to every SKILL.md. Enter plan mode for your approach. Your mini-PDCA: plan training approach, train SM, check SM's first monitoring cycle, adjust."

**hiveMindTeam expert**: "Read the full plan. Your sub-goal: Implement DRY send consolidation per session/tasks/dry-send-consolidation.md, Option C. Make hiveMind.send() call otmux.send.enter() by default. Remove hiveMind.send.enter() (redundant). Enter plan mode for your approach. Your mini-PDCA: plan code changes, implement, test, verify no regressions."

**hiveMindTeam tester**: "Read the full plan. Your sub-goal: Verify DRY send consolidation works. Test: hiveMind send appends Enter, old send.enter removed, no regression in otmux.send. Enter plan mode for test cases. Your mini-PDCA: plan tests, execute, check results, report."

## SM Role (special — no plan mode)

SM does NOT enter plan mode. SM monitors continuously:
- Approve permission prompts (NEVER option 1, always option 2/3/4)
- Enforce OOSH script usage (catch raw tmux)
- Enforce role boundaries (catch agents doing others' work)
- Monitor context levels (alert trainer at <20%)
- Remove impediments

SM was already given monitoring task — it's already running.

## Budget
Weekly 81%, cap 92%. 11% budget. Be efficient — coordinate, don't implement.

## Communication
- Use `hiveMind send` for short messages (but note: Enter not appended yet until DRY fix ships — send Enter separately)
- For longer content: write task files to `session/tasks/`, send agents "Read session/tasks/<file>.md"
- Report results to PO in `session/tasks/orchestrator-results-report.md`
