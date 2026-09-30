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
## PENDING
- **PULSE follow-up — `test.pulse-jsonl-lag` RED DELIVERED** (621ef08): scrumMaster.pulse's python
  `ctx_from_jsonl` (scrumMaster:648) shares the same token-math, no content-lag guard → false-LOW
  (400000,40,1000) SIGNALS_LAG=False on a >8 attachment/tool_use reboot window (monitoring misleads
  walling). Gates the REAL extracted python; 2 PASS/1 RED; same differential as test.jsonl-lag.
  AWAITING EXPERT: python return-shape for the lag signal (proposed: 4th lag flag or pct='lag') +
  implements the >8 content-window guard. Lower urgency. Re-gate when it lands.

## DONE (2026-09-30 PO order)
- **ITEM 1 — `test.session-id-fresh`: RE-GATE GREEN-on-merit @4fbb654 → CLOSED.** Planted stale cache
  (00000000-dead-…) → session.id returned LIVE 30a47516… not the stale (deployed now live-first). 2/2.
- **ITEM 2 — `test.jsonl-lag`: DEPLOYED-GREEN 7/7 on merit @a317633 → gap(b) CLOSED.** Widened filter
  (user|attachment|tool_result|tool_use) + my -1249 fixture: (1c) attachment/tool_use→lag + (2) real
  046bbac4 head-1249 (32 content)→lag (both RED on narrow = differential merit); caught-up→fresh (no
  over-trigger); bare unchanged + CONTEXT_SOURCE separate. Committed 8b3dbe9. ENTIRE claudeCode
  rewind-safety cluster CLOSED: session.id(a/fork) + context.check false-LOW + JSONL-lag(b).
  (history below — fix 390325e was INCOMPLETE, real-artifact gate caught it:)
  Deployed `jsonl.lag` counts only user/tool_result/tool; the REAL reboot injection (046bbac4) is
  ATTACHMENT+TOOL_USE dominated → max user/tool window=4 (never>8) so it NEVER fires; content-inclusive
  window=32 (matches the '15-52' calibration). calibration(content) != impl(user/tool); also `"tool"`
  regex ≠ `"tool_use"`. 5 PASS / 2 RED (1c synthetic attachment/tool_use-only + 2 real reboot both
  'fresh'). Hardened test committed+pushed 4addd95. FIX OWED: widen filter to attachment+tool_use.
  GREEN parts: user-window detect, transient caught-up=fresh, from.jsonl signals lag, CONTEXT_SOURCE
  separate + bare unchanged. Re-gate (real+synthetic) when expert widens the type filter.
  RECONCILED (c32ffb8): TWO real issues, both needed — (A) my fixture off-by-one head -1250→-1249
  (the 046bbac4 line-1250 blob holds the CLOSING assistant-usage; file is NOT one-obj/line); (B) the
  filter-widen (branch, NOT deployed — claudeCode:1590 still narrow). Measured head -1249 on 046bbac4:
  NARROW=1→fresh, WIDE(+tool_use+attachment)=32→lag. Neither alone closes (2). Re-gate on DEPLOYED
  after the widen ff's → -1249 + widened = 32→lag = 7/7. Gate HELD.
- (superseded) earlier ITEM 2 note: from.jsonl reads last
  assistant-usage; big un-recorded window after it → false-safe number, no lag signal → walling drive.
  2 RED / 2 anchor. AWAITING EXPERT COORDINATION: (a) lag-detector name (proposed
  `private.claudeCode.context.jsonl.lag` → lag|fresh); (b) STRUCTURAL threshold (content-after-last-
  assistant-usage, not a byte guess); (c) real repro jsonl (oopTeam:0.0). Contract: separate lag field,
  BARE output unchanged (pulse/views parse it), defer-to-panel, remaining-convention. Hardens pulse.
  CONFIRMED by oosh-po: interface name ACCEPTED, threshold = ENTRY-COUNT after last assistant-usage.
  Repro = 046bbac4-...jsonl. GATE-INTEGRITY: lag is TRANSIENT — the CURRENT repro CAUGHT UP (1 entry
  after last usage now) → gating it as-is FALSE-PASSES. Real lag-moment IS in its history: 46-entry
  window after line 1203 → RECONSTRUCT via truncate to line 1250 for the real-artifact re-gate. My
  synthetic 40-entry ≈ real 46 (representative). Re-gate when expert lands the entry-count fix.
- On new work: RED-first on DEPLOYED, gate the LIVE/prod surface with REPRESENTATIVE fixtures, prove
  green is CAUSED BY the fix (differential+functional), flag semantics don't guess.
  **FLAG oosh-po at ~88% BEFORE any heavy step** (prevent-wall rewind).
- Standing flag (not mine to fix): MEMORY.md near its 24.4KB read-limit → ARON (canon owner) compaction.

## Test harnesses (committed session/tasks/*.RED): sweep-live-state, view-agree, delivery-exactly-once,
## zoom-target, session-id-fresh, composer-state. Runnable copies in /root/oosh/test/.
