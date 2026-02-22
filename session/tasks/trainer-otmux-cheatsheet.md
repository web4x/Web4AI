# otmux Commands You Need Right Now

## Create the odockerTeam session

```bash
otmux new odockerTeam           # creates new tmux session
otmux splitH odockerTeam:0.0    # split horizontally → creates 0.1
```

## Boot agents in panes

```bash
otmux send odockerTeam:0.0 "claude --name odocker-expert" Enter
otmux send odockerTeam:0.1 "claude --name odocker-tester" Enter
```

## Send boot prompts

```bash
otmux send odockerTeam:0.0 "Read session/agents/odocker-expert/boot.md" Enter
otmux send odockerTeam:0.1 "Read session/agents/odocker-tester/boot.md" Enter
```

## Monitor / capture

```bash
hiveMind monitor odocker-expert 30    # by role name (after registering in roles file)
otmux pane.capture odockerTeam:0.0 30 # by pane address (before registration)
```

## Check all sessions

```bash
otmux    # no args = full tree of all sessions
```

## NEVER use raw tmux for these. These wrappers exist.
