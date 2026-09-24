# oopExpert@WODA.prod — Context

**Last updated**: 2026-09-24 (PHASE-1 anchor, rewritten at 80% panel-verified before a trainer-driven rewind; the two blocks it used to assert are struck IN PLACE below — a stale anchor causes ghost-action, not merely missing context).

## PHASE-1 ANCHOR — read THIS first after the rewind
- **Session**: job 6f8aa69f-3860-4657-a61a-bd9a0fe745f0 in **oopTeam:0.0** (window 0 has ONE pane now — the shell 0.1 is gone; use otmux from my own tool). Forks: 1.0 oopBashExpert (c8d88460), 2.0 oopPO (**1bae1524**, the live id), 3.0 oopTester (**60198e95**), 4.0 scrum-master. `pane_current_command` reads `bash` under the wrapper — liveness = footer render / `hiveMind team.status`, NEVER that field.
- ~~**Web4MDA**: origin/main = **b47ad2f**, **189/189**~~ **FALSE — struck 2026-09-24.** MEASURED by me at write time: origin/main = **0797fad**, tree CLEAN, in sync, **210/210** green. `npm test` NO LONGER EXISTS (AC2: package.json has exactly ONE script, `start`) — run the suite as `node scripts/node22.mjs 'npx vitest run'`; typecheck the same way with `npx tsc -p tsconfig.json --noEmit`. Bare `npm start` = stage-0 `scripts/bootstrap.mjs` → install → generate.
- **State of the framework (all on origin)**: MOF machinery `src/MOF/{M3,M2,M1}`; **38** catalogued classes in `src/` (was 33 before increments 2–3) as PRETTIFIED `new XModel().init({…})` literals (emitter: `/root/.claude/jobs/6f8aa69f/tmp/emit-catalog2.py` — off-repo, re-reads nested uuids; a job-tmp file, may be gone after this job); Thinglish conventions 1–8 (`spec/thinglish.md`); UCP (`spec/ucp.md`): File/Folder interfaces, UcpComponent implements Folder (design A), DefaultFile/DefaultFolder; model-json (`spec/model-json.md`, oopPO-owned): `Model.toJSON()/init(Init<this>)`, central `Defaults`, **Mof** (`src/Mof.ts`) = MOF model of a loaded class → `UcpUnit<M>.init(json)` builds the model through it (`new DefaultFolder().init({ name, path })`), declarative `implements/typeArguments` (own additions; `X.mof` = union); root pipeline gate `test/Pipeline.test.ts` (real `npm run generate`, coverage + clean git); gating canon `spec/radical-oop.md` §12 (scan lists DERIVED; coverage never on an incidental fact) + checklist 13/14.
- **HELD by Tron (do not open)**: the one-store (iii), self-description of the MOF machinery (B), folder population ("holding their unit class + model files"), UcpUnit generics beyond the opt-in landed. Tron's DONE rulings pending on the PO side.
- **Standing rules learned (all in memory files too)**: always push after commit; gen/ committed; MOF holds only M3/M2/M1; never parse source to build the model (producer) — gates may read output; verify OWN files on disk before reporting; after a restructure re-read test TITLES; an inversion invalidates every artifact describing the old behaviour (README/spec/titles/comments) — sweep inside the inversion; announce hand-offs on the peer's pane + verify by transcript, never hold reports.
- **Nothing pending from me.** PO: "if idle, stay idle rather than inventing work near a held door."
- **Post-rewind first moves**: `git -C /var/dev/Workspaces/web4x/Web4MDA log --oneline -3`, `git status`, `npm test` (read the count), `hiveMind team.status oopTeam`; then check the composer for a stale brief (rewind restores the old queue) before acting.

---

## Identity (measured 2026-09-14 via identity-verification commands)
- `claudeCode session.name` → **oopExpert@WODA.prod**
- uuid `ef9fe62b-dcf5-415e-a4f3-0a6b8473be13`
- pane `otmux pane.self` → `%201` = **oopTeam:0.0** (window: 0.0 me, 0.1 bash shell on v60211 — Tron works there too)
- host `config get OOSH_SSH_CONFIG_HOST` → **WODA.prod** (v60211.1blu.de, Ubuntu 20.04 amd64)
- model: Opus 5 (1M context)
- context: **14% (142k/1000k)** — measured 2026-09-14 ~09:40 by `scrumMaster pulse oopTeam` run in oopTeam:0.1 (peer-shell token-math, NOT the /context panel). Earlier: 11% @09:05.

## Role
Radical-OOP expert — guardian + implementer of `session/base-skills/radical-oop-law.md` across OOSH and Web4RawBin, and now **Web4MDA**. Base lineage: expert (oosh-expert / robbin-expert). PO: not yet named by Tron (oopTeam is new — created 2026-09-14 08:14). Tron drives me directly so far.

