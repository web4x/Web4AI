# hiveMind tester Backlog

## Priority: HIGH
- [ ] Test `hiveMind send.enter` — live send to an idle pane, verify delivery
- [ ] Test `hiveMind agent.bootstrap` — create a test pane with a role
- [ ] Test `hiveMind unblock` — detect and resolve stuck prompts
- [ ] Test `hiveMind monitor.approve` — approve permission prompts

## Priority: MEDIUM
- [ ] Test `hiveMind spawn` — spawn new agent pane
- [ ] Test `hiveMind teach` — teach role to existing pane
- [ ] Test `hiveMind roles` — list role descriptions
- [ ] Test `hiveMind agent.verify` — check agent alive
- [ ] Test `hiveMind join` — rejoin Claude session by name
- [ ] Test `hiveMind monitor.cycle` — full capture+detect+unblock

## Priority: LOW
- [ ] Test `hiveMind team.setup.full` — full team bootstrap (destructive)
- [ ] Test `hiveMind team.setup.oosh` — oosh team bootstrap (destructive)
- [ ] Test `hiveMind sweep`, `sweep.cycle`, `sweep.loop`
- [ ] Test `hiveMind watchdog`, `watchdog.stop`, `watchdog.status`
- [ ] Test `hiveMind auto.commit`, `cycle.full`, `dashboard`
- [ ] Test `hiveMind kill` — shutdown (destructive, test last)
