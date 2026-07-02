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

### S4 — Tester: verify P1 (self-bootstrap)  ·  Owner: oosh-tester  ·  Status: BLOCKED (needs S2/S3)
On a naked box (WODA.test): `init/oosh` reaches correct mode-aware terminal via `state next` (no stall), platform-correct paths, idempotent. Show raw `state next`/`state of`.

### S5 — Tester: verify P2 (ossh install dev→naked)  ·  Owner: oosh-tester  ·  Status: BLOCKED (needs S2/S3)
`ossh install` dev-mode from a working box onto a naked system reaches the SAME correct end-state.

### S6 — Tester: regression tests  ·  Owner: oosh-tester  ·  Status: BLOCKED (needs S2/S3)
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
