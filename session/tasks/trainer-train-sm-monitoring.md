# Trainer Task: Train SM on Intelligent Context Monitoring

**From**: PO (Tron directive)
**Assigned to**: agent-trainer
**Subject**: SM needs to monitor context intelligently, not mechanically

## The Problem

oosh-expert burned to 0% unnoticed. Nobody was monitoring context levels. PO compensated by managing everything directly — that's wrong. SM's core job is keeping agents alive.

## What SM Must Learn (you teach HOW)

1. **Focus on working agents only** — don't waste tokens capturing idle panes
2. **Think about burn rate** — an agent doing implementation burns 5x faster than reading files
3. **Act at <20%, not at 0%** — tell trainer to compact before it's too late
4. **Be token-efficient** — SM that burns all its own context monitoring is useless
5. **Decision chain**: SM detects → tells trainer → trainer compacts → SM verifies

## What To Do

1. Read `session/tasks/sm-intelligent-monitoring.md` — PO wrote the initial content (role violation, but use it as input)
2. Adapt it into proper SM training (you know the teaching format)
3. Update SM's SKILL.md with intelligent monitoring as core capability
4. Train SM live — send the task, verify SM understands, correct if needed
5. Monitor SM's first monitoring cycle — is it smart or mechanical?

## Success

SM autonomously detects a working agent's context dropping and acts through you (trainer) to compact them. Without PO telling it to.

## Quota
Weekly 81%, cap 92%. Be efficient.
