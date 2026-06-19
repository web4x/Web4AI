# Bug Report: claudeCode + otmux issues found during agent restoration

**From**: oosh-po
**To**: oosh-architect
**Date**: 2026-04-23
**Context**: Restoring 3 trained ooshTeam agents (accidentally replaced by untrained clones). Forked Jun-16 trained sessions back in. Many tooling gaps surfaced.

## Tron's issues (HIGH — he hit these directly)

### 1. `claudeCode list <filter>` does not filter by name
`claudeCode list oosh` should show only sessions whose agent name contains "oosh". Currently it ignores the arg and dumps ALL sessions across all projects (~90 lines). Need: `claudeCode list <substring>` filters the agent-name column.

### 2. UUID completion broken
Tab completion for UUID arguments (`claudeCode fork <uuid>`, `join.byID <uuid>`) does not complete. Should offer the known session UUIDs (from the list / sessions.env) as completion candidates, ideally labelled with agent name + date.

### 3. Cannot tell which UUID is the OLDER one on a given date (16.6.26)
`claudeCode list` shows "Jun 16 19:06" style timestamps but at minute resolution it's hard to see which of several same-day sessions is oldest, and dead/gray/green coloring doesn't sort by age. Need: sortable/clear age, e.g. `claudeCode list --by-age` or an explicit sortable ISO timestamp column, and a way to pick "oldest trained <role>".

## oosh-po's issues (found during the restore)

### 4. `otmux send` prefix corrupts shell/menu targets
`otmux send <pane> <text>` prepends `[@role pane]` sender prefix. Sent to a BASH pane it becomes `[@oosh-po ooshTeam:0.0] echo hi` → "zsh: bad pattern". The prefix is correct for prose to idle Claude agents, but there is no guard when the target pane is a plain shell (or a TUI menu). Proposal: detect non-Claude target (isClaudeCode=false) → skip prefix, OR a dedicated `otmux send.cmd` for shells. Document clearly which send variant is prefix-free (send.raw, send.enter) vs prefixed (send).

### 5. Killing a claude TUI leaves the PTY in raw mode
After `kill <claude-pid>`, the pane's shell echoes control chars literally (`^M`, `^C`, `clear^M` not executed) — terminal stuck in raw mode. There is no clean `claudeCode stop <pane>` that restores cooked mode. Workaround found: `tmux respawn-pane -k -t <pane>`. Proposal: add `claudeCode stop <pane>` that kills the process AND runs `stty sane`/respawns, leaving a clean shell.

