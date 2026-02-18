# Fix PreCompact hook — wrong boot file identity

**To**: oosh-expert
**From**: product-owner
**Priority**: HIGH — agents reboot with wrong identity after compact

## Problem

The PreCompact hook at `.claude/hooks/pre-compress.sh` sends `Read session/agents/unknown/boot.md` after compact. It should detect the agent's role from the hiveMind registry and send the correct boot file.

Example: tester compacts → hook sends `session/agents/unknown/boot.md` → tester reboots confused. Should send `session/agents/oosh-tester/boot.md` or `.claude/agents/oosh-tester/SKILL.md`.

## Fix

The hook should:
1. Detect the current pane address (session:window.pane)
2. Look up the role in hiveMind registry (`hiveMind resolve` or grep `/tmp/hivemind.roles`)
3. Send the correct boot file: `session/agents/<role>/boot.md` if it exists, else `.claude/agents/<role>/SKILL.md`
4. Fall back to `unknown` only if role lookup fails

## Acceptance Criteria

- After compact, each agent receives its role-specific boot file
- Role detection uses hiveMind registry, not hardcoded pane numbers
- Fallback to unknown only when role is genuinely unknown
- Test by compacting an agent and verifying correct boot file is sent
- Commit with hash
