# Task: document the team-migration PROCESS + required CALLS in tool usage

**From**: oosh-po@MacStudio (Tron 2026-06-27 "document in the usage of the tools the processes and calls required")
**Owner**: oosh-architect (doc) + oosh-expert (usage() text) on dev. Guardian (me) QA.
**Where**: `hiveMind.usage()` (the `hiveMind` with-no-args / `hiveMind usage` help) + `docs/hivemind.md`. Cross-ref `otmux`/`claudeCode` usage for the primitives.

## What to document
Both: (1) the ONE-COMMAND target, and (2) the underlying call sequence (for transparency/debug).

### Target (once team.push lands)
```
hiveMind team.push <host>     # whole team → host: provision + migrate + /rc + audit, ONE command
hiveMind agent.push <name> <host>
```

### The PROCESS + CALLS (the manual journey this automates — document so it's discoverable)
0. **Pre-flight probe**: `ossh exec <host> '<check oosh|claude|tmux|workspace|repos>'`
1. **Provision fresh host** (team.push owns; see provisioning feature): clone workspace repo (clone-if-absent), materialize real `workspaces/` + component symlinks (Web4RawBin), clone/link dep repos, `claudeCode install` if missing, prereq gate.
2. **Snapshot source**: `hiveMind teams.save` → snapshot (session|addr|role|uuid|title).
3. **Target hash**: compute project hash from the TARGET workspace path (`/var/dev/Workspaces/AI/Claude` → `-var-dev-Workspaces-AI-Claude`). NOT the source hash (the #7 trap).
4. **Place JSONLs**: per agent `ossh scp <srcJSONL> <host>:~/.claude/projects/<targetHash>/<uuid>.jsonl`. Verify `claudeCode list` on host shows them.
5. **Target session**: `otmux new <team> -d` (must NOT attach from a remote shell — G-G), split to N panes, `otmux pane.title` each.
6. **Fork per pane** (PDCA, verify each): `cd <targetWorkspace> && claudeCode fork <FULL-uuid>` (full 8-4-4-4-12 — G-I); resume menu → `send.raw <pane> 2` (full, never summary).
7. **Identity**: `/rename <role>@<host>` (slash → double-Enter; verify it took — G-F).
8. **/rc immediately**: `/remote-control` (double-Enter; capture `claude.ai/code/session_...` URL) — EVERY agent.
9. **MVC consistent**: `otmux pane.lock <pane> <role>@<host>` + `hiveMind registry.set <pane> <role>`.
10. **Parity gate**: `hiveMind consistency.fix <team>` then `consistency.audit <team>` → 0 violations.
11. **Cross-machine comms**: migrated agents report home via the shared git repo (mailbox), not a live channel.

### Also document (gotchas, from migration-endeavor-gaps.md)
- target-hash placement (else `claudeCode list` blind), full-UUID fork, resume opt-2, double-Enter for slash cmds over ssh, `otmux new -d` no-attach, idempotent/resumable (re-run safe), /rc-immediate.

## Acceptance
- [ ] `hiveMind usage` shows team.push/agent.push + a "Team migration" section with the process
- [ ] `docs/hivemind.md` has a "Team Migration" section: one-command + the call sequence + gotchas
- [ ] guardian QA sign-off

## Report-back
- architect/expert (doc landed on dev):
