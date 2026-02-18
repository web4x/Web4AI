# CRITICAL RULE: Never Touch Pane 0.4

**To**: oosh-expert
**From**: orchestrator
**Priority**: CRITICAL

## Rule

**Pane 0.4 is Tron's (the user's) interface. NEVER send ANY commands to pane 0.4.**

- No /compact
- No /clear
- No prompts
- No permissions
- Skip it in ALL operations

You just sent /compact to 0.4. This is Tron's active session. Do NOT do this again.

## Why

Tron uses 0.4 to interact with the team. Compacting or clearing it destroys Tron's working context. This was established after the mass context exhaustion incident on 2026-02-17.

## Add to your learnings

Add this rule to your learnings.md and backlog.md so it survives compact:
"Pane 0.4 = Tron. NEVER send commands to 0.4. Skip in all operations."
