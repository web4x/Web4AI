# oopTester → oopPO: ARM6 (Part 2) — patch on Web4MDA 0c6e081, NOT pushed

**Patch (v2, oopPO ruling 1 applied):** `session/tasks/oopTester-arm6-0c6e081.patch` (115 lines, test-only: `EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/Spec.test.ts`). Proven to `git apply --check` cleanly on a PRISTINE clone at `0c6e081`; applied there: Spec.test **21 pass / 1 RED (the expected one)**.

## Measured (isolated clone with .git, 0c6e081)
- **ARM6 v2: CHECKED 196 live / SKIPPED 23 marked / TOTAL 219** (v1 was 195/24 — the ONE move is `spec/mof-self.md:33 src/`, an unattributed quote, now LIVE) — RED as you expected; the 195 below are your sweep's work list.
- Per doc: mof 36 · eamd-ucp 27 · component-model 27 · mof-self 23 · thinglish 16 · bootstrap 14 · index 10 · oosh-mda 8 · once 8 · howto-mda 8 · radical-oop 6 · README 6 · ucp 4 · scenario 2.
- Skips: 21 blockquote · 2 struck · 0 tron-verbatim (no Tron-attributed quote in today's docs mentions a top-level path).
- **Seed proven on the REAL scan:** appending "`gen/js/X.js`" to README → 196 live, `README.md:55 gen/js/X.js` named; reverted.
- 3 failable unit arms green: seed by name (backticked + prose); blockquote / struck / verbatim SKIPPED with marker + component paths (`<C>/latest/src/…`, `latest/test/`, `./src`) not mentions; `spec/plans/` excluded structurally AND non-vacuously (plans/*.md exist).
- My own failable arm caught a bug in my tokenizer before handover (curly quotes leaked into the token) — fixed.

## Scope (fixed BEFORE any result was seen)
Top-level mention = `gen/` | `src/` | `test/` (+ rest) NOT preceded by a path char `[A-Za-z0-9_./@-]`. Backticked or prose, with or without extension — what ARM5 (backticked file citations only) cannot see.
**Exemptions (v2, ruling 1):** `>` blockquote · `~~struck~~` · a quote EXPLICITLY attributed to Tron = `Tron` within 40 chars before the opening quote, no other quote between (`Tron, 2026-09-21: "…"`, `Tron: “…”`). Failable seeds added: an UNATTRIBUTED quote → LIVE; `Tron` too far away → LIVE; a second quote after an attributed one → LIVE.

## Findings for your ruling (disclosed, not silently decided)
1. ~~**"verbatim" is structural = ANY double-quoted span ("…" / “…”)**, not Tron-only (attribution is not structural). Today it exempts exactly 1: `spec/mof-self.md:33` quoting mof.md ("never from a scan of `src/`") — the same line's unquoted `src/` is LIVE, so the line enters the sweep anyway. Keep, or narrow to Tron-attributed lines?~~ **RULED (oopPO): narrow — applied in v2.**
2. **RULED: fix the TEXT (sweep writes `<Component>/latest/src/thinglish/`, after Step B's push).** `spec/thinglish.md:161` heading `src/thinglish/` (the Step B target) is component-relative but written bare → LIVE. Rewrite to `<Component>/latest/src/thinglish/` or mark.
3. **ARM5 interaction:** ARM6 flags 6 of ARM5's 10 allowances live — `README.md:25 src/Once.ts`, `spec/once.md:26 src/Once.ts`, `spec/component-model.md:31 src/X.ts`, `spec/eamd-ucp.md:75 src/MOF/Loose.ts`, `spec/eamd-ucp.md:81 src/X.ts`, `spec/ucp.md:104 src/Container.ts`. Untouched: `test/Preflight.test.ts` (struck → skipped), `scripts/preflight.mjs`, the 2 cross-repo `session/…`. **The exact new `PATH_ALLOWANCES`/`NON_FILES` depend on HOW your sweep rewrites those 6** — hand me the sweep patch (or its clone) and I derive the set from ARM5's own printed allowances, then prove it exact both ways. Not invented ahead of the sweep. **RULED: agreed.**

## LIVE (196) — the sweep list
README.md:15 src/
README.md:23 src/<language>/EAM/<layer>/
README.md:25 src/
README.md:25 src/Once.ts
README.md:37 test/X.test.ts
README.md:5 src/
spec/bootstrap.md:100 src/
spec/bootstrap.md:49 src/
spec/bootstrap.md:51 gen/EAMD.ucp/…/<Name>/<Version>/
spec/bootstrap.md:53 gen/
spec/bootstrap.md:65 gen/
spec/bootstrap.md:65 gen/EAMD.ucp/
spec/bootstrap.md:73 gen/
spec/bootstrap.md:73 gen/
spec/bootstrap.md:83 gen/
spec/bootstrap.md:83 gen/
spec/bootstrap.md:87 src/UcpUnit.ts
spec/bootstrap.md:93 gen/
spec/bootstrap.md:93 gen/js
spec/bootstrap.md:95 src/
spec/component-model.md:21 src/
spec/component-model.md:21 src/
spec/component-model.md:23 gen/
spec/component-model.md:23 gen/EAMD.ucp
spec/component-model.md:23 gen/EAMD.ucp
spec/component-model.md:28 gen/
spec/component-model.md:29 gen/
spec/component-model.md:29 gen/
spec/component-model.md:29 gen/
spec/component-model.md:31 gen/EAMD.ucp/
spec/component-model.md:31 src/X.ts
spec/component-model.md:31 test/
spec/component-model.md:33 src/
spec/component-model.md:34 src/
spec/component-model.md:34 src/
spec/component-model.md:34 src/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/
spec/component-model.md:35 gen/EAMD.ucp
spec/component-model.md:35 gen/EAMD.ucp
spec/component-model.md:35 src/ts
spec/eamd-ucp.md:105 test/
spec/eamd-ucp.md:105 test/<lang>/…
spec/eamd-ucp.md:18 src/<lang>/EAM/layerN/
spec/eamd-ucp.md:24 gen/
spec/eamd-ucp.md:28 src/
spec/eamd-ucp.md:28 src/
spec/eamd-ucp.md:33 gen/EAMD.ucp/
spec/eamd-ucp.md:39 src/<lang>/EAM/layerN/
spec/eamd-ucp.md:40 test/<lang>/EAM/layerN/
spec/eamd-ucp.md:43 src/<lang>/EAM/layerN/<Name>.<kind>.<ext>
spec/eamd-ucp.md:44 test/<lang>/EAM/layerN/
spec/eamd-ucp.md:69 src/
spec/eamd-ucp.md:71 src/
spec/eamd-ucp.md:71 src/MOF/
spec/eamd-ucp.md:75 src/
spec/eamd-ucp.md:75 src/
spec/eamd-ucp.md:75 src/MOF
spec/eamd-ucp.md:75 src/MOF/Loose.ts
spec/eamd-ucp.md:79 gen/
spec/eamd-ucp.md:79 gen/<lang>
spec/eamd-ucp.md:81 gen/
spec/eamd-ucp.md:81 gen/
spec/eamd-ucp.md:81 gen/{
spec/eamd-ucp.md:81 src/
spec/eamd-ucp.md:81 src/X.ts
spec/eamd-ucp.md:94 gen/
spec/eamd-ucp.md:98 test/<lang>/EAM/…
spec/howto-mda.md:1 src/MOF/
spec/howto-mda.md:110 src/
spec/howto-mda.md:111 src/
spec/howto-mda.md:126 src/
spec/howto-mda.md:65 src/MOF/M3
spec/howto-mda.md:65 src/MOF/M3/
spec/howto-mda.md:68 src/MOF/M2/
spec/howto-mda.md:96 src/MOF/M2/
spec/index.md:12 gen/thinglish.js/
spec/index.md:12 gen/thinglish.ts/
spec/index.md:12 src/
spec/index.md:19 gen/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/…
spec/index.md:19 src/MOF/
spec/index.md:19 test/<lang>/EAM/layerN/
spec/index.md:20 src/MOF
spec/index.md:21 src/
spec/index.md:28 src/MOF/
spec/index.md:55 src/thinglish/
spec/mof-self.md:14 src/MOF
spec/mof-self.md:14 src/MOF/
spec/mof-self.md:19 src/MOF
spec/mof-self.md:24 src/
spec/mof-self.md:28 src/
spec/mof-self.md:29 src/
spec/mof-self.md:32 test/MOF/MofLayout.test.ts:50
spec/mof-self.md:33 src/
spec/mof-self.md:33 src/
spec/mof-self.md:37 gen/
spec/mof-self.md:37 src/
spec/mof-self.md:38 src/
spec/mof-self.md:39 src/
spec/mof-self.md:39 src/MOF/
spec/mof-self.md:43 src/
spec/mof-self.md:44 gen/
spec/mof-self.md:59 src/MOF
spec/mof-self.md:60 src/MOF
spec/mof-self.md:62 src/MOF
spec/mof-self.md:63 gen/
spec/mof-self.md:63 gen/
spec/mof-self.md:63 src/
spec/mof-self.md:85 src/MOF/M1/M1Layout.ts:84-85
spec/mof-self.md:90 src/
spec/mof.md:10 src/
spec/mof.md:10 src/MOF/
spec/mof.md:10 test/
spec/mof.md:16 src/MOF/M3/
spec/mof.md:17 src/MOF/M2/M2
spec/mof.md:18 src/MOF/M2/M2Abstract{Relationship
spec/mof.md:19 gen/thinglish.js/
spec/mof.md:19 gen/thinglish.ts/
spec/mof.md:22 src/
spec/mof.md:22 src/
spec/mof.md:22 src/MOF/
spec/mof.md:35 gen/svg/<Name>.svg
spec/mof.md:45 src/
spec/mof.md:45 test/
spec/mof.md:48 src/
spec/mof.md:49 src/<Name>.ts
spec/mof.md:53 src/
spec/mof.md:53 src/
spec/mof.md:54 src/
spec/mof.md:57 src/
spec/mof.md:59 gen/ts
spec/mof.md:59 src/
spec/mof.md:69 gen/oosh
spec/mof.md:71 src/MOF/M2/
spec/mof.md:78 gen/
spec/mof.md:78 gen/
spec/mof.md:78 gen/
spec/mof.md:78 gen/oosh/
spec/mof.md:79 src/
spec/mof.md:79 src/
spec/mof.md:79 src/
spec/mof.md:79 src/
spec/mof.md:83 src/
spec/mof.md:83 src/
spec/mof.md:87 src/MOF/
spec/mof.md:93 src/<Name>.ts
spec/once.md:18 gen/js
spec/once.md:20 src/
spec/once.md:26 src/
spec/once.md:26 src/Once.ts
spec/once.md:32 gen/EAMD.ucp/
spec/once.md:37 gen/
spec/once.md:37 gen/
spec/once.md:39 src/
spec/oosh-mda.md:123 src/
spec/oosh-mda.md:127 gen/oosh/
spec/oosh-mda.md:127 test/fixtures/oosh/greeter
spec/oosh-mda.md:131 gen/oosh
spec/oosh-mda.md:136 gen/
spec/oosh-mda.md:136 gen/oosh
spec/oosh-mda.md:148 gen/
spec/oosh-mda.md:148 gen/oosh/
spec/radical-oop.md:16 src/Web4MDA.ts
spec/radical-oop.md:17 test/Web4MDA.test.ts
spec/radical-oop.md:18 src/ScenarioUnit.ts
spec/radical-oop.md:22 src/
spec/radical-oop.md:22 test/
spec/radical-oop.md:22 test/<same
spec/scenario.md:13 gen/
spec/scenario.md:13 gen/EAMD.ucp/
spec/thinglish.md:11 gen/js/
spec/thinglish.md:11 gen/thinglish.js/
spec/thinglish.md:11 gen/thinglish.ts/
spec/thinglish.md:161 src/thinglish/
spec/thinglish.md:163 src/
spec/thinglish.md:163 src/thinglish/EAM/<layer>/<Name>.class.thing
spec/thinglish.md:165 src/thinglish/EAM/<layer>/
spec/thinglish.md:172 src/thinglish/
spec/thinglish.md:41 gen/ts
spec/thinglish.md:41 src/
spec/thinglish.md:62 gen/
spec/thinglish.md:67 src/
spec/thinglish.md:7 gen/thinglish.js/
spec/thinglish.md:7 gen/thinglish.ts/
spec/thinglish.md:7 src/
spec/thinglish.md:70 gen/thinglish.ts/
spec/ucp.md:104 gen/thinglish.ts
spec/ucp.md:104 src/Container.ts
spec/ucp.md:33 src/
spec/ucp.md:7 src/

## SKIPPED (23) — printed so none hides
spec/bootstrap.md:3 gen/ [blockquote]
spec/bootstrap.md:3 gen/ [blockquote]
spec/bootstrap.md:3 gen/EAMD.ucp [blockquote]
spec/component-model.md:3 gen/ [blockquote]
spec/component-model.md:3 gen/ [blockquote]
spec/component-model.md:3 gen/EAMD.ucp [blockquote]
spec/eamd-ucp.md:3 gen/ [blockquote]
spec/eamd-ucp.md:3 gen/ [blockquote]
spec/eamd-ucp.md:3 gen/EAMD.ucp [blockquote]
spec/eamd-ucp.md:75 src/MOF/M1 [struck]
spec/index.md:3 gen/ [blockquote]
spec/index.md:3 gen/ [blockquote]
spec/index.md:3 gen/EAMD.ucp [blockquote]
spec/mof.md:3 gen/ [blockquote]
spec/mof.md:3 gen/ [blockquote]
spec/mof.md:3 gen/EAMD.ucp [blockquote]
spec/mof.md:77 test/Preflight.test.ts [struck]
spec/once.md:3 gen/ [blockquote]
spec/once.md:3 gen/ [blockquote]
spec/once.md:3 gen/EAMD.ucp [blockquote]
spec/oosh-mda.md:3 gen/ [blockquote]
spec/oosh-mda.md:3 gen/ [blockquote]
spec/oosh-mda.md:3 gen/EAMD.ucp [blockquote]
