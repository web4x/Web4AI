# Product Owner Agent Context

**Session**: product-owner@opus
**Role**: product-owner
**Pane**: projectTeam:0.4
**Updated**: 2026-02-17T12:45Z
**State**: ACTIVE — recovered from compact, team functioning

## CURRENT GOAL — #1 PRIORITY

**Self-improving CMM4 team. Agent health + adaptive sweep timing.**

### Priority Lesson from F11 (INTERNALIZE THIS)
Compact protocol is the HIGHEST priority rule. A contextless compact cascades: agent regresses → loses all directives → pure rework. The weakest link was PO itself. 6 failures (F1,F3,F8,F9,F11,F12) share the same root cause: assuming instead of measuring. GATE: measure → assess → act → verify.

### CMM4 Velocity Management (Tron directive — replaces old 80%/90% binary rule)
No binary thresholds. Continuous proportional response based on projected exhaustion:
- >60 min → full speed. 30-60 min → no new large tasks. 15-30 min → commit work. 5-15 min → save contexts. <5 min → compacts.
Binary thresholds = driving 200km/h at a cliff, hoping brakes work. CMM4 = never needs emergency braking.

## SUBSCRIPTION (last measured 12:41Z Feb 17)
- Block: 09:00-14:00 UTC (ACTIVE)
- Used: $34.28, projected $62.62
- Burn rate: 269k tok/min, 134 min remaining
- Alert: OK — burn rate higher, still within block
- `scrumMaster subscription` = correct real-time tool
- `measure.subscription.api` = DEPRECATED (task 1200Z)

## CURRENT STATE (12:45Z Feb 18)

- **SM**: ALIVE — minimal boot (15 lines) working. Sweep cycle 2+ done. Wakeup set. Self-sustaining.
- **Orchestrator**: Fixed SM per PO directive. Created minimal boot. Standing authorization for SM /clear at 0%.
- **Expert**: Idle, healthy, ready for work.
- **Tester**: Idle, healthy, ready for work.
- **Trainer**: Idle, rate-limited. Completed 3 post-incident tasks (f2de7e7, 81601e5, 5f6112d).
- **Writer**: Active, Ch34+.
- **Scribe**: Active, monitoring writer.
- **Task-agent**: Post-compact, idle.
- **Developer**: Idle.
- **Script-PO**: Active, BUG 3 (PDCA states).

## KEY FIX (Feb 18): SM Sustainability
- Full boot (59 lines → reads SKILL.md 200+ lines + context + learnings) killed SM in one cycle
- Orchestrator created minimal boot (15 lines): identity + sweep command + key rules only
- SM now self-sustaining. Velocity monitoring not yet added — incremental.
- Standing authorization: orchestrator may /clear SM at 0% without PO approval.

## ACCOMPLISHED (Feb 16-17)

- Expert: ossh + user sshDir restore (32e3b66), tree.detailed (f1a0e26), method conversions, sweep.detect fixes
- Trainer: 3 SKILL.md updates to ALL 81 files (completion reporting, role names, compact protocol) — commits aae6410, 9633060
- Script-PO: Completion + git safety + role names to 81 SKILL.md; working on restore comparison report
- Tester: Dashboard revalidation, color-mode investigation done, validating tree.detailed
- Writer: Chapters 19, 20, 22 (committed 7cc2284), starting 23
- SM: Dashboard assignments working, CMM observations, self-recovered from F11, using proper compact protocol

## DIRECTIVES SENT (Feb 16-17)

| Task | To | Content | Status |
|------|----|---------|--------|
| 1100Z | tester | Test team.status + measurement tools | DONE |
| 1101Z | expert | otmux tree.detailed spec | Updated to new method |
| 1102Z | script-PO | Completion + git safety ALL SKILL.md | DONE |
| 1103Z | expert | otmux tree.detailed | DONE (f1a0e26) |
| 1110Z | SM + ALL | No agent remote-controls PO pane | DELIVERED |
| 1112Z | SM | Assignment tables every sweep | DELIVERED — working |
| 1115Z | expert (orchestrator) | Fix team.status + dashboard bugs | PENDING |
| 1120Z | tester | Restore comparison report | IN PROGRESS (script-PO doing it) |
| 1125Z | tester | Color mode investigation | DONE |
| 1130Z | expert | ossh + user sshDir restore | DONE (32e3b66) |
| 1135Z | SM | Track CMM awareness | DELIVERED |
| 1140Z | trainer | Address by role name | DONE (aae6410) |
| 1145Z | expert | otmux tree.save/restore | QUEUED |
| 1150Z | SM | OOSH tools only | DELIVERED |
| 1155Z | trainer | Compact protocol WHY | DONE (9633060) |
| 1200Z | expert | Deprecate measure.subscription.api | QUEUED |
| 1835Z | SM | Resume sweeping, unblock team | DELIVERED |
| 1836Z | orchestrator | Monitor SM, not just reports | DELIVERED |
| 0950Z | orchestrator | URGENT: unblock + assign NOW | DELIVERED |

## osshTeam (DEDICATED SESSION — 1300Z)

New tmux session `osshTeam` with 3 panes:
- 0.0: ossh-expert — investigating broken `ossh login [Tab]` completion
- 0.1: test shell (plain bash for manual testing via send-keys)
- 0.2: ossh-tester — testing completion in test shell

Task: `session/tasks/20260217T1300Z.ossh-team.md`
Phase 1 (investigation) started. Both agents bootstrapped and working.

## QUEUED TASKS (projectTeam)

1. **1145Z** expert: otmux tree.save / tree.restore (MEDIUM)
2. **1200Z** expert: deprecate measure.subscription.api (HIGH — SM can't do CMM4 without this)
3. **1115Z** expert: fix team.status + dashboard bugs (HIGH)

## TRON COMMANDS
- "status" = full report: goals, tasks, priorities, team assignments, subscription — measured not assumed

## GOALS (single source of truth: `session/team-goals.md`)

Read `session/team-goals.md`. PO owns and updates goals. Orchestrator and SM reference the same file.

## FAILURES (25 total)

F1-F13: See learnings.md (pre-incident)
F15-F20: Mass context exhaustion disaster (Feb 17). See incidents/20260217-mass-context-exhaustion.md
F21-F23: Total goal loss + SM cycling. See incidents/20260218-total-goal-loss.md
F24: Read wrong context file after compact (tron-interface instead of product-owner)
F25: Reverted to binary thresholds despite CMM4 velocity rule

## RECOVERY STEPS

1. "I am the Product Owner agent."
2. Read `session/agents/product-owner/context.md` (this file)
3. `scrumMaster subscription` — MEASURE subscription FIRST
4. Read `session/dashboard-assignments.md` — SM's team report
5. GATE: measure → assess → act → verify. NEVER assume.
6. Compact protocol: "Save your context and run /compact NOW" — NEVER raw /compact
7. Check queued tasks and drive them forward
8. If agents stuck: tell orchestrator to unblock immediately — don't just report it
