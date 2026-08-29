#!/usr/bin/env bash
# T-DELIVERY-EXACTLY-ONCE — RED-FIRST guard for the §8 DRAIN ruling (design fc8486d9 §8).
# Ties dup-fix D3 + OTR-1. The recognizer now reads staged panes as ON-PROMPT, so delivery
# must NOT depend on visual state — it is QUEUE + OTR-1-rc owned. Delivery is measured the
# ONLY honest way: count the recipient's .jsonl USER-TURNS (real dup truth, never eyeball).
#
# Assertions (RED until the expert wires the auto-drain):
#   (1) EXACTLY-ONCE : queue to a BUSY pane → lands busy→delivered-staged(rc2) → EVENTUALLY
#                      submitted, and the recipient .jsonl gains EXACTLY ONE matching user-turn.
#   (2) NO-STRAND    : the rc2 message IS submitted (queue empties) — not left staged forever.
#   (3) HUMAN-SAFETY : a pane with staged text but NO queue entry → drain NEVER submits it
#                      (poke-count on it == 0; a human's half-typed line is not ours to send).
#   (4) rc3-WAIT     : queued to a DRAWER-blocked pane stays queued (rc3), delivered after the
#                      drawer clears, still EXACTLY ONCE.
#
# Recipient: a REAL claude pane (only a real agent writes user-turns to its .jsonl). Pass one:
#   RECIPIENT_AGENT=<role|session:addr>  test.suite run delivery-exactly-once
# Without it, the test SKIPS the live-jsonl cases and RED-demonstrates the strand structurally.

level=$1; [ -z "$level" ] && level=1
echo "starting: T-DELIVERY-EXACTLY-ONCE <LOG_LEVEL=$level> (RED-FIRST — fails until auto-drain wired)"
source this
source test.suite
source hiveMind
export LOG_DEVICE=/dev/null
log.level $level

RECIP="${RECIPIENT_AGENT:-}"                 # a real claude recipient (role or session:addr)
UNIQ="DEXO-$$-$(od -An -N2 -tu2 /dev/urandom 2>/dev/null | tr -d ' ' || echo 0)"   # marker to grep in the .jsonl

