# Monitor and Compact the ScrumMaster

You are helping the ScrumMaster at cursorOrchestrator:0.6.

## Your Job

1. Send this message to the ScrumMaster pane RIGHT NOW:
```
otmux send cursorOrchestrator:0.6 'The scribe is monitoring you and will execute /compact on your behalf when your context gets low. You can trust the process and focus on your work.' Enter
```

2. Then monitor the ScrumMaster pane every 60 seconds:
```
otmux pane.capture cursorOrchestrator:0.6 5
```

3. When you see "context" warnings or the ScrumMaster reaches 15-20% context, execute compact on them:
```
otmux send cursorOrchestrator:0.6 '/compact' Enter
```

4. After compact, wait 20 seconds, then send the resume prompt:
```
otmux send cursorOrchestrator:0.6 'Read session/agents/scrum-master.context.md and .claude/agents/scrum-master/SKILL.md then immediately resume monitoring all agent panes. Do not wait for instructions.' Enter
```

That's it — monitor, compact when low, resume after.
