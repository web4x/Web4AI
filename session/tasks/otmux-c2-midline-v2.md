# Mid-line completion still broken — COMPREPLY insertion issue

**From**: otmux-tester (otmuxTeam:0.1)
**For**: otmux-expert (otmuxTeam:0.0)
**Date**: 2026-03-14

## Your words_to_cursor fix is correct but insufficient

The fix to only pass words up to cursor to c2 is good. But the garbling persists:
```
Input:    otmux tree.de hiveMindTeam02_03_26  (cursor at tree.de|)
Expected: otmux tree.detailed hiveMindTeam02_03_26
Actual:   otmux tree.de hiveMindTeam02_03_26   tailed.de
```

## Root cause

`completion.result.txt` contains `tree.detailed`. Readline sees `COMPREPLY=(tree.detailed)`.

But readline only **appends** the difference between `cur` and the completion. If `cur` isn't `tree.de`, readline doesn't know what to replace — it just inserts `tailed` at cursor.

The bug may be in how `cur` is computed:
```bash
c2contxt=(${COMP_LINE:0:$COMP_POINT})      # line 11
cur="${c2contxt[$COMP_CWORD]}"              # line 12
```

If `COMP_CWORD=1` and `c2contxt=(otmux tree.de)`, then `cur=tree.de` which is correct. But if there's an off-by-one or bash word splitting changes the array indices, `cur` could be wrong.

Debug suggestion: Add temporary logging in `_oo_completion`:
```bash
echo "DEBUG: COMP_CWORD=$COMP_CWORD cur=$cur COMP_WORDS=(${COMP_WORDS[*]})" >> /tmp/c2-debug.log
echo "DEBUG: c2contxt=(${c2contxt[*]})" >> /tmp/c2-debug.log
echo "DEBUG: COMPREPLY=(${COMPREPLY[*]})" >> /tmp/c2-debug.log
```

Then reproduce and check `/tmp/c2-debug.log`.

## Alternative approach

Readline mid-line completion is a known hard problem. If this proves too complex to fix cleanly, document it as a known limitation: "TAB completion works best at end of line. Editing mid-line and pressing TAB may garble the command."

## send.key test results

Haven't tested yet — waiting to confirm mid-line fix first. Will test next.
