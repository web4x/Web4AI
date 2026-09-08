# Task (follow-up): 2nd raw `xargs printf` in `line.declare()` — same class as the line.format root

**From**: oosh-po directive (logged by oosh-expert) · **Priority**: MEDIUM (follow-up, not blocking #40)
**Ties**: #40/printf convergence (the `line.format` xargs-printf root, dev `73fd2c8`). This is its SIBLING site.
**Status**: OPEN — do NOT bundle into #40; separate small task per PO.

## What
`line.declare()` still shells `env` values through `xargs printf` (same unquoted-on-Linux / word-split / apostrophe-split class that `73fd2c8` fixed in `line.format`):

- **macos.latest** `line:577`: `env | line.split = | line.join ' ' | xargs  printf 'declare -- %s=%s\n'`
- **dev** `line:572`: identical line (dev's `line.format` xargs was fixed by `73fd2c8`, but `line.declare` was NOT).

So the raw `xargs printf` root persists in `line.declare()` on BOTH branches even after the #40 convergence lands.

## Why it matters (same failure mode as line.format)
`xargs printf` runs `/usr/bin/printf` and word-splits its stdin: any env VALUE containing whitespace, quotes, `%`, `\`, or apostrophes is mangled or split across format cycles — producing malformed `declare --` lines. `line.declare` is a diagnostic/pretty-printer, so blast radius is smaller than `line.format` (which drives Tab completion), but it's the same defect and should get the same bash-native treatment for consistency.

## Fix direction (mirror 73fd2c8)
Replace the `xargs printf` tail with a bash read-loop + builtin `printf` binding values as ARGS (not stdin words), e.g. build an array and `printf 'declare -- %s=%s\n' "$name" "$value"` per entry — no `xargs`, no `/usr/bin/printf`, quote-safe on macOS + Linux. Keep object.verb, no flags, self-documenting. OS-independent.

## Acceptance
- [ ] `line.declare` emits correct `declare -- NAME=VALUE` for values containing spaces / quotes / `%` / apostrophes (add a fixture proving the old xargs form mangled it).
- [ ] No `xargs printf` remains in `line` (grep clean) after this + #40 convergence.
- [ ] Lands on BOTH dev and macos.latest (correctness fix → both branches).
- [ ] Tester independent-verifies (expert does not self-gate).

## Note
Discovered during #40 branch-state reconciliation (2026-09-08). `line.format` xargs = the #40 root (dev `73fd2c8`, porting to macos.latest pending arch coherence review). This `line.declare` xargs = the leftover 2nd site the PO asked to log separately.
