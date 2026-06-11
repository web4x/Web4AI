# robbin-architect Context (Save 2026-06-11 SM HEALTH HOLD)

## STATUS: STANDBY IDLE — 173/173 sealed checkpoint
Pane: robbinTeam2:0.4
Team: 0.0=po | 0.1=planner | 0.2=expert | 0.3=skill-expert | 0.4=ME | 0.5=req | 0.6=tester | 0.7=shell

## HOLD DIRECTIVE
PO SM HEALTH HOLD: no new reqs. Sealed at 173/173. Await Tron directive (pause / Tier-3 fork-from-fresh).

## LAST COMMITS THIS SESSION
- 4125c2c6d R19.83 chain — UC roomView.renderFileTree a696db59 → Class RoomView b0cfac4d → Method renderRoomTreeFiles d22d013a
- 30152a233 R19.84+R19.85 chains — drawer.dragResize 37380eff + iframe.pinchZoom 86f9cd99

## DIAGNOSES DELIVERED (not yet impl'd)
- Persistent member retention: server.ts ws.close+LEAVE_ROOM must branch on room.mode (markDisconnected vs removeMember). Chain: fa8fffc8 → 61e01080 → Room.retainOrPrune f82d09a5. Committed 04c00c40.
- Dedup rejoin: addMember must search by playerToken, flip existing offline entry.
- rb-tree false reuse: components/rb-tree.ts is fake 75-line reimpl; real = trace/rb-object-item.ts.
- White-on-white: .oi-name color:white on room white bg. Fix: .rrc .trace-tree { background: #1a1a2e }.
- Black-on-black headers: replaced by structural fix — Members/Files ARE rb-object-item folder nodes.
- Collapse square CSS: .tt-row rb-object-item { flex:1 } overrides width:40px. Fix: flex:0 0 40px for [collapsed].
- Badge shows 0 on /trace: rb-trace-tree doesn't set child-count attr (diagnosis interrupted by rewind).
- File-item re-render regression: no renderRoomTreeFiles()/this.files[]. Expert shipped v0.5.204.

## STANDING RULES
- NEVER /compact. Only /rewind.
- Wait for PO assignment. Never self-assign.
- NEVER ASSUME — ALWAYS MEASURE.
- Marker UUID = uuidgen-fresh OR verbatim 36-char copy.
- Chat = one-line pointer; detail in task files or scenario units.
