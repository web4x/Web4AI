#!/bin/bash
# Pre-compact hook: Auto-detects agent role, auto-saves, generates boot file, schedules resume
# Boot file = single slim file (~20 lines) that's ALL the agent reads post-compact
# Prevents death spiral: no more reading 3 large files to recover identity

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/Shared/Workspaces/AI/Claude}"
ROLES_FILE="$HOME/config/hivemind.roles.env"
AGENTS_DIR="$PROJECT_DIR/session/agents"

# --- Detect current pane + role@host from GROUND TRUTH (C.3 / OTR-11) ---
# Anchor on `otmux pane.self` (PID-walk, never stale) — NOT $TMUX_PANE, the last
# BUG7 holdout (stale/empty after fork/rewind/env-i → wrong pane → the "unknown"
# clobber). role@host comes from the LIVE pane title via the ONE shared resolver
# `hiveMind identity.resolve` (c.0 projection); registry is a cache cross-check.
PANE_TARGET=""
CURRENT_ROLE=""
CURRENT_HOST=""

if command -v otmux >/dev/null 2>&1; then
    PANE_TARGET=$(otmux pane.self target 2>/dev/null | grep -oE '^[A-Za-z0-9_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+' | head -1)
fi
# Last-resort ONLY if pane.self is unavailable (non-OOSH env). May be stale — the
# ground-truth anchor above is preferred; this preserves behavior where OOSH isn't
# on PATH. (Tester T-BOOT-IDENTITY must confirm pane.self resolves in-hook.)
if [ -z "$PANE_TARGET" ] && [ -n "$TMUX_PANE" ]; then
    PANE_TARGET=$(tmux display-message -t "$TMUX_PANE" -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
fi

# role@host from the shared resolver (live pane title > registry). Grep the
# role@host pattern anywhere (skips the leading blank the this-dispatch prepends).
if [ -n "$PANE_TARGET" ] && command -v hiveMind >/dev/null 2>&1; then
    IDENTITY=$(hiveMind protected.identity.resolve "$PANE_TARGET" 2>/dev/null | grep -oE '[A-Za-z0-9._-]+@[A-Za-z0-9._-]+' | head -1)
    if [ -n "$IDENTITY" ]; then
        CURRENT_ROLE="${IDENTITY%@*}"
        CURRENT_HOST="${IDENTITY##*@}"
    fi
fi

# Registry cross-check / fallback (cache) when the live resolver yielded nothing.
if [ -z "$CURRENT_ROLE" ] && [ -n "$PANE_TARGET" ] && [ -f "$ROLES_FILE" ]; then
    CURRENT_ROLE=$(grep "^${PANE_TARGET}|" "$ROLES_FILE" 2>/dev/null | cut -d'|' -f2)
fi

# Deep fallbacks (cross-session agents): scan boot/context for this pane address.
if [ -z "$CURRENT_ROLE" ] && [ -n "$PANE_TARGET" ]; then
    for boot in "$AGENTS_DIR"/*/boot.md; do
        [ -f "$boot" ] || continue
        if grep -q "## Pane: $PANE_TARGET" "$boot" 2>/dev/null; then
            CURRENT_ROLE=$(basename "$(dirname "$boot")")
            [ "$CURRENT_ROLE" = "unknown" ] && CURRENT_ROLE=""
            [ -n "$CURRENT_ROLE" ] && break
        fi
    done
    if [ -z "$CURRENT_ROLE" ]; then
        for ctx in "$AGENTS_DIR"/*/context.md; do
            [ -f "$ctx" ] || continue
            if grep -q "Pane.*$PANE_TARGET" "$ctx" 2>/dev/null; then
                CURRENT_ROLE=$(basename "$(dirname "$ctx")")
                [ "$CURRENT_ROLE" = "unknown" ] && CURRENT_ROLE=""
                [ -n "$CURRENT_ROLE" ] && break
            fi
        done
    fi
fi

# Normalize: an @host-suffixed dir name yields both role + host; default host.
[ "$CURRENT_ROLE" = "unknown" ] && CURRENT_ROLE=""
case "$CURRENT_ROLE" in *@*) CURRENT_HOST="${CURRENT_ROLE##*@}"; CURRENT_ROLE="${CURRENT_ROLE%@*}" ;; esac
[ -z "$CURRENT_HOST" ] && CURRENT_HOST=$(hostname -s 2>/dev/null)

