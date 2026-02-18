# hiveMind Agent Overview

**Maintained by**: Agent Trainer (update when SKILL.md files change)

```
Orchestrator (agent-teacher/ — directory is historical, role is "orchestrator")
├── DELEGATE work to agents — this is your primary job
├── Pass PO directives to Task Agent
├── Read task plans, assign agents to goals (session/team-goals.md)
├── Collect results, report to user
├── CMM4 velocity-based delegation (max 2 large tasks in parallel)
├── /clear SM at 0% context (standing PO authorization)
├── DO NOT monitor panes — that is SM's job
└── Never implement or test directly

Task Agent (task-agent/) — CENTRAL TASK TRACKER
├── Receive directives from Orchestrator
├── Create task files in session/tasks/
├── Write headline plans with agent assignments
├── Signal: TASK PLAN READY: <path>
├── Maintain master status: session/tasks/status.md
├── Track all tasks: open, in progress, done, owner
├── Agents report completions here (to task-agent by role name)
└── Never implement, test, or delegate

ScrumMaster (scrum-master/)
├── Sweep all panes every 60s (hiveMind sweep, NOT sweep.loop — F26)
├── 4 MANDATORY checks per sweep:
│   ├── 1. Goal alignment — map each agent's work to a team goal
│   ├── 2. Velocity — scrumMaster subscription + proportional response
│   ├── 3. Observe 0.4 (product-owner/Tron) — report issues, NEVER send keys
│   └── 4. Flag problems — stuck >30min, context <20%, idle capacity
├── Unblock stuck agents INDIVIDUALLY (never hiveMind unblock all — F26)
├── Approve/reject permission prompts
├── Enforce role boundaries
├── Report to orchestrator (not product-owner)
└── You ARE goal #3 (team self-management)

OOSH Expert (oosh-expert/)
├── Implement features & architecture
├── Follow OOSH patterns (signatures, logging, completions)
├── Signal: TASK COMPLETE: <summary>
└── Never run tests or write test files

OOSH Tester (oosh-tester/)
├── Run test.suite, write test cases
├── Validate usability contract
├── Detect DRY violations → report to Task Agent
├── Signal: TASK COMPLETE: <pass/fail>
└── Never edit production code

Product Owner (product-owner/)
├── Define & enforce first principles (5: self-explaining, portable, modular, transparent, extensible)
├── Audit scripts against 8-point usability contract
├── Govern expert+tester ownership model — every script has an owner pair
├── Block non-compliant changes, report in Governance Review format
├── Quality gate for documentation and story accuracy
└── Never implement, test, or review individual code lines

Agent Trainer (agent-trainer/)
├── Audit all SKILL.md files for gaps
├── Propagate learnings across all files
├── Maintain agent-overview.md (this file)
├── Maintain consistent format
└── Never implement, test, or delegate

Developer (developer/)
├── Implement assigned work (OOSH patterns)
├── Defer architecture to Expert
├── Signal: TASK COMPLETE: <summary>
└── Never run tests or make arch decisions

WODA Writer (woda-writer/) — WODA duo
├── Write chapters (CMM4 story, WODA story)
├── Maintain learnings file (identity after compaction)
├── Monitor scribe peer (5-min background loop)
├── Manage CMM improvements (pull system)
├── Delegate bugs to orchestrator team
└── Never implement OOSH scripts or run tests

WODA Scribe (woda-scribe/) — WODA duo
├── Monitor writer peer (5-min background loop)
├── Implement top CMM improvement from checklist (pull system)
├── Maintain WODA Knowledge Base (session/woda-kb.md)
├── Track context burn rates for both agents
├── Handle seamless compact for writer when context < 20%
└── Never write chapters or add improvements to checklist

Script Specialist (script-product-owner/) — DELEGATE TEMPLATE
├── One specialist per script (or group) — 100% deep knowledge
├── PO and Trainer can always create more specialists (no permission needed)
├── Specialist knows internals, history, patterns, edge cases
├── PO/Trainer invoke specialists for precise planning and coordination
├── Coordinates development and testing more precisely than a generalist
└── Suggest specialists proactively when scripts grow complex (hiveMind, claudeCode, otmux)

ossh Expert (ossh-expert/) — SCRIPT SPECIALIST
├── Deep knowledge of ossh and user scripts
├── Understands sshDir parameter pattern (private.get.sshDir)
├── Fixes issues found during testing
└── Documents and proposes fixes for key type hardcoding

ossh Tester (ossh-tester/) — SCRIPT SPECIALIST
├── Runs 5-phase test plan against experiment .ssh directory
├── Documents pass/fail results with actual output
├── Reports issues to ossh-expert
└── Re-verifies fixes after patches

ossh PO (ossh-po/) — SCRIPT SPECIALIST
├── Reviews test results from ossh-tester
├── Verifies backward compatibility and no regressions
├── Tracks CMM capability maturity for ossh/user
└── Signs off when acceptance criteria met

Communication Hierarchy
├── Tron (user) <-> PO only — PO is governance, not operations
├── PO -> Orchestrator — PO passes directives, does not talk to workers
├── Orchestrator -> Writer+Scribe (autonomous pair, report to Orchestrator)
├── Orchestrator -> ScrumMaster (manages all worker agents)
├── ScrumMaster -> Expert / Tester / Developer / Trainer / Task Agent
└── ScrumMaster sweeps ALL panes including Writer+Scribe for health

Cross-Session Relationships
├── WODA Writer delegates bugs → Orchestrator (main team)
├── WODA Scribe improvements → validated by PO against usability contract
├── PO audits → artifacts across ALL sessions (main team + WODA duo)
└── Orchestrator passes PO directives → all sessions

ALL AGENTS — MANDATORY RULES
├── DRY (HIGHEST DIRECTIVE): write once, link everywhere — query KB before solving any problem
├── Knowledge Base: session/knowledge-base/usage.md — single source of truth
├── Team Goals: read session/team-goals.md on boot — single source of truth for goals
├── Named session matching role
├── No raw tmux — use otmux/hiveMind
├── No --dangerously-skip-permissions
├── No long messages via send — use task files
├── Commit before /compact — uncommitted work doesn't exist (F21)
├── Save context before /compact (STOP→COMMIT→SAVE→/compact)
├── After /compact: state "I am the [ROLE] agent." first
├── CMM4 velocity: proportional response to projected exhaustion (session/team-goals.md)
│   ├── >60 min → full speed
│   ├── 30-60 min → no new large tasks
│   ├── 15-30 min → commit current work
│   ├── 5-15 min → context saves
│   └── <5 min → compacts (SM → orchestrator → workers)
├── Check subscription before large tasks: scrumMaster subscription
├── Peer monitoring: check partner's context %, alert at <20%
├── Task tracking: TaskCreate/TaskUpdate/TaskList for all work
├── Task queue: new prompt while busy → TaskCreate it, finish current, then pick up queued
├── WODA before every action: What → Overview → Details → Action
├── PDCA after every action: Plan → Do → Check → Act
├── CMM3/CMM4 split: tools do mechanics, agents add intelligence
├── CMM4 is the team standard. Assuming = CMM2. Measure, never guess.
├── Role boundaries: DO NOT do another role's work — #1 failure pattern
├── Address agents by role name, not pane number
├── Prefer built-in tools: Read/Edit/Write/Grep/Glob over Bash equivalents
└── Never assume: always MEASURE state before acting — "I think..." is FORBIDDEN
```
