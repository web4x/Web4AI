# oosh-po Context

**Updated**: 2026-06-19
**Role**: oosh-po (forked from fallback-oosh-po)
**Pane**: ooshTeam:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio [29a1e1d1-2284-4484-a95e-6b89154c7a9c] (current fork)

## Identity (verify on doubt)
- I am a FORK. Conversation continuity LIES about identity after a fork.
- Verify: `otmux pane.get.target` → ooshTeam:0.0, `claudeCode session.name <uuid>` → oosh-po@MacStudio
- My files: `session/agents/oosh-po/` (NOT product-owner/)
- Tron is at TRONinterface:0.0 — never interrupt that pane

## Team Layout (ooshTeam) — restored 2026-06-19 (trained forks, full-session resume)
| Pane | Agent | Fork UUID |
|------|-------|-----------|
| 0.0 | oosh-po (me) | 29a1e1d1 |
| 0.1 | oosh-architect | 6df08923 |
| 0.2 | oosh-expert | a43c1b23 |
| 0.3 | oosh-tester | 74f27969 |
| 0.4 | oosh-expert-shell | (bash) |
| 0.5 | oosh-tester-shell | (bash) |
All 5 agents have /remote-control active (mobile control).

## Other Teams
| Team | Status |
|------|--------|
| TRONinterface | Tron (0.0) + scrum-master (0.1, Sonnet sweep monitor) |
| web4team | web4-po + architect + expert + tester |
| baseTeam | agent-trainer (0.0) — recovered 977.5k = 0% ctx, can't rewind until compacted |

## SM (scrum-master) — TRONinterface:0.1
- Reports to ME (oosh-po). Sweeps, unblocks SAFE prompts, tracks velocity, reports blockers/recovery.
- Does NOT assign tasks (my job). I do NOT self-poll/sweep (that's SM + burns my context).
- 42 pair: SM unblocks my prompts, I unblock/restart SM.

## MVC — route agent ops through hiveMind CONTROLLER (not raw tmux/otmux)
- Model=claudeCode, View=otmux, Controller=hiveMind, Monitor=tronMonitor
- `hiveMind resolve` (all teams) · `agent.send` (idle→INFORM/busy→QUEUE/overlay→reject) · `delegate` (file+nudge) · `teams.restore <snap> fork` (whole-team fork+resume) · `agent.monitor` (by name)

## ACTIVE DELIVERABLE (PO-owned, in flight)
**claudeCode list/completion/discovery fixes** + restore-process bug backlog (8 bugs).
- Specs: `session/tasks/claudeCode-list-discovery-fixes.md` (#1-3), `session/tasks/bugs-agent-restore-process.md` (#1-8, owner table + report-back).
- Expert owns code #1-8 (order: #1-3 in flight → #8 → #4 → #5 → #6 → #7). Tester owns tests. Architect owns design/spec for #4/#8.
- Drive: agents report in the task files → SM reports blockers → I verify (`claudeCode list oosh` etc.) → deliver to Tron.

## Rules (eternal — copy forward every save)
- MANAGE don't just analyze: every bug → owned task + report-back + driven to green. PO delegates fix, never codes it.
- CMM4 comms: task file IS the channel (full spec); chat/send = ONE-LINE reference only. Agents report in the file.
- otmux send VARIANTS: `send`=prefixed prose-to-agent ONLY; `send.raw`=raw keys no prefix; `send.enter`=shell cmd no prefix. Prefer controller `hiveMind agent.send`.
- Resume menu: NEVER summary (option 1) — always option 2 full. Arrows echo literal; DIGITS work (`send.raw <pane> 2`). Zoom pane first for width.
- Killed claude → PTY raw → `tmux respawn-pane -k` (not reset).
- Trained vs untrained = JSONL line count (tens=clone, thousands=trained).
- PDCA per pane, NO for-loops on multi-pane ops. Balance zoom toggles.
- NEVER /clear or compact a trained agent — only Tron authorizes; autocompact OFF by design. Low ctx → REPORT.
- Subscription counts INPUT; sustained output ~free. Minimize new prompts (my huge context replays each turn = the burn). Don't self-poll. Check `scrumMaster subscription` via PO shell every 10-15 min.
- No output filtering (no 2>/dev/null, grep/head/tail on shown output). No until-loops/while-sleep polling.
- Name format role@host (intentional, for /remote-control). Don't strip @host.
- Verify identity on doubt: pane.get.target + session.name.
- Sprint planning files are PO's living truth — tick as commits land.
- DRY not negotiable — one source of truth.

## Post-rewind/compact recovery
1. Read this context.md + learnings.md (session/agents/oosh-po/)
2. Verify identity: pane.get.target + session.name 29a1e1d1
3. `hiveMind team.status ooshTeam` — see agents
4. Read active deliverable task files, check report-back blocks for progress
5. Resume driving: verify reported fixes, assign next, deliver QA to Tron
