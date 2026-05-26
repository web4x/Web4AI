# BUG — otmux fit TAB COMPLETION broken

**Reporter**: Tron via PO (ooshTeam:0.0) 2026-05-26
**CORRECTED scope** (PO 2026-05-26): bug is in Tab completion of `otmux fit `, NOT in the fit method's size logic. Initial misread — fit itself returns 57x34 which IS the operator's writable client size (correct behavior). Tron saw the small size and the bug-symptom was the completion fragment, not the size.
**Symptom**: `otmux fit ` + Tab does not produce expected session-name completions
**Test method**: send `otmux fit ` + Tab to expert-shell pane, capture output
**Impact**: HIGH — Tab is the primary discovery UX in OOSH
**Assignee**: oosh-expert
**Related**: bug-tab-completion-accept-edits.md (PO suggested possible accept-edits interference; may share root cause)

## Hypothesis (revised)

`otmux.fit.completion.session()` exists (otmux line 1350): `private.complete.sessions`. That helper at line 49 runs `$TMUX_CMD list-sessions -F "#{session_name}"`. Should produce session names. Possible failure modes:

1. **c2 lookup failure**: `c2.completion.discover` walks the script for `*.completion.*` signatures — maybe the parameter name `session` doesn't match `fit`'s declared parameter (it's `<?session>` per the doc comment, which c2 parses as `OPTIONAL_session` → PARAM_session). If the parsed name diverges from the completion function's suffix, c2 falls through to defaults.
2. **First arg is optional `<?session>`**: c2 may skip optional-leading args under some path, returning empty.
3. **Sourcing order**: completion handler may run in subshell where `private.complete.sessions` isn't visible.
4. **bash-completion path**: ooshTeam shells start under `bash --init-file source.env` or similar — bash completion may not see oosh scripts.

## Investigation plan (interactive)

1. Send `otmux fit ` then Tab to ooshTeam:0.4 (expert-shell)
2. Capture pane immediately after — observe what completions appear (session names? nothing? fragment?)
3. Send Ctrl-c to clear, repeat with verbose tracing
4. Inspect c2 completion engine path for `fit` parameter

## Investigation plan

1. Read `otmux.fit` implementation: how it picks "caller's terminal" size
2. `tmux list-clients` to see attached clients + sizes
3. Reproduce: run `otmux fit` from ooshTeam, capture size before/after, compare to actual terminal `tput cols`/`tput lines`
4. Check if D5 stale-client sweep ran before fit was tested (stale clients may have been present)

## Findings

**Root cause**: any `'` in a method's doc comment breaks `c2.get.function.declaration`.

The pipeline at `c2:154-163` pipes the function signature through `line.format FORMAT_PARSE_METHOD`. `line.format` is `cat - | xargs printf "$format"` — xargs parses shell-like quotes. A single `'` in the input pops xargs's quote state, mangles the field split, and produces malformed bash output to `$CONFIG_PATH/current.method.env`:

```
'''
declare -- SCRIPT=/Users/donges/oosh/otmux
declare -- CLASS=otmux
```

That first line `'''` is unclosed bash. Sourcing it produces `unexpected EOF while looking for matching ''`, which prevents `c2.completion.discover` from completing the param-completion call chain. Bash completion then falls back to its default (filename completion or the buggy fragment Tron observed).

Reproduce: `c2 completion.discover 2 - otmux fit`. The signature line `otmux.fit() # <?session> # resize session window to caller's terminal cols×rows (snaps to current client)` contains `'` in "caller's" — bug triggers.

**Impact survey**: 9 methods across oosh have apostrophes in their doc comments. ALL have broken Tab completion today:
- `hiveMind.join` (agent's), `hiveMind.team.migrate` (remote's), `hiveMind.agent.unblock` ('all')
- `private.hiveMind.pane.model` (claude's)
- `otmux.fit` (caller's), `otmux.attach` ('readonly'), `otmux.pane.size` ('WxH'), `otmux.status` ('otmux tree')
- `state.add` ('setup')

## Fix

Strip single quotes from the signature line before piping to `line.format`. One-line `sed "s/'//g"` inserted in the c2 pipeline.

Apostrophes in doc comments are display-only — losing them in the parsed METHOD_PARAMETER/DESCRIPTION env vars is acceptable; what matters is `current.method.env` is valid bash. Doc-comment display in tab completion already loses formatting in many ways (gets colored + line-broken); stripping `'` is a no-impact fix for the operator UX.

Diff: c2 line ~159 — insert ` | sed "s/'//g" \` between `line.replace " {"` and `line.unify '#'`.

## Verification

Post-fix interactive test:
```bash
tmux send-keys -t ooshTeam:0.4 "otmux fit " Tab Tab
otmux pane.capture ooshTeam:0.4 25
```
Output: session names appear (`McDonges_native_TRONinterface`, `TRONinterface`, `UpDown_ai_po`, ...). No `unexpected EOF` errors. Same fix applies to all 9 affected methods automatically — no per-method changes needed.

## Commit

`c2: strip apostrophes from signature pipeline — fix completion for 9 methods (ref: bug-otmux-fit-too-small.md)`

## Status (closure)

- **Investigation**: routing/sizing were red herring. Bug is in c2 completion engine, not otmux.fit.
- **Real bug**: line.format's xargs-based parser breaks on `'` in input — produces malformed bash in `current.method.env` → completion path errors → bash falls back to defaults
- **Fix shipped**: commit `<filled-after-commit>` — single sed insertion in c2 pipeline, 1+/0-
- **Verification**: interactive Tab on `otmux fit ` now shows session names cleanly. 9 methods fixed by one-line change.
- **Handoff to tester**: verify Tab completion on all 9 listed methods + regression on non-apostrophe methods (e.g. `hiveMind team.setup `).
- **Related task**: bug-tab-completion-accept-edits.md RESOLVED as duplicate — same fix.

## Tester Verification (oosh-tester, 2026-05-26)

### Fix present: PASS
- c2 line 159: `| sed "s/'//g" \` — strips apostrophes from signature pipeline.

### Apostrophe methods (8 found, 1 private filtered): PASS
- `c2 completion.discover 2 - otmux fit` → shows `<?session>` param correctly
- Apostrophe stripped in display ("callers" not "caller's") — acceptable, no functional impact
- All 8 public methods have apostrophes only in doc comments, not in param names — fix covers all

### Non-apostrophe regression: PASS
- `c2 completion.discover 2 - hiveMind team.setup` → shows `<roles> <?session>` correctly
- No malformed output, no bash errors

### Duplicate bug (bug-tab-completion-accept-edits.md): PASS
- Root cause identical — c2 pipeline failure → bash filename fallback → "pletion on" fragment
- Fix at `4338d2c` resolves both simultaneously

**Verdict: VERIFIED. Both bugs closed.**
