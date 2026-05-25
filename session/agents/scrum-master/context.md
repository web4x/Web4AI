# Scrum Master Context — Pre-Rewind Save (2026-05-01)

## Identity
- **Role:** scrum-master at TRONinterface:0.1
- **42 pair:** oosh-po at ooshTeam:0.0
- **Teams monitored:** ooshTeam (primary), robbinTeam (new), baseTeam (agent-trainer)

## Current State
- ooshTeam: oosh-po ACTIVE, oosh-architect COMPLETED (idle, was told to compact — not by SM), oosh-expert ACTIVE running, oosh-tester ACCEPT_EDITS (stale/idle)
- robbinTeam: ALL 4 agents FORKED from upDownTeam — robbin-po, robbin-architect, robbin-expert, robbin-tester. All renamed+locked role@MacStudio. CWD: agents were restarted with correct /Users/Shared/Workspaces/AI/Claude but agent-trainer verification showed /components/OOSH/macos (cwd bound to launch dir, not changeable via /cd). TRON ordered Option A restart with fork — all 4 forked successfully with inherited training.
- robbinTeam:0.0 (robbin-po) and 0.1 (robbin-architect) were planning task 2 architecture when TRON called rewind.
- baseTeam: agent-trainer COMPACTED (hit context limit during robbinTeam verification)
- Subscription: 4% 5h, 40% 7d — fresh budget, safe

## robbinTeam Setup Summary (completed this session)
1. oosh-expert cloned upDownTeam → robbinTeam (4 panes, claudeCode opus)
2. Naming fix: /rename role@MacStudio + otmux pane.lock on all 4
3. CWD fix attempt 1: /cd doesn't exist in Claude Code TUI — BLOCKED
4. CWD fix attempt 2: TRON authorized Option A restart (/exit + cd + claudeCode opus) — done
5. TRON discovered agents were empty (not forked) — ordered fork from ud-team
6. All 4 re-done with claudeCode fork <uuid> from upDownTeam agents
7. Agent-trainer verified: all PASS, inherited training confirmed
8. Agent-trainer noted: need robbin-specific SKILL.md and context files for full transition

## Key Learnings This Session
- /cd is NOT a Claude Code command — cwd is bound to launch directory
- claudeCode fork <uuid> inherits training from source agent
- agent.rename with @ in name fails (use dash instead) — registry name vs pane title are separate
- hiveMind registry names don't update from pane.lock (known limitation)
- Don't spam CMM4 reminders to idle agents — if team is idle, stand by instead
- When agents are idle and ignoring messages, stop sending — better to stand by
- Measure subscription BEFORE going silent (learned early in session)
- SM unblocks POs ONLY — report non-PO blockers to their PO for review
- ACCEPT_EDITS on idle agents is stale UI, not a real blocker
- Background sleep timer works: `sleep 60 && echo "SWEEP TICK"` with run_in_background=true

## Pending Tasks
- robbinTeam:0.0 and 0.1 were planning task 2 architecture — monitor when resumed
- robbinTeam agents need robbin-specific SKILL.md and context files
- agent-trainer at baseTeam:0.0 is COMPACTED — may need rewind/fork
