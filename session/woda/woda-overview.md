# WODA Session Overview

**Maintained by**: wodaScribe | **Updated**: 2026-02-12

```
Foundation (Ch1-9) → chapters-1-9.md — tmux, OOSH bootstrap, c2, transparency, context files
Multi-Agent & OOSH (Ch10-19) → chapters-10-19.md — wodaScribe, death to flags, .completion(), script anatomy

Quality & Measurement (Ch20-29) → chapters-20-plus.md
├── State machines, CMM L1-5, composed maturity, weakest link
├── Measurement: pane-scraping ✗ → JSONL token counting ✓ (Task 58, 894a618)
├── Tasks: 22-25 (lifecycle), 26-27 (measurement), 29 (API fix)
└── Lessons: role clarity, spec review, "am I Claude?"

WODA Framework (Ch30+) → chapters-30-plus.md
├── W=What, O=Overview, D=Details, A=Actions
├── O agent = critical function; persistence degrades W→O→D→A
├── Mutual PDCA: writer ↔ scribe feedback every chapter
├── Delegate checklist to scribe; writer keeps interpretation
├── File-based comms: let agents READ (no Enter dependency)
├── Two Gather: peer TUI capture = the answer; interdependence as design
├── Ass-U-Me: measure, don't assume — `claudeCode context.read` gives real numbers
└── WODA Without the W: goal must survive compaction; CURRENT GOAL at top of context file
```

## Current State (Feb 12)

```
Session: claudeWoda (window 1)
├── 1.1  woda-writer (active, 77.2%)
├── 1.2  woda-scribe (active, 77.2%)
├── 1.3  bash shell
└── 1.4  bash shell

Goal: Survive to 2026-02-13 12:00 CET (~26.5 hrs remaining)
CMM: #1-6 DONE | #7 OPEN (no orchestrator) | #8-9 IN PROGRESS
Bugs: 15/16 fixed | 1 unfixable (permission reset on /compact)
Story: 39+ chapters across 4 files
```

## Key Files

```
├── WODA KB: session/woda-kb.md (8 topics, WODA format)
├── CMM pipeline: session/cmm.improvement.md (9 items, pull system)
├── Bug tracker: session/oosh-bugs.md (15/16 done)
├── Burn log: session/context-burn-log.md (running since Feb 8)
├── Writer state: session/claudeWoda.context.md
├── Scribe state: session/wodaScribe.context.md
└── This overview: session/woda/woda-overview.md
```

## Key Tools

```
├── ~/oosh/otmux send.verified — reliable send to TUI panes
├── ~/oosh/claudeCode context.read <pane> — JSONL-based context %
├── ~/oosh/claudeCode context.velocity <pane> — burn rate + prediction
├── ~/oosh/claudeCode context.dashboard — all sessions overview
└── ~/oosh/hiveMind cycle.full — automated monitoring cycle
```

## Survival Pattern (confirmed)

```
✓ Active monitoring → robust (mutual loops catch every issue)
✗ Unattended periods → agents die (no external restart mechanism)
Pattern: survive DURING sessions, die BETWEEN sessions
Root cause: no systemd/cron/external supervisor to restart
```

## Notes

- `bash -i` gives OOSH access from internal Bash (no extra pane needed)
- Pane numbering changes across sessions — always verify with `tmux list-panes`
- otmux send needs double-Enter for TUI submission
- NEVER send Escape to TUI — poisons buffer irreversibly