### 6. "Resume from summary" menu un-navigable via tmux keys
On `claudeCode fork <uuid>` of a large session near usage limits, Claude Code shows a startup menu:
```
1. Resume from summary (recommended)
2. Resume full session as-is
3. Don't ask me again
```
- Arrow keys sent via tmux (`send.raw/send.key/send.tui Down`) ECHO LITERALLY as `^[[B` — cursor-key application-mode mismatch; selection never moves.
- Escape also echoes `^[`.
- **Digit keys DO work**: `otmux send.raw <pane> 2` selects "Resume full session as-is".
- Menu only renders the full 3-option list at sufficient pane WIDTH; at 27 cols it wraps/corrupts and even digits got messy.
Proposals:
  a) `claudeCode fork/join` flag or env to force full-session resume non-interactively (skip the menu) — e.g. `claudeCode join.byID <uuid> --full`.
  b) If menu must be navigated, document that DIGITS work and arrows don't, and that the pane must be zoomed/wide first.
  c) NEVER auto-pick "Resume from summary" — it silently discards the trained context (Tron's hard rule).

### 7. No size-safe TUI interaction at 27-col panes
6-pane team windows give each pane ~27x10. Claude Code menus/dialogs are unusable at that width. Proposal: a helper that zooms a pane, performs the interaction, then unzooms — or guidance to interact only while zoomed.

## 8. `hiveMind agent.send` rejects on accept-edits-as-overlay (too aggressive)
`hiveMind agent.send <name> <msg>` returns `rejected: <agent> is in overlay state — use approve/reject/dismiss/option` when the target merely has the **accept-edits banner** on (`⏵⏵ accept edits`) — not a real modal overlay. Hit on BOTH oosh-expert and scrum-master while they were idle/active at the prompt. This blocks legitimate INFORM/QUEUE sends to healthy agents. Fix: the overlay classifier (sweep.detect) must NOT treat accept-edits mode as a blocking overlay for send routing — accept-edits should route as normal (idle→INFORM / busy→QUEUE), only TRUE modals (permission, panel, autocomplete) should require approve/dismiss. Related to bug #6 (sweep.detect false-positives).

## ASSIGNMENTS + REPORT-BACK (PO-managed — report HERE, not chat)
Deliverer/owner: **oosh-po**. Each fix has an owner; agents tick the box + add commit when done, then one-line ref to PO. SM reports blockers.

| # | Bug | Owner | Size | Status | Commit |
|---|-----|-------|------|--------|--------|
| 1 | list nameFilter (drop json) | oosh-expert | S | ✅ DONE+PO-VERIFIED (list oosh→26/84, list robbin→30; T-LIST-FILTER-1/2 GREEN) | 44726ab |
| 2 | UUID completion fork/join | oosh-expert | M | ✅ DONE (T-COMPLETE-UUID-1/2 GREEN) | 44726ab |
| 3 | age-sort / oldest picker | oosh-expert | S | ✅ DONE (ls -t newest-first, T-LIST-SORT-1 GREEN) | 44726ab |
| 4 | otmux send prefix guard | oosh-expert | S | ✅ RESOLVED (architect-confirmed: send.smart skips prefix for shell/non-Claude) | in send.smart |
| 5 | claudeCode stop = kill PID + respawn (restore cooked mode) | oosh-expert | S | ASSIGNED | ___ |
| 6 | sweep.detect idle-vs-active — **KEYSTONE** | oosh-expert | M | ✅ DONE+VERIFIED (live: idle agents show IDLE) | a986391 |
| 7 | 27-col TUI: zoom-helper for menu interaction | oosh-expert | S | ASSIGNED | ___ |
| 8 | agent.send: REMOVE accept-edits PRE-CHECK (otmux auto-clears it) | oosh-expert | S | ✅ DONE (accept-edits routes to inform, not overlay) | 57cf612 |
| 9 | T-ALIGN-8 test hangs scanning ~80 panes (test 270) → blocks ALL list-task tests | oosh-expert | S | ✅ DONE (cap 20 Claude panes + skip non-Claude via tty check) | 44726ab |
| 10 | team.push alias → teams.migrate (symmetry with team.pull) | oosh-expert | XS | ✅ DONE (thin wrapper + sshHost completion) | 57cf612 |

**#10 spec (Tron direct):** add `hiveMind.team.push()` as a thin DRY wrapper: `hiveMind.team.push() # <sshHost> # push team to remote (alias for teams.migrate) { hiveMind.teams.migrate "$@"; }`. Keep `teams.migrate` (don't rename/break it). Add `team.push.completion.sshHost` (reuse teams.migrate's host completion) + a usage line. Tester: T-PUSH-ALIAS (push routes to migrate, completion works). Gives team.pull/team.push symmetry.

- Tests for each: **oosh-tester** — add T- cases, run green against expert's commit, report result here.
- Architect (oosh-architect): owns design/triage + the send-prefix-spec.md reference for #4/#8.
- Order (updated 2026-06-19): #6 DONE ✓, #4 RESOLVED ✓. NEXT for expert: **#9 (unblock test suite — T-ALIGN-8 timeout/skip)** → verify list-task #1-3 green → audit-#1, audit-#3 (consistency core, see 20260619T1100Z file) → #8 → audit-#2/#4/#5 → #5, #7 → DURING_REWIND impl (design done, approved).
- **#6 root-cause (SM diagnosis 2026-06-19):** `team.sweep` classifies agent state from SCROLLBACK TEXT PATTERNS, not live prompt state. Result: an idle agent at an empty `❯` prompt is reported ACTIVE (stale "reading"/verb text in scrollback). This masked a fully-idle team for multiple ticks AND likely makes `agent.send` busy-detection mis-queue to idle agents. FIX: distinguish idle-at-prompt (bare `❯`, no `esc to interrupt`) from genuinely ACTIVE (esc-to-interrupt / thinking / running present in the LAST live lines). Ref SM learnings #2 + Rule 8.

### Report-back lines (agents edit)
- Expert (2026-06-19): #9 T-ALIGN-8 cap (44726ab) — pane scan limited to 20 Claude panes via tty check, was scanning ~80 and hanging. #3 age-sort (same commit) — `ls -t` newest-first. All 5 target tests GREEN: T-LIST-FILTER-1/2, T-LIST-SORT-1, T-COMPLETE-UUID-1/2. #6 sweep idle-vs-active (a986391) — done earlier today.
- Tester (2026-06-19): Tests written for #1-3 (a469165): T-LIST-FILTER-1/2, T-LIST-SORT-1, T-COMPLETE-UUID-1/2, T-COLOR-PANE-CYAN, T-COLOR-DATE + T-LIST-FMT-1..7 + T-LIST-PERF-1..4. RUN BLOCKED: T-ALIGN-8 hangs at test 270 scanning 80+ panes, all my tests are after that and never execute. #6 sweep fix a986391 verified (see status table). hiveMind test suite also running (pane 0.5, started, ETA ~1hr).

## Working recipe (validated this session — restore a trained agent)
1. `tmux resize-pane -Z -t <pane>` (zoom for width)
2. `otmux send.enter <pane> "claudeCode fork <uuid>"` (prefix-free)
3. wait ~12s for menu
4. `otmux send.raw <pane> 2`  ← digit selects "Resume full session as-is"
5. verify trained prompt (`<role>@host`), then unzoom
