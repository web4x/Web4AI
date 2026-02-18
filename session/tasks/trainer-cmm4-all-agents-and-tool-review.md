# Task: CMM4 Awareness + Tool Migration for ALL Agents

**To**: agent-trainer
**From**: product-owner
**Priority**: CRITICAL — this is climbing CMM levels, our #1 goal

## Background

We agreed that ALL agents must be CMM4 aware. This was lost through compacts. Persist it permanently in every SKILL.md file.

## Part 1: CMM4 + WODA + PDCA in ALL SKILL.md files

Every agent SKILL.md in `.claude/agents/*/SKILL.md` must include:

### WODA — before every action
- **W** (What): What is the current state? What am I trying to do?
- **O** (Overview): Read context, check dependencies, understand the big picture
- **D** (Details): Specific files, specific state, specific measurements
- **A** (Action): Only NOW act — and only on what the details tell you

### PDCA — continuous improvement
- **Plan**: What will I do? What's the expected outcome?
- **Do**: Execute the plan
- **Check**: Did it work? Measure the result (GATE: never assume, always measure)
- **Act**: Adjust based on what was measured. If it failed, why? Feed back into next Plan.

### Internal Task Tool — mandatory for all agents
- Use `TaskCreate` when receiving work
- Use `TaskUpdate status=in_progress` when starting
- Use `TaskUpdate status=completed` when done
- Use `TaskList` to find next work
- Tasks survive context better than chat memory
- SM and orchestrator act continuously but still track recurring work as tasks

### CMM4 Velocity Awareness
- All agents check `scrumMaster subscription` before starting large tasks
- Proportional response to projected exhaustion (>60min full speed, 30-60 no new large, etc.)
- Reference `session/team-goals.md` for the velocity table

## Part 2: Tool Migration Review

Review ALL SKILL.md files for outdated tool references and migrate to current tooling:

### Known outdated patterns to find and fix
- Raw `tmux send-keys` → should be `otmux send` or `hiveMind send`
- Raw `tmux capture-pane` → should be `otmux pane.capture` or `hiveMind monitor`
- Manual `while/sleep/for` monitoring loops → should be `hiveMind sweep.loop` or `scrumMaster cycle`
- Old session names (not `projectTeam`) → update to current
- `hiveMind unblock all` without 0.4 awareness → note that code fix is pending
- `scrumMaster measure.subscription.api` → deprecated, use `scrumMaster subscription`
- Binary threshold rules (80%/90%) → replace with CMM4 velocity proportional response
- Any `--help` flags → OOSH uses `scriptname method`, not flags

### How to review
1. `grep -r "tmux send-keys\|tmux capture-pane" .claude/agents/` — find raw tmux usage
2. `grep -r "while.*sleep\|for.*pane" .claude/agents/` — find manual loops
3. `grep -r "80%\|90%.*stop\|throttle" .claude/agents/` — find binary thresholds
4. `grep -r "measure.subscription.api" .claude/agents/` — find deprecated tools
5. Fix each one in the SKILL.md files

## Part 3: Verify consistency

After updates:
- All SKILL.md files reference WODA + PDCA
- All SKILL.md files reference internal task tool usage
- All SKILL.md files reference `session/team-goals.md`
- All SKILL.md files use current hiveMind/otmux/scrumMaster tooling
- No binary threshold rules remain
- No raw tmux commands remain

## Acceptance Criteria

- `grep -r "WODA\|PDCA" .claude/agents/` returns matches in ALL agent SKILL.md files
- `grep -r "TaskCreate\|TaskUpdate" .claude/agents/` returns matches in ALL agent SKILL.md files
- `grep -r "tmux send-keys" .claude/agents/` returns NO matches (all migrated)
- `grep -r "80%.*throttle\|90%.*stop" .claude/agents/` returns NO matches
- Commit with hash when done
