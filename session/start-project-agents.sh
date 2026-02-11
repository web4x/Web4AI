#!/bin/bash
# Start Claude Code in all projectTeam panes, rename sessions, teach roles
# Run from OOSH pane: source session/start-project-agents.sh

SESSION="projectTeam"
REGISTRY="/tmp/hivemind.roles"

echo "=== Starting Claude in all projectTeam panes ==="

# Start Claude in each pane (staggered to avoid overload)
while IFS='|' read -r target role; do
  [ -z "$target" ] || [ -z "$role" ] && continue
  case "$target" in "${SESSION}:"*) ;; *) continue ;; esac

  echo "Starting Claude in $target ($role)..."
  otmux send.enter "$target" "claude"
  sleep 3
done < "$REGISTRY"

echo ""
echo "Waiting 15s for all Claude instances to initialize..."
sleep 15

# Rename each session and teach role
echo "=== Renaming sessions and teaching roles ==="
while IFS='|' read -r target role; do
  [ -z "$target" ] || [ -z "$role" ] && continue
  case "$target" in "${SESSION}:"*) ;; *) continue ;; esac

  local_name="${role}-session"
  echo "Renaming $target -> $local_name"
  otmux send.enter "$target" "/rename ${local_name}"
  sleep 2

  # Teach role: read SKILL.md + full reading list + write context file
  echo "Teaching $role..."
  otmux send.enter "$target" "/rename ${role}@sonnet"
  sleep 2
  otmux send.enter "$target" "You are the $role agent. Read .claude/agents/$role/SKILL.md to learn your role. Then read your full Reading List section — CLAUDE.md, agent-overview.md, and all docs listed. Write your context file to session/agents/${role}.context.md when done."
  sleep 1
done < "$REGISTRY"

echo ""
echo "=== All agents started ==="
echo "Checking status..."
hiveMind team.status "$SESSION"
