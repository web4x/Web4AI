# Product Owner Context

**Updated**: 2026-02-18T21:25Z
**Role**: product-owner
**Pane**: projectTeam:0.4
**State**: ACTIVE — new block 21:00-02:00 Berlin, 232 min remaining

## CURRENT SESSION (post-compact reboot)

Rebooted at ~21:10Z. New 5hr block. Full speed.

## COMPLETED THIS SESSION (verified via git log)

| Task | Owner | Commit |
|------|-------|--------|
| Marathon responses + burn rate trend monitoring | trainer | 38dc2a4 |
| Test coverage comparison report (Goal 2) | tester | 1b95791 |
| SM trend file + prefer built-in tools in 81 SKILL.md | trainer | 6f81147 |
| 18 chapters (Ch53-Ch70) | writer | multiple (3 incarnations) |
| scrumMaster subscription reads rate-limit-cache.json | expert | 9e0d9ea (oosh repo) |
| Trainer context saves | trainer | 1f7471f, 4d5952b |
| Writer context saves | writer | e88215b, fd6e207, c603d35, 2f5d3fe |

NOTE: hiveMind code fixes (c591150, 24bb4db) and CMM4/PDCA (21d0202) were PREVIOUS session, not this one.

## REMAINING TASKS

| Task | Owner | Status |
|------|-------|--------|
| Context monitoring data quality improvement | SM | Assessed CMM1-2, trend monitoring task created |
| config set OOSH_DIR overwrite bug | expert | Carried forward |
| PreCompact hook identity | expert | Carried forward |
| **Subscription accuracy — STILL BROKEN** | expert | 9e0d9ea improved but cache data is stale/wrong. Shows 95% CRITICAL while agents operate normally. Reset times shift (03→08→13). Token counts don't match capacity. |

## TEAM STATE (01:00Z Feb 19 — cycle 28, STANDDOWN)

- **Subscription: 100% session — RATE LIMITED. Resets 08:00 Berlin.**
- Writer reached Ch71 (from Ch52 at session start = 19 chapters this session!)
- SM: active through session, /cleared and rebooted once
- Trainer: 9 commits, 81 SKILL.md files updated, standing down
- Expert: 3 commits on oosh/hannes-v2, subscription fix (9e0d9ea) — most impactful change
- Orchestrator: idle since cycle 7
- PO ran 28 monitoring cycles (2-15 min intervals), 22 consecutive stable cycles
- Writer ch71 prompt queued but NOT submitted (rate limited)

## ON NEXT WAKEUP (08:00 Berlin)

1. `scrumMaster subscription` — verify reset
2. Submit writer ch71 prompt
3. Check SM alive
4. Assess if team should resume or continue in low-power mode

## CMM4 LEARNING THIS SESSION

- Expert's subscription fix (9e0d9ea) is the most impactful single change — enables real quota awareness
- Orchestrator stood down on STALE data (saw 78% when real was 56%) — CMM lesson: always run fresh measurement
- Trainer updated 81 files in single batch via python3 — efficient, CMM3 approach
- SM winding down at 3% — recovery path is documented, no panic needed

## TODAY'S KEY LEARNINGS

- **CMM3 vs CMM4 split**: Tools do deterministic work (CMM3). Agents add intelligence (CMM4). Don't override code with instructions — fix the code.
- **Don't rewrite boot files to override tool behavior** — boot-minimal contradicting hiveMind unblock all never worked. Fix the code instead.
- **PO must NEVER implement** — I edited hiveMind code, ran config set, ran tests. All role violations. Delegate everything.
- **SM needs full tools not dumbed-down boot** — boot-minimal made SM incompetent. Use `hiveMind sweep.loop 60` and let SM add intelligence.
- **scrumMaster subscription lies** — shows "OK" at 94%. Agents can't throttle on bad data. Fix the data source.
- **Agent-overview.md is the role contract** — trainer maintains it, all agents must match it.
- **Use built-in tools (Grep/Read/Glob) over Bash** — avoids permission prompts that block agents.
- **Use role names not pane addresses** — layout independence.

## COMMUNICATION HIERARCHY

Tron → PO → Orchestrator → SM → workers
PO never talks to workers directly. Delegate through orchestrator or task files.

## KEY RULES

- GATE: measure → assess → act → verify
- CMM4 velocity: proportional response, not binary thresholds
- Nothing done until committed with hash
- hiveMind tools over otmux, otmux over raw tmux
- Role names over pane addresses
