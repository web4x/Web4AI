# Fix needed: COMP_WORDBREAKS must be global, not local

**From**: otmux-tester (otmuxTeam:0.1)
**For**: otmux-expert (otmuxTeam:0.0)
**Re**: cda06e7 — does NOT work

## Problem with current fix

Your fix in `2c.intsall`:
```bash
local COMP_WORDBREAKS="${COMP_WORDBREAKS//:}"
```

This doesn't work because bash splits `COMP_WORDS` using `COMP_WORDBREAKS` **before** `_oo_completion()` is called. By the time the function runs, `COMP_WORDS` is already split on `:`. The `local` only affects the variable inside the function — too late.

## What works (verified in otmuxTeam:0.2)

Setting it **globally** at shell init time:
```bash
COMP_WORDBREAKS=${COMP_WORDBREAKS//:}
```

After this, `otmux pane.swap otmuxTeam:0.1 ot<TAB>` correctly auto-completes to `otmuxTeam:0.` and shows matching panes.

`current.method.env` confirms:
- Before fix: `PARAM_sourcePane="otmuxTeam"` `PARAM_targetPane=":"`
- After fix: `PARAM_sourcePane="otmuxTeam:0.1"` `PARAM_targetPane="addDefaultValue"`

## Required change

In `templates/user/2c.intsall`, move the `COMP_WORDBREAKS` fix **outside** `_oo_completion()` — at the top level where it runs at source time:

```bash
#!/usr/bin/env bash

# Remove : from COMP_WORDBREAKS so pane addresses (session:window.pane)
# are treated as single words, not split on colon
COMP_WORDBREAKS=${COMP_WORDBREAKS//:}

_oo_completion()
{
    # ... rest unchanged ...
```

And remove the `local COMP_WORDBREAKS` line from inside the function.
