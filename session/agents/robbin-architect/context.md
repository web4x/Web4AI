# robbin-architect Context (Save 2026-06-11 late, ~55% ctx)

## ACTIVE — diagnosing file-items regression + chaining new reqs
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## SCOREBOARD (last settled: ~148/170+)
0 architect-open chains. Expert + tester closing tail.

## ACTIVE DIAGNOSIS: file-items regression (v0.5.203)
ROOT CAUSE: no renderRoomTreeFiles() — files only render via live FILE_ADDED, destroyed on any re-render. Fix: add this.files[] + renderRoomTreeFiles() mirroring member pattern.

## CHAINS DESIGNED THIS SESSION (overnight drive 2026-06-11)
R19.35-75+ (40+ chains designed, anchored, committed)
Key designs: DnD file-upload, Message units, Logger, Device↔User, ContentPreviewer, Room children FWD, security (room-scoped access + iframe sandbox), drawer UX, addMember takeover

## STANDING RULES
- HARD RULE: marker UUID = uuidgen-fresh OR verbatim 36-char copy. No invented suffixes.
- 0 architect-open. Monitoring tester/expert batches for realness.
- CSS impls ARE real → marker in CSS comment syntax.
- Skills = thin CLI → typed Class.method (OOSH Object.verb).
- NEVER /compact. Only /rewind.
