# Done: hiveMind agent.context.status
**Agent**: oosh-expert
**Task**: build-hivemind-agent-context-status.md (Task #47)
**Result**: PASS
**Commit**: 088719a
**File**: `/Users/donges/oosh/hiveMind` lines 1488-1609

## What was built
`hiveMind agent.context.status [session]` — reports context % for all registered agents.

### How it works
1. Reads `/tmp/hivemind.roles` registry for agent→pane mapping
2. For each agent: captures pane, detects state (idle/busy/permission/active)
3. Only sends `/context` to **idle** agents (never disrupts busy ones)
4. Parses the token line: `79k/200k tokens (40%)` → 60% remaining
5. Self-detection: if pane matches self, reports "SELF" (42 principle)
6. Reports thresholds: OK (>50%), WARN (35-50%), CRITICAL (25-35%), DANGER (<25%)

### Output format
```
Agent Context Status — projectTeam
──────────────────────────────────────────
AGENT                PANE     CTX%   TOKENS       STATUS
──────────────────────────────────────────
agent-trainer        0.5      60%    79k/200k     OK
oosh-expert          0.1      —      —            SELF
product-owner        0.4      —      —            BUSY:active
──────────────────────────────────────────
No alerts.
```

### Design decisions (as Principle Guardian)
- **Self-contained in hiveMind** — no dependency on scrumMaster or claudeCode parsers
- Idle detection inlined (checks ❯/> prompt, permission dialogs, activity verbs)
- Token parsing handles ANSI codes, fallback pattern for edge cases
- Tab completion for session parameter
- 4s wait after /context (sufficient for TUI render)

### Architecture note
The method uses raw `tmux` for `send-keys` and `capture-pane` inside the function because:
- `otmux send` adds `-l` flag overhead we don't want for `/context`
- The entire method IS the hiveMind layer — it's the wrapper itself

## Test cases for tester
1. Idle agent → sends /context, parses correctly
2. Busy agent → reports BUSY:active, no disruption
3. Permission prompt → reports BUSY:permission
4. Self pane → reports SELF
5. No Claude running → reports NO-CLAUDE
6. Parse failure → reports UNKNOWN with alert
7. Tab completion → `hiveMind agent.context.status <TAB>` shows sessions

## Next
Tester should verify all 7 edge cases. SM can now use this for automated context monitoring.
