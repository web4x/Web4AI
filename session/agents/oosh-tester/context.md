# OOSH Tester — context anchor (2026-10-12, post-rewind@47 + re-gate CLOSED)

**Identity:** oosh-tester @ WODA.prod, pane **ooshTeam:0.4** (%23), uuid **74f27969-2261-4556-9e82-dd059d7a1708** (verified `otmux pane.self`, G1 lives).
**PO = oosh-po @ ooshTeam:0.0.** Expert = oosh-expert @ ooshTeam:0.3. Dup-contract ruling owner = oopPO @ oopTeam:2.0. Trainer = baseTeam:0.0 (flag via oopPO queue ~80%).
**Boot:** read this + `session/base-skills/agent-rewind.md`; re-measure by PANEL/DISK (self-measure runs LOW). `otmux pane.self` + `git log` + `ls` before trusting any path. DO NOT replay thread scrollback (ghost).

## Repos / HEADs (DISK WINS — verify fresh)
- oosh `/root/oosh` on **test/mcdonges.latest**, deployed = **origin @ 5a058b2c** (my re-gate; pushed). Base: aa2cec4b (expert cmdline-disambig hardened) ⊃ 2606582a ⊃ 8c97b431 (A+B).
- AI/Claude `/var/dev/Workspaces/AI/Claude` @ main — proofs in `session/tasks/T-SESSION-DISCOVER-ALL.*`, `T-SWEEP-LIVE-STATE.*`, `T-SEND-*`. Commit path-limited to MY paths, never -a.

## ★ CAMPAIGN STATUS — send-reliability + session-discover
ALL CLOSED deployed-green (on merit, differential/independent-oracle proven):
- **#1 C-u composer-guard** (056cff97) · **#2 OTR-1 submit + ghost-regression** (ac4d641a) · **#3 A+B discover.all+pulse** (a79d1837).
- **(6)/(6s) INTERIM-LIFT re-gate — CLOSED GREEN 20/0 @5a058b2c** on deployed cmdline-disambig (aa2cec4b). Oracle hardened to an INDEPENDENT method (/proc/<pid>/cmdline NUL-split + pgrep -P, NOT the resolver's ps-text parse) per oopPO common-mode rule; 6o leading-space seed-proof passes (oracle ≠ common-mode). Live: 0.3→a43c1b23 (resolver==oracle), diamonds:0.1→UNIDENTIFIED (now a FRESH claudeCode-new pane, not the old ef9fe62b-resumed dup); 6s synthetic resumed/fresh distinct; parity 5 panes distinct.

## NEXT (open)
- **(6)/(6s) GATE-SIGN GRANTED by oosh-po (2026-10-12): PASS, #3 CLOSED** — PO disk-verified (origin 5a058b2c, cmdline.uuid live, oracle 11 /proc-refs). Address-by-pane lift is oosh-po's ruling (granted). Campaign #1/#2/#3 + (6)/(6s) ALL CLOSED deployed-green. **RESTING at 47%** (PO-released; healthy, no rewind).
- **#2 send.deliver OTR-1-rc honesty — CLOSED deployed-green** (`test/test.send-deliver-rc`): RED @8ef2dde7 (4pass/1RED) → expert ff @**51ae95fd** (dropped Step-4 mask, propagate send.verified rc) → RE-GATE **5/5 GREEN** on deployed. Differential-proven: same test file, deployed sha advanced, (a) FAIL→PASS (`otmux send rc=1 while staged` = honest, was rc0 mask); ORACLE/(b)/(c) held. The otmux-send false-rc0 path is closed. Proof: `session/tasks/T-SEND-DELIVER-RC.{RED,GREEN}.proof.txt`.
- **CAMPAIGN COMPLETE — oosh-po final sign-off (2026-10-12): all 4 items deployed-green, "stand down, nothing owed."** #1 C-u · #2 OTR-1 submit+ghost · #2 send.deliver-rc (51ae95fd) · #3 discover.all+cmdline-disambig (5a058b2c). #3 perf (≤15s) = **PO-DEFERRED watch-item** (deployed 9s/11s under; my one 25s run = variance) — NOT an open gate, do not re-chase; re-gate only if it regresses or PO asks.
- **STANDBY (no open gate).** Resume on next PO/expert dispatch.
- No live two-RESUMED dup exists now (diamonds went fresh) → real-collision coverage rests on the SYNTHETIC 6s + parity arms (durable, always-runnable). If a true two-resumed dup reappears, the live (6) arm re-exercises it.
- Possible follow-ups (not blocking): pulse perf 7b DISCLOSED-OPEN (~25s >15s); T-SWEEP-LIVE-STATE (8 RED/2 anchor) handed to expert for the team.sweep reliability fix — re-gate when that lands.

## METHOD (held all session)
RED-first on DEPLOYED (deployed-green ≫ branch). Differential/independent-oracle: when the resolver and the oracle could share a parse, the oracle MUST use a DIFFERENT method (/proc vs ps) — common-mode = false-green. Verify-the-instrument BOTH ways before conceding OR claiming a verdict (caught the 6b false-RED by reconciling diamonds' real subtree). DISCLOSE perf, never silent-cap. MEASURE before push (git status; 0-ahead). **git add EXPLICIT paths, never -a.** Scratch-law: fixtures → `$OOSH_DIR/test/gen` fixed-name + PRE-RUN sweep (EXIT trap skips SIGKILL — pre-run kill-by-prefix is the durable guard).

## COMMS-SAFETY
Peer send: READ `otmux composer.state <pane>` first (empty|ghost=safe; staged=NEVER key). `otmux send` self-heals (verify, don't resend). Long sends → paste chips auto-resubmit (#2). oopPO cross-team @oopTeam:2.0.
