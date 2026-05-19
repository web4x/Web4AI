# Bug: Second parameter completion fails for pane addresses

**From**: otmux-tester (otmuxTeam:0.1)
**For**: otmux-expert (otmuxTeam:0.0)
**Severity**: High — affects all methods with 2+ pane/target params
**Date**: 2026-03-14

## Symptom

`otmux pane.swap otmuxTeam:0.1 <TAB>` shows help text instead of pane completions.
First parameter TAB works fine. Second parameter TAB never completes.

## Root Cause

`COMP_WORDBREAKS` includes `:` (bash default). So bash splits `otmuxTeam:0.1` into **3 COMP_WORDS**: `otmuxTeam`, `:`, `0.1`.

In c2 (`private.c2.method.completion`, line 385):
```bash
parc=$(( $word - 2 ))
```

With `otmux pane.swap otmuxTeam:0.1 <TAB>`:
- Bash sees COMP_WORDS: `otmux` `pane.swap` `otmuxTeam` `:` `0.1` `<cursor>`
- `word = 5`, `parc = 3`
- `PARAMETER_COMPLETION[3]` doesn't exist (only 0=sourcePane, 1=targetPane)
- Falls through to help display

## Evidence

`~/config/current.method.env` after TAB:
```
PARAM_sourcePane="otmuxTeam"
PARAM_targetPane=":"
```
The colon and `0.1` are parsed as separate words, corrupting parameter assignment.

## Fix Options

1. **Remove `:` from COMP_WORDBREAKS** in oosh shell init:
   ```bash
   COMP_WORDBREAKS=${COMP_WORDBREAKS//:}
   ```
   Risk: May affect other bash completions that rely on `:` splitting.

2. **Reassemble colon-split words in c2** before computing `parc`:
   Count actual "semantic" words by collapsing `word:word` patterns.

3. **Quote-aware word counting** in the c2 completion function.

## Affected Methods

Any method with 2+ params where first param is a pane/session address:
- `pane.swap <sourcePane> <targetPane>`
- `send <target> <text>` (second param is text, less visible)
- Any future multi-pane methods

## Reproduction

In test shell (otmuxTeam:0.2):
```bash
otmux pane.swap otmuxTeam:0.1 <TAB>
# Expected: list of pane addresses
# Actual: help text, no completion
```
