# H5m-3 + b2 re-gate — PREP on the pushed part (Web4MDA 32cd2a03), NOT RUN

oopTester@WODA.prod (914c8cad), 2026-10-06. Order: oopPO — "PREP now on what is pushed (8 H5m-3 moves d0e837d4..32cd2a03), do NOT run; GO from me on its FINAL sha. Add: MofLayoutAC5's ORACLE was changed during its move — re-prove it failable. Also check 32cd2a03 swept 5 lines of my bootstrap.md in by mistake."

**Status: PREP only.** Still to land from oopExpert before GO: 5 more moves, the b2 fix, the TestPlacement arm. Everything below that is "measured" was read-only at prep time; every verdict waits for the final sha.

## Measured at prep (read-only, Web4MDA main = origin/main = 32cd2a03)

| commit | move (old `latest/test/` → new) | rename similarity | `expect(` lines −/+ |
|---|---|---|---|
| d0e837d4 | Boilerplate → DefaultFolder | R085 | 0 / 0 |
| 7fd4430d | UcpComponent → DefaultFolder | R094 | 0 / 0 |
| c65a3a38 | Folder → MOF/M1/M1Catalog | R084 | 0 / 0 |
| 495fbb36 | ReferencePolymorphism → MOF/M1/M1Catalog | R094 | 0 / 0 |
| f3a888ca | TypedReferences → MOF/M1/M1Catalog | R097 | 0 / 0 |
| 6b32a05e | ComponentModelInc1 → DefaultFile | R095 | 0 / 0 |
| 22b544cc | ComponentModelInc2 → MOF/M1/M1Catalog | R095 | 1 / 1 — **not an oracle**: the path key of one entry in `latest/test/GenClaims.test.ts` (`"<file> :: expect(existsSync('gen'), …)"`) updated to the new location |
| 32cd2a03 | FileUnitsMigration → MOF/M1/M1Catalog | R098 | 0 / 0 |

- **Every move changed content** (similarity 84–98 %). The `expect(` count is a hint only — an oracle can change through a compared literal, a fixture path or a helper without touching an `expect(` line. Arm C reads each full diff.
- **bootstrap.md sweep — CONFIRMED as oopPO said:** 32cd2a03 touches 2 files; `spec/bootstrap.md` +5 / −0 = a new rule "9. Work only INSIDE the repository — scratch only in a component's own `latest/test/gen/` …" (oopPO's uncommitted H6 text, swept in beside the move). Known, fixed forward by oopPO; not a gate arm of mine.
- **MofLayoutAC5 (in flight, staged in oopExpert's checkout, not pushed):** staged rename `latest/test/MofLayoutAC5.test.ts → MOF/M1/M1Catalog/latest/test/`; at prep time its staged diff has **no non-import line changed**. The oracle change oopPO names is therefore not readable yet — read it at the final sha (arm E).
- **Working tree at prep:** that staged rename + `spec/bootstrap.md` M + `spec/eamd-ucp.md` M (oopPO's H6 text, held on purpose) + `.tmp/` (Tron's `npm start`, pid 1868291, alive). None mine; untouched.

## Scope rules — FIXED NOW, before any result (scoping, not rationalising)

- **S1 subject** = the subject each move's commit message declares ("subject X, by ASSERTIONS"); the gate does not re-derive a different subject after seeing results.
- **S2 exception** = positional only: `BootstrapScratch.test.ts` (its two `at(` calls, :163/:173 at H5n time) for b2; nothing else is exempt by phrase.
- **S3** = files under any `latest/test/gen/tmp/` are test scratch, not tests.
- **S4 baseline** for "before" = `git show <move>^:<old path>` per move (never a worktree, never /tmp).

## Arms (each GREEN on the final sha AND proven RED by a physical seed)

- **A — placement** (oopExpert's TestPlacement arm, text taken from the final sha): each moved file lives under its declared subject's `latest/test/`; the subject is imported AND used (not merely named — the path-string false-green of H5m-regate2); no duplicate test file name across the tree; ratchet = 13 or the lowered baseline stated on the final sha. Seeds: subject import removed → RED; file copied back to `latest/test/` → RED (duplicate).
- **B — no test lost by name**: per moved file, the `describe`/`it` title set before (S4) == after; suite total before/after reconciled. Seed: one `it` title deleted in a moved file → RED.
- **C — nothing weakened**: full per-move diff read; any change other than import/path re-pointing = an oracle change → prove it failable (seed the input the OLD oracle rejected; it must still be RED).
- **D — GenClaims path keys (an allowance = a fail-open)**: every `"<file> :: <assertion>"` entry resolves to an existing file containing that assertion text at the final sha. Seed (nearest dangerous member): one key pointed at the pre-move path → GenClaims must go RED; if it stays GREEN, that is a false-green defect (R1).
- **E — MofLayoutAC5 oracle (oopPO add)**: old oracle = `git show 32cd2a03:<old path>`, new = final sha; state both literally. Seed 1 violates the NEW oracle → RED. Seed 2 = the input the OLD oracle rejected → must still be RED (else the move weakened it).
- **F — b2**: `Scratch.at(url)` must no longer accept a foreign caller URL: an NpmPackage test calling `at(<M1Layout's real test URL>).fixture(…)` → RED; only S2 exempt. Re-measure the call census at the final sha (H5n: 84 `Scratch().at(` calls, 82 `import.meta.url`).

## Run preconditions (on GO)

- GO from oopPO naming the final sha; checkout = that sha; porcelain measured WHOLE before and after.
- Tron's pid 1868291 + repo `.tmp` = known confound of BootstrapScratch :53/:65 → measure `.tmp` mtime per run, report those two as CONFOUNDED while it runs; never touch the process or `.tmp`.
- FOREGROUND only; TypeScript via `node --import tsx` (never npx); no /tmp; scratch only under a component's `latest/test/gen/`; seeds physical in the shared tree, inside the window, removed after, `git status` back to the pre-run set.
- Report: per arm GREEN/RED/CONFOUND + the number + seed evidence, to oopPO.
