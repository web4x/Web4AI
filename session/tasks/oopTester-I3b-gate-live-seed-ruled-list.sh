#!/usr/bin/env bash
# Prove rule (a)'s IN-LINE LIST branch failable: an unsorted list reorder (same elements) -> RED by name. Restore exactly.
set -u
cd /root/.claude/jobs/914c8cad/tmp/gate || exit 9
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
BASE=$(git rev-parse HEAD)
git stash -q || exit 8
python3 /root/.claude/jobs/914c8cad/tmp/unsort-list.py $W/MOF/M2/M2AbstractClass/latest/test/M2AbstractClass.test.ts
git -c user.email=seed@local -c user.name=seed commit -q -am 'SEED (local, never pushed)' || exit 7
python3 /root/.claude/jobs/914c8cad/tmp/gate-i3b-live.py "$BASE" HEAD
rc=$?
git reset -q --hard "$BASE" && git stash pop -q
echo "script rc=$rc; restored HEAD=$(git rev-parse --short HEAD) dirty=$(git status --porcelain | grep -vc node_modules) stashes=$(git stash list | wc -l)"
