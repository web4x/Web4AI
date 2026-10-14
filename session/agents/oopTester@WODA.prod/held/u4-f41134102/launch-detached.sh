#!/usr/bin/env bash
# oopTester: run one c4b.sh arm DETACHED from the harness (its 600 s background cap killed iii-iso at ~10 min; arms take 9m13s-10m45s).
# usage: launch-detached.sh <arm>   -> writes c4b-<arm>.summary, then c4b-<arm>.done (holds the driver rc) when finished.
D=$(cd "$(dirname "$0")" && pwd); A="$1"
[ -n "$A" ] || { echo "usage: launch-detached.sh <arm>"; exit 1; }
rm -f "$D/${PFX:-c4b}-$A.done"
setsid nohup bash -c "cd '$D' && bash ${DRV:-c4b.sh} '$A' > '${PFX:-c4b}-$A.summary' 2>&1; echo \$? > '${PFX:-c4b}-$A.done'" >/dev/null 2>&1 < /dev/null &
echo "launched arm $A detached pid=$!  (done-marker: $D/${PFX:-c4b}-$A.done)"
