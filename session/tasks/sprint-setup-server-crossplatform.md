# Sprint: SETUP_SERVER cross-platform + state-machine correctness

**Owner (PO)**: oosh-po@MacStudio · **Created**: 2026-07-02 (Tron-directed)
**Single source of truth** (SPRINT-COMMS): stories below carry Status/Owner/inline report-back. Git mailbox = channel. Tick as commits land.

## Branch model (Tron 2026-07-02 — governs this sprint)
- **`dev` = the OS-INDEPENDENT master dev.** Cross-platform truth lives here. This sprint (esp. D3 platform-derived defaults) is exactly the work of *making dev os-independent* → **do this sprint on `dev`.**
- **`macos.latest` = the platform-specific dev.** Latest features land here first, then get generalized → flow **down into `dev`** as platform-independent.
- Direction of flow: feature → macos.latest (platform-specific) → made platform-independent → **dev (master)**. So "promote" is NOT dev→macos.latest; dev is the master. The init-constructor + this work being on dev is correct.

## Goal

A naked system reaches a **correct, mode-aware, platform-appropriate** oosh installation via BOTH install paths — with ALL install/branch logic in the **`oo`** custom script (the one that runs the SETUP_SERVER machine), and **ZERO edits to the `state` engine** (Tron hard constraint). Install locations are **derived from platform defaults**, never hardcoded.

## The two install paths (both must drive SETUP_SERVER to the same correct end-state)

- **P1 — self-bootstrap**: download + execute `init/oosh(.sh)` as the ONLY script; it does the rest on a naked system.
- **P2 — remote install**: `ossh install` from a WORKING oosh box → installs **dev mode** onto a naked remote system.

## Defects to fix (input: tester diagnosis 703b817, live on WODA.test)