# Register discovered role for future compacts (cache write-through).
if [ -n "$CURRENT_ROLE" ] && [ -n "$PANE_TARGET" ] && [ -f "$ROLES_FILE" ]; then
    if ! grep -q "^${PANE_TARGET}|" "$ROLES_FILE" 2>/dev/null; then
        echo "${PANE_TARGET}|${CURRENT_ROLE}" >> "$ROLES_FILE"
    fi
fi

# --- @host-aware agent dir + FAIL-SAFE for unresolved identity (OTR-11 core) ---
# NEVER write the shared session/agents/unknown/ sink (clobber-by-construction).
# Resolved: prefer session/agents/<role>@<host>/ (duplicated fork) if it exists,
# else bare session/agents/<role>/. Unresolved: quarantine to a UNIQUE path that
# cannot collide between two unknowns nor overwrite any real <role>/ dir.
UNRESOLVED=false
if [ -z "$CURRENT_ROLE" ]; then
    UNRESOLVED=true
    ROLE_DIR="_unresolved"
elif [ -d "$AGENTS_DIR/${CURRENT_ROLE}@${CURRENT_HOST}" ]; then
    ROLE_DIR="${CURRENT_ROLE}@${CURRENT_HOST}"
else
    ROLE_DIR="$CURRENT_ROLE"
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
    # @host-aware paths: prefer session/agents/<role>@<host>/, else bare <role>/.
    if [ -f "$PROJECT_DIR/session/agents/$ROLE_DIR/context.md" ]; then
        CONTEXT_FILE="$PROJECT_DIR/session/agents/$ROLE_DIR/context.md"
    elif [ -f "$PROJECT_DIR/session/agents/${CURRENT_ROLE}.context.md" ]; then
        CONTEXT_FILE="$PROJECT_DIR/session/agents/${CURRENT_ROLE}.context.md"
    fi
    if [ -f "$PROJECT_DIR/.claude/agents/$CURRENT_ROLE/SKILL.md" ]; then
        SKILL_FILE=".claude/agents/$CURRENT_ROLE/SKILL.md"
    fi
    if [ -f "$PROJECT_DIR/session/agents/$ROLE_DIR/learnings.md" ]; then
        LEARNINGS_FILE="session/agents/$ROLE_DIR/learnings.md"
    fi
fi

# --- Auto-commit dirty session files ---
# NEVER attribute a commit to "unknown" (OTR-11) — a pane-scoped message when the
# identity is unresolved; the dirty files are still preserved, just not mislabeled.
cd "$PROJECT_DIR" 2>/dev/null
if git diff --quiet session/ 2>/dev/null; then
    echo "Git: session/ clean"
else
    git add -f session/*.md session/**/*.md 2>/dev/null
    if [ "$UNRESOLVED" = true ]; then
        COMMIT_MSG="Auto-save: pre-compact ${PANE_TARGET:-?} (identity UNRESOLVED) $(date +%H:%M)"
    else
        COMMIT_MSG="Auto-save: ${CURRENT_ROLE} pre-compact $(date +%H:%M)"
    fi
    git commit -m "$COMMIT_MSG" --no-verify 2>/dev/null
    echo "Git: auto-committed session files"
fi

# --- Generate boot file (@host dir; FAIL-SAFE quarantine when unresolved) ---
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

if [ "$UNRESOLVED" = true ]; then
    # OTR-11 FAIL-SAFE: identity unresolvable → NEVER write the shared unknown/
    # sink (clobber-by-construction). Quarantine to a UNIQUE path (pane + pid) that
    # cannot collide between two unknowns nor overwrite any real <role>/ dir, and
    # warn LOUDLY. team.audit flags _unresolved/* → reconcile can re-attribute it.
    QUAR_DIR="$AGENTS_DIR/_unresolved"
    mkdir -p "$QUAR_DIR"
    SAFE_PANE=$(echo "${PANE_TARGET:-nopane}" | tr ':.' '--')
    BOOT_FILE="$QUAR_DIR/${SAFE_PANE}-$$.boot.md"
    cat > "$BOOT_FILE" << BOOT
