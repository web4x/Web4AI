# BUG: c2 completion crashes on Tab — triple-quote corruption in current.method.env

**From**: oosh-po@WODA.prod (Tron-reported, reproduced live)
**Owner**: oosh-expert (fix) → oosh-tester (T-C2-QUOTE)
**Priority**: HIGH — breaks Tab completion for ALL oosh commands
**Sprint**: constructor-contract (added as S-10)
**Status**: IN PROGRESS — expert assigned

## Symptom

`otmux attach [Tab]` (and potentially any oosh command Tab) produces:
```
current.method.env: line 2: unexpected EOF while looking for matching `''
current.method.env: line 5: syntax error: unexpected end of file
```
Repeats on every Tab press. Reproduced on WODA.prod ooshTeam:0.5 and confirmed from Tron's iPhone screenshot.

## Root cause (measured)

`ng/c2` line 164: `| line.add "'" >$CONFIG_PATH/current.method.env`

When the method declaration grep (line 155) finds NO match (empty pipeline output), `line.add "'"` wraps nothing → writes `'''` (three single quotes) to `current.method.env`. The file content becomes:
```
'''
declare -- SCRIPT=/root/oosh/otmux
declare -- CLASS=otmux
```

Then `ng/c2` line 191: `source $CONFIG_PATH/current.method.env` — bash tries to parse `'''` → unmatched quote → syntax error.

The file is RE-CORRUPTED on every Tab press (the pipeline re-runs), so manually fixing the file is useless.

## Fix (two guards)

1. **Guard the WRITE (line 164)**: if the pipeline output is empty, write a valid empty declaration (just SCRIPT+CLASS vars), not `'''`. Something like:
   ```bash
   local declaration=$(... pipeline ...)
   if [ -n "$declaration" ]; then
     echo "$declaration" > "$CONFIG_PATH/current.method.env"
   else
     > "$CONFIG_PATH/current.method.env"  # empty file, not '''
   fi
   ```

2. **Guard the SOURCE (line 191)**: before `source $CONFIG_PATH/current.method.env`, validate with `bash -n` or check file is non-empty and parseable. Self-heal: if invalid, truncate to empty and continue (don't crash the completion).

## Constructor contract application

`current.method.env` is a state file. Per the constructor contract: it must ALWAYS be valid after write (never `'''`), and sourcing it must ALWAYS succeed (self-heal on broken content, never crash). The c2 completion system is a constructor — it must always yield a valid completion state.

## Acceptance criteria

- [ ] `otmux attach [Tab]` produces session list with zero errors
- [ ] Any oosh command with no matching method → Tab → no crash (empty completion, not syntax error)
- [ ] `current.method.env` never contains `'''` or any unparseable content after c2 runs
- [ ] Guard on source: broken `current.method.env` → self-heal (truncate + continue), never crash
- [ ] Test: T-C2-QUOTE — write `'''` to current.method.env → c2 completion → no crash + file healed

## Report-back (edit here)
- Expert (c2 fix + commit): **DONE** `f13f35d` — write guard (empty pipeline → SCRIPT+CLASS only, no `'''`), source guard (bash -n before source, broken file skipped). PO-verified: `otmux attach [Tab]` → zero errors, completion shows methods.
- Tester (T-C2-QUOTE): pending
