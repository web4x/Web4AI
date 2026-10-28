#!/usr/bin/env bash
# T-OTMUX-OBSERVER-RC — gate oosh-expert/otmux-observer-rc @4e3bb84b (step 5).
# Usage: t-otmux-observer-rc.sh <tree>   (run on CONTROL=deployed cd1b0c80 and CANDIDATE=cd1b0c80+otmux@4e3bb84b)
# End-to-end through PUBLIC verbs (session.rename / split / pane.swap) with a FAKE hiveMind
# BINARY on PATH (no function mocks; otmux runs as its own process). Sandbox HOME; fixtures
# are prefixed obsfx_ and pre-swept (EXIT trap skips SIGKILL). Live registry sha must be unchanged.
WT="$(cd "$1" && pwd)"; [ -x "$WT/otmux" ] || { echo "no otmux in $WT"; exit 2; }
SC="$(cd "$(dirname "$0")" && pwd)"
D="$SC/obsrun.$$"; rm -rf "$D"; mkdir -p "$D/home/config" "$D/bin"
touch "$D/home/config/result.txt" "$D/home/config/error.txt"
echo "=== tree: $WT @ $(git -C "$WT" rev-parse --short HEAD) $(git -C "$WT" diff --quiet && echo clean || echo "+ local: $(git -C "$WT" diff --name-only | tr '\n' ' ')")"
echo "    otmux sha256: $(sha256sum "$WT/otmux" | cut -c1-12)"

# ---- fake hiveMind: mode via FAKE_HM_MODE; logs every invocation ----
cat > "$D/bin/hiveMind" <<'EOF'
#!/usr/bin/env bash
echo "$*" >> "$FAKE_HM_LOG"
case "$FAKE_HM_MODE" in
  fail) echo "hm-stdout-marker"; printf 'boom-line1\nboom-line2\n' >&2; exit 3 ;;
  *)    echo "hm-ok-marker"; exit 0 ;;
esac
EOF
chmod +x "$D/bin/hiveMind"
export FAKE_HM_LOG="$D/hm.log"

# ---- live registry safety: sha all env files in the REAL config dir before/after ----
LIVECFG="/home/shared/EAMD.ucp/Scenarios/localhost/EAM/1_infrastructure/Once.sh/sharedConfig"
LIVEFILES="$LIVECFG/hivemind.roles.env $LIVECFG/hivemind.sessions.env $LIVECFG/hivemind.queue"
# non-vacuous: refuse to hash nothing (sha of empty input = e3b0c442... fooled the first run)
for f in $LIVEFILES; do [ -s "$f" ] || { echo "  INSTRUMENT: live file missing/empty: $f"; }; done
live_sha() { cat $LIVEFILES 2>/dev/null | sha256sum | cut -c1-16; }
SHA_BEFORE="$(live_sha)"

PFX="obsfx_"
sweep() { tmux list-sessions -F '#{session_name}' 2>/dev/null | grep "^$PFX" | while IFS= read -r s; do tmux kill-session -t "$s" 2>/dev/null; done; }
sweep; trap sweep EXIT

# run otmux from the tree under test; $1=with|without hiveMind on PATH; rest = otmux args
OUT="$D/out"; LOG="$D/oosh.log"
run() { local hm="$1"; shift; : > "$OUT"; : > "$LOG"
  local P="$WT:/usr/bin:/bin"; [ "$hm" = with ] && P="$D/bin:$P"
  env -i HOME="$D/home" PATH="$P" OOSH_DIR="$WT" TMUX="$TMUX" TERM="${TERM:-xterm}" \
      LOG_DEVICE="$LOG" LOG_FILE="$LOG" FAKE_HM_MODE="$FAKE_HM_MODE" FAKE_HM_LOG="$FAKE_HM_LOG" \
      bash --norc --noprofile "$WT/otmux" "$@" > "$OUT" 2>> "$LOG"
  RC=$?; }
# warn.log may land on stdout OR the log device — search BOTH (first run false-RED'd by grepping LOG only)
WARN() { cat "$OUT" "$LOG" 2>/dev/null | grep -i "observer" | grep -iE "warn|fail" | head -1; }
LEAK() { cat "$OUT" "$LOG" 2>/dev/null | grep -c "$1"; }

pass=0; fail=0
ok(){ echo "  PASS $1"; pass=$((pass+1)); }
no(){ echo "  FAIL $1"; fail=$((fail+1)); }
mk(){ tmux new-session -d -s "$1" -x 120 -y 30 2>/dev/null; }

