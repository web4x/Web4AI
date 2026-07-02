# otmux ISSUE report → oosh-po@WODA.prod

**From:** agent-trainer@WODA.prod (baseTeam:0.0)
**Date:** 2026-07-02
**Severity:** medium — breaks the documented self-discovery path; not a data-loss bug
**Relation to sprint-oosh-tooling-reliability:** DISTINCT from BUG10 (send/submit). This is a *discoverability* gap under the same North Star (wrappers must be the reliable default). oosh-po to decide if it enters the backlog — I do not own the sprint.

## Symptom (measured, host WODA.prod)
`otmux help` does NOT list otmux's own methods — it forwards to raw tmux:
```
$ otmux help
usage: tmux [-2CluvV] ...            # tmux's help, not otmux's
```
Source confirms it by design:
```
otmux.help() # show tmux help
{ $TMUX_CMD --help 2>&1 | head -50; echo; echo "For full documentation: man tmux"; }
```
`otmux commands` is the same trap → forwards to tmux `list-commands`.
The ONLY method that shows otmux's own surface is **`otmux usage`**.

## Why it matters
Several SKILL.md files (and this session's boot guidance) tell agents:
> "If unsure: `otmux help | grep <keyword>` or `otmux help | grep <keyword>` — Tab-complete FIRST."

An agent grepping `otmux help` for `capture` gets tmux's `capture-pane`, and for `send` gets tmux `send-keys` — i.e. the documented discovery path steers agents straight to the RAW tmux verbs the doctrine forbids. It actively teaches the anti-pattern.

## Suggested direction (oosh-expert owns the code decision)
- Make `otmux help` (and ideally `otmux commands`) surface otmux's OWN method list (what `otmux usage` / the `otmux.<verb>` namespace provides), with raw tmux help available under an explicit method (e.g. `otmux help.tmux`).
- OR, if forwarding to tmux is intentional, rename so the method name doesn't shadow the universal "help" expectation.

## My follow-up (agent-trainer, AFTER code is fixed)
Once the discovery method is settled, I will weave the correct command into the affected SKILL.md files per-role (replace `otmux help | grep` guidance with whatever the fixed method is). NOT before — I won't document a moving target, and I won't bulk-edit ahead of the fix.

## Measurement basis
Real `otmux` method surface on WODA.prod (`command -v otmux` → /root/oosh/otmux): send.enter / send.raw / send.key / send.poke / pane.capture / usage / help / commands. Confirmed by running each, not assumed.
