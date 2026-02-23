# KB #28: DRY as Architectural Principle — Send Functions Case Study

## Problem
8 send functions existed across 2 scripts:
- `otmux.send()`, `otmux.send.enter()`, `otmux.send.verified()`, `otmux.send.keys()`, `otmux.send.tui()`
- `hiveMind.send()`, `hiveMind.send.enter()`, `hiveMind.send.message()`

INC-001 fixed the Enter key bug in `private.otmux.sendEnter()`. But `hiveMind.send()` (what agents use) calls `otmux.send()` which does NOT use the fixed path. The fix existed but was bypassed by DRY violation.

Result: INC-004 (unsubmitted prompts) persisted because agents used the unfixed code path.

## Solution: DRY Consolidation (Option C)
- `otmux.send()` = raw keys (keep, low-level)
- `otmux.send.enter()` = text + Enter via fixed `private.otmux.sendEnter()` (keep)
- Remove `otmux.send.keys()` (redundant alias)
- `hiveMind.send()` = resolve role + `otmux.send.enter()` (change default to include Enter)
- `hiveMind.send.message()` = safe send with pre-check (keep for complex cases)
- Remove `hiveMind.send.enter()` (now redundant — send does this by default)

## Architectural Principle
DRY violations cause bugs that survive "fixes". When the fix is in one layer but callers use a different layer, the bug persists. The oosh-expert as OOSH Principle Guardian must review all new methods for:
1. Does this duplicate existing functionality?
2. Does this bypass a fixed code path?
3. Should this delegate to an existing base function?

## Who needs this
- oosh-expert: DRY prevention is the guardian role
- hiveMindTeam: implementation and testing
- All agents: use `hiveMind send` (not variants) after fix ships
