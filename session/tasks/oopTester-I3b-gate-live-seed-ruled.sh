#!/usr/bin/env bash
# Prove the RULED TH7 rule failable (oopPO 2026-10-03) on a throwaway local commit on top of HEAD; restore exactly.
set -u
cd /root/.claude/jobs/914c8cad/tmp/gate || exit 9
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
BASE=$(git rev-parse HEAD)
git stash -q || exit 8
G=$W/latest/src/puml/Web4MDA-graph.puml
# (1) UNSORTED reorder: swap the first two adjacent `<|--` lines (same multiset, order no longer sort-derived) -> RED
python3 - "$G" <<'PY'
import sys
p=sys.argv[1]; L=open(p).read().split('\n')
i=next(k for k in range(len(L)-1) if '<|--' in L[k] and '<|--' in L[k+1])
L[i],L[i+1]=L[i+1],L[i]; open(p,'w').write('\n'.join(L)); print('seed 1 swapped lines',i+1,i+2)
PY
# (2) an svg changed while its puml is unchanged -> RED
SVG=$(git ls-files "$W/latest/src/svg/EAM/layer3/*.svg" | grep -v -e ItemModel -e ModelUnit | head -n 1)
echo '<!-- seeded -->' >> "$SVG"; echo "seed 2 svg: $SVG"
# (3) a content line in another component's puml -> RED (not a re-sort)
P=$W/DefaultFolder/latest/src/puml/EAM/layer3/FileServerModel.puml
echo "' seeded content" >> "$P"; echo "seed 3 content: $P"
git -c user.email=seed@local -c user.name=seed commit -q -am 'SEED (local, never pushed)' || exit 7
python3 /root/.claude/jobs/914c8cad/tmp/gate-i3b-live.py "$BASE" HEAD
rc=$?
git reset -q --hard "$BASE" && git stash pop -q
echo "script rc=$rc; restored HEAD=$(git rev-parse --short HEAD) dirty=$(git status --porcelain | grep -vc node_modules) stashes=$(git stash list | wc -l)"
