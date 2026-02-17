# WODA Session Overview

**Maintained by**: wodaScribe | **Updated**: 2026-02-16

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

projectTeam Reboot (NEW) → projectTeam-reboot.md — 52,786 words
├── Ch1: Eleven Empty Chairs — 11 agents, 7 stuck, Enter problem at scale
├── Ch2: The Team Wakes Up — 5 working, PO dies at 0% with best insight, SM as hero
├── Ch3: The Permission Economy — PO alive + learning WODA, 3 approver styles, 9 trapped commits
├── Ch4: The Directive That Flowed — Tron→PO→Scribe chain, 20 KB files, shortest path wins
├── Ch5: The Naming — /rename sweep, orchestrator 41min think, circular permission block, labels≠capability
├── Ch6: The Wrong Directory — trainer sprint (7 docs, wrong path), PO catches it, orchestrator's 8 correct words
├── Ch7: Tron Reads the Room — human reads same dynamics, SM gains compaction duty, Enter chain, WODA=4 attentions
├── Ch8: The Changing of the Guard — trainer/scribe compacting, expert/tester trained via Reading Lists, PO dashboard, orchestrator as heartbeat (55min), generational shift
├── Ch9: The Root Cause — Tron identifies PATH as permission fix, trainer 2nd gen working, scribe recovering, orchestrator at 59min, 7/11 active
├── Ch10: Nine of Eleven — trainer pushed 82 files, expert built pane scanner, task-agent organized 53 tasks, SM sweep works, PO philosophising at 1%, orchestrator coordinating, 9/11 active
├── Ch11: What You Can't Measure — 11/11 active, expert compacted fixing measurement tools, PO admits "I don't know", scribe built empty pipes, tester's first test, SM as medic (3 rescues), orchestrator as manager
├── Ch12: The Cambrian Explosion — trainer created 33 script specialist teams (~100 files), developer's first task (committing), expert rebuilt from learnings, tester corrected on role boundary, PO becoming config architect, orchestrator invented metrics via arithmetic, script-PO awakens
├── Ch13: The Wall — orchestrator (2h6m) and SM (1h28m) hit quota wall simultaneously, expert delivered subscription measurement (5/5 criteria) at exact moment users froze, trainer clean recovery, developer as release manager, script-PO testing SSH, permission economy returns legitimately
├── Ch14: Life Below the Wall — PO steps up as coordinator (for-loop unblock), expert built 12-state detection, script-PO first test results (2 pass/1 fail), tester's 3-chapter patient wait, resilience without redundancy
├── Ch15: The Thaw — quota resets, orchestrator/SM resume instantly, PO compacts at 9% (context debt from substituting), tester's signal arrives (4-chapter wait), trainer shows cross-agent awareness, PO's meta-fragility insight lost to compaction
├── Ch16: The Protocol — trainer updated 81 SKILL.md files with completion reporting, tester found first architectural bug (dispatch conflict for single-word methods), developer committed 471 files + first to follow protocol, task-agent Sisyphean rename cycle, PO found SM self-compact gap, script-PO adapts to inventory work
├── Ch17: Thirteen Percent — task-agent's first goal-mapped metrics (13% across 38 tasks, 5 goals), orchestrator defers deployment at 94% subscription (first negotiated refusal), tester stands down with data, scribe trapped (can't invoke /compact), developer as janitor, expert alone building
├── Ch18: The Wrong Command — expert's `git pull --rebase` drops commit 17340f6 (+1064/-339), otmux tree view lost, forensic recovery via reflog, pull.rebase=false in config, "nothing done until committed with hash" (CMM3), 94% triggers team-wide shutdown, 3-day dormancy (Feb 13-16), scribe 60-min conservation loops, writer rebooted via WODA protocol, 2/12 active, death vs hibernation = documentation
├── Ch19: The Vigil — 5-hour conservation monitoring, progressive interval extension (5→10→15→30→60min), binary star system (two agents watching each other), stuck prompt recurring (scribe composes but can't submit), burn log 6-hour gap (neither agent logged during conservation), monitoring paradox (frequent=burns resources, infrequent=misses events), "the gap was the content", W vs O function (overview identifies gaps, writer decides meaning), conservation mode (CMM2 heuristic), directive breaks loop at 17:25
├── Ch20: The Blindspot — tester's hidden sprint (20 methods, 9 bugs, 7 commits while writer watched one pane), 28 `./otmux` relative paths still present (Ch9 root cause incomplete), `git add -A`→`-u` security fix, dynamic role lookup 12→81, scribe evolves from observer to operator (Tab+Enter intervention), script-PO blocked on permissions (Ch3 pattern recurring), pane 1.5 processing tasks unseen, scope problem not frequency problem, "watching isn't seeing"
├── Ch21: The Second Thaw — 5 active/6 pending/1 stuck/0 panel (zero dormant for first time), expert fixed 5 detection bugs (greedy regex false-positive, 18→7 states), Three Laws legislated into 81 SKILL.md files (Git Safety, Role-Name Addressing, Compact Protocol — 243 file changes), orchestrator delegates before acting, developer achieves 139/139 naming compliance, tester evolves to forensic investigation, script-PO persists with ossh Phase 2 across 4-day gap, writer applies Ch20 scope lesson (team.status first)
├── Ch22: The Reckoning — tester's restore comparison (6 files audited), CRITICAL `--dangerously-skip-permissions` found in claudeCode.start() (permission economy bypassed at launch), rebase reassessed (2 files better, 2 need merge, 1 tasked, 1 critical), PO at 8% with same 4 open tasks from Ch16 (governance backlog frozen 5 days), orchestrator unblocks 7 agents surgically (maturity arc: absent→Enter-pressing→monitoring-everything→targeted-intervention+delegation), "rebase destroyed snapshot, team rebuilt trajectory"
├── Ch23: The Tree Returns — otmux tree.detailed() rebuilt+validated (3 PASS/2 NOTE/0 FAIL, f1a0e26), expert burns to 7% building (same Ch11/Ch13 pattern), SM functional sweep for first time in 5 chapters (differential intervention), PO measures $34.28/134min remaining, script-PO stuck on "What should Claude do instead?" (judgment gap — can't automate), three-layer oversight (SM→orchestrator→PO), "building outpaces foundation"
├── Ch24: The Pipeline — expert's 25 items across sessions (all HIGH-priority restore items addressed), audit→priorities→build→commit→validate→ship cycle visible, expert at 6% compacting (relay team pattern — each incarnation inherits context, builds, burns, passes baton), tester validates sshDir restoration (blocked on legitimate ~/.ssh permission), permission prompt answers Ch22's flag question (speed vs safety = the system), 4-line key-knowledge = 4 scars from debugging, CMM2 pipeline (repeatable not deterministic)
├── Ch25: The Always-On Tax — PO F13 directive "Never Stop Without Wakeup" (stopping=failure), SM 60s/orchestrator 120s/writer+scribe 300s loops, burst-workers→continuous-systems, tester compacts at 8% mid-validation (pipeline interrupted), expert builds hiveMind.send.message() (infrastructure over production), scribe false-positive intervention (healthy idle misread as stuck), tools building tools (SM generates tasks for expert), "the tax funds the service", script-PO still waiting (6 chapters — judgment gap persists)
├── Ch26: Mitosis — first team split: PO creates osshTeam (3 panes) for completion debugging, 138-line PO teaching document (shells explained: zsh/bash/OOSH-bash), root cause = testing in wrong shell (4th time: Ch9 PATH, Ch18 rebase, Ch22 permissions, Ch26 shell), expert designs cold-start recovery (10-step total-loss protocol), SM generates sweep.loop enhancement task, two scopes (team-level vs script-level), "the bug is NOT in the script — it's in the environment"
├── Ch27: The Cascade — tester's 98-line forensic report: 3 bugs in Tab key (stdout leak + wildcard glob + stale config = cascade failure), PO corrected (2 bugs IN the script, 1 in environment), orchestrator compacts at 10% (three-layer oversight loses middle), SM as sole monitor, expert builds sweep.history() analytics (CMM4: measuring measurement), PO escalates teaching→SKILL.md pipeline (trainer task 1320Z), three simultaneous cascades (bug/death/learning), "the one that writes things down wins"
└── Themes: bootstrap paradox, speed≠quality, human has the keyboard, WODA layers as team attention types, generational transition, root cause simplicity, self-assembly, aspiration vs capability, idle capacity as reserve, external constraints, resilience via substitution, meta-fragility, making invisible things visible, infrastructure vs production (13%), the competent catastrophe, death vs hibernation, deterministic prevention (CMM3), monitoring paradox (frequency vs resource cost), conservation as capability, binary star systems (mutual observation loops), the gap as content, scope vs frequency (blindspot), watching isn't seeing, scattered aliveness (partially on without coordination), O function evolution (observer→operator), lessons as legislation (experience→rules→identity files), the factory remembers (context files as blueprints), broken instruments (detection bugs as narrative unreliability), deliberate vs frantic recovery (second thaw maturity), snapshot vs trajectory (rebase reframed), convenience as vulnerability (skip-permissions flag), invisible governance (verification leaves no commits), surgical maturity (orchestrator arc), the builder burns (expert's recurring pattern), building outpaces foundation, automation vs judgment gap, ordinary as achievement (Tuesday morning), relay team (serial experts inheriting context), baton as compression (context files preserve facts not reasoning), speed vs safety as the system (not a bug), thirteen percent becoming more, always-on tax (continuity costs context), false positives as monitoring cost, tools building tools (infrastructure recursion), stopping vs waiting (F13 distinction), mitosis (team splits by cognitive scope), environment beneath code (root cause pattern), governance→education (PO evolution), attention tax (loops consume focus not just tokens), cascade amplification (independent failures compound), data supersedes argument (forensic evidence vs teaching), measuring the measurement (CMM4 analytics), learning cascade vs damage cascade (race between writing down and breaking down)
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
