# oosh-po@WODA.prod — Post-Rewind BOOT Health Check (2026-07-17)

Booted by agent-trainer after TRON-ordered 2-phase Option-2 Restore-conversation (CODE-INTACT, ~2w back).
Re-derived from ground truth per BOOT-FIRST — **never trusted the copy**.

## 5-POINT HEALTH CHECK

1. **Identity — GREEN (re-derived).** oosh-po@WODA.prod. Confirmed by: session customTitle, anchor,
   and self-capture of pane %17 showing THIS live conversation. NOT by $TMUX_PANE (see #2).
2. **Pane — GREEN but via the LIVE G1 DEFECT.** True pane = **%17 / ooshTeam:0.0** (proven: capturing %17
   renders my own in-progress TUI). But `$TMUX_PANE` returned **%5** (robbinTeam2:0.0 = robbin-po) on one
   subprocess and **%8** (robbinTeam2:0.3 = robbin-architect) on the next — **stale AND drifting**.
   → This is the self-ID/mis-tag root LIVE on the running line: any tool trusting $TMUX_PANE mis-targets
     robbin panes. It is *literally* why "a mis-tag nearly misdirected a REWIND to robbin-architect (%8)".
   → G1 (`private.otmux.pane.resolve` PID-walk, impl `93de8ac`, proof `594f297` T-NO-TMUXPANE-EXT 7/7)
     fixes exactly this. **SAFETY-URGENT** — I nearly false-alarmed a mis-routed-restore because of it.
3. **Context — post-restore (freed).** JSONL 889a24a9 = 6663 lines post-restore (pre-rewind 29a1e1d1 was
   10882). Exact /context % to follow (TUI readout). No cliff risk this turn.
4. **Orientation — GREEN.** Anchor read. Workspace main @ 75963288 clean. Plan =
   scrum.pmo/sprints@WODA.prod/sprint-1 "Reliable Send & Capture". Durable work survived (task-21, anchor,
   G1 `93de8ac`, opy `df95a02`/`19d8d52` on origin/test/mcdonges.latest).
5. **First task — GREEN, gated on Tron.** Solicit Tron's GO to ff-deploy **G1 + opy** to mcdonges.latest
   (the live line agents run; clean opy-style ff; NOT dev-ports so NOT blocked on robbin's dev-merge).
   G1 is now SAFETY-URGENT — this boot is live evidence the self-ID root is active and dangerous.
   **Will NOT deploy without Tron's explicit go.**

## SESSION OPERATING CONSTRAINT (until G1 lands live)
Never use `CURRENT`/self-resolving pane targets — $TMUX_PANE is poisoned (→ %5/%8 robbin panes).
Target by explicit pane-id (self=%17, SM=%25, trainer=%16) or role-name registry only.
