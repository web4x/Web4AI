#!/bin/bash
# Setup tmux sessions for OOSH script specialist teams
# Usage: ./setup-script-teams.sh [scriptname]   — one script
#        ./setup-script-teams.sh all             — all scripts
#        ./setup-script-teams.sh list            — list available
#        ./setup-script-teams.sh stop [name]     — kill session
#
# Each session has 2 panes: expert (0) + tester (1)
# Session naming: {script}Team (e.g., configTeam, logTeam)

OOSH_DIR="/Users/donges/oosh"
WORKSPACE="/Users/Shared/Workspaces/AI/Claude"
AGENTS_DIR="$WORKSPACE/.claude/agents"

# All scripts that have specialist teams
CORE_SCRIPTS="this oo config log debug state test.suite"
AGENT_SCRIPTS="hiveMind claudeCode claudeFlow scrumMaster otmux agentRoom"
TOOL_SCRIPTS="backup certificates disk share snet"
UTIL_SCRIPTS="check context fix index line loop map myId os osx path replace status tt webitem"

ALL_SCRIPTS="$CORE_SCRIPTS $AGENT_SCRIPTS $TOOL_SCRIPTS $UTIL_SCRIPTS"

setup_team() {
    local script="$1"
    local session="${script}Team"

    # Check if session already exists
    if tmux has-session -t "$session" 2>/dev/null; then
        echo "Session $session already exists — skipping"
        return 0
    fi

    # Check if SKILL.md exists
    if [ ! -f "$AGENTS_DIR/${script}-expert/SKILL.md" ]; then
        echo "ERROR: $AGENTS_DIR/${script}-expert/SKILL.md not found — run agent trainer first"
        return 1
    fi

    echo "Creating session: $session"

    # Create session with expert pane
    tmux new-session -d -s "$session" -x 200 -y 50

    # Split for tester pane
    tmux split-window -h -t "$session:0"

    # Label panes
    tmux select-pane -t "$session:0.0" -T "${script}-expert"
    tmux select-pane -t "$session:0.1" -T "${script}-tester"

    # Register in hiveMind
    hiveMind role.register "$session:0.0" "${script}-expert" 2>/dev/null
    hiveMind role.register "$session:0.1" "${script}-tester" 2>/dev/null

    echo "  Pane 0: ${script}-expert"
    echo "  Pane 1: ${script}-tester"
    echo "  Session: $session — ready for agent bootstrap"
}

stop_team() {
    local script="$1"
    local session="${script}Team"

    if tmux has-session -t "$session" 2>/dev/null; then
        tmux kill-session -t "$session"
        echo "Stopped: $session"
    else
        echo "Session $session not running"
    fi
}

list_teams() {
    echo "=== OOSH Script Teams ==="
    echo ""
    echo "CORE FRAMEWORK:"
    for s in $CORE_SCRIPTS; do
        local status="stopped"
        tmux has-session -t "${s}Team" 2>/dev/null && status="RUNNING"
        printf "  %-15s %s\n" "$s" "$status"
    done
    echo ""
    echo "AGENT INFRASTRUCTURE:"
    for s in $AGENT_SCRIPTS; do
        local status="stopped"
        tmux has-session -t "${s}Team" 2>/dev/null && status="RUNNING"
        printf "  %-15s %s\n" "$s" "$status"
    done
    echo ""
    echo "USER-FACING TOOLS:"
    for s in $TOOL_SCRIPTS; do
        local status="stopped"
        tmux has-session -t "${s}Team" 2>/dev/null && status="RUNNING"
        printf "  %-15s %s\n" "$s" "$status"
    done
    echo ""
    echo "UTILITIES:"
    for s in $UTIL_SCRIPTS; do
        local status="stopped"
        tmux has-session -t "${s}Team" 2>/dev/null && status="RUNNING"
        printf "  %-15s %s\n" "$s" "$status"
    done
}

case "${1:-list}" in
    all)
        for script in $ALL_SCRIPTS; do
            setup_team "$script"
        done
        echo ""
        echo "All sessions created. Bootstrap agents with:"
        echo "  hiveMind agent.bootstrap <role> <session>:<pane>"
        ;;
    list)
        list_teams
        ;;
    stop)
        if [ -n "$2" ]; then
            stop_team "$2"
        else
            echo "Usage: $0 stop <scriptname>"
        fi
        ;;
    stopall)
        for script in $ALL_SCRIPTS; do
            stop_team "$script"
        done
        ;;
    *)
        setup_team "$1"
        ;;
esac
