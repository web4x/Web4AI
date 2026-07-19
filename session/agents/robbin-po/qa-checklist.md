# Sprint 30 — Consolidated QA-Review Checklist (for Tron's batch visual sign-off)

*Assembled by robbin-planner 2026-07-19. **17 tasks for Tron's visual pass** (+ T30.47 already Done via architect+PO internal gate). All served==gated on the LIVE bundle (v0.7.73 for the original 15; **v0.7.76 T30.52 / v0.7.77 T30.51** — both anti-circular ruler-measured at Tron's 390px mobile viewport). Each is gate-GREEN DET-3x + chain-to-Test complete both-directions; what remains is Tron's VISUAL confirm. **S30 3-way-merge-editor + folding wave is CHAIN-COMPLETE — no active builds.** Sign off a whole group in one pass.*

**Base URL:** `https://prod.wo-da.de:4444`  ·  **Served:** v0.7.73  ·  Held at QA-Review per rule#9 (Tron visual → Done).

---

## A. Merge-editor core — verify on `/edit/otmux?repo=oosh&left=HEAD&right=dev&3way=1`

| Task | Feature | What to look for (observable) | Gated |
|------|---------|-------------------------------|-------|
| **T30.9** | Base-aware 3-way merge view | CENTER starts as the base-aware auto-merge (mergeBase of the two refs); non-conflicting changes from either side pre-applied | (in v0.7.73) |
| **T30.35** | Diff coloring by kind + merge-action matrix | Changes colored by KIND (ADD / DELETE / MODIFY / CONFLICT); per-block actions `>>` PutLeft / `<<` PutRight / `x` Remove | v0.7.51 |
| **T30.36** | Diff-nav aids | UP/DOWN nav highlights the CURRENT change **brighter**; an open-change count is shown + decrements on resolve | v0.7.55 |
| **T30.37** | Per-change RESOLVED toggle | Each change has a GREEN CHECKMARK toggle labelled **RESOLVED** (never "commit") | v0.7.55 |
| **T30.38** | Merge Save → diff's repo/branch | Save routes the PUT through the DIFF's repo (e.g. OOSH), current branch — not always rawbin | v0.7.61 |
| **T30.41** | Per-filetype syntax highlighting | A known filetype shows keywords/strings/comments colored correctly in **all three** panes (Local/Center/Repo) | v0.7.65 |
| **T30.46** | Working-file diff (left=latest) | On `…&left=latest&right=dev&3way=1`: LEFT shows the live **on-disk working file** (uncommitted lines visible); edit+Save round-trips to disk; a bare open defaults left=working | v0.7.68 |
| **T30.50** | Merge toolbar | `N selected · X/Y open conflicts` COMPOSE indicator (N = current change, live on nav, keeps the open-count); **✨ Apply All** popup **3 modes** (Non-conflicting only / All-Local wins / All-Repo wins) — each actually drives CENTER; guarded Save: 0 conflicts → saves + button turns GREEN **✓ Saved** (resets to Save on edit); with open conflicts → jumps to next **UNRESOLVED**, no write | v0.7.73 |
| **T30.52** | Toolbar re-layout (mis-click prevention) | On **mobile/390px** after 'Apply All → Repository wins' (N=14): **'14 selected' stays visible INLINE** on the same one-row toolbar as ✨ Apply All + nav (h≈32); 'X/Y open conflicts' sits BETWEEN ▼ and ✓ as a non-clickable buffer so ▼ and ✓ are no longer adjacent (no mis-click). *(Refines R30.50-A; was a wrong-state false-green at N=1, re-gated at Tron's real N=14 state.)* | v0.7.76 |
| **T30.51** | Changes-focused code-folding | Open a 3-way diff with changes: unchanged context is **auto-collapsed on open EXCEPT the change/conflict regions** (which stay expanded); expand/collapse a region **SYNCS across all 3 panes**; a region containing a change **CANNOT be collapsed** (stays open). Monaco setHiddenAreas, K=0 context-margin, chevron affordance. | v0.7.77 |

## B. Repo-manager V1 — verify on the repo selector + manage dialog (`/edit/otmux?repo=oosh`, open the repo dropdown)

| Task | Feature | What to look for (observable) | Gated |
|------|---------|-------------------------------|-------|
| **T30.42** | Add-repository dialog | Repo selector's FIRST option reads **'+ Add repository'**; clicking it opens the add/manage dialog (does not try to load a repo named that) | v0.7.71 |
| **T30.43** | Add repo by local path | The dialog accepts a server-local **.git** path (e.g. `/root/oosh`) → registers it → the new repo APPEARS in the selector + is usable for diffs | v0.7.71 |
| **T30.45** | Manage panel + worktree switch | Manage panel shows the repo's local path, current branch, and its worktrees; selecting a worktree → the center header + diff **track** that worktree's branch (read-only, no checkout) | v0.7.70/72 |
| **T30.49** | Delete a dynamic repo | Delete a user-added repo from the manage panel → it's GONE from selector + registry; builtins (rawbin, oosh) are NOT deletable (affordance absent/disabled) | v0.7.72 |
| ~~T30.47~~ ✓ | RepoRegistry foundation | **✓ DONE** (architect co-sign + PO sign, 2026-07-19 cba448fdd — internal DET-3x gate, correctly not a Tron visual). *Skip — already signed.* | v0.7.71 |

## C. Bug-fixes / deploy

| Task | Feature | Where / What to look for | Gated |
|------|---------|--------------------------|-------|
| **T30.14** | Service-Worker auto-update | On `/app`: after a new deploy, the client auto-updates (polls ~60s + on tab-focus) — 1 reload then auto forever, no manual hard-refresh | v0.7.25 |
| **T30.39** | Deep-link `?repo` seeds both selectors | Open `/edit/otmux?repo=oosh` → BOTH the left AND right repo selectors are seeded to `oosh` on load | v0.7.63 |
| **T30.40** | Center header = actual branch | The center Result header shows the targeted repo's ACTUAL current checked-out branch (resolved dynamically, not hard-coded) | v0.7.63 |

---

### Notes
- **Deferred (NOT in this wave):** D1/D2/D4 security guards + clone-by-URL (T30.44) → R30.48 / BH-3 (re-activate before any exposed/multi-user deploy). V1 repo-manager is single-user/local.
- On Tron sign-off, tell robbin-planner which tasks pass → they flip QA-Review → **Done** (rule#9 satisfied). T30.47 signs via architect+PO (internal), not the visual pass.
- All 16 are on the current served bundle **v0.7.73** (served==gated verified); the per-row "Gated" column is the version each first went GREEN.
