# Task: c2 completion — "parameter completion over method completion" + fix `<text...>` invalid-identifier crash

**From**: oosh-po@MacStudio (ooshTeam:0.0) · **To**: oosh-expert (ooshTeam:0.2) · **Priority**: HIGH (Tron directive, live-reproduced)
**Ties**: #21 (completion-system audit+fix). **Branch**: c2 + otmux are OS-independent → land on **`dev`** (master); ensure **`macos.latest`** carries it so Tron verifies live on MacStudio.

## Tron's live repro (MacStudio)
```
otmux send D "echo test the west"   ← Tab
```
- Showed the `send.*` SUB-METHOD list (send.enter/key/raw/tui/verified/zoomed) instead of completing `send`'s parameters.
- At the param-2 position it fired the **target** (param-1) completion (`testSend:0.`) instead of param-2, and **never showed the `<target>`(yellow)/current-param(cyan) tracking line**.

## Root cause (PO-reproduced via `ng/c2 completion.discover 3 "" otmux send D -`) — TWO defects
1. **`<text...>` is not a valid bash identifier.** `otmux.send() # <target> <text...>` → c2 does `declare PARAM_text...=…` → **`ng/c2: line 473: PARAM_text...: invalid variable name`** (crash on the `${!parameterENV}` indirect expansion). Param-2 tracking dies → falls back to param-1 (target), no cyan/yellow line. `<text...>` is the ONLY such violation (grepped otmux/hiveMind/claudeCode/oo/config/state — isolated).
2. **Precedence check too narrow (c2 ~lines 349-360).** It only skips the sub-command listing when `this.functionExists $class.$method.completion.$firstParam || $class.$method.completion`. But `otmux send` has **no own completion** — its `target` param completes via the **class-level** `otmux.parameter.completion.target`. That class-level path is NOT recognized → sub-methods get listed. This is Tron's directive: **when the typed word is a complete method that has parameters (incl. class-level `$class.parameter.completion.$param`), prefer PARAMETER completion over METHOD/sub-command completion.**

## Your subtask (HOW — expert designs; these are the WHAT/WHY + acceptance)
- **Fix 1 (naming):** rename `otmux.send`'s 2nd param `<text...>` → a valid identifier (`<text>`; body already uses `$2`/`$*`, semantics unchanged). Verify no other `...` param names anywhere (audit).
- **Fix 2 (c2 precedence, Tron directive):** extend the skip-sub-commands check so a method with parameters completed via **class-level** `$class.parameter.completion.$firstParam` ALSO prefers parameter completion over sub-method listing. Parameter completion wins over method completion once a full method with params is on the line.
- Preserve the multi-param tracking (parc/currentParameter cyan-highlight) — it must now actually fire for `otmux send` (param1=target cyan, param2=text).
- Keep it OS-independent; no flags; object.verb; self-documenting.

## Acceptance (PO QA gate — I inspect the diff + re-run the repro)
- [ ] `otmux send <Tab>` → completes **target** (parameter), does NOT list `send.*` sub-methods.
- [ ] `otmux send D <Tab>` → param-2 position: no crash, shows the `<target>`(yellow) `<text>`(cyan) tracking line; no `PARAM_text...: invalid variable name`.
- [ ] `ng/c2 completion.discover 3 "" otmux send D -` → clean (no `invalid variable name`).
- [ ] No regression: `otmux send.key D <Tab>` still offers key completion; a method that IS a pure prefix (no own params) still lists sub-methods.
- [ ] Lands on `dev`; macos.latest carries it (Tron verifies live). Diff scope = c2 + otmux only.
- [ ] Report commit hash(es) here → then tester independent completion regression test (separate subtask).

---
## REFINEMENT (Tron) — implement the 3-TIER precedence, now a documented PRINCIPLE
Added to `docs/first-principles.md` (Bash Completion → Completion Precedence). Fix 2 must implement EXACTLY this order:
1. **Method-specific param completion HARD-OVERWRITES the standard:** `<class>.<method>.completion.<param>` wins over class-level `<class>.parameter.completion.<param>`. (Method completion goes over standard parameter completion.) — c2's `private.call.custom.completion` already tries method-specific before class-level; PRESERVE that ordering, make it explicit/robust.
2. **Standard class-level param completion = default fallback** when no method-specific exists.
3. **Parameter completion (either tier) is USED over method/sub-command listing:** once a full method+params is on the line, complete the PARAMETER — do NOT list sub-methods. This is the precedence check at c2 ~lines 349-360 that must also recognize the **class-level** `<class>.parameter.completion.<param>` (currently it only recognizes `<class>.<method>.completion*` → the otmux-send bug).
Acceptance additions:
- [ ] A method with its OWN `<method>.completion.<param>` uses it (hard overwrite), NOT the class-level default, for that param.
- [ ] A method with only a class-level `parameter.completion.<param>` STILL does parameter completion (not sub-method listing).
- [ ] Behavior matches the documented principle in `docs/first-principles.md`; update `docs/completion-system.md` to cross-reference it.

---
## FINDINGS for expert (PO-measured) — cyan current-param display + a REVERT to study
1. **The cyan "current parameter" display WORKS for valid param names.** Proven: `ng/c2 completion.discover 3 "" otmux send.key D -` → renders `<target>`(yellow) `<key>`(**CYAN `^[[96m`**) `<?count:1>`(yellow) at the parc/currentParameter block (c2 ~405-411). So for `otmux send` the MISSING cyan display is a CASUALTY of Fix-1: the `<text...>` crash empties `currentParameter` → the `[ -n "$currentParameter" ]` guard is skipped → no cyan. **Fix-1 (`<text...>`→`<text>`) RESTORES the cyan current-param display for send** (no separate work). Verify: after Fix-1, `otmux send D <Tab>` shows `<target>`(yellow) `<text>`(cyan).
2. **STUDY THE REVERT before re-doing Fix-2.** `git log -- ng/c2` shows commit **`31099be` "Revert \"c2: fix sub-command vs parameter completion priority\""** — the EXACT precedence fix (#40 Fix-2) was attempted and REVERTED once. Find the reverted commit + WHY it was backed out (what it broke) so #40's precedence fix does not reintroduce that regression. This is likely why the current check is deliberately narrow.
3. Minor: a redundant ALL-yellow params line renders before the cyan one (two displays). Optional cleanup, secondary.
