#!/usr/bin/env bash
# Sprint-1 [S] shell-provable go-throughs: predict → run → capture → verify.
# Non-interactive, isolated scratch panes. Tasks 03/06/07/08/09/15/17.
source this >/dev/null 2>&1
R=$(command -v tmux)
W=/tmp/qa-s1/s1work.$$; mkdir -p "$W/bin"
# keystream stub (forwards to real tmux, logs Enter/Escape/Down)
cat > "$W/bin/tmux" <<STUB
#!/usr/bin/env bash
if [ "\$1" = "-u" ] && [ "\$2" = "send-keys" ]; then
  for a in "\$@"; do case "\$a" in Enter) echo Enter >> "$W/keys.log";; Escape) echo Escape >> "$W/keys.log";; Down) echo Down >> "$W/keys.log";; esac; done
fi
exec "$R" "\$@"
STUB
chmod +x "$W/bin/tmux"
newpane() { local s="$1"; $R new-session -d -s "$s" 2>/dev/null; sleep 0.4; $R send-keys -t "$s:0.0" "PS1='oosh > '" Enter; sleep 0.4; echo "$s:0.0"; }
cap() { $R capture-pane -t "$1" -p 2>/dev/null | sed -E 's/\x1b\[[0-9;]*m//g'; }

echo "########## TASK-03 shell-target ##########"
P=$(newpane __s1_03_$$)
OUT=$(LOG_LEVEL=4 LOG_DEVICE=/dev/stdout otmux send "$P" "echo T3C-SHELL" 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g'); RC=$?
sleep 0.6; C=$(cap "$P")
echo "PREDICT: no [@ prefix · no Escape · 1 Enter · prints T3C-SHELL once · info/rc0 · no WARNING"
echo "rc=$RC"
echo "prints-once: $(printf '%s\n' "$C" | grep -cx 'T3C-SHELL')"
echo "prefix-[@: $(printf '%s\n' "$C" | grep -c '\[@')"
echo "log-info-committed: $(printf '%s\n' "$OUT" | grep -c 'committed')"
echo "log-WARNING: $(printf '%s\n' "$OUT" | grep -c 'WARNING')"
$R kill-session -t __s1_03_$$ 2>/dev/null

echo "########## TASK-06 node-shell-not-claude ##########"
if command -v node >/dev/null 2>&1; then
  $R new-session -d -s __s1_06_$$ 2>/dev/null; sleep 0.4; NP=__s1_06_$$:0.0
  $R send-keys -t "$NP" "node -e 'setInterval(()=>{},1e4)'" Enter; sleep 1.5
  CMD=$($R display-message -t "$NP" -p '#{pane_current_command}')
  "$OOSH_DIR/claudeCode" process.running "$NP" 2>/dev/null; PR=$?
  echo "PREDICT: cmd=node → classifies SHELL (process.running rc!=0), NO false-claude"
  echo "cmd=$CMD process.running-rc=$PR (rc!=0 = not-claude = shell)"
  $R kill-session -t __s1_06_$$ 2>/dev/null
else echo "SKIP: node not installed"; fi

echo "########## TASK-07 single-key (send.raw) ##########"
P=$(newpane __s1_07_$$)
: > "$W/keys.log"
PATH="$W/bin:$PATH" otmux send.raw "$P" "echo T7RAW" Enter >/dev/null 2>&1
sleep 0.6; C=$(cap "$P")
echo "PREDICT: raw key event, NO [@ prefix, NO verify/queue"
echo "delivered-once: $(printf '%s\n' "$C" | grep -cx 'T7RAW')"
echo "prefix-[@: $(printf '%s\n' "$C" | grep -c '\[@')"
echo "send.raw-invokes-prefix/verify/poke/queue [S]: $(sed -n '/^otmux.send.raw()/,/^}/p' "$OOSH_DIR/otmux" | grep -cE 'send.prefix|send.verify|send.poke|queue.(enqueue|drain)')"
$R kill-session -t __s1_07_$$ 2>/dev/null

echo "########## TASK-08 text + trailing key ##########"
P=$(newpane __s1_08_$$)
: > "$W/keys.log"
PATH="$W/bin:$PATH" otmux send "$P" "echo T8TEXT" Enter >/dev/null 2>&1
sleep 0.6; C=$(cap "$P")
echo "PREDICT: text delivered then ONE Enter (no redundant 2nd Enter)"
echo "delivered-once: $(printf '%s\n' "$C" | grep -cx 'T8TEXT')"
echo "enter-count: $(grep -c Enter "$W/keys.log")"
$R kill-session -t __s1_08_$$ 2>/dev/null

echo "########## TASK-09 all-keys chain ##########"
P=$(newpane __s1_09_$$)
$R send-keys -t "$P" "PROMPT_MARK_START" Enter; sleep 0.4
: > "$W/keys.log"
PATH="$W/bin:$PATH" otmux send "$P" Down Down Enter >/dev/null 2>&1
sleep 0.6; C=$(cap "$P")
echo "PREDICT: ALL raw keys (Down Down Enter), NO [@ prefix, sequential"
echo "keys-sent: $(cat "$W/keys.log" | tr '\n' ' ')"
echo "down-count: $(grep -c Down "$W/keys.log") enter-count: $(grep -c Enter "$W/keys.log")"
echo "prefix-[@: $(printf '%s\n' "$C" | grep -c '\[@')"
$R kill-session -t __s1_09_$$ 2>/dev/null

echo "########## TASK-15 queue path (no dup, rc0-gated, no silent drop) ##########"
$R new-session -d -s __s1_15_$$ 2>/dev/null; sleep 0.4; QP=__s1_15_$$:0.0
QDIR="${HIVEMIND_QUEUE_DIR:-${CONFIG_PATH:-$HOME/config}/hivemind.queue}"; mkdir -p "$QDIR"
QSAFE="${QP//:/_}"; QSAFE="${QSAFE//./_}"; QFILE="$QDIR/$QSAFE.queue"
echo "$(date +%s)|inform|T15-QMSG" > "$QFILE"
# busy/blocked display so route != inform → drain must KEEP (no drop, no dup)
$R send-keys -t "$QP" "printf 'Do you want to proceed?\\n'" Enter; sleep 0.5
hiveMind agent.queue.drain "$QP" >/dev/null 2>&1
echo "PREDICT: undeliverable msg KEPT (no silent drop), route-gated, no dup"
echo "msg-kept: $(grep -c 'T15-QMSG' "$QFILE" 2>/dev/null)"
echo "drain-gate-src [S]: $(sed -n '/hiveMind.agent.queue.drain()/,/^}/p' "$OOSH_DIR/hiveMind" | grep -cE 'route.*!=.*inform')"
rm -f "$QFILE"; $R kill-session -t __s1_15_$$ 2>/dev/null

echo "########## TASK-17 capture methods (read-only) ##########"
P=$(newpane __s1_17_$$)
$R send-keys -t "$P" "echo T17_VISIBLE_CONTENT" Enter; sleep 0.5
VIS=$(otmux pane.capture "$P" 10 2>/dev/null | grep -c 'T17_VISIBLE_CONTENT')
echo "PREDICT: pane.capture returns visible content; READ-ONLY (zero send-keys)"
echo "capture-returns-content: $VIS"
echo "capture-methods-send-keys [S] (expect 0): $(sed -n '/^otmux.pane.capture()/,/^}/p' "$OOSH_DIR/otmux" | grep -cE 'send-keys')"
$R kill-session -t __s1_17_$$ 2>/dev/null

rm -rf "$W"
echo "########## DONE ##########"
