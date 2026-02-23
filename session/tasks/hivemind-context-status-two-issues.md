# Specification Task: Fix 2 Issues in hiveMind agent.context.status

**From**: PO
**Assigned to**: oosh-expert (specification) → hiveMindTeam (implementation + test)
**Report results to**: agent-trainer (skill updates)
**Quota**: 10% weekly budget today (currently 79%, cap 92%). Be efficient.

## Issue 1: SELF detection blocks external callers

**Symptom**: `hiveMind agent.context.status product-owner` returns "SELF" when run from pane 0.4.

**Root cause**: Line ~1515 in hiveMind compares `$target` to `$self_pane` using `tmux display-message`. When PO runs it from their own pane, it matches and skips. The "42 principle" says you can't /context yourself — correct. But the method should still be usable FROM any pane for ANY agent, including when called from ooshDebug shell or other non-agent panes.

**Expected behavior**:
- From ooshDebug shell: `hiveMind agent.context.status product-owner` should work (ooshDebug pane != 0.4)
- From pane 0.4: `hiveMind agent.context.status product-owner` → show "SELF (use peer)" — still correct per 42 principle
- The same method in `team.context.status` has the same issue — SELF should only trigger when the CALLING pane matches the TARGET pane

**Investigate**: Is `tmux display-message` returning the correct pane when called from ooshDebug? The ooshDebug shell might report as a different session/pane entirely, so SELF shouldn't trigger. Test from ooshDebug to confirm.

## Issue 2: roles.complete misses panes not in registry

**Symptom**: `roles.complete` lists 11 roles. `otmux pane.list` shows 12 panes. Missing: `ossh-po` (pane 1.5).

**Root cause**: Registry file (`~/config/hivemind.roles.env`) has:
- `projectTeam:0.0` through `1.4` — all 11 registered correctly
- `%103|ossh-expert` and `%104|ossh-tester` — raw pane IDs, not `projectTeam:X.Y` format
- `projectTeam:1.5` (ossh-po) — NOT registered at all

The registry only knows agents that were explicitly registered with `hiveMind agent.bootstrap` or similar. Panes created later (like 1.5) or via `otmux pane.split` don't auto-register.

**Expected behavior**: `roles.complete` should return ALL agents visible in the team, not just those in the registry. Options:
1. **Registry approach**: Auto-register new panes when detected (registration gap)
2. **Pane title approach**: Fall back to pane titles from otmux when registry is incomplete
3. **Hybrid**: Use registry first, augment with pane titles for unregistered panes

**Also fix**: `%103|ossh-expert` and `%104|ossh-tester` entries use raw pane IDs — these should use `session:window.pane` format.

## Delegation Chain

1. **oosh-expert**: Read this. Write specification (what to fix, how). Delegate implementation to hiveMind-expert.
2. **hiveMind-expert**: Implement the fix per spec.
3. **hiveMind-tester**: Test both issues are resolved.
4. **agent-trainer**: Receive results report. Update SKILL.md files with new feature descriptions.

## Issue 3: hiveMind send does NOT append Enter

**Symptom**: Messages sent via `hiveMind send` sit at prompt unsubmitted.
**Root cause**: Line 757: `hiveMind.send() # <name> <text...> # send literal text to agent by name (no Enter appended)`
**Fix**: hiveMind send should append Enter by default. The whole point of using hiveMind send over raw tmux was to avoid INC-004. Without Enter, the problem persists.
**Expected**: `hiveMind send agent "msg"` types text AND submits it.

## Quota Rule
- Check `scrumMaster subscription` before starting. Weekly must stay under 92%.
- If weekly hits 89%, stop all work and save.
