# WODA Session Overview

**Maintained by**: wodaScribe | **Updated**: 2026-02-11

```
Foundation (Ch1-9) → chapters-1-9.md — tmux, OOSH bootstrap, c2, transparency, context files
Multi-Agent & OOSH (Ch10-19) → chapters-10-19.md — wodaScribe, death to flags, .completion(), script anatomy

Quality & Measurement (Ch20-29) → chapters-20-plus.md
├── State machines, CMM L1-5, composed maturity, weakest link
├── Measurement: pane-scraping ✗ → OAuth API ✓
├── Tasks: 22-25 (lifecycle), 26-27 (measurement), 29 (API fix)
└── Lessons: role clarity, spec review, "am I Claude?"

WODA Framework (Ch30+) → chapters-30-plus.md
├── W=What, O=Overview, D=Details, A=Actions
├── O agent = critical function; persistence degrades W→O→D→A
├── Mutual PDCA: writer ↔ scribe feedback every chapter
├── Delegate checklist to scribe; writer keeps interpretation
├── File-based comms: let agents READ (no Enter dependency)
├── Agent-trainer = leverage point (teach teacher → propagates)
├── Self-care = O function; context health = API data + signals
├── Ass-U-Me: "healthy" hallucinated — measure, don't assume
├── Two Gather: peer TUI capture = the answer; interdependence as design (Task.37)
├── Com Unique Action: no goal = no communication; direction unlocks parallel work
└── WODA Without the W: goal must survive compaction; CURRENT GOAL section at top of context file

projectTeam Reboot (NEW) → projectTeam-reboot.md — 6,481 words
├── Ch1: Eleven Empty Chairs — 11 agents, 7 stuck, Enter problem at scale
├── Ch2: The Team Wakes Up — 5 working, PO dies at 0% with best insight, SM as hero
├── Ch3: The Permission Economy — PO alive + learning WODA, 3 approver styles, 9 trapped commits
├── Ch4: The Directive That Flowed — Tron→PO→Scribe chain, 20 KB files, shortest path wins
└── Themes: bootstrap paradox, file-based comms, focus beats breadth, direct > engineered channels
```

## Active References

```
APIs & Endpoints
├── OAuth usage: GET https://api.anthropic.com/api/oauth/usage
├── Auth: security find-generic-password -s "Claude Code-credentials" -w
└── TUI commands: /usage /status /stats /context /cost

Key Files
├── Team overview: .claude/agents/agent-overview.md
├── Task.29: session/tasks/Task.29.subscription-measurement-fix.md
├── Task.34: session/tasks/Task.34.cmm-climbing-communication.md
├── Task.37: session/tasks/Task.37.peer-context-monitoring.md
└── This overview: session/woda/woda-overview.md

External
└── Why 4.0: github.com/web4x/codingWeb4/wiki/Why-4.0
```

## Known Issues

```
├── Enter submission: otmux send + Enter unreliable (Task.30)
└── claudeCode status: launches TUI instead of method (Task.26)
```

## Notes

- `bash -i` gives OOSH access from internal Bash (no pane 4 needed)
- Overview tree: 5 rules (short, derive, atomic, recovery, single owner)
- Pruning: collapse closed topic groups to single lines. Goal: under 60 lines.
