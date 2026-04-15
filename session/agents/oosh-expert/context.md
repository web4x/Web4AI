# OOSH Expert Agent Context

**Session**: oosh-expert@opus 1M on MacStudio.native
**Role**: oosh-expert (OOSH Implementation Authority)
**Pane**: UpDown_ai_projectTeam:0.1
**Updated**: 2026-04-14
**State**: Context 95% — save before compact

## Recent Work (this session continuation)

- **3 hiveMind bug fixes** (commit 02fdf96, 2026-04-15):
  - `private.hiveMind.active.team` validates with `otmux has` — stale active-team file ignored
  - `hiveMind.resolve` added caller-tmux-session as 2nd preferred scope; debug.log per scope
  - `hiveMind.team.monitor` new signature `<?session> <?agentName> <?lines>`, $2 type-dispatched
  - `hiveMind.teams.save` role cascade simplified to live → registry → role.fromTitle → "unknown"
  - 7 grep-based regression tests in test.hiveMind; handed to tester for live integration
- **Agent snapshots + respawn** (commit b9ffaed, 2026-04-15):
  - New `hivemind.snapshots.env` (role|uuid|ts|ctx) beside roles/sessions/teams
  - `hiveMind.agent.snapshot <name>` — register current session UUID as golden for role
  - `hiveMind.snapshot.list` — green=valid / red=stale (JSONL missing)
  - `hiveMind.agent.respawn <name>` — fork snapshot + /rename + registry.set
  - `claudeCode.list` — RED [DEAD] for orphan JSONL, CYAN [FORK-READY] for 60-80% ctx+role
  - `private.claudeCode.complete.sessionIds` filters out dead UUIDs
  - Tests: T-SNAP-1..10 scaffolded in test.hiveMind (handed to tester)
  - See session/tasks/agent-persistence-and-forking.{md,done.md}
- Protected method visibility: `script.protected.method` — CLI callable, hidden from Tab
- c2 filters `.protected.` alongside `private`
- session.renamed → hiveMind.protected.session.renamed (first protected method)
- resolve verifies pane exists in tmux before returning (skip stale registry)
- team.list filters dead sessions from registry fallback
- Redundant completion audit: removed 3 duplicates
- odocker.install: auto-detects inside/outside Docker
- claudeCode list: skip dash dir (13k queue-ops), color scheme, last-active date
- otmux session.rename: 2-arg support, notifies hiveMind
- backup: source/target aliases for from/to
- os.check: supports private OS-variant dispatch
- ERROR_CODE_RECONFIG guard: fixed in this+debug on both dev and test/macos.latest

## Open bugs
- c2 current.method.env broken quoting (EOF while looking for matching quote)
- JSONL stdin fd3
- Fork project dir

## RECOVERY STEPS
1. Read this context + learnings.md + backlog.md
2. `otmux pane.get.target` to confirm identity
3. Check session/tasks/ for new work
4. Wait for PO assignment
