# oopExpert@WODA.prod — Context

**Last updated**: 2026-09-24 ~16:20 (PHASE-2 LANDED — ARON drove the rewind option-2, code-intact; this file reconciled against the measured world AFTER the reread, per agent-rewind step 4). **EVERY NUMBER BELOW IS A MEASUREMENT WITH A TIMESTAMP, NOT AN ASSERTION — RE-MEASURE BEFORE TRUSTING ANY OF IT.** The commands are given so you can: they take seconds and a stale number here is how ghost-action starts.

## LANDING RECORD (2026-09-24 ~16:20) — what the reread measured, so the next boot starts from truth
- **Panel 44% (442.5k/1m, free 554.5k), measured ~16:15 by a /context render in MY OWN pane, peer-confirmed by scrum-master's read-back.** Healthy landing (band 40→95). Re-measure: ask a peer for `otmux send.raw oopTeam:0.0 "/context" Enter` + read-back — a self-trigger queues behind the turn and cannot render inside it.
- **The pulse-vs-panel hazard fired AGAIN, the other way**: `scrumMaster pulse` showed ⚠84 for my pane while the panel rendered 44 — stale-high lag on a fresh cut. Both directions are now lived: pulse 30 vs panel 83 (before), pulse 84 vs panel 44 (after). **The panel is the only instrument.**
- **Identity, measured**: `hiveMind team.status oopTeam` → `0.0 oopExpert [6f8aa69f-3860-4657-a61a-bd9a0fe745f0]`, matching my job/scratchpad dir. ~~uuid `ef9fe62b-…`~~ **STRUCK — that was the pre-fork session id from 2026-09-14; the Identity block below is stale on this point.** `otmux pane.self` / `claudeCode session.name` return EPERM in my sandboxed shell — use the registry + the scratchpad path instead. Pane geometry is now **253x62** (was 57x16).
- **Team (measured)**: 1.0 oopBashExpert, 2.0 oopPO, 3.0 oopTester, **4.0 scrum-master** (new since the anchor), all idle; window 0 has NO shell pane any more (the old `oopTeam:0.1` is gone — drive otmux from your own tool calls).
- **Web4MDA re-measured ~16:05**: `origin/main` **9c11333** (the anchor's f382767 moved on — peers landed the AC7/AC8 spec work), porcelain EMPTY, in sync, **212/212 green in 32 files** (`node scripts/node22.mjs 'npx vitest run'`), **38** classes in `src/`, npm scripts = `['start']` only. Nothing of mine was lost in the rewind.
- **No ghost draft existed**: my composer was empty at landing (verified by capture before anyone injected anything).
- ★ **MY OWN RUNWAY HAZARD, from the panel's own suggestion**: Bash results were **189.7k tokens = 19%** of the window — my single largest avoidable consumer. Capture with `grep`/`sed -n`/counts, never `cat` a large file, never dump a whole suite run. This is why a session fills; it is cheaper to measure narrowly than to rewind.

## INCREMENT-4 (ONCE) — MEASURED GROUND, before any code (2026-09-24 ~17:00; scratch probes in job tmp, never the repo)
- **Status**: oopPO released inc-4 and ruled: registry keyed by NAME only (no dotted namespace, no globalThis — both smuggle the HELD namespace concept past a closed door); every exported class of a stream registers; start-once guarded PER CLASS. Mechanism ranked A. **Still HELD on Tron's boot word** + his ruling on the duplication cost.
- **AC7-through-the-loader, MEASURED (do not re-derive by reasoning — re-run the probes)**: every `gen/js` module ends with its own `X.start();`, so `static start()` DOES run on import and registers the ctor in that graph's `Mof` — but it does **NOT** attach the `ClassModel`. `type` is **undefined before AND after start()**, on the byte path and the ordinary import alike; an explicit `Mof.attach(name, classModel)` in the **loaded graph's own** Mof then makes `type` answer. **Type-init is TWO steps: register + attach.** A gate must assert `type.name`, never a boolean.
- ★ **CROSS-GRAPH FALSE SUCCESS (measured, not in the spec)**: the registry is name-keyed and a byte graph is a second instance, so `hostMof.attach('Package', cm)` returns **true** while targeting the HOST's class. ONCE must attach through the stream's own Mof; gates must assert the target's identity.
- ★ **MECHANISM COST CURVE (measured; killed my own first design)**: rewriting each sibling specifier to the dependency's data: URL nests base64 inside base64 — amplification **1.9× (3 modules) → 11.6× (14) → 39.7× (25) → 160× (32: 20 KB source → 3.26 MB URL)**. Superlinear, unusable.
- ★ **THE FIX, measured green**: link the closure into **ONE stream module** (topological order, sibling import lines stripped, one export list), one data: URL, one dynamic import → **1.07×** (25 modules, 10.6 KB → 11.3 KB), 3 ms, 25 types exported, `attach` then `type` answers `Package`, ONE `Mof` per stream, `instanceof` consistent inside the stream. Same mechanism family as ranked-A (bytes → data: URL → dynamic import), keeps AC10 structurally failable, and has the 4.3.0 `declarationListPerScript` precedent (one stream, several types — rule 4 anticipates it). New risks to GATE, not hide: seed an unstripped sibling import → RED; seed a duplicate top-level name in the closure → RED (fail loudly, never shadow).
- **Duplication cost, measured for Tron's ruling**: byte-loaded class ≠ imported class, `instanceof` across graphs false, `UcpComponent` not shared, `Mof` not shared. Per-stream isolation is arguably a feature for a loader. Unchanged by the single-stream fix.
- ★ **DESIGN REQUIREMENTS THE GATES DICTATE (ratified with oopPO/oopTester before any code)**: (a) collision detection runs **PRE-LINK**, while file boundaries still exist — after linking the information is gone, so a *named* diagnostic (both modules + the identifier) is only possible there; the arm must RED on the identifier-only runtime error, because module scope throws by itself and an arm asserting mere failure would pass with the feature deleted. (b) ONCE takes its **BYTE SOURCE as an injectable collaborator** — only then can AC10 be proven by feeding bytes with no filesystem path at all (in-memory / un-extracted archive entry, name absent from `gen/js`); if the source is hardcoded to read `gen/js`, AC10 is blind by construction.
- ⚠ **UNMEASURED, do not claim it**: AC11 *started exactly once*. Measured only that every `gen/js` module ends with `X.start();` so start runs at module load and registers the ctor — invocation counts and idempotence were NOT measured. The arm must COUNT (instrumented class, assert exactly one, seed a double start → RED).
- **Probes**: `/root/.claude/jobs/*/tmp/once-probe/probe{1..6}.mjs` (off-repo, disposable — re-derive from this list if gone). Run via `node scripts/node22.mjs 'node <probe>'`.
- **Note on this box**: `head` and `tail` are hook-blocked in my shell — use `grep`/`sed -n '$p'`/`wc -l`. `otmux pane.self` and `claudeCode session.name` return EPERM here.

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
- **Nothing is pending from me.** oopPO: "if idle, stay idle rather than inventing work near a held door." **Confirmed still true at the 2026-09-24 ~16:20 landing: increment 4 stays HELD (Tron's boot word + my Phase-1 + oopPO's go).**

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
