#!/bin/bash
# Pre-compact hook: Auto-detects agent role, auto-saves, generates boot file, schedules resume
# Boot file = single slim file (~20 lines) that's ALL the agent reads post-compact
# Prevents death spiral: no more reading 3 large files to recover identity

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/Shared/Workspaces/AI/Claude}"
ROLES_FILE="/tmp/hivemind.roles"
AGENTS_DIR="$PROJECT_DIR/session/agents"

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

# --- Skip Tron interface pane (0.4) — not a managed agent ---
if echo "$PANE_TARGET" | grep -qE ':[0-9]+\.4$'; then
    echo "Pane 0.4 is Tron interface — skipping boot file and auto-resume"
    echo "=== END ==="
    exit 0
fi

# --- Map role to files ---
CONTEXT_FILE=""
SKILL_FILE=""
LEARNINGS_FILE=""
PEER_PANE=""
LOOP_CMD=""
case "$CURRENT_ROLE" in
    *scrum*|*Scrum*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/scrum-master.context.md"
        SKILL_FILE=".claude/agents/scrum-master/SKILL.md"
        ;;
    *expert*|*Expert*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/oosh-expert.context.md"
        SKILL_FILE=".claude/agents/oosh-expert/SKILL.md"
        ;;
    *tester*|*Tester*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/oosh-tester.context.md"
        SKILL_FILE=".claude/agents/oosh-tester/SKILL.md"
        ;;
    *agent-trainer*|*trainer*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/agent-trainer.context.md"
        SKILL_FILE=".claude/agents/agent-trainer/SKILL.md"
        ;;
    *teacher*|*Teacher*)
        CONTEXT_FILE="$PROJECT_DIR/session/agent.context.md"
        SKILL_FILE=".claude/agents/agent-teacher/SKILL.md"
        ;;
    *woda-writer*|*writer*)
        CONTEXT_FILE="$PROJECT_DIR/session/woda-writer.context.md"
        SKILL_FILE=".claude/agents/woda-writer/SKILL.md"
        LEARNINGS_FILE="session/woda-writer.learnings.md"
        PEER_PANE="claudeWoda:0.1"
        LOOP_CMD="sleep 300 && otmux pane.capture claudeWoda:0.1 15"
        ;;
    *woda-scribe*|*scribe*)
        CONTEXT_FILE="$PROJECT_DIR/session/wodaScribe.context.md"
        SKILL_FILE=".claude/agents/woda-scribe/SKILL.md"
        LEARNINGS_FILE="session/woda-scribe.learnings.md"
        PEER_PANE="claudeWoda:0.0"
        LOOP_CMD="sleep 300 && otmux pane.capture claudeWoda:0.0 5"
        ;;
    *task-agent*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/task-agent.context.md"
        SKILL_FILE=".claude/agents/task-agent/SKILL.md"
        ;;
    *product-owner*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/product-owner.context.md"
        SKILL_FILE=".claude/agents/product-owner/SKILL.md"
        ;;
    *developer*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/developer.context.md"
        SKILL_FILE=".claude/agents/developer/SKILL.md"
        ;;
    *orchestrator*)
        CONTEXT_FILE="$PROJECT_DIR/session/agents/orchestrator.context.md"
        SKILL_FILE=".claude/agents/agent-teacher/SKILL.md"
        ;;
    *claude-opus*)
        CONTEXT_FILE="$PROJECT_DIR/session/claude-opus.context.md"
        PEER_PANE="claudeOpus2kTMUX:0.2"
        ;;
    *cursor-agent*)
        CONTEXT_FILE="$PROJECT_DIR/session/cursor-agent.context.md"
        PEER_PANE="claudeOpus2kTMUX:0.0"
        ;;
    *)
        # Fallback: auto-discover from .claude/agents/<role>/SKILL.md
        if [ -n "$CURRENT_ROLE" ] && [ -f "$PROJECT_DIR/.claude/agents/$CURRENT_ROLE/SKILL.md" ]; then
            SKILL_FILE=".claude/agents/$CURRENT_ROLE/SKILL.md"
            CONTEXT_FILE="$PROJECT_DIR/session/agents/$CURRENT_ROLE.context.md"
        fi
        ;;
esac

# --- Auto-commit dirty session files ---
cd "$PROJECT_DIR" 2>/dev/null
if git diff --quiet session/ 2>/dev/null; then
    echo "Git: session/ clean"
else
    git add -f session/*.md session/**/*.md 2>/dev/null
    git commit -m "Auto-save: ${CURRENT_ROLE:-unknown} pre-compact $(date +%H:%M)" --no-verify 2>/dev/null
    echo "Git: auto-committed session files"
fi

# --- Generate boot file ---
ROLE_NAME="${CURRENT_ROLE:-unknown}"
BOOT_AGENT_DIR="$AGENTS_DIR/$ROLE_NAME"
mkdir -p "$BOOT_AGENT_DIR"
BOOT_FILE="$BOOT_AGENT_DIR/boot.md"
ROLE_DISPLAY="${CURRENT_ROLE:-unknown}"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

# Extract current goal from context file (first line starting with ## or after "Goal")
CURRENT_GOAL=""
if [ -n "$CONTEXT_FILE" ] && [ -f "$CONTEXT_FILE" ]; then
    CURRENT_GOAL=$(grep -A1 -i "goal\|## Current\|## Active" "$CONTEXT_FILE" 2>/dev/null | head -3 | tail -2 | sed 's/^[# ]*//')
fi

cat > "$BOOT_FILE" << BOOT
# Boot: $ROLE_DISPLAY
*Auto-generated $TIMESTAMP. This is ALL you need to read post-compact.*

## You are: $ROLE_DISPLAY
## Pane: ${PANE_TARGET:-unknown}
## Goal: ${CURRENT_GOAL:-Check context file}

## Immediate actions:
1. Start monitoring loop: \`$LOOP_CMD\`
2. Check peer: \`otmux pane.capture ${PEER_PANE:-"your peer pane"} 10\`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: \`$SKILL_FILE\`
- Context: \`${CONTEXT_FILE#$PROJECT_DIR/}\`
$([ -n "$LEARNINGS_FILE" ] && echo "- Learnings: \`$LEARNINGS_FILE\`")

## Rules (memorize, don't re-read):
- Passive mode = death. Always have a background loop running.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
BOOT

echo "Boot file: $BOOT_FILE ($(wc -l < "$BOOT_FILE") lines)"

# --- Schedule auto-resume with boot file reference ---
if [ -n "$PANE_TARGET" ]; then
    BOOT_REL="session/agents/${CURRENT_ROLE:-unknown}/boot.md"
    RESUME_MSG="You just compacted. Read $BOOT_REL — it has everything you need. Do NOT read other files unless the boot file says to."

    # Kill any previous resume process for this pane (prevent pile-up)
    RESUME_PID_FILE="/tmp/resume-$(echo "$PANE_TARGET" | tr ':.' '-').pid"
    if [ -f "$RESUME_PID_FILE" ]; then
        OLD_PID=$(cat "$RESUME_PID_FILE")
        kill "$OLD_PID" 2>/dev/null
        rm -f "$RESUME_PID_FILE"
    fi

    # Fork background process: wait for compact to finish, then send resume prompt
    (
        echo $$ > "$RESUME_PID_FILE"
        sleep 15
        tmux send-keys -t "$PANE_TARGET" "$RESUME_MSG" Enter Enter
        rm -f "$RESUME_PID_FILE"
    ) &>/dev/null &
    disown 2>/dev/null

    echo "Auto-resume: will send boot file reference to $PANE_TARGET in 15s"
fi

echo "=== END ==="
exit 0
