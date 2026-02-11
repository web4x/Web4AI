#!/bin/bash
# Pre-compact hook: Generic version — works for ANY role name.
# Derives all file paths from the role name (convention over configuration).
# Boot file = single slim file (~20 lines) that's ALL the agent reads post-compact.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
ROLES_FILE="/tmp/hivemind.roles"
BOOT_DIR="$PROJECT_DIR/session/boot"
mkdir -p "$BOOT_DIR" "$PROJECT_DIR/session/agents" "$PROJECT_DIR/session/learnings"

# --- Detect current pane and role ---
PANE_TARGET=""
CURRENT_ROLE=""
if [ -n "$TMUX_PANE" ]; then
    PANE_TARGET=$(tmux display-message -t "$TMUX_PANE" \
      -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
fi
if [ -n "$PANE_TARGET" ] && [ -f "$ROLES_FILE" ]; then
    CURRENT_ROLE=$(grep "^${PANE_TARGET}|" "$ROLES_FILE" 2>/dev/null | cut -d'|' -f2)
fi

ROLE="${CURRENT_ROLE:-unknown}"
echo "=== PRE-COMPACT: $ROLE @ ${PANE_TARGET:-unknown} ==="

# --- Derive all file paths from role name (convention over configuration) ---
CONTEXT_FILE="$PROJECT_DIR/session/agents/${ROLE}.context.md"
SKILL_FILE=".claude/agents/${ROLE}/SKILL.md"
LEARNINGS_FILE="session/learnings/${ROLE}.learnings.md"

# --- Detect peer from roles file (any other role in same session) ---
PEER_PANE=""
if [ -n "$PANE_TARGET" ] && [ -f "$ROLES_FILE" ]; then
    SESSION_NAME=$(echo "$PANE_TARGET" | cut -d: -f1)
    PEER_PANE=$(grep "^${SESSION_NAME}:" "$ROLES_FILE" 2>/dev/null \
      | grep -v "^${PANE_TARGET}|" | head -1 | cut -d'|' -f1)
fi

LOOP_CMD="sleep 300 && otmux pane.capture ${PEER_PANE:-\"your peer pane\"} 15"

# --- Auto-commit dirty session files ---
cd "$PROJECT_DIR" 2>/dev/null
if git diff --quiet session/ 2>/dev/null; then
    echo "Git: session/ clean"
else
    git add -f session/*.md session/**/*.md 2>/dev/null
    git commit -m "Auto-save: $ROLE pre-compact $(date +%H:%M)" --no-verify 2>/dev/null
    echo "Git: auto-committed session files"
fi

# --- Extract current goal from context file ---
CURRENT_GOAL=""
if [ -f "$CONTEXT_FILE" ]; then
    CURRENT_GOAL=$(grep -A1 -i "goal\|## Current\|## Active" "$CONTEXT_FILE" \
      2>/dev/null | head -3 | tail -2 | sed 's/^[# ]*//')
fi

# --- Generate boot file ---
BOOT_FILE="$BOOT_DIR/${ROLE}.md"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

cat > "$BOOT_FILE" << BOOT
# Boot: $ROLE
*Auto-generated $TIMESTAMP. This is ALL you need to read post-compact.*

## You are: $ROLE
## Pane: ${PANE_TARGET:-unknown}
## Goal: ${CURRENT_GOAL:-Check context file}

## Immediate actions:
1. Start monitoring loop: \`$LOOP_CMD\`
2. Check peer: \`otmux pane.capture ${PEER_PANE:-"your peer pane"} 10\`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: \`$SKILL_FILE\`
- Context: \`session/agents/${ROLE}.context.md\`
$([ -f "$PROJECT_DIR/$LEARNINGS_FILE" ] && echo "- Learnings: \`$LEARNINGS_FILE\`")

## Rules (memorize, don't re-read):
- Passive mode = death. Always have a background loop running.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
BOOT

echo "Boot file: $BOOT_FILE ($(wc -l < "$BOOT_FILE") lines)"

# --- Schedule auto-resume with boot file reference ---
if [ -n "$PANE_TARGET" ]; then
    BOOT_REL="session/boot/${ROLE}.md"
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
