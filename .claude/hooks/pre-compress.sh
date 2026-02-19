#!/bin/bash
# Pre-compact hook: Auto-detects agent role, auto-saves, generates boot file, schedules resume
# Boot file = single slim file (~20 lines) that's ALL the agent reads post-compact
# Prevents death spiral: no more reading 3 large files to recover identity

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/Shared/Workspaces/AI/Claude}"
ROLES_FILE="$HOME/config/hivemind.roles.env"
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

# --- Skip protected panes (e.g. Tron's 0.4) — not managed agents ---
PROTECTED_PANE=$(sed -n 's/^export HIVEMIND_PROTECTED_PANE="\(.*\)"/\1/p' "$HOME/config/oosh.env" 2>/dev/null)
if [ -n "$PROTECTED_PANE" ] && echo "$PANE_TARGET" | grep -qF ":${PROTECTED_PANE}"; then
    echo "Pane $PROTECTED_PANE is protected — skipping boot file and auto-resume"
    echo "=== END ==="
    exit 0
fi

# --- Map role to files (generic — derives paths from role name) ---
CONTEXT_FILE=""
SKILL_FILE=""
LEARNINGS_FILE=""
PEER_PANE=""
LOOP_CMD=""

if [ -n "$CURRENT_ROLE" ]; then
    # Standard paths: session/agents/<role>/context.md, .claude/agents/<role>/SKILL.md
    if [ -f "$PROJECT_DIR/session/agents/$CURRENT_ROLE/context.md" ]; then
        CONTEXT_FILE="$PROJECT_DIR/session/agents/$CURRENT_ROLE/context.md"
    elif [ -f "$PROJECT_DIR/session/agents/${CURRENT_ROLE}.context.md" ]; then
        CONTEXT_FILE="$PROJECT_DIR/session/agents/${CURRENT_ROLE}.context.md"
    fi
    if [ -f "$PROJECT_DIR/.claude/agents/$CURRENT_ROLE/SKILL.md" ]; then
        SKILL_FILE=".claude/agents/$CURRENT_ROLE/SKILL.md"
    fi
    if [ -f "$PROJECT_DIR/session/agents/$CURRENT_ROLE/learnings.md" ]; then
        LEARNINGS_FILE="session/agents/$CURRENT_ROLE/learnings.md"
    fi
fi

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

# Check for curated boot file — role-specific, hand-crafted content
CURATED_BOOT="$BOOT_AGENT_DIR/boot-curated.md"
if [ -f "$CURATED_BOOT" ]; then
    # Use curated boot: copy and inject dynamic pane target
    sed "s|projectTeam:[0-9]\.[0-9]|${PANE_TARGET:-unknown}|g" "$CURATED_BOOT" > "$BOOT_FILE"
    echo "Boot: using curated template for $ROLE_NAME"
else
    # Generic boot template
    cat > "$BOOT_FILE" << BOOT
# Boot: $ROLE_DISPLAY
*Auto-generated $TIMESTAMP. This is ALL you need to read post-compact.*

## You are: $ROLE_DISPLAY
## Pane: ${PANE_TARGET:-unknown}
## Goal: ${CURRENT_GOAL:-Check context file}

## Immediate actions:
1. Read team goals: \`session/team-goals.md\`
2. Run \`TaskList\` — check for queued tasks from before compact
3. Read base skill: \`session/base-skills/task-queue.md\`
4. Read context file if needed (see Deep files below)
5. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: \`$SKILL_FILE\`
- Context: \`${CONTEXT_FILE#$PROJECT_DIR/}\`
$([ -n "$LEARNINGS_FILE" ] && echo "- Learnings: \`$LEARNINGS_FILE\`")

## Rules (memorize, don't re-read):
- Passive mode = death. Always have a background loop running.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
BOOT
fi

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
