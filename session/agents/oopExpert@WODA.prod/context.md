# oopExpert@WODA.prod — Context

**Last updated**: 2026-09-24 ~14:30 (PHASE-1, written at 83% panel-verified as a genuine cut candidate). **EVERY NUMBER BELOW IS A MEASUREMENT WITH A TIMESTAMP, NOT AN ASSERTION — RE-MEASURE BEFORE TRUSTING ANY OF IT.** The commands are given so you can: they take seconds and a stale number here is how ghost-action starts.

## PHASE-1 — read THIS first, then re-measure
- **Re-measure first, in this order**: `git -C /var/dev/Workspaces/web4x/Web4MDA log --oneline -3`, `git -C ... status --porcelain` (read the WHOLE output, never a prefix), `cd /var/dev/Workspaces/web4x/Web4MDA && node scripts/node22.mjs 'npx vitest run'` (READ the count), `hiveMind team.status oopTeam`.
- **Web4MDA, measured 2026-09-24 ~14:30**: `origin/main` was **f382767**, tree clean, in sync, **212/212** green, **38** classes in `src/`. Peers commit to the same repo continuously, so HEAD will have moved — that is normal, not a defect.
- **`npm test` DOES NOT EXIST** (AC2: exactly ONE npm script, `start`). Suite: `node scripts/node22.mjs 'npx vitest run'`. Typecheck: `node scripts/node22.mjs 'npx tsc -p tsconfig.json --noEmit'`. Bare `npm start` = stage-0 `scripts/bootstrap.mjs` → npm install → generate.
- **Increments 1, 2 and 3 of `spec/bootstrap.md` are DONE and pushed. DO NOT REDO THEM.** 1 = ONE entry point + stage-0; 2 = `package.json` generated from `NpmPackage`'s model; 3 = every component answers `type()` with its own `ClassModel` (`Mof.register`/`attach`), AC8 later strengthened to derive-not-denylist (d516272).
- **NEXT = increment 4 (ONCE), `spec/once.md`, depends on 3. oopPO ranked it; the trainer HELD it pending a rewind** because it is heavy and I was at 83%. Do not start it without a fresh panel number and the PO's go.
- **Read, never restate**: `spec/bootstrap.md` (rules 1–8, AC1–AC17), `spec/once.md`, `spec/mof.md` (M2-target wire-in contract + gates), `spec/thinglish.md` (conventions 1–5), `spec/ucp.md`, `spec/model-json.md`, `spec/radical-oop.md`. The ACs live there.
- ★ **INSTRUMENT HAZARD, caught 2026-09-24 and worth more than any number here**: `scrumMaster pulse` reported **30%** for my pane while the panel rendered **83%** — not a stale value but a LIVE one from the WRONG SESSION (`team.status` showed the pane's uuid flip between reads). A real number for the wrong subject under the right label. **Only a peer-triggered `/context` render on your own pane counts**; a self-trigger queues behind your turn and cannot render inside it.
- ★ **SHARED INDEX**: all agents share one working tree and one git index. `git add <path>` does NOT path-limit the commit — commit by pathspec (`git commit -- <paths>`), read `git diff --cached --name-only` first, and verify what landed with `git show origin/main:<path>` rather than trusting your own hash (a peer's commit swept my staged file on 2026-09-24).
- **Standing mechanics that cost me time**: every `src/` edit needs a catalog re-derive (`/root/.claude/jobs/*/tmp/emit-catalog2.py`, off-repo — if gone, re-derive from the class headers); method bodies are captured VERBATIM so they must be plain ES2020 (no type annotations, no `as`); a catalogued class may not statically import `node:` nor reach `src/MOF/**` even dynamically (the Thinglish corpus is the 38 catalogued classes); after any regenerate check `git status --short gen` for DELETIONS before committing; never `git add -A`; use a heredoc for commit messages (backticks in `-m` get substituted away).
- **Held by Tron (do not open)**: the one-store (iii), self-description B in full, folder population, `UcpUnit` generics beyond the opt-in. Deferred to their own plan: Namespaces, UcpComponentFolders, VersionFolders, Unit storage.
- **Nothing is pending from me.** oopPO: "if idle, stay idle rather than inventing work near a held door."

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
