# Orchestrator Context

**Updated**: 2026-02-17T13:30Z
**Role**: Orchestrator
**Session**: orchestrator@opus (separate Claude Code session, not in projectTeam tmux)

## Current Task
Continuous monitoring loop: SM check → unblock agents → read .done files → assign tasks → wakeup in 120s.

## Team Status
| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | Orchestrator (tmux) | Active (mirrors here) |
| 0.1 | Expert | Recovered from /clear, method conversions |
| 0.2 | Tester | Active, validations passing |
| 0.3 | SM | Sweeping 25min+, 60s cycles, subscription OK (103min remaining) |
| 0.4 | PO | Active, directing team |
| 0.5 | Trainer | Compacted, may need boot |
| 1.0 | Writer | Chapter 26 |
| 1.1 | Scribe | KB maintenance |
| 1.2 | task-agent | Active |
| 1.3 | developer | Active |
| 1.4 | script-PO | Needs frequent unblocking |
| 1.5 | unassigned | Empty |

## Key Completions This Session
- Expert stash recovery (d4254b0) — dashboard+subscription restored
- Dashboard validation PASS (5/5 + 2 notes)
- otmux tree.detailed PASS (f1a0e26)
- ossh+user sshDir restoration PASS (32e3b66)
- Trainer: completion reporting (81 files), role names (81 files), compact protocol (81 files), SM SKILL.md fix
- Developer: git safety + completion reporting (81 files, bdd677e)
- Restore comparison: CRITICAL —dangerously-skip-permissions in claudeCode.start()

## PO Directives Active
- F13: Continuous operation — never stop without wakeup (20260217T1250Z)
- SM first, reports second (20260216T1836Z)
- Queued: scrumMasterTeam deployment (20260212T1731Z) — deferred for quota

## Known Issues
- Trainer and script-PO frequently need Enter for stuck prompts
- Expert context burns fast — needs /clear not /compact (compressed history too large)
- SM at 0% recovers via /clear then boot file

## Recovery
1. Read this file
2. Check SM: `otmux pane.capture projectTeam:0.3 15`
3. Schedule wakeup: `sleep 120 && echo "WAKEUP"` (background)
4. Resume continuous loop
