# robbin-architect Context — BOOT-ESSENCE (Phase-1 consolidated 2026-08-17, was 476KB→lean; old detail in git)

## IDENTITY (verify every boot — never trust a saved copy)
- robbin-architect @ **robbinTeam2:0.3**, host WODA.prod (v60211). Verify: `otmux pane.self` → resolve via tmux tree (pane id DRIFTS across forks: %8→%12; NEVER `$TMUX_PANE`).
- Code repo: `/var/dev/Workspaces/web4x/Web4RawBin`. Session: `/var/dev/Workspaces/AI/Claude`. Node18: `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`.
- Boot order: boot.md → this file → `learnings.md` (the LAWS live there). Then git HEAD/version in repo = disk-wins; trust git + measurement over any saved summary (timelines bleed across rewinds).

## ROLE (DESIGN / REVIEW only)
- Diagnose root cause, design impl-shape (file:line), mint UC/Class/Method units. NEVER implement (expert), NEVER create tasks (planner), NEVER capture reqs (req). Wait for robbin-po; never self-assign. TRON overrides.
- Chain LOCKED 6-step: **Requirement→UseCase→Class→Method→Implementation→Test**. Task = NAVIGATION (Sprint→Task→coveredRequirements), NOT chain.
- NEVER ASSUME — ALWAYS MEASURE. Use FULL uuids (8-char prefix collisions are real). grep -rl (not find -exec). Simple Bash commands (no `cd &&`/`for`/`$()` compounds → guardrail denies). git add explicit paths (shared shell), `git reset -q HEAD` first.
- ★ My LAWS L1-L9 → `learnings.md` (## ARCHITECT LAWS). Record fundamental laws as I produce them (Phase-1 discipline; post-wall unreconstructable).

## CURRENT WORK

### S37 — Real-time MVC over scenario-units (design ACCEPTED, awaiting build-go)
- Design: `sprint-37-consistency-by-construction/design-s37-realtime-mvc-over-units.md` (510954b4b + 216bd1685 seq).
- FAMILY = MVC-BY-CONVENTION (L4): (a) TWO buses `trace/ViewBus.ts`(ref-keyed, item+detail) + `ViewBus.ts`(classType/uuid, Profile/Room); (b) notify remembered-by-hand → stale; (c) DnD ad-hoc 4 formats.
- ★ EXPERT VERIFIED (different lens, all 4 confirmed): there IS an intended sole-writer **`UnitController.apply` (unit-controller.ts:41, emit=step-4)** but **~15 writes BYPASS it** (server.ts idx.put ×10 [281/296/355/375/530/1533/1544/1548/1789/2050] + EmailIndex.ts:68,71 + agent-message.ts:68,77,103 + skills.ts:59) = THE defect. ⇒ Slice-1 = ROUTE bypassers THROUGH the existing UnitController.apply (reuse, don't rebuild) + no-mutation-outside-seam grep-lint.
- PO-RATIFIED BUILD SEQUENCE: (1) one-controller seam + retire 2nd bus → (2) subscribe-on-render coverage+gate → (3) T37.20 DnD contract THROUGH controller. (T37.20 acceptance "drop→views live" DEPENDS on 1+2.) INV-T every slice: render READ-ONLY, controller SOLE writer, byte-diff==0.
- req MINTED 4 UCs (45332207f), class/method=null → **I WIRE Class/Method on build-go**: `mvc.applyMutation 3ee364a5-472f-44f2-bc1b-79df494b2f0f`→R37.11; `mvc.subscribeOnRender 6aac0acf-23f9-4e67-a2e1-9f9633e101ff` + `mvc.consolidateOneBus e530e248-8535-4bcf-b984-be916cc0aa9a`→R37.12; `dnd.resolveDropPayload e3fcf5b3-1f1b-4c5e-9cf1-3cfff34d75ac`→R37.20 (sibling of carryUnitPayload 5474886a). NEXT: on build-go per cluster → wire ahead, backstop each slice vs design, flip Impl BUILT.

### S40 — server-manager (backstop-only; expert drives deploys, do NOT touch prod)
- **T40.11 depref-migration SPLIT** (674d77fa1, `design-r40.11-depref-migration-split.md`): Slice-1 = NEW `src/ts/server/DeploymentModel.ts` `buildTypedModel(node)` PURE fn → 5 typed units per closed reconcile rule (Service+ConfigFile split/KeyFile/EnvValue/Certificate), reuse M2 0022-0033; lands marker e009ace7 → closes T40.11 inc-1 + unblocks T40.6. CHOKEPOINT FLAG: mint/array-remove touch ScenarioIndex.put → expert HOLDS for my confirm.
- **R40.39 type-index** (99f2a9d55, `design-type-index-feature-archaeology.md`): 29 corpus types vs 18 folders = 11 missing (feature/**testcase-1023**/profile/webitem/gate/modelelement/relationship genuine; company/email/phone alt-indexed, config singleton). FIX = ONE type-strategy registry {typeIndexed|altIndexed|singleton} declared-not-defaulted + ScenarioIndex.byType + generic-template-fallback + gate FAILS on undeclared/corpus-walked. req reframing R40.39 capture-only-do-NOT-execute (waits Tron scheduling). bootstrapSeed corpus-walk dies free once byType exists.
- **bootstrapSeed ruling CORRECTED** (99f2a9d55): my "45s block" RETRACTED — measured boot 1.3s, full scan 0.1s; 45s was a broken TLS probe. The real defect is R40.39 structural, not perf.

### S37 rulings 2026-08-17 (commits 5bf98afb6 + 5569f0509)
- SLICE-1 FORK = **bounded-(A)**: apply DEFAULT shallow-merges intent→model (INV-T byte-diff==0, get()-rereads-disk so mutation must happen INSIDE apply), guard merge model.* only never uuid/ior/ownerIor. But default-allow is a default-deny→allow shift: generic merge INTERNAL-only; agent endpoint NARROW status-only refuses-Done; per-ior mutable-field allow-list = phase-2 NAMED-not-deferred. UnitController.create() distinct (not upsert), shares _write(put+emit). 6 mutate→apply, 9 create→create.
- AGENT-WRITE TRANSPORT (measured): emit=BROADCAST-ALL (server.ts:1793 wsClients.forEach, not per-session — agent change reaches ALL browsers); NO fs.watch (direct file-write never emits → skill MUST go server HTTP→UnitController→emit→WS, not file); no general task-status route (mint NARROW POST /api/task/<uuid>/status refuses-Done); auth=reuse owner-gate no-literal B1-parked; current/next DERIVED (R40.18).
- SPRINT-NAME DRY (Tron ONE-attribute, commit 5569f0509, design-s37-sprint-name-single-source.md): number stored in a FAN (task: sprintName+slug+title+parent; sprint: number+name+slug+dir) → ONE source=Sprint model.number; task derives via parent, DELETE task.sprintName field; dir=consistency-gate not truth; TASK numbering=SAME family (taskDisplayName from parent.sprintNumber+task.taskIndex); item-view DUP bug rb-object-item.ts:188 (desc=desc||title repeats name). It's R40.4-phase-2 (extend sprint-label.ts atom+check-sprint-label.ts gate). req minting 2 units widened-scope.

## POSTURE / NEXT
- Backstop-only on inc-3/deploys (expert drives; don't touch prod). Prod ~v0.8.9x.
- Await: S37 build-go (wire the 4 UCs + backstop slices); T40.11/R40.39 build-go; Tron device visuals. Nothing multi-step pending.
