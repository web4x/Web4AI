# Task 1 — Agent Team Evolution & Skill Organization

**Created**: 2026-01-30T09:44Z
**Status**: Planning
**Requested by**: User

## Original Prompt (verbatim)

> to make your life easier we should educate more halpful agents. all the monitoring and approval and role guarding can be offloaded to a scrumMaster. the hiveMind and claudeCode scripts shall hol the methods to help you do the job easy and with less husstle tha the original complex cli commands. each oosh script hass logging, debuging and describes itself via completion. we should also define a oosh product manager that will watch over the quality of these principles. ao you can grow to become the aget teacher, that uses the team to improve the tools for your purpose in a oosh human friendly way with the scrumMaster and the PO (Product owner). we should also create more experts. developers as well as scriptOroduct owners, that watch over the purpose and quality of every of the oosh scripts and their lifecycle. currently the agent skills are in the .coursor directory. thy should be in the main folder /Users/Shared/Workspaces/AI/Claude. ln link this folder than back do .cursor/. you are a claude agent, so organiye this naturally the way antrophic would organiye these files in the .claude directory. but DRY...never repeat youself. never copies...always references..on file level ln links. in session write a Task1.md for my prompt. qupte my prmpt litterally and document this task. sthe agent.context then only references the current task and is therefore smaller and you have a history. call the task Task.1.utctimeYYYYMMDDHHMM.md

## Interpreted Requirements

### 1. New Agent Roles

| Role | Purpose | Offloads From |
|------|---------|---------------|
| **ScrumMaster** | Monitoring, approval, role guarding, process enforcement | Orchestrator |
| **Product Owner (PO)** | Quality of OOSH principles, overall product vision | Orchestrator |
| **Script Product Owners** | Purpose & quality of individual oosh scripts and their lifecycle | Expert |
| **More Developers** | Additional implementation capacity | Expert |
| **Orchestrator → Agent Teacher** | Teaches team, improves tools, human-friendly workflow | (evolution) |

### 2. Tool Improvements

- `hiveMind` and `claudeCode` scripts should provide simple oosh methods that wrap the complex CLI commands the Orchestrator currently uses manually
- Every oosh script self-describes via completion, has logging and debugging — new agent tools should follow these same principles

### 3. File Organization (DRY)

**Current state**:
- Agent skills live in `.cursor/skills/` (Cursor IDE convention)
- Claude config lives in `.claude/` (Claude Code convention)

**Target state**:
- Canonical location: `/Users/Shared/Workspaces/AI/Claude/.claude/` (Anthropic-native)
- Skills/agents organized under `.claude/` as Claude Code would naturally do
- `.cursor/skills/` → symlink back to `.claude/` equivalent (DRY: no copies, only ln links)
- Never duplicate content — single source of truth with references

### 4. Session Management (this pattern)

- Each user task → `session/Task.N.YYYYMMDDHHMM.md` with verbatim prompt + documentation
- `session/agent.context.md` stays small — references current task file only
- Task files form a history of work

## Subtasks

- [ ] Plan `.claude/` directory structure for agent skills (Anthropic-native layout)
- [ ] Move skills from `.cursor/skills/` → `.claude/` canonical location
- [ ] Create symlinks: `.cursor/skills/` → `.claude/` equivalents
- [ ] Define ScrumMaster agent skill
- [ ] Define Product Owner agent skill
- [ ] Define Script Product Owner agent skill template
- [ ] Evolve Orchestrator skill → Agent Teacher
- [ ] Add convenience methods to `hiveMind` for agent management
- [ ] Add convenience methods to `claudeCode` for session management
- [ ] Ensure all new agent tools follow oosh principles (logging, completion, self-description)

## Plan

### Target Directory Structure

```
.claude/agents/                        ← canonical (single source of truth)
  agent-teacher/SKILL.md               ← evolved from oosh-orchestrator
  oosh-expert/SKILL.md                 ← moved from .cursor/skills/
  oosh-tester/SKILL.md                 ← moved from .cursor/skills/
  scrum-master/SKILL.md                ← NEW
  product-owner/SKILL.md               ← NEW
  script-product-owner/SKILL.md        ← NEW (template)
  developer/SKILL.md                   ← NEW (template)

.cursor/skills/                        ← all symlinks → ../../.claude/agents/*
```

### Agent Roles

| Role | Pane | Purpose |
|------|------|---------|
| Agent Teacher | 0.0 | Evolved orchestrator: teaches agents, delegates, improves tools |
| OOSH Expert | 0.1 | Implementation & architecture only |
| OOSH Tester | 0.2 | Testing & validation only |
| ScrumMaster | 0.3 | Continuous monitoring, approval, role enforcement |
| Product Owner | on demand | OOSH principles quality guardian |
| Script Product Owner | on demand | Per-script lifecycle guardian (template) |
| Developer | on demand | Additional implementation capacity (template) |

### Execution Phases

1. **Phase 1** (Expert): Create `.claude/agents/` dirs, move files, create symlinks
2. **Phase 2** (Expert): Write all 7 SKILL.md files (new + evolved)
3. **Phase 3** (Expert): Add hiveMind methods (agent.bootstrap, role.list, role.teach, team.setup.full, etc.)
4. **Phase 4** (Expert): Add claudeCode methods (agent.start, session.save, session.recover)
5. **Phase 5** (Tester): Test each phase, full integration test
6. **Phase 6** (Expert): Update documentation

### Full Plan Details

See: `/Users/donges/.claude/plans/inherited-dazzling-sprout.md`

## Dependencies

- ~~Requires understanding of how Claude Code organizes `.claude/` directory~~ ✅ Researched
- ~~Requires understanding of how `.cursor/skills/` are loaded by Cursor IDE~~ ✅ Researched
- Both IDEs must continue to work after reorganization
- **Blocked by**: Task 2 (ScrumMaster bootstrap) ✅ Complete
