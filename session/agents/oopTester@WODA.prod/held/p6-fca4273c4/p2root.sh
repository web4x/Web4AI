#!/usr/bin/env bash
# P2-ROOT' representability check (oopPO 10-13): is a namespace AUTHORED anywhere, or only read from the folder chain?
cd /var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/c1 || exit 2
echo "Definitions total: $(git ls-files '*/model/*Definition.ts' | wc -l)"
echo "Definitions mentioning 'namespace': $(git grep -l 'namespace' -- '*/model/*Definition.ts' | wc -l)"
git grep -n 'namespace' -- '*/model/*Definition.ts' | head -6 | cut -c1-220
echo "--- 'get namespace()' in src/ts (hand source):"
git grep -n 'get namespace()' -- '*src/ts/*.ts' | head -12 | cut -c1-220
echo "--- 'namespace' as a ClassModel/ItemModel attribute (model classes):"
git grep -nE "^\s*namespace\s*[:=]" -- '*src/ts/*.ts' | head -8 | cut -c1-220
echo "--- folder-chain readers (FolderNamespace etc.):"
git grep -lE 'class FolderNamespace|namespaceFromFolder|fromFolder' -- '*src/ts/*.ts' | head -6
