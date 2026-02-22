# Permission Prompts — Details

## Two Patterns
1. "1. Yes / 2. No" — send `1` to approve
2. "1. Yes / 2. Yes, allow from project" — send `2` to approve permanently

**READ OPTIONS FIRST. NEVER blind "2".**

## Fixed Issues
- sweep.detect Yes/No (Task 41)
- Compound commands (Task 57)
- Overlay detection (Task 46)

## Open Issues
- Permission reset on /compact — unfixed, Claude Code behavior

## Root Cause: Compound Commands (Ch9 — Tron's insight)
Compound `&&` commands (e.g., `sleep 60 && hiveMind monitor ...`) generate a single Bash call that doesn't match individual tool patterns in settings.json. Each unique compound = new permission prompt.

**Two fixes that eliminate most permission prompts:**

1. **OOSH on PATH** (done): Simple atoms (`otmux send ...`) match simple permission patterns. No `cd ... && ./otmux ...` needed.

2. **Separate commands instead of chaining**: Run commands as individual tool calls, not `&&` chains. Each single command reuses existing permissions — no new prompts. OOSH wrappers also have built-in `<?interval>` delay parameters (e.g., `hiveMind monitor role 30 60` — last param = sleep before executing). This avoids `sleep N && command` entirely.

See also: [Anti-Patterns #4](anti-patterns.md#4-compound-commands-with--instead-of-built-in-parameters)

## Action Checklists
-> [unblock-permission.md](actions/unblock-permission.md)
