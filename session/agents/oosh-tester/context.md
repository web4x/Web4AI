# OOSH Tester — context anchor (2026-09-30, near-alarm insurance save @~78%)

**Identity:** oosh-tester, WODA.prod. **PO = oosh-po @ ooshTeam:0.0** (post-rewind, own-PO).
Boot: read this + `agent-rewind.md`; re-measure fleet by PANEL; re-derive DISK-first.

## Comms-safety (CRITICAL, fleet C-U bug)
- Peer comms: **`send.raw`** (types, no C-u) → **`send.tui <t> Enter`** (submit) → verify by CAPTURE.
- **READ `otmux pane.capture.visible <t>` FIRST**; NEVER key a pane whose composer is `staged`
  (plain `send`/`send.verified` fire C-u = DESTROY staged text; `send.raw` append also corrupts).
- The branch `otmux composer.state <pane>` (empty|ghost|staged) is the safe classifier.

## Commit hygiene (LAW v2, both repos)
- ONLY `git commit -m MSG -- <my/paths>` (ignores index, no peer ride). VERIFY `git show --stat`=mine.
- NEVER `git add -A`/`.`/glob, NEVER bare `git commit`, NEVER `git reset HEAD` on a SHARED tree.
- New files: explicit `git add <mine>` first, then path-limited commit.

## §7/§8 gate work — DONE + pushed (durable)
- §7 PART A recognizer GREEN (8fdf1a7); Parts 2+3 pane.live parity GREEN.
- §7 Part 4 VIEW-AGREE: 2/3 on merit vs a8f33ad (Part-4a=team.sweep only); **VA2 RED** =
  team.context.status still parse-fails, NOT repointed (Part-4b pending). Proof dd15a5b3.
- §8 T-DELIVERY-EXACTLY-ONCE: RED harness parked (runs green when drain wires + RECIPIENT_AGENT).
- OOSH defect gates GREEN ON MERIT: #1 session.id LIVE-first (f94c22d, 2/2, proof 3a3752c3);
  #2 composer.state (b905d95, 4/4, proof de771e24 — heeded this:199 OOSH_DIR-pin caveat via HOME→branch symlink).

## CURRENT TASK (2026-09-30, PO order)
Scenario-first FAILABLE RED for otmux DEFECT #1 on **DEPLOYED /root/oosh/otmux** (NOT a branch):
- (a) `otmux zoom <target>` sets `#{window_zoomed_flag}==1` on the TARGET pane (assert the FLAG,
  never exit code) + unzoom/toggle. Deployed zoom:501 is bare (`resize-pane -Z`, no -t) → RED.
  Reuse/refine `test/test.zoom-target` (already RED-proven).
- (b) usage-derived-dispatch: DERIVE method list FROM otmux's usage block, assert each advertised
  method DISPATCHES (defined). pane.zoom/selectWindow/selectPane = advertised-but-undispatched → RED.
  No hand-kept list.
- Both RED path-limited + push. Report RED set. #2 composer.state follows.
- **FLAG oosh-po at ~88% BEFORE any heavy step** — it arranges a prevent-wall rewind (don't wall).

## Test harnesses (committed session/tasks/*.RED): sweep-live-state, view-agree, delivery-exactly-once,
## zoom-target, session-id-fresh, composer-state. Runnable copies in /root/oosh/test/.
