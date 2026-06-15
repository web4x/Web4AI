# robbin-architect Context (Save 2026-06-16 post-rewind cycle-2)

## STATUS: Active — DIAGNOSING persistent member-drop (Royal Jungle bug)
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## GIT-VERIFIED
- HEAD: add897c13 (v0.6.52)
- Branch: main, 1 ahead of origin

## CURRENT DIAGNOSIS: Royal Jungle persistent member-drop

PO directive: persistent rooms drop members on leave instead of retaining + flipping online/offline. R19.7+R19.8 (T-persistent v0.5.127) regression.

### Code Path Analysis (MEASURED from v0.6.52 source)

**Server-side retainOrPrune is CORRECT:**
- Room.ts:207-212 `retainOrPrune()`: persistent→markDisconnected, live→removeMember
- Room.ts:216-223 `markDisconnected()`: sets member.disconnected=true, broadcasts MEMBER_DISCONNECTED, persists
- server.ts:1498 ws.close handler → retainOrPrune (correct)
- server.ts:1600 LEAVE_ROOM handler → retainOrPrune (correct)
- NO direct removeMember bypass found in server.ts

**Client-side handlers are CORRECT:**
- RoomView.ts:62 MEMBER_LEFT → filters member out of local array (correct for live mode)
- RoomView.ts:63 MEMBER_DISCONNECTED → flips m.disconnected=true, re-renders (correct for persistent)
- RoomView.ts:64 MEMBER_RECONNECTED → removes old, pushes new with disconnected=false (correct)

**Persist/restore round-trip preserves members:**
- Room.ts:340-348 persist() writes members[] with status online/offline
- server.ts:242-246 restore maps members back with disconnected=true

### HYPOTHESIS: Bug may be in ROOM_JOINED payload on rejoin
When remaining client gets ROOM_JOINED (after themselves rejoining), the members list may not include disconnected members. Need to check if addMember/rejoinDedup sends the FULL members list including offline ones.

Room.ts:171 `this.sendTo(member.id, { type: MSG.ROOM_JOINED, room: this.info(), members: this.allMemberInfo() })` — `allMemberInfo()` at line 304-307 includes ALL members with disconnected flag. This looks correct.

### NEXT STEP: Ask tester for EXACT reproduction + measurement
Need tester's Royal Jungle test output to identify WHERE the member disappears — is it:
(a) server members Map (check via /api endpoint or console log)
(b) persisted room.json (check file on disk)
(c) client-side members array (check via browser console)
(d) render only (member exists but not rendered)

## DEFERRED
- Orphan-req UC backfill (~T203)
- Status-badge design
- CR1 (champagne→traceability rename)
- R20.22 (3-slot pin)

## PROCESS RULES
- NEVER ASSUME — ALWAYS MEASURE
- Gate-before-deploy; match gate to bug physics
- 6-step chain LOCKED
- Don't create tasks — planner owns that
