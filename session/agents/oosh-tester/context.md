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

## CURRENT STATE (2026-09-30 — CAMPAIGN COMPLETE, queue clear, awaiting next assignment)
All three deployed-green ON MERIT (RED-first → expert fix → re-gate), verdicts committed:
- **otmux DEFECT #1** — `test.zoom-target` 4/4 (zoom `<target>` flag on named pane) + `test.usage-dispatch`
  4/4 (usage-derived, 0 undispatched). Deployed @677abcf.
- **otmux DEFECT #2** — `test.composer-state` 7/7 @56bceb6. I CAUGHT a live false-green: synthetic
  EMPTY fixture passed but a LIVE empty composer pads with NBSP (U+00A0) after ❯ → old code false
  'staged'. Re-hardened with representative NBSP fixtures (d4b401c); differential merit proof.
- **context.check false-LOW** (rewind-safety) — `test.context-occupancy` 4/4 @001011d. /context PANEL
  parse grabbed Suggestions '(17%)' not occupancy → false-LOW. Semantic = REMAINING (oosh-po ruling),
  pinned 46. Merit: output TRACKS input (54→46/80→20/12→88/53.6→46) + differential + structural.
- Verdicts: `session/tasks/{T-OTMUX-DEFECT-GATE,T-CONTEXT-OCCUPANCY}.GREEN.md`. Tests on
  test/mcdonges.latest (pushed). At ~60% ctx, runway fine.
- **NEXT:** no assignment queued. On new work: RED-first on DEPLOYED, gate the LIVE/prod surface with
  REPRESENTATIVE fixtures (not synthetic), prove green is CAUSED BY the fix (differential+functional),
  flag semantics don't guess. **FLAG oosh-po at ~88% BEFORE any heavy step** (prevent-wall rewind).
- Standing flag (not mine to fix): MEMORY.md near its 24.4KB read-limit → ARON (canon owner) compaction.

## Test harnesses (committed session/tasks/*.RED): sweep-live-state, view-agree, delivery-exactly-once,
## zoom-target, session-id-fresh, composer-state. Runnable copies in /root/oosh/test/.
