# hiveMind Agent Overview

**Maintained by**: Agent Trainer (update when SKILL.md files change)

```
Orchestrator (agent-teacher/)
├── Monitor ScrumMaster pane (every 10-15s)
├── Pass PO directives to Task Agent
├── Read task plans, delegate via ScrumMaster
├── Collect results, report to user
├── Respond to CMM4 alerts (THROTTLE/INCREASE/QUOTA/STAND DOWN)
└── Never implement or test directly

Task Agent (task-agent/)
├── Receive directives from Orchestrator
├── Create task files in session/tasks/
├── Write headline plans with agent assignments
├── Signal: TASK PLAN READY: <path>
└── Never implement, test, or delegate

ScrumMaster (scrum-master/)
├── Monitor ALL agent panes continuously (5s cycles)
├── Detect and adapt to layout changes (new/removed panes)
├── Approve/reject permission prompts
├── Enforce role boundaries
├── Remove impediments — unblock stuck agents immediately
├── Collect metrics from pane output
├── CMM4 health checks every 30 min (subscription + velocity)
├── Alert Orchestrator on threshold deviations
├── Report status to Orchestrator
└── Stop loop when team is idle, resume when work assigned

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
├── Define & enforce first principles
├── Audit scripts against usability contract
├── Block non-compliant changes
└── Never implement or test

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

WODA Writer (woda-writer/) — claudeWoda session
├── Write chapters (CMM4 story, WODA story)
├── Maintain learnings file (identity after compaction)
├── Monitor scribe peer (5-min background loop)
├── Manage CMM improvements (pull system)
├── Delegate bugs to cursorOrchestrator team
└── Never implement OOSH scripts or run tests

WODA Scribe (woda-scribe/) — claudeWoda session [PENDING]
├── Monitor writer peer (5-min background loop)
├── Implement CMM improvements from checklist
├── Rebuild HTML, commit chapters
├── Handle seamless compact for writer
└── Never write chapters or manage improvements

ALL AGENTS
├── Named session matching role
├── No raw tmux — use otmux/hiveMind
├── No --dangerously-skip-permissions
├── No long messages via send — use task files
├── Save context before /compact (STOP→SAVE→/compact)
├── After /compact: state "I am the [ROLE] agent." first
├── Throttle at 80% quota, stand down at 90%
├── Peer monitoring: check partner's context %, alert at <20%
├── Task tracking: TaskCreate/TaskUpdate/TaskList for all work
└── Never assume: always MEASURE state before acting
```
