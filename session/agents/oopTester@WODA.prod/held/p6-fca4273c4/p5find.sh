#!/usr/bin/env bash
# Read-only: map P5's four removals to their guard assertions at the audit sha.
cd /var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/c1 || exit 2
git grep -nE "P5|interim|domain|special case|P1 special" -- '*.test.ts' \
  | grep -E "it\(|describe\(" \
  | sed -E 's|^EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/||' | cut -c1-230 | head -20
