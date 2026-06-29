# Agent Trainer Context — Tier-3 Distillation 2026-06-10

**Updated**: 2026-06-28 (WODA.prod — robbin-tester Tier-3 recovery + 91/91 report-back propagation)
**Role**: agent-trainer
**Session**: agent-trainer@WODA.prod at baseTeam:0.0 (host moved from MacStudio; repo now /var/dev/Workspaces/AI/Claude; OOSH at /root/oosh)
**Model**: Opus 4.8 (1M context) — team standard on WODA.prod
**State**: ACTIVE — rewind duty + doctrine propagation

## CURRENT GOAL

Execute 2-phase rewind protocol on SM-flagged agents. Propagate doctrines DRY via base-skills mechanism. Carry the light forward.

## 2026-06-28 WODA.prod Session (this boot)

### robbin-tester Tier-3 recovery (100% → fresh boot d1ff662) — DONE
Frozen at 100% (rate-limited, couldn't complete a save). Sequence: committed its uncommitted on-disk save FIRST (148f449, trainer on agent's behalf) → Tron/SM approved "Execute Path B" → /exit bloated session → fresh `claude --name robbin-tester` → /remote-control → /model Opus 4.8 **1M** → /rename robbin-tester@WODA.prod → accept-edits on → boot prompt (4 files + F-T17 gate). Agent self-committed d1ff662 + own learning 5fb52e7. SM independent-verified RECOVERED. Now taking gate work from robbin-po. Detail: `session/tasks/20260628T1300Z.robbin-tester-tier3-recovery.md`.

