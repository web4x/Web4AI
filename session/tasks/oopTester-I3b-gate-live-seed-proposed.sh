#!/usr/bin/env bash
set -u
cd /root/.claude/jobs/914c8cad/tmp/gate || exit 9
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
BASE=$(git rev-parse HEAD)
git stash -q || exit 8
echo 'class SeededContent' >> $W/latest/src/puml/Web4MDA-graph.puml                       # content change, not a re-sort -> RED
SVG=$(git ls-files "$W/latest/src/svg/EAM/layer3/*.svg" | grep -v -e ItemModel -e ModelUnit | head -n 1)
echo '<!-- seeded -->' >> "$SVG"; echo "seeded svg with an UNCHANGED puml: $SVG"            # svg change on its own -> RED
git -c user.email=seed@local -c user.name=seed commit -q -am 'SEED (local, never pushed)' || exit 7
python3 /root/.claude/jobs/914c8cad/tmp/gate-i3b-live.py "$BASE" HEAD --proposed
rc=$?
git reset -q --hard "$BASE" && git stash pop -q
echo "script rc=$rc; restored HEAD=$(git rev-parse --short HEAD) dirty=$(git status --porcelain | grep -vc node_modules) stashes=$(git stash list | wc -l)"
