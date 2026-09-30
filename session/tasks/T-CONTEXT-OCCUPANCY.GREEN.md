# T-CONTEXT-OCCUPANCY — DEPLOYED-GREEN verdict (oosh-tester, 2026-09-30)

**Defect (oopPO, rewind-safety):** `context.parse` on a /context PANEL read a FALSE-LOW — Pattern-4 grabbed the Suggestions `Bash results using Nk tokens (17%)` instead of occupancy → a 54%-used agent read 17% remaining → looked healthy near the wall.

**Fix:** `001011d` (ff'd 9625199..001011d, pushed). Correct-by-construction: Pattern-2 matches ONLY the occupancy total line `Nk/Mm tokens (P%)` via the `/Mm tokens` **denominator** (unique to the total line → structurally excludes the Suggestions line and every per-category line), returns `100−P` (REMAINING, decimal-aware). Pattern-4 (bottom-10 first-%) + "any context.*%" DROPPED; no blind fallback (rc1→unknown, JSONL primary).

## GREEN-ON-MERIT — 4/4 on deployed @ 001011d
- (1) `parse(panel)` = **46** (100−54), not 17/54/6 ✓
- (2) hard invariant: none of {17 trap, 54 used, 6/4 decimal-bug} ✓
- (3) anchor `Context left until auto-compact: 42%` → **42** (Pattern-1 unregressed) ✓
- (4) DEPLOYED end-to-end `read.tui`(rendered panel) → **46** ✓

## Merit (not a lucky constant) — the output TRACKS the occupancy input:
| occupancy used | parse→ | remaining | trap 17 present |
|---|---|---|---|
| 54% | 46 | 46 | ignored |
| 80% | 20 | 20 | ignored |
| 12% | 88 | 88 | ignored |
| 53.6% (decimal) | 46 | 46 | ignored |

Plus the differential (the identical panel returned **17 pre-fix**, **46 post-fix**) and the structural exclusion (denominator). Fixtures pre-run-swept → 0 orphans.

**→ context.check defect CLOSED.** Semantic = REMAINING (oosh-po ruling), pinned + verified.
