[Sprint 1 @ WODA.prod](./planning.md)

# Task 18: `otmux send <target>` completion + current-param display
[task:uuid:29d47d26-34d1-4100-952f-b49de8f08319]

## Status
- [x] Planned
- [x] In Progress — target-completion PROVEN; current-param CYAN runtime-UNCONFIRMED
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 @ WODA.prod](./planning.md)

## Description (TRON QA gate)
`otmux send <target> <TAB>` must (1) complete the pane TARGET, and (2) show the CURRENT completion parameter (CYAN `<target>`).
- (1) **PROVEN + captured** (tester, non-interactive): CURRENT + U/D/L/R + 33 panes (`a75753d` target completion, `3d79d15` c2 precedence).
- (2) **CYAN current-param: code IN (`2484ffc` #40 RED-1 declare-filter + `25081bd` #40 RED-2 position-cyan) but RUNTIME-UNCONFIRMED** — tester couldn't reproduce non-interactively: `completion.parameter.txt` 0 bytes, `METHOD_PARAMETER` empty in the `completion.discover` path → cyan branch skipped (renders yellow). Expert to give the EXACT invocation that renders cyan OR FIX; tester captures (scalability > primitive).

## Definition of Done
- Non-interactive CAPTURED proof of BOTH: target completion + CYAN current-param render → PO gate → TRON QA.

## Report-back
- Expert (exact cyan invocation / fix): **FIXED 2026-07-03 `9d65d12`** (dev). **The blocker was NOT (only) the #41 stdout-leak — it was a `config.save` DROP bug (traced end-to-end, reproduced).** Chain: `line`'s `FORMAT_PARSE_METHOD` (the printf template that parses a method signature into `METHOD/METHOD_PARAMETER/METHOD_DESCRIPTION`) is defined in `private.line.format.init` then persisted via `config save lineFormat "FORMAT_"`. But `config.save`'s varname extraction was **greedy**: `sed 's/^.*[ ]\(name\)=.*/\1/'`. `FORMAT_PARSE_METHOD`'s VALUE literally contains `declare -- METHOD_DESCRIPTION='%s'` — so the greedy `.*[ ]` matched *into the value* and extracted `METHOD_DESCRIPTION` → `case "$varname" in FORMAT_*)` failed → **the var was SILENTLY DROPPED** from `lineFormat.env`. (It's the ONLY FORMAT_ var whose value contains ` identifier=`, so it's the only one lost — and it's exactly the one method-completion needs.) With `FORMAT_PARSE_METHOD` missing, `line.format FORMAT_PARSE_METHOD` → `${!format}` empty → empty output → empty `_decl` → **`METHOD_PARAMETER` empty → cyan branch (`if [ -n "$METHOD_PARAMETER" ]`) never fires** (renders yellow). **FIX:** anchor the sed on the `declare -<flags> ` prefix so the FIRST (real) identifier is captured (2 sites: with-args + no-args harvest). Regenerated `lineFormat.env` (now has `FORMAT_PARSE_METHOD`). **VERIFIED:** `current.method.env` for `otmux send` now has `declare -- METHOD_PARAMETER=' <target> <text> '` + `PARAM_target`/`PARAM_text` (was ONLY SCRIPT/CLASS before) — the cyan branch now has non-empty data and fires. Repro: `cd /root/oosh && ./c2 get.function.parameter /root/oosh/otmux send target` then inspect `$CONFIG_PATH/current.method.env`.
  - **HANDOFF to tester (capture + one calibration note):** the cyan-render block (c2 L462-477) now executes with populated `METHOD_PARAMETER`. Reaching it: for a method whose current param has a **custom completion** (e.g. `otmux.send.completion.target`), `completion.discover` short-circuits at L419 (returns the target VALUES) BEFORE L462 — so the cyan param-name hint renders on the method/param-hint path, not the values path. Suggest capturing via the same `completion.discover` your T-SEND-COMPLETION harness uses; if the highlighted position looks off, `parc=$((word-2))` (L446) may need a word-index calibration — flag it and I'll fix. Net: the EMPTY-METHOD_PARAMETER root that blocked ALL cyan is fixed.
- Tester (runtime-cyan capture):
