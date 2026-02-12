#!/bin/bash
# Setup standalone tmux session with all Project agent roles
# Run from OOSH pane: source session/setup-project-team.sh

SESSION="projectTeam"
REGISTRY="/tmp/hivemind.roles"

# Kill existing if present
tmux kill-session -t "$SESSION" 2>/dev/null
# Clean old registry entries
grep -v "^${SESSION}:" "$REGISTRY" > "${REGISTRY}.tmp" 2>/dev/null
mv "${REGISTRY}.tmp" "$REGISTRY" 2>/dev/null

# Create session
otmux new "$SESSION" -d
tmux rename-window -t "${SESSION}:0" "team-a"

# All 11 project roles
ROLES_A=(orchestrator oosh-expert oosh-tester scrum-master product-owner agent-trainer)
ROLES_B=(woda-writer woda-scribe task-agent developer script-product-owner)

# Window 0: team-a (6 agents)
for i in "${!ROLES_A[@]}"; do
  role="${ROLES_A[$i]}"
  if [ "$i" -gt 0 ]; then
    tmux split-window -t "${SESSION}:0"
    tmux select-layout -t "${SESSION}:0" tiled
  fi
  last=$(tmux list-panes -t "${SESSION}:0" -F "#{pane_index}" | tail -1)
  echo "${SESSION}:0.${last}|${role}" >> "$REGISTRY"
  tmux select-pane -t "${SESSION}:0.${last}" -T "$role"
done

# Window 1: team-b (5 agents)
tmux new-window -t "$SESSION" -n "team-b"
for i in "${!ROLES_B[@]}"; do
  role="${ROLES_B[$i]}"
  if [ "$i" -gt 0 ]; then
    tmux split-window -t "${SESSION}:1"
    tmux select-layout -t "${SESSION}:1" tiled
  fi
  last=$(tmux list-panes -t "${SESSION}:1" -F "#{pane_index}" | tail -1)
  echo "${SESSION}:1.${last}|${role}" >> "$REGISTRY"
  tmux select-pane -t "${SESSION}:1.${last}" -T "$role"
done

# Summary
echo ""
echo "=== projectTeam setup complete ==="
echo "Session:  $SESSION"
echo "Window 0: ${ROLES_A[*]}"
echo "Window 1: ${ROLES_B[*]}"
TOTAL=$(grep "^${SESSION}:" "$REGISTRY" | wc -l | tr -d ' ')
echo "Roles:    $TOTAL registered in hivemind"
echo ""
echo "Attach:   tmux attach -t $SESSION"
echo ""
echo "Claude NOT started yet. Run:"
echo "  source session/start-project-agents.sh"
echo ""
echo "This starts Claude (no skip-permissions), renames sessions, teaches roles,"
echo "and instructs each agent to read its full reading list."
