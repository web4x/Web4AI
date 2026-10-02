# oopPO → oopExpert (+ oopTester): Step B — the `src/thinglish/` target

**Plan of record:** Web4MDA `spec/plans/2026-10-02-thinglish-target-and-spec-sweep.md` (approved as-is). **Spec of record:** `spec/thinglish.md` at **`0c6e081`** (Step A: grammar, keyword rows, held table, `src/thinglish` section TH1–TH5).

## Build (oopExpert)
1. **New M2 component `M2ThingClass`** (`MOF/M2/M2ThingClass/latest/{model,src/ts/EAM/layer2,test}`), the PlantUML/Mermaid way: override `sourceOf` whole; `directory` = `'thinglish'`; `extensionOf(c)` → `class.thing` | `interface.thing`. Register it in `M1Catalog.languages()` and add `'thinglish'` to `homeDirectories`.
2. **Render pure Thinglish per the grammar of record** — `unit = namespace , { dependency } , ( class | interface )`: per-kind modifier keywords (G1), TypeScript bodies verbatim and `;` for abstract/interface members (G2), TypeScript-shaped params `...` / `?` / defaults and method type params (G3), relationship/collection with kind keywords and `redefines` (G4).
3. **G5 held facts** (`TypeAliasModel`, `ImportModel.isTypeOnly`) are NOT rendered — expose them by name (e.g. `held(c): string[]`) so the gate can check TH3 "everything except exactly the held set".
4. **No invention:** any model fact the grammar cannot express and that is NOT in the held table → **STOP and report to oopTeam:2.0**; never make up syntax, never drop it silently.
5. Generate + commit `src/thinglish/EAM/<layer>/<Name>.(class|interface).thing` for **every** component.
6. **Status, same commit:** README — a new row for the pure Thinglish target, state starting **"built and gated by its own unit tests — NOT ruled DONE"**, citing `M2ThingClass` and its test; `spec/thinglish.md` section heading "specified, not built" → **"built (not ruled DONE)"**.

## The atomic coordination (gate owner writes, builder types)
Adding a 7th target turns the target-listing tests RED at once (`M1Catalog.test.ts` written-file list, `M1Layout.test.ts` AC6 oracle / `×6` / AC7 dir list, `Pipeline.test.ts` directory regex). **Their new expectations are oopTester's.** Sequence:
1. oopExpert builds on a LOCAL sha and hands oopTester that sha (or a patch).
2. oopTester derives the expectation patch against it — **derived, not hand-pinned where avoidable** — and hands it back, NOT pushed.
3. oopExpert applies it **verbatim**, runs the cold isolated suite (default + `--maxWorkers=1` if timeouts), and makes **ONE push**; sha to oopTeam:2.0.
4. oopTester then gates TH1–TH5 on the pushed sha (gate-only push), seeds RED by name, CHECKED/SKIPPED/TOTAL.

## Constraints
- No edit of any gate by the builder; list every test file you touch.
- Timeouts under load: discriminate by the serial run, never touch a budget.
- The SM watches the chain; report blockers to oopTeam:2.0 immediately.
