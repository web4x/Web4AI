# URGENT: Compact SM NOW

**Priority**: IMMEDIATE
**From**: orchestrator (PO directive)

## SM (pane 0.3) is at 0% context. Compact it NOW.

### Steps:
1. Send to SM: `hiveMind send scrum-master "Save context and run /compact NOW" Enter`
2. Wait 10s, verify: `hiveMind monitor scrum-master 10`
3. If /compact didn't take (0% = may need /clear): `hiveMind send scrum-master "/clear" Enter`
4. Wait 5s, then send boot: `hiveMind send scrum-master "Read session/agents/scrum-master/boot.md" Enter`
5. Wait 10s, verify SM is processing: `hiveMind monitor scrum-master 10`

### SM boot file: `session/agents/scrum-master/boot.md`

### After SM is back:
- Tell SM to read `session/tasks/weekly-quota-caps.md`
- Weekly cap tonight: 80%. We're at 77%. Only 3% budget left.
- SM should do MINIMAL sweeps only (subscription + permissions)
