#!/usr/bin/env bash
# oopTester I6 / G2 — INDEPENDENT dependants oracle (text, never the model's derivation code).
# Prints every held .ts file OUTSIDE the MOVED set that imports a MOVED class, by import specifier.
# MOVED set = the 7 IOR sub-components + their models (plan d729ecd). Ior itself is NOT moved (it becomes the
# Package in place), so Ior.ts / IorModel.ts / Ior tests ARE dependants (v1 wrongly excluded them; fixed 2026-10-05).
# By-name references (strings resolved through the catalog) are NOT dependants (oopPO ruling): move changes place, never name.
# Usage: oopTester-I6-g2-oracle.sh <Web4MDA repo root>   (exit 0; output = sorted relative paths)
set -euo pipefail
repo="${1:?usage: $0 <Web4MDA repo root>}"
cd "$repo"
S='RepositoryId|RepositoryIdModel|ObjectKey|ObjectKeyModel|TaggedProfile|TaggedProfileModel|InternetProfile|InternetProfileModel|TaggedComponent|TaggedComponentModel|SecureTransport|SecureTransportModel|UnknownTaggedComponent'
git ls-files EAMD.ucp | grep -E '\.ts$' \
  | xargs grep -lE "from '[^']*/(${S})\.js'" \
  | grep -vE "/(${S})\.ts$|/(${S})\.test\.ts$|/(${S})Definition\.ts$" \
  | sed 's|EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/||' \
  | sort
