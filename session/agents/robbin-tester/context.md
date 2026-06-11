# robbin-tester Context — 2026-06-11

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.210**
- Chain: **173/185** (sealed lossless, SM survival mode)

## Session 2026-06-11 — chain climb 8→173

### Summary
- Chain climb from 8/159 to 173/185 honest
- ~200 dedicated Test units created with real uuidgen uuids
- 5 shared-test over-credits fixed, collision cleanup (80 units)
- R19.82 takeover bug found+verified, R19.86 regression root-caused
- R19.87-90 behavioral tests (CSS guard, whenDefined, diffRender)
- All behavioral: DOM-parsed output, no source-string toContain

### Hard rules (boot.md has full 10)
- NEVER invent uuid suffix — uuidgen or verbatim copy
- shared-test marker = NEVER a flip — split first
- Unit with live marker = never garbage
- Validate vs ground truth (grep full uuid before claiming)

## Status: SM SURVIVAL MODE — IDLE at sealed checkpoint