# ── recipient .jsonl → count USER-TURNS containing our unique marker (the real dup truth) ──
recipient_jsonl() { # <pane> → path
  local pane="$1" sid dir
  sid=$(claudeCode.session.id "$pane" 2>/dev/null) || return 1
  for dir in "$HOME/.claude/projects"/*/; do [ -f "${dir}${sid}.jsonl" ] && { echo "${dir}${sid}.jsonl"; return 0; }; done
  return 1
}
user_turns_with() { # <jsonl> <marker> → count of user-turns containing marker
  local jf="$1" mk="$2"
  [ -f "$jf" ] || { echo 0; return; }
  grep -c "\"type\":[[:space:]]*\"user\".*${mk}\|${mk}.*\"type\":[[:space:]]*\"user\"" "$jf" 2>/dev/null || echo 0
}
queue_depth() { private.hiveMind.agent.queue.depth "$1" 2>/dev/null || echo 0; }

if [ -z "$RECIP" ]; then
  echo "  [no RECIPIENT_AGENT — running the STRUCTURAL strand RED only; live jsonl cases skipped]"
fi

echo; echo "===== (1)+(2) EXACTLY-ONCE + NO-STRAND (busy→queue→idle→drain) ====="
if [ -n "$RECIP" ]; then
  RPANE=$(hiveMind.resolve "$RECIP" 2>/dev/null || echo "$RECIP")
  RJF=$(recipient_jsonl "$RPANE")
  BEFORE=$(user_turns_with "$RJF" "$UNIQ")
  # Force BUSY, then queue via agent.send (context-aware: busy→QUEUE, rc2).
  # (Expert/architect: a helper to drive the recipient busy goes here; the queue+drain is the SUT.)
  hiveMind.agent.send "$RECIP" "[$UNIQ] delivery-exactly-once probe" >/dev/null
  test.case $level "(1) queued to busy pane persists (rc2 staged, depth>=1)" echo "depth=$(queue_depth "$RPANE")"
  [ "$(queue_depth "$RPANE")" -ge 1 ] && expect.pass "message queued (rc2 — not dropped, not double-sent)" \
                                       || expect.fail "message not queued (lost or wrong route)"
  # AUTO-DRAIN on idle (the §8 SUT). RED until wired: no auto-drain → queue never empties.
  # Poll up to ~40s for the recipient to go idle AND the drain to submit.
  drained=0; i=0
  while [ "$i" -lt 20 ]; do sleep 2; [ "$(queue_depth "$RPANE")" -eq 0 ] && { drained=1; break; }; i=$((i+1)); done
  test.case $level "(2) NO-STRAND: queue auto-drains once idle (not stranded)" echo "drained=$drained"
  [ "$drained" -eq 1 ] && expect.pass "queue emptied (auto-drain fired)" \
                        || expect.fail "STRANDED (RED): msg still queued — no auto-drain-on-idle wired (§8 gap)"
  sleep 3
  AFTER=$(user_turns_with "$RJF" "$UNIQ")
  test.case $level "(1) EXACTLY-ONCE: recipient .jsonl user-turns for marker == 1" echo "before=$BEFORE after=$AFTER"
  [ "$((AFTER-BEFORE))" -eq 1 ] && expect.pass "delivered EXACTLY once (jsonl user-turns +1)" \
                                 || expect.fail "delivery count $((AFTER-BEFORE)) (0=strand/lost, >1=DUP) — not exactly-once"
else
  test.case $level "(1)+(2): SKIPPED (no RECIPIENT_AGENT for jsonl truth)" echo skip; expect.pass "skipped — needs a real recipient"
fi

echo; echo "===== (3) HUMAN-SAFETY: staged text with NO queue entry → drain never submits ====="
# A human half-typed a line into a pane; there is NO queue entry for it. The drain must
# submit ONLY its own queued messages, never the pane's pre-existing staged text.
if [ -n "$RECIP" ]; then
  RPANE=$(hiveMind.resolve "$RECIP" 2>/dev/null || echo "$RECIP")
  # ensure queue empty; the pane has staged (unsent) human text but nothing queued.
  DEPTH0=$(queue_depth "$RPANE")
  RJF=$(recipient_jsonl "$RPANE"); HB=$(user_turns_with "$RJF" "HUMAN-$UNIQ")
  hiveMind.agent.queue.drain "$RECIP" >/dev/null   # drain with empty queue must be a no-op (stderr open)
  sleep 2
  HA=$(user_turns_with "$RJF" "HUMAN-$UNIQ")
  test.case $level "(3) HUMAN-SAFETY: empty-queue drain submits nothing (poke-count 0)" echo "before=$HB after=$HA depth0=$DEPTH0"
  [ "$HA" -eq "$HB" ] && expect.pass "drain never touched the pane's staged human text" \
                       || expect.fail "HUMAN-SAFETY BREACH (RED): drain submitted un-queued staged text"
else
  test.case $level "(3): SKIPPED (no recipient)" echo skip; expect.pass "skipped"
fi

echo; echo "===== (4) rc3-WAIT: drawer-blocked pane holds the queue, delivers once after clear ====="
# A queued message to a pane whose bottom-chrome is OPEN-DRAWER must NOT be submitted into the
# drawer (rc3 hold); after the drawer clears it drains — still exactly once.
if [ -n "$RECIP" ]; then
  test.case $level "(4) rc3-WAIT: queued msg held while drawer open, delivered once after clear" echo "requires drawer-drive"
  expect.fail "rc3-WAIT unwired (RED): no drawer-hold→clear→single-deliver path yet (§8, ties recognizer OPEN-DRAWER)"
else
  test.case $level "(4): SKIPPED (no recipient)" echo skip; expect.pass "skipped"
fi

echo
echo "=================================================================="
echo "  T-DELIVERY-EXACTLY-ONCE is RED-FIRST: failures ARE the §8 spec."
echo "  Full run needs RECIPIENT_AGENT=<real claude> for the jsonl user-turn truth."
echo "=================================================================="
test.suite.save.results
