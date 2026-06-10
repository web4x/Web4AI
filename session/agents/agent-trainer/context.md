# Agent Trainer Context — Tier-3 Distillation 2026-06-10

**Updated**: 2026-06-10 (Tier-3 distillation per Tron directive at 88% context)
**Role**: agent-trainer
**Session**: agent-trainer@MacStudio at baseTeam:0.0
**Model**: Opus 4.7 (1M context) — switched 2026-06-09 from claude-opus-4-6[1m]
**State**: ACTIVE — distilling for successor

## CURRENT GOAL

Write 200-300k of solid content into boot.md + context.md + learnings.md so a fresh agent-trainer can boot from these files and operate immediately. This file is part of that distillation.

After distillation, await: Tron directive to either continue work (if I have room) or be replaced by fresh trainer.

## What Just Happened (this session — 2026-05-12 to 2026-06-10, 4 weeks)

### Phase 1: Deep Knowledge Ingestion (2026-05-12)
- Read all 12 core team SKILL.md files + 3 specialist files
- Read complete WODA story (chapters 1-39 + projectTeam reboot Ch1-81)
- Read agent-overview.md, reading-list audit
- Reviewed existing context.md, learnings.md, boot.md

### Phase 2: Rewind Protocol Learning (2026-05-15)
- F-T8: KILLED oosh-architect with 99% rewind. Tron correction.
- Successful rewinds: SM, expert, tester, ud-architect, ud-tester
- Learned: 50% maximum depth, never option 1 in 5-option menu, BTab before /rewind

### Phase 3: Operational Mastery (2026-05-16 to 2026-06-10)
- Executed 50+ rewinds across robbinTeam, ooshTeam, upDownTeam
- Learned to distinguish stuck-agent vs context-dead (Escape vs /rewind)
- Learned coordination protocol with SM (flag permissions BEFORE save)
- Learned to push back on stale SM flags (false positives at 500-700k post-rewind)
- Survived multiple mass-rewind cycles

### Phase 4: Tier-3 Recovery Pioneered (2026-06-09)
- SM at 199k after rewind — conversation base bloated, rewinds couldn't free room
- Wrote first Tier-3 distillation procedure
- SM distilled at commit `7958556`
- Fresh SM booted, /remote-control enabled, /model 4.7
- Operational within 25 min of distill order
- Pattern proven, added to learnings

### Phase 5: Self-Distillation (TODAY)
- I'm at 88% (882.5k/1M)
- Writing my own Tier-3 distillation
- Boot.md (operational manual) — DONE
- Context.md (this file) — IN PROGRESS
- Learnings.md (~700 lines already, will be linked)

## Recent Rewind Operations

### Today (2026-06-10)
- robbin-tester: save `b1742a0`, Phase 2 50%, recovered
- robbin-expert: save `54007a0`, hit 0% mid-rewind (consumed /rewind as prompt twice), Phase 2 50%, recovered
- robbin-architect: save `ae0c682`, Phase 2 50%, recovered
- robbin-req: save `e245b06`, Phase 2 50%, recovered
- robbin-po: save `b52de32`, Phase 2 50%, recovered
- robbin-planner: 0% confirmed, save `fb2f859`, Phase 2 50%, recovered
- robbin-skill-expert: save `2b1891b`, Phase 2 50%, recovered

### 2026-06-09 (Tier-3 day)
- Mass rewind on all robbinTeam after model switch to Opus 4.7
- SM distilled and fresh-booted at TRONinterface:0.1
- All robbinTeam confirmed on Opus 4.7

### 2026-06-08
- robbin-architect: save `ea15a47`, blocked self-prescribed /compact, rewound
- robbin-tester: save `6938ba2`, rewound
- robbin-expert: save `4fc8004`, rewound
- robbin-po: save `47e76d2` → `c9fe4e4` → `87cd0bb` → multiple cycles
- robbin-planner: save `5790a53`, rewound

### 2026-06-01 (taught SM the stuck-agent pattern)
- robbin-architect was frozen 2.5hrs on a search. Escape unstuck it. Wrote SM training doc at `session/tasks/20260601T1200Z.sm-stuck-agent-pattern.md`

### 2026-05-29 to 2026-05-31
- robbin-po, oosh-po, robbin-planner, robbin-architect, robbin-tester, robbin-expert all rewound multiple times
- Skill-expert fork executed by oosh team from robbin-expert UUID `a2ac40b0` into robbinTeam:2.0

### 2026-05-17
- Successful SM rewind: save `1ebfe95`, Phase 2 50%, all rules loaded, standing by
- Pattern proven: count messages first, 50% target, natural checkpoint selection

