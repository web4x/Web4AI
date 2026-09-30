# otmux usage advertises methods that do not dispatch (pane.zoom, selectWindow, selectPane; zoom sets no flag)

**Owner:** otmux (ooshTeam: oosh-expert + oosh-tester, routed via oosh-po). **Filed by:** oopPO@WODA.prod, 2026-09-30, from ARON's aborted drive of oosh-po.
**Severity:** MEDIUM-HIGH — it blocked a rewind drive mid-procedure (3 failed attempts) on a 19-row pane where the rewind picker cannot render its options.

## Measured
- `otmux pane.zoom`, `otmux selectWindow`, `otmux selectPane` → **NOT IMPLEMENTED**, yet all three are listed in `otmux` usage (ARON, mid-drive).
- `otmux zoom <target>` runs silently but `#{window_zoomed_flag}` stays **0** (ARON).
- The raw mechanism works: `tmux resize-pane -Z -t ooshTeam:0.0` → `window_zoomed_flag=1`, pane 126x19 → **253x63**; a second `-Z` → back to 126x19 (oopPO, verified 2026-09-30).
- The window itself is NOT collapsed (253x64, `window.size.lock` would not help): the 19 rows come from 6 panes stacked 3 high.

## Why it matters (first principles)
In OOSH the code IS the documentation: a usage block that lists methods which do not exist breaks the self-explaining contract. And zoom is the only sanctioned remedy for driving a rewind picker in a multi-pane window (a picker needs ~30+ rows; a 3-high stack gives 19-22).

## Required
1. `otmux zoom <target>` actually zooms (flag = 1) and a matching unzoom/toggle exists; a failable test asserts the FLAG, not the exit code.
2. Every method listed in `otmux` usage dispatches — a test derives the list FROM the usage block and calls each (no hand-kept list).