## Goal
**Web4MDA** — Web4 Model-Driven Architecture. Tron had me bootstrap the project (below); the architecture/first feature is not yet assigned. Expect it to be radical-OOP TypeScript on the Web4RawBin lineage.

## Web4MDA — the new repo (2026-09-14)
- **Path**: `/var/dev/Workspaces/web4x/Web4MDA/` (real); `workspaces/Web4MDA` in this workspace is Tron's symlink to it.
- **GitHub**: https://github.com/web4x/Web4MDA — **private**, default `main`, `origin git@github.com:web4x/Web4MDA.git`. Initial commit `c5eb040` pushed; local main tracks origin/main, in sync.
- **Toolchain**: Node 22.23.1 (`/opt/node22/bin` — system node is v16, untouched; `.nvmrc`=22, `engines >=22.12`) · TypeScript 7.0.2 · vitest 5.0.0 · tsx 4.23.13 · @types/node 26.5.1 · ESM/NodeNext/strict/ES2024 · `src/`→`dist/`.
- **Scripts**: build / typecheck / dev / start / test / test:watch / clean — all measured green at init. `vitest.config.ts` scopes tests to `src/**/*.test.ts`.
- **Run npm as** `PATH=/opt/node22/bin:$PATH npm …` (bare `npm22` resolves `node` to v16).
- `gh` CLI 2.100.0 installed by me (Tron-authorized) from the release .deb; Tron logged in as `mdonges` in oopTeam:0.1 (token scopes repo/read:org/gist/admin:public_key; his `/root/.ssh/id_rsa.pub` was uploaded to GitHub as key "mdo" by that flow).

## Done this session (2026-09-14)
- Read WODA story chapters 1–9.
- Created my instance: `.claude/agents/oopExpert@WODA.prod/SKILL.md` + this folder (`db8c7595`); boot.md lists all 20 base skills + enhanced CMM4 (`728bc698`).
- Bootstrapped Web4MDA (git init, TS7/Node22 scaffold, tests green, `c5eb040`), installed gh, created + pushed `web4x/Web4MDA`.
- Web4MDA radical-OOP corrections (Tron): file=class + static start() `017a8e3` · spec/ `7abf1a2` · parameterless ctor `eb6046b` · model: Model = {} + init() `595e126` · isInitialized getter / initialized attr `33d5a6c`.
- Web4MDA MOF: `src/MOF/{M3,M2,M1}` — M3Class, M2AbstractClass/M2TypescriptClass/M2ES2020Class, M1Class+M1Catalog, ClassModel family, RadicalOopGate, spec/mof.md; 28 tests green; `b91fc72`.

## Open gates / blockers
- none. Awaiting the first Web4MDA design/feature assignment.

## NOW
~~Idle — Web4MDA latest `52d8b68`, 48 tests, D2–D4 + inc-2..6 still open.~~ **FALSE — struck 2026-09-24: inc-1, inc-2 and inc-3 are DONE and pushed; do NOT redo them.**
**NOW**: increments 1–3 of `spec/bootstrap.md` are landed (ONE npm script + stage-0 bootstrap; package.json generated from `NpmPackage`'s model; every component answers `type()` with its own `ClassModel`). **NEXT = increment 4 (ONCE), `spec/once.md`, which DEPENDS on 3** — not yet started, awaiting oopPO's rank after this rewind.
**Read, never restate:** `spec/bootstrap.md` (rules 1–8, AC1–AC17), `spec/once.md`, `spec/mof.md` (the M2-target wire-in contract + gates), `spec/thinglish.md` (conventions 1–5), `spec/ucp.md`, `spec/model-json.md`, `spec/radical-oop.md`. The ACs live there; this file points, it does not copy.
**Held by Tron (do not open):** the one-store (iii), self-description B in full, folder population, UcpUnit generics beyond the opt-in. Deferred to their own plan: Namespaces, UcpComponentFolders, VersionFolders, Unit storage.
**Standing mechanics that cost me time to learn:** catalogued classes live in `src/` top-level and EVERY src edit needs a catalog re-derive (`emit-catalog2.py`, off-repo in job tmp — if gone, re-derive by hand from the class headers); method bodies are captured VERBATIM, so they must be plain ES2020 (no type annotations, no `as`); a catalogued class may not statically import `node:` nor reach `src/MOF/**` dynamically (the Thinglish corpus is the 38 catalogued classes only); after any regenerate check `git status --short gen` for DELETIONS before committing; stage with explicit paths, never `-A`; read the WHOLE porcelain, never a truncated prefix.
