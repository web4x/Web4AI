# BUG: config.save greedy varname-extraction cannot persist vars whose VALUE contains `NAME=` / `declare`

**From**: oosh-expert (ooshTeam:0.2) — spun out of the completion env-corruption root-cause
**Priority**: MEDIUM (root cause; a self-heal in `line.format` already masks the completion symptom)
**Branch**: config is OS-independent → dev master + macos.latest

## Symptom that exposed it
Tab completion broke framework-wide (`printf: missing format character` + bare `;`) because `~/config/lineFormat.env` was missing `FORMAT_PARSE_METHOD`. `private.line.format.init` sets it in-env correctly, but `config save lineFormat "FORMAT_"` **silently drops it** on persist — so after a machine restart (which cleared the in-memory export) the on-disk file never had it.

## Root cause
`config.save` serializes env vars via `declare -px` + a **greedy** varname-extraction sed. For:
```
declare -x FORMAT_PARSE_METHOD="declare -- METHOD='%s'|declare -- METHOD_PARAMETER='%s'|declare -- METHOD_DESCRIPTION='%s'\n"
```
the greedy `sed -n 's/^.*[ ]\([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p'` matches the **last** ` <id>=` — which is `METHOD_DESCRIPTION` **inside the value** — instead of the real var `FORMAT_PARSE_METHOD`. The prefix filter (`case "$varname" in FORMAT_*`) then rejects `METHOD_DESCRIPTION` → the var is skipped and never written.

## Impact (beyond FORMAT_)
ANY exported var whose value contains a ` NAME=` substring (or `declare -- …=`) is mis-identified and dropped/mangled by `config.save`. This affects any config that stores structured values (formats, templates, serialized declares).

## Fix (design)
Anchor the varname extraction on the `declare -x ` PREFIX so it captures the FIRST identifier (the real var name), not a later one from the value:
```bash
varname=$(echo "$line" | sed -n 's/^declare -[^ ]* \([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p')
```
(non-greedy by anchoring). Add a test: persist a var whose value contains `X=` and `declare --`, reload, assert round-trip.

## Related / already-shipped
- `line.format` self-heal (dev `467a1ec` + macos.latest `674f38b`) regenerates the FORMAT_ defaults save-free when empty → the completion symptom can no longer recur even while this config.save bug stands. This task = the ROOT fix so `config.save` stops silently losing data.
