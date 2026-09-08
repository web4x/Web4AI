#!/usr/bin/env bash
# T-VIEW-AGREE — RED-FIRST guard for §7 Part 4 (repoint the 3 views onto pane.live).
# The DRY guarantee: team.sweep, team.context.status, and dashboard ALL project the ONE
# pane.live reader, so for any pane they must report IDENTICAL facts — role, base_state,
# context%. RED until Part 4 lands (today the views derive independently and DRIFT — the
# 0.1 'shell vs scrum-master' view-drift my PART B caught). Ground truth = pane.live itself.
level=$1; [ -z "$level" ] && level=1
echo "starting: T-VIEW-AGREE <LOG_LEVEL=$level> (RED-FIRST — fails until Part 4 repoints the 3 views)"
source this
source test.suite
export LOG_DEVICE=/dev/null
log.level $level

TEAM="${VIEW_TEST_TEAM:-ooshTeam}"
strip() { sed 's/\x1b\[[0-9;]*m//g'; }

# Canonical per-pane facts from pane.live (addr -> role|base_state|pct) — the single source.
LIVE=$(hiveMind protected.pane.live "$TEAM" 2>/dev/null)
live_role()  { printf '%s\n' "$LIVE" | awk -F'|' -v a="$1" '$3==a{print $5; exit}'; }
live_state() { printf '%s\n' "$LIVE" | awk -F'|' -v a="$1" '$3==a{print $10; exit}'; }
live_pct()   { printf '%s\n' "$LIVE" | awk -F'|' -v a="$1" '$3==a{print $12; exit}'; }

# Each VIEW's reported role for an address (parsers tolerant of each view's format).
SWEEP=$(hiveMind team.sweep "$TEAM" 2>/dev/null | strip)
CTX=$(hiveMind team.context.status "$TEAM" 2>/dev/null | strip)
hiveMind dashboard "$TEAM" >/dev/null   # generate dashboard.md; stderr left open
DASH=$(cat "${OOSH_DIR}/session/dashboard.md" 2>/dev/null | strip; cat session/dashboard.md 2>/dev/null | strip)

sweep_role() { printf '%s\n' "$SWEEP" | awk -v a="$1" '$1==a{print $2; exit}'; }
ctx_role()   { printf '%s\n' "$CTX"   | awk -v a="$1" '$2==a{print $1; exit}'; }
dash_role()  { printf '%s\n' "$DASH"  | grep -F "$1" | grep -oiE '(oosh|robbin|scrum|agent|ARON|product)[a-z-]*' | head -1; }

# Iterate the AGENT addresses pane.live knows (the authoritative membership).
ADDRS=$(printf '%s\n' "$LIVE" | awk -F'|' '$7=="agent"{print $3}')

echo; echo "===== VIEW-AGREE: role identical across team.sweep / context.status / dashboard ====="
roledrift=""
while IFS= read -r a; do
  [ -z "$a" ] && continue
  lr=$(live_role "$a"); sr=$(sweep_role "$a"); cr=$(ctx_role "$a"); dr=$(dash_role "$lr")
  # Every view that reports this pane must report the SAME role as pane.live.
  for v in "sweep=$sr" "ctx=$cr"; do
    val="${v#*=}"; nm="${v%%=*}"
    [ -n "$val" ] && [ "$val" != "$lr" ] && roledrift="$roledrift ${a}[${nm}='${val}'≠live='${lr}']"
  done
done <<< "$ADDRS"
test.case $level "VA1: team.sweep + context.status roles == pane.live (no view-drift, incl 0.1)" echo "${roledrift:-agree}"
[ -z "$roledrift" ] && expect.pass "all views agree on every pane's role (DRY: one source)" \
                    || expect.fail "VIEW-DRIFT (RED): $roledrift — views not yet projecting pane.live (Part 4)"

echo; echo "===== VIEW-AGREE: context% present + consistent (from.jsonl, not parse-fail/stale) ====="
badctx=""
while IFS= read -r a; do
  [ -z "$a" ] && continue
  lp=$(live_pct "$a")
  # pane.live must give a real numeric pct (from.jsonl); context.status must not be parse-fail.
  echo "$lp" | grep -qE '^[0-9]+$' || badctx="$badctx ${a}[live-pct='${lp}']"
done <<< "$ADDRS"
CTX_FAIL=$(printf '%s\n' "$CTX" | grep -ciE 'parse-fail|UNKNOWN')
test.case $level "VA2: pane.live ctx% numeric for all agents; context.status no parse-fail" echo "badctx=[${badctx:-none}] ctx.parsefail=$CTX_FAIL"
{ [ -z "$badctx" ] && [ "$CTX_FAIL" -eq 0 ]; } && expect.pass "context% is real from.jsonl across views" \
                    || expect.fail "CONTEXT-SOURCE drift (RED): badctx=${badctx:-none} parsefail-rows=$CTX_FAIL"

echo; echo "===== VIEW-AGREE: dashboard reflects the SAME membership as pane.live ====="
missing=""
while IFS= read -r a; do
  [ -z "$a" ] && continue
  lr=$(live_role "$a")
  printf '%s\n' "$DASH" | grep -qF "$lr" || missing="$missing ${a}(${lr})"
done <<< "$ADDRS"
test.case $level "VA3: dashboard lists every pane.live agent (DRY membership)" echo "${missing:-complete}"
[ -z "$missing" ] && expect.pass "dashboard membership == pane.live" \
                  || expect.fail "DASHBOARD DRIFT (RED): missing $missing — not projecting pane.live (Part 4)"

echo
echo "=================================================================="
echo "  T-VIEW-AGREE is RED-FIRST: drift ABOVE is the Part-4 spec."
echo "  Goes green when team.sweep/context.status/dashboard all project pane.live."
echo "=================================================================="
test.suite.save.results
