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
