#!/usr/bin/env bash
# Prove gate-i3b-live.py FAILABLE on a throwaway local commit on top of the clone's CURRENT HEAD; restore exactly afterwards.
set -u
cd /root/.claude/jobs/914c8cad/tmp/gate || exit 9
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
BASE=$(git rev-parse HEAD)
git stash -q || exit 8                       # tracked changes only (my gate); node_modules link untouched
OLD=Typed; OLD="${OLD}Model"
NEW=ModelUnit
# (A) rename-only on a file that still holds the old name at BASE (if any) — must PASS; else (A) is skipped VISIBLY
A=$(git grep -l -E "(^|[^A-Za-z0-9_])${OLD}" -- 'EAMD.ucp/*.ts' | grep -v '/test/' | head -n 1)
if [ -n "$A" ]; then sed -i "s/${OLD}/${NEW}/g" "$A"; echo "seed A (rename-only): $A"; else echo "seed A SKIPPED: no file holds the old name at BASE"; fi
# (B) a non-rename edit in another component — must be a VIOLATION by name
echo '// seeded non-rename edit' >> $W/DefaultFolder/latest/src/ts/EAM/layer2/DefaultFolder.ts
# (C) a FileServerModel generated file with an added line — must be a VIOLATION by name (no model change is allowed)
echo "' seeded added line" >> $W/DefaultFolder/latest/src/puml/EAM/layer3/FileServerModel.puml
git -c user.email=seed@local -c user.name=seed commit -q -am 'SEED (local, never pushed)' || exit 7
python3 /root/.claude/jobs/914c8cad/tmp/gate-i3b-live.py "$BASE" HEAD
rc=$?
git reset -q --hard "$BASE" && git stash pop -q
echo "script rc=$rc; restored HEAD=$(git rev-parse --short HEAD) (base $(git rev-parse --short "$BASE")) dirty=$(git status --porcelain | grep -vc node_modules) stashes=$(git stash list | wc -l)"
