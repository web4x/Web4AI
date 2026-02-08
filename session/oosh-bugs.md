# OOSH Bug Tracker
*Extracted from WODA (39 chapters) + CMM4 (16 chapters). Delegated to cursorOrchestrator team.*

**Score: 13/15 fixed | 1 blocked | 1 unfixable**

## Task Checklist

### WODA Bugs (4/4 done)
- [x] `test.suite all` infinite loop — Task 51 (df449e5)
- [x] `oo new.method` macOS case-sensitivity — Task 53 (4b1db92)
- [x] `c2: command not found` — Task 54 (d990efd)
- [x] Ghost state machine refs (`PDCA_TEST_*`) — Task 55 (6ca9c16)

### CMM4 Bugs (8/10 done)
- [x] `sweep.detect` blind to Yes/No prompts — Task 41
- [ ] OAuth API blocked — **Blocked** (external: Anthropic)
- [x] `claudeCode context.read` false positive at 12% — Task 52 (33b7b08)
- [ ] Permission grants reset on `/compact` — **Unfixable** (Claude Code behavior)
- [x] Background overlay not detected — Task 46
- [x] Bootstrap paradox (who unblocks the unblocker?) — Task 48 (watchdog)
- [x] Compound commands trigger permission prompts — Task 57 (a8422a4)
- [x] `./` prefix pattern mismatch — Task 47 (workaround)
- [x] Watchdog died silently (no supervisor) — Task 49 (6dd4f57)
- [x] TUI pending-edits stuck state — Task 56 (7453ba1)

### Scribe Bugs (1/1 done)
- [x] `otmux send` no delivery guarantee — send.verified (805aecc)

## Open Items Detail

### OAuth API blocked
- **Source**: CMM4 Ch2
- **Symptom**: `GET https://api.anthropic.com/api/oauth/usage` returns `authentication_error: OAuth authentication is currently not supported`
- **Status**: Blocked on Anthropic enabling OAuth. No workaround.

### Permission reset on /compact
- **Source**: CMM4 Ch4
- **Symptom**: "Yes, allow from project" grants don't survive `/compact`. Agent re-prompted every session.
- **Status**: Claude Code behavior. Not an OOSH bug. Can't fix in our codebase.

## otmux send Failure Modes (reference)
*All addressed by `otmux send.verified` (805aecc)*
1. Single Enter = newline in TUI, not submit (need double Enter)
2. Message lands behind permission dialog (queued, never seen)
3. Tab doesn't reliably accept pending edits
4. Escape doesn't always close diff/overlay views
5. C-u doesn't clear line in all TUI states
6. Rapid sends cause character spam ("2222" from loop)
7. No feedback when send fails (caller assumes success)

## Agent Behavior Issues (not OOSH bugs)
- [ ] Task 40.3 spec used flags (`--team`) — anti-OOSH pattern
- [ ] Task 40.4 depends on broken OAuth API — spec didn't verify deps
- [ ] Scribe uses raw `tmux send-keys` instead of `otmux send`
- [ ] Writer takes 7 chapters to file bugs (Ch3-Ch9)

---
*Updated: 2026-02-08 17:55*
