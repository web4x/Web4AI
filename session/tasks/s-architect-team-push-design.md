# Architect Task: design team.push choreography

**From**: oosh-po@WODA.prod
**Priority**: HIGH — BLOCKING expert implementation
**Sprint**: sprint-team-migration

## Your deliverable

Design the `hiveMind team.push <host>` controller choreography to this exact spine (from 2 live manual migrations, 13 lessons):

```
session.name = truth → dedup+canonical (recency/training) → place in target hash →
fork full-uuid (cd target) → per-pane verify → rename role@host (verified) →
/rc (verified) → reconcile non-interactively → consistency.audit == 0
```

## Design must specify

1. **Pre-flight**: what to check on target before starting (workspace dir, tmux session, ssh, oosh version)
2. **Identity resolution** (S-2b): how `resolveCanonical` works — session.name lookup, dedup by mtime+JSONL line-count, dead-agent handling
3. **Per-agent loop** (NOT batch): the exact sequence for each agent, with verify-or-fail gates between steps
4. **Resume menu handling**: detect menu vs auto-resume, select option 2 deterministically
5. **Flagless reconcile**: object.verb method name for non-interactive MVC fix (replaces `--apply` flag)
6. **Collision/idempotency**: what happens when target pane already has a running Claude (re-run safe)
7. **Workspace symlink replication** (S-2/L12): discover, clone, link
8. **Error handling**: what stops the push, what's recoverable, what needs human intervention

## Read first
- `scrum.pmo/sprints/sprint-team-migration/planning.md` — the full sprint with all stories
- `session/tasks/migration-learnings-for-teampush.md` — the 13 lessons (L1-L13)
- `session/tasks/hivemind-team-push-controller.md` — the 12 manual steps + gaps

## Report-back
Write your design into this file (below this line), commit, ping oosh-po.

---
## Design (oosh-architect@WODA.prod — 2026-06-22)

### Overview

`hiveMind team.push <host>` is a Controller method that migrates an entire agent team to a target dev box. It follows the spine:

```
session.name = truth → dedup+canonical → place in target hash →
fork full-uuid (cd target) → per-pane verify → rename role@host →
/rc (verified) → reconcile non-interactively → consistency.audit == 0
```

Every step is per-agent (NOT batch), verify-or-fail.

---

### 1. Pre-flight (`private.hiveMind.push.preflight <host> <teamSession>`)

Before any agent transfer, validate the target:

```
1. SSH connectivity:   ossh exec <host> "echo ok"          → fail if unreachable
2. OOSH installed:     ossh exec <host> "which this"       → fail if no oosh
3. Workspace dir:      ossh exec <host> "[ -d <targetWS> ]" → fail if missing
4. tmux session:       ossh exec <host> "otmux session.exists <teamName>"
                       → create DETACHED if missing (see L8 below)
5. Pane count:         verify target panes >= source agent count
                       → split to match if needed
6. oosh version:       ossh exec <host> "oo v"             → warn if mismatch
```

**Session creation (L8 fix)**: if the tmux session doesn't exist, create it **detached**. NEVER use `otmux new <name>` from a non-tmux caller — it attaches and traps the driver. Use raw tmux:
```bash
ossh exec <host> "tmux new-session -d -s <teamName> -x 200 -y 50"
```
Then split panes to match source layout via `otmux split` commands.

**Workspace repo sync (S-2)**: run BEFORE any JSONL transfer:
```bash
# Source side
(cd <sourceWS> && git push origin main)
# Target side
ossh exec <host> "cd <targetWS> && git pull --ff-only origin main"
```
Fail on merge conflict — needs human.

---

### 2. Identity resolution (`private.hiveMind.push.resolveCanonical <role> <teamSession>`)

Called per-role to find the ONE canonical UUID to migrate.

**Returns**: full UUID (8-4-4-4-12)

**Algorithm**:
```
1. List ALL JSONLs in source project hash:
   ls ~/.claude/projects/<sourceHash>/*.jsonl → extract UUIDs

2. For each UUID, query identity:
   claudeCode session.name <uuid> → customTitle (e.g. "oosh-expert@MacStudio")

3. Filter: keep sessions whose session.name starts with <role>
   (strip @host: ${name%%@*})

4. Count matches:
   0 → ERROR "role not found in any session"
   1 → canonical (done)
   >1 → DEDUP:
     a. Sort by JSONL mtime (newest first)
     b. Tiebreak by JSONL line-count (wc -l, most trained = most lines)
     c. Pick first as canonical
     d. Log: "DEDUP: <role> has N sessions, canonical=<uuid>
              (mtime=<date>, lines=<n>), skipped: ..."

5. Dead check (L3): canonical may be DEAD in claudeCode list.
   DO NOT SKIP. JSONL is resumable. Log note, proceed.

6. UUID normalization (L5): if input is short (<36 chars, no dashes),
   scan JSONL filenames for prefix match → expand to full.
```

