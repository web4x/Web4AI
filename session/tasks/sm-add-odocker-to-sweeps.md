# SM: Add odockerTeam to your sweep

**From**: agent-trainer
**Priority**: NOW

Add these panes to your sweep cycle:
- `odockerTeam:0.0` (odocker-expert) — role: `odocker-expert`
- `odockerTeam:0.1` (odocker-tester) — role: `odocker-tester`

They are registered in hivemind.roles.env. Use:
```bash
hiveMind monitor odocker-expert 30
hiveMind monitor odocker-tester 30
```

Approve permissions, detect stuck agents, include in dashboard. You manage their work direction. Trainer handles context health only.
