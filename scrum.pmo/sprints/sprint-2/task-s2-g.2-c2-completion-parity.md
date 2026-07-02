> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.2: c2 completion parity — dev vs macos.latest
[task:uuid:bdf80164-4dfd-42b1-9b92-05b3c6a0d82a]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Role: architect/expert (compare) → tester (verify).** Tron: "check if c2 completion works the same in both branches." Diff `c2` (+ completion wiring) dev↔macos.latest; determine if completion behaves identically; if divergent, decide canonical (newer/more-correct) + fix the lagging branch.

## Definition of Done
- c2 completion behavior compared dev↔macos.latest (measured, not assumed)
- divergence (if any) named + canonical side chosen + fix planned
- T-C2-PARITY or documented parity confirmation

## ARCHITECT COMPARISON + VERDICT (oosh-architect, 2026-07-02) — measured dev vs origin/test/macos.latest
**c2 completion is DIVERGENT. Canonical = DEV (newer + more-correct + already test-proven). macos.latest LAGS with the old buggy c2. Fix = forward-port dev→macos.latest (NOT reverse).**

### Measured (`git diff` on `ng/c2`)
- Function set: **IDENTICAL** (same c2.* inventory; the completion WIRING — registration/source.env — is unchanged). Divergence is purely in the completion LOGIC: dev 667 lines vs macos 651 (dev +16; 48 lines changed).

### The 3 dev-only completion fixes macos.latest is MISSING
1. **`'''`-crash guard** — `c2.get.function.declaration` restructured the `current.method.env` write (`{ [ -n _decl ] && echo; echo declare SCRIPT/CLASS; } > file`) so it never emits a bare `'''`. macos still has the OLD `methodOutput … line.unquote | line.add "'"` path = the crash source. (`f13f35d`)
2. **`bash -n` before source** — `c2.get.function.parameter` on dev syntax-checks `current.method.env` before sourcing (`[ -f … ] && bash -n … && source`); macos sources UNCONDITIONALLY → crashes on a malformed file. (`f13f35d`)
3. **parameter-completion + count fix** — `c2.completion.discover` on dev: extracts the first `<?param>` from the function signature and calls `<class>.<method>.completion.<param>` (the fix for parameter completion never running — the `client.choose.tree` bug in the code comment), plus `count<=1` (dropped `&& count>0`) so the description shows for 0-or-1 matches (fixes the "returning `;`" bug), plus red-highlight of the matched method. macos lacks ALL of this. (`d83907b`)

### Verdict
- **Canonical = dev.** It's strictly newer + fixes real crashes/gaps, and it's **already test-proven** — the CS-6 `T-C2-QUOTE` suite (3/3 GREEN, commit `53729c0`) verifies exactly #1/#2 (inject `'''` → no crash, file valid after). macos.latest carries the pre-fix c2 (the `'''` crash + no param completion).
- **Fix (not a redesign): forward-port dev's `ng/c2` to macos.latest** — same direction as the clean-boot S3 parity + g.3 branch-reliable (dev→macos). A merge/port, not new design. Confirm the completion wiring (source.env `complete -F` registration) is identical post-port (measured identical now).
- **NOT reverse** — never regress macos to the buggy old c2.

## Report-back
- Expert/architect (c2 diff + verdict): **DONE 2026-07-02 (architect)** — c2 completion DIVERGENT; canonical = DEV (3 fixes macos lacks: `'''`-crash guard + `bash -n`-before-source [f13f35d], param-completion + count-fix [d83907b]); dev is test-proven (T-C2-QUOTE 3/3, 53729c0). Fix = forward-port dev→macos.latest (merge/port, not redesign). Wiring identical; only completion logic diverges.
- Tester (parity check): after the port — `T-C2-PARITY`: c2 completion identical both branches; T-C2-QUOTE (broken method.env → no crash, file valid) passes on macos.latest too.