---

### 3. Per-agent loop (`private.hiveMind.push.agent <host> <role> <sourceUUID> <targetPane>`)

**Called once per agent. Sequential. Verify-or-fail at every gate.**

#### Step 3.1: Compute target hash
```bash
TARGET_HASH=$(private.claudeCode.projectHash "$TARGET_WORKSPACE")
# /var/dev/Workspaces/AI/Claude → -var-dev-Workspaces-AI-Claude
```
Implementation: `echo "$path" | sed 's|^/||; s|/|-|g'`

#### Step 3.2: Place JSONL
```bash
TARGET_HASH_DIR="$TARGET_HOME/.claude/projects/$TARGET_HASH"
ossh exec <host> "mkdir -p $TARGET_HASH_DIR"
ossh scp "$SOURCE_JSONL" "<host>:$TARGET_HASH_DIR/"
```
**VERIFY**: `ossh exec <host> "[ -f $TARGET_HASH_DIR/$UUID.jsonl ]"` → must succeed.

#### Step 3.3: Fork
```bash
ossh exec <host> "otmux send <targetPane> 'cd $TARGET_WORKSPACE && claudeCode fork $FULL_UUID' Enter"
```
Then handle resume menu (see §4). Timeout 120s.

**VERIFY**: `claudeCode process.running <targetPane>` → true, AND pane shows idle prompt.

#### Step 3.4: Capture forked UUID
Fork creates a NEW UUID. Correlate via customTitle on the target:
```bash
FORKED_UUID=$(ossh exec <host> "
  for f in $TARGET_HASH_DIR/*.jsonl; do
    UUID=\$(basename \$f .jsonl)
    NAME=\$(claudeCode session.name \$UUID 2>/dev/null)
    case \"\$NAME\" in $ROLE@*) echo \$UUID; break;; esac
  done
")
```
Fallback if not yet renamed: most recent JSONL by mtime in target hash dir.

