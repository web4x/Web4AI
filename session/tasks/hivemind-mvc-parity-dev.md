# Task: hiveMind MVC parity — dev branch must equal macos.latest (WODA.prod identical to MacStudio)

**From**: oosh-po (Tron directive 2026-06-24: "make sure WODA.prod has the identical version of hivemind mvc available in dev as MacStudio in macos.latest mode")
**Owners**: oosh-expert (branch sync) → oosh-tester (verify parity)
**Priority**: HIGH
**Status**: OPEN

## Problem
WODA.prod runs `dev`; MacStudio runs `test/macos.latest`. The hiveMind MVC controller stack (hiveMind + claudeCode + otmux) is NEWER on macos.latest. WODA.prod (dev) is behind → operator gets different behavior on the dev box.

## Measured gap (2026-06-24)
| | MacStudio (macos.latest) | WODA.prod (dev) |
|---|---|---|
| hiveMind MVC refs (`session.discover\|registry.refresh\|agents.discover`) | **38** | **25** |
| Latest hiveMind commits | 80fdbd8 DURING_REWIND, d79a4c9 sweep.detect live-bottom, d33d2ea/111e0a0/84898c3 audit, 57cf612 #8/#10 | c05288e TMPDIR, 7d8b58a merge-from-macos.latest, 3a4bfbc sweep.detect scrolled-off |
| Last cross-branch sync | — | `7d8b58a` (merge test/macos.latest into dev + 16 hardcoded-path fixes) |

dev got an earlier merge (`7d8b58a`) but the newest macos.latest MVC work (DURING_REWIND, sweep.detect live-bottom, the session.discover/registry.refresh rewrite from the current session) is NOT on dev.

## The Fix
1. Identify the macos.latest hiveMind/claudeCode/otmux commits AFTER `7d8b58a` not yet on dev.
2. Merge macos.latest → dev (the established workflow per `7d8b58a`; prefer merge over cherry-pick — earlier finding: individual cherry-picks conflict in hiveMind). Re-apply natively on dev anything that conflicts; keep dev's TMPDIR/path-portability fixes.
3. Push dev; on **WODA.prod** `git pull` in `$OOSH_DIR`.
4. Confirm WODA.prod and MacStudio have byte-identical MVC behavior for the controller surface (hiveMind, claudeCode, otmux).

## Acceptance Criteria
- [ ] WODA.prod hiveMind MVC ref count == MacStudio's (38), same for claudeCode.
- [ ] `hiveMind status`, `resolve`, `agent.send`, `teams.save/restore`, `session.discover`, `registry.refresh` behave identically on WODA.prod (dev) and MacStudio (macos.latest).
- [ ] dev's portability fixes (TMPDIR, id_ed25519, path) preserved — no regression from the merge.
- [ ] Tester: diff the controller method surface (`grep` method signatures) dev vs macos.latest → zero MVC divergence.

## Report-back (edit here; report to oosh-po)
- Expert (merge + push + WODA.prod pull + commit):
- Tester (parity diff result):
