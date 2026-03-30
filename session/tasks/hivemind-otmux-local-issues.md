# Task: hiveMind + otmux issues found on McDonges local testing

**Reported by**: PO (from Tron's local shell TRONinterface:0.3 scrollback)
**Machine**: McDonges (local)

## Issue 1: hiveMind consistency.audit misses most local panes

`otmux` shows 6 panes on McDonges:
```
TRONinterface:0.0  ✳ product-owner@opus  [2.1.76]
TRONinterface:0.1  McDonges-4.fritz.box  [bash]
TRONinterface:0.2  McDonges-4.fritz.box  [bash]
TRONinterface:0.3  ooshShell             [2.1.76]
MacStudio_window:0.0  McDonges-4.fritz.box  [bash]
MacStudio_window:0.1  McDonges-4.fritz.box  [bash]
```

But `hiveMind consistency.audit` only shows:
```
Summary: 1 consistent, 0 inconsistent
```
Only TRONinterface:0.0 (product-owner) is audited. The other 5 panes are invisible to the audit.

**Expected**: All 6 panes should appear in the audit. Non-Claude panes (bash shells) should show as "no agent" or similar, not be silently skipped.

## Issue 2: otmux pane.title has no target completion

When typing `otmux pane.title T[Tab]`, the c2 completion shows the method help text again instead of completing to available pane addresses (e.g., `TRONinterface:0.0`).

The `<target>` parameter in all otmux pane methods needs a completion function that lists available `session:window.pane` addresses. This applies to: `pane.capture`, `pane.title`, `pane.send`, `pane.select`, `pane.kill`, `pane.lock`, etc.

**Expected**: `otmux pane.title T[Tab]` → completes to `TRONinterface:0.0`, `TRONinterface:0.1`, etc.

## Issue 3: oo mode completion shows stale _base method

After d026f82 renamed `oo.mode._base` to `oo.mode.base.get`, the old `_base` still appears in Tab completion on McDonges:
```
oo.mode._base # # returns the OOSH components base directory
oo.mode.base # <?path> # show or set the OOSH components base directory
```

Later (after git pull of newer code) it shows correctly:
```
oo.mode.base.get # # returns the OOSH components base directory
oo.mode.base.set # <path> # set and persist the OOSH components base directory
```

This may be a stale code issue (old symlink) rather than a bug, but verify that completion always reflects current code.

## Who fixes what

- **Issue 1**: hiveMind-expert — audit should enumerate all panes, not just registered ones
- **Issue 2**: otmux-expert (or oosh-expert) — add `otmux.pane.completion.target()` that lists pane addresses
- **Issue 3**: oosh-expert — verify completion reflects current code after branch switch