# Boot: UNRESOLVED identity (quarantined — NOT written to unknown/)
*Auto-generated $TIMESTAMP. pane.self/title/registry all failed to resolve a role.*

## You are: (unresolved)
## Pane: ${PANE_TARGET:-unknown}
## Host: ${CURRENT_HOST:-unknown}

## RECOVER IDENTITY FIRST (do NOT wait for assignment):
1. Confirm your pane: \`otmux pane.self target\`
2. Confirm your title: \`otmux pane.get \$(otmux pane.self) '#{pane_title}'\` — should be role@host
3. If title is wrong/missing, /rename to your role, then: \`hiveMind identity.resolve\`
4. Find your real dir under \`session/agents/\` and read its context.md
5. This quarantine file is disposable — your real boot.md lives in your role@host/ dir.
BOOT
    echo "Boot: IDENTITY UNRESOLVED at ${PANE_TARGET:-?} — quarantined to ${BOOT_FILE#$PROJECT_DIR/} (did NOT write unknown/)" >&2
else
    ROLE_DISPLAY="$CURRENT_ROLE"
    BOOT_AGENT_DIR="$AGENTS_DIR/$ROLE_DIR"
    mkdir -p "$BOOT_AGENT_DIR"
    BOOT_FILE="$BOOT_AGENT_DIR/boot.md"

    # Extract current goal from context file
    CURRENT_GOAL=""
    if [ -n "$CONTEXT_FILE" ] && [ -f "$CONTEXT_FILE" ]; then
        CURRENT_GOAL=$(grep -A1 -i "goal\|## Current\|## Active" "$CONTEXT_FILE" 2>/dev/null | head -3 | tail -2 | sed 's/^[# ]*//')
    fi

    # Keep an agent-written boot.md (don't overwrite). stat: GNU (-c %Y) or BSD (-f %m).
    BOOT_AGENT_WRITTEN=false
    if [ -f "$BOOT_FILE" ]; then
        if grep -q "Written by" "$BOOT_FILE" 2>/dev/null; then
            BOOT_AGENT_WRITTEN=true
        else
            BOOT_MTIME=$(stat -c %Y "$BOOT_FILE" 2>/dev/null || stat -f %m "$BOOT_FILE" 2>/dev/null || echo 0)
            BOOT_AGE=$(( $(date +%s) - BOOT_MTIME ))
            [ "$BOOT_AGE" -lt 120 ] && BOOT_AGENT_WRITTEN=true
        fi
    fi

    if [ "$BOOT_AGENT_WRITTEN" = true ]; then
        echo "Boot: kept agent-written boot.md"
    else
        cat > "$BOOT_FILE" << BOOT
# Boot: $ROLE_DISPLAY
*Auto-generated $TIMESTAMP. This is ALL you need to read post-compact.*

## You are: $ROLE_DISPLAY
## Pane: ${PANE_TARGET:-unknown}
## Host: ${CURRENT_HOST}
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
- Wait for assignment. Only SM/orchestrator have background loops.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
BOOT
    fi
fi

echo "Boot file: $BOOT_FILE ($(wc -l < "$BOOT_FILE") lines)"

# --- Schedule auto-resume with boot file reference ---
if [ -n "$PANE_TARGET" ]; then
    BOOT_REL="${BOOT_FILE#$PROJECT_DIR/}"
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
        # SM auto-cycle: after boot prompt is sent, schedule cycle start
        if [ "$CURRENT_ROLE" = "scrum-master" ]; then
            sleep 45
            # Only send if SM is idle (at prompt), not if already working
            PANE_CONTENT=$(tmux capture-pane -t "$PANE_TARGET" -p 2>/dev/null | tail -3)
            if echo "$PANE_CONTENT" | grep -qF '❯'; then
                tmux send-keys -t "$PANE_TARGET" "scrumMaster cycle projectTeam 60" Enter
            fi
        fi
        rm -f "$RESUME_PID_FILE"
    ) &>/dev/null &
    disown 2>/dev/null

    echo "Auto-resume: will send boot file reference to $PANE_TARGET in 15s"
    [ "$CURRENT_ROLE" = "scrum-master" ] && echo "Auto-cycle: SM will auto-start cycle 60s after boot"
fi

echo "=== END ==="
exit 0
