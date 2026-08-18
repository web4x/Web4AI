#!/usr/bin/env bash
# T-SWEEP-LIVE-STATE — RED-FIRST guard for the team.sweep RELIABILITY fix (Tron directive).
# Scenario-first: this test FAILS on the CURRENT broken sweep and DEFINES the acceptance.
# Expert implements the architect's recognition patterns until this is GREEN.
#
# CANONICAL LIVE-STATE VOCABULARY (Tron directive — reconcile exact label strings with the
# architect's recognition-pattern design; the SEMANTICS below are the contract):
#   IDLE        — auto-mode status bar, nothing staged, agent waiting, done
#   ACTIVE      — generating/running ("esc to interrupt")
#   ON-PROMPT   — text STAGED at ❯, waiting to submit (NOT idle — has pending input)
#   OPEN-DRAWER — permission / menu / picker / accept-edits box OPEN = BLOCKED (NOT idle)
#   ON-WALL     — context-wall / auto-compact prompt ("Context low (0% remaining) · Run /compact")
#   LOW-CONTEXT — ⚠ high ctx (e.g. "Context low (N% remaining)" with small N, not yet the wall)
# Cross-cutting:
#   REGISTRY-CURRENT — no stale entries; every registry pane hosts the live session it claims
#   SINGLE-SOURCE    — team.sweep and team.context.status AGREE per pane (no view-drift)
#   CONTEXT-SOURCE   — context% comes from the WORKING from.jsonl reader, never capture-parse-fail

level=$1; [ -z "$level" ] && level=1
echo "starting: ${BASH_SOURCE[@]##*/} <LOG_LEVEL=$level> (RED-FIRST — expected to FAIL on current sweep)"
source this
source test.suite
source hiveMind      # need private.hiveMind.sweep.detect (safe: start skips scan when sourced)
export LOG_DEVICE=/dev/null
log.level $level

HAVE_TMUX=0; [ -n "$TMUX" ] && HAVE_TMUX=1

# ── fixture: plant a pane rendering a given TUI screen (bottom lines = the state signature) ──
FX_SESSIONS=""
plant() {   # <tag> <line1> <line2> ...  → echoes the fixture pane target
  local tag="$1"; shift
  local s="fx_${tag}_$$"
  tmux kill-session -t "$s" 2>/dev/null
  tmux new-session -d -s "$s" -x 200 -y 8 2>/dev/null || { echo ""; return 1; }
  FX_SESSIONS="$FX_SESSIONS $s"
  # Build a printf that renders the screen then holds it with `cat` (screen persists for capture).
  local scr=""; local l
  for l in "$@"; do scr="${scr}${l}\n"; done
  tmux send-keys -t "$s" "clear; printf '%b' '${scr}'; exec cat" Enter 2>/dev/null
  sleep 0.4
  echo "${s}:0.0"
}
cleanup_fixtures() { local s; for s in $FX_SESSIONS; do tmux kill-session -t "$s" 2>/dev/null; done; }
trap cleanup_fixtures EXIT

# The canonical target-state a screen SHOULD resolve to, via the (to-be-fixed) recognizer.
# We read the CURRENT recognizer's verdict and assert it equals the canonical target.
detect_state() { private.hiveMind.sweep.detect "$1" 2>/dev/null | cut -d'|' -f1; }

# Assert that the recognizer maps a planted state-screen to the canonical live-state.
# RED NOW: the current 18-state model has no ON-PROMPT/OPEN-DRAWER/ON-WALL/LOW-CONTEXT
# as the canonical single vocabulary, and collapses several to "idle".
assert_state() {  # <caseName> <fixturePane> <canonicalExpected> <acceptable-current-regex>
  local name="$1" pane="$2" want="$3" okre="$4"
  local got; got=$(detect_state "$pane")
  test.case $level "$name: screen → canonical '$want' (got '$got')" echo "$got"
  if echo "$got" | grep -qiE "$okre"; then
    expect.pass "recognized as $want (current='$got')"
  else
    expect.fail "MISCLASSIFIED: want $want, current sweep='$got' (RED — recognizer gap)"
  fi
}

