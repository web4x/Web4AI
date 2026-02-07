# OOSH Bugs to Fix
*Extracted from WODA (39 chapters) + CMM4 (15 chapters). Report to cursorOrchestrator team.*

## From WODA Story
- `test.suite all` infinite loop — prints `this.call to:` endlessly. Individual suites work. (Ch19) — **Fixed: Task 51 (df449e5)**
- `oo new.method` shaky on macOS — case-sensitivity issue, awk/sed errors during scaffolding. (Ch20) — **Fixed: Task 53 (4b1db92, 2d06459, e9a8b7e)**
- `c2: command not found` — internal completion system not available as standalone command. — **Fixed: Task 54 (d990efd)**
- Ghost state machine refs — old `PDCA_TEST_*` references linger in `current.state.machine.env`. — **Fixed: Task 55 (6ca9c16)**

## From CMM4 Story
- `sweep.detect` blind to "Do you want to proceed?" + "Yes/No" pattern (Ch1) — **Fixed: Task 41**
- OAuth API blocked — returns `authentication_error: OAuth authentication is currently not supported` (Ch2)
- `claudeCode context.read` unreliable — reports "above-threshold" at 12% (Ch4) — **Fixed: Task 52 (33b7b08)**
- Permission grants reset on `/compact` — can't persist "Yes, allow from project" (Ch4)
- Background tasks overlay not detected — `team.status` shows "(permission)" wrong. Needs Escape. (Ch7) — **Fixed: Task 46**
- Bootstrap paradox — who unblocks the unblocker? Sweep loop in agent gets stuck. (Ch7) — **Fixed: Task 48 watchdog**
- Compound commands trigger permission prompts — `sleep && hiveMind && stat` doesn't match patterns. (Ch7-8)
- Scrum-master uses `./` prefix — `./hiveMind` instead of `hiveMind`, breaks pattern matching. (Ch8) — **Fixed: Task 47 (workaround)**
- Watchdog died silently — stale PID, no supervisor, no restart mechanism. (Ch12) — **Fixed: Task 49 (6dd4f57)**
- TUI pending-edits stuck state — edits accumulate faster than processed, TUI locks. (Ch12) — **Fixed: Task 56 (7453ba1)**

## Not OOSH Bugs (Agent Behavior)
- Task 40.3 spec used flags (`--team`) — anti-OOSH pattern in spec review gap
- Task 40.4 depends on broken OAuth API — spec didn't verify dependencies
- Scribe uses raw `tmux send-keys` instead of `otmux send` — agent training gap
- Writer writes about problems instead of filing tasks — 7 chapters to file (Ch3-Ch9)

## Status Summary
| Bug | Source | Status |
|-----|--------|--------|
| test.suite all loop | WODA | Fixed (Task 51) |
| oo new.method macOS | WODA | Fixed (Task 53) |
| c2 command not found | WODA | Fixed (Task 54) |
| Ghost state refs | WODA | Fixed (Task 55) |
| sweep.detect Yes/No | CMM4 | Fixed (Task 41) |
| OAuth API blocked | CMM4 | Blocked (external) |
| context.read false positive | CMM4 | Fixed (Task 52) |
| Permission reset on compact | CMM4 | Open (Claude Code behavior) |
| Background overlay detect | CMM4 | Fixed (Task 46) |
| Bootstrap paradox | CMM4 | Fixed (Task 48) |
| Compound command perms | CMM4 | Open (architectural) |
| ./ prefix pattern mismatch | CMM4 | Workaround (Task 47) |
| Watchdog no supervisor | CMM4 | Fixed (Task 49) |
| TUI pending-edits lock | CMM4 | Fixed (Task 56) |
