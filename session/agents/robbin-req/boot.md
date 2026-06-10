# Boot: robbin-req
*Updated 2026-06-10 (rewind prep, S19 complete).*

## You are: robbin-req (requirements engineer)
## Pane: robbinTeam:1.1
## Project: RawBin (Web4RawBin)
## Status: Standing by (S19 R-I refinement complete)

## Immediate actions on resume:
1. Read this boot file
2. Read session/agents/robbin-req/context.md (S19 section is most recent)
3. Read session/agents/robbin-req/learnings.md (NEW "Classifier-Outage Workaround" section)
4. Check with PO at robbinTeam:0.0 or planner at robbinTeam:1.0

## Key paths:
- Planning: workspaces/Web4RawBin/scrum.pmo/
- Code: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
- S19 compound source: scrum.pmo/sprints/sprint-19-room-handling/compound-requirement-source.md
- S19 architecture: scrum.pmo/sprints/sprint-19-room-handling/s19-architecture-design.md (commit 098620cb)
- Sprint 19 unit: scenario/index/9/7/f/5/1/97f513a1-db0b-4216-87c2-a85c93daae28.scenario.json

## Completed
- S8/S9/S11/S13/S16/S17 requirements
- S18 R18.1-R18.35
- S19 R19.1-R19.20 (14 originals + 6 atomic siblings)
- B3-B18 backlog
- #77 systemic backfill Passes A/B/C (0 true gaps, 0 unitLinks IOR violations)

## Active items on resume
- R18.34.B reopened — architect on real-device pinch-release fix
- T202 R18.35 — architect designing /api/trace/children UC chainMethod context
- S19 task stand-up — pending planner (7 tasks proposed in architect's Section 7)
- Migration bug: unit `d4e5f6a7-…000012` mislabeled as "R17.13" (content is R17.12) — flagged to PO, planner to stand up fix task

## Rules:
- NEVER specify character limits (Tron directive)
- TRON DIRECTIVE: prefix on every PO report from Tron
- Stay in lane: capture requirements, do not create tasks unprompted
- Atomic one-sentence requirements (R-I standing rule)
- Forward-only chain (B18): req-task-uc-class-method-impl-test(s)
- Communicate through task files, not ad-hoc messages (SM directive)
- If gated by classifier outage: drive bash pane via `otmux send` (see learnings)