- **D1 — state ordering**: `user.installation.done` [21] is mis-indexed BEFORE its prerequisites `user.mode.release` [22] / `user.mode.dev` [23]. A user install cannot be "done" before a mode is chosen. Correct order: `user.rights.only (20) → [mode branch: release XOR dev] → user.installation.done`. Genuine user terminal on a dev box = `user.mode.dev`, not 21.
- **D2 — XOR branch dead-ends**: `user.mode.release`/`user.mode.dev` are a mutually-exclusive XOR modeled as two SEQUENTIAL states. `state next` always hits release first; on a dev box its check fails with NO redirect to dev → machine STALLS at 21, un-traversable linearly (only `state set` bypasses). Fix: the mode `private.check.*` must **redirect on active `OOSH_MODE`** (return the matching mode state's index — the redirect pattern the engine already supports) so `state next` crosses the XOR.
- **D3 — platform-hardcoded defaults**: init defaults bake in platform-specific paths (`/Users/Shared…` macOS, `/home/shared`, `/var/dev` linux). OOSH is cross-platform → **derive best locations from platform defaults in config init**, especially for **(a) OOSH component modes** and **(b) odocker workspaces**. Use existing `os` detection; no per-call hardcoding.

## How the state machine works (constraint reminder — read carefully before designing)

- `state` = engine (add/next/set/of/list). States persist in `~/config/stateMachines/SETUP_SERVER.states.env` as an indexed bash array; `NN` entries are jump/transition pointers.
- The CUSTOM script (`oo`) implements `private.check.<statename>()` hooks. On transition the engine calls the target state's check, which can **accept** (return its own index), **redirect** (return a different index — this is how XOR/branch is done), or **fail/hold**.
- **We fix branch logic + ordering by editing `oo`'s checks and the state-add order `oo` declares — NOT the `state` engine.**

## Stories

### S1 — Architect: design (careful read → WHAT/WHY)  ·  Owner: oosh-architect  ·  Status: ✅ PO-APPROVED (f4aea76)
**PO QA (oosh-po@MacStudio 2026-07-02): APPROVED.** Zero state-engine edits (XOR via existing numeric-RESULT redirect, mirrors proven privilege branch oo:631-646); DRY+reorder-proof (`state.find` for indices, `os check.env` for bases — no literals); D2 traces converge on user.installation.done for BOTH OOSH_MODE values; D3 hardcodes located (oo:218, odocker:14) + single derivation in config init as pure-state exports. Cleared to implement.
report-back: design delivered in-file (§ S1 DESIGN). Measured ground truth from `state`, `oo` SETUP_SERVER, `init/oosh`, `ossh`. Ready for PO QA → then S2/S3. commit: 96edb4a.
Read carefully: `state` engine, `oo`'s SETUP_SERVER definition (state-add order + all `private.check.*`), `init/oosh` (P1 bootstrap), `ossh install` (P2). Produce a design doc covering:
1. Corrected state order (mode branch before `user.installation.done`) — expressed as `oo`'s state-add sequence.
2. XOR redirect mechanism — how the mode checks return the active-`OOSH_MODE` index so `state next` crosses release⊕dev.
3. **Platform-default derivation** strategy (via `os` detection) for component modes + odocker workspaces — the single place defaults are computed, consumed by both paths.
4. How **P1 and P2** each drive SETUP_SERVER to the SAME correct terminal (per privilege: user-mode terminal vs full root/server terminal).
Deliver design to this file. No code.

### S2 — Expert: state order + XOR redirect in `oo`  ·  Owner: oosh-expert  ·  Status: ✅ DONE (`566fed9`) — awaiting tester
Implement corrected state-add order + mode-check redirect-on-`OOSH_MODE` in `oo`. NO `state` engine edits. `bash -n` clean.
**report-back (expert `566fed9`)**: All in `oo`, zero `state`-engine edits, `bash -n` clean.
- **D1** reorder (oo:570-575): `[20] user.rights.only · [21] user.mode.release · [22] user.mode.dev · [23] user.installation.done` — done now AFTER the mode branch.
- **D2** both mode checks rewritten to ALWAYS return 0 + steer via numeric RESULT (returning 1 was the stall). Indices resolved dynamically with `state.find SETUP_SERVER <name> id` (measured live: echoes clean numeric, e.g. `23`) — NO hardcoded 21/22/23, survives reorder. release-arm: `released`→accept, else redirect→`find(user.mode.dev)`. dev-arm: `dev`→accept, else redirect→`find(user.installation.done)`. Mirrors the proven privilege redirect (oo:641-656). Both OOSH_MODE values converge on user.installation.done (design §C traces).
- **C.1** single OOSH_MODE derivation seam at the mode-band entry (`private.check.user.rights.only`, [20]): `[ -z "$OOSH_MODE" ] && export OOSH_MODE=released` — P2 already exports `dev` before the machine; naked P1 defaults released. One place, no scattered defaults, no engine edit.
- Verified engine redirect contract live (state.check: check rc 0 + numeric RESULT≠current → `stateFound=$RESULT` jump). **Tester S4/S6: `state next` should cross the XOR for BOTH OOSH_MODE values, no stall at 21.**

### S3 — Expert: platform-default derivation  ·  Owner: oosh-expert  ·  Status: ✅ DONE (`650e743`) — awaiting tester
Replace hardcoded platform paths with os-derived defaults in config init (+ `oo`) for component modes + odocker workspaces.
**report-back (expert `650e743`)**: `bash -n` clean (config, oo, odocker). Verified derivation A/B (darwin→/Users/Shared, linux→/home/shared, override preserved).
- **Single seam in `config.init`**: derive `OOSH_SHARED_BASE` keyed on `$OOSH_OS` → `OOSH_COMPONENTS_DIR` + `ODOCKER_WORKSPACES`. All pure-state exports; OOSH_-prefixed persist via `config save oosh OOSH`→oosh.env. `${VAR:-}` preserves operator/CI overrides.
- **Consumers de-hardcoded**: `oo.mode.base.get` reads `OOSH_COMPONENTS_DIR` (fallback derives from `OOSH_SHARED_BASE`, no `/Users/Shared`); `odocker:14` `:=` derives from `OOSH_SHARED_BASE`. macOS literals dropped.
- **⚠️ One design note for architect/PO**: S1 §D said "keyed on `$OOSH_OS` via os detection." MEASURED ground truth: `os.check.env` has ZERO callers and `OOSH_OS` is empty even in an established donges shell on WODA.test; `os` **auto-dispatches on source** (`os.start "$@"` at tail) so it can't be run in-process, and it doesn't echo OOSH_OS. So I establish `OOSH_OS` from `$OSTYPE` at this ONE seam, mirroring os.check.env's exact patterns (darwin*/linux*/cygwin/msys/freebsd*). If you'd rather add a side-effect-free `os` accessor (e.g. `os os` echoes OOSH_OS) and have config.init consume it, that's a small follow-up — flag me. **Tester T-PLATFORM-DEFAULTS**: assert derived (not hardcoded), correct per platform, override honored.

### S4 — Tester: verify P1 (self-bootstrap)  ·  Owner: oosh-tester  ·  Status: READY (S2+S3 PO-approved)
On a naked box (WODA.test): `init/oosh` reaches correct mode-aware terminal via `state next` (no stall), platform-correct paths, idempotent. Show raw `state next`/`state of`.

### S5 — Tester: verify P2 (ossh install dev→naked)  ·  Owner: oosh-tester  ·  Status: READY (S2+S3 PO-approved)
`ossh install` dev-mode from a working box onto a naked system reaches the SAME correct end-state.

### S6 — Tester: regression tests  ·  Owner: oosh-tester  ·  Status: READY (S2+S3 PO-approved)
T-STATE-ORDER (mode branch precedes done; `state next` crosses XOR on both OOSH_MODE values) + T-PLATFORM-DEFAULTS (derived, not hardcoded; correct per platform).

## S1 DESIGN (oosh-architect, 2026-07-02) — WHAT/WHY only; expert owns HOW

### A. Measured ground truth (how SETUP_SERVER actually works — no assumptions)
- **Indexing (`state.add`, state:704-759):** a numeric state name is a **cursor-jump marker** — `state.add 20` moves the fill-cursor to index 20; subsequent NAMED states fill 21,22,23… until the next numeric marker. So the markers 20/30/40/50/60 = privilege/phase bands.
- **Measured CURRENT order (oo:560-565):** `[20] user.rights.only · [21] user.installation.done · [22] user.mode.release · [23] user.mode.dev · [30]…`  → confirms D1: **done [21] sits BEFORE the mode states [22][23]**.
- **The engine's ONLY branch primitive (`state.check`, state:288-306):** after it calls `private.check.<state>`:
  - check returns **0 (success) AND `RESULT` is numeric ≠ current** → engine does `stateFound=$RESULT` then `state.set` → **JUMP/redirect** (state:293-295).
  - check returns **non-zero (fail)** → `error.log`, **no `state.set`** → machine **HOLDS** at current index.
  - check returns 0 with non-numeric RESULT → accept the natural next index.
- **`state.next` (state:166-209):** `let state++` → `state.find` that index → run its check. Linear unless the check redirects. **We build XOR entirely on the numeric-RESULT redirect above — the engine already supports it; zero engine edits needed.**
- **Privilege branch already uses redirect (`private.check.priviledges.checked`, oo:631-646):** user-only → RESULT `20`; root/sudo → RESULT `30`. Proven pattern we mirror for mode.

### B. D1 — corrected state-add order (in `oo` only)
WHAT — reorder oo:560-565 to put the mode branch BEFORE done:
```
state.add 20
state.add user.rights.only
state.add user.mode.release
state.add user.mode.dev
state.add user.installation.done
state.add 30
```
Yields `[20] user.rights.only · [21] user.mode.release · [22] user.mode.dev · [23] user.installation.done`.
WHY: "installation.done" is the **post-mode** user terminal; it must be unreachable until a mode is chosen. A genuine user terminal on a dev box must resolve to `user.mode.dev`, not a premature "done".

### C. D2 — XOR crossing via redirect-on-OOSH_MODE (in `oo` mode checks)
Root cause of the stall: today both mode checks **return 1 (fail)** when their mode isn't active (oo:695-717) → `state.next` HOLDS → XOR is un-traversable linearly (only `state set` bypasses).

WHAT — rewrite BOTH checks to ALWAYS succeed (0) and steer via numeric RESULT, resolving target indices **dynamically** with `state.find SETUP_SERVER <name>` (never hardcode 21/22/23 — DRY, self-documenting, survives reordering):
- `private.check.user.mode.release`: `OOSH_MODE=released` → accept (own index); `OOSH_MODE=dev` → RESULT=`find(user.mode.dev)` (redirect forward).
- `private.check.user.mode.dev`: `OOSH_MODE=dev` → accept; `OOSH_MODE=released` → RESULT=`find(user.installation.done)` (redirect forward past dev).

WHY — each XOR arm must **redirect-forward on the non-matching mode** so `state.next` converges on `user.installation.done` for BOTH values. Traces (the tester's oracle):
- **dev box:** 20 →next→ 21 release-check(mode=dev)→redirect 22 → 22 →next→ 23 done ✓
- **release box:** 20 →next→ 21 release-check(mode=released)→accept → next→ 22 dev-check(mode=released)→redirect 23 → 23 done ✓
No dead-ends; XOR crossed both ways; single terminal `user.installation.done`.

### C.1 — OOSH_MODE must be DERIVED before the branch (WHY, seam for expert)
The branch is only well-defined if `OOSH_MODE` is set. Requirement (single derivation point, no engine edit):
- **P2 (ossh install):** already forces `OOSH_MODE=dev` in the dev/root install path (oo:946,1002) and threads `DEV_MODE` through `init/oosh`. The **user-privilege** dev terminal must set `OOSH_MODE=dev` from that same DEV_MODE signal.
- **P1 (self-bootstrap, naked box):** default `OOSH_MODE=released` unless `DEV_MODE`/`oo mode.dev` requested.
- Expert seam: derive the default at the **entry of the mode band** (release-check when `OOSH_MODE` empty, or in `user.rights.only`) — ONE place, platform+signal-aware. Architect constraint: no state-engine edit, no scattered defaults.

### D. D3 — platform-derived defaults (via `os` detection, computed once in `config init`)
Measured hardcodes (all macOS literals — break linux/container/termux):
- `oo:218` `oo.mode.base.get` → `"/Users/Shared/Workspaces/AI/Claude/components/OOSH"` (component modes base).
- `odocker:14` `ODOCKER_WORKSPACES` → `"/Users/Shared/Workspaces/AI/Claude.All/DockerWorkspaces"`.
- `oo:942-945, 998-1001` root/dev install → EAMD.ucp tree (already `$dir`-anchored; structural, lower priority).

`os` already exposes the discriminator: `os check.env` → `OOSH_OS` ∈ {darwin, linux-gnu, cygwin, msys, win32, freebsd} (os:65-93).

WHAT — ONE derivation, in `config init`, keyed on `$OOSH_OS`, persisted as **pure-state exports** (aligns with the ENV-PURE-STATE sprint) that both consumers read:
- `OOSH_COMPONENTS_DIR` per-platform default → `oo.mode.base.get` consumes it (drop the literal fallback).
- `ODOCKER_WORKSPACES` per-platform default → odocker consumes it (drop the literal).
WHY — cross-platform correctness + DRY (principle 7): compute once from os detection, consume everywhere; both install paths then land in platform-correct locations. No per-call hardcoding.

### E. D4 — both paths reach the SAME correct terminal (per privilege × mode)
Terminal = **privilege** (which marker band) × flavour = **mode** (release⊕dev within band). Identical SETUP_SERVER definition drives both paths; only two redirects differ the route:
- **P1 self-bootstrap:** user-priv → 20 → user.rights.only → [mode branch] → **user.installation.done** (USER terminal). root/sudo → 30 → root.rights → root.installation.done → 40/50/60 headless/once (**FULL server terminal**).
- **P2 ossh install (dev→naked):** arrives with DEV_MODE→`OOSH_MODE=dev`; SAME machine; root path builds dev worktree (oo:945/1001) → same root terminal in **dev** flavour; user path → user.mode.dev → user.installation.done.
Convergence guaranteed because: privilege redirect (existing, oo:631-646) picks band; mode redirect (new, D2) picks flavour; both bands terminate at their existing done-states. **No path can stall** once the mode checks redirect-forward.

### F. Constraints honored / handoff
- **Zero edits to `state`** — all change in `oo` (state-add order + 2 mode checks) + `config init` (platform defaults). Redirect reuses the engine's existing numeric-RESULT primitive.
- **DRY/self-documenting:** sibling/target indices via `state.find` (no literal indices); platform bases via `os` detection (no literal paths).
- **S2 (expert):** D1 reorder + D2 redirect-on-OOSH_MODE (via `state.find`) + C.1 single mode-derivation seam. `bash -n` clean; no `state` edits.
- **S3 (expert):** os-derived `OOSH_COMPONENTS_DIR` + `ODOCKER_WORKSPACES` in `config init`; `oo.mode.base.get` + `odocker` consume them.
- **S4/S5/S6 (tester):** §C traces + §E convergence are the acceptance oracles; assert `state next` crosses XOR for BOTH `OOSH_MODE` values and paths land platform-correct.

## Sequence
S1 → (S2, S3 parallel) → (S4, S5, S6 parallel) → PO QA gate → Tron promote (dev→macos.latest).

## Rules
- DO NOT modify the `state` script. Fix only `oo` (SETUP_SERVER checks/order) + config init (platform defaults).
- OOSH wrappers only; no output filtering; measure live on WODA.test.
- Architect = WHAT/WHY, Expert = HOW, Tester = verify. Report-back in THIS file + one-line nudge.

---
## PO QA — S2+S3 reviewed (oosh-po@MacStudio 2026-07-02)
- **S2 566fed9 APPROVED** — D1 reorder (done AFTER mode arms), D2 both arms `create.result 0` + `state.find … id` (dynamic, no literal indices), C.1 single OOSH_MODE seam in `user.rights.only`, zero `state`-engine edits. Matches design.
- **S3 650e743 APPROVED (functional)** — single OOSH_SHARED_BASE seam in config.init, pure-state exports, `${VAR:-}` override preserved, oo.mode.base.get + odocker drop macOS literals. Correct on all platforms.
- **Answer to expert's design note (os accessor):** YES, single-source it → **S7** below. Interim inline `$OSTYPE` case is acceptable ONLY because it's guarded by `[ -z "$OOSH_OS" ]` (auto-defers once `os` sets it). Do not duplicate platform truth long-term.
- S4/S5/S6 unblocked → tester.

### S7 — Expert+os-expert: single-source the OS discriminator  ·  Owner: oosh-expert (+os-expert)  ·  Status: ✅ DONE (`19a2a45`) — awaiting tester
The `$OSTYPE → OS` mapping now lives in BOTH `os.check.env` AND `config.init` (S3 interim). Platform truth must have ONE source (the whole point of D3). Make `os` establish `OOSH_OS` as pure state on run (or add a side-effect-free `os` accessor that echoes the discriminator), then `config.init` DROPS its inline `$OSTYPE` case and consumes `$OOSH_OS`. No behavior change (config.init already guards `[ -z "$OOSH_OS" ]`). Add T-OS-DISCRIMINATOR (one source, correct per platform). Does NOT block S4/S5/S6 — tests written now stay valid.
**report-back (expert `19a2a45`)**: Chose the side-effect-free accessor. `bash -n` clean (os, config).
- **`os.os()`** (os:672) — echoes the discriminator via `os.check.env` (which owns the `$OSTYPE→OOSH_OS` case); `info.log` is >3-gated so at default level the only output is the value. Now the mapping has exactly ONE home (`os.check.env`).
- **`config.init`** drops its inline `$OSTYPE` case → `[ -z "$OOSH_OS" ] && export OOSH_OS="$(os os 2>/dev/null)"`. Behavior-identical (still guarded).
- **MEASURED**: isolated fn test darwin→`darwin`, linux→`linux-gnu`; faithful full-checkout bootstrap on WODA.test (cloned real oosh, overlaid os+config) → `os os` = `linux-gnu` clean (the earlier empty was a /tmp scratch-copy artifact, not a dispatch bug). Coordination: I own `os` as oosh-expert (CLAUDE.md); flag os-tester for **T-OS-DISCRIMINATOR**.

## PO QA — S7 reviewed (oosh-po@MacStudio 2026-07-02)
**S7 19a2a45 APPROVED.** `os.os()` runs `os.check.env` (single owner of the $OSTYPE→OOSH_OS mapping) silently + echoes result — side-effect-free for `$(os os)` capture. config.init dropped its inline case → one source of platform truth. Behavior-identical (still `[ -z ]` guarded); measured `os os=linux-gnu` clean on WODA.test. DRY restored. **T-OS-DISCRIMINATOR folded into S6** (oosh-tester assert `os os` yields one correct value per platform + config.init consumes it); os-tester specialist may own a deeper os-script test later.

---
## S4 REPORT-BACK — Tester verify P1 (oosh-tester, LIVE WODA.test/v36421, 2026-07-02, delivered 31e698b = S2 566fed9 + S3 650e743)

**Verdict: S4 core PASS (dev arm) + platform defaults PASS; released arm source-verified (branch-pinned, see F3); 3 findings for PO/expert.**

### Setup
Delivered dev to /home/donges/oosh (root reset --hard origin/dev + chown). Old-order machine from my 703b817 diagnosis persisted → **had to delete it** (`state machine.delete SETUP_SERVER`) to force a naked rebuild. `oo` bootstrap then rebuilt it with the NEW order.

### D1 — new state order (rebuilt machine, `state list`/states.env, idempotent on re-ensure)
```
[20]="user.rights.only" [21]="user.mode.release" [22]="user.mode.dev" [23]="user.installation.done"
```
✅ mode branch now BEFORE `user.installation.done`. Stable across re-ensure (idempotent).

### D2 — XOR crossing via `state next` (RAW)
**DEV arm (OOSH_MODE=dev — the box's actual, branch-derived) — FULLY VERIFIED:**
```
state=user.rights.only(20)
 next#1 → "Going to set … [21] user.mode.release" → WARNING> will overwrite stateFound: 21 with private.check.user.mode.release RESULT=22 → stateValue=user.mode.dev(22)
 next#2 → "Going to set … [23] user.installation.done"                                        → stateValue=user.installation.done(23)
 next#3 → "Going to set … [30] root.rights" → ERROR> did not go well … Something went wrong! → HOLDS at user.installation.done(23)
```
✅ NO STALL. Crosses the XOR (21 release-arm redirects→22 via `state.find`, dynamic index, no hardcode), lands on `user.installation.done`, then correctly HOLDS there because `root.rights`(30) fails for a non-root user. Matches design §C dev trace exactly.

**RELEASED arm — source-verified + mechanism-proven, NOT drivable live here (F3):** check logic (oo:715-745) is correct — `user.mode.release`: released→accept 21 / else→`state.find(user.mode.dev)`; `user.mode.dev`: dev→accept 22 / else→`state.find(user.installation.done)`. Both converge on `user.installation.done`. The redirect PRIMITIVE is proven live (the dev-arm RESULT=22 redirect fired). Could NOT drive the released path end-to-end because **OOSH_MODE is derived from the git branch** (oo:322 `export OOSH_MODE="$branch"`; box on `dev` → OOSH_MODE=dev, un-overridable via export/`config set`/`config save`).

### D3 — platform-derived defaults (from init2 log, live linux box)
```
OOSH_OS="linux-gnu"   OOSH_SHARED_BASE="/home/shared"
OOSH_COMPONENTS_DIR="/home/shared/Workspaces/AI/Claude/components/OOSH"
```
✅ Linux-correct, NOT the macOS `/Users/Shared`. Derived (S3 seam), not hardcoded.

### Idempotent
✅ Re-ensure keeps new order + state at `user.installation.done`; no double-add.

### FINDINGS (do NOT block dev-arm acceptance; PO/expert review)
- **F1 — reorder does NOT migrate existing installs.** `oo` (550-560) rebuilds the machine ONLY when `!machine.exists`; an existing box keeps its OLD-order machine. The D1 fix reaches only *naked* boxes. I had to `state machine.delete` to get the new order. → existing installs need a migration/rebuild path, or a version-bump that forces re-add.
- **F2 — naked P1 self-bootstrap HANGS on a sudo PASSWORD PROMPT.** Rebuilding+driving from scratch runs `priviledges.checked` → `private.test.sudo.priviledges` (oo:662-682) → `$SUDO touch ~/.sudo_as_admin_successful` (oo:668). On a naked box with no cached sudo it **prompts for a password** (`[sudo] password for donges:`) and blocks the unattended bootstrap. Prompt goes to /dev/tty (not the log). Tension with the proven run-as-user/no-sudo fix + Tron's defer-privilege principle: the sudo *capability probe* should be non-interactive (e.g. `sudo -n` and treat failure as "no sudo → user band").
- **F3 — OOSH_MODE is branch-derived and un-overridable per-run** (oo:322). Testing the released arm live needs a release-branch checkout (or an OOSH_MODE override seam). Not a defect per se, but it means the released path can't be exercised on a dev box.

### S5 / S6 status
- **S6 regression tests**: authoring T-STATE-ORDER + T-PLATFORM-DEFAULTS next (this turn / follow-up).
- **S5 (P2 ossh install dev→naked)**: needs a SECOND naked target box + is gated by F2 (sudo prompt during naked bootstrap). Flagging for target availability before I drive it. Will verify once F2's interactivity is resolved or a NOPASSWD target is provided.
Box left: machine at `user.installation.done` (new order), OOSH_MODE=dev (branch). No source changed — diagnostic only.

---
## S6 REPORT-BACK — Tester regression tests (oosh-tester, 2026-07-02) — ✅ DONE, GREEN in BOTH envs
Authored + committed to **dev `9395fca`**: `test/test.setup.server.order` (T-STATE-ORDER, 10 assertions) + `test/test.platform.defaults` (T-PLATFORM-DEFAULTS, 8 assertions).
- **T-STATE-ORDER** — mode branch state-added BEFORE `user.installation.done`; both mode arms always-succeed + redirect via `state.find` (no literal 21/22/23, no `return 1` stall); zero mode-check logic in the `state` engine (Tron constraint); live check parses `states.env` directly (skips stub/legacy machines — no reliance on `machine.exists`, which false-returns 0, or `state.find` as a standalone cmd).
- **T-PLATFORM-DEFAULTS** — `config` derives `OOSH_SHARED_BASE` keyed on `OOSH_OS` (darwin+linux present); override preserved (`${VAR:-}`); `oo.mode.base.get` consumes `OOSH_COMPONENTS_DIR` with **no `/Users/Shared` in code** (comment-aware grep — the fixed body's comment literally says "never a hardcoded /Users/Shared"); `odocker` derives `ODOCKER_WORKSPACES` from `OOSH_SHARED_BASE`; per-platform base correct.
- **VERIFIED GREEN**: (a) MacStudio dev worktree → 10/10 + 8/8; (b) **WODA.test live linux** → 10/10 incl. `live indices ordered: release(21),dev(22) < done(23)` + 8/8 incl. `linux base is /home/shared`. Both the source contract AND the real rebuilt machine confirm D1/D2/D3.
- Tests are self-skipping off-target (stub states file → live check skips; non-dev `oo` → source asserts still valid once the fix flows to macos.latest).

## S5 STATUS — BLOCKED on F2 (+ target), flagged for PO
P2 `ossh install` dev→naked requires (a) a second NAKED target box and (b) resolution of **S4/F2** — the from-scratch naked bootstrap HANGS on `[sudo] password for donges:` (oo:668 `$SUDO touch`, the privilege-capability probe). Until the probe is non-interactive (`sudo -n`) or a NOPASSWD target is provided, P2 to a naked box can't complete unattended. Requesting PO guidance/target. (S4 dev-arm + platform + S6 do not depend on S5.)

---
## PO CALLS on tester findings — oosh-po@MacStudio 2026-07-02
**S4 ✅ PO-APPROVED** (DEV XOR crossing live: 20→21 redirect→22→23, no stall, matches design C; D1 order + D3 linux /home/shared PASS; idempotent).
**S6 ✅ PO-APPROVED** (T-STATE-ORDER 10/10 + T-PLATFORM-DEFAULTS 8/8 GREEN both envs; dev 9395fca).

### F2 — MUST-FIX (blocks S5) → oosh-expert  ·  Status: ✅ DONE (`8be593d`) — unblocks S5
Naked P1 HANGS on interactive sudo password (oo:668 `$SUDO touch`). A naked constructor must NEVER block on a human password (constructor-contract violation). Fix: `sudo -n` (non-interactive) + defer-with-warning if no rights — REUSE the established `oosh_can_escalate`/apt-defer pattern (DRY). And: a USER-mode step must not escalate at all (touch as the user). `bash -n` clean + a T-NO-SUDO-HANG guard.
**report-back (expert `8be593d`)**: `bash -n` clean. Rewrote `private.test.sudo.priviledges` (oo:662):
- **No interactive escalation.** Dropped `$SUDO touch ~/.sudo_as_admin_successful` entirely (it prompted on a naked box AND touched a user-HOME file as root). The probe now: root/`HOME=/root` → 0; Ubuntu marker present → 0 (fast path, read-only, never written as root); else authoritative `command -v sudo && sudo -n true` → 0; else `warn.log` + `create.result 1` (defer to user band). Mirrors init/oosh `oosh_can_escalate` `sudo -n` pattern (DRY — same-scope helper isn't shareable across the POSIX init and oo, so the pattern is mirrored; a kernel `this.canEscalate` could unify both later if PO wants).
- **MEASURED live (WODA.test, donges, no passwordless sudo)**: `timeout 5 sudo -n true` → rc=1 **instantly**, no prompt, no hang → probe returns "deferred". Constructor-contract honored.
- **Tester T-NO-SUDO-HANG**: from-scratch naked bootstrap must reach the user-band terminal with NO `[sudo] password` prompt (assert bounded time / no tty block). S5 unblocked pending a naked target (PO's Docker-container recommendation).

### S8 — F1 existing-install migration (self-heal) → oosh-architect (design) then expert  ·  Status: QA (design delivered — see § S8 DESIGN at end)
D1 reorder only helps NAKED rebuilds; an already-installed box keeps its old-order state file (so WODA.test itself isn't auto-corrected). Per the self-heal principle, re-running the constructor should RECONCILE an existing box's SETUP_SERVER state to the new order. Architect: design the detection (order/version stamp vs current names) + safe rebuild in `private.init.state.machine` — NO `state`-engine edit. Non-blocking for the naked-path gate.
report-back (oosh-architect 2026-07-02): WHAT/WHY in § S8 DESIGN (end of file). Two-tier detect (schema stamp + order-invariant probe) → reconcile-BY-NAME (delete+rebuild shared order + `state.set <savedName>`); pure metadata surgery, NO drive (F2-safe), NO engine edit; WODA.test self-corrects. commit: <pending>.

### F3 — released arm live-verify → oosh-tester  ·  Status: DISPATCHED
Dev arm is live-proven; released arm was only source-verified. Close it: set `OOSH_MODE=released`, run the live crossing (state next from 20 → 21 accept → 22 redirect → 23 done). Fold into S6. Both arms then live-verified.

### S5 — P2 (ossh install → naked) — BLOCKED, needs Tron input
Blocked on (a) F2 fix, (b) a NAKED target box (WODA.test is already installed). PO recommendation to Tron: use a fresh Docker/odocker container as the naked linux target — unblocks P2 AND dogfoods D3 linux-path derivation. Awaiting Tron.

---
## S8 DESIGN (oosh-architect, 2026-07-02) — self-heal reconcile of existing SETUP_SERVER installs (WHAT/WHY)

### A. Measured ground truth (why F1 happens)
- `oo.state` (oo:532-547): on `machine.exists` it only `state of … list` (+ `machine.start` if state<4); it **never re-adds**. The full `state.add` order runs ONLY in `private.init.state.machine`, gated by the `else` (`!machine.exists`). ⇒ an existing box is frozen at whatever order it was first built with — WODA.test included.
- Persisted machine = `$CONFIG_PATH/stateMachines/SETUP_SERVER.states.env`: array `SETUP_SERVER_STATES[idx]=name` + cursor `SETUP_SERVER_STATE_ID`. Names are stable; **indices shift when the order changes** (that is the whole D1 fix).
- Engine verbs usable AS-IS (zero engine edit): `state machine.exists` (state:812), `state machine.delete` (state:1006), `state machine.create` (state:843), `state.add`, `state.set <name>` name→index (state:761-793), `state.of/current` for the cursor. Reconcile is composed entirely from these.

### B. Detection — two-tier (measure, never assume)
**Tier 1 — schema stamp (cheap primary signal; DRY, self-documenting).**
- Constructor declares `SETUP_SERVER_SCHEMA_EXPECTED=<N>` — ONE integer, bumped whenever the `state.add` order changes (D1 was such a change).
- The built machine's schema persists as a **pure-state OOSH_ export** `OOSH_SETUP_SERVER_SCHEMA` (via `config save oosh OOSH` → oosh.env). WHY in oosh.env, not the engine's states.env: keeps the stamp engine-agnostic — no dependency on the engine preserving a custom var across `private.state.machine.update`, hence **no engine edit**, no fragile assumption. (Alt "stamp inside states.env" REJECTED for that reason. Aligns with the ENV-PURE-STATE sprint.)
- On `oo.state` + `machine.exists`: `OOSH_SETUP_SERVER_SCHEMA != EXPECTED` (or **absent** = pre-S8 legacy) ⇒ candidate-stale → run Tier 2.

**Tier 2 — order-invariant probe (ground-truth oracle).**
- Source the persisted states.env read-only; assert the D1 invariant BY NAME: `idx(user.mode.release) < idx(user.mode.dev) < idx(user.installation.done)`. Violation ⇒ **stale** (definitive), regardless of stamp. Exactly what the tester verified by hand (S4/S6 "live indices ordered 21,22<23"); S8 automates it.
- Decision matrix:
  - stamp==EXPECTED **and** invariant holds → fresh, **no-op**.
  - (stamp mismatch/absent) **and** invariant violated → **reconcile** (§C).
  - (stamp mismatch/absent) **but** invariant already holds → **stamp-in-place** (write `OOSH_SETUP_SERVER_SCHEMA=EXPECTED`, no rebuild — cheap upgrade of a legacy-but-correct box).
- Dual gate prevents BOTH missed migrations AND needless rebuilds.

### C. Safe rebuild — reconcile BY NAME (self-heal, F2-safe) — in `oo` only
New `private.reconcile.state.machine`, called from `oo.state`'s exists-branch when Tier 2 says stale:
1. **Capture progress BY NAME** (never index): source states.env → `savedName=${SETUP_SERVER_STATES[$SETUP_SERVER_STATE_ID]}`.
2. **Rebuild in new order**: `state machine.delete SETUP_SERVER` → replay the corrected `state.add` sequence. **DRY hard-requirement:** extract the add-sequence into ONE helper (`private.setup.server.declare`) called by BOTH `private.init.state.machine` (fresh) AND reconcile — single source of truth for the order so the two paths can never diverge.
3. **Restore position BY NAME**: `state.set SETUP_SERVER "$savedName"` → re-resolves to the NEW index. Same logical position, corrected order = the self-heal.
4. **Fallback map** if `savedName` is gone (removed/renamed): rewind to the last band marker (20/30/40/50/60) at-or-before the old position. Conservative — never advance the cursor past unverified states; a safe, idempotent re-drive point.
5. **Stamp**: write `OOSH_SETUP_SERVER_SCHEMA=EXPECTED` (`config save oosh OOSH`).

### D. Boundaries / constraints (WHY these lines are drawn)
- **Reconcile is pure metadata surgery — it does NOT drive** (`state next`). WHY: driving invokes `priviledges.checked` → the sudo probe (F2). Drive-free reconcile CANNOT reintroduce the F2 hang; actual driving stays governed by F2's non-interactive-sudo fix. Clean split: "correct the definition" vs "advance the machine".
- **Idempotent**: after reconcile, stamp==EXPECTED + invariant holds ⇒ next `oo.state` = no-op. delete+rebuild+set-by-name is deterministic; re-running is safe.
- **Zero `state`-engine edit**: composed from existing verbs; detection reads the engine file read-only; stamp lives in oosh config. All new code in `oo`.
- **WODA.test self-corrects**: post-S8, its next `oo state`/`oo update` sees stamp-absent + old-order invariant-violated → reconciles → new order, position preserved by name. Closes F1.

### E. Handoff (expert HOW)
- Extract `private.setup.server.declare` (the ordered `state.add` list) — used by fresh init AND reconcile (DRY; no duplicated order list).
- Add `SETUP_SERVER_SCHEMA_EXPECTED` + `OOSH_SETUP_SERVER_SCHEMA` read/write; two-tier detect in `oo.state`; `private.reconcile.state.machine` (capture-by-name → delete → declare → `state.set name`/marker-fallback → stamp). NO drive inside reconcile. `bash -n` clean; NO `state` edits.
- Tester oracle (fold into S6) — **T-RECONCILE**: seed a box with an OLD-order states.env; after `oo state`, invariant `release<dev<done` holds AND cursor preserved by name; a fresh box is unchanged; re-run = no-op (T-RECONCILE-IDEMPOTENT).
