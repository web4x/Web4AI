# Fractal PDCA — Reproducible Team Boot

*The CMM3 test: can you recreate the team from files alone on a blank machine?*

## Principle

If knowledge lives in chat history or individual memory, it's CMM1 — heroic individual. If it's written but only works on the original machine, it's CMM2 — repeatable but fragile. **CMM3 = deterministic reproduction: same files → same team → same capability, anywhere.**

## Fractal PDCA Stack

Each subtask is its own PDCA cycle. Work bottom-up like a call stack — each must PASS before the next can start.

```
┌─────────────────────────────────────────────────┐
│ 5. Boot full team (SM, orchestrator, workers)   │ ← top-level goal
├─────────────────────────────────────────────────┤
│ 4. Boot PO — verify identity reproduces         │
├─────────────────────────────────────────────────┤
│ 3. Start otmux session in container             │
├─────────────────────────────────────────────────┤
│ 2. Remote install oosh into container           │
├─────────────────────────────────────────────────┤
│ 1. Docker container with base environment       │ ← start here
└─────────────────────────────────────────────────┘
```

### Level 1: Docker base environment
- **Plan**: What does oosh need? bash, git, ssh, tmux, curl
- **Do**: Create Dockerfile or pull base image, install deps
- **Check**: `bash --version`, `tmux -V`, `git --version` — all present?
- **Act**: Fix missing deps, commit working Dockerfile
- **DONE when**: Container runs, has all deps, can ssh/git

### Level 2: Remote oosh install
- **Plan**: How does oosh install? What's the bootstrap? PATH setup?
- **Do**: Clone oosh repo, run install, set up PATH in bashrc
- **Check**: `oo version`, `otmux --help`, `hiveMind --help` — all work?
- **Act**: Fix PATH, permissions, missing configs
- **DONE when**: All oosh commands work from any directory

### Level 3: otmux session
- **Plan**: What session layout? How many panes? hivemind.roles?
- **Do**: `hiveMind team.setup.full` or manual otmux session create
- **Check**: `otmux pane.list`, `hiveMind team.status` — correct layout?
- **Act**: Fix pane assignments, role registry
- **DONE when**: Session exists with correct pane layout and role mapping

### Level 4: Boot PO (THE CMM3 TEST)
- **Plan**: What files does PO need? boot.md → woda → CMM → KB → SKILL.md → context
- **Do**: Send boot.md reference to PO pane, let it self-boot
- **Check**: Does PO know its identity? Does it read woda? Does it apply CMM? Does it use KB?
- **Act**: If gaps found → fix boot.md, KB, or SKILL.md → retry
- **DONE when**: PO on remote machine governs team quality same as local PO

### Level 5: Boot full team
- **Plan**: Boot order? Dependencies between roles?
- **Do**: PO boots each role using boot.md + SKILL.md
- **Check**: Each agent knows its role, follows task queue, applies CMM
- **Act**: Fix SKILL.md gaps found during boot
- **DONE when**: Full team operates autonomously on remote machine

## Success Criteria

The remote team must:
1. Know the woda story (team identity)
2. Apply CMM4 principles (measurement, PDCA, weakest link)
3. Use the knowledge base (query before solving)
4. Follow task queue discipline (TaskCreate, not self-tasking)
5. Recover correctly via the 2-phase rewind (boot.md, context preservation) — **`/compact`+`/clear` are FORBIDDEN; the only recovery is the peer/SM-driven 2-phase rewind — see `session/base-skills/agent-rewind.md`**
6. Operate without Tron micromanaging

## Why This Matters

This is web4x in practice — a self-improving system that can replicate itself. If it works, the team is CMM3 minimum. If the team on the remote machine starts improving its own processes, that's CMM4.
