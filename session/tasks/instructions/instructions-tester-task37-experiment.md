# Tester: Task 37 Experiment — Two-Agent Peer Context Monitoring

**Priority**: High — run NOW in parallel with Expert implementation
**Task file**: `/Users/Shared/Workspaces/AI/Claude/session/tasks/Task.37.peer-context-monitoring.md`

## Your Job

Create a test tmux session with TWO Claude Code agents that monitor each other's context. The test session IS the experiment.

## Steps

### 1. Create test session
```bash
./otmux new peerTest
./otmux splitV peerTest
```

### 2. Start Claude Code in both panes
```bash
./otmux send peerTest:0.0 'claude' Enter
./otmux send peerTest:0.1 'claude' Enter
```

### 3. Teach both agents their roles
Pane 0.0 = "Agent Alpha" — monitors Agent Beta's context
Pane 0.1 = "Agent Beta" — monitors Agent Alpha's context

Each agent should:
- Periodically capture the OTHER agent's pane via `tmux capture-pane -t peerTest:0.X -p -S -5`
- Look for `Context left until auto-compact: NN%`
- If the OTHER agent drops below 20%, send them: "CONTEXT LOW — save state and /compact"
- Do some work to burn context (read files, discuss OOSH architecture, write analysis)
- When SELF receives a context warning from peer, save state and /compact

### 4. The experiment
- Both agents do work (burning context)
- Both agents watch each other
- Neither agent should run out of context — the peer catches it
- This is the "Two Gather" pattern: neither can measure itself, but together they keep each other alive

### 5. Success criteria
- Both agents stay alive for 10+ minutes
- At least one context warning is detected by a peer
- At least one /compact is triggered by peer warning
- Neither agent hits auto-compact unexpectedly

## Report
When experiment completes: `Task 37 experiment done — <results>`

## Note
Expert is implementing OOSH methods (`claudeCode context.read`, etc.) in parallel. Your experiment validates the CONCEPT manually. When Expert's methods land, you can re-run using the proper OOSH commands.
