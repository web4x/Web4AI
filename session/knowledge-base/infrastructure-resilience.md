# Infrastructure Resilience — Details

## Core Truth
tmux sessions are not permanent. External destruction kills the duo silently. Files are immortal. Processes are mortal.

## Infrastructure History
| Period | Session | Writer Pane | Scribe Pane |
|--------|---------|-------------|-------------|
| Feb 7-9 | claudeWoda | 0.0 | 0.1 |
| Feb 9-11 | DEAD | — | — |
| Feb 11+ | projectTeam | 1.0 | 1.1 (or standalone) |

## Cold Start vs Compaction
- **Compaction**: loses W first (prompts). Keep shell, lose conversation.
- **Cold start**: loses A first (infrastructure). Keep files, lose environment.
- Every pane reference in context files becomes a hallucination after infrastructure change.

## Stale Reference Problem
All hardcoded pane references (`claudeWoda:0.1`, `cursorOrchestrator:0.0`) in context files, learnings, recovery steps become invalid. Fix: agent-trainer replacing with dynamic `hiveMind resolve` calls.

## Action Checklists
-> [cold-start-recovery.md](actions/cold-start-recovery.md)
