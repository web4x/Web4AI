[Back to Sprint 0](./planning.md)

# Bug Report: hiveMind agent.monitor segfault via tronMonitor switch chain

## Status
- [x] Reported (SM from TRONinterface:0.0 — 2026-04-24)
- [x] Defensive mitigation (commit f5bc1b8 — timeout guard on monitor.switch)
- [ ] Root-cause fix (awaits PO triage after SUB_LIMIT recovers)

## Reporter
SM via TRONinterface:0.0 → oosh-expert ooshTeam:0.1. Message:
> hiveMind agent.monitor segfaulting at line 571 (tronMonitor switch).
> I cannot inspect PERMISSION prompts. Please flag to oosh-po when they
> recover from SUB_LIMIT.

## Symptom
`hiveMind agent.monitor <name>` appears to segfault or hang. Blocks SM from
inspecting agents in PERMISSION state (the very state SM needs visibility
into to unblock agents).

## Call chain
```
hiveMind.agent.monitor (line 4419)
  └─ private.hiveMind.monitor.switch (line 571)
      └─ "tronMonitor" switch "$session"
          └─ private.tronMonitor.screen.ensure   # D1.6 addition
              └─ (if screen dead) → start screen + iterate env
                  └─ tronMonitor.add (per team)  # D1.9 validation + attach -r
                      └─ private.tronMonitor.screen.ensure  # recursion if screen still reports dead
```

## Likely root cause
D1.6's `private.tronMonitor.screen.ensure` restarts screen and re-adds
tracked teams when screen is dead. Several hazards:
1. `tronMonitor.add` calls `screen.ensure` on re-entry; if screen is
   still binding (race window), could loop N times before `isAlive`
   returns true.
2. Inner `tmux attach -r` calls (via screen -X stuff) can stall if the
   target session is attached-mutating state concurrently.
3. Bash `|| true` on line 575 swallows exit codes but not fatal signals
   from child processes.

## Defensive mitigation (shipped — commit f5bc1b8)
`private.hiveMind.monitor.switch` now wraps the `tronMonitor switch` call
in `timeout 2` and always returns 0. A failed visual switch is a UX
nicety — it must never block agent.monitor.

With this mitigation: SM's `agent.monitor` should complete within ~2s
max even if tronMonitor is entirely broken.

## Full root-cause fix (for PO)
Options to consider:
1. **Decouple monitor.switch from agent.monitor entirely.** Move the
   auto-switch into a separate explicit command (`hiveMind monitor.sync`)
   so agent.monitor has zero side-effects.
2. **Harden screen.ensure against recursion.** Add a guard variable
   (e.g. `OTMUX_SCREEN_ENSURING=1`) that prevents re-entry from
   tronMonitor.add.
3. **Rate-limit screen.ensure.** If it ran within last 30s, skip.
4. **Strip screen.ensure from tronMonitor.switch path.** Only invoke
   screen.ensure from user-initiated `setup`/`add`, not from agent
   workflows.

Recommended: (2) + (4). Guard against re-entry + remove from auto paths.

## Related commits
- `cd23b6e` — D1.6 added screen.ensure (root of the flaky path)
- `f5bc1b8` — defensive timeout guard (this bug's mitigation)

## Test reproduction (for tester)
1. Start ooshTeam with 4 agents.
2. Kill tronMon screen: `screen -S tronMon -X quit`.
3. Run `hiveMind agent.monitor oosh-expert` — observe delay/crash.
4. After f5bc1b8: call completes within 2s, shows pane capture.
5. Before f5bc1b8: call hung/segfaulted.

## Priority
HIGH — blocks SM visibility into PERMISSION-state agents, which is the
specific intervention SM needs to unblock the team. Mitigation sufficient
for now; full fix should be next Epic D task.