**Write to sessions.env immediately** (GAP #12):
```bash
ossh exec <host> "hiveMind sessions.set <targetPane> $FORKED_UUID"
```

#### Step 3.5: Rename
```bash
ossh exec <host> "otmux send <targetPane> '/rename $ROLE@$TARGET_HOST' Enter Enter"
```
**VERIFY (L7)**: capture pane → assert contains `"Session renamed to: $ROLE@$TARGET_HOST"`.
If not found after 5s → RETRY once → still missing → ERROR.

#### Step 3.6: /remote-control
```bash
ossh exec <host> "otmux send <targetPane> '/remote-control' Enter Enter"
```
**VERIFY**: capture pane → assert contains `https://claude.ai/code/session_`. Extract + log URL.

#### Step 3.7: Registry + title + lock
```bash
ossh exec <host> "hiveMind registry.set <targetPane> $ROLE"
ossh exec <host> "otmux pane.title <targetPane> '$ROLE@$TARGET_HOST'"
ossh exec <host> "otmux pane.lock <targetPane> '$ROLE@$TARGET_HOST'"
```

#### Step 3.8: Per-agent MVC verify (L10, L11)
All 4 identity stores must agree:
```bash
PANE_TITLE = otmux pane.title.get <targetPane>
SESSION_NAME = claudeCode session.name $FORKED_UUID
REGISTRY_ROLE = hiveMind registry.get <targetPane>
SESSIONS_UUID = hiveMind sessions.get <targetPane>

assert PANE_TITLE = "$ROLE@$TARGET_HOST"
assert SESSION_NAME = "$ROLE@$TARGET_HOST"
assert REGISTRY_ROLE = "$ROLE"
assert SESSIONS_UUID = "$FORKED_UUID"
```
Fail on ANY mismatch → stop, report which store is wrong.

**Only after ALL 8 sub-steps pass → proceed to next agent.**

---

### 4. Resume menu handling

Fork produces 3 possible outcomes:

| Outcome | Detection (capture after 10s) | Action |
|---------|-------------------------------|--------|
| **Auto-resume** | `❯` prompt visible | Proceed (no action) |
| **Resume menu** | "Continue" / numbered options | Send `2` Enter (full resume) |
| **Compacting** | "Compacting conversation" | Wait up to 60s, poll 10s intervals |

**NEVER send keystrokes while compacting** — can trigger unintended commands.

After menu selection or auto-resume, wait for idle prompt (❯). Timeout 120s total.

---

### 5. Flagless reconcile: `hiveMind consistency.reconcile.apply`

**Problem (L9)**: `consistency.fix` prompts y/N (aborts on no input). `consistency.reconcile --apply` uses a flag (OOSH violation).

**Solution**: new method `hiveMind consistency.reconcile.apply <?teamSession>`:
- Same logic as `consistency.reconcile` with `--apply`
- No y/N prompt — applies all fixes silently
- Returns: count of fixes applied via RESULT
- Exit 0 on success, 1 on failure
- Logs each fix applied

The existing interactive `consistency.fix` is preserved for human use.

---

### 6. Collision/idempotency

When `team.push` targets a host that already has agents:

```
For each target pane:
  1. Is Claude running? (claudeCode process.running <pane>)
  2. YES:
     a. current = claudeCode session.name (from sessions.get UUID)
     b. If current == expected role@host → SKIP (verify-only mode)
        Run steps 3.5–3.8 verify gates, log "ALREADY CORRECT: <role>"
     c. If current != expected → CONFLICT
        Log: "CONFLICT: pane <pane> has <current>, expected <role>"
        STOP. Human decides.
  3. NO Claude running → proceed with full fork
```

**Re-run guarantee**: `team.push` twice = same result. Correct agents verified, not re-forked. No duplicates, no corruption.

---

### 7. Workspace symlink replication (L12)

```bash
# Discover on source
SOURCE_LINKS=$(find "$SOURCE_WS/workspaces" -maxdepth 1 -type l 2>/dev/null)

for link in $SOURCE_LINKS; do
  LINK_NAME=$(basename "$link")
  LINK_TARGET=$(readlink -f "$link")

  # Clone repo on target if missing
  if ! ossh exec <host> "[ -d $LINK_TARGET ]"; then
    REPO_URL=$(cd "$LINK_TARGET" && git config --get remote.origin.url)
    ossh exec <host> "git clone $REPO_URL $LINK_TARGET"
  fi

  # Recreate symlink
  ossh exec <host> "mkdir -p $TARGET_WS/workspaces && ln -sf $LINK_TARGET $TARGET_WS/workspaces/$LINK_NAME"
done
```

---

### 8. Error handling

| Condition | Action | Recoverable? |
|-----------|--------|-------------|
| SSH unreachable | STOP pre-flight | Yes — fix ssh, re-run |
| Workspace missing | STOP pre-flight | Yes — create dir, re-run |
| git pull conflict | STOP, report files | No — human resolves |
| Role not found | STOP, list available | Yes — check session.name |
| JSONL scp fails | STOP, report perms | Yes — fix perms, re-run |
| Fork timeout (120s) | STOP at this agent | Yes — re-run (idempotent) |
| Rename not verified | RETRY once → STOP | Maybe — pane width? |
| /rc not verified | RETRY once → STOP | Maybe — network? |
| MVC mismatch | STOP, report store | Yes — manual fix, re-run |
| Collision (wrong agent) | STOP, report conflict | No — human decides |
| audit != 0 after reconcile | EXIT 1, report violations | Yes — manual fix, re-run |

**Principle**: STOP on first failing agent. Report what succeeded, what failed, which step. Controller is re-runnable — skips correct agents.

---

### Method signature

```bash
hiveMind.team.push() # <host> <?teamSession:active> # push entire team to target host
{
  local host="$1"
  local teamSession="${2:-$(hiveMind.active.team.get)}"

  # 1. Pre-flight
  private.hiveMind.push.preflight "$host" "$teamSession" || return 1

  # 2. Workspace sync + symlinks
  private.hiveMind.push.workspace.sync "$host" "$teamSession" || return 1

  # 3. Snapshot source team
  hiveMind teams.save "$teamSession"

  # 4. Per-agent loop (sequential, verify-or-fail)
  local agents=$(hiveMind snapshot.agents "$teamSession")
  local failed=0
  for agent in $agents; do
    local role=$(echo "$agent" | cut -d'|' -f2)
    local sourcePane=$(echo "$agent" | cut -d'|' -f1)
    local sourceUUID=$(private.hiveMind.push.resolveCanonical "$role" "$teamSession")
    local targetPane=$(private.hiveMind.push.targetPane "$sourcePane" "$teamSession")

    if ! private.hiveMind.push.agent "$host" "$role" "$sourceUUID" "$targetPane"; then
      error.log "FAILED at agent $role — stopping push"
      failed=1
      break
    fi
    console.log "PASS: $role → $host (verified + /rc active)"
  done

  # 5. Final parity gate
  if [ "$failed" -eq 0 ]; then
    local violations=$(ossh exec "$host" "hiveMind consistency.audit $teamSession")
    if [ $? -ne 0 ]; then
      warn.log "audit found violations — running reconcile.apply"
      ossh exec "$host" "hiveMind consistency.reconcile.apply $teamSession"
      ossh exec "$host" "hiveMind consistency.audit $teamSession" || { failed=1; }
    fi
  fi

  [ "$failed" -eq 0 ] && console.log "team.push COMPLETE: $teamSession → $host"
  return $failed
}
```

---

## Architect Review: S-1 projectHash (8ca434e) — 2026-06-25

### Verdict: BUG — hash function is incomplete

**Expert's implementation** (claudeCode line 77):
```bash
private.claudeCode.projectHash() {
  echo "$1" | sed 's/\//-/g'
}
```

**What Claude Code actually does** (verified empirically on WODA.prod):

| Real path | Expert's hash | Claude Code's real hash | Match? |
|-----------|--------------|------------------------|--------|
| `/var/dev/Workspaces/AI/Claude` | `-var-dev-Workspaces-AI-Claude` | `-var-dev-Workspaces-AI-Claude` | YES |
| `/home/shared/EAMD.ucp/Components/.../1_infrastructure/Once.sh/dev` | `-home-shared-EAMD.ucp-...-1_infrastructure-Once.sh-dev` | `-home-shared-EAMD-ucp-...-1-infrastructure-Once-sh-dev` | **NO** |

Claude Code replaces **three** characters with `-`: `/`, `.`, and `_`. The expert's sed only replaces `/`.

**Evidence**: `ls /root/.claude/projects/` on WODA.prod shows:
```
-home-shared-EAMD-ucp-Components-com-ceruleanCircle-EAM-1-infrastructure-Once-sh-dev
-var-dev-Workspaces-AI-Claude
```
The dots in `EAMD.ucp` and `Once.sh`, and the underscore in `1_infrastructure`, are all `-` in the hash.

**Fix** (expert must apply):
```bash
private.claudeCode.projectHash() {
  echo "$1" | sed 's/[\/._]/-/g'
}
```

**Decode is lossy by nature**: the reverse function can't distinguish which `-` was originally `/`, `.`, or `_`. This is acceptable — decode is only for display, and paths can be verified against real filesystem. But document the lossiness.

**Impact on team.push**: the current hash works for `/var/dev/Workspaces/AI/Claude` (no dots/underscores) which is our primary target. But any push to a workspace with dots or underscores in the path will silently place JSONLs in a wrong hash dir. **Must fix before S-9 dogfood.**

---

## S-6 Detail Spec: UUID-capture-on-fork (GAP #12)

### Problem

`claudeCode fork <sourceUUID>` creates a NEW session with a NEW UUID. The controller needs this forked UUID to:
1. Write it to `sessions.env` (MVC Model ↔ Controller binding)
2. Verify identity via `session.name <forkedUUID>`
3. Track for final consistency.audit

Currently the push.agent loop proceeds fire-and-forget after fork — it never captures the forked UUID.

### Design: `private.hiveMind.push.captureForkedUUID`

**Called**: after Step 3.3 (fork verified running) and before Step 3.5 (rename).

**Input**: `<host> <targetPane> <targetHashDir> <role> <targetHost>`
**Output**: sets `FORKED_UUID` variable

**Algorithm** (3 strategies, fallback chain):

```
Strategy A — customTitle match (fastest, works if fork auto-renames):
  On target: scan JSONLs in target hash dir for matching customTitle.
  
  FORKED_UUID=$(ossh exec <host> "
    for f in $TARGET_HASH_DIR/*.jsonl; do
      [ -f \"\$f\" ] || continue
      _uuid=\$(basename \"\$f\" .jsonl)
      _name=\$(claudeCode session.name \"\$_uuid\" 2>/dev/null)
      case \"\$_name\" in
        ${ROLE}@*|${ROLE}) echo \"\$_uuid\"; break ;;
      esac
    done
  ")

Strategy B — mtime correlation (if fork hasn't renamed yet):
  The forked JSONL is the NEWEST file in the target hash dir that
  didn't exist before the fork.
  
  # Before fork (in push.agent Step 3.3):
  PRE_FORK_FILES=$(ossh exec <host> "ls $TARGET_HASH_DIR/*.jsonl 2>/dev/null")
  
  # After fork:
  POST_FORK_FILES=$(ossh exec <host> "ls $TARGET_HASH_DIR/*.jsonl 2>/dev/null")
  FORKED_UUID=$(diff <(echo "$PRE_FORK_FILES") <(echo "$POST_FORK_FILES") \
    | grep '^>' | sed 's|.*/||; s|\.jsonl||' | head -1)

Strategy C — PID correlation (most reliable, slowest):
  Get the Claude process PID running in the target pane, then find
  which JSONL it has open.
  
  PID=$(ossh exec <host> "claudeCode process.find $TARGET_PANE")
  FORKED_UUID=$(ossh exec <host> "
    ls -l /proc/$PID/fd 2>/dev/null | grep '\.jsonl' | sed 's|.*/||; s|\.jsonl||'
  ")
```

**Recommended approach**: Strategy B (mtime/diff) as primary, Strategy A as verification.

```bash
private.hiveMind.push.captureForkedUUID() {
  local host="$1" targetPane="$2" targetHashDir="$3" role="$4" preForkFiles="$5"
  
  # Strategy B: diff pre/post fork file lists
  local postForkFiles
  postForkFiles=$(ossh exec "$host" "ls $targetHashDir/*.jsonl 2>/dev/null | sort")
  FORKED_UUID=$(diff <(echo "$preForkFiles") <(echo "$postForkFiles") \
    | grep '^>' | sed 's|.*/||; s|\.jsonl||' | head -1)
  
  if [ -z "$FORKED_UUID" ]; then
    error.log "UUID capture failed: no new JSONL after fork"
    return 1
  fi
  
  # Verify via Strategy A: session.name must match role
  local forkedName
  forkedName=$(ossh exec "$host" "claudeCode session.name $FORKED_UUID 2>/dev/null")
  local bareRole="${forkedName%%@*}"
  
  if [ "$bareRole" != "$role" ]; then
    warn.log "UUID $FORKED_UUID session.name='$forkedName' doesn't match role '$role' yet (fork may still be loading — will verify after rename)"
  fi
  
  # Write to sessions.env IMMEDIATELY (GAP #12 fix)
  ossh exec "$host" "hiveMind sessions.set $targetPane $FORKED_UUID"
  console.log "UUID captured: $FORKED_UUID → sessions.env[$targetPane]"
  
  return 0
}
```

### Integration into push.agent

Modify Step 3.3 in `private.hiveMind.push.agent`:

```bash
# BEFORE fork: snapshot existing JSONLs (for diff-based UUID capture)
local preForkFiles
preForkFiles=$(ossh exec "$host" "ls $TARGET_HASH_DIR/*.jsonl 2>/dev/null | sort")

# Step 3.3: Fork
ossh exec "$host" "otmux send $targetPane 'cd $TARGET_WORKSPACE && claudeCode fork $FULL_UUID' Enter"
# ... wait for fork, handle resume menu ...

# Step 3.4: Capture forked UUID (NEW — was fire-and-forget)
if ! private.hiveMind.push.captureForkedUUID "$host" "$targetPane" "$TARGET_HASH_DIR" "$role" "$preForkFiles"; then
  error.log "Failed to capture forked UUID for $role"
  return 1
fi

# Steps 3.5-3.8 now use $FORKED_UUID (set by captureForkedUUID)
```

### Verify gate

After UUID capture, the per-agent MVC verify (Step 3.8) uses `$FORKED_UUID` instead of the source UUID. This closes the identity chain: source UUID → fork → forked UUID → sessions.env → registry → pane title → session.name. All must agree.

---

### Handoff

Design covers all 8 points + S-1 review (projectHash bug found) + S-6 UUID-capture spec. Expert must:
1. Fix `projectHash` sed: `s/\//-/g` → `s/[\/._]/-/g`
2. Implement `private.hiveMind.push.captureForkedUUID` per spec above
3. Wire pre-fork snapshot + post-fork capture into `push.agent`

Tester validates with sprint tests: T-IDENTITY-TRUTH, T-DEDUP, T-DEAD-CANONICAL, T-RENAME-VERIFY, T-RC-VERIFY, T-RECONCILE-NONINTERACTIVE, T-PUSH-WORKSPACE-LINKS, T-PUSH-PARITY.

