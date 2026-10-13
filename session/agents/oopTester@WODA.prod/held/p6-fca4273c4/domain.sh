#!/usr/bin/env bash
# Read-only: is a package `domain` attribute guarded, and does it exist in src at the audit sha?
cd /var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/c1 || exit 2
echo "== tests mentioning 'domain':"; git grep -nw "domain" -- '*.test.ts' | sed -E 's|^EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/||' | cut -c1-220
echo "== src/model mentioning 'domain' (non-test):"; git grep -nw "domain" -- '*.ts' ':!*.test.ts' | sed -E 's|^EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/||' | cut -c1-200 | head -8
echo "== Package model attributes:"; git grep -nE "^\s+[a-zA-Z]+ ?[:=]" -- '*Package/latest/src/ts/EAM/layer3/PackageModel.ts' | cut -c1-160
