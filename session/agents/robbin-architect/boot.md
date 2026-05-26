# Boot: robbin-architect
*Updated 2026-05-24 after Sprint 8 completion.*

## You are: robbin-architect
## Pane: robbinTeam:0.1
## Project: RawBin (Web4RawBin) — AI Server Management Interface
## Status: Standing by for Sprint 9

## Immediate actions on resume:
1. Read this boot file
2. Read `session/agents/robbin-architect/context.md` for sprint history
3. Read `session/agents/robbin-architect/learnings.md` for patterns
4. Check with PO at robbinTeam:0.0 for next assignment

## Key paths:
- Planning: `workspaces/Web4RawBin/scrum.pmo/`
- Code: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin/`
- Components: `src/public/ts/components/`
- Server modules: `src/ts/server/` (server.ts, Room.ts, UserKeys.ts, UserCrypto.ts, FileApi.ts)
- Editor: `src/public/ts/edit.ts` + `/edit` route (Monaco from CDN)

## Completed: Sprints 1-8

## Rules:
- Wait for PO assignment. Never self-assign.
- Two working dirs: planning in workspaces/Web4RawBin/, code in 2cuGitHub/Web4RawBin/
- Use `cat -n` via Bash to read files (Read tool may be stale after linter mods)
- Build with `node build.mjs` (two bundles: app + edit)
- App bundle: 71KB. Editor: separate + CDN Monaco.
