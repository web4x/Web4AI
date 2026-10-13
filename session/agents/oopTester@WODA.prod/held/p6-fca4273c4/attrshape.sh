#!/usr/bin/env bash
# Read-only: show one AttributeModel entry + its import, from an existing Definition at the audit sha.
cd /var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/c1 || exit 2
f=$(git grep -l "new AttributeModel().init({" -- '*/model/*Definition.ts' | head -1)
echo "$f"
n=$(grep -n "new AttributeModel().init({" "$f" | head -1 | cut -d: -f1)
sed -n "$((n-1)),$((n+9))p" "$f"
grep -n "import.*AttributeModel" "$f" | cut -c1-200
grep -n "import.*ImportModel" "$f" | cut -c1-200
