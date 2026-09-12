# INC-7 orphan provenance classification (PO data-safety, before any delete) — v0.8.222, 2026-09-12

48 orphan units (location → a room that no longer resolves), across 26 gone-rooms. Classified by parent-room
provenance against the committed 09-09 enumeration (lobby-enumeration-2026-09-09.txt). Membership/provenance-filtered.

## SPLIT
- **① TEST-DEBRIS = 45 units / 25 rooms — SAFE to remove.** ALL SystemTester-owned test rooms I deleted 09-09
  (T3720 reparent/move/folder-drop/render-distinct, SEATBELT-PROBE, T3721 revisit, T3741 node-drop, DnD-tail confirms).
  These are my own gate leftovers; deleteRoom removed the room dirs 09-09 but left the child units orphaned.
- **② REAL-ROOM ORPHANS = 0.** ★ Nothing Tron wants is in the orphan set — no real-owned room's content is orphaned.
- **③ EVIDENCE = 3 units / 1 room — PO DECIDES (re-home/surface, NOT auto-delete):**
  room **a16262b8 "System Evidence — T37.21 Screenshots"** → units **b7e22e2c, f3edf45e, c3e226c5** (incl. 1 Image).
  ⚠ a16262b8 was flagged KEEP (restored-9 evidence, SystemTester-owned) on 09-09 but the ROOM now does NOT resolve
  (appears deleted since 09-09). Its 3 screenshot-evidence units are orphaned. Do NOT sweep into the delete count —
  surface for a re-home/keep decision. (Also: verify whether a16262b8 the room was deliberately deleted or lost.)
- **④ UNKNOWN = 0.** Every gone-room is in my 09-09 record — no mystery/foreign rooms.

## ACCEPTANCE FOR INC-7 DELETE (given this classification)
- The 45 test-debris orphans → INC-7 may clear (safe; pre-image + footprint guard = reversible floor).
- The 3 a16262b8 evidence units → HELD for PO decision; NOT deleted with the debris.
- Post-delete: orphans (test-debris) = 0, evidence untouched-or-re-homed, NO live member touched (membership-filter).

## a16262b8 INVESTIGATION CONCLUSION (PO-escalated data-loss check) — git-proven
- DELIBERATELY DELETED by MY OWN 09-09 cleanup commit 4270d0043 (present at 4270d0043~1, absent at 4270d0043). NOT a vanish.
- ROOT: a16262b8 is SystemTester-owned (ce981242); the 09-09 delete SELECTION was owner-based (sweep SystemTester test rooms) → it MATCHED and was swept. KEEP was an ANNOTATION in notes, NOT a hard exclusion wired into the selection. The other 2 flagged-KEEP rooms (3231db71 owner=Tron, edd7fa61 owner=Marcel) survived only by owner-distinctness (coincidence, not KEEP-enforcement).
- SEVERITY: RECOVERABLE — room container in git (4270d0043~1); the 3 evidence units (b7e22e2c/f3edf45e/c3e226c5) SURVIVED as orphans (on disk). Evidence content not lost.
- RELATION TO INC-7: not deleteRoom (a no-op) — my deliberate git-rm; but deleteRoom-brokenness forced the hand-sweep where KEEP-exclusion failed. INC-7 delete must honour an ENFORCED keep-set.
- FIX: a keep-set must be a HARD EXCLUDE-LIST checked in the delete SELECTION before any owner/type filter — never an annotation. Recommend recover a16262b8 + re-home its 3 evidence orphans.
