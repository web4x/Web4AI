# S37 slice-1 gate — SPEC (robbin-tester, 2026-08-17; build when req mints + expert builds)

**Task/pin:** S37 real-time MVC, sprint `b86b53cc` / task `ae01f065`. Slice-1 routes **~15 write sites** through the
controller seam (`UnitController.apply` — the SOLE mutation entry I gated in T37.4.2: validate→apply→persist→emit).
HIGH blast radius. This gate is mine. Two ACs:

## AC-1 — real-time MVC: a write through ANY path appears in ITEM + DETAIL views, NO reload (pixel @390)
A change made through any of the ~15 write paths → routes through `UnitController.apply` → emits `UNIT_CHANGED`
(view-bus `emitUnitChanged`, R37.12) → BOTH the **item view** (tree/list node) AND the **detail view** (drawer)
reflect the new value **live, without a page reload**.
- GATE: real **WebKit @390** (Tron's device — NOT chromium; `import { webkit }`), **PIXEL** screenshot, **never DOM-count**
  (per my banked doctrine + rule #6). Before/after a real write via a controller path → assert the changed value is
  visible in BOTH views, no reload fired.
- Drive a REAL write through a controller action (not a synthetic setAttribute). Pollution-safe: reversible write on a
  scratch/system-test unit, or route-intercept the persist and drive the emit → view update; restore after.
- Non-vacuous: assert the value CHANGED (before ≠ after in both views), and that NO `location.reload`/navigation happened.
- ★ **PIN-CORRECTNESS (PO FYI 2026-08-17) — the CurrentSprint pin (Tron's live complaint) is one of the routed writes.** A LIVE-BUT-WRONG pin passes a naive liveness test. R40.18 derivation as first designed returns the SAME stale "current" (stored pin → 37.4 which is merely PLANNED; "first non-terminal in order" is ALSO 37.4) → architect is re-ruling the predicate. So the pin AC must assert the pin reflects the task **actually IN PROGRESS** (status == In Progress), not merely that it re-renders live. Gate the VALUE (which task), not just the liveness. Confirm the re-ruled predicate before asserting.

## AC-2 — binding lint: no-write-outside-the-seam + STUB-MUST-FAIL
Static/AST lint: NO code mutates a unit's model/status outside `UnitController.apply` (all ~15 sites route through it).
Same family as `check-controller-dominance` (MvcBoundaryGuard). 
- STUB-MUST-FAIL: plant a write that BYPASSES the seam (direct `idx.put` / direct `model.x=` outside apply) → lint RED.
  A lint that can't go RED proves nothing.
- ★ Apply the comment-match doctrine: the lint must read PARSED/AST or comment-stripped source, never a raw grep that a
  comment could satisfy (my scanCode lesson).

## Standing doctrine to apply
- Phantom-guard served==committed FIRST. @390 real-WebKit for the visual half; logic/lint half can be node.
- stub-must-fail on BOTH halves (AC-1: assert a write that DOESN'T emit → views stale → gate RED; AC-2: bypass → RED).
- Name the family (MVC / real-time-view-drift / single-writer). Split any device-only AC to Tron @390.
- Builds on T37.4.2 chain (UnitController.apply b5f72641, emit 6b03b619). PENDING req mint + expert build of slice-1.
