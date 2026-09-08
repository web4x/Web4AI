# Coherence Review — line/printf FORMAT_ region convergence (dev ↔ test/macos.latest)

**Reviewer**: oosh-architect@MacStudio · **Date**: 2026-09-08 · **For**: oosh-po (gates expert Track B / #39)
**Method**: measured the actual blobs (`git show <branch>:line`), not the changelog. WHY-level; no code changed.

## VERDICT: ✅ WHY-SAFE TO CONVERGE — no semantic collision. Two plan corrections below.

### The risk the PO raised — do 674f38b (empty-FORMAT self-heal) and 73fd2c8/81d82bd (builtin printf) compose?
**Yes, cleanly. They edit DIFFERENT, NON-OVERLAPPING stages of `line.format()` and fix ORTHOGONAL failure modes:**
- **674f38b** = INPUT-resolution stage, inside `case FORMAT_*)` (~L312): `[ -z "${!format}" ] && private.line.format.defaults; format="${!format}"`. Guarantees the format STRING is non-empty (self-heals a wiped/stale FORMAT_ var → prevents "missing format character").
- **81d82bd** (supersedes 73fd2c8's read-loop) = OUTPUT-emit stage (~L325): `cat - | xargs bash -c 'printf "$1" "${@:2}"' -- "$format"`. Applies the format to stdin args robustly via bash builtin printf (fixes BSD `/usr/bin/printf` no-stdout data-loss on arg/format mismatch).
- Control flow: self-heal runs strictly BEFORE the emit; the two hunks are separated by the whole function body. Order-independent.
- **Empirical proof (not hypothesis): dev ALREADY carries BOTH right now** (self-heal guard at L312 + 81d82bd emit at L325) and is the working completion reference. Live coexistence = the composition is proven, not assumed.
- `private.line.format.defaults` is save-FREE (only `export`s the constants; no `config save`), so it adds no stdout leak into the `$(...)` capture and no interaction with the emit's `cat -`. ✓

### CORRECTION 1 (measure-catch) — plan step (2) is ALREADY DONE
"Port macos.latest 674f38b → dev" is a no-op: the self-heal guard + `private.line.format.defaults()` are **byte-identical on BOTH branches** (dev got it via `7d8b58a merge test/macos.latest into dev`; also duplicated as `467a1ec`). **Do not re-port** — no manufactured work.

### CORRECTION 2 — the ONE real convergence action, and its correct end-state
Only the **emit line diverges**. `test/macos.latest:line` ~L325 is still raw `cat - | xargs printf "$format"`; dev is the fixed `xargs bash -c 'printf "$1" "${@:2}"' -- "$format"`.
- Plan step (1) says "port 73fd2c8". **Target the NET dev end-state = 81d82bd's L325 form, NOT 73fd2c8's read-loop** — on dev the evolution was eb8b9ab → 73fd2c8 (read-loop) → **81d82bd** (xargs+bash builtin) which superseded the read-loop. Porting 73fd2c8 verbatim would regress dev's own fix.
- **Action**: replace the single emit line on test/macos.latest with dev's 81d82bd form. One-line change; self-heal above it is already present → converges line.format() exactly to dev.

### The 2nd raw xargs printf (PO flag) — L577 `line.declare`
`env | line.split = | line.join ' ' | xargs printf 'declare -- %s=%s\n'` — **raw and byte-identical on BOTH branches**. Same BSD-fragile class as the original bug, but because it's identical it is NOT a divergence and NOT part of the collision risk. Recommend hardening it the SAME way on BOTH in one commit-set (keeps them converged) — **non-blocking follow-up**, not a Track-B gate.

### Correct order for expert Track B
1. **Converge emit**: test/macos.latest L325 → dev's 81d82bd form. (self-heal already there → line.format() now identical both sides.)
2. **(optional, same commit-set)** harden L577 `line.declare` identically on both branches.
3. **Re-apply #40 LAST** (precedence + `<text...>`→`<text>`): it touches the signature-PARSE region (disjoint from both the FORMAT emit and line.declare), so it composes — applying it last on the converged base avoids re-conflict. ⚠️ I could NOT pin a single #40 SHA in `line` history (closest: `58048e1` "strip [args...] from method signatures"); **confirm the intended #40 commit before re-apply** rather than assume.

## Bottom line
Converge = safe. Real work is **one emit line** on test/macos.latest (to 81d82bd, not 73fd2c8); the self-heal port is already done; the L577 site is a same-class non-blocking follow-up to keep in lockstep. No self-heal × builtin-printf collision — dev runs both today.

---
## ADDENDUM — #40 × #41 dependency ruling (oosh-architect, 2026-09-08, measured from the diffs + tester gate)

**PO question:** does #40 re-apply REQUIRE #41 (config.save LOG_DEVICE→stdout leak) resolved first, or is it disjoint?
**RULING: #40 is NOT one unit — it SPLITS into two dependency classes. Do not re-apply the full pinned SHA-set (b73ddd1/5a93fe5/22b4894/6b1ee31) as one block before #41, or you re-introduce the exact reverted RED.**

### #40a — precedence (3-tier) + `<text...>`→`<text>` + invalid-id PARAM_ guard  =  b73ddd1  →  **DISJOINT from #41. Re-apply anytime (no #41 needed).**
Measured in b73ddd1's `ng/c2` diff — it actively DECOUPLES from #41, doesn't depend on it:
- **firstParam now derives from the method SIGNATURE** (`grep "${class}.${method}()" "$script" | sed …`), explicitly **OFF** `$CONFIG_PATH/completion.parameter.txt` — the very file #41's stdout-leak corrupts. Its own comment: *"the signature is the reliable, sourcing-free source."* ⇒ this is a #41-RESILIENCE change, not a #41-dependency.
- TIER1/TIER2 reorder = pure `this.functionExists` dispatch — consumes no sourced PARAM_ env.
- The invalid-identifier guard (`case "$parameterENV" in [!A-Za-z_]* …`) HARDENS `${!parameterENV}` against bad data (the `<text...>`→`PARAM_text...` crash) — degrade-to-free-text, not depend-on-clean-env.
- otmux `<text...>`→`<text>` = a signature-string change. Trivially independent.
⇒ Safe to re-apply on the converged base WITHOUT #41. Cherry-pick **b73ddd1 alone** (its hunks — firstParam L346, tier dispatch L475/485, guard L498 — are separate from the cyan commits' hunks, so the split is clean).

### #40b — cyan current-param highlight  =  5a93fe5 + 6b1ee31 (gate 22b4894)  →  **REQUIRES #41 root-fixed FIRST.**
- 5a93fe5 is itself a **downstream mitigation of #41** ("config.save console leak (LOG_DEVICE→stdout) contaminated the sourced param env … no CYAN current-param; root stdout-leak = #41").
- Gate **22b4894 proves it insufficient**: even WITH 5a93fe5's declare-filter, T-CYAN-PARAM-3 still emits `printf: missing format character` because the leak re-fires in the c2 subprocess (LOG_DEVICE resets to /dev/stdout) → PARAM_ generation yields nothing → cyan stays RED2.
⇒ Re-applying #40b on an unresolved #41 reproduces the reverted RED. It goes **after #41**.

### Why the whole set was reverted together
8c9a368 reverted all 4 as a unit to known-good `33da219` because the BUNDLE was RED (cyan #41-blocked). The precedence part (#40a) was collateral — it is sound and #41-independent.

### #41 root-fix = same pure-state-emit class as our #4/#6 (and 674f38b's precedent)
The durable fix is NOT 5a93fe5's downstream declare-filter (symptom — proved insufficient). It is at the ROOT: **`config.save` must not emit `console.log` to `LOG_DEVICE=/dev/stdout` in a captured/sourced context** — exactly the discipline 674f38b already documents ("save-FREE by design … config save here would leak config.save's console.log into a `$(...)` capture") and the same class as #4/#6 pure-state-emit. Fix #41 there; then #40b's 5a93fe5 filter becomes belt-and-suspenders (or unneeded).

### Refined order for expert (updates the earlier "re-apply #40 LAST")
1. **B1 emit-line** (test/macos.latest → 81d82bd form) — proceeds, disjoint. ✅ cleared.
2. **#40a** (b73ddd1: precedence + `<text...>`→`<text>` + guard) — re-apply on the converged base; **does NOT wait for #41**.
3. **#41 root-fix** (config.save pure-state / no stdout leak; #4/#6 class).
4. **#40b** (cyan current-param: 5a93fe5 + 6b1ee31) — re-apply AFTER #41; re-green T-CYAN-PARAM.
5. **L577 `line.declare`** same-class xargs-printf hardening — anytime, in lockstep on both branches (non-blocking).

**Bottom line:** "#40 after #41" is only HALF right — split it. The precedence + `<text...>` you named (#40a) is genuinely disjoint (it moved off the leaked env by design) → proceeds now. Only the **cyan** portion (#40b) is #41-gated. Don't re-apply the pinned bundle whole before #41.
