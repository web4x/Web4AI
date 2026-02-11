# Fix: Stop truncating monitoring output

When running `hiveMind sweep` or `otmux pane.capture`, do NOT pipe through `head` or `tail`. You need the FULL output to detect permission prompts and stuck agents.

**Wrong:** `./hiveMind sweep projectTeam 2>&1 | head -40`
**Wrong:** `./hiveMind sweep projectTeam 2>&1 | tail -60`
**Right:** `./hiveMind sweep projectTeam`

Truncating means you could miss a stuck agent or permission prompt in the lines you cut off.
