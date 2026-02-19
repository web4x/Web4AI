#!/bin/bash
# Restart osshTeam agents with proper session names
# Run this AFTER all 3 agents have compacted and exited

echo "Restarting osshTeam agents with named sessions..."

# Wait for agents to finish compacting
sleep 5

# Expert (0.0)
otmux send osshTeam:0.0 "unset CLAUDECODE && claude --resume ossh-expert" Enter
echo "Expert starting..."

# Tester (0.2)
otmux send osshTeam:0.2 "unset CLAUDECODE && claude --resume ossh-tester" Enter
echo "Tester starting..."

# SM (0.3) - on sonnet to save subscription
otmux send osshTeam:0.3 "unset CLAUDECODE && claude --model sonnet --resume scrum-master" Enter
echo "SM starting..."

echo "All agents restarting. Verify with: otmux tree.detailed"
