# Task: Fix hiveMind.send() Enter Key Problem + Safety Review

**From**: product-owner (PO) — Tron directive, HIGH PRIORITY
**To**: agent-trainer (coordinator) + oosh-expert (implementer)
**Priority**: CRITICAL — blocks every compact, boot, and agent message
**Date**: 2026-02-22

---

## THE PROBLEM (INC-001 — 5+ occurrences today alone)

`hiveMind send <name> "text" Enter` sends "Enter" as literal text instead of a keypress.

### Root Cause (PO investigated)

**File**: `/Users/donges/oosh/hiveMind` line 758

```bash
hiveMind.send() {
  ...
  otmux send "$target" -l "$*"    # <-- BUG: -l = literal, Enter becomes text
}
```

The `-l` flag tells tmux to send everything as literal text. No key interpretation.

Meanwhile `otmux.send()` (line 929-944) correctly handles this:
```bash
otmux.send() {
  ...
  if [ "$last" = "Enter" ] && [ $# -gt 1 ]; then
    $TMUX_CMD send-keys -t "$target" "${@:1:text_count}"
    sleep 0.05
    $TMUX_CMD send-keys -t "$target" Enter        # <-- CORRECT: Enter as keypress
  else
    $TMUX_CMD send-keys -t "$target" "$@"
  fi
}
```

### The Fix

`hiveMind.send()` must detect trailing key names (Enter, C-u, Tab, etc.) like `otmux.send()` does, and send them as keypresses instead of literal text.

Two approaches:
1. **Simple**: Detect trailing `Enter` specifically, send text with `-l`, then Enter as keypress
2. **Complete**: Parse all args, use `-l` only for quoted text, pass key names through

The expert should decide which approach, but BOTH must preserve the `-l` behavior for the text portion (spaces matter).

### Also check: hiveMind.send.enter()

Line 783: `otmux send.enter "$target" "$message"` — check if `otmux.send.enter()` exists and works correctly. If it does, `hiveMind.send.enter()` may already be the working solution.

---

## TRON DIRECTIVES (CRITICAL — follow exactly)

### 1. No git rebase — EVER
The previous hiveMind "expert" destroyed files and work with `git rebase`. This MUST be prevented:
- **NEVER use `git rebase` or `git pull --rebase`** — they silently destroy uncommitted work
- `pull.rebase=false` is set in `/Users/donges/oosh` repo config
- All work: `git pull` only (merge)
- **Monitor the expert's git operations.** If expert tries rebase, STOP immediately.

### 2. Agent trainer tests BEFORE deployment
The trainer's job is quality gate:
- Expert implements the fix
- Trainer TESTS the fix across all use cases before it's committed
- Test cases below — run ALL of them

### 3. Trainer spins up and tests trained teams
Tron: "the agent trainer is responsible to spin up and test trained teams before they get serious work"
- After this fix, test that hiveMind send works reliably for ALL agent communication
- This is practice for the trainer's quality gate role

---

## EXECUTION PLAN

### Phase 1: Agent Trainer — Reproduce and Document (10 min)

Before the expert touches code, the trainer verifies the bug:

```bash
# Test 1: hiveMind send with Enter (should fail — Enter as text)
hiveMind send oosh-expert "echo hello" Enter
sleep 2
hiveMind monitor oosh-expert 5
# Expected: "echo hello Enter" at prompt (bug confirmed)

# Test 2: otmux send with Enter (should work — Enter as keypress)
otmux send projectTeam:0.1 C-u
sleep 1
otmux send projectTeam:0.1 "echo hello" Enter
sleep 2
hiveMind monitor oosh-expert 5
# Expected: "hello" output (Enter submitted)

# Test 3: hiveMind send.enter (should work if implemented correctly)
otmux send projectTeam:0.1 C-u
sleep 1
hiveMind send.enter oosh-expert "echo test"
sleep 2
hiveMind monitor oosh-expert 5
# Expected: "test" output (Enter appended by send.enter)
```

Document results in `session/tasks/fix-hivemind-send-enter-test-results.md`

### Phase 2: Expert — Implement Fix (20 min)

Send task to expert:
```
Read session/tasks/fix-hivemind-send-enter.md — you need to fix hiveMind.send() Enter key bug at line 758. Root cause: -l flag makes Enter literal text. See otmux.send() lines 937-941 for the correct pattern.
```

Expert implements:
1. Fix `hiveMind.send()` to detect trailing key names and handle them properly
2. Verify `-l` still applies to the text portion (preserving spaces)
3. Test with `hiveMind send oosh-expert "echo hello" Enter`
4. Commit to dev.claude branch

**MONITOR THE EXPERT'S GIT OPERATIONS. If expert uses `git rebase` — STOP immediately and report.**

### Phase 3: Trainer — Verify Fix (10 min)

After expert commits, run ALL test cases:

```bash
# Test A: Basic send with Enter
hiveMind send oosh-expert "echo test-a" Enter
# Expected: "test-a" printed

# Test B: Send with spaces preserved
hiveMind send oosh-expert "echo 'hello world with spaces'" Enter
# Expected: "hello world with spaces" printed

# Test C: Send without Enter (should still work as literal)
hiveMind send oosh-expert "partial text"
# Expected: "partial text" at prompt, NOT submitted

# Test D: Send.enter still works
hiveMind send.enter oosh-expert "echo test-d"
# Expected: "test-d" printed

# Test E: Special keys (C-u, Tab) still work
hiveMind send oosh-expert C-u
# Expected: prompt cleared

# Test F: Multi-word with Enter (the common case that broke)
hiveMind send oosh-expert "Read session/agents/oosh-expert/boot.md" Enter
# Expected: expert reads the file (Enter submitted properly)
```

### Phase 4: Report

Write results to `session/tasks/fix-hivemind-send-enter-report.md`
Notify PO: `hiveMind send product-owner "Read session/tasks/fix-hivemind-send-enter-report.md" Enter`

(Yes — use the FIXED hiveMind send to send the report. That's the ultimate test.)

---

## SAFETY RULES

- **NO git rebase.** `git pull` only. Monitor expert's git commands.
- **Commit frequently.** Small changes, verify each one.
- **Test BEFORE and AFTER.** Document both.
- **If anything breaks hiveMind communication** — revert immediately with `git checkout -- hiveMind`
- **Clear expert's prompt (C-u) before sending test commands.**
- **The expert should read docs/oosh-architecture.md and the hiveMind source** before making changes.

## LEARNING OPPORTUNITY

After this fix, update:
1. `session/knowledge-base/recurring-incidents.md` — mark INC-001 as RESOLVED with commit hash
2. Your learnings.md — what you learned about testing and quality gating
3. Expert's learnings.md — root cause pattern (literal vs keypress mode)
