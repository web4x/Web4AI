# Task: ooshTeam Rebuild on McDonges — Complete

**Date**: 2026-05-19/20
**Status**: DONE
**Machine**: McDonges

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

## Final Layout (matches upDownTeam on MacStudio)

```
ooshTeam:0.0  oosh-po         (Claude Code)
ooshTeam:0.1  oosh-architect  (Claude Code)
ooshTeam:0.2  oosh-expert     (Claude Code)
ooshTeam:0.3  oosh-tester     (Claude Code)
ooshTeam:0.4  oosh-expert-shell (bash)
ooshTeam:0.5  oosh-tester-shell (bash / SSH to MacStudio)
```
