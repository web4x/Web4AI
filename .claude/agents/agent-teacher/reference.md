# Orchestrator Reference (detailed procedures)

*Read when needed, NOT on boot. Boot = context.md + team-goals.md + FIRST 3 ACTIONS.*

## Teaching Protocol

When bootstrapping a new agent:
```bash
hiveMind agent.bootstrap <role> <session> <pane>   # full bootstrap
hiveMind role.teach <pane> <role>                   # teach existing pane
hiveMind agent.verify <pane>                        # verify role learned
```
Teaching prompt reads from `.claude/agents/<role>/SKILL.md`. Cursor reads via symlinks at `.cursor/skills/`.

## PO Instantiation Protocol

To set up script ownership:
1. Assign to expert+tester pair
2. Expert reads script, checks usability contract (`./scriptname usage`, completion, signatures)
3. Tester validates: `./test.suite run scriptname 1`
4. Optional PO spot-check for critical scripts

Ownership contract: `.claude/agents/script-product-owner/SKILL.md`

## Agent Role Directory

| Role | SKILL.md Location |
|------|-------------------|
| orchestrator | `.claude/agents/agent-teacher/SKILL.md` |
| oosh-expert | `.claude/agents/oosh-expert/SKILL.md` |
| oosh-tester | `.claude/agents/oosh-tester/SKILL.md` |
| scrum-master | `.claude/agents/scrum-master/SKILL.md` |
| product-owner | `.claude/agents/product-owner/SKILL.md` |
| script-product-owner | `.claude/agents/script-product-owner/SKILL.md` |
| developer | `.claude/agents/developer/SKILL.md` |

## Sending Tasks — Verify Submission

After sending prompts, verify processing started within 3 seconds:
1. Capture the pane immediately
2. Look for processing indicators: "Composing...", "Musing...", "Thinking...", spinners
3. If prompt still in input line → NOT submitted → send Enter separately

## Context File Template

Maintain `session/agents/orchestrator/context.md`:
```markdown
# Agent Context State
**Session**: [tmux session name]
**Updated**: [date]
**Role**: Orchestrator

## Current Task
## Team Status
## Recent Results
## Next Steps
## Recovery Notes
```

## Stagger Pattern for Multiple Tasks

1. Delegate task 1 and task 2
2. Wait for SM to confirm both agents stable
3. Only then delegate task 3
4. Never fire-and-forget — verify before adding load

## Peer Monitoring (CMM4)

You and SM monitor each other's context (neither can read their own):
1. Check SM context via `hiveMind monitor scrum-master 10`
2. If context warning visible → alert SM to save and `/compact`
3. After SM compacts → `hiveMind send scrum-master 'Read session/agents/scrum-master/context.md'`

## Context Recovery

After `/compact`:
1. State identity: "I am the Orchestrator agent."
2. Read context.md for current goals
3. Read backlog.md, TaskCreate for pending items
4. Resume delegating

## Self-Pane Detection (F16)

On boot: `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"`
NEVER send commands to your own pane.

## PO Communication Modes

1. **Quality gate**: Tron → PO → You. PO validates direction before you execute.
2. **Audit mode**: You → PO. You request governance audit, PO investigates.

## Key Platform Learnings

- Claude Code overwrites tmux pane titles. Agent identity in `/tmp/hivemind.roles`.
- `agentRoom backend.status` exit codes unreliable. Grep output text.

## Reading List

### On Bootstrap / After Recovery
1. context.md (saved state)
2. learnings.md (patterns and history)
3. backlog.md (open work items)
4. `.claude/agents/agent-overview.md` (role enforcement)

### For Role Work
- `hiveMind usage` — all commands
- `scrumMaster usage` — measurement commands
- All SKILL.md files in `.claude/agents/*/SKILL.md`
