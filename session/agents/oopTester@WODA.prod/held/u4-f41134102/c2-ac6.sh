#!/usr/bin/env bash
# oopTester U4 C.2 driver — AC6 budget (M1Layout 'AC6 is failable', 10 s): END (c1=f41134102) vs BASE (c3=b65b75769),
# 3x alone (M1Layout.test.ts as the only file) + 3x under the full suite each. Logs ONE line per run with loadavg.
H=$(cd "$(dirname "$0")" && pwd); U=$H/u4.sh
OUT=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-u4/out
LOG=$OUT/C2.summary; : > "$LOG"
F=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Layout/latest/test/M1Layout.test.ts
ac6() { sed 's/\x1b\[[0-9;]*m//g' "$1" | grep -E '^ +[✓×] AC6 is failable' | grep -oE '[0-9]+ms$' | head -1; }
waitq() { for i in $(seq 1 120); do [ "$(bash $U WAITQ)" = "nodeVitest=0" ] && return 0; sleep 5; done; return 1; }
run() { # $1=clone $2=mode(alone|suite) $3=label
  waitq || { echo "$3 NOT QUIET after 10 min — skipped" >> "$LOG"; return; }
  local la; la=$(cut -d' ' -f1-3 /proc/loadavg)
  if [ "$2" = alone ]; then r=$(bash $U FILE "$1" "$3" "$F" | head -1); o="$OUT/$3.file.out"; else r=$(bash $U TEST "$1" "$3"); o="$OUT/$3.test.out"; fi
  echo "$3 clone=$1 mode=$2 AC6=$(ac6 "$o") load(before)=$la | $r" >> "$LOG"
}
for k in 1 2 3; do run c1 alone C2-END-alone-$k; done
for k in 1 2 3; do run c1 suite C2-END-suite-$k; done
[ -e /var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-u4/c3 ] || { SHA=b65b75769 bash $U CLONE c3 >> "$LOG" 2>&1; bash $U CI c3 >> "$LOG" 2>&1; }
for k in 1 2 3; do run c3 alone C2-BASE-alone-$k; done
for k in 1 2 3; do run c3 suite C2-BASE-suite-$k; done
echo "C2 DONE" >> "$LOG"
