# Bug: systemic completion failure (c2 / _oo_completion)

**From**: oosh-po
**Owner**: oosh-expert (code, owns ng/c2 + c2.install) · oosh-tester (tests)
**Priority**: HIGH
**Date**: 2026-06-22
**Found on**: container 4faed70700c9 (dev), but suspected SYSTEMIC (all machines/branches)

## Symptom
Tab-completion / invoking an incomplete method misbehaves systemically. Observed:
- `oo ch<tab>` (or running `oo checkout` with no `<version>`) does NOT return clean candidates. It prints the method signature/usage repeatedly and drops into an interactive `your command >` prompt loop.
- This compounded with (now interim-fixed) `current.method.env` `'''` corruption — see task #2 — spamming `unexpected EOF / syntax error` on every command.

## Lead (PO investigation — start here)
1. **`templates/user/c2.install`** — the bash completion fn `_oo_completion()`:
   - line 31/33: calls `$OOSH_DIR/ng/c2 completion.discover "$COMP_CWORD" "$cur" <words..> -`
   - line 35: `COMPREPLY=( $(cat $CONFIG_PATH/completion.result.txt) )`
   - line 37: reprints `your command > <COMP_LINE>` (the string you saw)
2. **`$OOSH_DIR/ng/c2 completion.discover`** — the discovery logic that writes `completion.result.txt`. The systemic cause most likely lives HERE (parameter counting / method resolution returning usage text instead of candidates).

## Hypothesis to verify FIRST (likely connects both bugs)
**Does `ng/c2 completion.discover` (or the dispatch it triggers) WRITE `current.method.env`?**
If completion writes current.method.env with bad quoting (empty/quoted method → `'''`), then: completion → corrupts current.method.env → every later source errors → systemic spam. That would make task #2 and this bug the SAME root cause. Check whether c2/this writes current.method.env during the completion path, and whether an empty `cur`/method produces the `'''`.

## Asks
- Root-cause WHY completion enters the usage/`your command >` interactive loop instead of returning candidates from completion.result.txt.
- Confirm/deny the current.method.env link (hypothesis above).
- Fix in `ng/c2` and/or `c2.install`. DRY — one completion path.
- Determine scope: dev only, or also test/macos.latest (likely systemic).

## Report-back (edit here)
- Expert (2026-06-22, 33da219): ROOT CAUSE CONFIRMED — both bugs are SAME root cause in `c2.get.function.declaration`.
  - **`'''` corruption**: `line.split "|" | line.unquote` stripped closing quotes from `FORMAT_PARSE_METHOD` output, then `line.add "'"` re-added them as `echo -e "'$1'"` = `'''` (three quotes) on a NEW line instead of closing the last value. Fix: replaced pipeline with `sed 's/|/\n/g'` — splits on pipe without touching the quotes that `FORMAT_PARSE_METHOD` already generates correctly. Empty-pipeline guard prevents corruption when method doesn't exist.
  - **Usage text**: `c2.completion.discover` printed formatted function listing unconditionally to stdout at lines 332-334 (removed), and showed usage description for 0-match case (fixed: only show when count == 1, not 0).
  - Verified: `current.method.env` clean for valid methods, nonexistent methods, and parameter completion. No `'''`, no orphan quotes.
- Tester (2026-06-22, 8374cc5): T-COMPLETION **7/7 GREEN**. T1: multi-match prefix returns 18 candidates ✓. T2: no 'your command >' interactive loop ✓. T3: method.env clean after valid method ✓. T4: clean after nonexistent method ✓. T5: clean after parameter completion ✓. T6: nonexistent returns no candidates ✓. T7: no unconditional echo in code ✓. Both task#2 (''' corruption) and task#3 (completion loop) verified fixed.
