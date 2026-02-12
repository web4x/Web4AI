# Product Owner Agent Context

**Session**: product-owner@opus
**Role**: product-owner
**Pane**: projectTeam:0.4
**Updated**: 2026-02-12T12:45Z
**State**: compacting — healthy, proactive

## CURRENT GOAL

Governance + CMM4 oversight. Interact only with Tron. Route through orchestrator. Task agent tracks all tasks now.

## COMMUNICATION HIERARCHY

```
Tron (user) <-> PO (me)
                  |
             Orchestrator
              /     |     \
     Expert+Tester  SM   Writer+Scribe
                    |
              Task Agent (central tracker)
```

## ACTIVE — Routed, Awaiting Verification

All routed to orchestrator or trainer. Task agent should be tracking these.

1. **Dashboard in scrumMaster script** — expert builds, SM runs every sweep (20260212T1240Z)
2. **web4.scenario.env KB article** — expert writes, scribe reviews (20260212T1230Z)
3. **hiveMind /tmp/ → ~/config/ migration** — expert implements (20260212T1225Z)
4. **Action→method conversion** — expert, 1/hour recurring (20260212T1215Z)
5. **ossh specialists** — trainer creates 3 agents: ossh-expert, ossh-tester, ossh-po (po-new-ossh-agents.md)
6. **Task agent as central tracker** — trainer updates all SKILL.md (20260212T1235Z)
7. **DRY KB integration** — trainer links usage.md in every SKILL.md (20260212T1136Z)
8. **CMM4 "assuming=CMM2" sharing** — trainer → all agents (20260212T1145Z)
9. **Error suppression ban** — trainer shares anti-pattern (20260212T1205Z)

## VERIFIED DONE

- [x] Task queue rule in all 11 SKILL.md
- [x] Achievement files (PO, expert, SM)
- [x] CMM web4x KB articles (cmm-web4x.md, usage.md)
- [x] Scribe hourly KB improvement cycle directive
- [x] Peer compact protocol fixed
- [x] Expert old flat context file flagged to trainer

## KEY DECISIONS

- Task agent = central task tracker, all agents report completion to it
- Dashboard belongs in scrumMaster script (not hiveMind)
- Config pattern: ~/config/*.env (web4.scenario.env) — NOT /tmp/
- Script specialists: PO+trainer can always create more, each CMM4-driven
- DRY highest directive: write once, link everywhere
- Assuming = CMM2. Always measure.
- Never suppress errors (no 2>/dev/null || echo)
- Check own context regularly: `claudeCode context.read projectTeam:0.4`

## FAILURES (5 this session — all learned from)

- F1: Assumed trainer quota limit from 10-line capture
- F2: Wrote SM context FOR it instead of triggering
- F3: Reported SM "stuck" without fresh verification
- F4: Suppressed errors with 2>/dev/null || echo
- F5: Not monitoring own context proactively

## RECOVERY STEPS

1. "I am the Product Owner agent."
2. Read `.claude/agents/product-owner/SKILL.md`
3. Read `session/agents/product-owner/context.md` (this file)
4. Read `session/agents/product-owner/backlog.md`
5. Read `session/agents/product-owner/learnings.md`
6. `claudeCode context.read projectTeam:0.4` — measure context
7. `otmux pane.capture projectTeam:0.3 30` — check SM
8. `otmux pane.capture projectTeam:0.0 30` — check orchestrator
9. Ask Tron for next directive
