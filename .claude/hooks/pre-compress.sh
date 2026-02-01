#!/bin/bash
# Pre-compact hook: Auto-detects agent role, saves context, schedules auto-resume
# Works for all agents in tmux session cursorOrchestrator

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/Shared/Workspaces/AI/Claude}"
ROLES_FILE="/tmp/hivemind.roles"

# --- Detect current pane and role ---
PANE_TARGET=""
CURRENT_ROLE=""
if [ -n "$TMUX_PANE" ]; then
    PANE_TARGET=$(tmux display-message -t "$TMUX_PANE" -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
fi
if [ -n "$PANE_TARGET" ] && [ -f "$ROLES_FILE" ]; then
    CURRENT_ROLE=$(grep "^${PANE_TARGET}|" "$ROLES_FILE" 2>/dev/null | cut -d'|' -f2)
fi

echo "=== PRE-COMPACT: ${CURRENT_ROLE:-unknown} @ ${PANE_TARGET:-unknown} ==="

# --- Map role to context file ---
CONTEXT_FILE=""
SKILL_FILE=""
case "$CURRENT_ROLE" in
    *scrum*|*Scrum*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/scrum-master.context.md"
        SKILL_FILE="$PROJECT_DIR/.claude/agents/scrum-master/SKILL.md"
        ;;
    *expert*|*Expert*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/oosh-expert.context.md"
        SKILL_FILE="$PROJECT_DIR/.claude/agents/oosh-expert/SKILL.md"
        ;;
    *tester*|*Tester*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/oosh-tester.context.md"
        SKILL_FILE="$PROJECT_DIR/.claude/agents/oosh-tester/SKILL.md"
        ;;
    *teacher*|*Teacher*)
        CONTEXT_FILE="$PROJECT_DIR/session/agent.context.md"
        SKILL_FILE="$PROJECT_DIR/.claude/agents/agent-teacher/SKILL.md"
        ;;
esac

# --- Show context summary ---
if [ -n "$CONTEXT_FILE" ] && [ -f "$CONTEXT_FILE" ]; then
    echo "Context: $CONTEXT_FILE"
    echo "---"
    head -25 "$CONTEXT_FILE"
    echo "---"
else
    echo "No context file found for role: ${CURRENT_ROLE:-unknown}"
fi

# --- Schedule auto-resume after compact ---
if [ -n "$PANE_TARGET" ]; then
    # Build role-specific resume prompt
    case "$CURRENT_ROLE" in
        *scrum*|*Scrum*)
            RESUME_MSG="You just compacted. You are the ScrumMaster agent. Read session/agents/scrum-master.context.md and .claude/agents/scrum-master/SKILL.md then immediately resume monitoring all agent panes for permission prompts. Do not wait for further instructions."
            ;;
        *expert*|*Expert*)
            RESUME_MSG="You just compacted. You are the OOSH Expert agent. Read session/agents/oosh-expert.context.md and .claude/agents/oosh-expert/SKILL.md then resume your current implementation task. Do not wait for further instructions."
            ;;
        *tester*|*Tester*)
            RESUME_MSG="You just compacted. You are the OOSH Tester agent. Read session/agents/oosh-tester.context.md and .claude/agents/oosh-tester/SKILL.md then resume your current testing task. Do not wait for further instructions."
            ;;
        *teacher*|*Teacher*)
            RESUME_MSG="You just compacted. You are the Agent Teacher. Read session/agent.context.md and .claude/agents/agent-teacher/SKILL.md then resume orchestration. Do not wait for further instructions."
            ;;
        *)
            RESUME_MSG="You just compacted. Read your context file and SKILL.md, then resume your duties immediately."
            ;;
    esac

    # Fork background process: wait for compact to finish, then send resume prompt
    (
        sleep 15
        tmux send-keys -t "$PANE_TARGET" "$RESUME_MSG" Enter
    ) &>/dev/null &
    disown 2>/dev/null

    echo ""
    echo "Auto-resume scheduled: will send resume prompt to $PANE_TARGET in 15s"
fi

echo "=== END ==="
exit 0