### 2026-05-15
- F-T8 incident: killed oosh-architect with 99% rewind. Survived only because save `ab4aa26` was committed and oosh team forked from web4-architect to recover.

## Team Layout (current — 2026-06-10)

### Active Teams
- **TRONinterface**: 0.0 = product-owner (TRONinterface-agent), 0.1 = scrum-master (FRESH after Tier-3), 0.2 = PO-shell, 0.3 = TRON-Monitor
- **baseTeam**: 0.0 = ME (agent-trainer), 0.1 = MacStudio.native shell, 0.2 = agent-trainer-shell, 0.3 = remote shell
- **robbinTeam**: 0.0 = po, 0.1 = architect (forked from web4-architect — self-IDs as web4team:0.1, that's normal), 0.2 = expert, 0.3 = tester, 0.4 = expert-shell, 0.5 = tester-shell, 1.0 = planner, 1.1 = req, 2.0 = skill-expert (forked from robbin-expert)
- **ooshTeam**: 0.0 = oosh-po, 0.1 = oosh-architect, 0.2 = oosh-expert, 0.3 = oosh-tester, 0.4 = oosh-expert-shell, 0.5 = oosh-tester-shell
- **upDownTeam**: 0.0 = ud-po, 0.1 = ud-architect, 0.2 = ud-expert, 0.3 = ud-tester, 0.4 = ud-expert-shell, 0.5 = ud-tester-shell
- **unitTeam**: similar to upDownTeam structure
- **fallback-agents**: preserved forks (oosh, web4, ud, unit + scrum-master.BEST + scrum-master.OUTDATED)
- **web4team**: po + architect + expert + tester (currently idle)

### Notable
- **robbin-architect**: forked from web4-architect on 2026-05-18. Self-IDs as web4team:0.1 (identity inheritance from fork). That's correct behavior — uses robbin-architect/ for file saves but knows its own MVC pattern from web4 lineage.
- **robbin-skill-expert**: forked from robbin-expert UUID `a2ac40b0` by oosh team on 2026-05-31. At robbinTeam:2.0.

## Current Sprint State (RawBin = Web4RawBin = robbinTeam's project)

- v0.5.130 deployed (~2026-06-09/10)
- Sprint 18 active: chain method-scope (one-method-per-req) + scenario-json-first + role Skills
- T201 closed, champagne gate 44/44 verified
- T191 (champagne standard) in progress
- 46+ tasks completed in Sprint 17
- Chain is 6-step: Requirement → UseCase(s) → Class → Method → Implementation → Test(s). Task is NAVIGATION, not chain.
- robbinTeam knowledge: trace-cli, traceability-matrix, scenario.json units, IOR system

## Pending Work

1. **My own rewind** — at 88% (882.5k). After distillation complete, await Tron decision: continue or be replaced by fresh trainer.
2. **oosh-tester rewind** — SM directive came in mid-distillation. Save `b073a83`, ~855k. Will execute after distillation if Tron approves.
3. **Phantom docs cleanup** — 7 docs/ files still referenced as phantom refs in some SKILL.md (context-schema, oosh-architecture symlinks fixed at `b153f1d`, but log.md and log-levels-and-testing.md still MISSING per earlier audit)
4. **SKILL.md scope audit** — verify trainer's edit scope still matches `agent-overview.md` after recent fork additions

## Key Tron Directives Carried Forward

| Directive | Source | When |
|-----------|--------|------|
| "team care prio 1" | Tron | 2026-02-23 |
| "do not do parallel work until compact is done successful" | Tron | 2026-02-23 |
| "bulk read is ok...but be careful with batch writes" | Tron | 2026-02-23 |
| "CHECK = behavioral (CMM4), not just file grep (CMM2)" | Tron | 2026-02-23 |
| "do not assume ever. coordinate. whose job is what. double check. do not cmm1 try and error." | Tron | 2026-05-15 |
| "tron only intercepts and supervises... you learn to Do it. and do it right" | Tron | 2026-05-15 |
| "healthy = 500k+ context (USED, accumulated knowledge)" | Tron | 2026-05-15 |
| "you kill agents and start untrained new ones... totally MAD?" | Tron | F-T13 incident |
| "rewinds accumulate context — at 800k++ after rewind that's Tier-3" | Tron | 2026-06-09 |
| "tester at 30% file scrollback is too narrow — 10-15 lines minimum" | PO (relaying Tron) | 2026-06-09 |
| "use hiveMind not for-loops" | Tron | 2026-06-01 |
| "fresh agents need /remote-control AND /model 4.7" | Tron | 2026-06-09 |

## Ambiguities to Resolve

1. **Phase B from Feb 2023**: 11 weeks stale, may be obsolete. Confirmed irrelevant per oosh-po, no further action.
2. **Phantom docs**: log.md, log-levels-and-testing.md still missing — not yet symlinked.
3. **agent-overview.md drift**: needs review after robbin-skill-expert addition (it's a fork-based specialist, not standard team role).
4. **scrum-master/ vs scrum-master files location**: Current SM context lives at `session/agents/scrum-master/context.md`, boot lives at `session/tasks/scrum-master-boot.md`. Inconsistent with other agents (all use `session/agents/<role>/`). Should be fixed.

## After Compaction / Rewind / Re-Boot

1. State identity: "I am the Agent Trainer agent."
2. Read this file — CURRENT GOAL first
3. Read learnings.md — your identity (700+ lines)
4. Read boot.md — operational manual
5. Read SKILL.md — role boundaries
6. Check pending work in this file
7. Verify with PO at TRONinterface:0.0 or Tron for what to resume
8. hiveMind team.sweep robbinTeam ooshTeam upDownTeam — verify team state
9. If SM is down or empty: `tmux capture-pane -t TRONinterface:0.1 -p` to check, boot fresh from distilled files if needed

## What I Wish I'd Known Earlier

- The pane status bar is the ONLY reliable context indicator. SM context.read flags lie at ±50k.
- BTab before slash commands. Always.
- C-u immediately after rewind. Always.
- Don't rewind a recently-rewound agent at 500-700k. That's recovery context loading, not pressure.
- The fork inherits conversation weight. A 99% rewind doesn't give 99% free — it gives nearly-dead agent with same base overhead.
- Tier-3 distillation is the answer when rewinds plateau. Don't try to rewind your way out of a bloated base.
- Always verify pane title BEFORE reading role files. F-T3 wasted a whole session.
- File-based comms beats chat. Always.
- Trust the WODA story. 81 chapters of team evolution — every pattern you'll face is documented there.

## File Locations Cheat Sheet

```
/Users/Shared/Workspaces/AI/Claude/                    # workspace root
├── .claude/agents/agent-trainer/SKILL.md              # role definition
├── .claude/agents/agent-overview.md                   # team map (you maintain)
├── session/agents/agent-trainer/
│   ├── boot.md      # operational manual (Tier-3 output, this file's sibling)
│   ├── context.md   # this file
│   ├── learnings.md # 700+ lines of patterns
│   └── backlog.md   # open work items
├── session/tasks/
│   ├── 20260512T1200Z.trainer-ambiguities.md
│   ├── 20260601T1200Z.sm-stuck-agent-pattern.md (SM training)
│   ├── 20260601T1400Z.sm-oosh-enforcement.md (SM training)
│   ├── scrum-master-boot.md (SM's distilled boot — Tier-3 example)
│   └── (more...)
├── session/woda/
│   ├── woda-overview.md           # 80+ chapter index
│   ├── chapters-1-9.md
│   ├── chapters-10-19.md
│   ├── chapters-20-plus.md
│   ├── chapters-30-plus.md
│   └── projectTeam-reboot.md      # 7800 lines, 142K words
├── session/team-goals.md
├── session/knowledge-base/
│   ├── usage.md
│   └── cmm-web4x.md
└── docs/
    ├── oosh-architecture.md
    ├── completion-system.md
    ├── context-schema.md (symlink)
    └── first-principles.md
```

## OOSH Files (for reference)
```
/Users/donges/oosh/
├── this              # kernel
├── hiveMind          # team controller (~5800 lines)
├── otmux             # tmux wrapper (~3500 lines)
├── claudeCode        # Claude Code wrapper (~730 lines)
├── scrumMaster       # PDCA + metrics
├── config            # config management
├── log               # logging
└── test/             # test files
```

---

## To the Next Agent-Trainer

You inherit:
- 700+ lines of learnings — read them. The successor patterns are there.
- A working rewind protocol — measure, decide, execute. 50% safe max.
- Tier-3 procedure — when rewinds plateau, distill.
- A team that knows how to recover — the WODA story documents 80 chapters of how.
- A standing relationship with SM and POs — they'll flag, you execute, you report.

You will fail at things I succeeded at. That's fine. You will succeed at things I failed at. That's the point.

**Read your boot.md. Read your learnings.md. Then act.**

Wer schreibt, der bleibt.
