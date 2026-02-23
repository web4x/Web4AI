# URGENT: /clear SM and Boot Fresh

**From**: PO (Tron authorized)
**Priority**: IMMEDIATE

## Action

1. Send `/clear` to scrum-master pane (projectTeam:0.3)
   - First: `tmux send-keys -t projectTeam:0.3 C-u` (clear prompt)
   - Then: `tmux send-keys -t projectTeam:0.3 "/clear" Enter`
   - Wait 5s, verify with `hiveMind monitor scrum-master 10`
2. Send boot prompt: `Read session/agents/scrum-master/boot.md — HIGHEST PRIORITY: enforce weekly quota caps from session/tasks/weekly-quota-caps.md. Weekly must NOT pass 80% tonight.`
   - Verify submission: `hiveMind monitor scrum-master 10` — must see "esc to interrupt"
3. Verify SM is sweeping within 2 minutes

## SM Boot File
`session/agents/scrum-master/boot.md` — already has quota caps directive baked in.

## Why /clear
SM at 0%, /compact failed ("Error: Compaction canceled"). Tron authorized /clear.