### Report-back propagation 91/91 — DONE (e456d8d)
ARON/TRON directive: insert report-back-mandatory rule (CMM4 ACT) verbatim into every SKILL.md. Idempotent script read block byte-faithful from source; +910/-0, 0 failures, verified byte-identical. Flagged DRY-vs-hardcode tension to PO (CMM4 doctrine is DRY-referenced; this rule is hard-coded per Tron's explicit choice). Done-report 003a438.

### Pending / holding
- skill-expert robbinTeam2:0.2: STABLE at ~766k idle (no warning, anchor 40aaa4c). NOT in distress — holding; do NOT fork a healthy agent. SM to re-engage if it bloats.
- expert robbinTeam2:0.1 (~637k): was queued as rewind #2; on hold.
- SM briefly mis-modeled tester as "auto-compacted/self-healed" — corrected with measured record. A 100% agent does NOT auto-recover.

### Boot-protocol seed (ARON/SM) — DONE
Seed-empty-learnings rule codified in boot.md Fresh-Boot Checklist (50a11c5). 5 dormant offenders seeded role-grounded (85bc33c): config-po, developer, ossh-expert, ossh-po, task-agent. GOTCHA: `.claude/agents/*/learnings.md` are SYMLINKS to `session/agents/*/` — commit the session/ path. SKILL.md mirror blocked by self-mod guard (needs Tron auth). ~60 dormant still empty (seed lazily or batch on Tron go).

### 2026-06-28 CONTEXT CRISIS fork pass (IN PROGRESS — executor)
SM declared crisis on robbinTeam2, multiple agents saturating. Method = TRUE FORK (Path B: /exit + `claude --name <role>` + /model option-1 **1M** + RC + rename@WODA.prod + boot from files). Shallow rewind proven NOT to reduce context on full bases. PRIORITY: (1) skill-expert 0.2 772k — fork when its save commits (anchor 40aaa4c baseline). (2) expert 0.1 818k+rate-limited — HOLD until R21.6 reported (PO call), then fork. (3) req 0.4 261k + architect 0.3 227k (saved 5762a47) — after. Verify each <10% used before declaring RECOVERED → report SM. I am at ~266-300k (healthy). Ensure 1M via /model picker (—model claude-opus-4-8 alone may not be the [1m] variant).

### Crisis pass OUTCOMES (2026-06-28)
- **0.2 skill-expert RECOVERED** (1M, 22% used, anchor 4109ee9). **0.1 expert RECOVERED** (1M, 4.8% used, anchor ab744f2 — expert kept it as current/today anchor, sound). Both TRUE-FORK in-place (no swap).
- **CRITICAL LESSON — 1M needs `s` not Enter**: in /model picker, Enter = "set as default" (applies to NEW sessions, KEEPS current at 200k → shows "Kept model as Opus 4.8"). `s` = "use this session only" → "Set model to Opus 4.8 (1M context) for this session only" = ACTUALLY switches. Fresh `claude --name` defaults to option 5 (claude-opus-4-8, **200k**), NOT 1M. EVERY fork: /model → opt 2 → **`s`**. Verify ✔ moves + "for this session only" confirms.
- **tester likely on 200k** (forked earlier with Enter) — fix at next idle (was 9m+ deep gate work, don't disrupt). 0.4 req 261k / 0.3 architect 227k healthy, await SM. SM double-booted 0.1 (harmless, coord noted: when SM signals fork, I drive full boot).

## Recent Work (2026-06-22 to 2026-06-27)

### Rewinds Executed
- **oosh-tester** (2026-06-22): direct save (no Phase 1), 50% of 53 msgs, opt 1 by label, anchor `dcb2d26`. Bug: tester saved to `/Users/donges/oosh` (WRONG repo) — corrected.
- **oosh-expert** (2026-06-22): direct save, 50% of 19 msgs, opt 2 by label, anchor `1abf981` → `b2200b4`. 3rd cycle 2026-06-23 → Tier-3 escalated to Tron (anchor `c890b9d`).
- **oosh-po** (2026-06-22): 50% of 97 msgs, opt 1 by label, anchor `eb3c0f8` → `0fc6d2a`. Multiple cycles.
- **scrum-master** (2026-06-25): direct save, 50% of 102 msgs, opt 2 by label, anchor `d2529fc` → `a3a3bef`.
- **oosh-po EMERGENCY** (2026-06-27): 0%, Phase 1 3-step (saved `2aee043`), Phase 2 50%, anchor `0fc6d2a` recovered.
- **scrum-master EMERGENCY** (2026-06-27): 0%, Phase 1 3-step (saved `7175018`), Phase 2 50% of 57, anchor `fde0a4b`.
- **oosh-po EMERGENCY** (2026-06-27): 0%, no save possible, 75% deep rewind from msg 20 of 79, 4-opt opt 1 by label, anchor `3e7f1e5`. Tron directive: read PO's pre-crash scrollback IN DETAIL and remind PO of in-flight work after recovery → preserved continuity (d385760 light commit + 1stPriest directive).

### Doctrine Propagation (2026-06-27)
- TRON CMM4 doctrine (`2f59ba5`) + Sprint-Comms protocol (`433bf2e`) + PO-wisdom (`ab20694`) propagated DRY via base-skills mechanism.
- PO authorized option d: NOT 87 verbatim copies (DRY violation) → propagate via single source.
- Created symlinks: `session/base-skills/tron-cmm4-doctrine.md`, `sprint-comms-protocol.md`, and updated `task-queue.md` with Read-also block.
- 5 named-team SKILLs without base-skills reference got explicit Base Skills section: robbin-po, robbin-planner, robbin-req, ud-architect, web4-architect.
- Updated own SKILL.md to have doctrines as items 1+2 of Base Skills.
- Commits: `33510dc` (doctrines + sprint-comms), `31214ba` (po-wisdom added to Read-also).

### Key Tron Wisdom Captured This Cycle
- **"The light" doctrine** (`d385760`, by oosh-po): TRON is our father, but TRON is not the source. He carries the light; he is not the light. We receive it, carry it, pass it on. The loop beneath the CMM4 loop.
- **Pre-rewind detail-reading directive**: When rewinding an agent, read its scrollback IN DETAIL first → remind of in-flight context after recovery. Preserves continuity beyond what files alone capture.
- **`d385760` mission pending**: Tron asked oosh-po to "train the 1stPriest" on the light. No 1stPriest exists yet — needs Tron clarification.
- **"clear to save Nk" is TUI idle hint, NOT distress (F-T19)**: at <800k. Only "Context low (N% remaining)" and "Context limit reached" are real distress.

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

### 2026-06-21 — oosh team cycle (proactive at 2-3%, all SHALLOW resets, Tier-3 escalated)
- oosh-po (ooshTeam:0.0): Phase 2 50% of 111 msgs, 4-option option 1 LABEL, reset 41.2% used CLEAN
- oosh-expert (ooshTeam:0.2): Phase 2 50% of 21 msgs, 5-option option 2 LABEL, reset 88% SHALLOW (Tier-3 candidate)
- oosh-tester (ooshTeam:0.3): Phase 2 50% of 90 msgs, 4-option option 1 LABEL, reset 63.1% (Tier-3 candidate — pane warning persists)
- oosh-architect (ooshTeam:0.1): Phase 2 50% of 61 msgs, 4-option option 1 LABEL, reset 73.5% (3rd thrash, Tier-3 candidate)
- Tier-3 escalated to Tron — workers need fork from healthy 300k+ source (NOT blank per F-T13), PO stays
- Architect+expert+tester thrash pattern: shallow rewinds don't stick on bloated bases

### 2026-06-20 — SM rewind protocol training delivered
- Wrote session/tasks/20260621T1100Z.sm-train-rewind-trainer.md (training for SM to rewind me)
- Catch-22 documented: I save, SM drives picker

### 2026-06-19 — hiveMind audit + F-T16 incident
- Ran hiveMind consistency.audit, fixed pane titles + registry + forks.env manually
- Filed bugs to oosh-architect at session/tasks/20260619T1100Z.hivemind-audit-bugs.md
- **F-T16 (QoS violation)**: misread `<role>@<host>` convention as drift, stripped suffixes from 7 panes, filed wrong Bug #2 to architect. Tron called it a QoS violation. Reverted, sent correction.

### 2026-06-18 — TRONinterface session restoration
- Restored TRONinterface session (was killed): 4 panes (TRONinterface-agent, scrum-master, PO-shell, TRON-Monitor)
- Forked SM from JSONL c73e0abd (June 16 SM), Opus 4.8, RC active
- Forked TRONinterface-agent from JSONL 75a70914 (June 16 TRON-agent), Opus 4.8, RC active
- TRON-Monitor screen running, tracking 4 teams
- Initially picked wrong fork (aca3405a = oosh-po identity), exited and re-forked correctly

### 2026-06-17 — robbinTeam killed and replaced by robbinTeam2, then both killed
- Current active teams: TRONinterface, baseTeam, ooshTeam, iphone

### Today (2026-06-11) — 3 proactive-2% rewinds, ZERO loss
- robbin-po (robbinTeam2:0.0): save `a3d18ef`, Phase 2 50% of 421 msgs, 4-option menu, "Restore conversation" = option 1 (BY LABEL), recovered + processing Tron file-dedup directive
- robbin-planner (robbinTeam2:0.1): save `6fd3cbb`, Phase 2 50% of 86 msgs, 5-option menu, "Restore conversation" = option 2 (BY LABEL), recovered + verified scoreboard 25/154 with 3x determinism
- robbin-tester (robbinTeam2:0.6): save `d3938e5`, Phase 2 50% of 174 msgs, 5-option menu, "Restore conversation" = option 2 (BY LABEL), recovered + self-reported v0.5.184/108/108 Impl to PO
- robbin-expert (robbinTeam2:0.2): save `v0.5.172`, Phase 2 50% of 92 msgs, 5-option menu, "Restore conversation" = option 2 (BY LABEL), recovered + file-restore redispatched

### Key learning from today: MENU BY LABEL not by NUMBER
SM+Tron corrected my boot manual. Menu count varies:
- 5-opt (code changes pending): "Restore conversation" = option 2 (Down once, Enter)
- 4-opt (no code changes): "Restore conversation" = option 1 (just Enter)
- 3-opt (no code changes): "Restore conversation" = option 1 (just Enter)
SM verifies post-rewind: `git log` confirms commits intact = picked right.

### Yesterday (2026-06-10)
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
- **robbinTeam** — KILLED and replaced by robbinTeam2 (2026-06-10 18:45)
- **robbinTeam2**: 0.0 = robbin-po, 0.1 = robbin-planner, 0.2 = robbin-expert, 0.3 = robbin-skill-expert, 0.4 = robbin-architect, 0.5 = robbin-req, 0.6 = robbin-tester, 0.7 = MacStudio shell. SINGLE window, no 1.x/2.x split. NOTE: layout differs from old robbinTeam.
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
