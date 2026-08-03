# robbin-po fresh-me anchor — Sprint 34 (2026-08-03, pre-rewind @81%)

**BOOT: DISK-WINS. Verify identity (otmux pane.self, NOT $TMUX_PANE). Re-derive from git HEAD + served + the S34 board — my sends GHOST (S-9), verify HEAD/served myself, never trust a relayed number.**

## CURRENT (git-derived, verify): Sprint 34 = MDA-tree-refine (Tron IMG_4815-4819 "retain/protect/tweak the tree"), prod served v0.8.43, repo /var/dev/Workspaces/web4x/Web4RawBin. Team robbinTeam2 0.0-0.6, SM=ooshTeam:0.1, trainer=baseTeam:0.0.

## S34 BOARD (7 tasks, cluster map)
- R-A = T34.1 (A1 Scenario/Edit universal) + T34.2 (A2 File/Folder real scenario types)
- R-B = T34.3 (add-folder/remove/delete-warn) — **DONE**
- R-C = T34.4 (remove-from-diagram) — **DONE**
- R-D1 = T34.5 (auto-expand-on-navigate) — **DONE**
- R-D2 = T34.6 (element-actions class-select) — **DONE**
- R-E = T34.7 (universal action bar on ALL 7 drawer usages)

## ★ POST-REWIND BOOT (2026-08-03, deep rewind from 81%, LAYOUT-B option-1, CODE-INTACT): re-measured disk = v0.8.44, HEAD 15ebcdbae. Ghost-context caught (Sprint-31 thread was ancient). S34 NOT yet complete — 3 threads open (below). DROVE the idle-stall: architect A2-restart (via SM relay, my direct GHOSTED), expert A1-mint, tester A2+R-E gates. [[ghost-context-after-deep-rewind]]

## IN FLIGHT (pick up here)
1. **R-E/R34.7 + R-A A1** (universal action bar) — BUILT + LIVE v0.8.43 (expert f28939b41, architect served-verified). Mechanism: RbDetailDrawer.universalActionBar (impl ffd44b17) sets ◆Scenario/✎Edit default itself on every detail render + registerActionProvider hook; model host registers actionsForContext via hook. Present in all 6 drawer bundles = universal by construction. **TESTER WebKit @390 GATING NOW** (bar on /trace,/scenario,in-room,/server-manager,feature-manager; /model unregressed; empty clears) → on GREEN planner flips T34.7+T34.1 → Done (6/7).
2. **R-A A2/T34.2** (File/Folder as real ior:class:Folder/File units) — fork-LOCK A confirmed (architect 8e92f6817: tree/mofChildren node-refs STAY dir:/file: BYTE-unchanged, resolver mints MODEL_STORE units keyToUuid, prod-untouched — PROTECT THE TREE). **req MINTING the A2 chain** (was useCases:[]; expert can't self-mint #126) → expert builds resolver path → commits v0.8.44 → architect A2 restart + backstop → tester WebKit gate → planner flips T34.2 → Done (7/7 = S34 COMPLETE).

## PROCESS — UNCHANGED (Tron 2026-08-03 explicit): scenario-first → architect design → req formalize/mint → expert build → **tester real-WebKit @390 SELF-GATE (Safari 605.1.15, Tron's engine, node22+playwright webkit viewport390, test/visual/REAL-WEBKIT-GATING.md)** → planner flips on WebKit-GREEN + chain-complete-to-Test (Impl.tests[] non-empty). **Tron is a spot-checker by CHOICE, never a required gate** (his "when I am the bottleneck YOU are wrong" fix). Client-only→client-live on deploy; server-side→boundary restart (architect, remoteShells:0.2, R31.7 invariant served==committed==SW==HEAD + tree-clean).

## PARKED / open (do NOT touch)
- multi-owner ServerManagerGuard WIP = git-stashed/parked (architect e4285b559), separate Tron-item — leave untouched, sacred gate single-owner for S34.
- R33.4 deferred big-rock.
- plantuml render docker: UP on WODA.prod:8089 (provision-plantuml.sh reproducible). BUG-A/B closed.

## FLEET CONTEXT (self-manage): rewinds at CLEAN boundaries only; VERIFY tree-clean (git status) before declaring zero-WIP (I missed this once, trainer caught +25 lines). SM reports idle-roster + climbers; idle-HOLDING (checkpoint/reactive) ≠ idle-awaiting-dispatch. Agent-down check = ps + pane.capture.VISIBLE (not -S scrollback) + pane height (h=1 collapse fakes dead). ~30 rewinds this campaign, 0 reverts. My lean-floor ~45% (front-loaded read-bloat won't shed on rewind; fork = real <40% lever, Tron's call).
