# Bug: TAB completion at mid-line cursor position garbles the line

**From**: otmux-tester (otmuxTeam:0.1)
**For**: otmux-expert (otmuxTeam:0.0)
**Severity**: Medium — affects usability when editing commands
**Date**: 2026-03-14

## Symptom

User types: `otmux tree.de hiveMindTeam02_03_26`
Moves cursor back to after `tree.de` and presses TAB.

Expected: `tree.de` completes to `tree.detailed`, existing text preserved correctly.
Actual: Line becomes `otmux tree.de hiveMindTeam02_03_26   tailed.de` — garbled.

## Root Cause

In `2c.intsall`, line 25:
```bash
$OOSH_DIR/ng/c2 completion.discover "${COMP_CWORD}" "$cur" ${COMP_WORDS[*]} -
```

`COMP_WORDS` includes ALL words on the line, including those **after** the cursor.
When cursor is at position 1 (`tree.de|`), `COMP_WORDS=(otmux tree.de hiveMindTeam02_03_26)`.

c2 correctly identifies `tree.de` at index 1 and returns `tree.detailed` as completion.
But readline inserts `tailed` (the suffix) at the cursor position without removing the trailing text.

## Analysis

This is a readline behavior: when `COMPREPLY` contains a completion and the cursor is mid-line, readline inserts the completion suffix at the cursor but doesn't trim what follows. The completion function needs to handle this.

## Fix Options

### Option 1: Only pass words up to COMP_CWORD to c2
```bash
# In _oo_completion, only pass words up to cursor
local words_to_cursor=("${COMP_WORDS[@]:0:$((COMP_CWORD+1))}")
$OOSH_DIR/ng/c2 completion.discover "${COMP_CWORD}" "$cur" ${words_to_cursor[*]} -
```
This ensures c2 only sees what's before/at the cursor, but doesn't fix the readline insertion issue.

### Option 2: Use COMP_LINE up to COMP_POINT
Line 11 already does this: `c2contxt=(${COMP_LINE:0:$COMP_POINT})`
But `cur` and the c2 call still use `COMP_WORDS`/`COMP_CWORD` which include all words.

### Option 3: Investigate readline's `complete -o` options
`-o nospace` is already used. There may be options that control mid-line insertion behavior.

## Reproduction (in otmuxTeam:0.2)
```bash
# Type full line:
otmux tree.de hiveMindTeam02_03_26
# Move cursor left 24 chars (to after tree.de)
# Press TAB
# Observe garbled line
```

## Notes
- This is a bash readline edge case, not specific to otmux
- Affects ALL oosh commands when user edits mid-line and TABs
- The `your command >` prompt (line 34) correctly shows cursor position split with green/red
