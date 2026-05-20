[Back to Sprint 0 Planning](../../scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md)

# Task: ooshTeam Rebuild on McDonges — Complete
[task:uuid:d7e3f1a2-8b4c-4d9e-a6f5-3c2d1e0f9a8b]

**Date**: 2026-05-19/20
**Status**: DONE
**Machine**: McDonges
**Sprint**: [Sprint 0 — Lifecycle Consolidation](../../scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md)

## What Happened

Forked oosh-po from MacStudio to McDonges. Found ooshTeam session broken — 30 stale zsh panes, no agents running. Rebuilt the team from scratch using the MVC tools we built in Sprint 0.

## Steps That Worked

1. **Identified machine**: `hostname` → McDonges (NOT MacStudio — context was stale)
2. **Checked reality**: `otmux tree` — only 2 sessions (ooshTeam + __restore_init), 14 stale zsh panes
3. **Found snapshot**: `~/config/hivemind.snapshot.ooshTeam.env` — 3 agent UUIDs from MacStudio
4. **Verified JONSLs**: All 3 downloaded locally (architect 10.5MB, expert, tester)
5. **Killed stale panes**: `otmux pane.kill` from highest index down
6. **Created PO shell**: `otmux split` + `bash` + `otmux pane.title`
7. **Split for MacStudio remote**: `otmux split.h` for left/right shells
8. **SSH to MacStudio**: `ssh -i ~/.ssh/id_rsa -p 9922 donges@home.donges.it` + `bash` for OOSH
9. **Found saved layouts on MacStudio**: `otmux layout.list` — ooshTeam.layout.env existed!
10. **Downloaded layout**: `scp -P 9922` from MacStudio to `~/config/otmux/`
11. **Restored layout**: `otmux layout.restore ooshTeam --force` — exact 6-pane geometry with titles in seconds
12. **Agents forked**: `hiveMind teams.restore` with `--fork` (had issues — see bugs)

## What Failed

- `hiveMind teams.restore` created 12+ duplicate panes via `ensure.pane` before layout integration
- `ossh login MacStudio.home` failed — IdentityFile pointed to Docker path `/root/.ssh/id_rsa`
- `ossh login MacStudio.native` resolves to localhost on McDonges (same machine!)
- Clone trial was self-copy — didn't prove cross-machine

## Bugs Found (6 total)

1. otmux split.h/split.v naming swapped
2. teams.restore ignored layout files → FIXED (f39cb77)
3. ensure.pane excessive splits
4. ossh IdentityFile Docker path → FIXED (user config)
5. teams.save/pull missing layouts → FIXED (f39cb77)
6. scp self-migration truncation when src==dest

## Key Learning

The MVC tools work — `otmux layout.save/restore` recreated exact geometry in seconds. The gap was that hiveMind's Controller layer didn't use them. Expert fixed this in f39cb77 (layout integration into migrate/pull/restart). The View layer (otmux) was complete; the Controller layer (hiveMind) just needed wiring.

## Learnings

- **ALWAYS check hostname first** — context files lie after forks. `hostname` is truth.
- **otmux layout.save/restore is the correct tool** — don't manually split panes. Save on source, download, restore on target.
- **hiveMind teams.restore without layouts creates chaos** — ensure.pane splits blindly, creating 10-30 stale panes. Use layout.restore first, THEN fork agents into the correctly-shaped panes.
- **ossh config is machine-specific** — IdentityFile paths from Docker don't work on bare metal. Check before using.
- **McDonges.native = localhost** — never scp to yourself. Check if target resolves to self before migrating.
- **sweep.detect lies about ACTIVE** — agents idle for hours show as ACTIVE. Always manual verify with `hiveMind agent.monitor`.
- **Read the tools before acting** — otmux has layout.save/restore, layout.list, window.size.lock. I created/killed panes 3 times before reading the docs.

## Optimal Condensed Commands for Next Similar Task

```bash
# 1. Check where you are — NEVER trust context files after fork
hostname                        # truth — not what context.md says
otmux tree                      # what tmux sessions + panes actually exist
otmux pane.list <session>       # pane titles + commands

# 2. Clean stale panes (keep only yours, kill highest first)
for i in $(seq 20 -1 1); do otmux pane.kill "<session>:0.$i"; done

# 3. SSH to source machine via OOSH — check layouts exist
# Use ossh login, NOT raw ssh. If ossh config is broken, fix it first.
# CAVEAT: verify target is NOT localhost (hostname != ossh target hostname)
ossh login <sshConfigName>      # e.g. ossh login MacStudio.home
bash                            # start OOSH bash on remote
otmux layout.list               # check saved layouts exist

# 4. Download everything from source — ONE command
# team.pull downloads: snapshot + roles + sessions + JONSLs + layouts (f39cb77)
hiveMind team.pull <sshConfigName>
# If team.pull doesn't exist or fails, the manual fallback is:
# ossh scp <sshConfigName>:~/config/otmux/<session>.layout.env ~/config/otmux/
# ossh scp <sshConfigName>:~/config/hivemind.snapshot.<session>.env ~/config/

# 5. Restore layout (creates exact pane geometry + titles in one command)
otmux layout.restore <session> --force

# 6. Verify — must match source machine layout
otmux pane.list <session>

# 7. Fork agents into the correctly-shaped panes
# Option A: one by one (preferred — control per agent)
claudeCode fork.to <session>:0.1 <role>
claudeCode fork.to <session>:0.2 <role>
claudeCode fork.to <session>:0.3 <role>
# If best JSONL is at 0% context, use fallback:
# claudeCode fork.to lists candidates — pick one with room

# Option B: bulk from snapshot (if JONSLs already downloaded)
hiveMind teams.restore ~/config/hivemind.snapshot.<session>.env --fork

# 8. Verify agents running
hiveMind team.sweep <session>
hiveMind agent.monitor <agent-name> 8

# 9. Orient each agent — they don't know they were forked
# Send: "You are <role> at <session>:<pane> on <hostname>. Read your context files."
```

## Final Layout (matches upDownTeam on MacStudio)

```
ooshTeam:0.0  oosh-po         (Claude Code)
ooshTeam:0.1  oosh-architect  (Claude Code)
ooshTeam:0.2  oosh-expert     (Claude Code)
ooshTeam:0.3  oosh-tester     (Claude Code)
ooshTeam:0.4  oosh-expert-shell (bash)
ooshTeam:0.5  oosh-tester-shell (bash / SSH to MacStudio)
```
