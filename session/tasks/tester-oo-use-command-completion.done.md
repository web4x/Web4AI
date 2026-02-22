# Done: Test hiveMind agent.context.status (Task #47)

**Agent**: oosh-tester
**Task**: build-hivemind-agent-context-status.md
**Result**: PARTIAL — command works structurally but idle detection has a critical bug
**Commit**: 088719a (oosh repo)
**Date**: 2026-02-22

---

## Test Results

### T1: Basic invocation — PASS
```
hiveMind agent.context.status projectTeam
```
- Header, table columns, footer all render correctly
- All 11 registered agents listed with correct names and pane addresses
- Output format matches spec (AGENT, PANE, CTX%, TOKENS, STATUS columns)
- Non-critical ERROR on startup: `HIVEMIND_AGENTS_DIR=$(private.hiveMind.find.agents.dir)` EPERM — does not block execution

### T2: Busy agent detection — PASS (partial)
- product-owner (0.4) correctly detected as `BUSY:active` (spinning verbs detected)
- Other agents marked `BUSY:unknown` — see T3 below for why

### T3: Idle detection — FAIL (CRITICAL BUG)
**Bug**: Idle detection NEVER matches any Claude Code agent.

The code does:
```bash
last_line=$(echo "$content" | sed '/^[[:space:]]*$/d' | tail -1)
if echo "$last_line" | grep -qE '^[[:space:]]*❯[[:space:]]*$'; then
  state="idle"
```

**Problem**: Claude TUI always renders a status bar BELOW the `❯` prompt:
```
❯
───────────────────────────────────
  ⏵⏵ accept edits on (shift+tab to cycle) · esc to interrupt
```

The last non-empty line is always `cycle)` or similar status bar text, NEVER `❯`.

**Actual last_line values observed**:
- Idle agent (trainer 0.5): `cycle)`
- Idle agent (script-po 1.4): `cycle) · 21 files +254 -220`
- Busy agent with prompt text (expert 0.1): `cycle)`
- Active agent (product-owner 0.4): correctly caught by spinning verb pattern

**Fix needed**: Instead of checking the last non-empty line, scan the last ~5 lines for a line that starts with `❯` (with optional trailing whitespace or text). The status bar should be recognized and skipped.

Suggested fix:
```bash
# Check last 5 non-empty lines for ❯ prompt (status bar renders below it)
if echo "$content" | tail -10 | grep -qE '^[[:space:]]*❯[[:space:]]*$'; then
  state="idle"
elif echo "$content" | tail -5 | grep -qE '❯[[:space:]]*$' && \
     ! echo "$content" | tail -3 | grep -qiE 'Composing|Musing|Thinking|Running|Reading'; then
  state="idle"
fi
```

### T4: Self-detection (42 principle) — N/A (correct)
Command was run from ooshDebug:0.1, not from a projectTeam pane. Self-pane is `ooshDebug:0.1`, which doesn't match any projectTeam agent. Correct behavior — no false SELF detection.

**Cannot test true self-detection from ooshDebug** — would need to run from inside a projectTeam Claude agent pane where the agent IS registered.

### T5: Empty/no-pane detection — PASS
Stale registry entry `orchestrator 0.0:0.` correctly reported as `NO-PANE`.

### T6: Garbled output — NOT TESTED
Would require manufacturing garbled pane content. Deferred.

### T7: Completion — FAIL
```
hiveMind agent.context.status <TAB>
```
Tab completion did NOT show session names. Instead, the `oo use` interactive prompt appeared (possibly a c2 conflict). The completion stub `hiveMind.agent.context.status.completion.session()` exists in code but doesn't fire.

**Likely cause**: The c2 completion system maps `hiveMind agent context status` as a hierarchical path, but the completion for parameter 1 (`session`) may not be registered at the right depth. The function name uses `.completion.session` but c2 may expect `.completion` for the first positional parameter.

---

## Summary

| Edge Case | Result | Notes |
|-----------|--------|-------|
| 1. Idle pane → /context → parse | **FAIL** | Idle never detected (status bar bug) |
| 2. Busy pane → skip | **PASS** | Active agents correctly skipped |
| 3. Self pane → 42 principle | **N/A** | Cannot test from ooshDebug |
| 4. Empty pane → clean report | **PASS** | NO-PANE reported correctly |
| 5. Garbled output → graceful | **N/T** | Not tested |
| 6. Multiple sessions → parameter | **PASS** | Session parameter works |
| 7. Completion stub | **FAIL** | Tab completion doesn't fire |

## Critical Fix Needed

**The idle detection bug (T3) is a blocker.** Without it, the tool can never send /context to any agent, making it unable to report actual context percentages. Every agent shows BUSY:unknown.

## Next
- Expert fixes idle detection (scan last 5-10 lines for `❯`, not just last line)
- Expert fixes completion registration
- Re-test after fix commit
