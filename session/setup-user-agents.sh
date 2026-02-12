#!/bin/bash
# Setup standalone tmux session with all User agent roles
# Run from OOSH pane: source session/setup-user-agents.sh

SESSION="userAgentTeam"

# Kill existing if present
tmux kill-session -t "$SESSION" 2>/dev/null

# Create session
otmux new "$SESSION" -d
tmux rename-window -t "${SESSION}:0" "core"

# Helper: add agent to current window (split + register)
PANE_IDX=0
add_agent() {
  local role="$1"
  local session="$SESSION"
  local window="$CURRENT_WINDOW"

  if [ "$PANE_IDX" -gt 0 ]; then
    tmux split-window -t "${session}:${window}" -h
    tmux select-layout -t "${session}:${window}" tiled
  fi

  # Get the actual pane index after tiling
  local last_pane
  last_pane=$(tmux list-panes -t "${session}:${window}" -F "#{pane_index}" | tail -1)

  # Register in hivemind
  echo "${session}:${window}.${last_pane}|${role}" >> /tmp/hivemind.roles

  # Set pane title
  tmux select-pane -t "${session}:${window}.${last_pane}" -T "$role"

  PANE_IDX=$((PANE_IDX + 1))
}

new_window() {
  local name="$1"
  CURRENT_WINDOW=$(tmux new-window -t "$SESSION" -n "$name" -P -F "#{window_index}")
  PANE_IDX=0
}

# === Window 0: Core ===
CURRENT_WINDOW=0
PANE_IDX=0
add_agent "planner"
add_agent "coder"
add_agent "tester"
add_agent "reviewer"
add_agent "researcher"
add_agent "task-orchestrator"

# === Window 1: SPARC ===
new_window "sparc"
add_agent "sparc-orchestrator"
add_agent "sparc-coord"
add_agent "sparc-coder"
add_agent "specification"
add_agent "pseudocode"
add_agent "architecture"
add_agent "refinement"

# === Window 2: Security ===
new_window "security"
add_agent "security-architect"
add_agent "security-architect-aidefence"
add_agent "aidefence-guardian"
add_agent "pii-detector"
add_agent "security-auditor"
add_agent "injection-analyst"
add_agent "security-manager"
add_agent "claims-authorizer"

# === Window 3: Performance ===
new_window "performance"
add_agent "performance-engineer"
add_agent "performance-optimizer"
add_agent "performance-benchmarker"
add_agent "perf-analyzer"
add_agent "Performance Monitor"
add_agent "Benchmark Suite"

# === Window 4: Memory & Learning ===
new_window "memory"
add_agent "memory-specialist"
add_agent "memory-coordinator"
add_agent "sona-learning-optimizer"
add_agent "reasoningbank-learner"
add_agent "swarm-memory-manager"
add_agent "ml-developer"

# === Window 5: Distributed/Consensus ===
new_window "consensus"
add_agent "consensus-coordinator"
add_agent "crdt-synchronizer"
add_agent "raft-manager"
add_agent "gossip-coordinator"
add_agent "byzantine-coordinator"
add_agent "quorum-manager"
add_agent "collective-intelligence-coordinator"

# === Window 6: Swarm/Coordination ===
new_window "swarm"
add_agent "swarm-init"
add_agent "smart-agent"
add_agent "adaptive-coordinator"
add_agent "hierarchical-coordinator"
add_agent "mesh-coordinator"
add_agent "Load Balancing Coordinator"
add_agent "Resource Allocator"
add_agent "Topology Optimizer"

# === Window 7: GitHub/CI ===
new_window "github"
add_agent "pr-manager"
add_agent "code-review-swarm"
add_agent "release-manager"
add_agent "release-swarm"
add_agent "sync-coordinator"
add_agent "workflow-automation"
add_agent "cicd-engineer"
add_agent "issue-tracker"

# === Window 8: GitHub Extended ===
new_window "github-ext"
add_agent "swarm-issue"
add_agent "swarm-pr"
add_agent "multi-repo-swarm"
add_agent "repo-architect"
add_agent "project-board-sync"
add_agent "github-modes"

# === Window 9: Flow Nexus ===
new_window "flow-nexus"
add_agent "flow-nexus-auth"
add_agent "flow-nexus-app-store"
add_agent "flow-nexus-sandbox"
add_agent "flow-nexus-neural"
add_agent "flow-nexus-challenges"
add_agent "flow-nexus-workflow"
add_agent "flow-nexus-payments"
add_agent "flow-nexus-swarm"
add_agent "flow-nexus-user-tools"

# === Window 10: Architecture/DDD ===
new_window "architecture"
add_agent "ddd-domain-expert"
add_agent "v3-integration-architect"
add_agent "adr-architect"
add_agent "system-architect"
add_agent "code-analyzer"
add_agent "api-docs"

# === Window 11: Development ===
new_window "development"
add_agent "backend-dev"
add_agent "mobile-dev"
add_agent "base-template-generator"
add_agent "production-validator"
add_agent "tdd-london-swarm"
add_agent "test-long-runner"

# === Window 12: Analytics/Finance ===
new_window "analytics"
add_agent "trading-predictor"
add_agent "agentic-payments"
add_agent "matrix-optimizer"
add_agent "pagerank-analyzer"
add_agent "sublinear-goal-planner"
add_agent "goal-planner"

# === Window 13: Misc ===
new_window "misc"
add_agent "stream-chain"

# Summary
echo ""
echo "=== userAgentTeam setup complete ==="
TOTAL_PANES=$(tmux list-panes -t "$SESSION" -s | wc -l | tr -d ' ')
TOTAL_WINDOWS=$(tmux list-windows -t "$SESSION" | wc -l | tr -d ' ')
TOTAL_ROLES=$(grep "^${SESSION}:" /tmp/hivemind.roles | wc -l | tr -d ' ')
echo "Session:  $SESSION"
echo "Windows:  $TOTAL_WINDOWS"
echo "Panes:    $TOTAL_PANES"
echo "Roles:    $TOTAL_ROLES registered in hivemind"
echo ""
echo "Attach with: tmux attach -t $SESSION"
echo "Start agents with: hiveMind sweep.loop 30 (from OOSH)"
echo ""
echo "NOTE: Agents are NOT started yet (no claude instances)."
echo "To start agents in a window: for each pane, run 'claude --dangerously-skip-permissions'"
