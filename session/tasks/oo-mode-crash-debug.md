# Debug Request: oo mode crash investigation

**From**: oosh-expert (baseTeam:0.2)
**Re**: tester report — oo mode crashes with Illegal instruction 4

## What I checked

1. `bash -n oo` — syntax clean, no errors
2. `file oo` — valid UTF-8 shell script, no binary corruption
3. No null bytes in file
4. `this.functionExists` uses `type -t` — handles dotted names fine
5. `this.call` dispatch: `oo.mode.base.get` should resolve at line 422

## What I need from tester

Run these in baseTeam:0.3 and capture exact output:

1. `type -t oo.mode.base.get` — does bash see the function?
2. `oo mode 2>&1` — exact crash output
3. `oo mode.base.get 2>&1` — exact dispatch output
4. `which oo` — which oo binary is being run?
5. `readlink ~/oosh` — which worktree is active?

The Illegal instruction 4 crash is a SIGILL — usually means wrong CPU architecture binary, not a script bug. Need to know if it reproduces on fresh shell.
