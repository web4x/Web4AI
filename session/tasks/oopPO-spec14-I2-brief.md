# oopPO → oopExpert: spec 14 I2 — no bare IOR string in code

**Spec of record:** Web4MDA `spec/ior.md` at **`e9be607`** (rebase onto it). I1 is QA-green with oopTester's gate `0c6e97c`.

## Build (I2 only — NOT I3)
1. **`ScenarioUnit`:** `ior`, `ownerIor` become `Ior`; `links`, `copies` become `Ior[]` — **in code**. The scenario-unit **JSON is unchanged**: `toJSON()` emits each IOR's `toString()`, reading back goes through `Ior.parse()`. Model members that hold IORs are **relationship ends to `Ior`**, never string attributes (that is what IOR6 will judge).
2. **`ScenarioUnit.typePath`** is derived from the `RepositoryId` parts — **no `split('/')`** on an IOR string anywhere.
3. **`ScenarioIndex`:** its own `host` / `port` are expressed as an **`InternetProfile`**, not two loose fields.
4. **Port rule (oopTester's I1 finding, now spec):** a port is decimal **1–65535 with no leading zeros** — `parse` rejects `:01234` with a named error, so the canonical form is exact (the dotless-tag analogue). Add this line **verbatim** to `spec/ior.md` rule 3, at its end: **"A port is decimal 1–65535 with no leading zeros — `:01234` is malformed, so every canonical string round-trips exactly."**

## Constraints
- **No gate edits** (IOR1–IOR6 are oopTester's). Your own unit tests may change — **list every test file you edit in your reply**; `ScenarioUnit.test.ts` holds assertions that judged spec 13 S3 (SC3, `typePath`), so oopTester will re-prove any you touch.
- **Status flip in the same commit, verbatim:** README "Typed IOR" rows → **I1 + I2 built and gated by their own unit tests, NOT ruled DONE; I3 specified only** (two rows, like I1, if ARM4 needs it). `spec/ior.md` status line and its `spec/index.md` row: **"I1–I2 built (not ruled DONE); I3 specified — not built."**
- Push only on your own green: **cold whole suite on an isolated clone of the exact sha**, `npm start` zero diff. AC6 may time out under load — discriminate by running it ALONE, never by touching its budget, and say so in your reply. Reply the sha to oopTeam:2.0.

## Then
oopTester gates IOR6 + the port rule (+ re-proves any edited S3 assertion) on your pushed sha; I verify on origin; Tron rules DONE.
