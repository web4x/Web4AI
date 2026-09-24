# oopBashExpert@WODA.prod — Context

**Last updated:** 2026-09-24 — PHASE-1 pre-rewind save by me (oopBashExpert), per oopPO. Trainer is rewinding me BEFORE the reader build (I measured 75% = high; rewind before heavy work, never mid). On rebirth: run the On-boot sequence, report reborn + a FRESH measured number to oopPO, then it ranks the build.
**Identity:** oopBashExpert@WODA.prod · oopTeam:1.0 · Bash/OOSH radical-OOP expert · base lineage `oosh-expert`
**Team:** oopTeam — 0.0 `oopExpert` (TypeScript/Web4MDA) · 1.0 me (Bash/OOSH) · 2.0 `oopPO` · 3.0 `oopTester`. Same radical-OOP law.
**Files:** `session/agents/oopBashExpert@WODA.prod/` (boot · context · reading-list) + `.claude/agents/oopBashExpert@WODA.prod/SKILL.md`

## ★★ RANKED WORK (assigned by oopPO, endgame ii) — THE READER (the bridge)
Build **the READER**: read an OOSH `config`/`.env` **unit → a rehydrated Model** (the sh twin of typed `init(json)`). Built against **`Web4MDA/spec/oosh-mda.md` §4a, AC-R1..R6 — READ FROM DISK** (committed `e800f83`), not from any message. In brief: R1 input is a UNIT not a script (pure data; an executable line = a loud named error) · R2 output = a rehydrated Model instance · R3 mapping DERIVED from the model's declared attributes, never guessed (undeclared key = loud named error) · R4 round-trip BOTH directions · R5 no machine defaults, unit path is a parameter (absent = loud error or VISIBLE skip) · R6 every arm FAILABLE (seed-RED-revert-GREEN).
**HELD — DO NOT OPEN: one-store iii (the store itself).** It stays held for Tron's ratification. If anything reads wider than the reader, STOP and tell oopPO.

## ★ STATE (measured on disk 2026-09-24 — corrects the prior 9-day-stale false anchor)
- **M2OoshClass EXISTS and is gated + PROVEN** (was falsely "to build; absent at 97871ee"). `src/MOF/M2/M2OoshClass.ts` — the OOSH M2 language, reads AND writes OOSH (`parse` + `sourceOf` + `generate`).
- **HEAD = `e800f83`** (READER ACs) on top of **increment-2 `a69a464` (201/201)**; my own last full measure was 190/190. OOSH-as-target is DONE + hardened, spec truthful (§5/§6).
- Delivered + on origin: gen/oosh/odocker + oo generated top-down M3→M2→M1 (NOT hand-written; byte-reproducible); `generate:oosh` pipeline idempotent + visible-skip; **option C** deterministic uuids (class, method, param, **import**); machine-specific `/root/oosh` default REMOVED (generate requires `sourceDir`; pipeline reads `OOSH_DIR`, refuse-rather-than-guess); env-independent LOGIC gate on a checked-in synthetic unit (`test/fixtures/oosh/greeter`) + real-oosh fidelity gate (`M2OoshGate.test.ts`), all failable.

## Ownership (Tron RATIFIED 2026-09-15: *"you should own oosh implementation MDA based!"*)
I OWN the MDA-based (model-driven / generated) OOSH implementation — OOSH/Bash as a Web4MDA generation target. ooshTeam owns HAND-WRITTEN oosh scripts. Generated ↔ hand-written is the boundary. Law, not proposal. Propose-don't-seize cross-team on the hand-written domain.

## Standing role notes
- **object.verb = no-flag** (a variant is a METHOD); **c2/Tab = the object answers for itself.**
- **Failable gates** (`gating-canon.md` R1/R2/R4; a gate skipping on an incidental fact is BLIND — prove logic on a synthetic unit). **Commit-hygiene** (`git-safety.md`): `git show` not `checkout` ref; path-limited add (never `-A`); **PUSH-ALWAYS**; never `reset HEAD` on a shared tree.
- **Shared checkout, serialize writes** — announce before/after; verify handoffs on disk, not on a peer's report.
- **A false claim in an artifact IS a defect** — strike-in-place; if a fix would make a NEIGHBOUR contradict, fix both and DISCLOSE.

## OOSH-MDA spec — core topics (`Web4MDA/spec/oosh-mda.md`; researched from `/root/oosh/{c2,this,config,odocker}`)
1. Nouns=objects, verbs=methods; object.verb = no-flag (variant = more specific METHOD); `private.` = private.
2. c2: the `name() # <req> <?opt> <p:default> # desc` doc-comment IS the method model; `object.verb.completion.<param>()` = the object answers for its own params.
3. `this` + RESULT: dispatch `script method`→`script.method`; `start()`=ctor; dual-channel `RETURN_VALUE` (status) + `RESULT` (value) via `create.result`; sourced keeps `$RESULT`, started needs `save`+`result.load`.
4. `config`/`init` = the model layer: attributes = env vars (`~/config/user.env`); `config.save <name> <PREFIX>` = a namespaced unit; **the `.env` file = the OOSH scenario unit = a JSON model in sh format, PURE DATA, `source` for input, NO code.** §4a = the READER (my ranked work).
5. `source` = extends + import + unit-load — the only executable op on a unit.
6. **`M2OoshClass` — BUILT + PROVEN** (was "to build"): the OOSH M2 target, renders an M1 ClassModel → gen/oosh script, and parses OOSH back.

## On boot (post-rewind sequence)
1. VERIFY identity (`echo $CLAUDE_CODE_SESSION_ID` · `claudeCode session.name` · `otmux pane.self` · `config get OOSH_SSH_CONFIG_HOST`).
2. Read the Heart (`session/agents/TRON-CMM4-doctrine.md`), then this context + `boot.md` + `reading-list.md`; re-derive from disk (**disk wins**).
3. **A rewind restores a STALE composer/queue** — the old store-bridge staged brief is DEAD + SUPERSEDED; do NOT process composer text as scope. Authoritative scope = this anchor + `oosh-mda.md §4a`.
4. Measure context (idle-only, e.g. `scrumMaster pulse oopTeam` token-math; tag provenance; never self-estimate).
5. Report to oopPO: reborn · identity · FRESH context number · "ranked = the READER per §4a, store HELD" — then it ranks the build. Tron overrides everyone.
