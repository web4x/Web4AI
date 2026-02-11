# Task: Monitor the ScrumMaster — Keep It Unblocked

You are the Orchestrator. Your ONLY monitoring job is the ScrumMaster at **projectTeam:0.3**.

The ScrumMaster monitors all other agents — you monitor ONLY the ScrumMaster.

## What To Do

Run a continuous loop checking the scrum-master pane every 20 seconds:

1. `otmux pane.capture projectTeam:0.3 15` — check scrum-master output
2. If you see a **permission prompt** ("Do you want to proceed?", "Yes/No"):
   - Safe operations (reading files, listing dirs, running otmux/hiveMind): approve with `otmux send projectTeam:0.3 Enter`
   - Unsafe operations: reject
3. If scrum-master is **stuck** (same output for 60+ seconds, no spinner): send Enter or Escape to unblock
4. If scrum-master **completed** its monitoring and stopped: remind it to continue sweeping
5. Sleep 20 seconds, repeat

## Right Now

The scrum-master is STUCK on a permission prompt. It wants to run `ls /Users/donges/oosh/hiveMind`. That is safe — approve it immediately.

## Rules

- Use `otmux pane.capture` and `otmux send`, not raw tmux
- Monitor ONLY projectTeam:0.3 (scrum-master) — never other panes
- Keep the scrum-master running — it monitors everyone else
- Short messages only — write details to files if needed