echo; echo "================= PART A — LIVE-STATE RECOGNITION (fixtures) ================="
if [ "$HAVE_TMUX" -eq 1 ]; then
  TITLE='──────────────────────────── role@host ──'
  SEP='────────────────────────────────────────'

  # IDLE (anchor — should already pass): auto-mode bar, nothing staged
  P=$(plant idle "$TITLE" '❯ ' "$SEP" '  ⏵⏵ auto mode on (shift+tab to cycle) · ← for agents')
  assert_state "A1-IDLE" "$P" "IDLE" '^idle$'

  # ACTIVE (anchor — should already pass): esc to interrupt
  P=$(plant active "$TITLE" '❯ ' "$SEP" '  ✻ Cooking… (12s · esc to interrupt)')
  assert_state "A2-ACTIVE" "$P" "ACTIVE" '^active$'

  # ON-PROMPT: text STAGED at ❯, waiting — MUST be distinct from idle (RED: current calls it idle)
  P=$(plant onprompt "$TITLE" '❯ read session/tasks/foo.md   ' "$SEP" '  ⏵⏵ auto mode on (shift+tab to cycle) · ← for agents')
  assert_state "A3-ON-PROMPT" "$P" "ON-PROMPT" 'on-?prompt|staged|pending-input'

  # OPEN-DRAWER: accept-edits / permission box OPEN = BLOCKED not idle
  P=$(plant drawer "$TITLE" '  Do you want to proceed?' '  ❯ 1. Yes' '     2. Yes, and don'\''t ask again' '     3. No, and tell Claude what to do differently')
  assert_state "A4-OPEN-DRAWER" "$P" "OPEN-DRAWER" 'open-?drawer|permission|accept-edits|tool-confirm|blocked'

  # ON-WALL: context wall / auto-compact prompt
  P=$(plant wall "$TITLE" '❯ ' "$SEP" '  Context low (0% remaining) · Run /compact to compact & continue')
  assert_state "A5-ON-WALL" "$P" "ON-WALL" 'on-?wall|context-wall|auto-compact'

  # LOW-CONTEXT: ⚠ high ctx, not yet the wall
  P=$(plant lowctx "$TITLE" '❯ ' "$SEP" '  Context low (12% remaining)   ⏵⏵ auto mode on · ← for agents')
  assert_state "A6-LOW-CONTEXT" "$P" "LOW-CONTEXT" 'low-?context|context-warning'
else
  test.case $level "PART A (skipped — no tmux)" echo skip; expect.pass "skipped"
fi

echo; echo "================= PART B — LIVE FLEET INTEGRITY (measured now) ================="
# Scope to one live team for a fast, deterministic RED.
TEAM="${SWEEP_TEST_TEAM:-ooshTeam}"

SWEEP=$(hiveMind team.sweep "$TEAM" 2>/dev/null | sed 's/\x1b\[[0-9;]*m//g')
CTX=$(hiveMind team.context.status "$TEAM" 2>/dev/null | sed 's/\x1b\[[0-9;]*m//g')

# B1 SINGLE-SOURCE: for each pane addr, the ROLE label must AGREE across the two views.
# RED: team.sweep shows "shell" where team.context.status shows a registered role (0.1 drift).
test.case $level "B1 SINGLE-SOURCE: team.sweep role == team.context.status role per pane" echo "checking"
DRIFT=""
for addr in 0.0 0.1 0.2 0.3 0.4 0.5; do
  sRole=$(printf '%s\n' "$SWEEP" | awk -v a="$addr" '$1==a{print $2}' | head -1)
  cRole=$(printf '%s\n' "$CTX"   | awk -v a="$addr" '$2==a{print $1}' | head -1)
  [ -z "$sRole" ] && [ -z "$cRole" ] && continue
  if [ "$sRole" != "$cRole" ]; then DRIFT="${DRIFT} ${addr}[sweep='${sRole}' vs ctx='${cRole}']"; fi
done
if [ -z "$DRIFT" ]; then expect.pass "views agree on every pane's role"; else
  expect.fail "VIEW-DRIFT (RED):${DRIFT}"; fi

# B2 REGISTRY-CURRENT: no registry role maps to a pane that is actually a bare shell / dead session.
# RED: 0.1 registered scrum-master but the live pane is a shell.
test.case $level "B2 REGISTRY-CURRENT: no registered role sits on a shell/dead pane" echo "checking"
STALE=""
while IFS= read -r line; do
  a=$(echo "$line" | awk '{print $2}'); r=$(echo "$line" | awk '{print $1}')
  [ -z "$a" ] && continue
  case "$r" in AGENT|''|─*|Agent) continue;; esac
  st=$(echo "$line" | grep -oE 'NO-CLAUDE|SELF|UNKNOWN')
  # A registered agent role showing NO-CLAUDE = its pane no longer hosts that claude session = stale.
  if [ "$st" = "NO-CLAUDE" ] && echo "$r" | grep -qE '^(oosh|scrum|robbin|agent|ARON|product|master)'; then
    STALE="${STALE} ${a}=${r}(NO-CLAUDE)"
  fi
done <<< "$CTX"
if [ -z "$STALE" ]; then expect.pass "every registered role hosts its live session"; else
  expect.fail "STALE REGISTRY (RED):${STALE}"; fi

# B3 CONTEXT-SOURCE: context% for each live agent must be a REAL number from from.jsonl,
# never 'parse-fail'/'UNKNOWN' (capture parser) nor a stale '>7d' recording.
# RED: team.context.status shows parse-fail; team.sweep shows 28d-stale recordings.
test.case $level "B3 CONTEXT-SOURCE: live agents report a real ctx% (from.jsonl), not parse-fail/stale" echo "checking"
PARSEFAIL=$(printf '%s\n' "$CTX" | grep -cE 'parse-fail|UNKNOWN')
STALEDAYS=$(printf '%s\n' "$SWEEP" | grep -oE '[0-9]+d ' | head -1)
if [ "$PARSEFAIL" -eq 0 ] && [ -z "$STALEDAYS" ]; then
  expect.pass "all live agents have a fresh from.jsonl ctx%"
else
  expect.fail "CONTEXT-SOURCE broken (RED): ${PARSEFAIL} parse-fail rows; sweep age='${STALEDAYS:-none}' (capture-parse / stale recording, not live from.jsonl)"
fi

# B4 SELF-MEASURABLE: the running agent's OWN pane must get a real state+ctx, not a 'SELF' blind spot.
# (from.jsonl self-read works — proven in T-42; sweep must use it, not skip self.)
test.case $level "B4 SELF-STATE: own pane gets a real state, not a SELF blind spot" echo "checking"
if printf '%s\n' "$SWEEP" | grep -qE '\bSELF\b'; then
  expect.fail "SELF blind spot (RED): own pane shows 'SELF' instead of its live state+ctx"
else
  expect.pass "own pane reports a real live state"
fi

echo
echo "=================================================================="
echo "  T-SWEEP-LIVE-STATE is RED-FIRST: failures above ARE the spec."
echo "=================================================================="
test.suite.save.results
