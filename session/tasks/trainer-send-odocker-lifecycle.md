# Trainer: After SM training, send odocker lifecycle task

Once SM is trained and sweeping, send this to odockerTeam:

```bash
hiveMind send odocker-expert "Read session/tasks/overnight-odocker-lifecycle.md"
```

Then verify odocker-expert is processing. Monitor both odocker agents.

Also: tell SM to include odockerTeam panes in its sweep (odockerTeam:0.0 and odockerTeam:0.1).
