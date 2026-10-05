#!/usr/bin/env bash
# oopTester I6 / G2 — INDEPENDENT dependants oracle (text, never the model's derivation code).
# Prints every held .ts file OUTSIDE the IOR set that imports an IOR-set class, by import specifier.
# Usage: oopTester-I6-g2-oracle.sh <Web4MDA repo root>   (exit 0; output = sorted relative paths)
set -euo pipefail
repo="${1:?usage: $0 <Web4MDA repo root>}"
cd "$repo"
S='Ior|RepositoryId|RepositoryIdModel|ObjectKey|ObjectKeyModel|TaggedProfile|TaggedProfileModel|InternetProfile|InternetProfileModel|TaggedComponent|TaggedComponentModel|SecureTransport|SecureTransportModel|UnknownTaggedComponent'
git ls-files EAMD.ucp | grep -E '\.ts$' \
  | xargs grep -lE "from '[^']*/(${S})\.js'" \
  | grep -vE "/(${S})\.ts$|/(${S})\.test\.ts$|/(${S})Definition\.ts$" \
  | sed 's|EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/||' \
  | sort
