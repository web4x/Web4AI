# Tooling Gaps Found During Fork Workflow (robbin-skill-expert)

**Date**: 2026-06-05
**Operator**: oosh-expert
**Task**: Fork robbin-expert → robbin-skill-expert at robbinTeam:2.0

## Gaps Found (6)

### GAP 1: Task assumed window exists — no `hiveMind` method to create windows
**What happened**: Task said "robbinTeam:2.0 (window already created)" but window 2 didn't exist. Had to use raw `tmux new-window -t robbinTeam:2`.
**Should exist**: `otmux window.new <session> <?index>` or `hiveMind pane.create <session:window.pane>` that auto-creates windows.
**Severity**: LOW — one-off, but fork workflow should pre-check.

### GAP 2: New pane starts in zsh, not bash/OOSH
**What happened**: `tmux new-window` starts the user's default shell (zsh on macOS). OOSH commands aren't on PATH in zsh without sourcing user.env.
**Should exist**: `otmux window.new` should optionally start bash (like `tmux new-window "bash --login"`) or at minimum the fork command should use full path.
**Severity**: MEDIUM — every fork into a new pane hits this.

### GAP 3: otmux send to zsh pane — OOSH commands not on PATH
**What happened**: `otmux send robbinTeam:2.0 "claudeCode fork ..."` failed silently because `claudeCode` isn't on PATH in zsh. Had to use `/Users/donges/oosh/claudeCode`.
**Workaround**: Use full `$OOSH_DIR/claudeCode` path in send commands to non-OOSH shells.
**Should exist**: `hiveMind agent.fork` method that handles shell detection + full path.
**Severity**: HIGH — common failure mode for fork workflows.

### GAP 4: claudeCode fork rejects short UUID prefixes
**What happened**: Task spec had `a2ac40b0` (8 chars). `claudeCode.fork` validation rejected it: "invalid UUID (expected 8-4-4-4-12 hex)".
**Should exist**: Prefix-match resolution (like git commit hashes). Search `~/.claude/projects/*/*.jsonl` for files starting with the prefix.
**Severity**: HIGH — POs and tasks always use short UUIDs. Nobody remembers 36-char UUIDs.
**Proposed fix**: Add to `claudeCode.fork`: if arg matches `^[0-9a-f]{6,12}$`, glob `~/.claude/projects/*/${arg}*.jsonl`, take newest if exactly one match.

### GAP 5: No single `hiveMind agent.fork` command
**What happened**: Fork requires 9 manual steps: verify pane → title → lock → cd → claudeCode fork → wait → /rename → registry.set → boot prompt. This should be ONE command.
**Should exist**: `hiveMind agent.fork <sourceRole> <targetPane> <newRole>` that:
1. Resolves sourceRole → UUID via registry+sessions
2. Creates pane if needed (window.new)
3. Sets title + lock
4. Forks via `claudeCode fork <uuid>`
5. Waits for boot
6. Sends `/rename <newRole>@HIVEMIND_HOST`
7. Registers in S1+S2
8. Sends boot prompt from SKILL.md
**Severity**: CRITICAL — this is the #1 most common multi-agent operation.

### GAP 6: /rename delivery unreliable via send.raw
**What happened**: `/rename` is a Claude TUI slash command. `otmux send.raw` sends it but there's no verification it was processed (no pane.capture check). If autocomplete intercepts the Enter, the rename fails silently.
**Should exist**: `claudeCode rename <pane> <newName>` that sends + verifies via pane capture.
**Severity**: MEDIUM — workaround is manual verification.

## Recommended Priority

1. **GAP 5** — `hiveMind agent.fork` (CRITICAL — automates 9 steps)
2. **GAP 4** — short UUID prefix resolution (HIGH — QoL for every fork/join)
3. **GAP 3** — shell detection in send (HIGH — silent failure)
4. **GAP 2** — new-window defaults to bash (MEDIUM)
5. **GAP 6** — rename verification (MEDIUM)
6. **GAP 1** — window pre-check (LOW)
