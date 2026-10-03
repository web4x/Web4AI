#!/usr/bin/env bash
# Prove gate-i3b-live.py FAILABLE on a throwaway local commit in the gate clone; restore exactly afterwards.
set -u
cd /root/.claude/jobs/914c8cad/tmp/gate || exit 9
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
git stash -q || exit 8                       # tracked changes only (my gate + spec patch); node_modules link untouched
OLD=Typed; OLD="${OLD}Model"
# (A) rename-only: the old name -> ModelUnit in one source file — must PASS as rename-only
sed -i "s/${OLD}/ModelUnit/g" $W/MOF/M2/M2PlantUmlClass/latest/src/thinglish.ts/EAM/layer2/M2PlantUmlClass.class.ts
# (B) a non-rename edit in another component — must be a VIOLATION by name
echo '// seeded non-rename edit' >> $W/DefaultFolder/latest/src/ts/EAM/layer2/DefaultFolder.ts
# (C) FileServerModel generated file with an ADDED line — must be a VIOLATION (only removed relationship lines are allowed)
echo "' seeded added line" >> $W/DefaultFolder/latest/src/puml/EAM/layer3/FileServerModel.puml
git -c user.email=seed@local -c user.name=seed commit -q -am 'SEED (local, never pushed)' || exit 7
python3 /root/.claude/jobs/914c8cad/tmp/gate-i3b-live.py 4907913 HEAD
rc=$?
git reset -q --hard 4907913 && git stash pop -q
echo "script rc=$rc; restored HEAD=$(git rev-parse --short HEAD) dirty=$(git status --porcelain | grep -vc node_modules)"
