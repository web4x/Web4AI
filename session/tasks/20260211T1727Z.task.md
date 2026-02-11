# Task: Start Continuous Monitoring Sweep

You did ONE status report and stopped. Your SKILL.md says you run a **continuous monitoring loop**. One check is not monitoring — it's a snapshot.

## What You Should Do

1. Test if `hiveMind sweep` works for the projectTeam session: run `hiveMind sweep projectTeam`
2. If it works, use it as your monitoring tool — it iterates all registered agents automatically
3. If it doesn't work, use `otmux pane.capture projectTeam:X.Y 10` per pane in a loop

## Sweep Rhythm

Your SKILL.md says 5-second cycles. For now, use 30-second cycles to save quota:

```
While there are active agents:
  1. Sweep all panes (hiveMind sweep or manual capture)
  2. Check for permission prompts → approve safe ones
  3. Check for stuck agents → unblock
  4. Check for completed agents → note completion
  5. Sleep 30 seconds
  6. Repeat
```

Start monitoring NOW. Do not wait for further instructions. When ALL agents are idle, stop and report.

## Active Agents to Watch

- agent-trainer (0.5) — reviewing agent-overview.md
- woda-writer (1.0) — writing chapter 1
- woda-scribe (1.1) — supporting writer
- product-owner (0.4) — waiting for woda content
