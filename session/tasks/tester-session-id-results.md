# Test Results: session.id and tree.detailed Bug Fixes

**Tester**: oosh-tester (baseTeam:0.2)
**Date**: 2026-02-26
**Commit tested**: (expert's latest changes to claudeCode, otmux, hiveMind)

---

## Test 5: Syntax check — PASS

```
bash -n claudeCode  → OK
bash -n otmux       → OK
bash -n hiveMind    → OK
```

## Test 1: session.id accuracy — FAIL

The `head -1` → `tail -1` change picks a DIFFERENT stale UUID, but still the WRONG one.

**Root cause confirmed (CORRECTED)**: NOT caused by `/compact` — compact preserves the session UUID. Caused by **restarting agents** (kill + start new `claude` in the same pane with same role name). The new claude process gets a new UUID but still opens lsof handles to task dirs from **previous incarnations** in that pane (likely for session history/resume picker). The current session's task dir is not in lsof, or is drowned out by 89+ handles to old UUIDs. Neither `head -1` nor `tail -1` can find a UUID that doesn't exist or is outnumbered in the data.

| Pane | /status Session ID (truth) | session.id returns (before fix) | session.id returns (after fix) | Match? |
|------|----------------------------|--------------------------------|-------------------------------|--------|
| 0.3  | `a2c6b6c4-...` | `2120c2ee-...` | `2c2f6e67-...` | FAIL (different wrong UUID) |
| 0.4  | `6213b3dc-...` | `e93582de-...` | `29ebe9ed-...` | FAIL (different wrong UUID) |
| 0.5  | `e7606830-...` | `0f0755a8-...` | `0f0755a8-...` | FAIL (unchanged, lsof empty for this PID) |

**lsof forensics for pane 0.3 (PID 65442)**:
- Unique UUIDs in lsof: `2120c2ee-...` and `2c2f6e67-...`
- Actual current UUID `a2c6b6c4-...` is NOT in lsof
- `tail -1` picks `2c2f6e67` (last FD), `head -1` picked `2120c2ee` (first FD)
- Both are stale task dirs from previous sessions

**lsof forensics for pane 0.4 (PID 66285)**:
- Unique UUIDs: `e93582de-...` and `29ebe9ed-...`
- Actual `6213b3dc-...` is NOT in lsof

**Conclusion**: Method 2 (lsof) is **fundamentally unreliable** after compacts. It should be DEMOTED to last-resort fallback, not Method 2. A new primary method is needed.

**Recommended fix**: Add a **Method 1.5** that searches the JSONL project files:
1. List all `~/.claude/projects/<project>/*.jsonl` files
2. For each, check if its UUID appears in `lsof -p $PID` (quick cross-reference)
3. If multiple match, pick the most recently modified file
4. OR: find the JSONL whose last `api_activity` timestamp is most recent

Alternative: Use `claude --resume <UUID> --print "echo session-id"` but that's too invasive.

**Edge case — idle pane**: PASS
- `claudeCode session.id projectTeam:0.1` (idle zsh) → empty, exit code 1

## Test 2: tree.detailed names — PARTIAL PASS

The fix correctly prioritizes `session.name` over registry. But `session.name` returns the firstPrompt text for sessions without `/rename`, causing ugly truncated text in the tree.

| Pane | Before fix | After fix | Correct? |
|------|-----------|-----------|----------|
| 0.3 | scrum-master (wrong) | "You are oosh-expert on projectTeam:0.1." (boot prompt) | PARTIAL — correct identity but ugly display |
| 0.4 | (unnamed) | "You are oosh-tester on projectTeam:0.2." | PARTIAL — same issue |
| 0.5 | agent-trainer (wrong) | scrum-master@sonnet | PASS (has /rename) |
| 1.2 | task-agent | task-agent@sonnet | PASS |
| 1.3 | developer (wrong) | task-agent@sonnet | PASS (correctly reveals duplicate) |
| 1.4 | script-product-owner | developer@sonnet | PASS (reveals pane title was wrong too) |
| 1.5 | (unnamed) | ossh-po | PASS |

**Issue**: For sessions without `/rename`, `session.name` returns the firstPrompt (boot message) which is too long and gets truncated in the tree display. The fix should strip the `@model` suffix for display AND detect when the name is a firstPrompt (no `@` separator) and either:
- Show just the first N characters + "..."
- Fall back to pane title
- Skip firstPrompt names and use registry

**UUIDs in tree**: Still wrong for 0.3, 0.4, 0.5 because they come from `session.id` (Bug 1 not fixed).

## Test 3: registry.refresh — PARTIAL PASS

The method runs and updates entries. BUT the current registry shows contamination:

**Good entries** (correct after refresh):
- `projectTeam:0.5|scrum-master` ← correct (from scrum-master@sonnet)
- `projectTeam:1.2|task-agent` ← correct
- `projectTeam:1.4|developer` ← correct
- `projectTeam:1.5|ossh-po` ← correct

**Bad entries** (firstPrompt leaked despite `@` filter):
- `hiveMindTeam:0.0|Read .claude/agents/hiveMind-expert/SKIL` ← truncated firstPrompt, no `@`
- `projectTeam:0.3|You are oosh-expert on projectTeam:0.1.` ← boot prompt
- Multiple `oosh-expert` entries for unrelated panes (backupTeam, baseTeam, etc.)

The `@` filter on line 1454 should have caught these. Possible cause:
- These entries are from a run BEFORE the `@` filter was added
- OR `session.name` returned a value with `@` in the firstPrompt text (unlikely)
- OR the registry already had these from previous code and refresh didn't clean them

**Need to verify**: Run `hiveMind registry.refresh projectTeam` fresh and check if bad entries are re-created or just leftover.

## Test 4: Duplicate session UUID — CONFIRMED REAL

Panes 1.2 and 1.3 are genuinely running the same session (`5fff44f4-...`):
- Both `ps` show just `claude` (no --resume flag visible)
- Both `/status` show "task-agent@sonnet" with same UUID
- Both lsof show only `5fff44f4-...`
- This is NOT a detection bug — it's an actual session sharing issue

**Risk**: Two TUI instances writing to the same conversation can cause data corruption or race conditions.

## Summary

| Test | Result |
|------|--------|
| Test 1: session.id accuracy | **FAIL** — lsof method fundamentally broken after compacts |
| Test 2: tree.detailed names | **PARTIAL PASS** — correct source but firstPrompt display issue |
| Test 3: registry.refresh | **PARTIAL PASS** — works for /rename'd sessions, stale entries remain |
| Test 4: duplicate UUID | **CONFIRMED** — real duplicate, not detection artifact |
| Test 5: syntax check | **PASS** |

## Recommendation

Bug 1 is the blocker. The lsof approach cannot work because when an agent is **restarted** (not compacted — compact keeps the UUID), the new claude process opens task dirs from ALL previous sessions in that pane (for history/resume). The current session's task dir either isn't in lsof or is outnumbered by old entries (e.g., 89 handles to old UUID, 0 to current).

A fundamentally different detection method is needed. The JSONL file approach or parsing TUI /status are the most reliable alternatives.

**Automated test added**: `test/test.claudeCode` now includes live behavioral tests (T11-T15) that send `/status` to real agents, parse the Session ID, and compare against `session.id`. Run `test.suite run claudeCode` to reproduce. Currently: 14 PASS, 1 FAIL.