echo; echo "--- RENAME + failing observer ---"
mk "${PFX}a"; : > "$FAKE_HM_LOG"; FAKE_HM_MODE=fail
run with session.rename "${PFX}a" "${PFX}a2"; W="$(WARN)"
echo "  rc=$RC warn=[${W:-none}]"; echo "  stdout=[$(tr '\n' ' ' < "$OUT")]"; echo "  observer call=[$(cat "$FAKE_HM_LOG")]"
grep -qx "protected.session.renamed ${PFX}a ${PFX}a2" "$FAKE_HM_LOG" && ok "R0 observer invoked with verb+old+new (non-vacuous)" || no "R0 observer not invoked as expected"
tmux has-session -t "${PFX}a2" 2>/dev/null && ok "R0b rename LANDED (effect)" || no "R0b rename did not land"
[ "$RC" -eq 3 ] && ok "R1 rc passthrough = observer rc 3" || no "R1 rc=$RC (want 3)"
{ [ -n "$W" ] && echo "$W" | grep -q 'protected.session.renamed' && echo "$W" | grep -q "${PFX}a2" && echo "$W" | grep -q 'rc=3' && echo "$W" | grep -q 'boom-line1'; } \
  && ok "R2 WARN names verb + args + rc=3 + first stderr line" || no "R2 failure SILENT or incomplete (warn=[${W:-none}])"
{ [ -n "$W" ] && [ "$(LEAK boom-line2)" -eq 0 ]; } && ok "R3 only FIRST stderr line surfaced" || no "R3 (no warn, or line2 leaked)"
grep -q 'hm-stdout-marker' "$OUT" && ok "R5 observer stdout NOT swallowed (reaches caller stdout)" || no "R5 observer stdout lost"

echo; echo "--- RENAME + healthy observer ---"
mk "${PFX}b"; : > "$FAKE_HM_LOG"; FAKE_HM_MODE=ok
run with session.rename "${PFX}b" "${PFX}b2"; W="$(WARN)"
echo "  rc=$RC warn=[${W:-none}]"
{ [ "$RC" -eq 0 ] && [ -z "$W" ] && grep -q "protected.session.renamed" "$FAKE_HM_LOG"; } \
  && ok "R4 healthy observer: rc0, NO warn, observer fired" || no "R4 rc=$RC warn=[${W:-none}]"

echo; echo "--- RENAME + hiveMind ABSENT ---"
mk "${PFX}c"; FAKE_HM_MODE=fail
run without session.rename "${PFX}c" "${PFX}c2"; W="$(WARN)"
echo "  rc=$RC warn=[${W:-none}]"
{ [ "$RC" -eq 0 ] && tmux has-session -t "${PFX}c2" 2>/dev/null && [ -z "$W" ]; } \
  && ok "R6 no hiveMind on PATH -> rc0, rename landed, no warn" || no "R6 rc=$RC (want 0) landed=$(tmux has-session -t ${PFX}c2 2>/dev/null && echo y || echo n)"

echo; echo "--- SPLIT (panes.shifted) + failing observer ---"
mk "${PFX}s"; : > "$FAKE_HM_LOG"; FAKE_HM_MODE=fail
N0=$(tmux list-panes -t "${PFX}s" 2>/dev/null | wc -l)
run with split "${PFX}s:0.0"; W="$(WARN)"
N1=$(tmux list-panes -t "${PFX}s" 2>/dev/null | wc -l)
echo "  rc=$RC panes $N0->$N1 warn=[${W:-none}]"; echo "  observer call=[$(cat "$FAKE_HM_LOG")]"
[ "$N1" -eq $((N0+1)) ] && ok "S0 split LANDED (pane count +1)" || no "S0 split did not land"
grep -qx "protected.panes.shifted ${PFX}s" "$FAKE_HM_LOG" && ok "S1 shifted observer invoked with the split's session" || no "S1 shifted observer not invoked as expected"
{ [ -n "$W" ] && echo "$W" | grep -q 'protected.panes.shifted' && echo "$W" | grep -q "${PFX}s" && echo "$W" | grep -q 'rc=3'; } \
  && ok "S2 SPLIT failure surfaced: WARN names panes.shifted + session + rc" || no "S2 split observer failure SILENT"
[ "$RC" -eq 3 ] && ok "S3 split rc = observer rc 3" || no "S3 split rc=$RC"

echo; echo "--- SWAP (panes.swapped) + failing observer ---"
: > "$FAKE_HM_LOG"; FAKE_HM_MODE=fail
run with pane.swap "${PFX}s:0.0" "${PFX}s:0.1"; W="$(WARN)"
echo "  rc=$RC warn=[${W:-none}]"; echo "  observer call=[$(cat "$FAKE_HM_LOG")]"
grep -q "^protected.panes.swapped ${PFX}s " "$FAKE_HM_LOG" && ok "W1 swapped observer invoked" || no "W1 swapped observer not invoked"
{ [ -n "$W" ] && echo "$W" | grep -q 'protected.panes.swapped' && echo "$W" | grep -q 'rc=3'; } \
  && ok "W2 SWAP failure surfaced" || no "W2 swap observer failure SILENT"

SHA_AFTER="$(live_sha)"
echo; echo "  live registry sha before=$SHA_BEFORE after=$SHA_AFTER ($LIVECFG)"
{ [ "$SHA_BEFORE" = "$SHA_AFTER" ] && [ "$SHA_BEFORE" != "e3b0c44298fc1c14" ]; } && ok "SAFE live hivemind roles/sessions/queue unchanged (non-empty hash)" || no "SAFE live registry CHANGED or hash vacuous"

sweep; rm -rf "$D"
echo; echo "=== T-OTMUX-OBSERVER-RC: PASS=$pass FAIL=$fail ==="
exit "$fail"
