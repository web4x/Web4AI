# DRY Task: Consolidate Send Functions (Tron Directive)

**From**: PO (Tron directive — Feb 23)
**Assigned to**: oosh-expert (architectural decision) + hiveMindTeam (implementation)
**Report to**: agent-trainer (update all SKILL.md with correct usage)

## The Problem

"we have tmux send, otmux send, hiveMind send maybe even claudeCode send.... which was fixed for INC-004??? why are the other options redundant and do not use the fixed solution!" — Tron

8 send functions exist where 2 would suffice:

### Layer 1 — otmux (pane-addressed, low-level)
| Function | Enter? | Implementation | Needed? |
|----------|--------|---------------|---------|
| `otmux.send()` | No (unless trailing Enter arg) | `tmux send-keys` | YES — base |
| `otmux.send.enter()` | YES | `private.otmux.sendEnter()` | YES — base+Enter |
| `otmux.send.verified()` | YES + verify | `private.otmux.sendEnter()` + capture | Maybe |
| `otmux.send.keys()` | No | alias for `otmux.send()` | REDUNDANT |
| `otmux.send.tui()` | Delayed keys | `private.otmux.sendKeys()` | KEEP — different purpose |

### Layer 2 — hiveMind (role-addressed, agent-level)
| Function | Enter? | Calls | Needed? |
|----------|--------|-------|---------|
| `hiveMind.send()` | **NO** | `otmux send` (raw) | WRONG DEFAULT |
| `hiveMind.send.enter()` | YES | `otmux send.enter` | Should be default |
| `hiveMind.send.message()` | YES + verify | Pre-check + blockers | Ideal but unused |

## Root Cause of INC-004

The INC-001 fix (commit 15a8a90) fixed `private.otmux.sendEnter()` — the base Enter function.
But `hiveMind send` (what every agent uses) calls `otmux.send()` which does NOT call the fixed function.
The fix exists but agents use the UNFIXED path.

`hiveMind.send.enter()` and `hiveMind.send.message()` use the fixed path — but nobody uses them because everyone is taught "use `hiveMind send`".

## Required Fix (DRY consolidation)

### Option A: Make hiveMind.send() append Enter (simplest)
- Change `hiveMind.send()` to call `otmux send.enter` instead of `otmux send`
- Delete `hiveMind.send.enter()` — now redundant
- Keep `hiveMind.send.message()` for safe-send use cases
- Total: 2 hiveMind send methods (send, send.message)

### Option B: Merge everything into hiveMind.send() (cleanest DRY)
- `hiveMind.send()` = resolve role + send literal text + Enter + verify
- No other hiveMind.send variants needed
- Raw key sending: use `otmux send` directly
- Total: 1 hiveMind send method

### Option C: Keep layers but fix the default
- `otmux.send()` = raw (keep as-is, low-level)
- `otmux.send.enter()` = text + Enter (keep)
- Remove `otmux.send.keys()` (redundant alias)
- `hiveMind.send()` = resolve role + `otmux send.enter` (change default)
- `hiveMind.send.message()` = safe send (keep for complex cases)
- Remove `hiveMind.send.enter()` (now redundant)

### Recommendation: Option C
- Preserves layer separation (otmux = pane, hiveMind = role)
- Fixes the default (agents just use `hiveMind send` and it works)
- Removes redundant aliases
- DRY: 2 otmux send variants (raw, enter) + 2 hiveMind variants (send, send.message)

## Expert Role Going Forward

oosh-expert as OOSH Principle Guardian must:
1. Review new methods for DRY violations BEFORE implementation
2. Ensure new script methods delegate to existing base functions
3. Prevent layer bypass (hiveMind should never call raw tmux directly)
4. Document the call chain in oosh-architecture.md

## Trainer Action

Once fix is implemented:
1. Update ALL agent SKILL.md: "Use `hiveMind send <role> msg` — it appends Enter automatically"
2. Remove all references to `hiveMind send.enter` — it will be deleted
3. Remove all references to raw `tmux send-keys` — already forbidden
4. Update boot.md templates

## Quota
Weekly at 80%, cap 92%. Be efficient.
